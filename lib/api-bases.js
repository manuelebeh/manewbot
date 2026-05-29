'use strict';

const config = require('../set');

function trimSlash(url) {
  return String(url || '').replace(/\/$/, '');
}

function wiktionaryFrWordUrl(word) {
  const base = trimSlash(config.WIKTIONARY_FR_BASE || 'https://fr.wiktionary.org/wiki');
  return base + '/' + encodeURIComponent(word);
}

function getCardPariImages() {
  return {
    haut: config.CARD_PARI_IMAGE_HAUT,
    bas: config.CARD_PARI_IMAGE_BAS,
    gauche: config.CARD_PARI_IMAGE_GAUCHE,
    droite: config.CARD_PARI_IMAGE_DROITE,
  };
}

module.exports = {
  wiktionaryFrWordUrl,
  getCardPariImages,
};
