'use strict';

const {
  registerCommand,
  fs,
  path,
  os,
  axios,
  FormData,
  readFileSync,
  config,
  Sticker,
  StickerTypes,
  execSync,
  spawn,
  gTTS,
  sharp,
  Ranks,
  uploadToCatbox,
  alea,
  isSupportedFile,
  fusionCache,
  remini,
  convertWebpToMp4,
} = require('./_shared');

registerCommand({
  nom_cmd: "sticker",
  classe: "Conversion",
  react: "✍️",
  desc: "Crée un sticker à partir d'une image, vidéo ou GIF",
  alias: ["s", "stick"]
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    arg,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à une image, vidéo ou GIF pour créer un sticker."
    }, {
      quoted: ms
    });
  }
  let value2;
  try {
    const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage;
    if (!sourceMessage32) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez répondre à une image, vidéo ou GIF valide."
      }, {
        quoted: ms
      });
    }
    value2 = await sock.dl_save_media_ms(sourceMessage32);
    if (!value2) {
      throw new Error("Impossible de télécharger le fichier.");
    }
    const fileBuffer2 = fs.readFileSync(value2);
    const sticker2 = new Sticker(fileBuffer2, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: sourceMessage2.imageMessage ? 100 : 30
    });
    const sourceMessage42 = Math.floor(Math.random() * 10000) + ".webp";
    await sticker2.toFile(sourceMessage42);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage42)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
    fs.unlinkSync(sourceMessage42);
  } catch (err) {
    console.error("Erreur lors de la création du sticker:", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "crop",
  classe: "Conversion",
  react: "✂️",
  desc: "Crée un sticker croppé à partir d'une image ou vidéo"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à une image ou vidéo."
    }, {
      quoted: ms
    });
  }
  let value2;
  try {
    const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage;
    if (!sourceMessage32) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez répondre à une image ou vidéo valide."
      }, {
        quoted: ms
      });
    }
    value2 = await sock.dl_save_media_ms(sourceMessage32);
    const fileBuffer2 = fs.readFileSync(value2);
    const sticker2 = new Sticker(fileBuffer2, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.CROPPED,
      quality: sourceMessage2.imageMessage ? 100 : 30
    });
    const sourceMessage42 = Math.floor(Math.random() * 10000) + ".webp";
    await sticker2.toFile(sourceMessage42);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage42)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
    fs.unlinkSync(sourceMessage42);
  } catch (err) {
    console.error("Erreur lors de la création du sticker :", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "circle",
  classe: "Conversion",
  react: "🔵",
  desc: "Crée un sticker circulaire à partir d'une image ou vidéo"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à une image ou vidéo."
    }, {
      quoted: ms
    });
  }
  let value2;
  try {
    const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage;
    if (!sourceMessage32) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez répondre à une image ou vidéo valide."
      }, {
        quoted: ms
      });
    }
    value2 = await sock.dl_save_media_ms(sourceMessage32);
    const fileBuffer2 = fs.readFileSync(value2);
    const sticker2 = new Sticker(fileBuffer2, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.CIRCLE,
      quality: sourceMessage2.imageMessage ? 100 : 30
    });
    const sourceMessage42 = Math.floor(Math.random() * 10000) + ".webp";
    await sticker2.toFile(sourceMessage42);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage42)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
    fs.unlinkSync(sourceMessage42);
  } catch (err) {
    console.error("Erreur lors de la création du sticker :", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "round",
  classe: "Conversion",
  react: "🔲",
  desc: "Crée un sticker avec des coins arrondis à partir d'une image ou vidéo"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à une image ou vidéo."
    }, {
      quoted: ms
    });
  }
  let value2;
  try {
    const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage;
    if (!sourceMessage32) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez répondre à une image ou vidéo valide."
      }, {
        quoted: ms
      });
    }
    value2 = await sock.dl_save_media_ms(sourceMessage32);
    const fileBuffer2 = fs.readFileSync(value2);
    const sticker2 = new Sticker(fileBuffer2, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.ROUNDED,
      quality: sourceMessage2.imageMessage ? 100 : 30
    });
    const sourceMessage42 = Math.floor(Math.random() * 10000) + ".webp";
    await sticker2.toFile(sourceMessage42);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage42)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
    fs.unlinkSync(sourceMessage42);
  } catch (err) {
    console.error("Erreur lors de la création du sticker :", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
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
