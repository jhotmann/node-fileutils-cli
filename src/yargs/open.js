const async = require('async');
const open = require('open');

module.exports.command = 'open <files..>';
module.exports.aliases = ['start', 'launch'];
module.exports.describe = 'Open the specified file(s) or application(s)';

exports.builder = (yargs) => {
  yargs
    .options({
      a: {
        alias: 'app',
        string: true,
        describe: 'Open in the specified app instead of the default application'
      }
    })
    .version(false)
    .example(`$0 open myfile.txt`, 'Open a file in its default application')
    .example(`$0 open myfile.txt --app VSCodium`, 'Open a file in a different application');
};

exports.handler = async function (argv) {
  let options = { wait: false };
  if (argv.app) options.app = argv.app;
  await async.each(argv.files, async (f) => {
    await open(f, options);
  });
};