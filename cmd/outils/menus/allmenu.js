'use strict';

const { registerCommand, cmd } = require('../register');
const { fs, config, pkg, stylize, WA_CONF } = require('../deps');
const {
  groupCommandsByClass,
  buildStatusHeader,
  sendThemedCaption,
} = require('../../../lib/menu-helpers');

registerCommand({
  nom_cmd: "allmenu",
  classe: "Outils",
  react: "📜",
  desc: "Affiche toutes les commandes du bot"
}, async (chatJid, sock, ctx) => {
  const { ms } = ctx;
  try {
    const { options, keys } = groupCommandsByClass(cmd);
    let body = buildStatusHeader(config, pkg, cmd.length);

    for (const key of keys) {
      body += `╭──⟪ ${key.toUpperCase()} ⟫──╮\n`;
      options[key].forEach((entry) => {
        body += `├ ߷ ${entry.nom_cmd}\n`;
      });
      body += '╰──────────────────╯\n\n';
    }
    body += '> ©2025 Manewbot by *Manewbie*';

    await sendThemedCaption(sock, chatJid, ms, body, stylize, WA_CONF);
  } catch (err) {
    console.error('Erreur allmenu:', err);
    await sock.sendMessage(
      chatJid,
      { text: 'Une erreur est survenue lors de l\'affichage du menu complet.' },
      { quoted: ms }
    );
  }
});
