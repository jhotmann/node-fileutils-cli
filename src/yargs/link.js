const chalk = require('chalk');
const database = require('../util/database');
const util = require('../util/util');

const { LinkOptions } = require('../link/LinkOptions');
const { LinkBatch } = require('../link/LinkBatch');

module.exports.command = 'link [input-files-and-destination..]';
module.exports.aliases = ['l', 'ln', 'mklink'];
module.exports.describe = 'Create soft or hard links to one or more files';

const commonOptions = require('../common/yargs-options');
const commandOptions = {
  s: {
    alias: 'soft',
    boolean: true,
    describe: 'Create a soft link to the input'
  },
  S: {
    alias: ['sim', 'dry-run'],
    boolean: true,
    describe: 'Simulate and print operations'
  }
};
const options = Object.assign(commonOptions, commandOptions);
module.exports.options = options;

exports.builder = (yargs) => {
  yargs
    .options(options)
    .version(false)
    .epilogue('Variables:\n\n' + util.getVariableList())
    .example('$0 -s /mnt/extra_storage/myfile.config myconfig.config');
};

exports.handler = async function (argv) {
  const sequelize = await database.init();
  if (argv.inputFilesAndDestination && argv.inputFilesAndDestination.length > 1) {
    const options = new LinkOptions(argv);
    await options.validateInputFiles();
    if (options.inputFiles.length > 0 && options.outputPattern) {
      let batch = new LinkBatch(argv, options, sequelize);
      await batch.complete();
    } else {
      console.log(chalk`{red ERROR: None of the input files specified exist}`);
    }
  } else if (!argv.inputFilesAndDestination || argv.inputFilesAndDestination.length === 0) {
    await require('../common/TerminalUI')('link', sequelize);
  } else {
    console.log(chalk`{red ERROR: Not enough arguments specified. Type fileutils move --help for help}`);
  }
};