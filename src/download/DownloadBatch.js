const chalk = require('chalk');
const database = require('../util/database');
const download = require('download');
const fs = require('fs-extra');
const nunjucks = require('../util/nunjucks');
const path = require('path');
const ProgressBar = require('progress');
const {URL} = require('url');
const { DownloadData } = require('./DownloadData');

module.exports.DownloadBatch = class DownloadBatch {
  constructor(argv) {
    this.argv = argv;
    this.type = 'download';
    this.url = argv.url;
    this.outPathString = argv.outputPath || path.basename(new URL(argv.url).pathname);
    this.inputFilePath = path.parse(path.basename(new URL(argv.url).pathname));
    this.fileData = new DownloadData(this.url);
    this.progressBar;
  }

  async init() {
    this.sequelize = await database.init();
    await this.replaceVariables();
    await this.parseOutputPath();
  }

  async replaceVariables() {
    let data = await this.fileData.get();
    this.outputString = nunjucks.renderString(this.outPathString, data);
  }

  async parseOutputPath() {
    this.outputFilePath = path.parse(path.resolve(this.outputString));
    this.outputFilePath.ext = this.outputFilePath.ext || this.inputFilePath.ext;
    this.outputFileString = `${this.outputFilePath.dir}${path.sep}${this.outputFilePath.name}${this.outputFilePath.ext}`;
    this.alreadyExists = await fs.pathExists(this.outputFileString);
  }

  async execute() {
    await download(this.argv.url, this.outputFilePath.dir, {
      filename: this.outputFilePath.base,
      retry: this.argv.tries,
      maxRedirects: this.argv.maxRedirects
    })
    .on('response', res => {
      if (this.argv.verbose) console.log(`${res.url} - ${res.statusCode}`);
      const len = parseInt(res.headers['content-length'], 10) || 1;
      if (!this.argv.quiet && !this.progressBar) {
        this.progressBar = new ProgressBar('  downloading [:bar] :rate/Kbps :percent :etas', {
          complete: '=',
          incomplete: ' ',
          width: 30,
          total: len/1024
        });
      }
    })
    .on('downloadProgress', progress => {
      if (!this.argv.quiet) this.progressBar.update(progress?.percent ?? 1);
    })
    .catch(err => {
      console.log(chalk`{red ${err}}`);
      process.exit(1);
    });
    if (!this.argv.quiet) console.log('');
    if (this.argv.verbose) console.log(`${this.outputFilePath.base} → ${this.outputFileString.replace(`${process.cwd()}${path.sep}`, '')}`);
    const sequelize = await database.init();
    let batch = sequelize.models.Batch.build({ type: 'download', undoable: true, command: process.argv.slice(2), cwd: process.cwd() });
    await batch.save();
    await sequelize.models.Op.create({
      type: 'download',
      input: this.argv.url,
      output: this.outputFileString,
      BatchId: batch.id
    });
  }
};