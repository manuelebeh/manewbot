'use strict';

const { registerCommand } = require('../register');
const { fs, axios, config, Sticker, StickerTypes, sharp, uploadToCatbox, remini } = require('../media');
const { validateRemoteMediaUrl } = require('../../../lib/url-safety');
const {
  getServiceUrls,
  serviceNotConfiguredMessage,
} = require('../../../lib/service-urls');

registerCommand({
  nom_cmd: "toimage",
  classe: "Conversion",
  react: "✍️",
  desc: "Convertit un sticker en image",
  alias: ["toimg", "photo"]
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  if (!msg_Repondu || !msg_Repondu.stickerMessage) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à un sticker."
    }, {
      quoted: ms
    });
  }
  try {
    const mediaPath2 = await sock.dl_save_media_ms(msg_Repondu.stickerMessage);
    const outputBuffer2 = await sharp(mediaPath2).png().toBuffer();
    await sock.sendMessage(chatJid, {
      image: outputBuffer2
    }, {
      quoted: ms
    });
  } catch (err) {
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la conversion en image : " + err.message
    }, {
      quoted: ms
    });
  }
});
