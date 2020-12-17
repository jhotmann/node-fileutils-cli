const async = require('async');
const fs = require('fs-extra');
const path = require('path');
const util = require('../util/util');

const commandName = 'download';
const testDir = 'test/download';

jest.setTimeout(30000);

beforeAll(async () => {
  // remove test directory
  await fs.remove(testDir);
  // create test files/directory
  await fs.ensureDir(testDir);
});

describe(`Download a single file: ${commandName} https://...Upbeat_Party.mp3 ${testDir}/song.mp3`, () => {
  const newFiles = [`${testDir}/song.mp3`];
  beforeAll(async () => {
    await util.runCommand(`${commandName} -q https://github.com/jhotmann/node-fileutils-cli/raw/main/src/test/test_files/Scott_Holmes_-_04_-_Upbeat_Party.mp3 ${testDir}/song.mp3`);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
  test(`New file has correct size`, async () => {
    const stats = await fs.lstat(`${testDir}/song.mp3`);
    expect(stats.size).toBeGreaterThan(5000000);
    expect(stats.size).toBeLessThan(6000000);
  });
});
