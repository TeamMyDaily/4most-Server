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
db.Keyword = require('./keyword')(sequelize, Sequelize);
db.SelectedKeyword = require('./selected_keyword')(sequelize, Sequelize);
db.Task = require('./task')(sequelize, Sequelize);
db.WeekGoal = require('./total_keyword')(sequelize, Sequelize);
db.WeekGoal = require('./user')(sequelize, Sequelize);
db.WeekGoal = require('./week_goal')(sequelize, Sequelize);

module.exports = db;