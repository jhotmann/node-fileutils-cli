const chalk = require('chalk');
const database = require('../util/database');
const download = require('download');
const path = require('path');
const ProgressBar = require('progress');
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
      t: {
        alias: 'tries',
        number: true,
        default: 20,
        describe: 'Number of retries. To disable retries, set to 0'
      },
      'max-redirect': {
        alias: 'max-redirects',
        number: true,
        default: 20,
        describe: 'The maximum number of redirections to follow for a resource'
      },
      q: {
        alias: 'quiet',
        boolean: true,
        describe: 'Turn off logging and progress bar'
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
    filename: path.basename(new URL(argv.url).pathname),
    retry: argv.tries,
    maxRedirects: argv.maxRedirects
  };
  if (argv.filename) options.filename = argv.filename;
  let bar;
  await download(argv.url, outDir, options)
    .on('response', res => {
      if (argv.verbose) console.log(`${res.url} - ${res.statusCode}`);
      const len = parseInt(res.headers['content-length'], 10) || 0;
      if (!argv.quiet) {
        bar = new ProgressBar('  downloading [:bar] :rate/Kbps :percent :etas', {
          complete: '=',
          incomplete: ' ',
          width: 30,
          total: len/1024
        });
      }
    })
    .on('downloadProgress', progress => {
      if (!argv.quiet) bar.update(progress?.percent ?? 1);
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