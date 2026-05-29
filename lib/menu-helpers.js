'use strict';

const fs = require('fs');
const path = require('path');

const THEME_JSON_PATH = path.join(__dirname, 'theme.json');

function formatUptime(seconds = process.uptime()) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds / 3600) % 24);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const parts = [];
  if (days > 0) parts.push(`${days}J`);
  if (hours > 0) parts.push(`${hours}H`);
  if (minutes > 0) parts.push(`${minutes}M`);
  if (secs > 0) parts.push(`${secs}S`);
  return parts.join(' ') || '0S';
}

function groupCommandsByClass(commandList) {
  const options = {};
  for (const entry of commandList) {
    if (!options[entry.classe]) options[entry.classe] = [];
    options[entry.classe].push(entry);
  }
  const keys = Object.keys(options).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: 'base' })
  );
  for (const key of keys) {
    options[key].sort((a, b) =>
      a.nom_cmd.localeCompare(b.nom_cmd, undefined, { numeric: true })
    );
  }
  return { options, keys };
}

function buildStatusHeader(config, pkg, commandCount) {
  const now = new Date();
  return (
    `╭──⟪ ${config.NOM_BOT} ⟫──╮\n` +
    `├ ߷ Préfixe       : ${config.PREFIXE}\n` +
    `├ ߷ Owner         : ${config.NOM_OWNER}\n` +
    `├ ߷ Commandes     : ${commandCount}\n` +
    `├ ߷ Uptime        : ${formatUptime()}\n` +
    `├ ߷ Date          : ${now.toLocaleDateString('fr-FR')}\n` +
    `├ ߷ Heure         : ${now.toLocaleTimeString('fr-FR')}\n` +
    `├ ߷ Plateforme    : ${process.platform}\n` +
    `├ ߷ Développeur   : ${config.NOM_OWNER}\n` +
    `├ ߷ Version       : ${pkg.version}\n` +
    '╰──────────────────╯\n'
  );
}

function resolveThemeMediaUrl(waConfRecord) {
  const fileData = fs.readFileSync(THEME_JSON_PATH, 'utf8');
  const parsed = JSON.parse(fileData);
  const mention = waConfRecord.mention;

  if (mention.startsWith('[')) {
    const urls = JSON.parse(mention);
    return urls[Math.floor(Math.random() * urls.length)];
  }
  if (mention.startsWith('http://') || mention.startsWith('https://')) {
    const urls = JSON.parse(mention);
    return urls[Math.floor(Math.random() * urls.length)];
  }
  const theme = parsed.find((entry) => entry.id === mention);
  if (!theme?.theme?.length) {
    throw new Error('Thème introuvable');
  }
  return theme.theme[Math.floor(Math.random() * theme.theme.length)];
}

async function ensureWaConf(WA_CONF) {
  const [record] = await WA_CONF.findOrCreate({
    where: { id: '1' },
    defaults: { id: '1', mention: '1' },
  });
  return record;
}

async function sendThemedCaption(sock, chatJid, ms, caption, stylize, WA_CONF) {
  const record = await ensureWaConf(WA_CONF);
  const styled = stylize(caption);

  try {
    const item = resolveThemeMediaUrl(record);
    if (item?.endsWith('.mp4')) {
      await sock.sendMessage(
        chatJid,
        { video: { url: item }, caption: styled, gifPlayback: true },
        { quoted: ms }
      );
      return;
    }
    if (item) {
      await sock.sendMessage(
        chatJid,
        { image: { url: item }, caption: styled },
        { quoted: ms }
      );
      return;
    }
  } catch {
    /* fallback texte */
  }

  await sock.sendMessage(chatJid, { text: styled }, { quoted: ms });
}

module.exports = {
  formatUptime,
  groupCommandsByClass,
  buildStatusHeader,
  resolveThemeMediaUrl,
  ensureWaConf,
  sendThemedCaption,
};
