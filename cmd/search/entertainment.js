'use strict';

const {
  registerCommand,
  axios,
  config,
  translate,
  Sticker,
  StickerTypes,
} = require('./_shared');

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
    const response = await axios.get("https://www.omdbapi.com/?apikey=" + config.OMDB_API_KEY + "&t=" + encodeURIComponent(title) + "&plot=full&lang=fr");
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
      await bot.sendMessage(jid, {
        image: {
          url: movie.Poster
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
    const response = await axios.get("https://tenor.googleapis.com/v2/search?q=" + searchQuery + "&key=" + config.TENOR_API_KEY + "&client_key=my_project&limit=8&media_filter=gif");
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
registerCommand({
  nom_cmd: "meteo",
  classe: "Search",
  react: "🌦️",
  desc: "Affiche la météo d'une ville."
}, async (jid, bot, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  const city = arg.join(" ");
  if (!city) {
    return bot.sendMessage(jid, {
      text: "❗ Veuillez fournir un nom de ville."
    }, {
      quoted: ms
    });
  }
  if (!config.OPENWEATHER_API_KEY) {
    return bot.sendMessage(jid, {
      text: "❗ Météo non configurée (OPENWEATHER_API_KEY)."
    }, {
      quoted: ms
    });
  }
  try {
    const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(city) + "&units=metric&appid=" + config.OPENWEATHER_API_KEY;
    const response = await axios.get(weatherUrl);
    const data = response.data;
    const cityName = data.name;
    const country = data.sys.country;
    const temp = data.main.temp;
    const feelsLike = data.main.feels_like;
    const tempMin = data.main.temp_min;
    const tempMax = data.main.temp_max;
    const description = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const rain1h = data.rain ? data.rain["1h"] || 0 : 0;
    const cloudiness = data.clouds.all;
    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    const formatTime = date => {
      const hours = date.getUTCHours().toString().padStart(2, "0");
      const minutes = date.getUTCMinutes().toString().padStart(2, "0");
      const seconds = date.getUTCSeconds().toString().padStart(2, "0");
      return hours + ":" + minutes + ":" + seconds;
    };
    const sunriseTime = formatTime(sunrise);
    const sunsetTime = formatTime(sunset);
    const message = "🌍 *Météo à " + cityName + ", " + country + "*  \n\n🌡️ *Température :* " + temp + "°C  \n🌡️ *Ressenti :* " + feelsLike + "°C  \n📉 *Température min :* " + tempMin + "°C  \n📈 *Température max :* " + tempMax + "°C  \n📝 *Description :* " + (description.charAt(0).toUpperCase() + description.slice(1)) + "  \n💧 *Humidité :* " + humidity + "%  \n💨 *Vent :* " + windSpeed + " m/s  \n🌧️ *Précipitations (1h) :* " + rain1h + " mm  \n☁️ *Nébulosité :* " + cloudiness + "%  \n🌄 *Lever du soleil (GMT) :* " + sunriseTime + "  \n🌅 *Coucher du soleil (GMT) :* " + sunsetTime;
    await bot.sendMessage(jid, {
      text: message
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des données météo :", err.message);
    await bot.sendMessage(jid, {
      text: "❗ Impossible de trouver cette ville. Vérifiez l'orthographe et réessayez !"
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "anime",
  classe: "Search",
  react: "📺",
  desc: "Recherche un anime aléatoire avec un résumé et un lien vers MyAnimeList."
}, async (jid, bot, ctx) => {
  const apiUrl = "https://api.jikan.moe/v4/random/anime";
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
    await bot.sendMessage(jid, {
      image: {
        url: imageUrl
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
registerCommand({
  nom_cmd: "lyrics",
  classe: "Search",
  react: "🎵",
  desc: "Cherche les paroles d'une chanson"
}, async (jid, bot, {
  arg,
  ms,
  repondre
}) => {
  const query = arg.join(" ");
  if (!query) {
    return repondre("❌ Veuillez fournir un nom de chanson.");
  }
  try {
    const lyricsBase = (config.LYRICS_API_BASE || '').replace(/\/+$/, '');
    if (!lyricsBase) {
      return repondre('❗ Paroles non configurées (LYRICS_API_BASE).');
    }
    const apiUrl = lyricsBase + "/search/lyrics?query=" + encodeURIComponent(query);
    const {
      data
    } = await axios.get(apiUrl);
    if (!data.status || !data.data?.lyrics) {
      return repondre("❌ Paroles introuvables pour cette chanson.");
    }
    const {
      title,
      artists,
      album,
      duration,
      lyrics
    } = data.data;
    const message = "╭──〔 *🎵 Manewbot-LYRICS* 〕──⬣\n⬡ 🎧 *Titre* : " + title + "\n⬡ 👤 *Artiste* : " + artists + "\n⬡ 💿 *Album* : " + (album || "N/A") + "\n⬡ ⏱️ *Durée* : " + (duration || "N/A") + "\n╰───────────────────⬣\n\n🎼 *Paroles :*\n\n" + lyrics;
    await bot.sendMessage(jid, {
      text: message
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur API Lyrics :", err.message);
    repondre("❌ Une erreur s'est produite lors de la récupération des paroles.");
  }
});
