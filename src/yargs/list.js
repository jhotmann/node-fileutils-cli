const { ListBatch } = require("../list/ListBatch");

module.exports.command = 'list [paths..]';
module.exports.aliases = ['ls', 'lst'];
module.exports.describe = 'Like ls -lAh but for Windows too';

exports.builder = {
  t: {
    boolean: true,
    describe: 'Sort files by modified time',
    conflicts: ['S', 'X']
  },
  S: {
    boolean: true,
    describe: 'Sort files by size',
    conflicts: ['t', 'X']
  },
  X: {
    boolean: true,
    describe: 'Sort files by file extension',
    conflicts: ['S', 't']
  },
  r: {
    alias: 'reverse',
    boolean: true,
    describe: 'List files in reverse order'
  },
  R: {
    alias: ['recursive', 'depth'],
    number: true,
    describe: 'List directory contents recursively to the specified depth (if no depth specified, defaults to 3)'
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