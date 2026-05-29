'use strict';

const {
  registerCommand,
} = require('./deps');

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
