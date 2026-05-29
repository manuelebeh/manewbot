'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { extensionFromMime } = require('../lib/mime-ext');

describe('mime-ext', () => {
  it('maps common WhatsApp mime types', () => {
    assert.equal(extensionFromMime('image/jpeg'), 'jpg');
    assert.equal(extensionFromMime('video/mp4'), 'mp4');
    assert.equal(extensionFromMime('audio/ogg; codecs=opus'), 'ogg');
  });

  it('falls back for unknown mime', () => {
    assert.equal(extensionFromMime('application/x-custom'), 'x-custom');
    assert.equal(extensionFromMime(''), 'bin');
  });
});
