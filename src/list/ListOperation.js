const { format } = require('date-fns');
const fs = require('fs-extra');
const normalize = require('normalize-path');
const path = require('path');
const trammel = require('trammel');

const util = require('../util/util');

module.exports.ListOperation = class ListOperation {
  constructor(pathObj) {
    this.name = pathObj.name;
    this.fullPath = pathObj.path;
    this.path = pathObj.path.replace(`${normalize(process.cwd())}/`, '');
    this.ext = path.parse(pathObj.path)?.ext.replace('.', '') || '';
    this.bytes = pathObj?.stats?.size ?? 0;
    this.size = util.humanReadableSize(this.bytes);
    this.isFile = pathObj?.dirent?.isFile() ?? true;
    this.isDirectory = pathObj?.dirent?.isDirectory() ?? false;
    this.isLink = pathObj?.dirent?.isSymbolicLink() ?? false;
    this.mdate = pathObj?.stats?.mtime ?? new Date();
    this.mtimeMs = pathObj?.stats?.mtimeMs ?? 0;
  }

  async getDirectorySize() {
    if (this.isDirectory) {
      this.bytes = await trammel(this.fullPath, {type: 'raw'});
      this.size = util.humanReadableSize(this.bytes);
    }
  }

  setSize(paddedSize) {
    this.size = paddedSize;
  }

  /*
  -rw-r--r--    1 jhotmann  staff   521B Nov 26 10:12 .eslintrc.json
  drwxr-xr-x   15 jhotmann  staff   480B Nov 28 08:34 .git
  */

  async print() {
    let text = '';
    text += this.isDirectory ? 'd' : '-';
    try {
      await fs.access(this.path, fs.constants.R_OK);
      text += 'r';
    } catch (e) {
      text += '-';
    }
    try {
      await fs.access(this.path, fs.constants.W_OK);
      text += 'w';
    } catch (e) {
      text += '-';
    }
    try {
      await fs.access(this.path, fs.constants.X_OK);
      text += 'x';
    } catch (e) {
      text += '-';
    }
    text += '  ';
    text += this.size;
    text += '  ';
    text += format(this.mdate, 'MMM dd hh:mm');
    text += '  ';
    text += this.path;
    console.log(text);
  }
};