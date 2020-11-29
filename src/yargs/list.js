const { ListBatch } = require("../list/ListBatch");

module.exports.command = 'list [paths..]';
module.exports.aliases = ['ls', 'lst'];
module.exports.describe = 'Like ls -lAh but for Windows too';

exports.builder = {
  r: {
    alias: 'reverse',
    boolean: true,
    describe: 'List files in reverse order'
  },
  R: {
    alias: 'recursive',
    boolean: true,
    describe: 'List directory contents recursively'
  },
  'ignore-case': {
    boolean: true,
    describe: 'Ignore case with your supplied paths'
  }
};

exports.handler = async function (argv) {
  let batch = new ListBatch(argv);
  await batch.resolvePaths();
};