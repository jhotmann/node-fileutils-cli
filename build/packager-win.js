#!/usr/bin/env node

const fs = require('fs-extra');
const nunjucks = require('nunjucks');
const packageJson = require('../package.json');

console.log('Generating nuspec file');
let results = nunjucks.render('build/chocolatey/fileutils-cli.nuspec.html', packageJson);
fs.writeFileSync('build/chocolatey/fileutils-cli/fileutils-cli.nuspec', results, 'utf8');
console.log('Preparing folder for packaging');
if (fs.existsSync('build/bin/fileutils-cli.exe')) {
  fs.copyFileSync('build/bin/fileutils-cli.exe', 'build/chocolatey/fileutils-cli/tools/fileutils.exe');
} else {
  console.log('EXE not found!');
  process.exit(1);
}
fs.copyFileSync('license', 'build/chocolatey/fileutils-cli/tools/LICENSE.txt');