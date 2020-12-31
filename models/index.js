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
db.SelectedKeyword = require('./selected_keyword')(sequelize, Sequelize);
db.Task = require('./task')(sequelize, Sequelize);
db.WeekGoal = require('./week_goal')(sequelize, Sequelize);
db.Review = require('./review')(sequelize,Sequelize);

/** N : M   User: Keyword */
db.User.belongsToMany(db.Keyword, { through: 'TotalKeyword' });
db.Keyword.belongsToMany(db.User, { through: 'TotalKeyword' });

/** 1 : N   User : SelectedKeyword */
db.User.hasMany(db.SelectedKeyword, { foreignKey: { name: 'UserId', allowNull: false }, onDelete: 'cascade'});
db.SelectedKeyword.belongsTo(db.User);

/** 1 : N   Keyword : SelectedKeyword */
db.Keyword.hasMany(db.SelectedKeyword, { foreignKey: { name: 'KeywordId', allowNull: false }, onDelete: 'cascade'});
db.SelectedKeyword.belongsTo(db.Keyword);

/** 1 : N   User : Review */
db.User.hasMany(db.Review, { foreignKey: { name: 'UserId', allowNull: false }, onDelete: 'cascade'});
db.Review.belongsTo(db.User);

/** 1 : N   TotalKeyword : Task */
db.TotalKeyword.hasMany(db.Task, { foreignKey: { name: 'TotalKeywordId', allowNull: false }, onDelete: 'cascade'});
db.Task.belongsTo(db.TotalKeyword);

/** 1 : 1  SelectedKeyword : WeekGoal */
db.SelectedKeyword.hasOne(db.WeekGoal);
db.WeekGoal.belongsTo(db.SelectedKeyword);

module.exports = db;