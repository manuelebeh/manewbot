'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { getServiceUrls, serviceNotConfiguredMessage } = require('../lib/service-urls');

describe('service-urls', () => {
  it('getServiceUrls trims bases and defaults ezgif', () => {
    const urls = getServiceUrls({
      OVL_API_BASE: 'https://api.example/',
      REMINI_API_BASE: '',
      QUOTELY_API_BASE: 'https://quote.example',
      VYRO_API_BASE: 'https://vyro.example',
      EZGIF_API_BASE: '',
    });
    assert.equal(urls.ovl, 'https://api.example');
    assert.equal(urls.remini, '');
    assert.equal(urls.quotely, 'https://quote.example');
    assert.equal(urls.ezgif, 'https://ezgif.com');
  });

  it('serviceNotConfiguredMessage names env key', () => {
    assert.match(serviceNotConfiguredMessage('OVL_API_BASE'), /OVL_API_BASE/);
  });
});
