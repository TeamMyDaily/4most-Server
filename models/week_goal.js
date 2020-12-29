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
            allowNull: False,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}