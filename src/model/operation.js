module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Op', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['move', 'copy']]
      }
    },
    input: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    output: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    undone: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'operations',
    timestamps: true,
    updatedAt: false
  });
};