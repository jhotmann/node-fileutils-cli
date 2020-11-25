const fs = require('fs-extra');
const os = require('os');
const yargs = require('yargs');

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

  yargs(argv)
    .commandDir('./yargs')
    .help('help')
    .wrap(yargs.terminalWidth())
    .argv;
};
