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
registerCommand({
  nom_cmd: "quotely",
  classe: "Conversion",
  react: "🖼️",
  desc: "Transforme un message cité en sticker stylisé.",
  alias: ["q"]
}, async (chatJid, sock, ctx) => {
  const {
  ms,
  msg_Repondu,
  repondre,
  auteur_Msg_Repondu
} = ctx;
  const sourceMessage2 = msg_Repondu?.conversation || msg_Repondu?.extendedTextMessage?.text;
  if (!sourceMessage2) {
    return repondre("Veuillez répondre à un message texte.");
  }
  let value2;
  try {
    value2 = await sock.profilePictureUrl(auteur_Msg_Repondu, "image");
  } catch (err) {
    value2 = "https://files.catbox.moe/8kvevz.jpg";
  }
  let value32;
  const rankRecord2 = await Ranks.findOne({
    where: {
      id: auteur_Msg_Repondu
    }
  });
  if (rankRecord2.name) {
    value32 = rankRecord2.name;
  } else {
    value32 = "Manewbot-USER";
  }
  const modes2 = ["#FFFFFF", "#000000", "#1f1f1f", "#e3e3e3"];
  const value42 = modes2[Math.floor(Math.random() * modes2.length)];
  const payload2 = {
    type: "quote",
    format: "png",
    backgroundColor: value42,
    width: 512,
    height: 512,
    scale: 3,
    messages: [{
      avatar: true,
      from: {
        first_name: value32,
        language_code: "fr",
        name: value32,
        photo: {
          url: value2
        }
      },
      text: sourceMessage2,
      replyMessage: {}
    }]
  };
  try {
    const response2 = await axios.post("https://bot.lyo.su/quote/generate", payload2);
    const value52 = Buffer.from(response2.data.result.image, "base64");
    const sticker2 = new Sticker(value52, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: 100
    });
    const sourceMessage32 = "/tmp/quotely_" + Date.now() + ".webp";
    await sticker2.toFile(sourceMessage32);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage32)
    }, {
      quoted: ms
    });
    fs.unlinkSync(sourceMessage32);
  } catch (err2) {
    console.error("Erreur Quotely :", err2.message || err2);
    return repondre("Une erreur est survenue lors de la génération du sticker.");
  }
});
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
