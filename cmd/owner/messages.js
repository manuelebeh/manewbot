'use strict';

const { registerCommand } = require('../../lib/commands');
const { requireOwner } = require('../../lib/require-owner');

registerCommand(
  {
    nom_cmd: 'delete',
    classe: 'Owner',
    react: '🗑️',
    desc: 'Supprimer un message.',
    alias: ['del', 'dlt'],
  },
  async (chatJid, sock, ctx) => {
    const {
      msg_Repondu,
      ms,
      auteur_Msg_Repondu,
      mtype,
      verif_Admin,
      verif_Bot_Admin,
      verif_Groupe,
      isOwner,
      isSudo,
      ownerJid,
      sudoJids,
      privilegedJids,
      repondre,
      id_Bot,
    } = ctx;

    if (!msg_Repondu) {
      return repondre('Veuillez répondre à un message pour le supprimer.');
    }
    if (ownerJid && auteur_Msg_Repondu === ownerJid && !isOwner) {
      return repondre('Vous ne pouvez pas supprimer le message du propriétaire du bot.');
    }
    if (sudoJids.includes(auteur_Msg_Repondu) && !isOwner) {
      return repondre("Seul le propriétaire du bot peut supprimer le message d'un utilisateur sudo.");
    }
    if (privilegedJids.includes(auteur_Msg_Repondu) && !isOwner && !isSudo) {
      return repondre("Vous ne pouvez pas supprimer le message d'un utilisateur privilégié.");
    }
    if (verif_Groupe) {
      if (!verif_Admin) {
        return repondre('Vous devez être administrateur pour supprimer un message dans le groupe.');
      }
      if (!verif_Bot_Admin) {
        return repondre('Je dois être administrateur pour effectuer cette action.');
      }
    } else if (!isOwner && !isSudo) {
      return repondre(
        'Seuls le propriétaire ou un utilisateur sudo peuvent utiliser cette commande en privé.'
      );
    }

    try {
      const options = {
        remoteJid: chatJid,
        fromMe: auteur_Msg_Repondu == id_Bot,
        id: ms.message?.[mtype]?.contextInfo?.stanzaId,
        ...(verif_Groupe && { participant: auteur_Msg_Repondu }),
      };
      if (!options.id) {
        return repondre("Impossible de trouver l'ID du message à supprimer.");
      }
      await sock.sendMessage(chatJid, { delete: options });
    } catch (err) {
      repondre('Erreur : ' + err.message);
    }
  }
);

registerCommand(
  {
    nom_cmd: 'clear',
    classe: 'Owner',
    react: '🧹',
    desc: 'Supprime tous les messages dans cette discussion',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, ms } = ctx;
    try {
      if (!requireOwner(ctx, () => repondre("🔒 Vous n'avez pas le droit d'exécuter cette commande."))) {
        return;
      }
      await sock.chatModify(
        {
          delete: true,
          lastMessages: [{ key: ms.key, messageTimestamp: ms.messageTimestamp }],
        },
        chatJid
      );
      await repondre('🧹 Tous les messages ont été supprimés avec succès.');
    } catch (err) {
      console.error('Erreur lors de la suppression :', err);
      repondre('❌ Erreur lors de la suppression des messages.');
    }
  }
);
