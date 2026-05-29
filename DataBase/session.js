'use strict';

const fs = require('fs');
const path = require('path');

const AUTH_ROOT = path.join(__dirname, '../auth');

function localAuthExists(folderName) {
  return fs.existsSync(path.join(AUTH_ROOT, folderName, 'creds.json'));
}

function ensureAuthDir(folderName) {
  const dir = path.join(AUTH_ROOT, folderName);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

function listLocalAuthFolders() {
  if (!fs.existsSync(AUTH_ROOT)) return [];
  return fs
    .readdirSync(AUTH_ROOT, { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        fs.existsSync(path.join(AUTH_ROOT, entry.name, 'creds.json'))
    )
    .map((entry) => entry.name);
}

module.exports = {
  AUTH_ROOT,
  localAuthExists,
  ensureAuthDir,
  listLocalAuthFolders,
};
