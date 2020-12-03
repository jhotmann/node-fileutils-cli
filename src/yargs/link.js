const chalk = require('chalk');
const database = require('../util/database');
const util = require('../util/util');

const { LinkOptions } = require('../link/LinkOptions');
const { LinkBatch } = require('../link/LinkBatch');

module.exports.command = 'link [input-files-and-destination..]';
module.exports.aliases = ['l', 'ln', 'mklink'];
module.exports.describe = 'Create soft or hard links to one or more files';

const commonOptions = require('../common/yargs-options');
const moveOptions = {
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

exports.builder = (yargs) => {
  yargs
    .options(Object.assign(commonOptions, moveOptions))
    .version(false)
    .epilogue('Variables:\n\n' + util.getVariableList())
    .example('$0 -s /mnt/extra_storage/myfile.config myconfig.config');
};

exports.handler = async function (argv) {
  if (argv.inputFilesAndDestination && argv.inputFilesAndDestination.length > 1) {
    const sequelize = await database.init();
    const options = new LinkOptions(argv);
    await options.validateInputFiles();
    if (options.inputFiles.length > 0 && options.outputPattern) {
      let batch = new LinkBatch(argv, options, sequelize);
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