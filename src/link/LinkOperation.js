const { Operation } = require('../common/Operation');

module.exports.LinkOperation = class LinkOperation extends Operation {
  constructor(input, options, sequelize) {
    super(input, options, sequelize);
    this.type = 'link';
  }
};