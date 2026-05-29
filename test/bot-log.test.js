'use strict';

const { describe, it, afterEach } = require('node:test');
const assert = require('node:assert/strict');

const { resolveMessageLogMode, logIncomingMessage } = require('../lib/bot-log');

describe('bot-log', () => {
  const envBackup = { ...process.env };

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it('resolveMessageLogMode honors explicit values', () => {
    process.env.LOG_MESSAGES = 'minimal';
    delete process.env.NODE_ENV;
    assert.equal(resolveMessageLogMode(), 'minimal');

    process.env.LOG_MESSAGES = 'off';
    assert.equal(resolveMessageLogMode(), 'off');

    process.env.LOG_MESSAGES = '';
    process.env.NODE_ENV = 'production';
    assert.equal(resolveMessageLogMode(), 'off');

    delete process.env.NODE_ENV;
    assert.equal(resolveMessageLogMode(), 'full');
  });

  it('logIncomingMessage respects off mode', () => {
    const logs = [];
    const original = console.log;
    console.log = (...args) => logs.push(args.join(' '));

    try {
      process.env.LOG_MESSAGES = 'off';
      logIncomingMessage({
        pushName: 'Test',
        senderJid: '221@test.s.whatsapp.net',
        sourceLabel: 'privé',
        contentType: 'text',
        viewOnce: false,
        messageText: 'secret',
      });
      assert.equal(logs.length, 0);
    } finally {
      console.log = original;
    }
  });

  it('logIncomingMessage omits text in minimal mode', () => {
    const logs = [];
    const original = console.log;
    console.log = (...args) => logs.push(args.join('\n'));

    try {
      process.env.LOG_MESSAGES = 'minimal';
      logIncomingMessage({
        pushName: 'Test',
        senderJid: '221@test.s.whatsapp.net',
        sourceLabel: 'privé',
        contentType: 'text',
        viewOnce: false,
        messageText: 'secret',
      });
      assert.equal(logs.length, 1);
      assert.match(logs[0], /Test/);
      assert.doesNotMatch(logs[0], /secret/);
    } finally {
      console.log = original;
    }
  });
});
