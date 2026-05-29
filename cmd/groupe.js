const {
  registerCommand
} = require("../lib/commands");
const {
  Sticker,
  StickerTypes
} = require("wa-sticker-formatter");
const {
  Antilink
} = require("../database/antilink");
const {
  Antitag
} = require("../database/antitag");
const {
  Antibot
} = require("../database/antibot");
const {
  GroupSettings,
  Events2
} = require("../database/events");
const fs = require("fs");
const {
  setWarn,
  delWarn,
  getLimit,
  setLimit
} = require("../database/warn");
const {
  Antimention
} = require("../database/antimention");
const {
  Ranks
} = require("../database/rank");
const {
  Antispam
} = require("../database/antispam");
registerCommand({
  nom_cmd: "tagall",
  classe: "Groupe",
  react: "💬",
  desc: "Commande pour taguer tous les membres d'un groupe"
}, async (chatJid, sock, ctx) => {
  try {
    const {
    ms,
    repondre,
    arg,
    mbre_membre,
    verif_Groupe,
    infos_Groupe,
    nom_Auteur_Message,
    verif_Admin
  } = ctx;
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes");
    }
    const text = arg && arg.length > 0 ? arg.join(" ") : "";
    let url = "╭───〔  TAG ALL 〕───⬣\n";
    url += "│👤 Auteur : *" + nom_Auteur_Message + "*\n";
    url += "│💬 Message : *" + text + "*\n│\n";
    mbre_membre.forEach(tmp => {
      url += "│◦❒ @" + tmp.id.split("@")[0] + "\n";
    });
    url += "╰═══════════════⬣\n";
    if (verif_Admin) {
      await sock.sendMessage(chatJid, {
        text: url,
        mentions: mbre_membre.map(tmp2 => tmp2.id)
      }, {
        quoted: ms
      });
    } else {
      repondre("Seuls les administrateurs peuvent utiliser cette commande");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du message avec tagall :", err);
  }
});
registerCommand({
  nom_cmd: "tagadmin",
  classe: "Groupe",
  react: "💬",
  desc: "Commande pour taguer tous les administrateurs d'un groupe"
}, async (chatJid, sock, ctx) => {
  try {
    const {
    ms,
    repondre,
    arg,
    verif_Groupe,
    mbre_membre,
    infos_Groupe,
    nom_Auteur_Message,
    verif_Admin
  } = ctx;
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes");
    }
    const text = arg && arg.length > 0 ? arg.join(" ") : "";
    const value = mbre_membre.filter(tmp => tmp.admin).map(tmp2 => tmp2.id);
    if (value.length === 0) {
      return repondre("Aucun administrateur trouvé dans ce groupe.");
    }
    let url = "╭───〔  TAG ADMINS 〕───⬣\n";
    url += "│👤 Auteur : *" + nom_Auteur_Message + "*\n";
    url += "│💬 Message : *" + text + "*\n│\n";
    mbre_membre.forEach(tmp3 => {
      if (tmp3.admin) {
        url += "│◦❒ @" + tmp3.id.split("@")[0] + "\n";
      }
    });
    url += "╰═══════════════⬣\n";
    if (verif_Admin) {
      await sock.sendMessage(chatJid, {
        text: url,
        mentions: value
      }, {
        quoted: ms
      });
    } else {
      repondre("Seuls les administrateurs peuvent utiliser cette commande");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du message avec tagadmins :", err);
  }
});
registerCommand({
  nom_cmd: "tag",
  classe: "Groupe",
  react: "💬",
  alias: ["htag", "hidetag"],
  desc: "partager un message à tous les membres d'un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    msg_Repondu,
    verif_Groupe,
    infos_Groupe,
    arg,
    verif_Admin,
    ms
  } = ctx;
  if (!verif_Groupe) {
    repondre("Cette commande ne fonctionne que dans les groupes");
    return;
  }
  if (verif_Admin) {
    const groupMeta = infos_Groupe;
    const mentionIds = groupMeta.participants.map(member => member.id);
    let payload;
    if (msg_Repondu) {
      if (msg_Repondu.imageMessage) {
        let mediaPath = await sock.dl_save_media_ms(msg_Repondu.imageMessage);
        payload = {
          image: {
            url: mediaPath
          },
          caption: msg_Repondu.imageMessage.caption,
          mentions: mentionIds
        };
      } else if (msg_Repondu.videoMessage) {
        let mediaPath2 = await sock.dl_save_media_ms(msg_Repondu.videoMessage);
        payload = {
          video: {
            url: mediaPath2
          },
          caption: msg_Repondu.videoMessage.caption,
          mentions: mentionIds
        };
      } else if (msg_Repondu.audioMessage) {
        let mediaPath3 = await sock.dl_save_media_ms(msg_Repondu.audioMessage);
        payload = {
          audio: {
            url: mediaPath3
          },
          mimetype: "audio/mp4",
          mentions: mentionIds
        };
      } else if (msg_Repondu.stickerMessage) {
        let mediaPath4 = await sock.dl_save_media_ms(msg_Repondu.stickerMessage);
        let sticker = new Sticker(mediaPath4, {
          pack: "Manewbot Hidtag",
          type: StickerTypes.FULL,
          quality: 80,
          background: "transparent"
        });
        const stickerBuffer = await sticker.toBuffer();
        payload = {
          sticker: stickerBuffer,
          mentions: mentionIds
        };
      } else {
        payload = {
          text: msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text,
          mentions: mentionIds
        };
      }
      sock.sendMessage(chatJid, payload, {
        quoted: ms
      });
    } else {
      if (!arg || !arg[0]) {
        repondre("Veuillez inclure ou mentionner un message à partager.");
        return;
      }
      sock.sendMessage(chatJid, {
        text: arg.join(" "),
        mentions: mentionIds
      }, {
        quoted: ms
      });
    }
  } else {
    repondre("Cette commande est réservée aux administrateurs du groupe");
  }
});
registerCommand({
  nom_cmd: "poll",
  classe: "Groupe",
  react: "📊",
  desc: "Crée un sondage dans le groupe(plusieurs votés autorisé)."
}, async (chatJid, sock, ctx) => {
  try {
    const {
    ms,
    repondre,
    arg,
    verif_Groupe,
    infos_Groupe,
    nom_Auteur_Message,
    verif_Admin
  } = ctx;
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes.");
    }
    let [tmp, tmp2] = arg.join(" ").split(";");
    if (!tmp2) {
      return repondre("Veuillez fournir une question suivie des options, séparées par des virgules. Exemple : poll question;option1,option2,option3");
    }
    let value = tmp2.split(",").map(tmp3 => tmp3.trim()).filter(tmp4 => tmp4.length > 0);
    if (value.length < 2) {
      return repondre("Le sondage doit contenir au moins deux options.");
    }
    if (verif_Admin) {
      await sock.sendMessage(chatJid, {
        poll: {
          name: tmp,
          values: value
        }
      }, {
        quoted: ms
      });
    } else {
      repondre("Seuls les administrateurs peuvent utiliser cette commande.");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du sondage :", err);
    repondre("Une erreur est survenue lors de la création du sondage.");
  }
});
registerCommand({
  nom_cmd: "poll2",
  classe: "Groupe",
  react: "📊",
  desc: "Crée un sondage dans le groupe(un seul vote autorisé)."
}, async (chatJid, sock, ctx) => {
  try {
    const {
    ms,
    repondre,
    arg,
    verif_Groupe,
    infos_Groupe,
    nom_Auteur_Message,
    verif_Admin
  } = ctx;
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes.");
    }
    let [tmp, tmp2] = arg.join(" ").split(";");
    if (!tmp2) {
      return repondre("Veuillez fournir une question suivie des options, séparées par des virgules. Exemple : poll question;option1,option2,option3");
    }
    let value = tmp2.split(",").map(tmp3 => tmp3.trim()).filter(tmp4 => tmp4.length > 0);
    if (value.length < 2) {
      return repondre("Le sondage doit contenir au moins deux options.");
    }
    if (verif_Admin) {
      await sock.sendMessage(chatJid, {
        poll: {
          name: tmp,
          values: value,
          selectableCount: 1
        }
      }, {
        quoted: ms
      });
    } else {
      repondre("Seuls les administrateurs peuvent utiliser cette commande.");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du sondage :", err);
    repondre("Une erreur est survenue lors de la création du sondage.");
  }
});
registerCommand({
  nom_cmd: "kick",
  classe: "Groupe",
  react: "🛑",
  desc: "Supprime un membre du groupe."
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    getJid,
    auteur_Msg_Repondu,
    arg,
    infos_Groupe,
    verif_Admin,
    verif_Bot_Admin,
    isSudo,
    dev_num,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (isSudo || verif_Admin) {
    const value = await infos_Groupe.participants;
    const value2 = value.filter(tmp => tmp.admin).map(tmp2 => tmp2.jid);
    const value3 = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
    const value4 = await getJid(value3, chatJid, sock);
    if (!verif_Bot_Admin) {
      return sock.sendMessage(chatJid, {
        text: "Je dois être administrateur pour effectuer cette action."
      }, {
        quoted: ms
      });
    }
    if (!value4 || !value.find(tmp3 => tmp3.jid === value4)) {
      return sock.sendMessage(chatJid, {
        text: "Membre introuvable dans ce groupe."
      }, {
        quoted: ms
      });
    }
    if (value2.includes(value4)) {
      return sock.sendMessage(chatJid, {
        text: "Impossible d'exclure un administrateur du groupe."
      }, {
        quoted: ms
      });
    }
    if (dev_num.includes(value4)) {
      return sock.sendMessage(chatJid, {
        text: "Vous ne pouvez pas exclure un développeur."
      }, {
        quoted: ms
      });
    }
    try {
      await sock.groupParticipantsUpdate(chatJid, [value4], "remove");
      sock.sendMessage(chatJid, {
        text: "@" + value4.split("@")[0] + " a été exclu.",
        mentions: [value4]
      }, {
        quoted: ms
      });
    } catch (err) {
      console.error("Erreur :", err);
      sock.sendMessage(chatJid, {
        text: "Une erreur est survenue lors de l'exclusion."
      }, {
        quoted: ms
      });
    }
  } else {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas la permission d'utiliser cette commande."
    }, {
      quoted: ms
    });
  }
  ;
});
registerCommand({
  nom_cmd: "kickall",
  classe: "Groupe",
  react: "🛑",
  desc: "Supprime tous les membres non administrateurs du groupe."
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    infos_Groupe,
    ms,
    auteur_Message,
    verif_Bot_Admin,
    dev_num,
    id_Bot,
    getJid
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  const value = infos_Groupe.participants;
  let value2 = value.find(tmp => tmp.admin === "superadmin")?.jid;
  if (!value2) {
    value2 = value[0]?.jid;
  }
  if (![value2, id_Bot, ...dev_num].includes(auteur_Message)) {
    return sock.sendMessage(chatJid, {
      text: "Seul le créateur du groupe ou le propriétaire du bot peut utiliser cette commande."
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
  const record = await GroupSettings.findOne({
    where: {
      id: chatJid
    }
  });
  if (record?.goodbye === "oui") {
    return sock.sendMessage(chatJid, {
      text: "Désactivez le goodbye message (goodbye off) avant de continuer."
    }, {
      quoted: ms
    });
  }
  const value3 = value.filter(tmp2 => !tmp2.admin && !dev_num.includes(tmp2.jid)).map(tmp3 => tmp3.jid);
  if (value3.length === 0) {
    return sock.sendMessage(chatJid, {
      text: "Aucun membre non administrateur à exclure."
    }, {
      quoted: ms
    });
  }
  await sock.sendMessage(chatJid, {
    text: "⚠️ Kickall va commencer dans 5 secondes.\nEnvoyez 'stop' pour annuler."
  }, {
    quoted: ms
  });
  await new Promise(tmp4 => setTimeout(tmp4, 5000));
  let false2 = false;
  for (const tmp5 of value3) {
    const replyMsg = await sock.recup_msg({
      ms_org: chatJid,
      temps: 300000
    });
    const value4 = (replyMsg?.message?.conversation || replyMsg?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
    const value5 = replyMsg?.key?.participant || replyMsg?.key?.remoteJid;
    const value6 = await getJid(value5, chatJid, sock);
    if (value4 === "stop" && [value2, id_Bot, ...dev_num].includes(value6)) {
      false2 = true;
      await sock.sendMessage(chatJid, {
        text: "⛔ Kickall annulé !"
      }, {
        quoted: ms
      });
      break;
    }
    try {
      await sock.groupParticipantsUpdate(chatJid, [tmp5], "remove");
      await new Promise(tmp6 => setTimeout(tmp6, 500));
    } catch (err) {
      console.error("Erreur exclusion " + tmp5 + " :", err);
    }
  }
  if (!false2) {
    sock.sendMessage(chatJid, {
      text: "✅ " + value3.length + " membre(s) ont été exclus."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "kickall2",
  classe: "Groupe",
  react: "🚫",
  desc: "Exclut tous les membres non administrateurs d’un coup."
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Bot_Admin,
    infos_Groupe,
    dev_num,
    ms,
    auteur_Message,
    id_Bot
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "❌ Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  const value = infos_Groupe.participants;
  let value2 = value.find(tmp => tmp.admin === "superadmin")?.jid;
  if (!value2) {
    value2 = value[0]?.jid;
  }
  if (![value2, id_Bot, ...dev_num].includes(auteur_Message)) {
    return sock.sendMessage(chatJid, {
      text: "❌ Seul le superadmin, le créateur du groupe, le créateur du bot ou un dev peut utiliser cette commande."
    }, {
      quoted: ms
    });
  }
  if (!verif_Bot_Admin) {
    return sock.sendMessage(chatJid, {
      text: "❌ Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: ms
    });
  }
  const record = await GroupSettings.findOne({
    where: {
      id: chatJid
    }
  });
  if (record?.goodbye === "oui") {
    return sock.sendMessage(chatJid, {
      text: "❗ Désactivez d’abord le message de départ (goodbye off).",
      quoted: ms
    });
  }
  const value3 = value.filter(tmp2 => !tmp2.admin && !dev_num.includes(tmp2.jid)).map(tmp3 => tmp3.jid);
  if (value3.length === 0) {
    return sock.sendMessage(chatJid, {
      text: "✅ Aucun membre non administrateur à exclure."
    }, {
      quoted: ms
    });
  }
  try {
    await sock.groupParticipantsUpdate(chatJid, value3, "remove");
    sock.sendMessage(chatJid, {
      text: "✅ " + value3.length + " membre(s) ont été exclus.",
      quoted: ms
    });
  } catch (err) {
    console.error("❌ Erreur exclusion en masse :", err);
    sock.sendMessage(chatJid, {
      text: "❌ Échec de l’exclusion en masse. Certains membres n’ont peut-être pas été retirés."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "ckick",
  classe: "Groupe",
  react: "🛑",
  desc: "Supprime tous les membres non administrateurs dont le JID commence par un indicatif spécifique."
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    verif_Bot_Admin,
    infos_Groupe,
    arg,
    dev_num,
    ms,
    auteur_Message,
    id_Bot
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  const value = infos_Groupe.participants;
  let value2 = value.find(tmp => tmp.admin === "superadmin")?.jid;
  if (!value2) {
    value2 = value[0]?.jid;
  }
  if (![value2, id_Bot, ...dev_num].includes(auteur_Message)) {
    return sock.sendMessage(chatJid, {
      text: "❌ Seul le superadmin, le créateur du groupe, le créateur du bot ou un dev peut utiliser cette commande."
    }, {
      quoted: ms
    });
  }
  if (!arg[0]) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez spécifier l'indicatif."
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
  const record = await GroupSettings.findOne({
    where: {
      id: chatJid
    }
  });
  if (record?.goodbye === "oui") {
    return sock.sendMessage(chatJid, {
      text: "Désactivez le goodbye message (goodbye off) avant de continuer."
    }, {
      quoted: ms
    });
  }
  const value3 = arg[0];
  const value4 = value.filter(tmp2 => tmp2.jid.startsWith(value3) && !tmp2.admin && !dev_num.includes(tmp2.jid)).map(tmp3 => tmp3.jid);
  if (value4.length === 0) {
    return sock.sendMessage(chatJid, {
      text: "Aucun membre non admin avec l'indicatif " + value3 + "."
    }, {
      quoted: ms
    });
  }
  for (const tmp4 of value4) {
    try {
      await sock.groupParticipantsUpdate(chatJid, [tmp4], "remove");
      await new Promise(tmp5 => setTimeout(tmp5, 500));
    } catch (err) {
      console.error("Erreur exclusion " + tmp4 + " :", err);
    }
  }
  sock.sendMessage(chatJid, {
    text: "✅ " + value4.length + " membre(s) avec l'indicatif " + value3 + " ont été exclus."
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "promote",
  classe: "Groupe",
  react: "⬆️",
  desc: "Promouvoir un membre comme administrateur."
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    auteur_Msg_Repondu,
    arg,
    getJid,
    infos_Groupe,
    verif_Admin,
    isSudo,
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
  if (verif_Admin || isSudo) {
    const value = await infos_Groupe.participants;
    const value2 = value.filter(tmp => tmp.admin).map(tmp2 => tmp2.jid);
    const value3 = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
    const value4 = await getJid(value3, chatJid, sock);
    if (!verif_Bot_Admin) {
      return sock.sendMessage(chatJid, {
        text: "Je dois être administrateur pour effectuer cette action."
      }, {
        quoted: ms
      });
    }
    if (!value4) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez mentionner un membre à promouvoir."
      }, {
        quoted: ms
      });
    }
    if (!value.find(tmp3 => tmp3.jid === value4)) {
      return sock.sendMessage(chatJid, {
        text: "Membre introuvable dans ce groupe."
      }, {
        quoted: ms
      });
    }
    if (value2.includes(value4)) {
      return sock.sendMessage(chatJid, {
        text: "ce membre est déjà un administrateur du groupe."
      }, {
        quoted: ms
      });
    }
    try {
      await sock.groupParticipantsUpdate(chatJid, [value4], "promote");
      sock.sendMessage(chatJid, {
        text: "@" + value4.split("@")[0] + " a été promu administrateur.",
        mentions: [value4]
      }, {
        quoted: ms
      });
    } catch (err) {
      console.error("Erreur :", err);
      sock.sendMessage(chatJid, {
        text: "Une erreur est survenue lors de la promotion."
      }, {
        quoted: ms
      });
    }
  } else {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas la permission d'utiliser cette commande."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "demote",
  classe: "Groupe",
  react: "⬇️",
  desc: "Retirer le rôle d'administrateur à un membre."
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    getJid,
    auteur_Msg_Repondu,
    arg,
    infos_Groupe,
    verif_Admin,
    isSudo,
    verif_Bot_Admin,
    dev_num,
    dev_id,
    ms
  } = ctx;
  if (!verif_Groupe) {
    return sock.sendMessage(chatJid, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: ms
    });
  }
  if (verif_Admin || isSudo) {
    const value = await infos_Groupe.participants;
    const value2 = value.filter(tmp => tmp.admin).map(tmp2 => tmp2.jid);
    const value3 = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
    const value4 = await getJid(value3, chatJid, sock);
    if (!verif_Bot_Admin) {
      return sock.sendMessage(chatJid, {
        text: "Je dois être administrateur pour effectuer cette action."
      }, {
        quoted: ms
      });
    }
    if (!value4) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez mentionner un membre à rétrograder."
      }, {
        quoted: ms
      });
    }
    if (!value.find(tmp3 => tmp3.jid === value4)) {
      return sock.sendMessage(chatJid, {
        text: "Membre introuvable dans ce groupe."
      });
    }
    if (!value2.includes(value4)) {
      return sock.sendMessage(chatJid, {
        text: "ce membre n'est pas un administrateur du groupe."
      }, {
        quoted: ms
      });
    }
    if (dev_num.includes(value4)) {
      return sock.sendMessage(chatJid, {
        text: "Vous ne pouvez pas rétrograder un développeur."
      }, {
        quoted: ms
      });
    }
    try {
      await sock.groupParticipantsUpdate(chatJid, [value4], "demote");
      sock.sendMessage(chatJid, {
        text: "@" + value4.split("@")[0] + " a été rétrogradé.",
        mentions: [value4]
      }, {
        quoted: ms
      });
    } catch (err) {
      console.error("Erreur :", err);
      sock.sendMessage(chatJid, {
        text: "Une erreur est survenue lors de la rétrogradation."
      }, {
        quoted: ms
      });
    }
  } else {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas la permission d'utiliser cette commande."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "gcreate",
  classe: "Groupe",
  react: "✅",
  desc: "Crée un groupe avec juste toi comme membre."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    isSudo,
    ms
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "❌ Vous n'avez pas les permissions pour créer un groupe."
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
registerCommand({
  nom_cmd: "leave",
  classe: "Groupe",
  react: "😐",
  desc: "Commande pour quitter un groupe"
}, async (chatJid, sock, ctx) => {
  const {
    isSudo
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas les permissions requises pour quitter ce groupe."
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
registerCommand({
  nom_cmd: "ginfo",
  classe: "Groupe",
  react: "🔎",
  desc: "Affiche les informations du groupe"
}, async (chatJid, sock, ctx) => {
  const groupMeta = await sock.groupMetadata(chatJid);
  await sock.sendMessage(chatJid, {
    text: "ID: " + groupMeta.id + "\nNom: " + groupMeta.subject + "\nDescription: " + groupMeta.desc
  }, {
    quoted: ctx.ms
  });
});
registerCommand({
  nom_cmd: "join",
  classe: "Groupe",
  react: "😶‍🌫",
  desc: "Permet de rejoindre un groupe via un lien d'invitation"
}, async (chatJid, sock, ctx) => {
  const {
    isSudo,
    arg,
    ms
  } = ctx;
  if (!isSudo) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas les permissions requises pour rejoindre un groupe."
    }, {
      quoted: ms
    });
  }
  if (!arg) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez fournir le lien d'invitation du groupe."
    }, {
      quoted: ms
    });
  }
  const text = arg.join("");
  const value = text.split("/")[3];
  await sock.groupAcceptInvite(value);
  await sock.sendMessage(chatJid, {
    text: "Vous avez rejoint le groupe avec succès."
  }, {
    quoted: ms
  });
});
async function gererDemandesIndividuellement(tmp, tmp2, tmp3, tmp4) {
  const {
    verif_Admin: verif_Admin,
    isSudo: isSudo,
    verif_Bot_Admin: verif_Bot_Admin,
    verif_Groupe: verif_Groupe,
    ms: ms
  } = tmp4;
  if (!verif_Groupe) {
    return tmp3.sendMessage(tmp, {
      text: "❌ Commande réservée aux groupes uniquement."
    }, {
      quoted: ms
    });
  }
  if (!verif_Admin && !isSudo) {
    return tmp3.sendMessage(tmp, {
      text: "❌ Vous n'avez pas les permissions pour utiliser cette commande."
    }, {
      quoted: ms
    });
  }
  if (!verif_Bot_Admin) {
    return tmp3.sendMessage(tmp, {
      text: "❌ Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: ms
    });
  }
  try {
    const value = await tmp3.groupRequestParticipantsList(tmp);
    if (!value || value.length === 0) {
      return tmp3.sendMessage(tmp, {
        text: "ℹ️ Aucune demande en attente."
      }, {
        quoted: ms
      });
    }
    const value2 = value.map(tmp5 => tmp5.jid);
    let currentPlayer = 0;
    for (const tmp6 of value2) {
      try {
        await tmp3.groupRequestParticipantsUpdate(tmp, [tmp6], tmp2);
        currentPlayer++;
        await new Promise(tmp7 => setTimeout(tmp7, 500));
      } catch (err) {
        console.error("❌ Erreur " + tmp2 + " pour " + tmp6 + " :", err.message);
      }
    }
    const value3 = tmp2 === "approve" ? "✅" : "❌";
    const value4 = tmp2 === "approve" ? "acceptée(s)" : "rejetée(s)";
    tmp3.sendMessage(tmp, {
      text: value3 + " " + currentPlayer + " demande(s) " + value4 + ".",
      quoted: ms
    });
  } catch (tmp8) {
    console.error("❌ Erreur générale :", tmp8);
    tmp3.sendMessage(tmp, {
      text: "❌ Une erreur est survenue.",
      quoted: ms
    });
  }
}
registerCommand({
  nom_cmd: "acceptall",
  classe: "Groupe",
  react: "✅",
  desc: "Accepte toutes les demandes une par une."
}, async (chatJid, sock, ctx) => {
  await gererDemandesIndividuellement(chatJid, "approve", sock, ctx);
});
registerCommand({
  nom_cmd: "rejectall",
  classe: "Groupe",
  react: "❌",
  desc: "Rejette toutes les demandes une par une."
}, async (chatJid, sock, ctx) => {
  await gererDemandesIndividuellement(chatJid, "reject", sock, ctx);
});
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
registerCommand({
  nom_cmd: "warn",
  classe: "Groupe",
  react: "⚠️",
  desc: "Avertit un membre du groupe ou gère les avertissements."
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    getJid,
    infos_Groupe,
    arg,
    verif_Admin,
    verif_Bot_Admin,
    isSudo,
    dev_num,
    ms,
    auteur_Message,
    auteur_Msg_Repondu,
    repondre
  } = ctx;
  if (!verif_Groupe) {
    return repondre("Commande utilisable uniquement dans les groupes.");
  }
  const value = await infos_Groupe.participants;
  const value2 = value.filter(tmp => tmp.admin).map(tmp2 => tmp2.phoneNumber);
  if (!arg[0] && !auteur_Msg_Repondu) {
    return repondre("⚠️ *Utilisation de la commande warn*\n\n• `warn @utilisateur` ou warn en répondant à un de ses messages : Ajouter un avertissement.\n• `warn reset @utilisateur` ou warn reset en répondant à un de ses messages : Réinitialiser les avertissements.\n• `warn limit <nombre>` : Définir la limite d'avertissements.");
  }
  if (arg[0] === "limit") {
    if (!isSudo && !verif_Admin) {
      return repondre("Vous n'avez pas la permission.");
    }
    const amount = parseInt(arg[1]);
    if (isNaN(amount) || amount < 1) {
      return repondre("Veuillez entrer une limite valide.");
    }
    await setLimit(amount);
    return repondre("✅ Limite d'avertissements définie à " + amount + ".");
  }
  if (arg[0] === "reset") {
    if (!isSudo && !verif_Admin) {
      return repondre("Vous n'avez pas la permission.");
    }
    const value3 = auteur_Msg_Repondu || arg[1]?.includes("@") && arg[1].replace("@", "") + "@lid";
    const value4 = await getJid(value3, chatJid, sock);
    await delWarn(value4);
    return sock.sendMessage(chatJid, {
      text: "✅ Les avertissements de @" + value4.split("@")[0] + " ont été réinitialisés.",
      mentions: [value4]
    }, {
      quoted: ms
    });
  }
  const value5 = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
  const value6 = await getJid(value5, chatJid, sock);
  if (!isSudo && !verif_Admin) {
    return repondre("Vous n'avez pas la permission.");
  }
  if (!verif_Bot_Admin) {
    return repondre("Je dois être administrateur pour effectuer cette action.");
  }
  if (value2.includes(value6)) {
    return repondre("Impossible d'avertir un administrateur.");
  }
  if (dev_num.includes(value6)) {
    return repondre("Impossible d'avertir un développeur.");
  }
  const value7 = await getLimit();
  const value8 = await setWarn(value6);
  const value9 = new Date().toLocaleString("fr-FR");
  await sock.sendMessage(chatJid, {
    text: "⚠️ **Avertissement** ⚠️\n\n👤 Utilisateur : @" + value6.split("@")[0] + "\n📌 Warn par : @" + auteur_Message.split("@")[0] + "\n📅 Date : " + value9 + "\n📊 Total warns : " + value8.count + "/" + value7,
    mentions: [value6, auteur_Message]
  }, {
    quoted: ms
  });
  if (value8.count >= value7) {
    try {
      await sock.groupParticipantsUpdate(chatJid, [value6], "remove");
      sock.sendMessage(chatJid, {
        text: "🚫 @" + value6.split("@")[0] + " a été exclu pour avoir atteint la limite d'avertissements.",
        mentions: [value6]
      }, {
        quoted: ms
      });
      await delWarn(value6);
    } catch {
      repondre("Erreur lors de l'exclusion.");
    }
  }
});
registerCommand({
  nom_cmd: "vcf",
  classe: "Groupe",
  react: "📇",
  desc: "Enregistre les contacts de tous les membres du groupe dans un fichier VCF"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    infos_Groupe,
    isSudo,
    ms
  } = ctx;
  try {
    if (!verif_Groupe) {
      return sock.sendMessage(chatJid, {
        text: "Cette commande doit être utilisée dans un groupe."
      }, {
        quoted: ms
      });
    }
    if (!isSudo) {
      return sock.sendMessage(chatJid, {
        text: "Vous n'avez pas les permissions requises pour utiliser cette commande."
      }, {
        quoted: ms
      });
    }
    const groupJid = infos_Groupe;
    if (!groupJid || !groupJid.participants) {
      return sock.sendMessage(chatJid, {
        text: "Échec de la récupération des métadonnées du groupe ou de la liste des participants."
      }, {
        quoted: ms
      });
    }
    const value = groupJid.participants;
    const list = [];
    for (const tmp of value) {
      const value2 = tmp.jid;
      const value3 = value2.split("@")[0];
      let groupJid2 = value3;
      try {
        const record = await Ranks.findOne({
          where: {
            id: value2
          }
        }).catch(() => null);
        if (record && record.name) {
          groupJid2 = record.name;
        } else if (tmp.notify) {
          groupJid2 = tmp.notify;
        }
      } catch {
        groupJid2 = value3;
      }
      list.push("BEGIN:VCARD\nVERSION:3.0\nFN:" + groupJid2 + "\nTEL;TYPE=CELL:" + value3 + "\nEND:VCARD");
    }
    const value4 = groupJid.subject || "Groupe_" + chatJid.replace(/[@.]/g, "_");
    const url = "contacts_groupe_" + value4 + ".vcf";
    const url2 = "./" + url;
    fs.writeFileSync(url2, list.join("\n"));
    const url3 = "*TOUS LES CONTACTS DES MEMBRES ENREGISTRÉS*\nGroupe : *" + value4 + "*\nContacts : *" + value.length + "*";
    await sock.sendMessage(chatJid, {
      document: fs.readFileSync(url2),
      mimetype: "text/vcard",
      filename: url,
      caption: url3
    }, {
      quoted: ms
    });
    fs.unlinkSync(url2);
  } catch (err) {
    console.error("Erreur lors du traitement de la commande vcf:", err);
    return sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors du traitement de la commande vcf."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "antilink",
  classe: "Groupe",
  react: "🔗",
  desc: "Active ou configure l'antilink pour les groupes"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre,
    arg,
    verif_Groupe,
    verif_Admin
  } = ctx;
  try {
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes");
    }
    if (!verif_Admin) {
      return repondre("Seuls les administrateurs peuvent utiliser cette commande");
    }
    const value = arg[0]?.toLowerCase();
    const list = ["on", "off"];
    const list2 = ["supp", "warn", "kick"];
    const [tmp] = await Antilink.findOrCreate({
      where: {
        id: chatJid
      },
      defaults: {
        id: chatJid,
        mode: "non",
        type: "supp"
      }
    });
    if (list.includes(value)) {
      const value2 = value === "on" ? "oui" : "non";
      if (tmp.mode === value2) {
        return repondre("L'Antilink est déjà " + value);
      }
      tmp.mode = value2;
      await tmp.save();
      return repondre("L'Antilink " + (value === "on" ? "activé" : "désactivé") + " avec succès !");
    }
    if (list2.includes(value)) {
      if (tmp.mode !== "oui") {
        return repondre("Veuillez activer l'antilink d'abord en utilisant `antilink on`");
      }
      if (tmp.type === value) {
        return repondre("L'action antilink est déjà définie sur " + value);
      }
      tmp.type = value;
      await tmp.save();
      return repondre("L'Action de l'antilink définie sur " + value + " avec succès !");
    }
    return repondre("Utilisation :\nantilink on/off: Activer ou désactiver l'antilink\nantilink supp/warn/kick: Configurer l'action antilink");
  } catch (err) {
    console.error("Erreur lors de la configuration d'antilink :", err);
    repondre("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "antitag",
  classe: "Groupe",
  react: "🔗",
  desc: "Active ou configure l'antitag pour les groupes"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre,
    arg,
    verif_Groupe,
    verif_Admin
  } = ctx;
  try {
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes");
    }
    if (!verif_Admin) {
      return repondre("Seuls les administrateurs peuvent utiliser cette commande");
    }
    const value = arg[0]?.toLowerCase();
    const list = ["on", "off"];
    const list2 = ["supp", "warn", "kick"];
    const [tmp] = await Antitag.findOrCreate({
      where: {
        id: chatJid
      },
      defaults: {
        id: chatJid,
        mode: "non",
        type: "supp"
      }
    });
    if (list.includes(value)) {
      const value2 = value === "on" ? "oui" : "non";
      if (tmp.mode === value2) {
        return repondre("L'Antitag est déjà " + value);
      }
      tmp.mode = value2;
      await tmp.save();
      return repondre("L'Antitag " + (value === "on" ? "activé" : "désactivé") + " avec succès !");
    }
    if (list2.includes(value)) {
      if (tmp.mode !== "oui") {
        return repondre("Veuillez activer l'antitag d'abord en utilisant `antitag on`");
      }
      if (tmp.type === value) {
        return repondre("L'action antitag est déjà définie sur " + value);
      }
      tmp.type = value;
      await tmp.save();
      return repondre("L'Action de l'antitag définie sur " + value + " avec succès !");
    }
    return repondre("Utilisation :\nantitag on/off: Activer ou désactiver l'antitag\nantitag supp/warn/kick: Configurer l'action antitag");
  } catch (err) {
    console.error("Erreur lors de la configuration d'antitag :", err);
    repondre("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "antispam",
  classe: "Groupe",
  react: "🔗",
  desc: "Active ou configure l'antispam pour les groupes"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    verif_Groupe,
    verif_Admin
  } = ctx;
  try {
    if (!verif_Groupe) {
      return repondre("❌ Cette commande fonctionne uniquement dans les groupes.");
    }
    if (!verif_Admin) {
      return repondre("❌ Seuls les administrateurs peuvent utiliser cette commande.");
    }
    const value = arg[0]?.toLowerCase();
    const list = ["on", "off"];
    const list2 = ["supp", "warn", "kick"];
    const [tmp] = await Antispam.findOrCreate({
      where: {
        id: chatJid
      },
      defaults: {
        id: chatJid,
        mode: "non",
        type: "supp"
      }
    });
    if (list.includes(value)) {
      const value2 = value === "on" ? "oui" : "non";
      if (tmp.mode === value2) {
        return repondre("L'Antispam est déjà " + value + ".");
      }
      tmp.mode = value2;
      await tmp.save();
      return repondre("L'Antispam a été " + (value === "on" ? "activé" : "désactivé") + " avec succès !");
    }
    if (list2.includes(value)) {
      if (tmp.mode !== "oui") {
        return repondre("❌ Veuillez activer l'antispam d'abord avec `antispam on`.");
      }
      if (tmp.type === value) {
        return repondre("⚠️ L'action antispam est déjà définie sur " + value + ".");
      }
      tmp.type = value;
      await tmp.save();
      return repondre("✅ L'action antispam est maintenant définie sur " + value + ".");
    }
    return repondre("Utilisation :\nantispam on/off : Activer ou désactiver l'antispam.\nantispam supp/warn/kick : Configurer l'action antispam.");
  } catch (err) {
    console.error("Erreur lors de la configuration d'antispam :", err);
    return repondre("❌ Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "antibot",
  classe: "Groupe",
  react: "🔗",
  desc: "Active ou configure l'antibot pour les groupes"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    verif_Groupe,
    verif_Admin
  } = ctx;
  try {
    if (!verif_Groupe) {
      return repondre("❌ Cette commande fonctionne uniquement dans les groupes.");
    }
    if (!verif_Admin) {
      return repondre("❌ Seuls les administrateurs peuvent utiliser cette commande.");
    }
    const value = arg[0]?.toLowerCase();
    const list = ["on", "off"];
    const list2 = ["supp", "warn", "kick"];
    const [tmp] = await Antibot.findOrCreate({
      where: {
        id: chatJid
      },
      defaults: {
        id: chatJid,
        mode: "non",
        type: "supp"
      }
    });
    if (list.includes(value)) {
      const value2 = value === "on" ? "oui" : "non";
      if (tmp.mode === value2) {
        return repondre("L'Antibot est déjà " + value + ".");
      }
      tmp.mode = value2;
      await tmp.save();
      return repondre("L'Antibot a été " + (value === "on" ? "activé" : "désactivé") + " avec succès !");
    }
    if (list2.includes(value)) {
      if (tmp.mode !== "oui") {
        return repondre("❌ Veuillez activer l'antibot d'abord avec `antibot on`.");
      }
      if (tmp.type === value) {
        return repondre("⚠️ L'action antibot est déjà définie sur " + value + ".");
      }
      tmp.type = value;
      await tmp.save();
      return repondre("✅ L'action antibot est maintenant définie sur " + value + ".");
    }
    return repondre("Utilisation :\nantibot on/off : Activer ou désactiver l'antibot.\nantibot supp/warn/kick : Configurer l'action antibot.");
  } catch (err) {
    console.error("Erreur lors de la configuration d'antibot :", err);
    return repondre("❌ Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "antimentiongc",
  classe: "Groupe",
  react: "📢",
  desc: "Active ou configure l'antimention pour les groupes"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre,
    arg,
    verif_Groupe,
    verif_Admin
  } = ctx;
  try {
    if (!verif_Groupe) {
      return repondre("Cette commande ne fonctionne que dans les groupes.");
    }
    if (!verif_Admin) {
      return repondre("Seuls les administrateurs peuvent utiliser cette commande.");
    }
    const value = arg[0]?.toLowerCase();
    const list = ["on", "off"];
    const list2 = ["supp", "warn", "kick"];
    const [tmp] = await Antimention.findOrCreate({
      where: {
        id: chatJid
      },
      defaults: {
        id: chatJid,
        mode: "non",
        type: "supp"
      }
    });
    if (list.includes(value)) {
      const value2 = value === "on" ? "oui" : "non";
      if (tmp.mode === value2) {
        return repondre("L'antimention est déjà " + value + ".");
      }
      tmp.mode = value2;
      await tmp.save();
      return repondre("L'antimention a été " + (value === "on" ? "activé" : "désactivé") + " avec succès.");
    }
    if (list2.includes(value)) {
      if (tmp.mode !== "oui") {
        return repondre("Veuillez d'abord activer l'antimention avec `antimention on`.");
      }
      if (tmp.type === value) {
        return repondre("L'action antimention est déjà définie sur " + value + ".");
      }
      tmp.type = value;
      await tmp.save();
      return repondre("Action antimention définie sur " + value + " avec succès.");
    }
    return repondre("Utilisation :\n- antimention on/off : Activer ou désactiver l'antimention\n- antimention supp/warn/kick : Définir l'action à appliquer");
  } catch (err) {
    console.error("Erreur lors de la configuration d'antimention :", err);
    return repondre("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
const welcomeGoodbyeCmd = cmdName => {
  const isWelcome = cmdName === "welcome";
  registerCommand({
    nom_cmd: cmdName,
    classe: "Groupe",
    react: "👋",
    desc: isWelcome ? "Configurer ou activer les messages de bienvenue" : "Configurer ou activer les messages d’adieu"
  }, async (chatJid, sock, ctx) => {
    const {
    repondre,
    arg,
    verif_Admin,
    verif_Groupe,
    auteur_Message
  } = ctx;
    try {
      if (!verif_Groupe) {
        return repondre("❌ Commande utilisable uniquement dans les groupes.");
      }
      if (!verif_Admin) {
        return repondre("❌ Seuls les administrateurs peuvent utiliser cette commande.");
      }
      const subCommand = arg[0]?.toLowerCase();
      const [groupSettings] = await GroupSettings.findOrCreate({
        where: {
          id: chatJid
        },
        defaults: {
          id: chatJid,
          [cmdName]: "non"
        }
      });
      const [eventsRow] = await Events2.findOrCreate({
        where: {
          id: chatJid
        },
        defaults: {
          id: chatJid
        }
      });
      const messageColumn = isWelcome ? "welcome_msg" : "goodbye_msg";
      const storedMessage = eventsRow[messageColumn];
      if (!arg.length) {
        return repondre("🛠️ *Utilisation de la commande " + cmdName + "* :\n\n1️⃣ *" + cmdName + " on/off* – Active ou désactive les messages de " + (isWelcome ? "bienvenue" : "d’adieu") + ".\n2️⃣ *" + cmdName + " get* – Affiche le message " + (isWelcome ? "de bienvenue" : "d’adieu") + " personnalisé.\n3️⃣ *" + cmdName + " Votre message...* – Définir un message personnalisé.\n4️⃣ *" + cmdName + " défaut* – Réinitialise le message " + (isWelcome ? "de bienvenue" : "d’adieu") + ".\n\n📌 Variables disponibles :\n@user → Mention du membre\n#groupe → Nom du groupe\n#membre → Nombre de membres\n#desc → Description du groupe\n#url=lien → Utilise un média (image, vidéo)\n#pp → Utilise la photo de profil du membre\n#gpp → Utilise la photo de profil du groupe\n#audio=url → Utilise un audio");
      }
      if (["on", "off"].includes(subCommand)) {
        const mode = subCommand === "on" ? "oui" : "non";
        if (groupSettings[cmdName] === mode) {
          return repondre("ℹ️ Le message " + (isWelcome ? "de bienvenue" : "d’adieu") + " est déjà " + (subCommand === "on" ? "activé" : "désactivé") + ".");
        }
        groupSettings[cmdName] = mode;
        await groupSettings.save();
        return repondre("✅ Message " + (isWelcome ? "de bienvenue" : "d’adieu") + " " + (subCommand === "on" ? "activé" : "désactivé") + " avec succès.");
      }
      if (subCommand === "get") {
        if (!storedMessage || !storedMessage.trim()) {
          return repondre("⚠️ Aucun message " + (isWelcome ? "de bienvenue" : "d’adieu") + " personnalisé configuré.");
        }
        const groupMeta = await sock.groupMetadata(chatJid);
        const groupName = groupMeta.subject || "Groupe";
        const memberCount = groupMeta.participants.length;
        const groupDesc = groupMeta.desc || "Aucune description";
        const userMention = "@" + auteur_Message.split("@")[0];
        let formattedMessage = storedMessage;
        const urlMatch = formattedMessage.match(/#url=(\S+)/i);
        const audioMatch = formattedMessage.match(/#audio=(\S+)/i);
        const useProfilePic = formattedMessage.includes("#pp");
        const useGroupPic = formattedMessage.includes("#gpp");
        formattedMessage = formattedMessage.replace(/#url=\S+/i, "").replace(/#audio=\S+/i, "").replace(/#pp/gi, "").replace(/#gpp/gi, "").replace(/@user/gi, userMention).replace(/#groupe/gi, groupName).replace(/#membre/gi, memberCount).replace(/#desc/gi, groupDesc);
        let mediaSent = false;
        if (urlMatch) {
          const mediaUrl = urlMatch[1];
          const extension = mediaUrl.split(".").pop().toLowerCase();
          let mediaPayload = null;
          if (["mp4", "mov", "webm"].includes(extension)) {
            mediaPayload = {
              video: {
                url: mediaUrl
              },
              caption: formattedMessage.trim(),
              gifPlayback: true,
              mentions: [auteur_Message]
            };
          } else if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
            mediaPayload = {
              image: {
                url: mediaUrl
              },
              caption: formattedMessage.trim(),
              mentions: [auteur_Message]
            };
          }
          if (mediaPayload) {
            await sock.sendMessage(chatJid, mediaPayload);
            mediaSent = true;
          }
        } else if (useProfilePic) {
          try {
            const profilePic = await sock.profilePictureUrl(auteur_Message, "image");
            await sock.sendMessage(chatJid, {
              image: {
                url: profilePic
              },
              caption: formattedMessage.trim(),
              mentions: [auteur_Message]
            });
            mediaSent = true;
          } catch {}
        } else if (useGroupPic) {
          try {
            const groupPic = await sock.profilePictureUrl(chatJid, "image");
            await sock.sendMessage(chatJid, {
              image: {
                url: groupPic
              },
              caption: formattedMessage.trim(),
              mentions: [auteur_Message]
            });
            mediaSent = true;
          } catch {}
        }
        if (audioMatch) {
          const audioUrl = audioMatch[1];
          await sock.sendMessage(chatJid, {
            audio: {
              url: audioUrl
            },
            mimetype: "audio/mpeg"
          });
          mediaSent = true;
        }
        if (!mediaSent && formattedMessage.trim()) {
          await sock.sendMessage(chatJid, {
            text: formattedMessage.trim(),
            mentions: [auteur_Message]
          });
        }
        return;
      }
      if (subCommand === "défaut" || subCommand === "default") {
        if (!storedMessage) {
          return repondre("ℹ️ Aucun message " + (isWelcome ? "de bienvenue" : "d’adieu") + " n’est actuellement défini.");
        }
        eventsRow[messageColumn] = null;
        await eventsRow.save();
        return repondre("✅ Message " + (isWelcome ? "de bienvenue" : "d’adieu") + " réinitialisé aux paramètres par défaut.");
      }
      const newMessage = arg.join(" ").trim();
      if (!newMessage) {
        return repondre("❌ Le message ne peut pas être vide.");
      }
      eventsRow[messageColumn] = newMessage;
      await eventsRow.save();
      return repondre("✅ Nouveau message " + (isWelcome ? "de bienvenue" : "d’adieu") + " enregistré avec succès !");
    } catch (err) {
      console.error("❌ Erreur " + cmdName + " :", err);
      repondre("❌ Une erreur s’est produite.");
    }
  });
};

welcomeGoodbyeCmd("welcome");
welcomeGoodbyeCmd("goodbye");
const commands = [{
  nom_cmd: "antipromote",
  colonne: "antipromote",
  react: "🛑",
  desc: "Active ou désactive l'antipromotion",
  table: GroupSettings
}, {
  nom_cmd: "antidemote",
  colonne: "antidemote",
  react: "🛑",
  desc: "Active ou désactive l'antidémotion",
  table: GroupSettings
}, {
  nom_cmd: "promotealert",
  colonne: "promoteAlert",
  react: "⚠️",
  desc: "Active ou désactive l'alerte de promotion",
  table: Events2
}, {
  nom_cmd: "demotealert",
  colonne: "demoteAlert",
  react: "⚠️",
  desc: "Active ou désactive l'alerte de rétrogradation",
  table: Events2
}];
commands.forEach(({
  nom_cmd: cmdName,
  colonne: columnName,
  react: reactEmoji,
  desc: description,
  table: dbTable
}) => {
  registerCommand({
    nom_cmd: cmdName,
    classe: "Groupe",
    react: reactEmoji,
    desc: description
  }, async (chatJid, sock, ctx) => {
    const {
    repondre,
    arg,
    verif_Groupe,
    verif_Admin
  } = ctx;
    try {
      if (!verif_Groupe) {
        return repondre("❌ Cette commande fonctionne uniquement dans les groupes.");
      }
      if (!verif_Admin) {
        return repondre("❌ Seuls les administrateurs peuvent utiliser cette commande.");
      }
      const subCommand = arg[0]?.toLowerCase();
      const toggleOptions = ["on", "off"];
      const [dbRow] = await dbTable.findOrCreate({
        where: {
          id: chatJid
        },
        defaults: {
          id: chatJid,
          [columnName]: "non"
        }
      });
      if (toggleOptions.includes(subCommand)) {
        const mode = subCommand === "on" ? "oui" : "non";
        if (dbRow[columnName] === mode) {
          return repondre("ℹ️ " + cmdName + " est déjà " + subCommand + ".");
        }
        dbRow[columnName] = mode;
        await dbRow.save();
        return repondre("✅ " + cmdName + " " + (subCommand === "on" ? "activé" : "désactivé") + " avec succès.");
      }
      return repondre("🛠️ Utilisation :\n> " + cmdName + " on/off – " + description.toLowerCase());
    } catch (err) {
      console.error("Erreur lors de la configuration de " + cmdName + " :", err);
      return repondre("❌ Une erreur s'est produite lors de l'exécution de la commande.");
    }
  });
});
