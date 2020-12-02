const { Options } = require('../common/Options');

module.exports.CopyOptions = class CopyOptions extends Options {
  constructor(argv) {
    super(argv);
    // If any options added that are specific to copying add them here
   // this.newOption = this.getValueOrFalse('a', 'abc');
  }
};