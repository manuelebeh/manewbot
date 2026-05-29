'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const { Bans, OnlyAdmins } = require('./ban');
const { Antilink, Antilink_warnings } = require('./antilink');
const { Antitag, Antitag_warnings } = require('./antitag');
const { Antispam, AntispamWarnings } = require('./antispam');
const { Antibot, AntibotWarnings } = require('./antibot');
const { Antimention, Antimention_warnings } = require('./antimention');
const { GroupSettings, Events2 } = require('./events');
const { Warn, WarnConfig } = require('./warn');
const { Ranks, Levelup } = require('./rank');
const { ECONOMIE } = require('./economie');
const { Sudo } = require('./sudo');
const { Connect } = require('./connect');
const { ChatbotConf } = require('./chatbot');
const { BotCmd } = require('./public_private_cmd');
const { StickCmds } = require('./stick_cmd');
const { WA_CONF, WA_CONF2 } = require('./wa_conf');
const { Mention } = require('./mention');

const MODELS = [
  Bans,
  OnlyAdmins,
  Antilink,
  Antilink_warnings,
  Antitag,
  Antitag_warnings,
  Antispam,
  AntispamWarnings,
  Antibot,
  AntibotWarnings,
  Antimention,
  Antimention_warnings,
  GroupSettings,
  Events2,
  Warn,
  WarnConfig,
  Ranks,
  Levelup,
  ECONOMIE,
  Sudo,
  Connect,
  ChatbotConf,
  BotCmd,
  StickCmds,
  Mention,
  WA_CONF,
  WA_CONF2,
];

async function runMigrations() {
  const queryInterface = sequelize.getQueryInterface();

  try {
    const mentionTable = await queryInterface.describeTable('mention');
    if (!mentionTable.type) {
      await queryInterface.addColumn('mention', 'type', {
        type: DataTypes.STRING,
        defaultValue: 'texte',
      });
    }
  } catch {
    // Table may not exist yet on first run.
  }
}

async function initDatabase() {
  for (const model of MODELS) {
    await model.sync();
  }
  await runMigrations();
}

const ready = initDatabase().catch((err) => {
  console.error('Erreur initialisation base de données :', err);
});

module.exports = { initDatabase, ready };
