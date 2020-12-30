const { Keyword, User } = require("./index")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('TotalKeyword', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        KeywordId: {
            type: DataTypes.INTEGER,
            reference: {
                model: Keyword,
                key: 'id',
            }
        },
        UserId: {
            type: DataTypes.INTEGER,
            reference: {
                model:User,
                key: 'id',
            }
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}