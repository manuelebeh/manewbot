'use strict';

const { registerCommand } = require('../../../lib/commands');

registerCommand({
  nom_cmd: "leave",
  classe: "Groupe",
  react: "😐",
  desc: "Commande pour quitter un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    isOwner
  } = ctx;
  if (!isOwner) {
    return sock.sendMessage(chatJid, {
      text: "Seul le propriétaire du bot peut quitter un groupe."
    }, {
      quoted: ctx.ms
    });
  }
  await sock.sendMessage(chatJid, {
    text: "Sayonara"
  }, {
    quoted: ctx.ms
  });
  await sock.groupLeave(chatJid);
});
registerCommand({
  nom_cmd: "link",
  classe: "Groupe",
  react: "🔗",
  desc: "Permet d'obtenir le lien d'invitation d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (verif_Admin && verif_Bot_Admin) {
    const inviteCode = await sock.groupInviteCode(chatJid);
    await sock.sendMessage(chatJid, {
      text: "Lien d'invitation: https://chat.whatsapp.com/" + inviteCode
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "revoke",
  classe: "Groupe",
  react: "🔗",
  desc: "Réinitialise le lien d'invitation d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (verif_Admin && verif_Bot_Admin) {
    await sock.groupRevokeInvite(chatJid);
    await sock.sendMessage(chatJid, {
      text: "Le lien d'invitation a été Réinitialisé."
    }, {
      quoted: ms
    });
  }
});
