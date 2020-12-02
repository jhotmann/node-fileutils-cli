const async = require('async');

const { Batch } = require('../common/Batch');
const { CopyOperation } = require('./CopyOperation');
const { CopyOptions } = require('./CopyOptions');

module.exports.CopyBatch = class CopyBatch extends Batch {
  constructor(argv, options, sequelize) {
    super(argv, sequelize);
    this.options = options || new CopyOptions(argv);
    this.type = 'copy';
    this.operations = this.options.inputFiles.map(f => { return new CopyOperation(f, this.options, this.sequelize); });
  }

  async execute() {
    if (!this.options.simulate && !this.options.noUndo) { // create a batch in the database
      let batch = this.sequelize.models.Batch.build({ type: this.type, undoable: true, command: this.command, cwd: process.cwd() });
      await batch.save();
      this.batchId = batch.id;
    }
    // run the copy operations
    await async.eachSeries(this.operations, async (o) => await o.run(this.batchId));
  }
};