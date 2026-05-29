'use strict';

const fs = require('fs');
const axios = require('axios');

const TTS_BASE = 'https://translate.google.com/translate_tts';

/**
 * Google Translate TTS (sans dépendance `gtts` / `request`).
 * @returns {Promise<Buffer>}
 */
async function synthesizeSpeech(text, lang = 'fr') {
  const trimmed = String(text || '').trim();
  if (!trimmed) {
    throw new Error('Texte TTS vide');
  }
  const language = String(lang || 'fr').trim().slice(0, 10);
  const url =
    TTS_BASE +
    '?ie=UTF-8&client=tw-ob&tl=' +
    encodeURIComponent(language) +
    '&q=' +
    encodeURIComponent(trimmed);

  const response = await axios.get(url, {
    responseType: 'arraybuffer',
    timeout: 30000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; Manewbot/2.1; +https://github.com/manuelebeh/manewbot)',
    },
    maxRedirects: 5,
  });

  return Buffer.from(response.data);
}

/** Écrit un MP3 sur disque (API proche de l’ancien `gtts`). */
async function saveSpeechToFile(text, lang, outputPath) {
  const buffer = await synthesizeSpeech(text, lang);
  await fs.promises.writeFile(outputPath, buffer);
}

module.exports = {
  synthesizeSpeech,
  saveSpeechToFile,
};
