const async = require('async');
const fs = require('fs-extra');
const globby = require("globby");
const path = require('path');

module.exports.Options = class Options {
  constructor(argv) {
    this.argv = argv;
    this.compiled = (argv['$0'] && ['fu.exe', 'fileutils.exe'].indexOf(argv['$0']) > -1);
    this.force = this.getValueOrFalse('f');
    this.simulate = this.getValueOrFalse('s');
    this.verbose = this.getValueOrFalse('v');
    this.noIndex = this.getValueOrFalse('n');
    this.noTrim = this.getValueOrFalse('notrim');
    this.ignoreDirectories = this.getValueOrFalse('d');
    this.noMove = this.getValueOrFalse('nomove');
    this.createDirs = this.getValueOrFalse('createdirs');
    this.noExt = this.getValueOrFalse('noext');
    this.noUndo = this.getValueOrFalse('noundo');
    this.sort = getSortOption(argv);
    if (argv.inputFilesAndDestination.length > 0) {
      this.inputFiles = [];
      if (argv.inputFilesAndDestination.length > 1) this.outputPattern = argv.inputFilesAndDestination.pop().replace(/^"|"$/g, '');
      else this.outputPattern = '';
      for (const file of argv.inputFilesAndDestination) {
        if (globby.hasMagic(file)) {
          for (const globMatch of globby.sync(file, { onlyFiles: false })) {
            this.inputFiles.push(path.resolve(globMatch));
          }
        } else {
          this.inputFiles.push(path.resolve(file));
        }
      }
    } else {
      this.outputPattern = '';
      this.inputFiles = [];
    }
    this.invalidInputFiles = 0;
  }

  async validateInputFiles() {
    const originalLength = this.inputFiles.length;
    this.inputFiles = await async.filterSeries(this.inputFiles, async (i) => { return (null, await fs.pathExists(i)); });
    if (this.inputFiles.length !== originalLength) {
      this.invalidInputFiles = originalLength - this.inputFiles.length;
      if (this.verbose) console.log(`${this.invalidInputFiles} file${this.invalidInputFiles === 1 ? '' : 's'} will be skipped because ${this.invalidInputFiles === 1 ? 'it does' : 'they do'} not exist`);
    }
  }

  getValueOrFalse(name) {
    if (this.argv.hasOwnProperty(name)) {
      return this.argv[name];
    }
    return false;
  }
};

function getSortOption(argv) {
  let sort = argv.sort || 'none';
  if (sort === 'none') return false;
  if (sortOptions.hasOwnProperty(sort)) {
    return sortOptions[sort];
  }
  return false;
}

const sortOptions = {
  "alphabet": "alphabet",
  "date-create": "date-create",
  "date-modified": "date-modified",
  "size": "size",
  "reverse-alphabet": "reverse-alphabet",
  "reverse-date-create": "reverse-date-create",
  "reverse-date-modified": "reverse-date-modified",
  "reverse-size": "reverse-size"
};

module.exports.sortOptions = sortOptions;