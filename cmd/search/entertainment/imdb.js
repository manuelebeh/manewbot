'use strict';

const { registerCommand } = require('../register');
const { axios, config, translate, Sticker, StickerTypes } = require('../deps');
const { validateRemoteMediaUrl } = require('../../../lib/url-safety');

registerCommand({
  nom_cmd: "imdb",
  classe: "Search",
  react: "🎬",
  desc: "Recherche des informations sur un film ou une série via IMDB"
}, async (jid, bot, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  const title = arg.join(" ");
  if (!title) {
    return bot.sendMessage(jid, {
      text: "❗ Veuillez fournir un nom de film ou de série à rechercher."
    }, {
      quoted: ms
    });
  }
  if (!config.OMDB_API_KEY) {
    return bot.sendMessage(jid, {
      text: "❗ Recherche IMDB non configurée (OMDB_API_KEY)."
    }, {
      quoted: ms
    });
  }
  try {
    const omdbBase = (config.OMDB_API_BASE || 'https://www.omdbapi.com/').replace(/\/?$/, '/');
    const response = await axios.get(omdbBase + "?apikey=" + config.OMDB_API_KEY + "&t=" + encodeURIComponent(title) + "&plot=full&lang=fr");
    const movie = response.data;
    if (movie.Response === "False") {
      return bot.sendMessage(jid, {
        text: "❗ Impossible de trouver ce film ou cette série."
      }, {
        quoted: ms
      });
    }
    const plotFr = await translate(movie.Plot, {
      to: "fr"
    }).then(res => res.text).catch(() => movie.Plot);
    const languageFr = await translate(movie.Language, {
      to: "fr"
    }).then(res => res.text).catch(() => movie.Language);
    const countryFr = await translate(movie.Country, {
      to: "fr"
    }).then(res => res.text).catch(() => movie.Country);
    const awardsFr = await translate(movie.Awards, {
      to: "fr"
    }).then(res => res.text).catch(() => movie.Awards);
    const message = "⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n🎬 *IMDB MOVIE SEARCH*\n⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n" + ("*🎞️ Titre :* " + movie.Title + "\n") + ("*📅 Année :* " + movie.Year + "\n") + ("*⭐ Classement :* " + movie.Rated + "\n") + ("*📆 Sortie :* " + movie.Released + "\n") + ("*⏳ Durée :* " + movie.Runtime + "\n") + ("*🌀 Genre :* " + movie.Genre + "\n") + ("*👨🏻‍💻 Réalisateur :* " + movie.Director + "\n") + ("*✍ Scénariste :* " + movie.Writer + "\n") + ("*👨 Acteurs :* " + movie.Actors + "\n") + ("*📃 Synopsis :* " + plotFr + "\n") + ("*🌐 Langue :* " + languageFr + "\n") + ("*🌍 Pays :* " + countryFr + "\n") + ("*🎖️ Récompenses :* " + (awardsFr || "Aucune") + "\n") + ("*📦 Box-office :* " + (movie.BoxOffice || "Non disponible") + "\n") + ("*🏙️ Production :* " + (movie.Production || "Non spécifiée") + "\n") + ("*🌟 Note IMDb :* " + movie.imdbRating + " ⭐\n") + ("*❎ Votes IMDb :* " + movie.imdbVotes);
    if (movie.Poster && movie.Poster !== "N/A") {
      const posterCheck = validateRemoteMediaUrl(movie.Poster);
      if (!posterCheck.ok) {
        return bot.sendMessage(jid, { text: message }, { quoted: ms });
      }
      await bot.sendMessage(jid, {
        image: {
          url: posterCheck.url
        },
        caption: message
      }, {
        quoted: ms
      });
    } else {
      await bot.sendMessage(jid, {
        text: message
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    console.error("Erreur lors de la récupération des données IMDB :", err.message);
    bot.sendMessage(jid, {
      text: "❗ Une erreur s'est produite lors de la recherche du film.\n" + err.message
    }, {
      quoted: ms
    });
  }
});
