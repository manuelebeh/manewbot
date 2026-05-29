'use strict';

const { registerCommand } = require('../register');
const { fs, axios, config, Sticker, StickerTypes, Ranks } = require('../media');
const {
  getServiceUrls,
  serviceNotConfiguredMessage,
} = require('../../../lib/service-urls');

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
    value2 = config.VIDEO_QUOTE_PLACEHOLDER_URL;
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
  const {
    quotely
  } = getServiceUrls(config);
  if (!quotely) {
    return repondre(serviceNotConfiguredMessage("QUOTELY_API_BASE"));
  }
  try {
    const response2 = await axios.post(quotely + "/quote/generate", payload2);
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
