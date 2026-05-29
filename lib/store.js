'use strict';

const fs = require('fs');
const path = require('path');

const storeFilePath = path.resolve(__dirname, 'store_msg.json');
const MAX_STORE_SIZE_MB = 5;
const FLUSH_DELAY_MS = 2000;

const cache = new Map();
let loaded = false;
let dirty = false;
let flushTimer = null;

function checkAndResetStore() {
  try {
    const stats = fs.statSync(storeFilePath);
    const sizeMb = stats.size / 1048576;
    if (sizeMb > MAX_STORE_SIZE_MB) {
      console.warn(
        `Le fichier store_msg.json dépasse ${MAX_STORE_SIZE_MB} Mo. Réinitialisation...`
      );
      cache.clear();
      fs.writeFileSync(storeFilePath, JSON.stringify({}));
      dirty = false;
    }
  } catch {
    // Fichier absent ou illisible.
  }
}

function loadFromDisk() {
  if (loaded) return;
  loaded = true;
  try {
    if (!fs.existsSync(storeFilePath)) {
      fs.writeFileSync(storeFilePath, JSON.stringify({}));
      return;
    }
    const data = JSON.parse(fs.readFileSync(storeFilePath, 'utf8'));
    for (const [id, msg] of Object.entries(data)) {
      cache.set(id, msg);
    }
    checkAndResetStore();
  } catch (err) {
    console.error('Erreur chargement store_msg.json :', err);
  }
}

function flushToDisk() {
  if (!dirty) return;
  try {
    const obj = Object.fromEntries(cache);
    fs.writeFileSync(storeFilePath, JSON.stringify(obj, null, 2));
    dirty = false;
    checkAndResetStore();
  } catch (err) {
    console.error('Erreur écriture store_msg.json :', err);
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flushToDisk();
  }, FLUSH_DELAY_MS);
}

function getMessage(messageId) {
  loadFromDisk();
  return cache.get(messageId) || null;
}

function addMessage(messageId, messageData) {
  loadFromDisk();
  cache.set(messageId, messageData);
  dirty = true;
  scheduleFlush();
}

process.on('beforeExit', () => {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  flushToDisk();
});

module.exports = {
  getMessage,
  addMessage,
};
