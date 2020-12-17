const async = require('async');
const fs = require('fs-extra');
const os = require('os');
const path = require('path');

const fu = require('../fu');

jest.setTimeout(30000);

beforeAll(async () => {
  // remove test directory
  await fs.remove('./test/move');
  // create test files/directories
  await fs.ensureDir('test/move');
  await fs.ensureDir('test/move/another-dir');
  await async.times(31, async (i) => {
    if (i === 0) return;
    let num = inWords(i);
    let dir = `${i < 20 ? 'test/move/' : 'test/move/another-dir/'}`;
    let fileName = `${num.trim().replace(' ', '-')}.txt`;
    await fs.writeFile(`${dir}${fileName}`, `file ${num.trim()}`, 'utf8');
  });
});

describe('Rename a single file: rename test/move/one.txt test/move/one-renamed.txt', () => {
  const oldFiles = ['test/move/one.txt'];
  const newFiles = ['test/move/one-renamed.txt'];
  let originalContent;
  beforeAll(async () => {
    await ensureFiles(oldFiles);
    originalContent = await fs.readFile('test/move/one.txt', 'utf8');
    await runCommand('rename test/move/one.txt test/move/one-renamed.txt');
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
  test(`New file has correct content`, async () => {
    const result = await fs.readFile('test/move/one-renamed.txt', 'utf8');
    expect(result).toBe(originalContent);
  });
});

describe('Rename multiple files the same thing with appended index: rename test/move/f*.txt test/move/multiple', () => {
  const oldFiles = ['test/move/four.txt', 'test/move/five.txt', 'test/move/fourteen.txt', 'test/move/fifteen.txt'];
  const newFiles = ['test/move/multiple1.txt', 'test/move/multiple2.txt', 'test/move/multiple3.txt', 'test/move/multiple4.txt'];
  beforeAll(async () => {
    await ensureFiles(oldFiles);
    await runCommand('rename test/move/f*.txt test/move/multiple');
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
});

describe('Rename multiple files the same thing with appended index and file extension specified and sort option: rename test/move/multiple* test/move/twelve.txt test/move/multiple.log', () => {
  const oldFiles = ['test/move/multiple1.txt', 'test/move/multiple2.txt', 'test/move/multiple3.txt', 'test/move/multiple4.txt', 'test/move/twelve.txt'];
  const newFiles = ['test/move/multiple1.log', 'test/move/multiple2.log', 'test/move/multiple3.log', 'test/move/multiple4.log', 'test/move/multiple5.log'];
  let originalContent;
  beforeAll(async () => {
    originalContent = await fs.readFile('test/move/twelve.txt', 'utf8');
    await runCommand('rename --sort reverse-alphabet test/move/multiple* test/move/twelve.txt test/move/multiple.log');
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
  test(`New file has correct content`, async () => {
    const result = await fs.readFile('test/move/multiple1.log', 'utf8');
    expect(result).toBe(originalContent);
  });
});

describe('Rename with variables and filters: rename test/move/two.txt "test/{{p}}/{{f|upper}}.{{\'testing-stuff\'|camel}}"', () => {
  const oldFiles = ['test/move/two.txt'];
  const newFiles = ['test/move/TWO.testingStuff'];
  beforeAll(async () => {
    await ensureFiles(oldFiles);
    await runCommand(`rename test/move/two.txt "test/{{p}}/{{f|upper}}.{{'testing-stuff'|camel}}"`);
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
  test(`New files has correct case`, async () => {
    const files = await fs.readdir('test/move');
    expect(files.indexOf('TWO.testingStuff')).toBeGreaterThan(-1);
  });
});

describe('Force multiple files to be renamed the same: rename test/move/th* test/move/same --no-index --force', () => {
  const oldFiles = ['test/move/three.txt', 'test/move/thirteen.txt'];
  const newFiles = ['test/move/same.txt'];
  beforeAll(async () => {
    await ensureFiles(oldFiles);
    await runCommand('rename test/move/th* test/move/same --no-index --force');
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
  test(`New file has correct content`, async () => {
    const result = await fs.readFile('test/move/same.txt', 'utf8');
    expect(result).toMatch(/^file three.*/);
  });
});

describe('Multiple files to be renamed the same but with keep option: rename test/move/six* test/move/keep --no-index -k', () => {
  const oldFiles = ['test/move/six.txt', 'test/move/sixteen.txt'];
  const newFiles = ['test/move/keep.txt', 'test/move/keep-1.txt'];
  beforeAll(async () => {
    await ensureFiles(oldFiles);
    await runCommand('rename test/move/six* test/move/keep --no-index -k');
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
});

describe('Move a file to a new directory: rename test/move/one-renamed.txt "test/move/another-dir/{{os.platform}}"', () => {
  const oldFiles = ['test/move/one-renamed.txt'];
  const newFiles = [`test/move/another-dir/${os.platform()}.txt`];
  beforeAll(async () => {
    await runCommand('rename test/move/one-renamed.txt "test/move/another-dir/{{os.platform}}"');
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
});

describe(`Don't move a file to a new directory: rename test/move/eight.txt "test/move/another-dir/{{f}}-notmoved" --nomove`, () => {
  const oldFiles = ['test/move/eight.txt'];
  const newFiles = ['test/move/eight-notmoved.txt'];
  beforeAll(async () => {
    await ensureFiles(oldFiles);
    await runCommand('rename test/move/eight.txt "test/move/another-dir/{{f}}-notmoved" --nomove');
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
});

describe(`Rename multiple files to the same date and append index: rename --nomove test/move/seven* "{{ date.current | date('yyyy-MM-dd') }}"`, () => {
  const now = new Date();
  const nowFormatted = `${now.getFullYear()}-${now.getMonth() < 9 ? '0' : ''}${now.getMonth() + 1}-${now.getDate() < 10 ? '0' : ''}${now.getDate()}`;
  const oldFiles = ['test/move/seven.txt', 'test/move/seventeen.txt'];
  const newFiles = [`test/move/${nowFormatted}1.txt`, `test/move/${nowFormatted}2.txt`];
  beforeAll(async () => {
    await ensureFiles(oldFiles);
    await runCommand(`rename --nomove test/move/seven* "{{date.current|date('yyyy-MM-dd')}}"`);
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
});

describe(`Test --noext option: rename test/move/ten.txt "test/move/asdf{{os.user}}" --noext`, () => {
  const oldFiles = ['test/move/ten.txt'];
  const newFiles = [`test/move/asdf${os.userInfo().username}`];
  beforeAll(async () => {
    await ensureFiles(oldFiles);
    await runCommand('rename test/move/ten.txt "test/move/asdf{{os.user}}" --noext', true);
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
  });
  test(`New files do exist`, async () => {
    const result = await async.every(newFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(true);
  });
});

describe(`Rename a mp3 file: rename test/move/music.mp3 --create-dirs "test/move/{{id3.year}}/{{id3.artist}}/{{id3.track|padNumber(2)}} - {{id3.title}}.{{ext}}"`, () => {
  const oldFiles = ['test/move/music.mp3'];
  const newFiles = ['test/move/2019/Scott Holmes/04 - Upbeat Party.mp3'];
  beforeAll(async () => {
    await fs.copyFile('src/test/test_files/Scott_Holmes_-_04_-_Upbeat_Party.mp3', 'test/move/music.mp3');
    await runCommand('rename test/move/music.mp3 --createdirs "test/move/{{id3.year}}/{{id3.artist}}/{{id3.track|padNumber(2)}} - {{id3.title}}{{ext}}"');
  });
  test(`Old files don't exist`, async () => {
    const result = await async.every(oldFiles, async (f) => { return await fs.pathExists(path.resolve(f)); });
    await expect(result).toBe(false);
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

/* eslint-disable eqeqeq */
function inWords (num) {
  let a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  let b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return;
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
  return str;
}

async function ensureFiles(files) {
  await async.each(files, async (f) => {
    await fs.ensureFile(f);
  });
}
