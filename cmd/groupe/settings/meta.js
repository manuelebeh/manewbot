'use strict';

const { registerCommand } = require('./_shared');

registerCommand({
  nom_cmd: "gname",
  classe: "Groupe",
  react: "🔤",
  desc: "Permet de changer le nom d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    msg_Repondu,
    arg,
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
    let item;
    if (msg_Repondu) {
      item = msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text;
    } else if (arg) {
      item = arg.join(" ");
    } else {
      return sock.sendMessage(chatJid, {
        text: "Entrez un nouveau nom"
      }, {
        quoted: ms
      });
    }
    await sock.groupUpdateSubject(chatJid, item);
  } else {
    sock.sendMessage(chatJid, {
      text: "je n'ai pas les droits requis pour exécuter cette commande"
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "close",
  classe: "Groupe",
  react: "✅",
  desc: "Seuls les admins peuvent envoyer des messages"
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
  await sock.groupSettingUpdate(chatJid, "announcement");
  return sock.sendMessage(chatJid, {
    text: "Mode défini : seuls les admins peuvent envoyer des messages."
  }, {
    quoted: ms
  });
});
