const { Operation } = require('../common/Operation');

module.exports.CopyOperation = class CopyOperation extends Operation {
  constructor(input, options, sequelize) {
    super(input, options, sequelize);
    this.type = 'copy';
  }
};