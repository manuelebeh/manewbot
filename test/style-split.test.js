'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('style-split', () => {
  it('re-exports maps and apply from lib/style', () => {
    const fancy = require('../lib/style');
    assert.equal(typeof fancy.apply, 'function');
    assert.equal(typeof fancy.list, 'function');
    assert.ok(fancy[0]);
    assert.equal(fancy.apply(fancy[0], 'abc'), fancy.apply(fancy[0], 'abc'));
  });
});
