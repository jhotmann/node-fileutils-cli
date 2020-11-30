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
      recursive: argv.hasOwnProperty('recursive') ? argv.recursive || 3 : false,
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
      deep: this.options.recursive ? this.options.recursive : 1
    });
    await this.buildOperations();
    const maxSize = [...this.operations].sort((a, b) => {
      if (a.size && a.size.length && b.size && b.size.length) {
        return b.size.length - a.size.length;
      } else return 0;
    })[0].size.length;
    await this.sortOperations();
    await async.eachSeries(this.operations, async (o) => {
      o.setSize(util.leftPad(o.size, maxSize));
      await o.print();
    });
  }

  async getDirectoryCount() {}

  async buildOperations() {
    this.operations = this.resolvedPaths.map(p => { return new ListOperation(p); });
  }

  async sortOperations() {
    if (this.argv.t) {
      this.operations.sort((a, b) => { return b.mtimeMs - a.mtimeMs; });
    } else if (this.argv.S) {
      this.operations.sort((a, b) => { return b.bytes - a.bytes; });
    } else if (this.argv.X) {
      this.operations.sort((a, b) => {
        const extA = a.ext.toLowerCase();
        const extB = b.ext.toLowerCase();
        if (extA < extB) return -1;
        else if (extA > extB) return 1;
        return 0;
      });
    }
    if (this.options.reverse) this.operations.reverse();
  }

  async execute() {}
};