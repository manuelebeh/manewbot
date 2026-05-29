'use strict';

const { registerCommand } = require('../../lib/commands');
const { requireOwner } = require('../../lib/require-owner');
const {
  set_stick_cmd,
  del_stick_cmd,
  get_stick_cmd,
} = require('../../database/stick_cmd');

registerCommand(
  {
    nom_cmd: 'addstickcmd',
    classe: 'Owner',
    react: '✨',
    alias: ['setstickcmd', 'addcmd', 'setcmd'],
    desc: 'Associer une commande à un sticker (réponds à un sticker)',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, msg_Repondu, arg } = ctx;
    if (!requireOwner(ctx, () => repondre('Pas autorisé.'))) return;

    const cmdName = arg[0];
    if (!cmdName) {
      return repondre('Tu dois donner un nom à la commande.\nExemple : `addstickcmd test`');
    }
    if (!msg_Repondu?.stickerMessage?.url) {
      return repondre('Tu dois répondre à un *sticker* pour l\'enregistrer.');
    }

    const hash = msg_Repondu.stickerMessage.fileSha256?.toString('base64');
    try {
      await set_stick_cmd(cmdName.toLowerCase(), hash);
      repondre('✅ Le sticker a été associé à la commande *' + cmdName + '*');
    } catch (err) {
      console.error(err);
      repondre("Erreur lors de l'enregistrement.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'delstickcmd',
    classe: 'Owner',
    react: '🗑️',
    alias: ['delcmd'],
    desc: 'Supprimer une commande sticker',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, arg } = ctx;
    if (!requireOwner(ctx, () => repondre('Pas autorisé.'))) return;

    const cmdName = arg[0];
    if (!cmdName) {
      return repondre('Exemple : `delstickcmd test`');
    }

    const deleted = await del_stick_cmd(cmdName.toLowerCase());
    repondre(
      deleted
        ? '🗑️ La commande *' + cmdName + '* a été supprimée.'
        : 'Aucune commande nommée *' + cmdName + '* trouvée.'
    );
  }
);

registerCommand(
  {
    nom_cmd: 'getstickcmd',
    classe: 'Owner',
    react: '📋',
    alias: ['getcmd'],
    desc: 'Liste des commandes stickers',
  },
  async (chatJid, sock, ctx) => {
    const { repondre } = ctx;
    if (!requireOwner(ctx, () => repondre('Pas autorisé.'))) return;

    const entries = await get_stick_cmd();
    if (!entries.length) {
      return repondre('Aucune commande sticker trouvée.');
    }

    let text = '*📌 Liste des commandes stickers :*\n\n';
    for (const { no_cmd: name } of entries) {
      text += '• *' + name + '*\n';
    }
    repondre(text);
  }
);
