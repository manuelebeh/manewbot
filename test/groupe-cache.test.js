'use strict';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const {
  groupCache,
  getGroupMetadata,
  isRateLimitError,
  isGroupNotFoundError,
} = require('../lib/groupe_cache');

describe('groupe_cache', () => {
  beforeEach(() => {
    groupCache.data = {};
  });

  it('isRateLimitError detects WhatsApp rate limits', () => {
    assert.equal(isRateLimitError({ message: 'rate-overlimit', data: 429 }), true);
    assert.equal(isRateLimitError(new Error('other')), false);
  });

  it('isGroupNotFoundError detects missing groups', () => {
    assert.equal(isGroupNotFoundError({ message: 'item-not-found', data: 404 }), true);
    assert.equal(isGroupNotFoundError(new Error('other')), false);
  });

  it('getGroupMetadata returns cached metadata without API call', async () => {
    const jid = '120363000000000000@g.us';
    const metadata = { id: jid, subject: 'Test', participants: [] };
    groupCache.set(jid, metadata);

    let apiCalls = 0;
    const sock = {
      groupMetadata: async () => {
        apiCalls += 1;
        return metadata;
      },
    };

    const result = await getGroupMetadata(sock, jid);
    assert.deepEqual(result, metadata);
    assert.equal(apiCalls, 0);
  });

  it('getGroupMetadata falls back to stale cache on rate limit', async () => {
    const jid = '120363000000000000@g.us';
    const metadata = { id: jid, subject: 'Cached', participants: [] };
    groupCache.set(jid, metadata);
    groupCache.data[jid].expire = Date.now() - 1;

    const sock = {
      groupMetadata: async () => {
        const err = new Error('rate-overlimit');
        err.data = 429;
        throw err;
      },
    };

    const result = await getGroupMetadata(sock, jid);
    assert.equal(result.subject, 'Cached');
  });

  it('getGroupMetadata returns null when group no longer exists', async () => {
    const jid = '120363000000000000@g.us';
    groupCache.set(jid, { id: jid, subject: 'Gone', participants: [] });
    groupCache.data[jid].expire = Date.now() - 1;

    const sock = {
      groupMetadata: async () => {
        const err = new Error('item-not-found');
        err.data = 404;
        throw err;
      },
    };

    const result = await getGroupMetadata(sock, jid);
    assert.equal(result, null);
    assert.equal(groupCache.getStale(jid), null);
  });
});
