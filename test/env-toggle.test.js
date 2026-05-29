'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const {
  parseEnvToggle,
  formatFeatureState,
  resolveCommandReactEnabled,
  getCommandReactEnvOverride,
} = require('../lib/env-toggle');

describe('env-toggle', () => {
  it('parseEnvToggle recognizes on/off variants', () => {
    assert.equal(parseEnvToggle('on'), true);
    assert.equal(parseEnvToggle('OUI'), true);
    assert.equal(parseEnvToggle('false'), false);
    assert.equal(parseEnvToggle(''), null);
    assert.equal(parseEnvToggle(undefined), null);
    assert.equal(parseEnvToggle('maybe'), null);
  });

  it('formatFeatureState reflects env override', () => {
    assert.match(formatFeatureState(true, true), /forcé par \.env/);
    assert.match(formatFeatureState(false, false), /bloqué par \.env/);
    assert.match(formatFeatureState(true, null), /base de données/);
  });

  it('resolveCommandReactEnabled uses COMMAND_REACT only', () => {
    assert.equal(resolveCommandReactEnabled({ COMMAND_REACT: 'off' }), false);
    assert.equal(resolveCommandReactEnabled({ COMMAND_REACT: 'on' }), true);
    assert.equal(resolveCommandReactEnabled({ COMMAND_REACT: '' }), true);
  });

  it('getCommandReactEnvOverride returns parsed toggle', () => {
    assert.equal(getCommandReactEnvOverride({ COMMAND_REACT: 'yes' }), true);
    assert.equal(getCommandReactEnvOverride({ COMMAND_REACT: '' }), null);
  });
});
