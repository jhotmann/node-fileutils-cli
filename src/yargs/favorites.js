const database = require('../util/database');

const { Favorites } = require('../common/Favorites');

module.exports.command = 'favorites [id-or-alias]';
module.exports.aliases = ['f', 'favourites', 'favorite', 'favourites'];
module.exports.describe = 'view or execute favorited commands';

exports.builder = {};

exports.handler = async function (argv) {
  let sequelize = await database.init();
  let favorites = new Favorites(sequelize, argv);
  await favorites.get();
  if (argv.idOrAlias) await favorites.run();
};