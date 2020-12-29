const { User } = require('./index');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Review', {
    UserId: {
      type: DataTypes.INTEGER,
      reference: {
        model: User,
        key: 'id',
      },
    },
    week: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    good: {
      type: DataTypes.STRING(800),
    },
    bad: {
      type: DataTypes.STRING(800),
    },
    next: {
      type: DataTypes.STRING(800),
    }
  }, {
    freezeTableName: true,
    timeTables: true,
  })
}