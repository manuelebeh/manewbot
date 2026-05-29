'use strict';

const { registerCommand } = require('../../lib/commands');
const { Sudo } = require('../../database/sudo');
const { requireOwner, ownerReply } = require('../../lib/require-owner');

const OWNER_DENIED = "Vous n'avez pas le droit d'exécuter cette commande.";

async function resolveTarget(ctx, sock, chatJid) {
  const { getJid, auteur_Msg_Repondu, arg } = ctx;
  const raw =
    auteur_Msg_Repondu || (arg[0]?.includes('@') && arg[0].replace('@', '') + '@lid');
  return getJid(raw, chatJid, sock);
}

registerCommand(
  {
    nom_cmd: 'setsudo',
    classe: 'Owner',
    react: '🔒',
    desc: 'Ajoute un utilisateur dans la liste des utilisateurs sudo.',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, ownerJid, ms } = ctx;
    if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;

    const targetJid = await resolveTarget(ctx, sock, chatJid);
    if (!targetJid) {
      return repondre("Veuillez mentionner un utilisateur valide pour l'ajouter à la liste sudo.");
    }
    if (ownerJid && targetJid === ownerJid) {
      return repondre("Le propriétaire du bot a déjà tous les droits ; inutile de l'ajouter en sudo.");
    }

    try {
      const [row] = await Sudo.findOrCreate({
        where: { id: targetJid },
        defaults: { id: targetJid },
      });
      if (!row._options.isNewRecord) {
        return ownerReply(
          sock,
          chatJid,
          ms,
          "L'utilisateur @" + targetJid.split('@')[0] + ' est déjà un utilisateur sudo.',
          { mentions: [targetJid] }
        );
      }
      return ownerReply(
        sock,
        chatJid,
        ms,
        "Utilisateur @" +
          targetJid.split('@')[0] +
          " ajouté avec succès en tant qu'utilisateur sudo.",
        { mentions: [targetJid] }
      );
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande setsudo :", err);
      return repondre("Une erreur est survenue lors de l'ajout de l'utilisateur sudo.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'sudolist',
    classe: 'Owner',
    react: '📋',
    desc: 'Affiche la liste des utilisateurs sudo.',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, ms } = ctx;
    if (
      !requireOwner(ctx, () =>
        ownerReply(sock, chatJid, ms, "Vous n'avez pas la permission d'exécuter cette commande.")
      )
    ) {
      return;
    }

    try {
      const records = await Sudo.findAll();
      if (!records.length) {
        return repondre("Aucun utilisateur sudo n'est actuellement enregistré.");
      }
      const lines = records
        .map((row, index) => '🔹 *' + (index + 1) + '.* @' + row.id.split('@')[0])
        .join('\n');
      const text =
        '✨ *Liste des utilisateurs sudo* ✨\n\n*Total*: ' + records.length + '\n\n' + lines;
      return sock.sendMessage(
        chatJid,
        { text, mentions: records.map((row) => row.id) },
        { quoted: ms }
      );
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande sudolist :", err);
      return repondre("Une erreur est survenue lors de l'affichage de la liste des utilisateurs sudo.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'delsudo',
    classe: 'Owner',
    react: '❌',
    desc: 'Supprime un utilisateur de la liste des utilisateurs sudo.',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, ownerJid, ms } = ctx;
    if (!requireOwner(ctx, () => ownerReply(sock, chatJid, ms, OWNER_DENIED))) return;

    const targetJid = await resolveTarget(ctx, sock, chatJid);
    if (!targetJid) {
      return repondre('Veuillez mentionner un utilisateur');
    }
    if (ownerJid && targetJid === ownerJid) {
      return repondre('Le propriétaire du bot ne peut pas être retiré de la liste sudo.');
    }

    try {
      const deletedCount = await Sudo.destroy({ where: { id: targetJid } });
      if (deletedCount === 0) {
        return ownerReply(
          sock,
          chatJid,
          ms,
          "L'utilisateur @" + targetJid.split('@')[0] + " n'est pas un utilisateur sudo.",
          { mentions: [targetJid] }
        );
      }
      return ownerReply(
        sock,
        chatJid,
        ms,
        "Utilisateur @" + targetJid.split('@')[0] + ' supprimé avec succès de la liste sudo.',
        { mentions: [targetJid] }
      );
    } catch (err) {
      console.error("Erreur lors de l'exécution de la commande delsudo :", err);
      return repondre("Une erreur est survenue lors de la suppression de l'utilisateur de la liste sudo.");
    }
  }
);
