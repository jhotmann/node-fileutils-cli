const fs = require('fs-extra');

module.exports.command = 'mkdir <path>';
module.exports.aliases = ['mkdirs', 'mkdirp'];
module.exports.describe = 'Like mkdir -p but for Windows too';

exports.builder = (yargs) => {
  yargs
    .options({})
    .version(false)
    .example('$0 mkdir somedir/somechilddir/anotherchilddir');
};

exports.handler = async function (argv) {
  await fs.mkdirp(argv.path);
};