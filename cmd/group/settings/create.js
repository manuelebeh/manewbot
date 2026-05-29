'use strict';

const { registerCommand } = require('../../../lib/commands');

registerCommand({
  nom_cmd: "gcreate",
  classe: "Groupe",
  react: "✅",
  desc: "Crée un groupe avec juste toi comme membre."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    isOwner,
    ms
  } = ctx;
  if (!isOwner) {
    return sock.sendMessage(chatJid, {
      text: "❌ Seul le propriétaire du bot peut créer un groupe."
    }, {
      quoted: ms
    });
  }
  if (arg.length === 0) {
    return sock.sendMessage(chatJid, {
      text: "⚠️ Veuillez fournir un nom pour le groupe. Exemple : *gcreate MonGroupe*"
    }, {
      quoted: ms
    });
  }
  const text = arg.join(" ");
  try {
    const value = await sock.groupCreate(text, []);
    await sock.sendMessage(value.id, {
      text: "🎉 Groupe *\"" + text + "\"* créé avec succès !"
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("❌ Erreur lors de la création du groupe :", err);
    await sock.sendMessage(chatJid, {
      text: "❌ Une erreur est survenue lors de la création du groupe."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "gdesc",
  classe: "Groupe",
  react: "🔤",
  desc: "Permet de changer la description d'un groupe"
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
        text: "Entrez la nouvelle description."
      }, {
        quoted: ms
      });
    }
    await sock.groupUpdateDescription(chatJid, item);
  } else {
    sock.sendMessage(chatJid, {
      text: "je n'ai pas les droits requis pour exécuter cette commande"
    }, {
      quoted: ms
    });
  }
});
