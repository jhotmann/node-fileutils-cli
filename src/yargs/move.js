const chalk = require('chalk');
const database = require('../util/database');
const util = require('../util/util');

const { MoveOptions } = require('../move/MoveOptions');
const { MoveBatch } = require('../move/MoveBatch');

module.exports.command = 'move [input-files-and-destination..]';
module.exports.aliases = ['m', 'mv', 'rename', 'rname'];
module.exports.describe = 'Move one or more files to the destination pattern';

const commonOptions = require('../common/yargs-options');
const moveOptions = {
  'nomove': {
    alias: 'no-move',
    boolean: true,
    describe: 'Do not move files if their new file path points to a different directory'
  }
};

exports.builder = (yargs) => {
  yargs
    .options(Object.assign(commonOptions, moveOptions))
    .version(false)
    .epilogue('Variables:\n\n' + util.getVariableList())
    .example('$0 *.txt "archive/{{date.now|date}}-{{f}}" --createdirs');
};

exports.handler = async function (argv) {
  if (argv.inputFilesAndDestination && argv.inputFilesAndDestination.length > 1) {
    const sequelize = await database.init();
    const options = new MoveOptions(argv);
    await options.validateInputFiles();
    if (options.inputFiles.length > 0 && options.outputPattern) {
      let batch = new MoveBatch(argv, options, sequelize);
      await batch.complete();
    } else {
      console.log(chalk`{red ERROR: None of the input files specified exist}`);
    }
  } else if (!argv.inputFilesAndDestination || argv.inputFilesAndDestination.length === 0) {
    console.log('TODO');
  } else {
    console.log(chalk`{red ERROR: Not enough arguments specified. Type fileutils move --help for help}`);
  }
};