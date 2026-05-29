'use strict';

const { registerCommand } = require('../../lib/commands');
const config = require('../../set');
const { updateEnvFile } = require('../../lib/manage_env');
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const git = simpleGit();
const ENV_FILE = path.join(process.cwd(), '.env');
const CONFIG_ENV_FILE = path.join(process.cwd(), 'config_env.json');
const { formatConfigValue } = require('../../lib/config-display');

function formatDateGMTFr(dateInput) {
  const date = new Date(dateInput);
  return (
    date.toLocaleString('fr-FR', {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) + ' GMT'
  );
}

module.exports = {
  registerCommand,
  config,
  updateEnvFile,
  fs,
  path,
  git,
  ENV_FILE,
  CONFIG_ENV_FILE,
  formatConfigValue,
  formatDateGMTFr,
};
