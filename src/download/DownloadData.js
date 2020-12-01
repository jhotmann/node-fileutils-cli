const os = require('os');
const path = require('path');

module.exports.DownloadData = class DownloadData {
  constructor(url) {
    this.parsedPath = path.parse(path.basename(new URL(url).pathname));
    this.now = new Date();
  }

  async get() {
    return {
      f: this.parsedPath.name,
      fileName: this.parsedPath.name,
      ext: this.parsedPath.ext,
      date: {
        current: this.now,
        now: this.now
      },
      os: {
        homedir: os.homedir(),
        platform: os.platform(),
        hostname: os.hostname(),
        user: os.userInfo().username
      },
      guid: createGuid(),
      customGuid: (format) => { return createGuid(format); }
    };
  }

  getDescriptions() {
    return {
      f: 'The original name of the file. Alias: fileName',
      ext: 'The original file extension of the file',
      date: {
        current: 'The current date/time. Alias: date.now'
      },
      os: {
        homedir: `The path to the current user's home directory`,
        platform: `The operating system platform: 'darwin', 'linux', or 'windows'`,
        user: 'The username of the current user'
      },
      guid: 'A pseudo-random guid'
    };
  }
};

function createGuid(format) {
  format = format || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return format.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
}