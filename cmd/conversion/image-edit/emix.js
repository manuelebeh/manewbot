'use strict';

const { registerCommand } = require('../register');
const { fs, axios, config, Sticker, StickerTypes, sharp, uploadToCatbox, remini } = require('../media');
const { validateRemoteMediaUrl } = require('../../../lib/url-safety');
const {
  getServiceUrls,
  serviceNotConfiguredMessage,
} = require('../../../lib/service-urls');

registerCommand({
  nom_cmd: "emix",
  classe: "Conversion",
  react: "🌟",
  desc: "Mixes deux emojis pour créer un sticker"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    prefixe,
    ms
  } = ctx;
  if (!arg || arg.length < 1) {
    return sock.sendMessage(chatJid, {
      text: "Example: " + prefixe + "emix 😅;🤔"
    }, {
      quoted: ms
    });
  }
  let [emoji1, emoji2] = arg[0].split(";");
  if (!config.TENOR_EMOJI_API_KEY) {
    return sock.sendMessage(chatJid, {
      text: "Emoji mix non configuré (TENOR_EMOJI_API_KEY)."
    }, {
      quoted: ms
    });
  }
  try {
    const tenorBase = (config.TENOR_API_BASE || 'https://tenor.googleapis.com/v2').replace(/\/$/, '');
    let response2 = await axios.get(tenorBase + "/featured?key=" + config.TENOR_EMOJI_API_KEY + "&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=" + encodeURIComponent(emoji1) + "_" + encodeURIComponent(emoji2));
    let data2 = response2.data;
    if (!data2.results || data2.results.length === 0) {
      return sock.sendMessage(chatJid, {
        text: "Aucun résultat trouvé pour ces emojis."
      }, {
        quoted: ms
      });
    }
    for (let value2 of data2.results) {
      const value32 = await axios.get(value2.url, {
        responseType: "arraybuffer"
      }).then(param2 => param2.data);
      const sticker2 = new Sticker(value32, {
        pack: config.STICKER_PACK_NAME,
        author: config.STICKER_AUTHOR_NAME,
        type: StickerTypes.FULL,
        quality: 100
      });
      const sourceMessage2 = Math.floor(Math.random() * 10000) + ".webp";
      await sticker2.toFile(sourceMessage2);
      await sock.sendMessage(chatJid, {
        sticker: fs.readFileSync(sourceMessage2)
      }, {
        quoted: ms
      });
      fs.unlinkSync(sourceMessage2);
    }
  } catch (err) {
    console.error("Erreur:", err);
    return sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de la recherche de l'image."
    }, {
      quoted: ms
    });
  }
});
