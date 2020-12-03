const { Options } = require('../common/Options');

module.exports.LinkOptions = class LinkOptions extends Options {
  constructor(argv) {
    super(argv);
    this.soft = this.getValueOrFalse('soft');
    this.simulate = this.getValueOrFalse('sim');
  }
};