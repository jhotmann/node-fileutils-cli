const fs = require('fs-extra');
const os = require('os');
const updateNotifier = require('update-notifier');
const yargs = require('yargs');

const packageJson = require('../package.json');

updateNotifier({ pkg: packageJson, updateCheckInterval: 1000 * 60 * 60 * 24 * 7 }).notify({ isGlobal: true });

module.exports = async (argv) => {
  // create ~/.fu/userData.js if not exist
  const userDataPath = os.homedir() + '/.fu/userData.js';
  await fs.ensureFile(userDataPath).catch(err => { throw err; });
  const userDataContents = await fs.readFile(userDataPath, 'utf8').catch(err => { throw err; });
  if (userDataContents === '') {
    await fs.copyFile(__dirname + '/../lib/userData.js', userDataPath);
  }
  // create ~/.fu/userFilters.js if not exist
  const userFiltersPath = os.homedir() + '/.fu/userFilters.js';
  await fs.ensureFile(userFiltersPath).catch(err => { throw err; });
  const userFiltersContents = await fs.readFile(userFiltersPath, 'utf8').catch(err => { throw err; });
  if (userFiltersContents === '') {
    await fs.copyFile(__dirname + '/../lib/userFilters.js', userFiltersPath);
  }

  if (argv.length === 0) argv = ['help'];

  return new Promise ((resolve, reject) => {
    yargs()
      .parserConfiguration({
        "boolean-negation": false
      })
      .usage(`FileUtils v${packageJson.version}\n\nUsage:\n  $0 <command>`)
      .commandDir('./yargs')
      .help('help')
      .wrap(yargs.terminalWidth())
      .onFinishCommand(resolve)
      .parse(argv);
  });
};
