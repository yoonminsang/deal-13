import Sequelize from 'sequelize';
import Config from '../config/config.json';
const env = process.env.NODE_ENV || 'development';
const config = Config[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export { sequelize, db };
