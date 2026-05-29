'use strict';

const { registerCommand } = require('../register');
const { sendStickerFromReply, StickerTypes } = require('../sticker-helpers');

registerCommand({
  nom_cmd: 'round',
  classe: 'Conversion',
  react: '🔲',
  desc: "Crée un sticker avec des coins arrondis à partir d'une image ou vidéo",
}, async (chatJid, sock, ctx) => {
  const { msg_Repondu, ms } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, { text: 'Répondez à une image ou vidéo.' }, { quoted: ms });
  }
  try {
    await sendStickerFromReply(sock, chatJid, ms, sourceMessage2, StickerTypes.ROUNDED);
  } catch (err) {
    console.error('Erreur lors de la création du sticker :', err);
    await sock.sendMessage(
      chatJid,
      { text: 'Erreur lors de la création du sticker : ' + err.message },
      { quoted: ms }
    );
  }
});
