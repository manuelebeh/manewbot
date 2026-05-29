'use strict';

const { registerCommand } = require('../register');
const { fs, path, os, axios, config, spawn, convertWebpToMp4 } = require('../media');

registerCommand({
  nom_cmd: "tovv",
  classe: "Outils",
  react: "👀",
  desc: "envoie un message en vue unique dans la discussion"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    msg_Repondu,
    repondre
  } = ctx;
  if (!msg_Repondu) {
    return repondre("Veuillez mentionner un message qui n'est pas en vue unique.");
  }
  let urlToken2 = Object.keys(msg_Repondu).find(param2 => param2.startsWith("viewOnceMessage"));
  let value2 = msg_Repondu;
  if (urlToken2) {
    value2 = msg_Repondu[urlToken2].message;
  }
  if (value2) {
    if (value2.imageMessage && value2.imageMessage.viewOnce == true || value2.videoMessage && value2.videoMessage.viewOnce == true || value2.audioMessage && value2.audioMessage.viewOnce == true) {
      return repondre("Ce message est un message en vue unique.");
    }
  }
  try {
    let value32;
    let payload2 = {
      quoted: ms
    };
    if (value2.imageMessage) {
      value32 = await sock.dl_save_media_ms(value2.imageMessage);
      await sock.sendMessage(chatJid, {
        image: {
          url: value32
        },
        viewOnce: true,
        caption: value2.imageMessage.caption || ""
      }, payload2);
    } else if (value2.videoMessage) {
      value32 = await sock.dl_save_media_ms(value2.videoMessage);
      await sock.sendMessage(chatJid, {
        video: {
          url: value32
        },
        viewOnce: true,
        caption: value2.videoMessage.caption || ""
      }, payload2);
    } else if (value2.audioMessage) {
      value32 = await sock.dl_save_media_ms(value2.audioMessage);
      await sock.sendMessage(chatJid, {
        audio: {
          url: value32
        },
        viewOnce: true,
        mimetype: "audio/mp4",
        ptt: false
      }, payload2);
    } else {
      return repondre("Ce type de message en vue unique n'est pas pris en charge.");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du message en vue unique :", err.message || err);
    return repondre("Une erreur est survenue lors du traitement du message.");
  }
});
