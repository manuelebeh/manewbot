'use strict';

const {
  registerCommand,
  cmd,
  fs,
  path,
  os,
  axios,
  config,
  translate,
  prefixe,
  WA_CONF,
  TempMail,
  spawn,
  AdmZip,
  pkg,
  stylize,
  contextInfo,
} = require('./_shared');

registerCommand({
  nom_cmd: "vv",
  classe: "Outils",
  react: "👀",
  desc: "Affiche un message envoyé en vue unique dans la discussion"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    msg_Repondu,
    repondre,
    isStaff
  } = ctx;
  if (!isStaff) {
    return repondre("🔒 Commande réservée au propriétaire et aux sudo.");
  }
  if (!msg_Repondu) {
    return repondre("Veuillez mentionner un message en vue unique.");
  }
  let viewOnceKey = Object.keys(msg_Repondu).find(tmp => tmp.startsWith("viewOnceMessage"));
  let quotedMessage = msg_Repondu;
  if (viewOnceKey) {
    quotedMessage = msg_Repondu[viewOnceKey].message;
  }
  if (quotedMessage) {
    if (quotedMessage.imageMessage && quotedMessage.imageMessage.viewOnce !== true || quotedMessage.videoMessage && quotedMessage.videoMessage.viewOnce !== true || quotedMessage.audioMessage && quotedMessage.audioMessage.viewOnce !== true) {
      return repondre("Ce message n'est pas un message en vue unique.");
    }
  }
  try {
    let item;
    let options = {
      quoted: ms
    };
    if (quotedMessage.imageMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.imageMessage);
      await sock.sendMessage(chatJid, {
        image: {
          url: item
        },
        caption: quotedMessage.imageMessage.caption || ""
      }, options);
    } else if (quotedMessage.videoMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.videoMessage);
      await sock.sendMessage(chatJid, {
        video: {
          url: item
        },
        caption: quotedMessage.videoMessage.caption || ""
      }, options);
    } else if (quotedMessage.audioMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.audioMessage);
      await sock.sendMessage(chatJid, {
        audio: {
          url: item
        },
        mimetype: "audio/mp4",
        ptt: false
      }, options);
    } else {
      return repondre("Ce type de message en vue unique n'est pas pris en charge.");
    }
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi du message en vue unique :", err.message || err);
    return repondre("Une erreur est survenue lors du traitement du message.");
  }
});
registerCommand({
  nom_cmd: "vv2",
  classe: "Outils",
  react: "👀",
  desc: "Affiche un message envoyé en vue unique en inbox"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    id_Bot,
    msg_Repondu,
    repondre,
    isStaff
  } = ctx;
  if (!isStaff) {
    return repondre("🔒 Commande réservée au propriétaire et aux sudo.");
  }
  if (!msg_Repondu) {
    return repondre("Veuillez mentionner un message en vue unique.");
  }
  let viewOnceKey = Object.keys(msg_Repondu).find(tmp => tmp.startsWith("viewOnceMessage"));
  let quotedMessage = msg_Repondu;
  if (viewOnceKey) {
    quotedMessage = msg_Repondu[viewOnceKey].message;
  }
  if (quotedMessage) {
    if (quotedMessage.imageMessage && quotedMessage.imageMessage.viewOnce !== true || quotedMessage.videoMessage && quotedMessage.videoMessage.viewOnce !== true || quotedMessage.audioMessage && quotedMessage.audioMessage.viewOnce !== true) {
      return repondre("Ce message n'est pas un message en vue unique.");
    }
  }
  try {
    let item;
    let options = {
      quoted: ms
    };
    if (quotedMessage.imageMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.imageMessage);
      await sock.sendMessage(id_Bot, {
        image: {
          url: item
        },
        caption: quotedMessage.imageMessage.caption || ""
      }, options);
    } else if (quotedMessage.videoMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.videoMessage);
      await sock.sendMessage(id_Bot, {
        video: {
          url: item
        },
        caption: quotedMessage.videoMessage.caption || ""
      }, options);
    } else if (quotedMessage.audioMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.audioMessage);
      await sock.sendMessage(id_Bot, {
        audio: {
          url: item
        },
        mimetype: "audio/mp4",
        ptt: false
      }, options);
    } else {
      return repondre("Ce type de message en vue unique n'est pas pris en charge.");
    }
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi du message en vue unique :", err.message || err);
    return repondre("Une erreur est survenue lors du traitement du message.");
  }
});
