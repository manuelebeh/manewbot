'use strict';

/** Keys that may be stored in .env / config_env.json and changed via setvar. */
const ALLOWED_ENV_KEYS = Object.freeze([
  'PREFIXE',
  'NOM_OWNER',
  'NUMERO_OWNER',
  'MODE',
  'SESSION_ID',
  'STICKER_PACK_NAME',
  'STICKER_AUTHOR_NAME',
  'DATABASE',
  'NOM_BOT',
]);

function isAllowedEnvKey(key) {
  return typeof key === 'string' && ALLOWED_ENV_KEYS.includes(key.toUpperCase());
}

module.exports = {
  ALLOWED_ENV_KEYS,
  isAllowedEnvKey,
};
