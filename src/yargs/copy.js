module.exports.command = 'copy [input-files-and-destination..]';
module.exports.aliases = ['c', 'cp', 'cpy'];
module.exports.describe = 'copy one or more files to the destination pattern';

const commonOptions = require('../common/yargs-options');
const copyOptions = {};

exports.builder = (yargs) => {
  yargs
    .options(Object.assign(commonOptions, copyOptions))
    .epilogue('Hello')
    .example('copy asdf asdf');
};

exports.handler = async function (argv) {
  console.dir(argv);
};