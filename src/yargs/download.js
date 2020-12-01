const chalk = require('chalk');
const database = require('../util/database');
const download = require('download');
const path = require('path');
const {URL} = require('url');

module.exports.command = 'download <url> [output-directory]';
module.exports.aliases = ['d', 'dl', 'get'];
module.exports.describe = 'Extract the specified archive';

exports.builder = (yargs) => {
  yargs
    .options({
      f: {
        alias: 'filename',
        string: true,
        describe: 'override the file name of the downloaded file'
      },
      v: {
        alias: 'verbose',
        boolean: true
      }
    })
    .version(false)
    .example(`$0 download `, '')
    .example(`$0 download `, '');
};

exports.handler = async function (argv) {
  const outDir = argv.outputDirectory ?? '.';
  let options = {
    filename: path.basename(new URL(argv.url).pathname)
  };
  if (argv.filename) options.filename = argv.filename;
  await download(argv.url, outDir, options)
    .on('downloadProgress', progress => {
      console.log(progress);
    })
    .catch(err => {
      console.log(chalk`{red ${err}}`);
      process.exit(1);
    });
  const fullPath = path.resolve(outDir, options.filename);
  if (argv.verbose) console.log(fullPath.replace(`${process.cwd()}${path.sep}`, ''));
  const sequelize = await database.init();
  let batch = sequelize.models.Batch.build({ type: 'download', undoable: true, command: process.argv.slice(2), cwd: process.cwd() });
  await batch.save();
  await sequelize.models.Op.create({
    type: 'download',
    input: argv.url,
    output: fullPath,
    BatchId: batch.id
  });
};