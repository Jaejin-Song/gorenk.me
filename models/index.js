const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};


const sequelize = new Sequelize(config.database, config.username, config.password, config);


db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Comment = require('./comment')(sequelize, Sequelize);

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);
db.User.hasMany(db.Comment, {foreignKey: 'commenter', sourceKey: 'id'});
db.Comment.belongsTo(db.User, {foreignKey: 'commenter', targetKey: 'id'});

module.exports = db;
