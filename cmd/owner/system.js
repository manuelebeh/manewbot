'use strict';

const { registerCommand } = require('../../lib/commands');
const { requireOwner, ownerReply } = require('../../lib/require-owner');

registerCommand(
  {
    nom_cmd: 'jid',
    classe: 'Owner',
    react: '🆔',
    desc: "Fournit le JID d'une personne ou d'un groupe",
  },
  async (chatJid, sock, ctx) => {
    const { repondre, auteur_Msg_Repondu, arg, getJid } = ctx;
    if (!requireOwner(ctx, () => repondre('Seuls les utilisateurs sudo peuvent utiliser cette commande'))) {
      return;
    }

    const raw =
      auteur_Msg_Repondu || (arg[0]?.includes('@') && arg[0].replace('@', '') + '@lid');
    const jid = raw ? await getJid(raw, chatJid, sock) : chatJid;
    repondre(jid);
  }
);

registerCommand(
  {
    nom_cmd: 'restart',
    classe: 'Owner',
    desc: 'Redémarre le bot',
  },
  async (chatJid, sock, ctx) => {
    const { ms } = ctx;
    if (
      !requireOwner(ctx, () =>
        ownerReply(sock, chatJid, ms, "Vous n'avez pas la permission d'utiliser cette commande.")
      )
    ) {
      return;
    }

    await ownerReply(sock, chatJid, ms, '♻️ Redémarrage du bot en cours...');
    setTimeout(() => process.exit(0), 1000);
  }
);
