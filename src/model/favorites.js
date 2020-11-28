module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Favorites', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    command: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() { return JSON.parse(this.getDataValue('command')); },
      set(value) { this.setDataValue('command', Array.isArray(value) ? JSON.stringify(value) : value); }
    },
    alias: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: true
    }
  }, {
    tableName: 'favorites',
    timestamps: true
  });
};