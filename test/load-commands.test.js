'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CMD_DIR = path.join(ROOT, 'cmd');

describe('load-commands', () => {
  it('loads every cmd/*.js index without error', () => {
    const { cmd } = require('../lib/commands');
    const before = cmd.length;
    const files = fs
      .readdirSync(CMD_DIR)
      .filter((name) => name.endsWith('.js'));

    const failures = [];
    for (const file of files) {
      try {
        const filePath = path.join(CMD_DIR, file);
        delete require.cache[require.resolve(filePath)];
        require(filePath);
      } catch (err) {
        failures.push(`${file}: ${err.message}`);
      }
    }

    assert.equal(failures.length, 0, failures.join('\n'));
    assert.ok(cmd.length > before, 'expected commands to be registered');
    assert.ok(cmd.length >= 50, `only ${cmd.length} commands registered`);
  });
});
