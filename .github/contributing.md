# Contributing

Thanks for taking the time to help make FileUtils even better! Please follow the guidelines below if you wish to submit issues or add functionality to FileUtils.

## Setting up your dev environment

1. Install Node 14 or later https://nodejs.org/en/download/
1. Install git https://git-scm.com/downloads
1. Install VSCode and the ESLint extension (optional, but recommended)
    - https://code.visualstudio.com/Download
    - https://vscodium.com/ (fully FOSS version)
1. Fork and clone the node-fileutils-cli repo to your local machine
1. `cd` into the `node-fileutils-cli` directory and run `npm install`

## Adding tests

Going forward, when adding functionality or making fixes, unit tests must be added if they don't already exist for the functionality. These tests exist in `src/tests/*.test.js`.

The test files should create a `test` directory with all the files needed for testing. Follow existing examples for guidance.

After you have added your test(s), you can then run `npm test` from the root directory of the project. If all the tests are passing you can then commit, push, and create a pull request.