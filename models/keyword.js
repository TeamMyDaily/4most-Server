module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Keyword', {
        name: {
            type: DataTypes.STRING(20),
            unique: true,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    })
}