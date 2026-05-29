'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { ALLOWED_ENV_KEYS, isAllowedEnvKey } = require('../lib/env-keys');
const { updateEnvFile } = require('../lib/manage_env');
const fs = require('fs');
const os = require('os');
const path = require('path');

describe('env-keys', () => {
  it('ALLOWED_ENV_KEYS is frozen and non-empty', () => {
    assert.ok(Object.isFrozen(ALLOWED_ENV_KEYS));
    assert.ok(ALLOWED_ENV_KEYS.includes('PREFIXE'));
    assert.ok(ALLOWED_ENV_KEYS.includes('COMMAND_REACT'));
  });

  it('isAllowedEnvKey is case-insensitive', () => {
    assert.equal(isAllowedEnvKey('prefixe'), true);
    assert.equal(isAllowedEnvKey('PREFIXE'), true);
    assert.equal(isAllowedEnvKey('SECRET_TOKEN'), false);
    assert.equal(isAllowedEnvKey(123), false);
  });
});

describe('manage_env updateEnvFile', () => {
  it('writes and updates allowed keys only', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ovl-env-'));
    const envPath = path.join(dir, '.env');

    updateEnvFile(envPath, 'PREFIXE', '!');
    assert.match(fs.readFileSync(envPath, 'utf8'), /^PREFIXE=!\n?$/);

    updateEnvFile(envPath, 'prefixe', '??');
    assert.match(fs.readFileSync(envPath, 'utf8'), /^PREFIXE=\?\?\n?$/);

    assert.throws(() => updateEnvFile(envPath, 'EVIL', 'x'), /non autorisée/);
  });
});
