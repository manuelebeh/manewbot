'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getAiBases, aiNotConfiguredMessage } = require('../lib/ai-api');

describe('ai-api', () => {
  it('getAiBases trims trailing slashes', () => {
    const bases = getAiBases({
      AI_API_BASE: 'https://api.example/',
      AI_TOXXIC_API_BASE: 'https://tox.example',
      AI_LLAMA_API_BASE: '',
      SSWEB_API_BASE: '',
    });
    assert.equal(bases.elite, 'https://api.example');
    assert.equal(bases.toxxic, 'https://tox.example');
    assert.equal(bases.sswweb, 'https://api.example');
  });

  it('aiNotConfiguredMessage names the env key', () => {
    assert.match(aiNotConfiguredMessage('AI_API_BASE'), /AI_API_BASE/);
  });
});
