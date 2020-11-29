# **WIP** FileUtils-CLI **WIP**
A cross-platform collection of tools for file interactions

This project is the continuation of [node-rename-cli](https://github.com/jhotmann/node-rename-cli) to provide powerful, file-interaction tools with a unified syntax across platforms.

### Features
- Variable replacement and filtering (powered by [Nunjucks](https://mozilla.github.io/nunjucks/templating.html))
- Glob file matching
- Command history with ability to undo entire commands or individual operations and re-run commands
- Ability to save commands as favorites to re-run them quickly
- Customize by adding your own variables and filters
- Auto-indexing when moving/copying multiple files to the same file name

## Usage
`fileutils [command] [command options]`

| Command | Alias(es) | Description |
| ----- | ----- | ----- |
| [copy](#copy-usage) | c, cp, cpy | copy one or more files/directories to a destination (with variable support) |
| download | d, dl, get | download a file from the internet (with variable support) |
| extract | e, unzip, gunzip, tar | extract zip, tar, gzip, and bzip archives |
| favorites | f, favourites | run, view, and edit favorited commands |
| hash | md5, sha1, sha256, sha512 | get the hash of one or more files (use the appropriate alias for the algorithm you need) |
| help |  | view help (works with individual commands as well) |
| history | h | view, undo, re-run, copy, and favorite past commands |
| link | l, ln, mklink | create soft or hard links to one or more files (with variable support) |
| move | m, mv, r, rename | move/rename one or more files/directories (with variable support) |
| open | o, launch, start | open files in their default application or an application of your choice |
| undo | u | undo the last undoable command that hasn't already been undone |

*To save yourself some keystrokes, the `fileutils` command can also be run via the `fu` alias. Additionally, shortcuts to the move and copy commands are created: `rname`, `rename`, and `cpy`. These allow you to bypass the need to type `fu` or `fileutils` to run those commands.*

## Installation
TODO

## Copy Usage

## Download Usage

## Extract Usage

## Favorites Usage

## Hash Usage

## History Usage

## Link Usage

## Move Usage

## Open Usage

## Undo Usage

## Built-in Variables
<details><summary>Commands with variable support allow the destination to contain any number of built-in and custom variables that will be replaced with their corresponding value. Expand for more info.</summary>
<p>

 `{{i}}` Index: The index of the file when renaming multiple files to the same name. If you do no include `{{i}}` in your new file name, the index will be appended to the end. Use the `--noindex` option to prevent auto-indexing.

 `{{f}}` File name: The original name of the file.

 `{{ext}}` File extension: The original extension of the file (with the `.`)

 `{{p}}` Parent directory: The name of the parent directory.

 `{{isDirectory}}` Is directory: true/false. Useful for conditionally adding a file extension to files and not directories with `{% if isDirectory %}...`

 `{{os.x}}` Operating System: Information about the OS/user. Replace `x` with `homedir`, `hostname`, `platform`, or `user`

 `{{date.x}}` Dates: Insert a date. Replace `x` with `current` (the current date/time), `create` (the file's created date/time), `access` (the file's last accessed date/time) or `modify` (the file's last modified date/time)

 `{{g}}` GUID: A pseudo-random globally unique identifier.

 `{{exif.x}}` EXIF: Photo EXIF Information. Replace `x` with `iso`, `fnum`, `exposure`, `date`, `width`, or `height`

 `{{id3.x}}` ID3: Gets ID3 tags from MP3 files. Replace `x` with `title`, `artist`, `album`, `track`, `totalTracks`, or `year`

You can also add your own variables. See the [Customize](#customize) section for more info.

</p>
</details>

## Filters and Examples
<details><summary>You can modify variable values by applying filters. Multiple filters can be chained together. Nunjucks, the underlying variable-replacement engine, has a large number of <a href="https://mozilla.github.io/nunjucks/templating.html#builtin-filters">filters available</a> and Rename-CLI has a few of its own. Expand for more info.</summary>
<p>

String case manipulation
  - `{{f|lower}}` - `Something Like This.txt → something like this.txt`
  - `{{f|upper}}` - `Something Like This.txt → SOMETHING LIKE THIS.txt`
  - `{{f|camel}}` - `Something Like This.txt → somethingLikeThis.txt`
  - `{{f|pascal}}` - `Something Like This.txt → SomethingLikeThis.txt`
  - `{{f|kebab}}` - `Something Like This.txt → something-like-this.txt`
  - `{{f|snake}}` - `Something Like This.txt → something_like_this.txt`

-----

`replace('something', 'replacement')` - replace a character or string with something else.

```sh
rename "bills file.pdf" "{{ f | replace('bill', 'mary') | pascal }}"

bills file.pdf → MarysFile.pdf
```

-----

`date` - format a date to a specific format, the default is `yyyyMMdd` if no parameter is passed. To use your own format, simply pass the format as a string parameter to the date filter. Formatting options can be found [here](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table).

  ```sh
  rename *.txt "{{ date.current | date }}-{{f}}"

  a.txt → 20200502-a.txt
  b.txt → 20200502-b.txt
  c.txt → 20200502-c.txt

  rename *.txt "{{ date.current | date('MM-dd-yyyy') }}-{{f}}"

  a.txt → 05-02-2020-a.txt
  b.txt → 05-02-2020-b.txt
  c.txt → 05-02-2020-c.txt
  ```

  -----

`match(RegExp[, flags, group num/name])` - match substring(s) using a regular expression. The only required parameter is the regular expression (as a string), it also allows for an optional parameter `flags` (a string containing any or all of the flags: g, i, m, s, u, and y, more info [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp#Parameters)), and an optional parameter of the `group` number or name. *Named groups cannot be used with the global flag.*

```sh
rename *ExpenseReport* "archive/{{ f | match('^.+(?=Expense)') }}/ExpenseReport.docx" --createdirs

JanuaryExpenseReport.docx → archive/January/ExpenseReport.docx
MarchExpenseReport.docx → archive/March/ExpenseReport.docx
```

-----

`regexReplace(RegExp[, flags, replacement])` - replace the first regex match with the `replacement` string. To replace all regex matches, pass the `g` flag. `flags` and `replacement` are optional, the default value for replacement is an empty string.

```sh
rename test/* "{{ f | regexReplace('(^|e)e', 'g', 'E') }}"

test/eight.txt → Eight.txt
test/eighteen.txt → EightEn.txt
test/eleven.txt → Eleven.txt
```

-----

`padNumber(length)` - put leading zeroes in front of a number until it is `length` digits long. If `length` is a string, it will use the string's length.

```sh
rename Absent\ Sounds/* "{{id3.year}}/{{id3.artist}}/{{id3.album}}/{{ id3.track | padNumber(id3.totalTracks) }} - {{id3.title}}{{ext}}"

Absent Sounds/Am I Alive.mp3 → 2014/From Indian Lakes/Absent Sounds/05 - Am I Alive.mp3
Absent Sounds/Awful Things.mp3 → 2014/From Indian Lakes/Absent Sounds/07 - Awful Things.mp3
Absent Sounds/Breathe, Desperately.mp3 → 2014/From Indian Lakes/Absent Sounds/03 - Breathe, Desperately.mp3
Absent Sounds/Come In This Light.mp3 → 2014/From Indian Lakes/Absent Sounds/01 - Come In This Light.mp3
Absent Sounds/Fog.mp3 → 2014/From Indian Lakes/Absent Sounds/10 - Fog.mp3
Absent Sounds/Ghost.mp3 → 2014/From Indian Lakes/Absent Sounds/06 - Ghost.mp3
Absent Sounds/Label This Love.mp3 → 2014/From Indian Lakes/Absent Sounds/02 - Label This Love.mp3
Absent Sounds/Runner.mp3 → 2014/From Indian Lakes/Absent Sounds/08 - Runner.mp3
Absent Sounds/Search For More.mp3 → 2014/From Indian Lakes/Absent Sounds/09 - Search For More.mp3
Absent Sounds/Sleeping Limbs.mp3 → 2014/From Indian Lakes/Absent Sounds/04 - Sleeping Limbs.mp3
```

</p>
</details>

## Customize
<details><summary>You can expand upon and overwrite much of the default functionality by creating your own variables and filters. Expand for more info.</summary>
<p>

### Variables
The first time you run the rename command a file will be created at `~/.rename/userData.js`, this file can be edited to add new variables that you can access with `{{variableName}}` in your new file name. You can also override the built-in variables by naming your variable the same. The userData.js file contains some examples.

```js
// These are some helpful libraries already included in rename-cli
// All the built-in nodejs libraries are also available
// const exif = require('jpeg-exif'); // https://github.com/zhso/jpeg-exif
// const fs = require('fs-extra'); // https://github.com/jprichardson/node-fs-extra
// const n2f = require('num2fraction'); // https://github.com/yisibl/num2fraction
// const date-fns = require('date-fns'); // https://date-fns.org/

module.exports = function(fileObj, descriptions) {
  let returnData = {};
  let returnDescriptions = {};

  // Put your code here to add properties to returnData
  // this data will then be available in your output file name
  // for example: returnData.myName = 'Your Name Here';
  // or: returnData.backupDir = 'D:/backup';

  // Optionally, you can describe a variable and have it show when printing help information
  // add the same path as a variable to the returnDescriptions object with a string description
  // for example: returnDescriptions.myName = 'My full name';
  // or: returnDescriptions.backupDir = 'The path to my backup directory';

  if (!descriptions) return returnData;
  else return returnDescriptions;
};
```

The `fileObj` that is passed to the function will look something like this:

```
{
  i: '--FILEINDEXHERE--',
  f: 'filename',
  fileName: 'filename',
  ext: '.txt',
  isDirectory: false,
  p: 'parent-directory-name',
  parent: 'parent-directory-name',
  date: {
    current: 2020-11-25T17:41:58.303Z,
    now: 2020-11-25T17:41:58.303Z,
    create: 2020-11-24T23:38:25.455Z,
    modify: 2020-11-24T23:38:25.455Z,
    access: 2020-11-24T23:38:25.516Z
  },
  os: {
    homedir: '/Users/my-user-name',
    platform: 'darwin',
    hostname: 'ComputerName.local',
    user: 'my-user-name'
  },
  guid: 'fb274642-0a6f-4fe6-8b07-0bac4db5c87b',
  customGuid: [Function: customGuid],
  stats: Stats {
    dev: 16777225,
    mode: 33188,
    nlink: 1,
    uid: 501,
    gid: 20,
    rdev: 0,
    blksize: 4096,
    ino: 48502576,
    size: 1455,
    blocks: 8,
    atimeMs: 1606261105516.3499,
    mtimeMs: 1606261105455.4163,
    ctimeMs: 1606261105486.9072,
    birthtimeMs: 1606261105455.093,
    atime: 2020-11-24T23:38:25.516Z,
    mtime: 2020-11-24T23:38:25.455Z,
    ctime: 2020-11-24T23:38:25.487Z,
    birthtime: 2020-11-24T23:38:25.455Z
  },
  parsedPath: {
    root: '/',
    dir: '/Users/my-user-name/Projects/node-rename-cli',
    base: 'filename.txt',
    ext: '.txt',
    name: 'filename'
  },
  exif: { iso: '', fnum: '', exposure: '', date: '', width: '', height: '' },
  id3: {
    title: '',
    artist: '',
    album: '',
    year: '',
    track: '',
    totalTracks: ''
  }
}
```

### Filters
The first time you run the rename command a file will be created at `~/.rename/userFilters.js`, this file can be edited to add new filters that you can access with `{{someVariable | myNewFilter}}` in your new file name.

One place custom filters can be really handy is if you have files that you often receive in some weird format and you then convert them to your own desired format. Instead of writing some long, complex new file name, just write your own filter and make the new file name `{{f|myCustomFilterName}}`. You can harness the power of code to do really complex things without having to write a complex command.

Each filter should accept a parameter that contains the value of the variable passed to the filter (`str` in the example below). You can optionally include more of your own parameters as well. The function should also return a string that will then be inserted into the new file name (or passed to another filter if they are chained). The userFilters.js file contains some examples.

```js
// Uncomment the next line to create an alias for any of the default Nunjucks filters https://mozilla.github.io/nunjucks/templating.html#builtin-filters
// const defaultFilters = require('../nunjucks/src/filters');
// These are some helpful libraries already included in rename-cli
// All the built-in nodejs libraries are also available
// const exif = require('jpeg-exif'); // https://github.com/zhso/jpeg-exif
// const fs = require('fs-extra'); // https://github.com/jprichardson/node-fs-extra
// const n2f = require('num2fraction'); // https://github.com/yisibl/num2fraction
// const { format } = require('date-fns'); // https://date-fns.org/

module.exports = {
  // Create an alias for a built-in filter
  // big: defaultFilters.upper,
  // Create your own filter
  // match: function(str, regexp, flags) {
  //   if (regexp instanceof RegExp === false) {
  //     regexp = new RegExp(regexp, flags);
  //   }
  //   return str.match(regexp);
  // }
};
```

</p>
</details>