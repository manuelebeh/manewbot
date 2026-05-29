'use strict';

const { registerCommand } = require('../register');
const { axios, config, translate, Sticker, StickerTypes } = require('../deps');
registerCommand({
  nom_cmd: "stickersearch",
  classe: "Search",
  react: "🖼️",
  desc: "Recherche et envoie des stickers animés basés sur un mot-clé.",
  alias: ["sstick"]
}, async (jid, bot, ctx) => {
  const {
    arg,
    auteur_Message,
    ms
  } = ctx;
  if (!arg.length) {
    return bot.sendMessage(jid, {
      text: "Veuillez fournir un terme de recherche pour le sticker !"
    }, {
      quoted: ms
    });
  }
  if (!config.TENOR_API_KEY) {
    return bot.sendMessage(jid, {
      text: "Recherche de stickers non configurée (TENOR_API_KEY)."
    }, {
      quoted: ms
    });
  }
  const searchQuery = encodeURIComponent(arg.join(" "));
  try {
    const tenorBase = (config.TENOR_API_BASE || 'https://tenor.googleapis.com/v2').replace(/\/$/, '');
    const response = await axios.get(tenorBase + "/search?q=" + searchQuery + "&key=" + config.TENOR_API_KEY + "&client_key=my_project&limit=8&media_filter=gif");
    const results = response.data.results;
    if (!results.length) {
      return bot.sendMessage(jid, {
        text: "Aucun sticker trouvé pour cette recherche."
      }, {
        quoted: ms
      });
    }
    for (let i = 0; i < Math.min(8, results.length); i++) {
      const gifUrl = results[i].media_formats.gif.url;
      const sticker = new Sticker(gifUrl, {
        pack: config.STICKER_PACK_NAME,
        author: config.STICKER_AUTHOR_NAME,
        type: StickerTypes.FULL,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 60,
        background: "transparent"
      });
      const stickerBuffer = await sticker.toBuffer();
      await bot.sendMessage(jid, {
        sticker: stickerBuffer
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    console.error(err);
    bot.sendMessage(jid, {
      text: "Une erreur s'est produite lors de la récupération des stickers."
    }, {
      quoted: ms
    });
  }
});
