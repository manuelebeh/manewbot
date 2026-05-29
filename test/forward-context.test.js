'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('forward-context', () => {
  it('returns empty context when JID is empty', () => {
    const { buildForwardContextInfo } = require('../lib/forward-context');
    const ctx = buildForwardContextInfo();
    assert.deepEqual(ctx, {});
    assert.equal(ctx.isForwarded, undefined);
  });

  it('merges extra fields when JID is empty', () => {
    delete require.cache[require.resolve('../lib/forward-context')];
    const { buildForwardContextInfo } = require('../lib/forward-context');
    const ctx = buildForwardContextInfo({ mentionedJid: ['a@s.whatsapp.net'] });
    assert.deepEqual(ctx, { mentionedJid: ['a@s.whatsapp.net'] });
  });

  it('includes newsletter when JID is set', () => {
    const setPath = require.resolve('../set');
    const saved = require(setPath);
    require.cache[setPath].exports = {
      ...saved,
      WHATSAPP_NEWSLETTER_JID: '120363@test@newsletter',
      WHATSAPP_NEWSLETTER_NAME: 'Test',
    };
    delete require.cache[require.resolve('../lib/forward-context')];
    const { buildForwardContextInfo } = require('../lib/forward-context');
    const ctx = buildForwardContextInfo();
    assert.equal(ctx.isForwarded, true);
    assert.equal(ctx.forwardedNewsletterMessageInfo.newsletterJid, '120363@test@newsletter');
    assert.equal(ctx.forwardedNewsletterMessageInfo.newsletterName, 'Test');
    require.cache[setPath].exports = saved;
    delete require.cache[require.resolve('../lib/forward-context')];
  });
});
