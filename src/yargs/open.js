const async = require('async');
const database = require('../util/database');
const open = require('open');
const path = require('path');

module.exports.command = 'open <files..>';
module.exports.aliases = ['o', 'start', 'launch'];
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
  let sequelize = await database.init();
  let batch = sequelize.models.Batch.build({ type: 'open', undoable: false, command: JSON.stringify(process.argv.slice(2)), cwd: process.cwd() });
  await batch.save();
  let options = { wait: false };
  if (argv.app) options.app = argv.app;
  await async.each(argv.files, async (f) => {
    await open(f, options);
    await sequelize.models.Op.create({
      type: 'open',
      input: path.resolve(f),
      output: argv.app || 'Default Application',
      BatchId: batch.id
    });
  });
};