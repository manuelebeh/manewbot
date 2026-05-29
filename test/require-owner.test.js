'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { requireOwner, ownerReply, DEFAULT_MSG } = require('../lib/require-owner');

describe('require-owner', () => {
  it('requireOwner calls onDenied when not owner', () => {
    let denied = false;
    const ok = requireOwner({ isOwner: false }, () => {
      denied = true;
    });
    assert.equal(ok, false);
    assert.equal(denied, true);
  });

  it('requireOwner passes for owner', () => {
    let denied = false;
    const ok = requireOwner({ isOwner: true }, () => {
      denied = true;
    });
    assert.equal(ok, true);
    assert.equal(denied, false);
  });

  it('requireOwner uses custom message', () => {
    let message = '';
    requireOwner({ isOwner: false }, (msg) => {
      message = msg;
    }, 'Accès refusé');
    assert.equal(message, 'Accès refusé');
    assert.equal(DEFAULT_MSG.includes('permission'), true);
  });

  it('ownerReply sends quoted message when ms provided', async () => {
    const calls = [];
    const sock = {
      sendMessage: async (jid, payload, opts) => {
        calls.push({ jid, payload, opts });
      },
    };
    const ms = { key: { id: 'abc' } };
    await ownerReply(sock, '120363012345678901@g.us', ms, 'hello');
    assert.equal(calls.length, 1);
    assert.equal(calls[0].payload.text, 'hello');
    assert.deepEqual(calls[0].opts, { quoted: ms });
  });
});
