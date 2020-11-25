const format = require('date-fns/format');
const nunjucks = require('nunjucks');

let dateFilterDefaultFormat = 'yyyyMMdd';

// a date filter for Nunjucks
// usage: {{ my_date | date(format) }}
function dateFilter(date, dateFormat) {
    try {
        return format(date, dateFormat || dateFilterDefaultFormat);
    } catch (e) {
        return '';
    }
}
module.exports = dateFilter;

// set default format for date
module.exports.setDefaultFormat = function(dateFormat) {
    dateFilterDefaultFormat = dateFormat;
};

// install the filter to nunjucks environment
module.exports.install = function(env, customName) {
    (env || nunjucks.configure()).addFilter(customName || 'date', dateFilter);
};
