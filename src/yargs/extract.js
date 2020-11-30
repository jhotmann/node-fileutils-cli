const async = require('async');
const chalk = require('chalk');
const database = require('../util/database');
const decompress = require('decompress');
const fs = require('fs-extra');
const path = require('path');

module.exports.command = 'extract <file> [output-directory]';
module.exports.aliases = ['e', 'unzip', 'gunzip', 'tar'];
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
      },
      v: {
        alias: 'verbose',
        boolean: true
      }
    })
    .version(false)
    .example(`$0 extract Samples.zip`, 'Extract an archive into a folder with the same name')
    .example(`$0 extract Sameples.zip CustomerSamples --filter .txt .log`, 'Extract an archive into the specified folder and skip extracting certain file types');
};

exports.handler = async function (argv) {
  const exists = await fs.pathExists(argv.file);
  if (!exists) {
    console.log(chalk`{red ${argv.file} does not exist!}`);
    process.exit(1);
  }
  const sequelize = await database.init();
  let batch = sequelize.models.Batch.build({ type: 'extract', undoable: true, command: process.argv.slice(2), cwd: process.cwd() });
  await batch.save();
  const outdir = argv.outputDirectory || argv.file.replace(/\.[A-z]+$/, '');
  let options = { strip: argv.strip };
  if (argv.filter) options.filter = (f) => { return argv.filter.indexOf(path.extname(f.path)) === -1; };
  const files = await decompress(argv.file, outdir, options);
  await async.eachSeries(files, async (f) => {
    const fullPath = path.resolve(path.join(outdir, f.path));
    if (argv.verbose) console.log(fullPath.replace(`${process.cwd()}${path.sep}`, ''));
    if (f.type === 'file') {
      await sequelize.models.Op.create({
        type: 'extract',
        input: path.resolve(argv.file),
        output: fullPath,
        BatchId: batch.id
      });
    }
  });
};