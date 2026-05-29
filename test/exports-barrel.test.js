'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('exports-barrel', () => {
  it('message_upsert_events barrel exports only functions', () => {
    const barrel = require('../events/message_upsert_events');
    for (const [name, fn] of Object.entries(barrel)) {
      assert.equal(typeof fn, 'function', `${name} must be a function`);
    }
    assert.ok(barrel.getJid);
    assert.ok(barrel.rankAndLevelUp);
  });

  it('events index exports only functions', () => {
    const barrel = require('../events');
    const expected = [
      'message_upsert',
      'group_participants_update',
      'group_update',
      'connection_update',
      'call',
      'dl_save_media_ms',
      'recup_msg',
    ];
    for (const name of expected) {
      assert.equal(typeof barrel[name], 'function', `${name} must be a function`);
    }
  });
});
