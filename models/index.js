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

/** 1 : 1   TotalKeyword : SelectedKeyword */
db.TotalKeyword.hasOne(db.SelectedKeyword);
db.SelectedKeyword.belongsTo(db.TotalKeyword);

/** 1 : N   User : Review */
db.User.hasMany(db.Review, { foreignKey: { name: 'UserId', allowNull: false }, onDelete: 'cascade'});
db.Review.belongsTo(db.User);

/** 1 : N   SelectedKeyword : Task */
db.SelectedKeyword.hasMany(db.Task, { foreignKey: { name: 'SelectedKeywordId', allowNull: false }, onDelete: 'cascade'});
db.Task.belongsTo(db.SelectedKeyword);

/** 1 : 1  SelectedKeyword : WeekGoal */
db.SelectedKeyword.hasOne(db.WeekGoal);
db.WeekGoal.belongsTo(db.SelectedKeyword);

module.exports = db;