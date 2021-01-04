module.exports = (sequelize, DataTypes) => {
    return sequelize.define('KeywordRecord', {
        TotalKeywordId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: -1
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}