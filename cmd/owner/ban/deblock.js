'use strict';

const { registerCommand } = require('../../../lib/commands');
const { Bans, OnlyAdmins } = require('../../../database/ban');
const { requireOwner, ownerReply } = require('../../../lib/require-owner');
const OWNER_DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

registerCommand(
  {
    nom_cmd: 'deblock',
    classe: 'Owner',
    react: '✅',
    desc: 'Débloquer un utilisateur par son JID',
  },
  async (chatJid, sock, ctx) => {
    const { verif_Groupe, repondre } = ctx;
    if (verif_Groupe) {
      return repondre("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
    }
    if (!requireOwner(ctx, () => repondre(OWNER_DENIED))) return;
    try {
      await sock.updateBlockStatus(chatJid, 'unblock');
      repondre('✅ Utilisateur débloqué avec succès.');
    } catch (err) {
      console.error('Erreur deblock:', err);
      repondre("Impossible de débloquer l'utilisateur.");
    }
  }
);
