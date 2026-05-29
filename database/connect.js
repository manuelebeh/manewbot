'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../set');
const { localAuthExists } = require('./session');

const db = config.DATABASE;

let sequelize;
if (!db) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.db',
    logging: false,
  });
} else {
  sequelize = new Sequelize(db, {
    dialect: 'postgres',
    ssl: true,
    protocol: 'postgres',
    dialectOptions: {
      native: true,
      ssl: { require: true, rejectUnauthorized: false },
    },
    logging: false,
  });
}

const Connect = sequelize.define(
  'Connect',
  {
    numero: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'connects',
    timestamps: false,
  }
);

(async () => {
  await Connect.sync();
})();

async function saveSecondSession(numero) {
  if (!localAuthExists(numero)) {
    console.error(
      'Aucune session locale dans auth/' +
        numero +
        '/. Appairez d\'abord ce compte.'
    );
    return false;
  }

  try {
    await Connect.findOrCreate({
      where: { numero },
      defaults: { numero, session_id: null },
    });
    console.log('Session secondaire enregistrée : ' + numero);
    return true;
  } catch (error) {
    console.error('Erreur enregistrement session :', error.message);
    return false;
  }
}

async function getSecondSession(numero) {
  const row = await Connect.findByPk(numero);
  if (!row) return null;
  if (!localAuthExists(numero)) return null;
  return { numero: row.numero };
}

async function getSecondAllSessions() {
  const rows = await Connect.findAll({ attributes: ['numero'] });
  return rows.map((row) => ({ numero: row.numero }));
}

async function deleteSecondSession(numero) {
  return await Connect.destroy({ where: { numero } });
}

module.exports = {
  saveSecondSession,
  getSecondSession,
  getSecondAllSessions,
  deleteSecondSession,
};
