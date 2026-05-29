'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { formatConfigValue } = require('../lib/config-display');

describe('config-display', () => {
  it('masks DATABASE entirely', () => {
    assert.equal(formatConfigValue('DATABASE', 'postgres://user:pass@host/db'), '[MASQUÉ]');
  });

  it('masks API keys with truncation', () => {
    const masked = formatConfigValue('GOOGLE_SEARCH_API_KEY', 'abcdefghijklmnop');
    assert.equal(masked, 'abcd…mnop');
  });

  it('leaves normal values visible', () => {
    assert.equal(formatConfigValue('MODE', 'private'), 'private');
  });

  it('masks TELEGRAM_BOT_TOKEN entirely', () => {
    assert.equal(formatConfigValue('TELEGRAM_BOT_TOKEN', '123:ABCsecret'), '[MASQUÉ]');
  });
});
