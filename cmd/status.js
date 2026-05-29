const {
  registerCommand
} = require("../lib/commands");
const {
  WA_CONF
} = require("../database/wa_conf");
const config = require("../set");
registerCommand({
  nom_cmd: "save",
  classe: "Status",
  react: "💾",
  desc: "Télécharge un statut WhatsApp"
}, async (jid, bot, ctx) => {
  const {
    ms,
    msg_Repondu,
    repondre,
    quote,
    id_Bot
  } = ctx;
  try {
    if (!msg_Repondu || !quote?.remoteJid || quote.remoteJid !== "status@broadcast") {
      return repondre("Merci de répondre à un statut WhatsApp.");
    }
    let mediaPath;
    let sendOptions = {
      quoted: ms
    };
    if (msg_Repondu.extendedTextMessage) {
      await bot.sendMessage(id_Bot, {
        text: msg_Repondu.extendedTextMessage.text
      }, sendOptions);
    } else if (msg_Repondu.imageMessage) {
      mediaPath = await bot.dl_save_media_ms(msg_Repondu.imageMessage);
      await bot.sendMessage(id_Bot, {
        image: {
          url: mediaPath
        },
        caption: msg_Repondu.imageMessage.caption
      }, sendOptions);
    } else if (msg_Repondu.videoMessage) {
      mediaPath = await bot.dl_save_media_ms(msg_Repondu.videoMessage);
      await bot.sendMessage(id_Bot, {
        video: {
          url: mediaPath
        },
        caption: msg_Repondu.videoMessage.caption
      }, sendOptions);
    } else if (msg_Repondu.audioMessage) {
      mediaPath = await bot.dl_save_media_ms(msg_Repondu.audioMessage);
      await bot.sendMessage(id_Bot, {
        audio: {
          url: mediaPath
        },
        mimetype: "audio/mp4",
        ptt: false
      }, sendOptions);
    } else {
      return repondre("Ce type de statut n'est pas pris en charge.");
    }
  } catch (err) {
    console.error("Erreur lors du téléchargement du statut :", err);
  }
});
registerCommand({
  nom_cmd: "sendme",
  classe: "Status",
  react: "📤",
  desc: "Renvoie un statut mentionné par l'utilisateur"
}, async (jid, bot, ctx) => {
  const {
    ms,
    msg_Repondu,
    repondre,
    quote
  } = ctx;
  try {
    if (!msg_Repondu || !quote?.remoteJid || quote.remoteJid !== "status@broadcast") {
      return repondre("❌ Réponds à un statut WhatsApp pour l'envoyer ici.");
    }
    let mediaPath;
    const sendOptions = {
      quoted: ms
    };
    if (msg_Repondu.extendedTextMessage) {
      const statusText = msg_Repondu.extendedTextMessage.text;
      await bot.sendMessage(jid, {
        text: statusText
      }, sendOptions);
    } else if (msg_Repondu.imageMessage) {
      mediaPath = await bot.dl_save_media_ms(msg_Repondu.imageMessage);
      await bot.sendMessage(jid, {
        image: {
          url: mediaPath
        },
        caption: msg_Repondu.imageMessage.caption || ""
      }, sendOptions);
    } else if (msg_Repondu.videoMessage) {
      mediaPath = await bot.dl_save_media_ms(msg_Repondu.videoMessage);
      await bot.sendMessage(jid, {
        video: {
          url: mediaPath
        },
        caption: msg_Repondu.videoMessage.caption || ""
      }, sendOptions);
    } else if (msg_Repondu.audioMessage) {
      mediaPath = await bot.dl_save_media_ms(msg_Repondu.audioMessage);
      await bot.sendMessage(jid, {
        audio: {
          url: mediaPath
        },
        mimetype: "audio/mp4",
        ptt: false
      }, sendOptions);
    } else {
      return repondre("❌ Ce type de statut n'est pas pris en charge.");
    }
  } catch (err) {
    console.error("Erreur lors du renvoi du statut :", err.message || err);
    return repondre("❌ Une erreur est survenue pendant le traitement.");
  }
});
registerCommand({
  nom_cmd: "lecture_status",
  classe: "Status",
  react: "📖",
  desc: "Active ou désactive la lecture auto des status"
}, async (jid, bot, ctx) => {
  const {
    ms,
    repondre,
    arg,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("Seuls les utilisateurs sudo peuvent utiliser cette commande");
    }
    const mode = arg[0]?.toLowerCase();
    const [waConf] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        lecture_status: "non"
      }
    });
    if (mode === "off") {
      waConf.lecture_status = "non";
      await waConf.save();
      return repondre("La lecture du statut est maintenant désactivée.");
    }
    if (mode === "on") {
      waConf.lecture_status = "oui";
      await waConf.save();
      return repondre("La lecture du statut est maintenant activée.");
    }
    return repondre("Utilisation :\nlecture_status on: Activer la lecture du statut\nlecture_status off: Désactiver la lecture du statut");
  } catch (err) {
    console.error("Erreur lors de la configuration de lecture_status :", err);
    repondre("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "dl_status",
  classe: "Status",
  react: "📥",
  desc: "Active ou désactive le téléchargement auto des status"
}, async (jid, bot, ctx) => {
  const {
    ms,
    repondre,
    arg,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("Seuls les utilisateurs sudo peuvent utiliser cette commande");
    }
    const mode = arg[0]?.toLowerCase();
    const [waConf] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        dl_status: "non"
      }
    });
    if (mode === "off") {
      waConf.dl_status = "non";
      await waConf.save();
      return repondre("Le téléchargement du statut est maintenant désactivé.");
    }
    if (mode === "on") {
      waConf.dl_status = "oui";
      await waConf.save();
      return repondre("Le téléchargement du statut est maintenant activé.");
    }
    return repondre("Utilisation :\ndl_status on: Activer le téléchargement du statut\ndl_status off: Désactiver le téléchargement du statut");
  } catch (err) {
    console.error("Erreur lors de la configuration de dl_status :", err);
    repondre("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "likestatus",
  classe: "Status",
  react: "👍",
  desc: "Active ou désactive les likes automatiques sur les statuts"
}, async (jid, bot, ctx) => {
  const {
    ms,
    repondre,
    arg,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("❌ Seuls les utilisateurs *sudo* peuvent utiliser cette commande.");
    }
    const mode = arg[0]?.toLowerCase();
    const [waConf] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        like_status: "non"
      }
    });
    const showUsage = () => {
      return repondre("🔧 *Paramètres des Likes Auto sur Statuts :*\n\n" + ("• *" + config.PREFIXE + "likestatus <emojie>* : Active avec <emojie>\n") + ("• *" + config.PREFIXE + "likestatus off* : Désactive les likes automatiques\n\n") + ("📌 *Exemple :* " + config.PREFIXE + "likestatus 🤣\n") + ("📊 Statut actuel : *" + (waConf.like_status === "non" ? "Désactivé" : "Activé (" + waConf.like_status + ")") + "*"));
    };
    if (!mode || mode === "") {
      return showUsage();
    }
    if (mode === "off") {
      waConf.like_status = "non";
      await waConf.save();
      return repondre("👍 Les likes automatiques ont été *désactivés*.");
    }
    const emojiRegex = /^(?:\p{Emoji}(?:\p{Emoji_Modifier}?|\uFE0F)?(?:\u200D\p{Emoji})*)$/u;
    if (!emojiRegex.test(mode)) {
      return showUsage();
    }
    waConf.like_status = mode;
    await waConf.save();
    return repondre("✅ Les likes automatiques sont maintenant activés avec l'emoji " + mode);
  } catch (err) {
    console.error("❌ Erreur dans likestatus :", err);
    return repondre("❌ Une erreur s'est produite lors de la configuration.");
  }
});
