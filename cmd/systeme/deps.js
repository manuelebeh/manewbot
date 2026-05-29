'use strict';

const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const config = require('../../set');
const { updateEnvFile, writeConfigEnv } = require('../../lib/manage_env');
const { formatConfigValue } = require('../../lib/config-display');
const { isAllowedEnvKey } = require('../../lib/env-keys');

const git = simpleGit();
const ENV_FILE = path.join(process.cwd(), '.env');
const CONFIG_ENV_FILE = path.join(process.cwd(), 'config_env.json');

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
  config,
  updateEnvFile,
  fs,
  path,
  git,
  ENV_FILE,
  CONFIG_ENV_FILE,
  formatConfigValue,
  formatDateGMTFr,
  isAllowedEnvKey,
  writeConfigEnv,
};
