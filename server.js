var Fiber = Npm.require("fibers");

setupGlobals = function(mocha){
  //basically a direct copy from meteor/packages/meteor/dynamics_nodejs.js
  //except the wrapped function has an argument (mocha distinguishes
  //asynchronous tests from synchronous ones by the "length" of the
  //function passed into it, before, etc.)
  var moddedBindEnvironment = function (func, onException, _this) {
    Meteor._nodeCodeMustBeInFiber();

    var boundValues = _.clone(Fiber.current._meteor_dynamics || []);

    if (!onException || typeof(onException) === 'string') {
      var description = onException || "callback of async function";
      onException = function (error) {
        Meteor._debug(
          "Exception in " + description + ":",
          error && error.stack || error
        );
      };
    }

    //IMPORTANT note the callback variable present here, for
    //Metoer.bindEnvironment this is ` return function (/* arguments */) {`
    return function (callback) {
      var args = _.toArray(arguments);
      // Apply mocha suite context
      _this = _this || this;

      var runWithEnvironment = function () {
        var savedValues = Fiber.current._meteor_dynamics;
        try {
          // Need to clone boundValues in case two fibers invoke this
          // function at the same time
          Fiber.current._meteor_dynamics = _.clone(boundValues);
          var ret = func.apply(_this, args);
        } catch (e) {
          onException(e);
        } finally {
          Fiber.current._meteor_dynamics = savedValues;
        }
        return ret;
      };

      if (Fiber.current)
        return runWithEnvironment();
      Fiber(runWithEnvironment).run();
    };
  };

  // Wrap mocha hooks and apply mocha suite context
  var wrappedFunc = function (func) {
    //  This is the function that mocha will run
    // the 'this' context is mocha suite context
    return function (callback) {

      if (func.length == 0) {
          func.call(this);
          callback();
        }
        else {
        func.call(this, callback);
        }
      }
    };

  var mochaExports = {};
  mocha.suite.emit("pre-require", mochaExports, undefined, mocha);
  //console.log(mochaExports);

  // 1. patch up describe function so it plays nice w/ fibers
  // 2. trick to allow binding the suite instance as `this` value
  // inside of describe blocks, to allow e.g. to set custom timeouts.
  function wrapRunnable(func) {
    return function() {
      this.toString = function(){return func.toString()};
      // `this` will be bound to the suite instance, as of Mocha's `describe` implementation
      moddedBindEnvironment(func.bind(this), function(err) { throw err; })();
    }
  }

  global.describe = function (name, func){
    return mochaExports.describe(name, wrapRunnable(func));
  };
  global.describe.skip = mochaExports.describe.skip;
  global.describe.only = function(name, func) {
    mochaExports.describe.only(name, moddedBindEnvironment(func, function(err){ throw err; }));
  };

  //In Meteor, these blocks will all be invoking Meteor code and must
  //run within a fiber. We must therefore wrap each with something like
  //bindEnvironment. The function passed off to mocha must have length
  //greater than zero if we want mocha to run it asynchronously. That's
  //why it uses the moddedBindEnivronment function described above instead

  //We're actually having mocha run all tests asynchronously. This
  //is because mocha cannot tell when a synchronous fiber test has
  //finished, because the test runner runs outside a fiber.

  //It is possible that the mocha test runner could be run from within a
  //fiber, but it was unclear to me how that could be done without
  //forking mocha itself.

  global['it'] = function (name, func){

    boundWrappedFunction = moddedBindEnvironment(wrappedFunc(func), function(err){
      throw err;
    });
    // Show original function source code
    boundWrappedFunction.toString = function(){ return func.toString()};

    mochaExports['it'](name, boundWrappedFunction);
  };
  global.it.skip = mochaExports.it.skip;
  global.it.only = function(name, func) {
    mochaExports.it.only(name, moddedBindEnvironment(wrappedFunc(func), function(err){ throw err; }));
  };

  ["before", "beforeEach", "after", "afterEach"].forEach(function(testFunctionName){
    global[testFunctionName] = function (func){

      boundWrappedFunction = moddedBindEnvironment(wrappedFunc(func), function(err){
        throw err;
      });
      mochaExports[testFunctionName](boundWrappedFunction);
    }
  });
}
