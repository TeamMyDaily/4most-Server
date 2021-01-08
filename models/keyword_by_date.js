const { User, Keyword } = require('./index');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('KeywordByDate', {
    TotalKeywordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    definition: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
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