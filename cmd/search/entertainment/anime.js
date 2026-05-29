'use strict';

const { registerCommand } = require('../register');
const { axios, config, translate, Sticker, StickerTypes } = require('../deps');
const { validateRemoteMediaUrl } = require('../../../lib/url-safety');

registerCommand({
  nom_cmd: "anime",
  classe: "Search",
  react: "📺",
  desc: "Recherche un anime aléatoire avec un résumé et un lien vers MyAnimeList."
}, async (jid, bot, ctx) => {
  const apiUrl = (config.JIKAN_API_BASE || 'https://api.jikan.moe/v4').replace(/\/$/, '') + "/random/anime";
  try {
    const response = await axios.get(apiUrl);
    const anime = response.data.data;
    const title = anime.title;
    let synopsis = anime.synopsis;
    const imageUrl = anime.images.jpg.image_url;
    const episodes = anime.episodes;
    const status = anime.status;
    const synopsisFr = await translate(synopsis, {
      to: "fr"
    }).then(res => res.text).catch(() => synopsis);
    const statusFr = await translate(status, {
      to: "fr"
    }).then(res => res.text).catch(() => status);
    const message = "✨ *ANIME ALÉATOIRE* ✨\n\n" + ("📺 *Titre* : " + title + "\n") + ("🎬 *Épisodes* : " + episodes + "\n") + ("📡 *Statut* : " + statusFr + "\n") + ("🔗 *URL* : " + anime.url + "\n") + ("📝 *Synopsis* : " + synopsisFr + "\n");
    const imageCheck = validateRemoteMediaUrl(imageUrl);
    if (!imageCheck.ok) {
      return bot.sendMessage(jid, { text: message }, { quoted: ctx.ms });
    }
    await bot.sendMessage(jid, {
      image: {
        url: imageCheck.url
      },
      caption: message
    }, {
      quoted: ctx.ms
    });
  } catch (err) {
    console.error(err);
    bot.sendMessage(jid, {
      text: "Une erreur est survenue lors de la récupération des informations de l'anime."
    }, {
      quoted: ctx.ms
    });
  }
});
