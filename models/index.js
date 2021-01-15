const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Keyword = require('./keyword')(sequelize, Sequelize);
db.TotalKeyword = require('./total_keyword')(sequelize, Sequelize);
db.KeywordByDate = require('./keyword_by_date')(sequelize, Sequelize);
db.Task = require('./task')(sequelize, Sequelize);
db.WeekGoal = require('./week_goal')(sequelize, Sequelize);
db.Review = require('./review')(sequelize,Sequelize);

/** N : M   User: Keyword */
db.User.belongsToMany(db.Keyword, { through: 'TotalKeyword' });
db.Keyword.belongsToMany(db.User, { through: 'TotalKeyword' });

/** 1 : N TotalKeyword : KeywordByDate */
db.TotalKeyword.hasMany(db.KeywordByDate, { foreignKey: { name: 'TotalKeywordId', allowNull: false }, onDelete: 'cascade' });
db.KeywordByDate.belongsTo(db.TotalKeyword);

/** 1 : N   Keyword : TotalKeyword */
db.Keyword.hasMany(db.TotalKeyword, { foreignKey: { name: 'KeywordId', allowNull: false }, onDelete: 'cascade '});
db.TotalKeyword.belongsTo(db.Keyword);

/** 1 : N   User : Review */
db.User.hasMany(db.Review, { foreignKey: { name: 'UserId', allowNull: false }, onDelete: 'cascade'});
db.Review.belongsTo(db.User);

/** 1 : N   TotalKeyword : Task */
db.TotalKeyword.hasMany(db.Task, { foreignKey: { name: 'TotalKeywordId', allowNull: false }, onDelete: 'cascade'});
db.Task.belongsTo(db.TotalKeyword);

/** 1 : N  TotalKeyword : WeekGoal */
db.TotalKeyword.hasMany(db.WeekGoal, { foreignKey: { name: 'TotalKeywordId', allowNull: false }, onDelete: 'cascade'});
db.WeekGoal.belongsTo(db.TotalKeyword);

module.exports = db;