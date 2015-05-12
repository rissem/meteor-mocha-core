Package.describe({
  name: 'mike:mocha-core',
  summary: "Minimally wrapped mocha",
  version: "0.1.0",
  debugOnly: true,
  git: "https://github.com/rissem/meteor-mocha-core"
});

Npm.depends({
  mocha: "1.17.1",
});

Package.on_use(function (api, where) {
  api.use(['underscore@1.0.3'], ['client', 'server']);
  api.add_files(['server.js'], 'server');
  //TODO export the important Mocha variables
});
