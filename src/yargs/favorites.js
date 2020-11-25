module.exports.command = 'favorites [id-or-alias]';
module.exports.aliases = ['favourites', 'favorite', 'favourites'];
module.exports.describe = 'view or execute favorited commands';

exports.builder = {};

exports.handler = async function (argv) {
  console.dir(argv);
};