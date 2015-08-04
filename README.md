# practicalmeteor:mocha-core

This is an internal package. Please use [practicalmeteor:mocha](https://atmospherejs.com/practicalmeteor/mocha).

This is a fork of [mike:mocha-core](https://atmospherejs.com/mike/mocha-core) with the following changes:

1. Removed the mocha npm dependency so we can use any mocha version with the server side fibers aware code that mike has created.

2. It includes the source code of server side tests, so it can be displayed in reporters. We will create a PR for this with mike.

This package is used in [practicalmeteor:mocha](https://atmospherejs.com/practicalmeteor/mocha), which was created in order to be able to run mocha tests:

1. From the command line using [spacejam](https://www.npmjs.com/package/spacejam)

2. In the browser, with no dependency on either mongodb nor velocity.
