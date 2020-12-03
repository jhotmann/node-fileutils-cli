#!/usr/bin/env node

const fs = require('fs-extra');
const nunjucks = require('nunjucks');
const packageJson = require('../package.json');
const util = require('../src/util/util');

(async () => {
  const packageHash = await util.fileHash(`${packageJson.name}-${packageJson.version}.tgz`, 'sha256');

  let results = nunjucks.render(`build/homebrew/${packageJson.name}.rb.html`, {
    name: packageJson.name,
    repo: packageJson.repository.url,
    version: packageJson.version,
    sha256: packageHash
  });
  fs.writeFileSync(`build/homebrew/${packageJson.name}.rb`, results, 'utf8');
})();
