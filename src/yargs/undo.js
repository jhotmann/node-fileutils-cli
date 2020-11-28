const chalk = require('chalk');
const database = require('../util/database');

const { History } = require("../common/History");

module.exports.command = 'undo';
module.exports.aliases = ['u'];
module.exports.describe = 'Undo the most recent command that hasn\'t already been undone';

exports.builder = {
  v: {
    alias: 'verbose',
    boolean: true,
    describe: 'Verbose logging'
  }
};

exports.handler = async function (argv) {
  let sequelize = await database.init();
  argv.numberToDisplay = 1;
  argv.noUndone = true;
  argv.onlyUndoable = true;
  let history = new History(sequelize, argv);
  await history.getBatches();
  if (history.batches.length === 0) {
    console.log(chalk`{red No batches found that can be undone}`);
    process.exit(1);
  }
  const lastBatch = history.batches[0];
  if (argv.verbose) console.log(`Undoing '${lastBatch.commandString}' (${lastBatch.Ops.length} operation${lastBatch.Ops.length === 1 ? '' : 's'})`);
  await history.undoBatch(0);
};