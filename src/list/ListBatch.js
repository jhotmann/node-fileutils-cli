const async = require('async');
const globby = require('globby');
const normalize = require('normalize-path');
const util = require('../util/util');

const { ListOperation } = require('./ListOperation');

module.exports.ListBatch = class ListBatch {
  constructor(argv) {
    this.argv = argv;
    this.options = {
      reverse: argv.reverse || false,
      recursive: argv.recursive || false,
      caseSensitive: !(argv.ignoreCase || false)
    };
    this.paths = [];
    this.resolvedPaths = [];
  }

  async resolvePaths() {
    this.paths = await async.mapSeries(this.argv.paths || ['.'], async (p) => { return normalize(p); });
    this.resolvedPaths = await globby(this.paths, {
      onlyFiles: false,
      absolute: true,
      stats: true,
      caseSensitiveMatch: this.options.caseSensitive,
      dot: true,
      deep: this.options.recursive ? Infinity : 1
    });
    await this.buildOperations();
    let maxSize = [...this.operations].sort((a, b) => { return b.size.length - a.size.length; })[0].size.length;
    await async.eachSeries(this.operations, async (o) => {
      o.setSize(util.leftPad(o.size, maxSize));
      await o.print();
    });
  }

  async getDirectoryCount() {}

  async buildOperations() {
    this.operations = this.resolvedPaths.map(p => { return new ListOperation(p); });
  }

  async execute() {}
};