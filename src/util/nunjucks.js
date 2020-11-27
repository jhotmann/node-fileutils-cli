const fs = require('fs-extra');
const nunjucks = require('nunjucks');
const os = require('os');

let env = nunjucks.configure({ autoescape: true, noCache: true });
const dateFilter = require('../filters/date');
const customFilters = require('../filters/custom');
env.addFilter('date', dateFilter);
Object.keys(customFilters).forEach(f => env.addFilter(f, customFilters[f]));
if (fs.pathExistsSync(os.homedir() + '/.fu/userFilters.js')) {
  let userFilters = require(os.homedir() + '/.fu/userFilters.js');
  Object.keys(userFilters).forEach(f => env.addFilter(f, userFilters[f]));
}

module.exports.renderString = function (src, context) {
  return nunjucks.renderString(src, context);
};