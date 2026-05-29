'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function walkJs(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'scripts') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJs(full, files);
    else if (entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

describe('no-hardcoded-secrets', () => {
  it('does not embed Telegram bot tokens in source', () => {
    const pattern = /\d{8,}:[A-Za-z0-9_-]{30,}/;
    const hits = [];
    for (const file of walkJs(ROOT)) {
      if (file.includes(`${path.sep}test${path.sep}`)) continue;
      const content = fs.readFileSync(file, 'utf8');
      if (pattern.test(content)) {
        hits.push(path.relative(ROOT, file));
      }
    }
    assert.deepEqual(hits, []);
  });
});
