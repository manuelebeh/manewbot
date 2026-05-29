'use strict';

const { wiktionaryFrWordUrl } = require('../../../lib/api-bases');

function normalizeWord(word) {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z]/g, '')
    .trim();
}

async function isValidFrenchWord(word) {
  try {
    const normalized = normalizeWord(word);
    const apiUrl = wiktionaryFrWordUrl(normalized);
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return false;
    }
    const html = await response.text();
    if (html.includes('Pas de résultat pour')) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

function getLetterOptions(round) {
  if (round === 1) return [3, 4];
  if (round === 2) return [4, 5, 6];
  if (round === 3) return [5, 6, 7];
  if (round === 4) return [6, 7, 8];
  if (round === 5) return [7, 8, 9];
  if (round === 6) return [8, 9, 10];
  if (round === 7) return [9, 10, 11];
  if (round === 8) return [10, 11, 12];
  if (round === 9) return [11, 12, 13];
  if (round === 10) return [12, 13, 14];
  if (round === 11) return [13, 14, 15];
  if (round === 12) return [14, 15, 16];
  if (round === 13) return [15, 16, 17];
  if (round === 14) return [16, 17, 18];
  if (round === 15) return [18, 19, 20];
  if (round === 16) return [20, 21, 22];
  if (round === 17) return [22, 23, 24];
  return [25];
}

function getRoundTimeMs(round) {
  if (round <= 4) return 10000;
  if (round <= 6) return 15000;
  if (round <= 8) return 18000;
  if (round <= 10) return 20000;
  if (round <= 14) return 25000;
  return 30000;
}

module.exports = {
  normalizeWord,
  isValidFrenchWord,
  getLetterOptions,
  getRoundTimeMs,
};
