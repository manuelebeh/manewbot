'use strict';

const dotenv = require('dotenv');

dotenv.config({ override: true });

module.exports = {
  PREFIXE: process.env.PREFIXE || '.',
  NOM_OWNER: process.env.NOM_OWNER || '',
  NUMERO_OWNER: process.env.NUMERO_OWNER || '',
  MODE: process.env.MODE || 'private',
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
  /** attp, ttp, effets image (ex. https://api-ovl.koyeb.app) */
  OVL_API_BASE: process.env.OVL_API_BASE || '',
  /** Amélioration image remini proxy (ex. https://www.itzky.xyz) */
  REMINI_API_BASE: process.env.REMINI_API_BASE || '',
  /** Stickers quotely (ex. https://bot.lyo.su) */
  QUOTELY_API_BASE: process.env.QUOTELY_API_BASE || '',
  /** Enhancement vyro fallback (ex. https://inferenceengine.vyro.ai) */
  VYRO_API_BASE: process.env.VYRO_API_BASE || '',
  /** Conversion webp→mp4 (défaut : https://ezgif.com) */
  EZGIF_API_BASE: process.env.EZGIF_API_BASE || 'https://ezgif.com',
  /** Bot Telegram (commande owner tgs) — ne jamais committer */
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  /** Proxy YouTube (recherche + download), ex. https://you-tube-dl-psi.vercel.app */
  YOUTUBE_DL_API_BASE:
    process.env.YOUTUBE_DL_API_BASE || 'https://you-tube-dl-psi.vercel.app',
  /** API paroles (commande lyrics) */
  LYRICS_API_BASE: process.env.LYRICS_API_BASE || 'https://api.delirius.store',
  /** Chatbot HTTP API (vide = chatbot désactivé côté réseau) */
  CHATBOT_API_BASE: process.env.CHATBOT_API_BASE || '',
  WAIFU_PICS_API_BASE: process.env.WAIFU_PICS_API_BASE || 'https://api.waifu.pics/sfw',
  CATBOX_UPLOAD_URL: process.env.CATBOX_UPLOAD_URL || 'https://catbox.moe/user/api.php',
  DEFAULT_AVATAR_URL: process.env.DEFAULT_AVATAR_URL || 'https://files.catbox.moe/ulwqtr.jpg',
  THEME_LIST_IMAGE_URL:
    process.env.THEME_LIST_IMAGE_URL || 'https://files.catbox.moe/6xlk10.jpg',
  EPHOTO360_BASE: process.env.EPHOTO360_BASE || 'https://en.ephoto360.com',
  GITHUB_KOPEL_JSON_URL:
    process.env.GITHUB_KOPEL_JSON_URL ||
    'https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json',
  WELCOME_IMAGE_URL:
    process.env.WELCOME_IMAGE_URL || 'https://files.catbox.moe/82g8ey.jpg',
  BOT_INFO_IMAGE_URL:
    process.env.BOT_INFO_IMAGE_URL || 'https://files.catbox.moe/lojrxz.jpg',
  VIDEO_QUOTE_PLACEHOLDER_URL:
    process.env.VIDEO_QUOTE_PLACEHOLDER_URL || 'https://files.catbox.moe/8kvevz.jpg',
};
