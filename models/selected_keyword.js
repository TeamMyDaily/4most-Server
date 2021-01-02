const { User, Keyword } = require('./index');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SelectedKeyword', {
    TotalKeywordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    definition: {
      type: DataTypes.STRING(200),
    },
    rank: {
      type: DataTypes.INTEGER,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false,
    },
    weekNum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}