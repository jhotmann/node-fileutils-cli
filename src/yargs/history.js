const database = require('../util/database');

const { History } = require('../common/History');

module.exports.command = 'history [number-to-display]';
module.exports.aliases = ['h'];
module.exports.describe = 'View, undo, re-run, copy, and favorite previously run commands';

exports.builder = {
  v: {
    alias: 'verbose',
    boolean: true
  },
  n: {
    alias: 'no-undone',
    boolean: true,
    describe: 'Don\'t include undone operations'
  }
};

exports.handler = async function (argv) {
  let sequelize = await database.init();
  let history = new History(sequelize, argv);
  await history.getBatches();
  await history.display();
};