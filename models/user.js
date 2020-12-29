module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    accountId: {
      type: DataTypes.STRING(10),
      unique: true,
      allowNull: false,
    },
    hashedPassword: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    salt: {
      type: DataTypes.STRING(200),
      allowNull: false,
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  })
}