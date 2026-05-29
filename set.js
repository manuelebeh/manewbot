'use strict';

const dotenv = require('dotenv');

dotenv.config({ override: true });

module.exports = {
  PREFIXE: process.env.PREFIXE || '.',
  NOM_OWNER: process.env.NOM_OWNER || '',
  NUMERO_OWNER: process.env.NUMERO_OWNER || '',
  MODE: process.env.MODE || 'public',
  STICKER_PACK_NAME: process.env.STICKER_PACK_NAME || 'Manewbot',
  STICKER_AUTHOR_NAME: process.env.STICKER_AUTHOR_NAME || '',
  DATABASE: process.env.DATABASE,
  NOM_BOT: process.env.NOM_BOT || 'Manewbot',
  /** Comma-separated group JIDs (@g.us) with limited bot access */
  RESTRICTED_GROUPS: process.env.RESTRICTED_GROUPS || '',
  /** Extra numbers/JIDs allowed in restricted groups (besides owner/sudo) */
  RESTRICTED_GROUP_ALLOWLIST: process.env.RESTRICTED_GROUP_ALLOWLIST || '',
  /** Comma-separated group JIDs where autoreact is disabled */
  BLOCKED_AUTOREACT_GROUPS: process.env.BLOCKED_AUTOREACT_GROUPS || '',
  /** on/off — réaction emoji sur le message à l'exécution d'une commande (vide = activé) */
  COMMAND_REACT: process.env.COMMAND_REACT || '',
  GOOGLE_SEARCH_API_KEY: process.env.GOOGLE_SEARCH_API_KEY || '',
  GOOGLE_SEARCH_CX: process.env.GOOGLE_SEARCH_CX || '',
  OMDB_API_KEY: process.env.OMDB_API_KEY || '',
  TENOR_API_KEY: process.env.TENOR_API_KEY || '',
  TENOR_EMOJI_API_KEY: process.env.TENOR_EMOJI_API_KEY || '',
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || '',
  ACRCLOUD_HOST: process.env.ACRCLOUD_HOST || 'identify-eu-west-1.acrcloud.com',
  ACRCLOUD_ACCESS_KEY: process.env.ACRCLOUD_ACCESS_KEY || '',
  ACRCLOUD_ACCESS_SECRET: process.env.ACRCLOUD_ACCESS_SECRET || '',
  /** Base URL API IA texte/image (ex. https://votre-proxy.example) */
  AI_API_BASE: process.env.AI_API_BASE || '',
  /** Base URL API secondaire (blackbox, claude, …) */
  AI_TOXXIC_API_BASE: process.env.AI_TOXXIC_API_BASE || '',
  /** Base URL API Llama */
  AI_LLAMA_API_BASE: process.env.AI_LLAMA_API_BASE || '',
  /** Capture d'écran web (défaut : AI_API_BASE si vide) */
  SSWEB_API_BASE: process.env.SSWEB_API_BASE || '',
};
