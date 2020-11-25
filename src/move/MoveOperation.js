const { Operation } = require('../common/Operation');

module.exports.MoveOperation = class MoveOperation extends Operation {
  constructor(input, options, sequelize) {
    super(input, options, sequelize);
    this.type = 'move';
  }
};