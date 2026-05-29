'use strict';

const { registerCommand } = require('./_shared');

registerCommand({
  nom_cmd: "open",
  classe: "Groupe",
  react: "✅",
  desc: "Tout le monde peut envoyer des messages"
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
  if (!verif_Admin || !verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  await sock.groupSettingUpdate(chatJid, "not_announcement");
  return sock.sendMessage(chatJid, {
    text: "Mode défini : tout le monde peut envoyer des messages."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "lock",
  classe: "Groupe",
  react: "✅",
  desc: "Tout le monde peut modifier les paramètres du groupe"
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
  if (!verif_Admin || !verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  await sock.groupSettingUpdate(chatJid, "unlocked");
  return sock.sendMessage(chatJid, {
    text: "Mode défini : tout le monde peut modifier les paramètres du groupe."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "unlock",
  classe: "Groupe",
  react: "✅",
  desc: "Seuls les admins peuvent modifier les paramètres du groupe"
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
  if (!verif_Admin || !verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  await sock.groupSettingUpdate(chatJid, "locked");
  return sock.sendMessage(chatJid, {
    text: "Mode défini : seuls les admins peuvent modifier les paramètres du groupe."
  }, {
    quoted: ms
  });
});
