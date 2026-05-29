'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  validatePublicHttpUrl,
  validateRemoteMediaUrl,
} = require('../lib/url-safety');

describe('url-safety', () => {
  it('accepts public https URLs', () => {
    const r = validatePublicHttpUrl('https://example.com/page');
    assert.equal(r.ok, true);
    assert.equal(r.href, 'https://example.com/page');
  });

  it('rejects localhost', () => {
    const r = validatePublicHttpUrl('http://127.0.0.1/admin');
    assert.equal(r.ok, false);
  });

  it('rejects private RFC1918 ranges', () => {
    assert.equal(validatePublicHttpUrl('http://192.168.1.1').ok, false);
    assert.equal(validatePublicHttpUrl('http://10.0.0.5').ok, false);
  });

  it('validateRemoteMediaUrl requires https', () => {
    assert.equal(validateRemoteMediaUrl('http://example.com/a.jpg').ok, false);
    assert.equal(validateRemoteMediaUrl('https://example.com/a.jpg').ok, true);
  });
});
