module.exports = {
  f: {
    alias: 'force',
    boolean: true,
    describe: 'Forcefully overwrite existing files and create missing directories'
  },
  s: {
    alias: ['sim', 'dry-run'],
    boolean: true,
    describe: 'Simulate and print operations'
  },
  n: {
    alias: ['no-index'],
    boolean: true,
    describe: 'Do not append an index when multiple operations result in the same path'
  },
  k: {
    alias: 'keep',
    boolean: true,
    describe: 'Append a number to file name if file already exists'
  },
  d: {
    alias: ['ignore-dirs'],
    boolean: true,
    describe: 'Do not operate on directories'
  },
  'sort': {
    boolean: false,
    string: true,
    choices: ['none', 'alphabet', 'reverse-alphabet', 'date-create', 'reverse-date-create', 'date-modified', 'reverse-date-modified', 'size', 'reverse-size'],
    default: 'none',
    describe: 'Sort files before running operations'
  },
  v: {
    alias: 'verbose',
    boolean: true,
    describe: 'Verbose logging'
  },
  'notrim': {
    alias: 'no-trim',
    boolean: true,
    describe: 'Do not trim whitespace at beginning or end of ouput file names'
  },
  'noext': {
    alias: 'no-ext',
    boolean: true,
    describe: 'Do not automatically append the original file extension if one isn\'t supplied'
  },
  'createdirs': {
    alias: 'create-dirs',
    boolean: true,
    describe: 'Automatically create missing directories'
  },
  'noundo': {
    alias: 'no-undo',
    boolean: true,
    describe: 'Don\'t write to command history'
  }
};