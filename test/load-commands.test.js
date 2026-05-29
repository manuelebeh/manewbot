'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CMD_DIR = path.join(ROOT, 'cmd');

describe('load-commands', () => {
  it('loads every category index without error', () => {
    const { cmd } = require('../lib/commands');
    const { listCommandBootstrapFiles } = require('../lib/plugin');
    const before = cmd.length;
    const files = listCommandBootstrapFiles(CMD_DIR);

    assert.ok(files.length >= 15, 'expected category index files');

    const failures = [];
    for (const filePath of files) {
      try {
        delete require.cache[require.resolve(filePath)];
        require(filePath);
      } catch (err) {
        failures.push(`${path.relative(CMD_DIR, filePath)}: ${err.message}`);
      }
    }

    assert.equal(failures.length, 0, failures.join('\n'));
    assert.ok(cmd.length > before, 'expected commands to be registered');
    assert.ok(cmd.length >= 50, `only ${cmd.length} commands registered`);
  });
});
