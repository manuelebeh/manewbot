'use strict';

const { registerCommand } = require('../register');
const { fs, config, Sticker, StickerTypes, alea } = require('../media');

registerCommand({
  nom_cmd: "take",
  classe: "Conversion",
  react: "✍️",
  desc: "Modifie le nom d'un sticker"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    arg,
    nom_Auteur_Message,
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
    const sourceMessage2 = msg_Repondu.stickerMessage.quality || 40;
    const sticker2 = new Sticker(mediaPath2, {
      pack: arg.join(" ") ? arg.join(" ") : nom_Auteur_Message,
      author: "",
      type: StickerTypes.FULL,
      quality: sourceMessage2
    });
    const value2 = alea(".webp");
    await sticker2.toFile(value2);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(value2)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
  } catch (err) {
    await sock.sendMessage(chatJid, {
      text: "Erreur lors du renommage du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
