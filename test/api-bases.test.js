'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('api-bases', () => {
  it('builds wiktionary URL from config', () => {
    const { wiktionaryFrWordUrl, getCardPariImages } = require('../lib/api-bases');
    assert.match(wiktionaryFrWordUrl('chat'), /wiktionary.*chat/i);
    const cards = getCardPariImages();
    assert.ok(cards.haut && cards.bas && cards.gauche && cards.droite);
  });
});
