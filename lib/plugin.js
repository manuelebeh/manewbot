'use strict';

const fs = require('fs');
const path = require('path');

const evt = require('./commands');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

/** Category entrypoints: cmd/<category>/index.js only. */
function listCommandBootstrapFiles(cmdDir) {
  const entries = fs.readdirSync(cmdDir, { withFileTypes: true });
  const files = [];

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const indexPath = path.join(cmdDir, ent.name, 'index.js');
    if (fs.existsSync(indexPath)) {
      files.push(indexPath);
    }
  }

  return files.sort();
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

    const files = listCommandBootstrapFiles(cmdDir);

    console.log('CMD :');
    for (const filePath of files) {
      await delay(50);
      const label = path.relative(cmdDir, filePath);
      try {
        delete require.cache[require.resolve(filePath)];
        require(filePath);
        console.log('  ✓ ' + label);
      } catch (err) {
        console.log('  ✗ ' + label + ' — ' + err.message);
      }
    }
  } finally {
    isReloading = false;
  }
}

module.exports = {
  reloadCommands,
  clearCmdRequireCache,
  listCommandBootstrapFiles,
};
