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
  /** Comma-separated international numbers (no +), e.g. 226...,221... */
  DEV_NUMBERS: process.env.DEV_NUMBERS || '',
  /** Comma-separated group JIDs (@g.us) with limited bot access */
  RESTRICTED_GROUPS: process.env.RESTRICTED_GROUPS || '',
  /** Extra numbers/JIDs allowed in restricted groups (besides devs) */
  RESTRICTED_GROUP_ALLOWLIST: process.env.RESTRICTED_GROUP_ALLOWLIST || '',
  /** Comma-separated group JIDs where autoreact is disabled */
  BLOCKED_AUTOREACT_GROUPS: process.env.BLOCKED_AUTOREACT_GROUPS || '',
  /** on/off — réaction emoji sur le message à l'exécution d'une commande (vide = activé) */
  COMMAND_REACT: process.env.COMMAND_REACT || '',
};
