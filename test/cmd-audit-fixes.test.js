'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CMD_DIR = path.join(ROOT, 'cmd');

describe('cmd-audit-fixes', () => {
  it('registers unique nom_cmd after loading all indexes', () => {
    const { cmd } = require('../lib/commands');
    const before = cmd.length;
    for (const file of fs.readdirSync(CMD_DIR).filter((n) => n.endsWith('.js'))) {
      const filePath = path.join(CMD_DIR, file);
      delete require.cache[require.resolve(filePath)];
      require(filePath);
    }
    assert.ok(cmd.length > before);
    const seen = new Map();
    for (const c of cmd) {
      seen.set(c.nom_cmd, (seen.get(c.nom_cmd) || 0) + 1);
    }
    const dups = [...seen.entries()].filter(([, n]) => n > 1);
    assert.deepEqual(dups, [], `duplicate commands: ${dups.map(([k]) => k).join(', ')}`);
  });

  it('setvar uses allowed env keys module', () => {
    const { isAllowedEnvKey } = require('../lib/env-keys');
    assert.equal(isAllowedEnvKey('MODE'), true);
    assert.equal(isAllowedEnvKey('TELEGRAM_BOT_TOKEN'), false);
  });

  it('clearCmdRequireCache allows submodule reload', () => {
    const { cmd } = require('../lib/commands');
    const { clearCmdRequireCache } = require('../lib/plugin');
    const countAfterLoad = cmd.length;
    assert.ok(countAfterLoad > 50);
    cmd.length = 0;
    clearCmdRequireCache();
    require(path.join(CMD_DIR, 'fun.js'));
    assert.ok(cmd.length > 0, 'submodules should re-register after cache clear');
  });
});
