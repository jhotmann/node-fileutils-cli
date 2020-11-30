const async = require('async');
const fs = require('fs-extra');

module.exports.command = 'remove <paths..>';
module.exports.aliases = ['r', 'rm', 'rimraf'];
module.exports.describe = 'Like rm -rf but for Windows too';

exports.builder = (yargs) => {
  yargs
    .options({})
    .version(false)
    .example('$0 remove somedir');
};

exports.handler = async function (argv) {
  await async.eachSeries(argv.paths, async (p) => {
    await fs.remove(p);
  });
};