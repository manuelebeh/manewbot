'use strict';

const {
  registerCommand,
  axios,
  config,
  searchImages,
} = require('./_shared');

registerCommand({
  nom_cmd: "img",
  classe: "Search",
  react: "🔍",
  desc: "Recherche d'images"
}, async (jid, bot, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  const query = arg.join(" ");
  if (!query) {
    return bot.sendMessage(jid, {
      text: "Exemple : img luffy"
    }, {
      quoted: ms
    });
  }
  try {
    const results = await searchImages(query);
    if (!results || results.length === 0) {
      return bot.sendMessage(jid, {
        text: "Aucune image trouvée."
      }, {
        quoted: ms
      });
    }
    let sentCount = 0;
    let index = 0;
    while (sentCount < 5 && index < results.length) {
      const imageUrl = results[index].image;
      index++;
      if (!imageUrl) {
        continue;
      }
      try {
        await bot.sendMessage(jid, {
          image: {
            url: imageUrl
          },
          caption: "```Powered by Manewbot```"
        }, {
          quoted: ms
        });
        sentCount++;
      } catch (sendErr) {
        continue;
      }
    }
    if (sentCount === 0) {
      await bot.sendMessage(jid, {
        text: "❌ Impossible d'envoyer les images."
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    await bot.sendMessage(jid, {
      text: "Erreur lors de la recherche."
    }, {
      quoted: ms
    });
  }
});
