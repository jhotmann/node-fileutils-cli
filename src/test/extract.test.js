const async = require('async');
const fs = require('fs-extra');
const path = require('path');

const fu = require('../fu');

const commandName = 'extract';
const testDir = 'test/extract';

jest.setTimeout(30000);

beforeAll(async () => {
  // remove test directory
  await fs.remove(testDir);
  // create test files/directory
  await fs.ensureDir(testDir);
});

describe(`Extract a single file: ${commandName} src/test/test_files/Archive.zip ${testDir}`, () => {
  const oldFiles = [`src/test/test_files/Archive.zip`];
  const newFiles = [`${testDir}/2020-12-031.txt`, `${testDir}/2020-12-032.txt`, `${testDir}/another-dir/darwin.txt`, `${testDir}/eleven.txt`];
  beforeAll(async () => {
    await runCommand(`${commandName} src/test/test_files/Archive.zip ${testDir}`);
  });
  test(`Old files do exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
});

// HELPER FUNCTIONS

async function runCommand(command, undo) {
  undo = undo || false;
  if (!undo) command += ' --noundo';
  await fu(command);
}
