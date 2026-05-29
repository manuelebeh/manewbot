'use strict';

const { registerCommand } = require('./register');
const { config, WA_CONF, stylize } = require('./deps');
const { sendThemedCaption } = require('../../lib/menu-helpers');

registerCommand({
  nom_cmd: 'test',
  classe: 'Outils',
  react: '🌟',
  desc: 'Tester la connectivité du bot',
}, async (chatJid, sock, ctx) => {
  const { ms } = ctx;
  const caption =
    '🌐 Bienvenue sur *Manewbot*, votre bot WhatsApp multi-device.\n' +
    '🔍 Tapez *' +
    config.PREFIXE +
    'allmenu* pour voir toutes les commandes disponibles.\n' +
    '> ©2025 Manewbot by *Manewbie*';

  try {
    await sendThemedCaption(sock, chatJid, ms, caption, stylize, WA_CONF);
  } catch (err) {
    console.error('Erreur dans test:', err);
    const fallback =
      '🌐 Bienvenue sur *Manewbot*, votre bot WhatsApp multi-device.\n' +
      '🔍 Tapez *' +
      config.PREFIXE +
      'menu* pour voir toutes les commandes disponibles.\n' +
      '> ©2025 Manewbot by *Manewbie*';
    await sock.sendMessage(chatJid, { text: stylize(fallback) }, { quoted: ms });
  }
});
