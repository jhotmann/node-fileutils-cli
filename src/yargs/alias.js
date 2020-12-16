const fs = require('fs-extra');
const nunjucks = require('nunjucks');
const os = require('os');
const packageJson = require('../../package.json');
const prefix = require('global-prefix');

module.exports.command = 'alias <subcommand> <command>';
module.exports.aliases = ['a'];
module.exports.describe = 'Alias a subcommand as a global command';

exports.builder = async (yargs) => {
  yargs
    .options({})
    .version(false)
    .example('$0 alias move rename')
    .example('$0 alias download download');
};

exports.handler = async function (argv) {
  const subcommands = await validSubcommands();
  if (subcommands.indexOf(argv.subcommand) > -1) {
    if (os.platform() === 'win32') {
      console.log(`Writing ${prefix}/${argv.command}`);
      await fs.writeFile(`${prefix}/${argv.command}`, nunjucks.renderString(await fs.readFile(`${__dirname}/../alias/alias`, 'utf8'), { packageJson, argv }), 'utf8');
      console.log(`Writing ${prefix}/${argv.command}.cmd`);
      await fs.writeFile(`${prefix}/${argv.command}.cmd`, nunjucks.renderString(await fs.readFile(`${__dirname}/../alias/alias.cmd`, 'utf8'), { packageJson, argv }), 'utf8');
      console.log(`Writing ${prefix}/${argv.command}.ps1`);
      await fs.writeFile(`${prefix}/${argv.command}.ps1`, nunjucks.renderString(await fs.readFile(`${__dirname}/../alias/alias.ps1`, 'utf8'), { packageJson, argv }), 'utf8');
      console.log('You will need to relaunch your cmd/powershell window to use the alias');
    } else {
      console.log(`symlink ${prefix}/lib/node_modules/${packageJson.name}/src/bin/${argv.subcommand}.js to ${prefix}/bin/${argv.command}`);
      await fs.symlink(`${prefix}/lib/node_modules/${packageJson.name}/src/bin/${argv.subcommand}.js`, `${prefix}/bin/${argv.command}`);
    }
  } else {
    console.log(`Invalid subcommand. Valid subcommands are: ${subcommands.join(', ')}`);
  }
};

async function validSubcommands() {
  const bins = await fs.readdir(`${__dirname}/../bin`);
  return bins.map(b => { return b.replace(/\.js/, ''); });
}