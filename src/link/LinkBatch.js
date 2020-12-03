const async = require('async');

const { Batch } = require('../common/Batch');
const { LinkOperation } = require('./LinkOperation');
const { LinkOptions } = require('./LinkOptions');

module.exports.LinkBatch = class LinkBatch extends Batch {
  constructor(argv, options, sequelize) {
    super(argv, sequelize);
    this.options = options || new LinkOptions(argv);
    this.type = 'link';
    this.operations = this.options.inputFiles.map(f => { return new LinkOperation(f, this.options, this.sequelize); });
  }

  async execute() {
    if (!this.options.simulate && !this.options.noUndo) { // create a batch in the database
      let batch = this.sequelize.models.Batch.build({ type: this.type, undoable: true, command: this.command, cwd: process.cwd() });
      await batch.save();
      this.batchId = batch.id;
    }
    // run the link operations
    await async.eachSeries(this.operations, async (o) => await o.run(this.batchId));
  }
};