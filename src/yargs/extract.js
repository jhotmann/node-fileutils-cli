const decompress = require('decompress');
const path = require('path');

module.exports.command = 'extract <file> [output-directory]';
module.exports.aliases = ['unzip', 'gunzip', 'tar'];
module.exports.describe = 'Extract the specified archive';

exports.builder = (yargs) => {
  yargs
    .options({
      s: {
        alias: 'strip',
        number: true,
        describe: 'Remove the specified number of leading directories from the extracted files',
        default: 0
      },
      f: {
        alias: 'filter',
        array: true,
        describe: 'filter out the specified file extensions from the output (separated by space)'
      }
    })
    .version(false)
    .example(`$0 extract Samples.zip`, 'Extract an archive into a folder with the same name')
    .example(`$0 extract Sameples.zip CustomerSamples --filter .txt .log`, 'Extract an archive into the specified folder and skip extracting certain file types');
};

exports.handler = async function (argv) {
  const outdir = argv.outputDirectory || argv.file.replace(/\.[A-z]+$/, '');
  let options = { strip: argv.strip };
  if (argv.filter) options.filter = (f) => { return argv.filter.indexOf(path.extname(f.path)) === -1; };
  await decompress(argv.file, outdir, options);
};