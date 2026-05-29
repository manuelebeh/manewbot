'use strict';

const MASKED_CONFIG_KEYS = new Set([
  'DATABASE',
  'GOOGLE_SEARCH_API_KEY',
  'GOOGLE_SEARCH_CX',
  'OMDB_API_KEY',
  'TENOR_API_KEY',
  'TENOR_EMOJI_API_KEY',
  'OPENWEATHER_API_KEY',
  'ACRCLOUD_ACCESS_KEY',
  'ACRCLOUD_ACCESS_SECRET',
  'AI_API_BASE',
  'AI_TOXXIC_API_BASE',
  'AI_LLAMA_API_BASE',
  'SSWEB_API_BASE',
]);

function formatConfigValue(key, value) {
  if (value === undefined || value === null || value === '') {
    return value;
  }
  const str = String(value);
  if (key === 'DATABASE') {
    return '[MASQUÉ]';
  }
  if (MASKED_CONFIG_KEYS.has(key)) {
    if (str.length <= 8) {
      return '[MASQUÉ]';
    }
    return `${str.slice(0, 4)}…${str.slice(-4)}`;
  }
  return str;
}

module.exports = {
  MASKED_CONFIG_KEYS,
  formatConfigValue,
};
