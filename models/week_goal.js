const { SelectedKeyword } = require("./index")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('WeekGoal', {
        SelectedKeywordId: {
            type: DataTypes.INTEGER,
            reference: {
                model: SelectedKeyword,
                key: 'id',
            }
        },
        goal: {
            type: DataTypes.STRING(30),
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}