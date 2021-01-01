const { TotalKeyword } = require("./index")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('WeekGoal', {
        TotalKeywordId: {
            type: DataTypes.INTEGER,
            reference: {
                model: TotalKeyword,
                key: 'id',
            }
        },
        goal: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull:false,
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