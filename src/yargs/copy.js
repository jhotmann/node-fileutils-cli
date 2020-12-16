const chalk = require('chalk');
const database = require('../util/database');
const util = require('../util/util');

const { CopyOptions } = require('../copy/CopyOptions');
const { CopyBatch } = require('../copy/CopyBatch');

module.exports.command = 'copy [input-files-and-destination..]';
module.exports.aliases = ['c', 'cp', 'cpy'];
module.exports.describe = 'Copy one or more files to the destination pattern';

const commonOptions = require('../common/yargs-options');
const copyOptions = {};
const options = Object.assign(commonOptions, copyOptions);
module.exports.options = options;

exports.builder = (yargs) => {
  yargs
    .options(options)
    .version(false)
    .epilogue('Variables:\n\n' + util.getVariableList())
    .example('$0 *.txt "archive/{{date.now|date}}-{{f}}" --createdirs');
};

exports.handler = async function (argv) {
  const sequelize = await database.init();
  if (argv.inputFilesAndDestination && argv.inputFilesAndDestination.length > 1) {
    const options = new CopyOptions(argv);
    await options.validateInputFiles();
    if (options.inputFiles.length > 0 && options.outputPattern) {
      let batch = new CopyBatch(argv, options, sequelize);
      await batch.complete();
    } else {
      console.log(chalk`{red ERROR: None of the input files specified exist}`);
    }
  } else if (!argv.inputFilesAndDestination || argv.inputFilesAndDestination.length === 0) {
    await require('../common/TerminalUI')('copy', sequelize);
  } else {
    console.log(chalk`{red ERROR: Not enough arguments specified. Type fileutils move --help for help}`);
  }
};