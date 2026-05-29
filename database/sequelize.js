'use strict';

const { Sequelize } = require('sequelize');
const config = require('../set');

const db = config.DATABASE;

const sequelize = db
  ? new Sequelize(db, {
      dialect: 'postgres',
      ssl: true,
      protocol: 'postgres',
      dialectOptions: {
        native: true,
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './database.db',
      logging: false,
    });

module.exports = sequelize;
