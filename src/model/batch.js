module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Batch', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }, type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['move', 'copy', 'extract', 'link', 'open', 'download']]
      }
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
        throw new Error('Do not try to set the `commandString` value!');
      }
    },
    cwd: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    undoable: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    undone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'batches',
    timestamps: true
  });
};