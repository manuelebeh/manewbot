'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const {
  isLinkedSpec,
  listMissingRuntimeDeps,
  shouldAutoInstall,
  toNpmPackageArgs,
} = require('../lib/install-missing-deps');

describe('install-missing-deps', () => {
  const envBackup = { ...process.env };

  beforeEach(() => {
    process.env = { ...envBackup };
  });

  afterEach(() => {
    process.env = envBackup;
  });

  it('isLinkedSpec detects file and git specs', () => {
    assert.equal(isLinkedSpec('file:./packages/baileys-cjs'), true);
    assert.equal(isLinkedSpec('^1.0.0'), false);
  });

  it('listMissingRuntimeDeps ignores devDependencies', () => {
    const missing = listMissingRuntimeDeps({
      dependencies: { 'definitely-not-a-real-pkg-xyz': '^9.9.9' },
      devDependencies: { eslint: '^9.0.0' },
    });
    assert.equal(missing.length, 1);
    assert.equal(missing[0].name, 'definitely-not-a-real-pkg-xyz');
  });

  it('toNpmPackageArgs uses name only for linked specs', () => {
    const args = toNpmPackageArgs([
      { name: '@whiskeysockets/baileys', version: 'file:./packages/baileys-cjs' },
      { name: 'axios', version: '^1.8.4' },
    ]);
    assert.deepEqual(args, ['@whiskeysockets/baileys', 'axios@^1.8.4']);
  });

  it('shouldAutoInstall is off in production unless forced', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.AUTO_INSTALL_MISSING_DEPS;
    assert.equal(shouldAutoInstall(), false);

    process.env.AUTO_INSTALL_MISSING_DEPS = 'true';
    assert.equal(shouldAutoInstall(), true);
  });

  it('shouldAutoInstall is on outside production unless disabled', () => {
    delete process.env.NODE_ENV;
    delete process.env.AUTO_INSTALL_MISSING_DEPS;
    assert.equal(shouldAutoInstall(), true);

    process.env.AUTO_INSTALL_MISSING_DEPS = 'false';
    assert.equal(shouldAutoInstall(), false);
  });
});
