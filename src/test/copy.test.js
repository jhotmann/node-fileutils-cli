const async = require('async');
const fs = require('fs-extra');
const path = require('path');
const util = require('../util/util');

const commandName = 'copy';
const testDir = 'test/copy';

jest.setTimeout(30000);

beforeAll(async () => {
  // remove test directory
  await fs.remove(testDir);
  // create test files/directory
  await fs.ensureDir(testDir);
});

describe(`Copy a single file: ${commandName} ${testDir}/one.txt ${testDir}/one-copied.txt`, () => {
  const oldFiles = [`${testDir}/one.txt`];
  const newFiles = [`${testDir}/one-copied.txt`];
  let originalContent;
  beforeAll(async () => {
    await util.ensureFiles(oldFiles);
    await fs.writeFile(`${testDir}/one.txt`, `This is the first test`);
    originalContent = await fs.readFile(`${testDir}/one.txt`, 'utf8');
    await util.runCommand(`${commandName} ${testDir}/one.txt ${testDir}/one-copied.txt`);
  });
  test(`Old files do exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
  test(`New file has correct content`, async () => {
    const result = await fs.readFile(`${testDir}/one-copied.txt`, 'utf8');
    expect(result).toBe(originalContent);
  });
});
