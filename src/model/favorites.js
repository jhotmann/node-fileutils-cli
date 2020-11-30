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
    commandString: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.command.join(' ');
      },
      set(value) {
        throw new Error(`Do not try to set the 'commandString' value! ${value}`);
      }
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