module.exports.command = 'undo';
module.exports.describe = 'Undo the most recent command that hasn\'t already been undone';

exports.builder = {
  v: {
    alias: 'verbose',
    boolean: true,
    describe: 'Verbose logging'
  }
};

exports.handler = async function (argv) {
  console.dir(argv);
};