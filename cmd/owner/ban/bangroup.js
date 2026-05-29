'use strict';

const { registerCommand } = require('../../../lib/commands');
const { Bans, OnlyAdmins } = require('../../../database/ban');
const { requireOwner, ownerReply } = require('../../../lib/require-owner');
const { resolveTarget } = require('./resolve-target');

const OWNER_DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

registerCommand(
  {
    nom_cmd: 'bangroup',
    classe: 'Owner',
    react: '🚫',
    desc: 'Bannir un groupe des commandes du bot',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, verif_Groupe, ms } = ctx;
    try {
      if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;
      if (!verif_Groupe) {
        return repondre('Cette commande fonctionne uniquement dans les groupes.');
      }

      const [row] = await Bans.findOrCreate({
        where: { id: chatJid },
        defaults: { id: chatJid, type: 'group' },
      });
      if (!row._options.isNewRecord) {
        return repondre('Ce groupe est déjà banni !');
      }
      return repondre('Groupe banni avec succès.');
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande bangroup :", err);
      return repondre("Une erreur s'est produite.");
    }
  }
);
