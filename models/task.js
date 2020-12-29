const { SelectedKeyword } = require("./index")

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Task', {
        SelectedKeywordId: {
            type: DataTypes.INTEGER,
            reference: {
                model: SelectedKeyword,
                key: 'id',
            }
        },
        title: {
            type: DataTypes.STRING(20),
            allowNull: False,
        },
        detail: {
            type: DataTypes.STRING(500),
            allowNull: True,
        },
        rate: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        date: {
            type: DataTypes.DATE,
            allowNull:False,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}