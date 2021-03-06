const async = require('async');
const chalk = require('chalk');
const database = require('../util/database');
const fs = require('fs-extra');
const got = require('got');
const nunjucks = require('../util/nunjucks');
const path = require('path');
const ProgressBar = require('progress');
const {promisify} = require('util');
const stream = require('stream');
const {URL} = require('url');
const { DownloadData } = require('./DownloadData');

const pipeline = promisify(stream.pipeline);

module.exports.DownloadBatch = class DownloadBatch {
  constructor(argv) {
    this.argv = argv;
    this.type = 'download';
    try {
    this.url = new URL(argv.url);
    } catch (e) {
      console.log(chalk`{red Invalid URL}`);
      process.exit(1);
    }
    this.outPathString = argv.outputPath || path.basename(this.url.pathname);
    this.inputFilePath = path.parse(path.basename(this.url.pathname));
    this.fileData = new DownloadData(this.url.toString());
    this.progressBar;
    this.headers = {};
    this.timeout = {};
    if (argv.timeout) this.timeout = argv.timeout * 1000;
  }

  async parseHeaders() {
    let headersArr = [];
    if (this.argv.hasOwnProperty('header')) {
      if (typeof this.argv.header === 'string') headersArr.push(this.argv.header);
      else headersArr = this.argv.header;
    }
    await async.eachSeries(headersArr, async (h) => {
      if (h.indexOf(':') > -1) {
        const name = h.split(':')[0].trim();
        const value = h.split(':')[1].trim();
        this.headers[name] = value;
      } else if (!this.argv.quiet) {
        console.log(chalk`{red Invalid header format ${h}, name and value must be split by ':'}`);
      }
    });
  }

  async init() {
    if (!this.argv.noundo) this.sequelize = await database.init();
    await this.parseHeaders();
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
    const finalPath = path.format(this.outputFilePath);
    let options = {
      isStream: true,
      retry: this.argv.tries,
      maxRedirects: this.argv.maxRedirects,
      timeout: this.timeout,
      headers: this.headers
    };
    if (this.argv.user) options.username = this.argv.user;
    if (this.argv.pass) options.password = this.argv.pass;
    await fs.mkdirp(this.outputFilePath.dir);
    const downloadStream = got(this.url.toString(), options);
    const fileWriterStream = fs.createWriteStream(finalPath);
    downloadStream.on('response', res => {
      if (this.argv.verbose) console.log(`${res.url} - ${res.statusCode}`);
      const len = parseInt(res.headers['content-length'], 10) || 1;
      if (len < 1000) return;
      if (!this.argv.quiet && !this.progressBar) {
        this.progressBar = new ProgressBar('  downloading [:bar] :rate/Kbps :percent :etas', {
          complete: '=',
          incomplete: ' ',
          width: 30,
          total: len/1024
        });
      }
    }).on('downloadProgress', progress => {
      if (!this.argv.quiet && this.progressBar) this.progressBar.update(progress?.percent ?? 1);
    });
    try {
      await pipeline(downloadStream, fileWriterStream);
    } catch (e) {
      console.log(chalk`{red An error occurred: ${e}}`);
      process.exit(1);
    }
    if (this.argv.verbose) console.log(`\nFile downloaded to ${finalPath.replace(process.cwd() + path.sep, '')}`);
    if (!this.argv.quiet) console.log('');
    if (this.argv.verbose) console.log(`${this.outputFilePath.base} → ${this.outputFileString.replace(`${process.cwd()}${path.sep}`, '')}`);
    if (this.sequelize && !this.argv.noundo) {
      let batch = this.sequelize.models.Batch.build({ type: 'download', undoable: true, command: process.argv.slice(2), cwd: process.cwd() });
      await batch.save();
      await this.sequelize.models.Op.create({
        type: 'download',
        input: this.argv.url,
        output: this.outputFileString,
        BatchId: batch.id
      });
    }
  }
};