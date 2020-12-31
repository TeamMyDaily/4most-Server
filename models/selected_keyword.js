const { User, Keyword } = require('./index');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SelectedKeyword', {
    UserId: {
      type: DataTypes.INTEGER,
      reference: {
        model: User,
        key: 'id',
      }
    },
    KeywordId: {
      type: DataTypes.INTEGER,
      reference: {
        model: Keyword,
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
    timestamps: false,
  })
}