const crypto = require('crypto');
const fs = require('fs-extra');
const traverse = require('traverse');
const { FileData } = require('../common/FileData');

module.exports = {};

module.exports.fileHash = (path, algorithm) => new Promise((resolve, reject) => {
	const hash = crypto.createHash(algorithm);
	const rs = fs.createReadStream(path);
	rs.on('error', reject);
	rs.on('data', chunk => hash.update(chunk));
	rs.on('end', () => resolve(hash.digest('hex')));
});

module.exports.leftPad = function(input, desiredLength, padChar) {
  padChar = padChar || ' ';
  if (typeof desiredLength === 'string') desiredLength = desiredLength.length;
  let returnString = '' + input;
  while (returnString.length < desiredLength) {
    returnString = padChar + returnString;
  }
  return returnString;
};

module.exports.getVariableList = function () {
  const tempFileData = new FileData(__filename, {noIndex: true});
  let defaultVars = tempFileData.getDescriptions();
  return traverse.paths(defaultVars).map(v => {
    if (v.length === 1 && typeof defaultVars[v[0]] !== "object") {
      return '{{' + v[0] + '}}' + ' - ' + defaultVars[v[0]];
    } else if (v.length > 1) {
      let p = v.join('.');
      let value;
      v.forEach(val => {
        if (!value) value = defaultVars[val];
        else value = value[val];
      });
      return '{{' + p + '}}' + ' - ' + value;
    }
  }).filter(v => v !== undefined).join('\n\n');
};

module.exports.humanReadableSize = (bytes) => {
  for (let i = 3; i > -1; i--) {
    if (bytes / Math.pow(1024, i) > 1) {
      let size = `${(bytes / Math.pow(1024, i)).toFixed(1)}`.replace(/\.0+$/, '');
      let digits;
      switch (i) {
        case 3:
          digits = 'G';
          break;
        case 2:
          digits = 'M';
          break;
        case 1:
          digits = 'K';
          break;
        default:
          digits = 'B';
      }
      return `${size}${digits}`;
    }
  }
  return '0B';
};

function escapeText(theString) {
  if (theString.indexOf(' ') > -1 || theString.indexOf('|') > -1) {
    return '"' + theString + '"';
  }
  return theString;
}