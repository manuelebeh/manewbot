'use strict';

const dotenv = require('dotenv');

dotenv.config({ override: true });

module.exports = {
  PREFIXE: process.env.PREFIXE || '.',
  NOM_OWNER: process.env.NOM_OWNER || '',
  NUMERO_OWNER: process.env.NUMERO_OWNER || '',
  MODE: process.env.MODE || 'public',
  STICKER_PACK_NAME: process.env.STICKER_PACK_NAME || 'ᴏᴠʟ-ᴍᴅ-ᴠ𝟸',
  STICKER_AUTHOR_NAME: process.env.STICKER_AUTHOR_NAME || '',
  DATABASE: process.env.DATABASE,
  NOM_BOT: process.env.NOM_BOT || '🤖 OVL-MD BOT V2',
};
