'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('message-upsert-context', () => {
  it('getJid is a function via cache_jid and events barrel', () => {
    const { getJid: fromModule } = require('../events/message_upsert_events/cache_jid');
    const { getJid: fromBarrel } = require('../events/message_upsert_events');
    assert.equal(typeof fromModule, 'function');
    assert.equal(typeof fromBarrel, 'function');
    assert.equal(fromModule, fromBarrel);
  });

  it('buildMessageUpsertContext is exported', () => {
    const { buildMessageUpsertContext } = require('../lib/message-upsert/build-context');
    assert.equal(typeof buildMessageUpsertContext, 'function');
  });
});
