const fs = require('fs-extra');
const yargs = require('yargs');
const { ListBatch } = require('../list/ListBatch');

const listCommand = require('../yargs/list');

const commandName = 'list';
const testDir = `test/${commandName}`;

jest.setTimeout(30000);

beforeAll(async () => {
  // remove test directory
  await fs.remove(testDir);
  // create test files/directories
  await fs.ensureDir(testDir);
  await fs.writeFile(`${testDir}/hello.txt`, 'hello file contents');
  await fs.writeFile(`${testDir}/somefile.txt`, 'somefile file contents');
  await fs.writeFile(`${testDir}/anotherfile.txt`, 'anotherfile file contents');
});

describe('List directory contents', () => {
  let batch;
  beforeAll(async () => {
    const argv = yargs.parserConfiguration({ "boolean-negation": false }).command(listCommand.command).options(listCommand.options).parse(`${commandName} ${testDir}`);
    batch = new ListBatch(argv);
    await batch.test();
  });
  test(`Stuff`, async () => {
    expect(batch.operations.length).toBe(3);
  });
});