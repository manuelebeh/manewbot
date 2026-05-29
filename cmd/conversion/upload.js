'use strict';

const { registerCommand } = require('./register');
const { fs, path, os, axios, FormData, readFileSync, config, Sticker, StickerTypes, spawn, gTTS, sharp, Ranks, uploadToCatbox, alea, isSupportedFile, fusionCache, remini, convertWebpToMp4 } = require('./media');

registerCommand({
  nom_cmd: "url",
  classe: "Conversion",
  react: "📤",
  desc: "Upload un fichier (image, vidéo, audio) sur Catbox et renvoie le lien"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez mentionner un fichier (image, vidéo, audio ou document)."
    }, {
      quoted: ms
    });
  }
  const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage || sourceMessage2.documentMessage || sourceMessage2.audioMessage;
  if (!sourceMessage32) {
    return sock.sendMessage(chatJid, {
      text: "Type de fichier non supporté. Veuillez mentionner une image, vidéo ou audio."
    }, {
      quoted: ms
    });
  }
  try {
    const mediaPath2 = await sock.dl_save_media_ms(sourceMessage32);
    const uploadUrl2 = await uploadToCatbox(mediaPath2);
    await sock.sendMessage(chatJid, {
      text: uploadUrl2
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de l'upload sur Catbox:", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du lien Catbox."
    }, {
      quoted: ms
    });
  }
});
