const { Options } = require('../common/Options');

module.exports.MoveOptions = class MoveOptions extends Options {
  constructor(argv) {
    super(argv);
    this.keep = this.getValueOrFalse('k', 'keep');
  }
};