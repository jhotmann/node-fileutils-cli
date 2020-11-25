module.exports.command = 'history [number-to-display]';
module.exports.describe = 'View, undo, re-run, copy, and favorite previously run commands';

exports.builder = {};

exports.handler = async function (argv) {
  console.dir(argv);
};