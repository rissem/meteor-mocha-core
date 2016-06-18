# practicalmeteor:mocha-core

This is an internal package. Please use one of the following test driver packages:

## Meteor pre-1.3

* [practicalmeteor:mocha](https://atmospherejs.com/practicalmeteor/mocha) Runs client and server code tests and displays all results in a browser. Use [spacejam](https://www.npmjs.com/package/spacejam) for command line / CI support.

## Meteor 1.3+

Choose the one that makes sense for your app. You may depend on more than one.

* [practicalmeteor:mocha](https://atmospherejs.com/practicalmeteor/mocha) Runs client and server package or app tests and displays all results in a browser. Use [spacejam](https://www.npmjs.com/package/spacejam) for command line / CI support.
* [dispatch:mocha-phantomjs](https://atmospherejs.com/dispatch/mocha-phantomjs) Runs client and server package or app tests using PhantomJS and reports all results in the server console. Can be used for running tests on a CI server. Has a watch mode.
* [dispatch:mocha-browser](https://atmospherejs.com/dispatch/mocha-browser) Runs client and server package or app tests with Mocha reporting client results in a web browser and server results in the server console. Has a watch mode.
* [dispatch:mocha](https://atmospherejs.com/dispatch/mocha) Runs server-only package or app tests with Mocha and reports all results in the server console. Can be used for running tests on a CI server. Has a watch mode.
