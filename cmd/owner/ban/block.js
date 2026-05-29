'use strict';

const { registerCommand } = require('../../../lib/commands');
const { Bans, OnlyAdmins } = require('../../../database/ban');
const { requireOwner, ownerReply } = require('../../../lib/require-owner');
const OWNER_DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

registerCommand(
  {
    nom_cmd: 'block',
    classe: 'Owner',
    react: '⛔',
    desc: 'Bloquer un utilisateur par son JID',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, verif_Groupe } = ctx;
    if (verif_Groupe) {
      return repondre("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
    }
    if (!requireOwner(ctx, () => repondre(OWNER_DENIED))) return;
    try {
      await sock.updateBlockStatus(chatJid, 'block');
      repondre('✅ Utilisateur bloqué avec succès.');
    } catch (err) {
      console.error('Erreur block:', err);
      repondre("Impossible de bloquer l'utilisateur.");
    }
  }
);
