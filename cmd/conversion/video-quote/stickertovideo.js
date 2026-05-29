'use strict';

const { registerCommand } = require('../register');
const { fs, path, os, axios, config, spawn, convertWebpToMp4 } = require('../media');

registerCommand({
  nom_cmd: "stickertovideo",
  classe: "Conversion",
  react: "🎞️",
  desc: "Convertit un sticker en vidéo MP4",
  alias: ["stovid"]
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre,
    msg_Repondu
  } = ctx;
  try {
    if (!msg_Repondu || !msg_Repondu.stickerMessage) {
      return sock.sendMessage(chatJid, {
        text: "Répondez à un sticker."
      }, {
        quoted: ms
      });
    }
    const mediaPath2 = await sock.dl_save_media_ms(msg_Repondu.stickerMessage);
    const value2 = fs.createReadStream(mediaPath2);
    const mp4Url2 = await convertWebpToMp4({
      file: value2,
      filename: "fichier.webp"
    });
    await sock.sendMessage(chatJid, {
      video: {
        url: mp4Url2
      },
      caption: "```Powered by Manewbot```"
    }, {
      quoted: ms
    });
    fs.unlinkSync(mediaPath2);
  } catch (err) {
    console.error(err);
    repondre("❌ Une erreur est survenue pendant la conversion.");
  }
});
