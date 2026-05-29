'use strict';

const { registerCommand, cmd } = require('../register');
const { fs, config, pkg, stylize, WA_CONF } = require('../deps');
const {
  groupCommandsByClass,
  buildStatusHeader,
  sendThemedCaption,
} = require('../../../lib/menu-helpers');

registerCommand({
  nom_cmd: "menu",
  classe: "Outils",
  react: "🔅",
  desc: "Affiche le menu du bot"
}, async (chatJid, sock, ctx) => {
  const { ms, arg } = ctx;
  try {
    const { options, keys } = groupCommandsByClass(cmd);
    let body = buildStatusHeader(config, pkg, cmd.length);

    if (arg.length === 0) {
      body += '╭───⟪ Catégories ⟫───╮\n';
      keys.forEach((key, index) => {
        body += `├ ߷ ${index + 1} • ${key}\n`;
      });
      body += '╰───────────────────╯\n';
      body +=
        `\n💡 Tape *${config.PREFIXE}menu <numéro>* ou *${config.PREFIXE}menu <nom>* pour voir les commandes d'une catégorie.\n` +
        `💡 Tape *${config.PREFIXE}allmenu* pour voir la liste de toutes les commandes disponibles.\n` +
        `📌 Exemples :\n• *${config.PREFIXE}menu 1*\n• *${config.PREFIXE}menu outils*\n\n` +
        '> ©2025 Manewbot by *Manewbie*';
    } else if (arg[0].toLowerCase() === 'allmenu') {
      body += '╭──⟪ Toutes les commandes ⟫──╮\n';
      cmd.forEach((entry) => {
        body += `├ ߷ [${entry.classe}] ${entry.nom_cmd}\n`;
      });
      body += '╰───────────────────────────╯\n';
    } else {
      const text = arg.join(' ').toLowerCase();
      let category = null;
      const amount = parseInt(text, 10);
      if (!isNaN(amount)) {
        if (amount < 1 || amount > keys.length) {
          return sock.sendMessage(
            chatJid,
            { text: `Catégorie introuvable : ${arg[0]}` },
            { quoted: ms }
          );
        }
        category = keys[amount - 1];
      } else {
        category = keys.find((key) => key.toLowerCase() === text);
        if (!category) {
          return sock.sendMessage(
            chatJid,
            { text: `Catégorie introuvable : ${arg.join(' ')}` },
            { quoted: ms }
          );
        }
      }
      body += `╭────⟪ ${category.toUpperCase()} ⟫────╮\n`;
      options[category].forEach((entry) => {
        body += `├ ߷ ${entry.nom_cmd}\n`;
      });
      body += `╰──────────────────╯\n\nTape *${config.PREFIXE}menu* pour revenir au menu principal.`;
    }

    await sendThemedCaption(sock, chatJid, ms, body, stylize, WA_CONF);
  } catch (err) {
    console.error('Erreur menu:', err);
    await sock.sendMessage(
      chatJid,
      { text: 'Une erreur est survenue lors de la génération du menu.' },
      { quoted: ms }
    );
  }
});
