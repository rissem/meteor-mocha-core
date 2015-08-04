Package.describe({
  name: 'practicalmeteor:mocha-core',
  summary: "Fibers aware mocha server side wrappers.",
  version: "0.1.1",
  debugOnly: true,
  git: "https://github.com/practicalmeteor/meteor-mocha-core.git"
});


Package.on_use(function (api, where) {
  api.use(['underscore@1.0.3'], ['client', 'server']);
  api.add_files(['server.js'], 'server');
  api.export("setupGlobals", 'server');
});
