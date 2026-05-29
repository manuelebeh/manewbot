'use strict';

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { ALLOWED_ENV_KEYS, isAllowedEnvKey } = require('./env-keys');

const ENV_FILE = path.join(process.cwd(), '.env');
const CONFIG_ENV_FILE = path.join(process.cwd(), 'config_env.json');
const SECRET_FILE_MODE = 0o600;

function restrictFilePermissions(filePath) {
  try {
    fs.chmodSync(filePath, SECRET_FILE_MODE);
  } catch {
    // Best effort (e.g. Windows).
  }
}

function writeSecure(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  restrictFilePermissions(filePath);
}

function writeConfigEnv(data) {
  const safe = {};
  for (const key of ALLOWED_ENV_KEYS) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      safe[key] = data[key] ?? '';
    }
  }
  writeSecure(CONFIG_ENV_FILE, JSON.stringify(safe, null, 2));
}

function readConfigEnv() {
  if (!fs.existsSync(CONFIG_ENV_FILE)) return {};
  const parsed = JSON.parse(fs.readFileSync(CONFIG_ENV_FILE, 'utf8'));
  const safe = {};
  for (const key of ALLOWED_ENV_KEYS) {
    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      safe[key] = parsed[key];
    }
  }
  return safe;
}

function snapshotFromProcessEnv() {
  const values = {};
  for (const key of ALLOWED_ENV_KEYS) {
    values[key] = process.env[key] || '';
  }
  return values;
}

function manage_env() {
  const fromEnv = snapshotFromProcessEnv();
  dotenv.config({ override: true });

  if (!fs.existsSync(CONFIG_ENV_FILE)) {
    writeConfigEnv(fromEnv);
  }

  if (!fs.existsSync(ENV_FILE)) {
    let content = '';
    for (const key of ALLOWED_ENV_KEYS) {
      content += key + '=' + (fromEnv[key] || '') + '\n';
    }
    writeSecure(ENV_FILE, content);
  }

  const configFile = readConfigEnv();
  let configChanged = false;

  for (const key of ALLOWED_ENV_KEYS) {
    if (configFile[key] !== fromEnv[key]) {
      configChanged = true;
      configFile[key] = fromEnv[key];
      updateEnvFile(ENV_FILE, key, fromEnv[key]);
    }
  }

  if (configChanged) {
    writeConfigEnv(configFile);
  }
}

function updateEnvFile(filePath, key, value) {
  const normalizedKey = typeof key === 'string' ? key.toUpperCase() : '';
  if (!isAllowedEnvKey(normalizedKey)) {
    throw new Error('Variable non autorisée: ' + key);
  }

  let content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  const linePattern = new RegExp('^' + normalizedKey + '=.*$', 'm');

  if (value === null) {
    if (linePattern.test(content)) {
      content = content
        .replace(linePattern, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
      if (content.length > 0) content += '\n';
    }
  } else {
    const safeValue = value ?? '';
    if (linePattern.test(content)) {
      content = content.replace(linePattern, normalizedKey + '=' + safeValue);
    } else {
      if (content.length > 0 && !content.endsWith('\n')) content += '\n';
      content += normalizedKey + '=' + safeValue + '\n';
    }
  }

  writeSecure(filePath, content);
}

module.exports = {
  ENV_FILE,
  CONFIG_ENV_FILE,
  ALLOWED_ENV_KEYS,
  isAllowedEnvKey,
  manage_env,
  updateEnvFile,
  writeConfigEnv,
  readConfigEnv,
};
