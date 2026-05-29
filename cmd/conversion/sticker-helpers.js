'use strict';

const { fs, config, Sticker, StickerTypes } = require('./media');

async function sendStickerFromReply(sock, chatJid, ms, sourceMessage2, stickerType) {
  const media = sourceMessage2?.imageMessage || sourceMessage2?.videoMessage;
  if (!media) {
    throw new Error('Veuillez répondre à une image, vidéo ou GIF valide.');
  }
  const mediaPath = await sock.dl_save_media_ms(media);
  if (!mediaPath) {
    throw new Error('Impossible de télécharger le fichier.');
  }
  const sticker = new Sticker(fs.readFileSync(mediaPath), {
    pack: config.STICKER_PACK_NAME,
    author: config.STICKER_AUTHOR_NAME,
    type: stickerType,
    quality: sourceMessage2.imageMessage ? 100 : 30,
  });
  const outPath = Math.floor(Math.random() * 10000) + '.webp';
  await sticker.toFile(outPath);
  await sock.sendMessage(chatJid, { sticker: fs.readFileSync(outPath) }, { quoted: ms });
  fs.unlinkSync(mediaPath);
  fs.unlinkSync(outPath);
}

module.exports = { sendStickerFromReply, StickerTypes };
