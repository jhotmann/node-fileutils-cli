const async = require('async');
const clipboardy = require('clipboardy');
const util = require('../util/util');

module.exports.command = 'hash <files..>';
module.exports.aliases = ['md5', 'sha1', 'sha256', 'sha512'];
module.exports.describe = 'Get the hash of the specified file(s)';

exports.builder = (yargs) => {
  yargs
    .options({
      c: {
        alias: 'copy',
        boolean: true
      }
    })
    .version(false)
    .epilogue('Aliases:\n  Use any of the following aliases in place of the hash command to use that algorithm instead: sha1, sha256, sha512, md5 (default)')
    .example(`${yargs.$0} hash myfile.txt`)
    .example(`${yargs.$0} sha256 -c myfile.txt`);
};

exports.handler = async function (argv) {
  const algorithm = argv._[0] === 'hash' ? 'md5': argv._[0];
  await async.eachSeries(argv.files, async (f) => {
    const hash = await util.fileHash(f, algorithm);
    console.log(`${hash}${argv.files.length > 1 ? `  ${f}` : ''}`);
    if (argv.copy) await clipboardy.write(hash);
  });
};