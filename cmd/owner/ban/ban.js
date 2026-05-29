'use strict';

const { registerCommand } = require('../../../lib/commands');
const { Bans, OnlyAdmins } = require('../../../database/ban');
const { requireOwner, ownerReply } = require('../../../lib/require-owner');
const { resolveTarget } = require('./resolve-target');

const OWNER_DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

registerCommand(
  {
    nom_cmd: 'ban',
    classe: 'Owner',
    react: '🚫',
    desc: 'Bannir un utilisateur des commandes du bot',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, ms, getJid, ownerJid } = ctx;
    try {
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;

      const targetJid = await resolveTarget(ctx, sock, chatJid);
      if (!targetJid) {
        return repondre('Mentionnez un utilisateur valide à bannir.');
      }
      if (ownerJid && targetJid === ownerJid) {
        return ownerReply(sock, chatJid, ms, 'Vous ne pouvez pas bannir le propriétaire du bot.');
      }

      const [row] = await Bans.findOrCreate({
        where: { id: targetJid },
        defaults: { id: targetJid, type: 'user' },
      });
      if (!row._options.isNewRecord) {
        return repondre('Cet utilisateur est déjà banni !');
      }

      return ownerReply(sock, chatJid, ms, 'Utilisateur @' + targetJid.split('@')[0] + ' banni avec succès.', {
        mentions: [targetJid],
      });
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande ban :", err);
      return repondre("Une erreur s'est produite.");
    }
  }
);
