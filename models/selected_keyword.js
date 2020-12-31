const { User, Keyword } = require('./index');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SelectedKeyword', {
    UserId: {
      type: DataTypes.INTEGER,
      reference: {
        model: User,
        key: 'id',
      },
      allowNull: false,
    },
    KeywordId: {
      type: DataTypes.INTEGER,
      reference: {
        model: Keyword,
        key: 'id',
      },
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
      allownull: false,
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