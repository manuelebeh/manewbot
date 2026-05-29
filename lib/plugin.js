'use strict';

const fs = require('fs');
const path = require('path');

const evt = require('./commands');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Remote plugin install/load is disabled for self-hosted security. */
const REMOTE_PLUGINS_DISABLED = true;

function extractNpmModules() {
  return [];
}

function installModules() {
  return Promise.resolve();
}

async function installpg() {
  if (REMOTE_PLUGINS_DISABLED) return;
}

let isReloading = false;

/** Drop cached cmd/ modules so reload re-registers submodule commands. */
function clearCmdRequireCache() {
  const cmdDir = path.join(__dirname, '../cmd');
  const normalizedCmdDir = path.normalize(cmdDir) + path.sep;
  for (const key of Object.keys(require.cache)) {
    if (key.startsWith(normalizedCmdDir) || key.includes(`${path.sep}cmd${path.sep}`)) {
      delete require.cache[key];
    }
  }
}

async function reloadCommands() {
  if (isReloading) return;
  if (!Array.isArray(evt.cmd)) return;

  isReloading = true;
  try {
    evt.cmd.length = 0;
    clearCmdRequireCache();

    const cmdDir = path.join(__dirname, '../cmd');
    if (!fs.existsSync(cmdDir)) return;

    const files = fs
      .readdirSync(cmdDir)
      .filter((file) => path.extname(file).toLowerCase() === '.js');

    console.log('CMD :');
    for (const file of files) {
      const filePath = path.join(cmdDir, file);
      await delay(50);
      try {
        delete require.cache[require.resolve(filePath)];
        require(filePath);
        console.log('  ✓ ' + file);
      } catch (err) {
        console.log('  ✗ ' + file + ' — ' + err.message);
      }
    }
  } finally {
    isReloading = false;
  }
}

module.exports = {
  extractNpmModules,
  installModules,
  installpg,
  reloadCommands,
  clearCmdRequireCache,
};
