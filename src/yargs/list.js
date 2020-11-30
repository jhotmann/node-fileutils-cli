const { ListBatch } = require("../list/ListBatch");

module.exports.command = 'list [paths..]';
module.exports.aliases = ['ls', 'lst'];
module.exports.describe = 'Like ls -lAh but for Windows too';

exports.builder = (yargs) => {
  yargs
    .options({
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
      },
      'calculate-directory-size': {
        alias: 'ds',
        boolean: true,
        default: false,
        describe: 'Recursively calculate the size of all files within a directory'
      }
    })
    .version(false)
    .example('$0 ls', 'List the contents of the current directory')
    .example('$0 ls somedir -R 10 -Sr', 'Recursively list the contents of a subdirectory and sort files smallest to largest');
};

exports.handler = async function (argv) {
  let batch = new ListBatch(argv);
  await batch.execute();
};