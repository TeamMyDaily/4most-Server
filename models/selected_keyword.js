const { TotalKeyword } = require('./index');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SelectedKeyword', {
    ToTalKeywordId: {
      type: DataTypes.INTEGER,
      reference: {
        model: TotalKeyword,
        key: 'id',
      }
    },
    definition: {
      type: DataTypes.STRING(200),
    },
    rank: {
      type: DataTypes.INTEGER,
    }
  }, {
    freezeTableName: true,
    timeStamps: false,
  })
}