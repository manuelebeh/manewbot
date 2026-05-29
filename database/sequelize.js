'use strict';

const fs = require('fs');
const { Sequelize } = require('sequelize');
const config = require('../set');

const db = config.DATABASE;

function buildPostgresSslOptions() {
  const ssl = { require: true };

  if (process.env.DATABASE_SSL_CA) {
    try {
      ssl.ca = fs.readFileSync(process.env.DATABASE_SSL_CA, 'utf8');
      ssl.rejectUnauthorized = true;
    } catch (err) {
      console.warn('DATABASE_SSL_CA illisible :', err.message);
      ssl.rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';
    }
  } else {
    ssl.rejectUnauthorized = process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';
  }

  return ssl;
}

const sequelize = db
  ? new Sequelize(db, {
      dialect: 'postgres',
      ssl: true,
      protocol: 'postgres',
      dialectOptions: {
        native: true,
        ssl: buildPostgresSslOptions(),
      },
      logging: false,
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './database.db',
      logging: false,
    });

module.exports = sequelize;
