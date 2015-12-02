var Fiber = Npm.require("fibers");

setupGlobals = function(mocha){

  var mochaExports = {};
  mocha.suite.emit("pre-require", mochaExports, undefined, mocha);

  // 1. patch up it and hooks functions so it plays nice w/ fibers
  // 2. trick to allow binding the suite instance as `this` value
  // inside of suites blocks, to allow e.g. to set custom timeouts.
  var wrapRunnable = function (func) {

    //In Meteor, these blocks will all be invoking Meteor code and must
    //run within a fiber. We must therefore wrap each with something like
    //bindEnvironment. The function passed off to mocha must have length
    //greater than zero if we want mocha to run it asynchronously. That's
    //why it uses the moddedBindEnvironment function described above instead

    //We're actually having mocha run all tests asynchronously. This
    //is because mocha cannot tell when a synchronous fiber test has
    //finished, because the test runner runs outside a fiber.

    //It is possible that the mocha test runner could be run from within a
    //fiber, but it was unclear to me how that could be done without
    //forking mocha itself.


    var wrappedFunction = function (done) {
      var self = this;
      var run = function() {
        try {
          if (func.length == 0) {
            func.call(self);
            done();
          }
          else {
            func.call(self, done);
          }
        } catch (error) {
          done(error);
        }
      };

      if (Fiber.current) {
        return run();
      }
      Fiber(run).run();
    };

    // Show original's function source code
    wrappedFunction.toString = function(){return func.toString()};
    return wrappedFunction;
  };

  global.describe = mochaExports.describe;
  global.describe.skip = mochaExports.describe.skip;
  global.describe.only = mochaExports.describe.only;

  global['it'] = function (name, func){
    // You can create pending tests without a callback
    // http://mochajs.org/#pending-tests
    // i.e pending test
    // it('this is a pending test');
    if (func){
      func =  wrapRunnable(func);
    }
    mochaExports['it'](name, func);
  };
  global.it.skip = mochaExports.it.skip;
  global.it.only = function(name, func) {
    mochaExports.it.only(name, wrapRunnable(func));
  };

  ["before", "beforeEach", "after", "afterEach"].forEach(function(testFunctionName){
    global[testFunctionName] = function (func){
      mochaExports[testFunctionName](wrapRunnable(func));
    }
  });
};