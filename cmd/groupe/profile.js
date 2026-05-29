'use strict';

const { registerCommand } = require('../../lib/commands');

registerCommand({
  nom_cmd: "getpp",
  classe: "Groupe",
  react: "🔎",
  desc: "Affiche la pp d'un groupe",
  alias: ["gpp"]
}, async (chatJid, sock, ctx) => {
  try {
    const profilePic = await sock.profilePictureUrl(chatJid, "image");
    await sock.sendMessage(chatJid, {
      image: {
        url: profilePic
      }
    }, {
      quoted: ctx.ms
    });
  } catch (err) {
    console.error("Erreur lors de l'obtention de la photo de profil :", err);
    await sock.sendMessage(chatJid, "Désolé, je n'ai pas pu obtenir la photo de profil du groupe.", {
      quoted: ctx.ms
    });
  }
});
registerCommand({
  nom_cmd: "updatepp",
  classe: "Groupe",
  react: "🎨",
  desc: "Commande pour changer la photo de profil d'un groupe",
  alias: ["upp"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    verif_Groupe,
    msg_Repondu,
    verif_Admin,
    isSudo,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Admin && !isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas les permissions requises pour modifier la photo du groupe."
    }, {
      quoted: ms
    });
  }
  if (!verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: ms
    });
  }
  if (!msg_Repondu || !msg_Repondu.imageMessage) {
    return sock.sendMessage(chatJid, {
      text: "Mentionnez une image."
    }, {
      quoted: ms
    });
  }
  try {
    if (msg_Repondu?.imageMessage) {
      const mediaPath = await sock.dl_save_media_ms(msg_Repondu.imageMessage);
      await sock.updateProfilePicture(chatJid, {
        url: mediaPath
      });
      sock.sendMessage(chatJid, {
        text: "✅ La photo de profil du groupe a été mise à jour avec succès."
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    console.error("Erreur lors du changement de PP :", err);
    sock.sendMessage(chatJid, {
      text: "❌ Une erreur est survenue lors de la modification de la photo du groupe."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "removepp",
  classe: "Groupe",
  react: "🗑️",
  desc: "Commande pour supprimer la photo de profil d'un groupe",
  alias: ["rpp"]
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Admin,
    isSudo,
    verif_Bot_Admin,
    ms
  } = ctx;
  if (!verif_Admin && !isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas les permissions requises pour supprimer la photo du groupe."
    }, {
      quoted: ms
    });
  }
  if (!verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: ms
    });
  }
  try {
    await sock.removeProfilePicture(chatJid);
    sock.sendMessage(chatJid, {
      text: "✅ La photo de profil du groupe a été supprimée avec succès."
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de la suppression de la PP :", err);
    sock.sendMessage(chatJid, {
      text: "❌ Une erreur est survenue lors de la suppression de la photo du groupe."
    }, {
      quoted: ms
    });
  }
});
