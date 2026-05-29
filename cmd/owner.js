const {
  exec
} = require("child_process");
const {
  registerCommand
} = require("../lib/commands");
const {
  Bans,
  OnlyAdmins
} = require("../database/ban");
const {
  Sudo
} = require("../database/sudo");
const config = require("../set");
const axios = require("axios");
const {
  Sticker,
  StickerTypes
} = require("wa-sticker-formatter");
const cheerio = require("cheerio");
const {
  WA_CONF,
  WA_CONF2
} = require("../database/wa_conf");
const {
  ChatbotConf
} = require("../database/chatbot");
const path = require("path");
const fs = require("fs");
const {
  saveSecondSession,
  getSecondAllSessions,
  deleteSecondSession
} = require("../database/connect");
const {
  setMention,
  delMention,
  getMention
} = require("../database/mention");
const {
  set_stick_cmd,
  del_stick_cmd,
  get_stick_cmd
} = require("../database/stick_cmd");
const {
  set_cmd,
  del_cmd,
  list_cmd
} = require("../database/public_private_cmd");
const {
  Plugin
} = require("../database/plugin");
const {
  extractNpmModules,
  installModules,
  reloadCommands
} = require("../lib/plugin");
const {
  Levelup
} = require("../database/rank");
registerCommand({
  nom_cmd: "delete",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprimer un message.",
  alias: ["del", "dlt"]
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms,
    auteur_Msg_Repondu,
    mtype,
    verif_Admin,
    verif_Bot_Admin,
    verif_Groupe,
    dev_num,
    dev_id,
    repondre,
    id_Bot,
    isSudo
  } = ctx;
  if (!msg_Repondu) {
    return repondre("Veuillez répondre à un message pour le supprimer.");
  }
  if (dev_num.includes(auteur_Msg_Repondu) && !dev_id) {
    return repondre("Vous ne pouvez pas supprimer le message d'un développeur.");
  }
  if (verif_Groupe) {
    if (!verif_Admin) {
      return repondre("Vous devez être administrateur pour supprimer un message dans le groupe.");
    }
    if (!verif_Bot_Admin) {
      return repondre("Je dois être administrateur pour effectuer cette action.");
    }
  } else if (!isSudo) {
    return repondre("Seuls les utilisateurs sudo peuvent utiliser cette commande en privé.");
  }
  try {
    const options = {
      remoteJid: chatJid,
      fromMe: auteur_Msg_Repondu == id_Bot,
      id: ms.message?.[mtype]?.contextInfo?.stanzaId,
      ...(verif_Groupe && {
        participant: auteur_Msg_Repondu
      })
    };
    if (!options.id) {
      return repondre("Impossible de trouver l'ID du message à supprimer.");
    }
    await sock.sendMessage(chatJid, {
      delete: options
    });
  } catch (err) {
    repondre("Erreur : " + err.message);
  }
});
registerCommand({
  nom_cmd: "clear",
  classe: "Owner",
  react: "🧹",
  desc: "Supprime tous les messages dans cette discussion"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    ms,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("🔒 Vous n'avez pas le droit d'exécuter cette commande.");
    }
    await sock.chatModify({
      delete: true,
      lastMessages: [{
        key: ms.key,
        messageTimestamp: ms.messageTimestamp
      }]
    }, chatJid);
    await repondre("🧹 Tous les messages ont été supprimés avec succès.");
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    repondre("❌ Erreur lors de la suppression des messages.");
  }
});
registerCommand({
  nom_cmd: "block",
  classe: "Owner",
  react: "⛔",
  desc: "Bloquer un utilisateur par son JID"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    verif_Groupe,
    isSudo
  } = ctx;
  if (verif_Groupe) {
    return repondre("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
  }
  if (!isSudo) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    await sock.updateBlockStatus(chatJid, "block");
    repondre("✅ Utilisateur bloqué avec succès.");
  } catch (err) {
    console.error("Erreur block:", err);
    repondre("Impossible de bloquer l'utilisateur.");
  }
});
registerCommand({
  nom_cmd: "deblock",
  classe: "Owner",
  react: "✅",
  desc: "Débloquer un utilisateur par son JID"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    repondre,
    isSudo
  } = ctx;
  if (verif_Groupe) {
    return repondre("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
  }
  if (!isSudo) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    await sock.updateBlockStatus(chatJid, "unblock");
    repondre("✅ Utilisateur débloqué avec succès.");
  } catch (err) {
    console.error("Erreur deblock:", err);
    repondre("Impossible de débloquer l'utilisateur.");
  }
});
registerCommand({
  nom_cmd: "ban",
  classe: "Owner",
  react: "🚫",
  desc: "Bannir un utilisateur des commandes du bot"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    ms,
    arg,
    getJid,
    auteur_Msg_Repondu,
    isSudo,
    dev_num
  } = ctx;
  try {
    if (!isSudo) {
      return sock.sendMessage(ms_org, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    const value = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
    const value2 = await getJid(value, chatJid, sock);
    if (!value2) {
      return repondre("Mentionnez un utilisateur valide à bannir.");
    }
    if (dev_num.includes(value2)) {
      return sock.sendMessage(chatJid, {
        text: "Vous ne pouvez pas bannir un développeur."
      }, {
        quoted: ms
      });
    }
    const [tmp] = await Bans.findOrCreate({
      where: {
        id: value2
      },
      defaults: {
        id: value2,
        type: "user"
      }
    });
    if (!tmp._options.isNewRecord) {
      return repondre("Cet utilisateur est déjà banni !");
    }
    return sock.sendMessage(chatJid, {
      text: "Utilisateur @" + value2.split("@")[0] + " banni avec succès.",
      mentions: [value2]
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de l'exécution de la commande ban :", err);
    return repondre("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "levelup",
  classe: "Owner",
  react: "⚙️",
  desc: "Activer ou désactiver le message de level up"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    ms,
    arg
  } = ctx;
  try {
    if (!arg[0]) {
      return repondre("Veuillez préciser 'on' ou 'off'.");
    }
    const value = arg[0].toLowerCase();
    if (value !== "on" && value !== "off") {
      return repondre("Argument invalide, utilisez 'on' ou 'off'.");
    }
    const value2 = value === "on" ? "oui" : "non";
    let record = await Levelup.findOne({
      where: {
        id: 1
      }
    });
    if (!record) {
      record = await Levelup.create({
        id: 1,
        levelup: value2
      });
    } else {
      record.levelup = value2;
      await record.save();
    }
    return sock.sendMessage(chatJid, {
      text: "Le message de level up est maintenant " + (value2 === "oui" ? "activé" : "désactivé") + "."
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur commande levelup :", err);
    return repondre("Une erreur est survenue.");
  }
});
registerCommand({
  nom_cmd: "anticall",
  classe: "Owner",
  react: "📵",
  desc: "Active ou désactive le blocage automatique des appels."
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    ms,
    arg,
    isSudo
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  const record = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!arg[0]) {
    const value = record && record.anticall === "oui" ? "activé" : "désactivé";
    return sock.sendMessage(chatJid, {
      text: "Etat actuel de anticall : " + value + "\nUsage : anticall on/off"
    }, {
      quoted: ms
    });
  }
  const value2 = arg[0].toLowerCase();
  if (value2 !== "on" && value2 !== "off") {
    return repondre("Merci d'utiliser : anticall on ou anticall off");
  }
  if (!record) {
    await WA_CONF2.create({
      id: "1",
      anticall: value2 === "on" ? "oui" : "non"
    });
    return sock.sendMessage(chatJid, {
      text: "anticall est maintenant " + (value2 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: ms
    });
  }
  if (value2 === "on" && record.anticall === "oui" || value2 === "off" && record.anticall === "non") {
    return sock.sendMessage(chatJid, {
      text: "anticall est déjà " + (value2 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: ms
    });
  }
  record.anticall = value2 === "on" ? "oui" : "non";
  await record.save();
  return sock.sendMessage(chatJid, {
    text: "anticall est maintenant " + (value2 === "on" ? "activé" : "désactivé") + "."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "lecture_msg",
  classe: "Owner",
  react: "📖",
  desc: "Active ou désactive la lecture automatique des messages."
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    ms,
    arg,
    isSudo
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  const record = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!arg[0]) {
    const value = record && record.autoread_msg === "oui" ? "activé" : "désactivé";
    return sock.sendMessage(chatJid, {
      text: "Etat actuel de lecture_msg : " + value + "\nUsage : lecture_msg on/off"
    }, {
      quoted: ms
    });
  }
  const value2 = arg[0].toLowerCase();
  if (value2 !== "on" && value2 !== "off") {
    return repondre("Merci d'utiliser : lecture_msg on ou lecture_msg off");
  }
  if (!record) {
    await WA_CONF2.create({
      id: "1",
      autoread_msg: value2 === "on" ? "oui" : "non"
    });
    return sock.sendMessage(chatJid, {
      text: "lecture_msg est maintenant " + (value2 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: ms
    });
  }
  if (value2 === "on" && record.autoread_msg === "oui" || value2 === "off" && record.autoread_msg === "non") {
    return sock.sendMessage(chatJid, {
      text: "lecture_msg est déjà " + (value2 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: ms
    });
  }
  record.autoread_msg = value2 === "on" ? "oui" : "non";
  await record.save();
  return sock.sendMessage(chatJid, {
    text: "lecture_msg est maintenant " + (value2 === "on" ? "activé" : "désactivé") + "."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "react_msg",
  classe: "Owner",
  react: "🤖",
  desc: "Active ou désactive la réaction automatique aux messages."
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    ms,
    arg,
    isSudo
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  const record = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!arg[0]) {
    const value = record && record.autoreact_msg === "oui" ? "activé" : "désactivé";
    return sock.sendMessage(chatJid, {
      text: "Etat actuel de react_msg : " + value + "\nUsage : react_msg on/off"
    }, {
      quoted: ms
    });
  }
  const value2 = arg[0].toLowerCase();
  if (value2 !== "on" && value2 !== "off") {
    return repondre("Merci d'utiliser : react_msg on ou react_msg off");
  }
  if (!record) {
    await WA_CONF2.create({
      id: "1",
      autoreact_msg: value2 === "on" ? "oui" : "non"
    });
    return sock.sendMessage(chatJid, {
      text: "react_msg est maintenant " + (value2 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: ms
    });
  }
  if (value2 === "on" && record.autoreact_msg === "oui" || value2 === "off" && record.autoreact_msg === "non") {
    return sock.sendMessage(chatJid, {
      text: "react_msg est déjà " + (value2 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: ms
    });
  }
  record.autoreact_msg = value2 === "on" ? "oui" : "non";
  await record.save();
  return sock.sendMessage(chatJid, {
    text: "react_msg est maintenant " + (value2 === "on" ? "activé" : "désactivé") + "."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "deban",
  classe: "Owner",
  react: "🚫",
  desc: "Débannir un utilisateur des commandes du bot"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    getJid,
    auteur_Msg_Repondu,
    isSudo,
    ms
  } = ctx;
  try {
    if (!isSudo) {
      return sock.sendMessage(ms_org, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    const value = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
    const value2 = await getJid(value, chatJid, sock);
    if (!value2) {
      return repondre("Mentionnez un utilisateur valide à débannir.");
    }
    const deletedCount = await Bans.destroy({
      where: {
        id: value2,
        type: "user"
      }
    });
    if (deletedCount === 0) {
      return repondre("Cet utilisateur n'est pas banni.");
    }
    return sock.sendMessage(chatJid, {
      text: "Utilisateur @" + value2.split("@")[0] + " débanni avec succès.",
      mentions: [value2]
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de l'exécution de la commande debannir :", err);
    return repondre("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "bangroup",
  classe: "Owner",
  react: "🚫",
  desc: "Bannir un groupe des commandes du bot"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    verif_Groupe,
    isSudo,
    ms
  } = ctx;
  try {
    if (!isSudo) {
      return sock.sendMessage(ms_org, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    if (!verif_Groupe) {
      return repondre("Cette commande fonctionne uniquement dans les groupes.");
    }
    if (!chatJid) {
      return repondre("Impossible de récupérer l'identifiant du groupe.");
    }
    const [tmp] = await Bans.findOrCreate({
      where: {
        id: chatJid
      },
      defaults: {
        id: chatJid,
        type: "group"
      }
    });
    if (!tmp._options.isNewRecord) {
      return repondre("Ce groupe est déjà banni !");
    }
    return repondre("Groupe banni avec succès.");
  } catch (err) {
    console.error("Erreur lors de l'exécution de la commande bangroup :", err);
    return repondre("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "debangroup",
  classe: "Owner",
  react: "🚫",
  desc: "Débannir un groupe des commandes du bot"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    verif_Groupe,
    isSudo,
    ms
  } = ctx;
  try {
    if (!isSudo) {
      return sock.sendMessage(ms_org, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    if (!verif_Groupe) {
      return repondre("Cette commande fonctionne uniquement dans les groupes.");
    }
    if (!chatJid) {
      return repondre("Impossible de récupérer l'identifiant du groupe.");
    }
    const deletedCount = await Bans.destroy({
      where: {
        id: chatJid,
        type: "group"
      }
    });
    if (deletedCount === 0) {
      return repondre("Ce groupe n'est pas banni.");
    }
    return repondre("Groupe débanni avec succès.");
  } catch (err) {
    console.error("Erreur lors de l'exécution de la commande debangroup :", err);
    return repondre("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "onlyadmins",
  react: "🛡️",
  desc: "Activer ou désactiver le mode only-admins dans un groupe",
  classe: "Owner"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    verif_Groupe,
    ms,
    isSudo
  } = ctx;
  try {
    if (!verif_Groupe) {
      return repondre("❌ Cette commande ne fonctionne que dans un groupe.");
    }
    if (!isSudo) {
      return sock.sendMessage(chatJid, {
        text: "⛔ Vous n'avez pas l'autorisation d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    const value = arg[0]?.toLowerCase();
    if (!["add", "del"].includes(value)) {
      return repondre("❓ Utilisation : `onlyadmins add` pour activer, `onlyadmins del` pour désactiver.");
    }
    const record = await OnlyAdmins.findOne({
      where: {
        id: chatJid
      }
    });
    if (value === "add") {
      if (record) {
        return repondre("⚠️ Le mode only-admin est **déjà activé** pour ce groupe.");
      }
      await OnlyAdmins.create({
        id: chatJid
      });
      return repondre("✅ Mode only-admin **activé** pour ce groupe.");
    }
    if (value === "del") {
      if (!record) {
        return repondre("⚠️ Ce groupe **n'était pas en mode only-admin**.");
      }
      await OnlyAdmins.destroy({
        where: {
          id: chatJid
        }
      });
      return repondre("❌ Mode only-admin **désactivé** pour ce groupe.");
    }
  } catch (err) {
    console.error("Erreur onlyadmins:", err);
    return repondre("❌ Une erreur s'est produite. Veuillez réessayer.");
  }
});
registerCommand({
  nom_cmd: "setsudo",
  classe: "Owner",
  react: "🔒",
  desc: "Ajoute un utilisateur dans la liste des utilisateurs sudo."
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    getJid,
    auteur_Msg_Repondu,
    isSudo,
    ms
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  const value = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
  const value2 = await getJid(value, chatJid, sock);
  if (!value2) {
    return repondre("Veuillez mentionner un utilisateur valide pour l'ajouter à la liste sudo.");
  }
  try {
    const [tmp] = await Sudo.findOrCreate({
      where: {
        id: value2
      },
      defaults: {
        id: value2
      }
    });
    if (!tmp._options.isNewRecord) {
      return sock.sendMessage(chatJid, {
        text: "L'utilisateur @" + value2.split("@")[0] + " est déjà un utilisateur sudo.",
        mentions: [value2]
      }, {
        quoted: ms
      });
    }
    return sock.sendMessage(chatJid, {
      text: "Utilisateur @" + value2.split("@")[0] + " ajouté avec succès en tant qu'utilisateur sudo.",
      mentions: [value2]
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de l'exécution de la commande setsudo :", err);
    return repondre("Une erreur est survenue lors de l'ajout de l'utilisateur sudo.");
  }
});
registerCommand({
  nom_cmd: "sudolist",
  classe: "Owner",
  react: "📋",
  desc: "Affiche la liste des utilisateurs sudo."
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    isSudo,
    ms
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas la permission d'exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  try {
    const records = await Sudo.findAll();
    if (!records.length) {
      return repondre("Aucun utilisateur sudo n'est actuellement enregistré.");
    }
    const text = records.map((tmp, tmp2) => "🔹 *" + (tmp2 + 1) + ".* @" + tmp.id.split("@")[0]).join("\n");
    const url = "✨ *Liste des utilisateurs sudo* ✨\n\n*Total*: " + records.length + "\n\n" + text;
    return sock.sendMessage(chatJid, {
      text: url,
      mentions: records.map(tmp3 => tmp3.id)
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de l'exécution de la commande sudolist :", err);
    return repondre("Une erreur est survenue lors de l'affichage de la liste des utilisateurs sudo.");
  }
});
registerCommand({
  nom_cmd: "delsudo",
  classe: "Owner",
  react: "❌",
  desc: "Supprime un utilisateur de la liste des utilisateurs sudo."
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    getJid,
    arg,
    auteur_Msg_Repondu,
    isSudo,
    ms
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  const value = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
  const value2 = await getJid(value, chatJid, sock);
  if (!value2) {
    return repondre("Veuillez mentionner un utilisateur");
  }
  try {
    const deletedCount = await Sudo.destroy({
      where: {
        id: value2
      }
    });
    if (deletedCount === 0) {
      return sock.sendMessage(chatJid, {
        text: "L'utilisateur @" + value2.split("@")[0] + " n'est pas un utilisateur sudo.",
        mentions: [value2]
      }, {
        quoted: ms
      });
    }
    return sock.sendMessage(chatJid, {
      text: "Utilisateur @" + value2.split("@")[0] + " supprimé avec succès de la liste sudo.",
      mentions: [value2]
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de l'exécution de la commande delsudo :", err);
    return repondre("Une erreur est survenue lors de la suppression de l'utilisateur de la liste sudo.");
  }
});
registerCommand({
  nom_cmd: "tgs",
  classe: "Owner",
  react: "🔍",
  desc: "Importe des stickers Telegram sur WhatsApp"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    isSudo,
    ms
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "❌ Vous n'avez pas le droit d'exécuter cette commande."
    });
  }
  if (!arg[0]) {
    return repondre("Merci de fournir un lien de stickers Telegram valide.");
  }
  const value = arg[0];
  const value2 = value.split("/addstickers/")[1];
  if (!value2) {
    return repondre("❌ Lien incorrect.");
  }
  const url = "8408302436:AAFAKAtwCOywhSW0vqm9VNK71huTi8pUp1k";
  const url2 = "https://api.telegram.org/bot" + url + "/getStickerSet?name=" + value2;
  try {
    const {
      data: tmp
    } = await axios.get(url2);
    const value3 = tmp.result.stickers;
    if (!value3 || value3.length === 0) {
      return repondre("Aucun sticker trouvé dans cet ensemble.");
    }
    repondre("✅ Nom du pack: " + tmp.result.name + "\nType : " + (tmp.result.is_animated ? "animés" : "statiques") + "\nTotal : " + value3.length + " stickers\n");
    for (const tmp2 of value3) {
      const response = await axios.get("https://api.telegram.org/bot" + url + "/getFile?file_id=" + tmp2.file_id);
      const value4 = await axios({
        method: "get",
        url: "https://api.telegram.org/file/bot" + url + "/" + response.data.result.file_path,
        responseType: "arraybuffer"
      });
      const sticker = new Sticker(value4.data, {
        pack: config.STICKER_PACK_NAME,
        author: config.STICKER_AUTHOR_NAME,
        type: StickerTypes.FULL,
        quality: 10
      });
      await sock.sendMessage(chatJid, {
        sticker: await sticker.toBuffer()
      }, {
        quoted: ms
      });
    }
    repondre("✅ Tous les stickers ont été envoyés.");
  } catch (err) {
    console.error(err);
    repondre("❌ Une erreur s'est produite lors du téléchargement des stickers.");
  }
});
registerCommand({
  nom_cmd: "fetch_sc",
  classe: "Owner",
  react: "💻",
  desc: "Extrait les données d'une page web, y compris HTML, CSS, JavaScript et médias"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    isSudo,
    ms
  } = ctx;
  const value = arg[0];
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: ms
    });
  }
  if (!value) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez fournir un lien valide. Le bot extraira le HTML, CSS, JavaScript, et les médias de la page web."
    }, {
      quoted: ms
    });
  }
  if (!/^https?:\/\//i.test(value)) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez fournir une URL valide commençant par http:// ou https://"
    }, {
      quoted: ms
    });
  }
  try {
    const response = await axios.get(value);
    const value2 = response.data;
    const value3 = cheerio.load(value2);
    const list = [];
    value3("img[src], video[src], audio[src]").each((tmp, tmp2) => {
      let value4 = value3(tmp2).attr("src");
      if (value4) {
        list.push(value4);
      }
    });
    const list2 = [];
    value3("link[rel=\"stylesheet\"]").each((tmp3, tmp4) => {
      let value5 = value3(tmp4).attr("href");
      if (value5) {
        list2.push(value5);
      }
    });
    const list3 = [];
    value3("script[src]").each((tmp5, tmp6) => {
      let value6 = value3(tmp6).attr("src");
      if (value6) {
        list3.push(value6);
      }
    });
    await sock.sendMessage(chatJid, {
      text: "**Contenu HTML**:\n\n" + value2
    }, {
      quoted: ms
    });
    if (list2.length > 0) {
      for (const tmp7 of list2) {
        const response2 = await axios.get(new URL(tmp7, value));
        const value7 = response2.data;
        await sock.sendMessage(chatJid, {
          text: "**Contenu du fichier CSS**:\n\n" + value7
        }, {
          quoted: ms
        });
      }
    } else {
      await sock.sendMessage(chatJid, {
        text: "Aucun fichier CSS externe trouvé."
      }, {
        quoted: ms
      });
    }
    if (list3.length > 0) {
      for (const tmp8 of list3) {
        const response3 = await axios.get(new URL(tmp8, value));
        const value8 = response3.data;
        await sock.sendMessage(chatJid, {
          text: "**Contenu du fichier JavaScript**:\n\n" + value8
        }, {
          quoted: ms
        });
      }
    } else {
      await sock.sendMessage(chatJid, {
        text: "Aucun fichier JavaScript externe trouvé."
      }, {
        quoted: ms
      });
    }
    if (list.length > 0) {
      await sock.sendMessage(chatJid, {
        text: "**Fichiers médias trouvés**:\n" + list.join("\n")
      }, {
        quoted: ms
      });
    } else {
      await sock.sendMessage(chatJid, {
        text: "Aucun fichier média (images, vidéos, audios) trouvé."
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    console.error(err);
    return sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de l'extraction du contenu de la page web."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "antidelete",
  classe: "Owner",
  react: "🔗",
  desc: "Configure ou désactive l'Antidelete"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre,
    arg,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("🔒 Cette commande est réservée aux utilisateurs sudo.");
    }
    const value = arg[0]?.toLowerCase();
    const value2 = arg[1]?.toLowerCase();
    const options = {
      1: "pm",
      2: "gc",
      3: "status",
      4: "all",
      5: "pm/gc",
      6: "pm/status",
      7: "gc/status"
    };
    const [tmp] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        antidelete: "non"
      }
    });
    if (value === "off") {
      if (tmp.antidelete === "non") {
        return repondre("❌ L'antidelete est déjà désactivé.");
      }
      tmp.antidelete = "non";
      await tmp.save();
      return repondre("✅ Antidelete désactivé avec succès.");
    }
    if (["pv", "org"].includes(value)) {
      return repondre("❌ Usage invalide.\nUtilisez : antidelete <numéro> [pv|org]\nExemple : antidelete 3 org");
    }
    const amount = parseInt(value);
    if (!options[amount]) {
      return repondre("📌 *Utilisation de la commande antidelete :*\n\n🔹 antidelete off : Désactiver l'antidelete\n\n🔹 antidelete 1 : Activer sur les messages privés (pm)\n🔹 antidelete 2 : Activer sur les messages de groupe (gc)\n🔹 antidelete 3 : Activer sur les statuts (status)\n🔹 antidelete 4 : Activer sur tous les types (all)\n🔹 antidelete 5 : Activer sur pm + gc\n🔹 antidelete 6 : Activer sur pm + status\n🔹 antidelete 7 : Activer sur gc + status\n\n➕ Vous pouvez ajouter `pv` ou `org` après le numéro pour choisir où renvoyer le message supprimé.\n   Exemple : `antidelete 3 org`\n\n✳️ Par défaut, si rien n’est précisé, c’est `pv` (inbox) qui est utilisé.");
    }
    if (value2 && !["pv", "org"].includes(value2)) {
      return repondre("❌ Mode invalide. Utilisez soit 'pv' soit 'org' après le numéro.");
    }
    let value3 = options[amount];
    if (value2) {
      value3 += "-" + value2;
    } else {
      value3 += "-pv";
    }
    if (tmp.antidelete === value3) {
      return repondre("⚠️ L'antidelete est déjà configuré sur '" + value3 + "'.");
    }
    tmp.antidelete = value3;
    await tmp.save();
    return repondre("✅ Antidelete configuré sur : *" + value3 + "*");
  } catch (err) {
    console.error("Erreur antidelete :", err);
    repondre("❌ Une erreur s'est produite lors de la configuration de l'antidelete.");
  }
});
registerCommand({
  nom_cmd: "jid",
  classe: "Owner",
  react: "🆔",
  desc: "Fournit le JID d'une personne ou d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    auteur_Msg_Repondu,
    isSudo,
    msg_Repondu,
    arg,
    getJid
  } = ctx;
  if (!isSudo) {
    return repondre("Seuls les utilisateurs sudo peuvent utiliser cette commande");
  }
  let value = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
  let item;
  if (value) {
    item = await getJid(value, chatJid, sock);
  } else {
    item = chatJid;
  }
  repondre(item);
});
registerCommand({
  nom_cmd: "restart",
  classe: "Owner",
  desc: "Redémarre le bot"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    isSudo
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas la permission d'utiliser cette commande."
    }, {
      quoted: ms
    });
  }
  await sock.sendMessage(chatJid, {
    text: "♻️ Redémarrage du bot en cours..."
  }, {
    quoted: ms
  });
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});
registerCommand({
  nom_cmd: "connect",
  classe: "Owner",
  desc: "Connexion d’un compte avec le bot via session_id"
}, async (chatJid, sock, ctx) => {
  try {
    const {
      arg,
      ms,
      isSudo,
      repondre,
      auteur_Message
    } = ctx;
    if (!isSudo) {
      return sock.sendMessage(chatJid, {
        text: "🚫 Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    if (!arg || !arg[0]) {
      return sock.sendMessage(chatJid, {
        text: "❗ Exemple : .connect SESSION_ID"
      }, {
        quoted: ms
      });
    }
    const value = arg[0].trim();
    console.log("🌀 Tentative de connexion par " + auteur_Message + " pour session_id: " + value);
    const value2 = await saveSecondSession(value);
    if (!value2) {
      return repondre("❌ La session est invalide ou n’a pas pu être enregistrée.");
    }
    return sock.sendMessage(chatJid, {
      text: "✅ Tentative de connexion enregistrée pour la session : " + value
    }, {
      quoted: ms
    });
  } catch (err) {
    return sock.sendMessage(chatJid, {
      text: "❌ Erreur : " + err.message
    });
  }
});
registerCommand({
  nom_cmd: "connect_session",
  classe: "Owner",
  desc: "Affiche la liste des numéros connectés"
}, async (chatJid, sock, ctx) => {
  try {
    const {
      ms,
      isSudo
    } = ctx;
    if (!isSudo) {
      return sock.sendMessage(chatJid, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    const value = await getSecondAllSessions();
    if (!value || value.length === 0) {
      return sock.sendMessage(chatJid, {
        text: "📭 Aucune session secondaire active pour le moment."
      }, {
        quoted: ms
      });
    }
    const value2 = value.map(tmp => tmp.numero + "@s.whatsapp.net");
    const text = value2.map(tmp2 => "@" + tmp2.split("@")[0]).join("\n");
    await sock.sendMessage(chatJid, {
      text: "📡 *Sessions secondaires connectées (" + value.length + ")* :\n\n" + text,
      mentions: value2
    }, {
      quoted: ms
    });
  } catch (err) {
    return sock.sendMessage(chatJid, {
      text: "❌ Erreur : " + err.message
    });
  }
});
registerCommand({
  nom_cmd: "disconnect",
  classe: "Owner",
  desc: "Supprime une session connectée par session_id"
}, async (chatJid, sock, ctx) => {
  try {
    const {
      arg,
      ms,
      isSudo
    } = ctx;
    if (!isSudo) {
      return sock.sendMessage(chatJid, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: ms
      });
    }
    if (!arg || !arg[0]) {
      return sock.sendMessage(chatJid, {
        text: "Usage : .disconnect numero(sans le + et collé)"
      }, {
        quoted: ms
      });
    }
    const text = arg.join(" ");
    const value = text.replace(/[^0-9]/g, "");
    const value2 = await deleteSecondSession(value);
    if (value2 === 0) {
      return sock.sendMessage(chatJid, {
        text: "Aucune session trouvée pour le numéro : " + value
      }, {
        quoted: ms
      });
    }
    await sock.sendMessage(chatJid, {
      text: "✅ Session pour le numéro: " + value + " supprimée avec succès."
    }, {
      quoted: ms
    });
  } catch (err) {
    return sock.sendMessage(chatJid, {
      text: "❌ Erreur : " + err.message
    });
  }
});
registerCommand({
  nom_cmd: "setmention",
  classe: "Owner",
  react: "✅",
  desc: "Configurer le message d'antimention global"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre,
    arg,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("❌ Seuls les utilisateurs sudo peuvent utiliser cette commande.");
  }
  try {
    const text = arg.join(" ");
    if (!text) {
      return repondre("🛠️ Utilisation de la commande *setmention* :\n\n1️⃣ Pour une image, vidéo, audio ou texte avec type spécifié :\n> *setmention type=audio url=https://exemple.com/fichier.opus*\n> *setmention type=video url=https://exemple.com/video.mp4 text=Votre_message_ici*\n> *setmention type=texte text=Votre_message_ici*\n> *setmention type=image url=https://exemple.com/image.jpg text=Votre_message_ici*\n\n📌 Les types valides sont : audio, video, texte, image.");
    }
    let url = "";
    let url2 = "";
    let url3 = "";
    const value = /(type|url|text)=(.*?)(?=\s(?:type=|url=|text=)|$)/gis;
    let item;
    while ((item = value.exec(text)) !== null) {
      const value2 = item[1].toLowerCase();
      const value3 = item[2].trim();
      if (value2 === "type") {
        url3 = value3.toLowerCase();
      } else if (value2 === "url") {
        url = value3;
      } else if (value2 === "text") {
        url2 = value3.replace(/_/g, " ");
      }
    }
    if (!url3) {
      return repondre("❌ Vous devez préciser le type avec 'type=audio', 'type=video', 'type=texte' ou 'type=image'.");
    }
    await setMention({
      url: url,
      text: url2,
      type: url3,
      mode: "oui"
    });
    const url4 = "✅ Mention de type '" + url3 + "' enregistrée avec succès.";
    return repondre(url4);
  } catch (err) {
    console.error("Erreur dans setmention:", err);
    repondre("Une erreur s'est produite lors de la configuration.");
  }
});
registerCommand({
  nom_cmd: "delmention",
  classe: "Owner",
  react: "🚫",
  desc: "Désactiver le système d'antimention"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("Seuls les utilisateurs sudo peuvent utiliser cette commande.");
  }
  try {
    await delMention();
    return repondre("✅ mention désactivé.");
  } catch (err) {
    console.error("Erreur dans delmention:", err);
    repondre("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "getmention",
  classe: "Owner",
  react: "📄",
  desc: "Afficher la configuration actuelle de l'antimention"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("Seuls les utilisateurs sudo peuvent utiliser cette commande.");
    }
    const value = await getMention();
    if (!value || value.mode === "non") {
      return repondre("ℹ️ Antimention désactivé ou non configuré.");
    }
    const {
      mode: tmp,
      url: tmp2,
      text: tmp3,
      type: tmp4
    } = value;
    if ((!tmp2 || tmp2 === "") && (!tmp3 || tmp3 === "")) {
      return repondre("ℹ️ Antimention activé mais aucun contenu défini.");
    }
    switch (tmp4) {
      case "audio":
        if (!tmp2) {
          return repondre(tmp3 || "Aucun contenu audio défini.");
        }
        return await sock.sendMessage(chatJid, {
          audio: {
            url: tmp2
          },
          mimetype: "audio/mp4",
          ptt: true
        }, {
          quoted: null
        });
      case "image":
        if (!tmp2) {
          return repondre(tmp3 || "Aucun contenu image défini.");
        }
        return await sock.sendMessage(chatJid, {
          image: {
            url: tmp2
          },
          caption: tmp3 || undefined
        }, {
          quoted: null
        });
      case "video":
        if (!tmp2) {
          return repondre(tmp3 || "Aucun contenu vidéo défini.");
        }
        return await sock.sendMessage(chatJid, {
          video: {
            url: tmp2
          },
          caption: tmp3 || undefined
        }, {
          quoted: null
        });
      case "texte":
        return repondre(tmp3 || "Aucun message texte défini.");
      default:
        return repondre("Le type de média est inconnu ou non pris en charge.");
    }
  } catch (err) {
    console.error("Erreur dans getmention:", err);
    repondre("Impossible d'afficher la configuration.");
  }
});
registerCommand({
  nom_cmd: "addstickcmd",
  classe: "Owner",
  react: "✨",
  alias: ["setstickcmd", "addcmd", "setcmd"],
  desc: "Associer une commande à un sticker (réponds à un sticker)"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    msg_Repondu,
    arg,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("Pas autorisé.");
  }
  const value = arg[0];
  if (!value) {
    return repondre("Tu dois donner un nom à la commande.\nExemple : `addstickcmd test`");
  }
  if (!msg_Repondu || !msg_Repondu.stickerMessage || !msg_Repondu.stickerMessage.url) {
    return repondre("Tu dois répondre à un *sticker* pour l'enregistrer.");
  }
  const value2 = msg_Repondu.stickerMessage.fileSha256?.toString("base64");
  try {
    await set_stick_cmd(value.toLowerCase(), value2);
    repondre("✅ Le sticker a été associé à la commande *" + value + "*");
  } catch (err) {
    console.error(err);
    repondre("Erreur lors de l'enregistrement.");
  }
});
registerCommand({
  nom_cmd: "delstickcmd",
  classe: "Owner",
  react: "🗑️",
  alias: ["delcmd"],
  desc: "Supprimer une commande sticker"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("Pas autorisé.");
  }
  const value = arg[0];
  if (!value) {
    return repondre("Exemple : `delstickcmd test`");
  }
  const value2 = await del_stick_cmd(value.toLowerCase());
  repondre(value2 ? "🗑️ La commande *" + value + "* a été supprimée." : "Aucune commande nommée *" + value + "* trouvée.");
});
registerCommand({
  nom_cmd: "getstickcmd",
  classe: "Owner",
  react: "📋",
  alias: ["getcmd"],
  desc: "Liste des commandes stickers"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("Pas autorisé.");
  }
  const value = await get_stick_cmd();
  if (!value.length) {
    return repondre("Aucune commande sticker trouvée.");
  }
  let url = "*📌 Liste des commandes stickers :*\n\n";
  for (const {
    no_cmd: tmp,
    stick_hash: tmp2
  } of value) {
    url += "• *" + tmp + "*\n";
  }
  repondre(url);
});
registerCommand({
  nom_cmd: "setpublic_cmd",
  classe: "Owner",
  react: "✅",
  desc: "Ajoute une commande publique utilisable par tout le monde quand le bot est en mode privé"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const value = arg[0];
  if (!value) {
    return repondre("❌ Utilisation: setpublic_cmd nom_cmd");
  }
  try {
    await set_cmd(value, "public");
    repondre("✅ Commande publique '" + value + "' enregistrée.");
  } catch {
    repondre("❌ Erreur lors de l'enregistrement.");
  }
});
registerCommand({
  nom_cmd: "delpublic_cmd",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprime une commande des commandes publiques."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const value = arg[0];
  if (!value) {
    return repondre("❌ Utilisation: delpublic_cmd nom_cmd");
  }
  try {
    const value2 = await del_cmd(value, "public");
    repondre(value2 ? "✅ Commande '" + value + "' supprimée." : "❌ Commande '" + value + "' introuvable.");
  } catch {
    repondre("❌ Erreur lors de la suppression.");
  }
});
registerCommand({
  nom_cmd: "listpublic_cmd",
  classe: "Owner",
  react: "📜",
  desc: "Liste les commandes publiques utilisablent quand le bot est en mode privé"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const value = await list_cmd("public");
  if (!value.length) {
    return repondre("❌ Aucune commande publique enregistrée.");
  }
  const text = value.map((tmp, tmp2) => "🔹 *" + (tmp2 + 1) + ".* " + tmp.nom_cmd).join("\n");
  repondre("📖 *Commandes publiques enregistrées :*\n\n" + text);
});
registerCommand({
  nom_cmd: "setprivate_cmd",
  classe: "Owner",
  react: "🔒",
  desc: "Ajoute une commande privée utilisable par les utilisateurs sudos quand le bot est en mode public"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const value = arg[0];
  if (!value) {
    return repondre("❌ Utilisation: setprivate_cmd nom_cmd");
  }
  try {
    await set_cmd(value, "private");
    repondre("🔐 Commande privée '" + value + "' enregistrée.");
  } catch {
    repondre("❌ Erreur lors de l'enregistrement.");
  }
});
registerCommand({
  nom_cmd: "delprivate_cmd",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprime une commande des commandes privée"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const value = arg[0];
  if (!value) {
    return repondre("❌ Utilisation: delprivate_cmd nom_cmd");
  }
  try {
    const value2 = await del_cmd(value, "private");
    repondre(value2 ? "✅ Commande '" + value + "' supprimée." : "❌ Commande '" + value + "' introuvable.");
  } catch {
    repondre("❌ Erreur lors de la suppression.");
  }
});
registerCommand({
  nom_cmd: "listprivate_cmd",
  classe: "Owner",
  react: "📃",
  desc: "Liste les commandes privées utilisablent par les utilisateurs sudos quand le bot est en mode public"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    isSudo
  } = ctx;
  if (!isSudo) {
    return repondre("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const value = await list_cmd("private");
  if (!value.length) {
    return repondre("❌ Aucune commande privée enregistrée.");
  }
  const text = value.map((tmp, tmp2) => "🔹 *" + (tmp2 + 1) + ".* " + tmp.nom_cmd).join("\n");
  repondre("🔒 *Commandes privées enregistrées :*\n\n" + text);
});
registerCommand({
  nom_cmd: "chatbot",
  classe: "Owner",
  react: "🤖",
  desc: "Active ou désactive le chatbot ici ou globalement."
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre,
    arg,
    verif_Groupe,
    isSudo
  } = ctx;
  const value = arg[0]?.toLowerCase();
  if (!isSudo) {
    repondre("❌ Pas autorisé.");
    return;
  }
  try {
    const [tmp] = await ChatbotConf.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        chatbot_pm: "non",
        chatbot_gc: "non",
        enabled_ids: JSON.stringify([])
      }
    });
    let list = [];
    try {
      list = JSON.parse(tmp.enabled_ids || "[]");
    } catch {
      list = [];
    }
    if (value === "on") {
      if (list.includes(chatJid)) {
        repondre("🔁 Le chatbot est *déjà activé ici*.");
      } else {
        list.push(chatJid);
        tmp.enabled_ids = JSON.stringify([...new Set(list)]);
        tmp.chatbot_pm = "non";
        tmp.chatbot_gc = "non";
        await tmp.save();
        repondre("✅ Le chatbot est maintenant activé *dans cette discussion*.");
      }
    } else if (value === "off") {
      tmp.chatbot_pm = "non";
      tmp.chatbot_gc = "non";
      tmp.enabled_ids = JSON.stringify([]);
      await tmp.save();
      repondre("⛔️ Le chatbot est maintenant désactivé *partout*.");
    } else if (["pm", "gc", "all"].includes(value)) {
      tmp.chatbot_pm = value === "pm" || value === "all" ? "oui" : "non";
      tmp.chatbot_gc = value === "gc" || value === "all" ? "oui" : "non";
      tmp.enabled_ids = JSON.stringify([]);
      await tmp.save();
      const options = {
        pm: "✅ Le chatbot est maintenant activé *dans tous les chats privés*.",
        gc: "✅ Le chatbot est maintenant activé *dans tous les groupes*.",
        all: "✅ Le chatbot est maintenant activé *partout*."
      };
      repondre(options[value]);
    } else {
      repondre("🤖 *Gestion du Chatbot*\n\n`chatbot on` - Active ici uniquement\n`chatbot off` - Désactive *partout*\n`chatbot pm` - Active dans *tous les chats privés*\n`chatbot gc` - Active dans *tous les groupes*\n`chatbot all` - Active *partout*");
    }
  } catch (err) {
    console.error("❌ Erreur dans la commande chatbot :", err);
    repondre("Une erreur est survenue.");
  }
});
registerCommand({
  nom_cmd: "pglist",
  classe: "Owner",
  react: "🧩",
  desc: "Affiche la liste des plugins disponibles avec statut d'installation.",
  alias: ["pgl", "plist"]
}, async (chatJid, sock, ctx) => {
  const {
    repondre
  } = ctx;
  return repondre("⛔ Les plugins distants sont désactivés sur cette instance.");
  try {
    const {
      data: tmp
    } = await axios.get("https://127.0.0.1/plugins-disabled");
    const records = await Plugin.findAll();
    const value = records.map(tmp2 => tmp2.name.toLowerCase());
    let list = [];
    if (Array.isArray(tmp)) {
      list = tmp.map((tmp3, tmp4) => {
        const value2 = value.includes(tmp3.name.toLowerCase());
        const value3 = value2 ? "✅" : "❌";
        return "*" + value3 + " Plugin #" + (tmp4 + 1) + "*\n🧩 *Nom:* " + tmp3.name + "\n👤 *Auteur:* " + tmp3.author + "\n📦 *Installé:* " + (value2 ? "Oui ✅" : "Non ❌") + "\n🔗 *Lien:* " + tmp3.url + "\n📝 *Description:* " + (tmp3.description || "Aucune description");
      });
    }
    const value4 = records.filter(tmp5 => {
      return !tmp?.some(tmp6 => tmp6.name.toLowerCase() === tmp5.name.toLowerCase());
    });
    value4.forEach(tmp7 => {
      list.push("*✅ Plugin personnalisé*\n🧩 *Nom:* " + tmp7.name + "\n");
    });
    const text = list.length > 0 ? "📦 *Plugins disponibles :*\n\n" + list.join("\n\n") : "❌ Aucun plugin disponible.";
    await repondre(text);
  } catch (err) {
    console.error("Erreur pluginlist :", err);
    await repondre("❌ Une erreur est survenue lors du chargement des plugins.");
  }
});
registerCommand({
  nom_cmd: "pgremove",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprime un plugin installé par nom ou tape `remove all` pour tous.",
  alias: ["pgr"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre
  } = ctx;
  return repondre("⛔ Les plugins distants sont désactivés sur cette instance.");
  const value = arg[0];
  if (!value) {
    return repondre("❌ Utilise `remove nom_plugin` ou `remove all`.");
  }
  if (value === "all") {
    const records = await Plugin.findAll();
    for (const tmp of records) {
      const text = path.join(__dirname, "../plugins", tmp.name + ".js");
      if (fs.existsSync(text)) {
        fs.unlinkSync(text);
      }
      await Plugin.destroy({
        where: {
          name: tmp.name
        }
      });
    }
    await reloadCommands();
    return repondre("🗑️ Tous les plugins ont été supprimés.");
  }
  const record = await Plugin.findOne({
    where: {
      name: value
    }
  });
  if (!record) {
    return repondre("❌ Plugin non trouvé dans la base.");
  }
  const text2 = path.join(__dirname, "../plugins", record.name + ".js");
  if (fs.existsSync(text2)) {
    fs.unlinkSync(text2);
  }
  await Plugin.destroy({
    where: {
      name: value
    }
  });
  await reloadCommands();
  return repondre("🗑️ Plugin *" + value + "* supprimé.");
});
registerCommand({
  nom_cmd: "pginstall",
  classe: "Owner",
  react: "📥",
  desc: "Installe un plugin.",
  alias: ["pgi"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre
  } = ctx;
  return repondre("⛔ Les plugins distants sont désactivés sur cette instance.");
  const value = arg[0];
  if (!value) {
    return repondre("❌ Donne un lien direct vers un plugin ou tape `pginstall all` pour tout installer.");
  }
  const record = async (tmp, tmp2) => {
    try {
      const tmp3 = await Plugin.findOne({
        where: {
          name: tmp2
        }
      });
      if (tmp3) {
        await repondre("⚠️ Plugin *" + tmp2 + "* déjà installé. Ignoré.");
        return;
      }
      const response = await axios.get(tmp);
      const value2 = response.data;
      const text = path.join(__dirname, "../plugins", tmp2 + ".js");
      fs.writeFileSync(text, value2);
      const value3 = extractNpmModules(value2);
      if (value3.length > 0) {
        await repondre("⚙️ Installation des dépendances npm : " + value3.join(", "));
        await installModules(value3);
      }
      await Plugin.findOrCreate({
        where: {
          name: tmp2
        },
        defaults: {
          url: tmp
        }
      });
      await repondre("✅ Plugin *" + tmp2 + "* installé avec succès.");
      await reloadCommands();
    } catch (err) {
      await repondre("❌ Erreur installation *" + tmp2 + "* : " + err.message);
    }
  };
  if (value === "all") {
    try {
      const {
        data: tmp4
      } = await axios.get("https://pastebin.com/raw/5UA0CYYR");
      const records = await Plugin.findAll();
      const value4 = records.map(tmp5 => tmp5.name.toLowerCase());
      const value5 = tmp4.filter(tmp6 => !value4.includes(tmp6.name.toLowerCase()));
      if (value5.length === 0) {
        return await repondre("✅ Tous les plugins sont déjà installés.");
      }
      for (const tmp7 of value5) {
        await record(tmp7.url, tmp7.name);
      }
      await repondre("✅ Installation terminée pour tous les plugins disponibles.");
    } catch (tmp8) {
      await repondre("❌ Erreur de récupération des plugins : " + tmp8.message);
    }
  } else {
    const pluginPath = value;
    const pluginName = path.basename(pluginPath).replace(".js", "");
    await record(pluginPath, pluginName);
  }
});