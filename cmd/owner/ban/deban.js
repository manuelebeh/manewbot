'use strict';

const { registerCommand } = require('../../../lib/commands');
const { Bans, OnlyAdmins } = require('../../../database/ban');
const { requireOwner, ownerReply } = require('../../../lib/require-owner');
const { resolveTarget } = require('./resolve-target');

const OWNER_DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

registerCommand(
  {
    nom_cmd: 'deban',
    classe: 'Owner',
    react: '🚫',
    desc: 'Débannir un utilisateur des commandes du bot',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, ms, getJid } = ctx;
    try {
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;

      const targetJid = await resolveTarget(ctx, sock, chatJid);
      if (!targetJid) {
        return repondre('Mentionnez un utilisateur valide à débannir.');
      }

      const deletedCount = await Bans.destroy({ where: { id: targetJid, type: 'user' } });
      if (deletedCount === 0) {
        return repondre("Cet utilisateur n'est pas banni.");
      }

      return ownerReply(
        sock,
        chatJid,
        ms,
        'Utilisateur @' + targetJid.split('@')[0] + ' débanni avec succès.',
        { mentions: [targetJid] }
      );
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande debannir :", err);
      return repondre("Une erreur s'est produite.");
    }
  }
);
