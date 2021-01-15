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
        },
        definition: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}