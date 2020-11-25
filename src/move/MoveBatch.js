const async = require('async');

const { Batch } = require('../common/Batch');
const { MoveOperation } = require('./MoveOperation');
const { MoveOptions } = require('./MoveOptions');

module.exports.MoveBatch = class MoveBatch extends Batch {
  constructor(argv, options, sequelize) {
    super(argv, sequelize);
    this.options = options || new MoveOptions(argv);
    this.type = 'move';
    this.operations = this.options.inputFiles.map(f => { return new MoveOperation(f, this.options, this.sequelize); });
  }

  async execute() {
    if (!this.options.simulate && !this.options.noUndo) { // create a batch in the database
      let batch = this.sequelize.models.Batch.build({ type: this.type, command: JSON.stringify(this.command), cwd: process.cwd() });
      await batch.save();
      this.batchId = batch.id;
    }
    // run the move operations
    await async.eachSeries(this.operations, async (o) => await o.run(this.batchId));
  }
};