'use strict';

const fs = require('fs');
const path = require('path');

const MOTS_FILE = path.join(__dirname, '../../../lib/mots.json');

function normalizeWord(word) {
  return word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function shuffleWord(word) {
  let scrambled;
  let attempts = 0;
  const normalized = word.toLowerCase();
  do {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    scrambled = letters.join('');
    attempts++;
  } while (
    attempts < 20 &&
    (scrambled.toLowerCase() === normalized ||
      scrambled === word.split('').reverse().join('') ||
      scrambled.toLowerCase() === word.split('').reverse().join('').toLowerCase())
  );
  return scrambled;
}

function pickWord(pool, usedSet) {
  const available = pool.filter((w) => !usedSet.has(normalizeWord(w)));
  if (available.length === 0) {
    usedSet.clear();
    return pool[Math.floor(Math.random() * pool.length)];
  }
  const word = available[Math.floor(Math.random() * available.length)];
  usedSet.add(normalizeWord(word));
  return word;
}

function loadWordList() {
  const fileData = fs.readFileSync(MOTS_FILE, 'utf8');
  const list = JSON.parse(fileData);
  return list.sort(() => Math.random() - 0.5);
}

function wordsForRound(round, allWords) {
  if (round === 1) {
    return allWords.filter((w) => w.length >= 4 && w.length <= 5);
  }
  if (round === 2) {
    return allWords.filter((w) => w.length >= 6 && w.length <= 7);
  }
  if (round === 3) {
    return allWords.filter((w) => w.length >= 8 && w.length <= 9);
  }
  return allWords.filter((w) => w.length >= 10);
}

module.exports = {
  normalizeWord,
  shuffleWord,
  pickWord,
  loadWordList,
  wordsForRound,
};
