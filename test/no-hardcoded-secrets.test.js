'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const SECRET_PATTERNS = [
  { name: 'telegram_bot_token', regex: /\d{8,}:[A-Za-z0-9_-]{30,}/ },
  { name: 'aws_access_key', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'openai_sk_key', regex: /sk-[A-Za-z0-9]{20,}/ },
  { name: 'github_pat', regex: /ghp_[A-Za-z0-9]{20,}/ },
];

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
  for (const { name, regex } of SECRET_PATTERNS) {
    it(`does not embed ${name} in source`, () => {
      const hits = [];
      for (const file of walkJs(ROOT)) {
        if (file.includes(`${path.sep}test${path.sep}`)) continue;
        const content = fs.readFileSync(file, 'utf8');
        if (regex.test(content)) {
          hits.push(path.relative(ROOT, file));
        }
      }
      assert.deepEqual(hits, []);
    });
  }
});
