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
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: -1
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}