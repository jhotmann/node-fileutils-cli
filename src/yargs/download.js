const traverse = require('traverse');

const { DownloadBatch } = require('../download/DownloadBatch');
const { DownloadData } = require('../download/DownloadData');

module.exports.command = 'download <url> [output-path]';
module.exports.aliases = ['d', 'dl', 'get'];
module.exports.describe = 'Extract the specified archive';

exports.builder = (yargs) => {
  yargs
    .options({
      t: {
        alias: 'tries',
        number: true,
        default: 20,
        describe: 'Number of retries. To disable retries, set to 0'
      },
      'max-redirect': {
        alias: 'max-redirects',
        number: true,
        default: 20,
        describe: 'The maximum number of redirections to follow for a resource'
      },
      q: {
        alias: 'quiet',
        boolean: true,
        describe: 'Turn off logging and progress bar'
      },
      v: {
        alias: 'verbose',
        boolean: true
      }
    })
    .version(false)
    .epilogue('Variables:\n\n' + getVariableList())
    .example(`$0 download https://example.com/rname.exe`)
    .example(`$0 download https://example.com/rname.exe test/mv.exe`);
};

exports.handler = async function (argv) {
  let batch = new DownloadBatch(argv);
  await batch.init();
  await batch.execute();
};

function getVariableList() {
  const tempFileData = new DownloadData('https://example.com/somefile.txt');
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
}