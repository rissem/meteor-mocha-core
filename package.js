Package.describe({
  name: 'practicalmeteor:mocha-core',
  summary: "Minimally wrapped mocha",
  version: "0.1.0",
  debugOnly: true,
  git: "https://github.com/rissem/meteor-mocha-core"
});


Package.on_use(function (api, where) {
  api.use(['underscore@1.0.3'], ['client', 'server']);
  api.add_files(['server.js'], 'server');
  api.export("setupGlobals", 'server');
});
