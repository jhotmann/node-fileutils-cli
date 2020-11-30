const fs = require('fs-extra');

jest.setTimeout(30000);

beforeAll(async () => {
  // remove test directory
  await fs.remove('./test');
  // create test files/directories
  await fs.ensureDir('test');
  await fs.ensureDir('test/another-dir');
  await fs.writeFile('test/hello.txt', 'hello file contents');
  await fs.writeFile('test/somefile.txt', 'somefile file contents');
  await fs.writeFile('test/another-dir/anotherfile.txt', 'anotherfile file contents');
});

describe('Description', () => {
  test(`Stuff`, async () => {
    expect('').toBe('');
  });
});