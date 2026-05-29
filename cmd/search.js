const {
  registerCommand,
  cmd
} = require("../lib/commands");
const axios = require("axios");
const wiki = require("wikipedia");
const {
  Sticker,
  StickerTypes
} = require("wa-sticker-formatter");
const config = require("../set");
const {
  translate
} = require("@vitalets/google-translate-api");
const FormData = require("form-data");
const {
  ytdl
} = require("../lib/dl");
const acrcloud = require("acrcloud");
const fs = require("fs");
async function searchImages(query) {
  try {
    const homePage = await axios.get("https://duckduckgo.com/", {
      params: {
        q: query
      },
      headers: {
        "user-agent": "Mozilla/5.0"
      }
    });
    const html = homePage.data;
    let vqdToken;
    const vqdPatterns = [/vqd="(.*?)"/, /vqd='(.*?)'/, /"vqd":"(.*?)"/, /vqd=([\d-]+)\&/];
    for (const pattern of vqdPatterns) {
      const match = html.match(pattern);
      if (match) {
        vqdToken = match[1];
        break;
      }
    }
    if (!vqdToken) {
      throw new Error("Impossible de récupérer le token");
    }
    const imageResponse = await axios.get("https://duckduckgo.com/i.js", {
      params: {
        q: query,
        vqd: vqdToken,
        o: "json",
        l: "fr-fr",
        p: "1"
      },
      headers: {
        referer: "https://duckduckgo.com/",
        "user-agent": "Mozilla/5.0",
        "x-requested-with": "XMLHttpRequest"
      }
    });
    return imageResponse.data.results || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}
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
registerCommand({
  nom_cmd: "google",
  classe: "Search",
  desc: "Recherche sur Google.",
  alias: ["search"]
}, async (jid, bot, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  if (!arg[0]) {
    return await bot.sendMessage(jid, {
      text: "❗ Entrez un terme à rechercher sur Google."
    }, {
      quoted: ms
    });
  }
  const query = arg.join(" ");
  if (!config.GOOGLE_SEARCH_API_KEY || !config.GOOGLE_SEARCH_CX) {
    return await bot.sendMessage(jid, {
      text: "❗ Recherche Google non configurée (GOOGLE_SEARCH_API_KEY / GOOGLE_SEARCH_CX)."
    }, {
      quoted: ms
    });
  }
  try {
    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        q: query,
        key: config.GOOGLE_SEARCH_API_KEY,
        cx: config.GOOGLE_SEARCH_CX
      }
    });
    if (!response.data.items || response.data.items.length === 0) {
      return await bot.sendMessage(jid, {
        text: "❗ Aucun résultat trouvé pour cette recherche."
      }, {
        quoted: ms
      });
    }
    const topItems = response.data.items.slice(0, 3);
    let message = "*🔍 Résultats de recherche pour : " + query + "*\n\n";
    topItems.forEach((item, i) => {
      message += i + 1 + ".\n *📌Titre:* " + item.title + "\n*📃Description:* " + item.snippet + "\n*🌐Lien:* " + item.link + "\n\n";
    });
    await bot.sendMessage(jid, {
      text: message
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur dans la recherche Google :", err);
    await bot.sendMessage(jid, {
      text: "❗ Une erreur est survenue lors de la recherche sur Google. Veuillez réessayer."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "wiki",
  classe: "Search",
  react: "📖",
  desc: "Recherche sur Wikipédia."
}, async (jid, bot, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  if (!arg[0]) {
    return await bot.sendMessage(jid, {
      text: "❗ Entrez un terme à rechercher sur Wikipédia."
    }, {
      quoted: ms
    });
  }
  const query = arg.join(" ");
  try {
    const summary = await wiki.summary(query);
    const message = "*📖Wikipédia :*\n\n*📌Titre:* " + summary.title + "\n\n*📃Description:* " + summary.description + "\n\n*📄Résumé:* " + summary.extract + "\n\n*🌐Lien:* " + summary.content_urls.mobile.page;
    await bot.sendMessage(jid, {
      text: message
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur dans la recherche Wikipédia :", err);
    await bot.sendMessage(jid, {
      text: "❗ Une erreur est survenue lors de la recherche sur Wikipédia. Veuillez réessayer."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "github",
  classe: "Search",
  react: "🔍",
  desc: "Récupère les informations d'un utilisateur GitHub"
}, async (jid, bot, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  const username = arg.join(" ");
  if (!username) {
    return bot.sendMessage(jid, {
      text: "❗ Veuillez fournir un nom d'utilisateur GitHub à rechercher."
    }, {
      quoted: ms
    });
  }
  try {
    const response = await axios.get("https://api.github.com/users/" + encodeURIComponent(username));
    const user = response.data;
    const message = "*👤 Nom d'utilisateur :* " + user.login + "\n" + ("*📛 Nom affiché :* " + (user.name || "Non spécifié") + "\n") + ("*📝 Bio :* " + (user.bio || "Aucune bio") + "\n") + ("*🏢 Entreprise :* " + (user.company || "Non spécifiée") + "\n") + ("*📍 Localisation :* " + (user.location || "Non spécifiée") + "\n") + ("*🔗 Lien :* " + user.html_url + "\n") + ("*👥 Followers :* " + user.followers + "\n") + ("*👤 Following :* " + user.following + "\n") + ("*📦 Repos publics :* " + user.public_repos + "\n") + ("*🕰️ Créé le :* " + user.created_at.split("T")[0]);
    if (user.avatar_url) {
      await bot.sendMessage(jid, {
        image: {
          url: user.avatar_url
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
    console.error("Erreur lors de la récupération des données GitHub :", err.message);
    bot.sendMessage(jid, {
      text: "❗ Impossible de récupérer les données GitHub.\n" + err.message
    }, {
      quoted: ms
    });
  }
});
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
    const response = await axios.get("http://www.omdbapi.com/?apikey=" + config.OMDB_API_KEY + "&t=" + encodeURIComponent(title) + "&plot=full&lang=fr");
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
    const apiUrl = "https://api.delirius.store/search/lyrics?query=" + encodeURIComponent(query);
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
const acr = config.ACRCLOUD_ACCESS_KEY && config.ACRCLOUD_ACCESS_SECRET
  ? new acrcloud({
    host: config.ACRCLOUD_HOST,
    access_key: config.ACRCLOUD_ACCESS_KEY,
    access_secret: config.ACRCLOUD_ACCESS_SECRET
  })
  : null;
registerCommand({
  nom_cmd: "shazam",
  classe: "Search",
  react: "🎵",
  desc: "Identifier une musique depuis un audio/vidéo",
  alias: []
}, async (jid, bot, {
  msg_Repondu,
  ms,
  repondre
}) => {
  let mediaMessage = null;
  if (msg_Repondu?.audioMessage) {
    mediaMessage = msg_Repondu.audioMessage;
  } else if (msg_Repondu?.videoMessage) {
    mediaMessage = msg_Repondu.videoMessage;
  } else if (ms.message?.videoMessage) {
    mediaMessage = ms.message.videoMessage;
  }
  if (!mediaMessage) {
    return repondre("Répondez à un audio ou une courte vidéo");
  }
  if (!acr) {
    return repondre("Shazam non configuré (ACRCLOUD_ACCESS_KEY / ACRCLOUD_ACCESS_SECRET).");
  }
  try {
    const filePath = await bot.dl_save_media_ms(mediaMessage);
    let audioBuffer = fs.readFileSync(filePath);
    const maxSize = 1048576;
    if (audioBuffer.length > maxSize) {
      audioBuffer = audioBuffer.slice(0, maxSize);
    }
    const identifyResult = await acr.identify(audioBuffer);
    if (identifyResult.status.code !== 0 || !identifyResult.metadata?.music?.length) {
      return repondre("Impossible d’identifier la musique.");
    }
    const track = identifyResult.metadata.music[0];
    const title = track.title || "Inconnu";
    const artists = track.artists?.map(artist => artist.name).join(", ") || "Inconnu";
    const album = track.album?.name || "Inconnu";
    const genres = track.genres?.map(genre => genre.name).join(", ") || "N/A";
    const releaseDate = track.release_date || "N/A";
    const ytResult = await ytdl(title + " " + artists, "audio");
    const youtubeUrl = ytResult.yts[0].url || "Aucun lien trouvé";
    const message = "╭━━〔 🎧 *Manewbot • SHAZAM* 〕━━╮\n\n🎵 *Titre* : " + title + "\n👤 *Artiste* : " + artists + "\n💿 *Album* : " + album + "\n🎼 *Genre* : " + genres + "\n📅 *Sortie* : " + releaseDate + "\n\n🌐 *YouTube* :\n" + youtubeUrl + "\n\n╰━━━━━━━━━━━━━━━━━━╯";
    await bot.sendMessage(jid, {
      text: message
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur Shazam :", err);
    repondre("Échec de la reconnaissance.");
  }
});
