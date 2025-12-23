const { ovlcmd, cmd } = require("../lib/ovlcmd");
const axios = require('axios');
const gis = require("g-i-s");
const wiki = require('wikipedia');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const config = require('../set');
const { translate } = require('@vitalets/google-translate-api');
const FormData = require('form-data');
const { ytdl } = require("../lib/dl");
const acrcloud = require("acrcloud");
const fs = require("fs");

ovlcmd(
    {
        nom_cmd: "img",
        classe: "Search",
        react: "🔍",
        desc: "Recherche d'images"
    },
    async (ms_org, ovl, cmd_options) => {
      const { arg, ms } = cmd_options;
        const searchTerm = arg.join(" ");
        if (!searchTerm) {
            return ovl.sendMessage(ms_org, { text: "Veuillez fournir un terme de recherche, par exemple : img ovl-Md" },  { quoted: ms });
        }

        gis(searchTerm, async (error, results) => {
            if (error) {
                console.error("Erreur lors de la recherche d'images:", error);
                return ovl.sendMessage(ms_org, { text: "Erreur lors de la recherche d'images." }, { quoted: ms });
            }

            const images = results.slice(0, 5);
            if (images.length === 0) {
                return ovl.sendMessage(ms_org, { text: "Aucune image trouvée pour ce terme de recherche." }, { quoted: ms });
            }

            for (const image of images) {
                try {
                    await ovl.sendMessage(ms_org, {
                        image: { url: image.url },
                        caption: `\`\`\`Powered By OVL-MD-v2\`\`\``
                    }, { quoted: ms });
                } catch (err) {
                    console.error("Erreur lors de l'envoi de l'image:", err);
                }
            }
        });
    }
);


ovlcmd(
    {
        nom_cmd: "google",
        classe: "Search",
        desc: "Recherche sur Google.",
        alias: ["search"],
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg[0]) {
            return await ovl.sendMessage(ms_org, { text: "❗ Entrez un terme à rechercher sur Google." }, { quoted: ms });
        }

        const searchTerm = arg.join(" ");
        try {
            const response = await axios.get(
                `https://www.googleapis.com/customsearch/v1`,
                {
                    params: {
                        q: searchTerm,
                        key: "REDACTED",
                        cx: "baf9bdb0c631236e5",
                    },
                }
            );

            if (!response.data.items || response.data.items.length === 0) {
                return await ovl.sendMessage(ms_org, {
                    text: "❗ Aucun résultat trouvé pour cette recherche.",
                }, { quoted: ms });
            }

            const results = response.data.items.slice(0, 3); // Limiter à 3 résultats

            let searchResultsMsg = `*🔍 Résultats de recherche pour : ${searchTerm}*\n\n`;
            results.forEach((result, index) => {
                searchResultsMsg += `${index + 1}.\n *📌Titre:* ${result.title}\n*📃Description:* ${result.snippet}\n*🌐Lien:* ${result.link}\n\n`;
            });

            await ovl.sendMessage(ms_org, { text: searchResultsMsg }, { quoted: ms });
        } catch (error) {
            console.error("Erreur dans la recherche Google :", error);
            await ovl.sendMessage(ms_org, {
                text: "❗ Une erreur est survenue lors de la recherche sur Google. Veuillez réessayer.",
            }, { quoted: ms });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "wiki",
        classe: "Search",
        react: "📖",
        desc: "Recherche sur Wikipédia.",
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        if (!arg[0]) {
            return await ovl.sendMessage(ms_org, { text: "❗ Entrez un terme à rechercher sur Wikipédia." }, { quoted: ms });
        }

        const searchTerm = arg.join(" ");
        try {
            const con = await wiki.summary(searchTerm);

            const mess = `*📖Wikipédia :*\n\n*📌Titre:* ${con.title}\n\n*📃Description:* ${con.description}\n\n*📄Résumé:* ${con.extract}\n\n*🌐Lien:* ${con.content_urls.mobile.page}`;

            await ovl.sendMessage(ms_org, { text: mess }, { quoted: ms });
        } catch (error) {
            console.error("Erreur dans la recherche Wikipédia :", error);
            await ovl.sendMessage(ms_org, {
                text: "❗ Une erreur est survenue lors de la recherche sur Wikipédia. Veuillez réessayer.",
            }, { quoted: ms });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "github",
        classe: "Search",
        react: "🔍",
        desc: "Récupère les informations d'un utilisateur GitHub"
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        const username = arg.join(" ");

        if (!username) {
            return ovl.sendMessage(ms_org, { text: "❗ Veuillez fournir un nom d'utilisateur GitHub à rechercher." }, { quoted: ms });
        }

        try {
            const response = await axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`);
            const data = response.data;

            const message = `*👤 Nom d'utilisateur :* ${data.login}\n`
                + `*📛 Nom affiché :* ${data.name || "Non spécifié"}\n`
                + `*📝 Bio :* ${data.bio || "Aucune bio"}\n`
                + `*🏢 Entreprise :* ${data.company || "Non spécifiée"}\n`
                + `*📍 Localisation :* ${data.location || "Non spécifiée"}\n`
                + `*🔗 Lien :* ${data.html_url}\n`
                + `*👥 Followers :* ${data.followers}\n`
                + `*👤 Following :* ${data.following}\n`
                + `*📦 Repos publics :* ${data.public_repos}\n`
                + `*🕰️ Créé le :* ${data.created_at.split("T")[0]}`;

            if (data.avatar_url) {
                await ovl.sendMessage(ms_org, { image: { url: data.avatar_url }, caption: message }, { quoted: ms });
            } else {
                await ovl.sendMessage(ms_org, { text: message }, { quoted: ms });
            }

        } catch (error) {
            console.error("Erreur lors de la récupération des données GitHub :", error.message);
            ovl.sendMessage(ms_org, { text: "❗ Impossible de récupérer les données GitHub.\n" + error.message }, { quoted: ms });
        }
    }
);

ovlcmd(
    {
        nom_cmd: "imdb",
        classe: "Search",
        react: "🎬",
        desc: "Recherche des informations sur un film ou une série via IMDB"
    },
    async (ms_org, ovl, cmd_options) => {
        const { arg, ms } = cmd_options;
        const movieName = arg.join(" ");

        if (!movieName) {
            return ovl.sendMessage(ms_org, { text: "❗ Veuillez fournir un nom de film ou de série à rechercher." },  { quoted: ms });
        }

        try {
            const response = await axios.get(`http://www.omdbapi.com/?apikey=742b2d09&t=${encodeURIComponent(movieName)}&plot=full&lang=fr`);
            const data = response.data;

            if (data.Response === "False") {
                return ovl.sendMessage(ms_org, { text: "❗ Impossible de trouver ce film ou cette série." },  { quoted: ms });
            }

            const trt_synopsis = await translate(data.Plot, { to: 'fr' }).then(res => res.text).catch(() => data.Plot);
            const trt_langue = await translate(data.Language, { to: 'fr' }).then(res => res.text).catch(() => data.Language);
            const trt_pays = await translate(data.Country, { to: 'fr' }).then(res => res.text).catch(() => data.Country);
            const trt_rec = await translate(data.Awards, { to: 'fr' }).then(res => res.text).catch(() => data.Awards);
            
            const imdbInfo = `⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n`
                + `🎬 *IMDB MOVIE SEARCH*\n`
                + `⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n`
                + `*🎞️ Titre :* ${data.Title}\n`
                + `*📅 Année :* ${data.Year}\n`
                + `*⭐ Classement :* ${data.Rated}\n`
                + `*📆 Sortie :* ${data.Released}\n`
                + `*⏳ Durée :* ${data.Runtime}\n`
                + `*🌀 Genre :* ${data.Genre}\n`
                + `*👨🏻‍💻 Réalisateur :* ${data.Director}\n`
                + `*✍ Scénariste :* ${data.Writer}\n`
                + `*👨 Acteurs :* ${data.Actors}\n`
                + `*📃 Synopsis :* ${trt_synopsis}\n`
                + `*🌐 Langue :* ${trt_langue}\n`
                + `*🌍 Pays :* ${trt_pays}\n`
                + `*🎖️ Récompenses :* ${trt_rec || "Aucune"}\n`
                + `*📦 Box-office :* ${data.BoxOffice || "Non disponible"}\n`
                + `*🏙️ Production :* ${data.Production || "Non spécifiée"}\n`
                + `*🌟 Note IMDb :* ${data.imdbRating} ⭐\n`
                + `*❎ Votes IMDb :* ${data.imdbVotes}`;

            if (data.Poster && data.Poster !== "N/A") {
                await ovl.sendMessage(ms_org, { image: { url: data.Poster }, caption: imdbInfo }, { quoted: ms });
            } else {
                await ovl.sendMessage(ms_org, { text: imdbInfo }, { quoted: ms });
            }

        } catch (error) {
            console.error("Erreur lors de la récupération des données IMDB :", error.message);
            ovl.sendMessage(ms_org, { text: "❗ Une erreur s'est produite lors de la recherche du film.\n" + error.message }, { quoted: ms });
        }
    }
);

ovlcmd(
  {
    nom_cmd: "stickersearch",
    classe: "Search",
    react: "🖼️",
    desc: "Recherche et envoie des stickers animés basés sur un mot-clé.",
    alias: ["sstick"]
  },
  async (ms_org, ovl, cmd_options) => {
    const { arg, auteur_Message, ms} = cmd_options;
    
    if (!arg.length) {
      return ovl.sendMessage(ms_org, { text: "Veuillez fournir un terme de recherche pour le sticker !" }, { quoted: ms });
    }
      
    const tenorApiKey = "REDACTED";
    const searchTerm = encodeURIComponent(arg.join(" "));

    try {
      const response = await axios.get(
        `https://tenor.googleapis.com/v2/search?q=${searchTerm}&key=${tenorApiKey}&client_key=my_project&limit=8&media_filter=gif`
      );
      
      const stickers = response.data.results;
      if (!stickers.length) {
        return ovl.sendMessage(ms_org, { text: "Aucun sticker trouvé pour cette recherche." }, { quoted: ms });
      }

      for (let i = 0; i < Math.min(8, stickers.length); i++) {
        const gifUrl = stickers[i].media_formats.gif.url;
        const sticker = new Sticker(gifUrl, {
          pack: config.STICKER_PACK_NAME,
          author: config.STICKER_AUTHOR_NAME,
          type: StickerTypes.FULL,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 60,
          background: "transparent",
        });

        const stickerBuffer = await sticker.toBuffer();
        await ovl.sendMessage(ms_org, { sticker: stickerBuffer },  { quoted: ms });
      }
    } catch (error) {
      console.error(error);
      ovl.sendMessage(ms_org, { text: "Une erreur s'est produite lors de la récupération des stickers." },  { quoted: ms });
    }
  }
);

ovlcmd(
  {
    nom_cmd: "meteo",
    classe: "Search",
    react: "🌦️",
    desc: "Affiche la météo d'une ville.",
  },
  async (ms_org, ovl, cmd_options) => {
    const { arg, ms } = cmd_options;
    const cityName = arg.join(" ");

    if (!cityName) {
      return ovl.sendMessage(ms_org, { text: "❗ Veuillez fournir un nom de ville." }, { quoted: ms });
    }

    try {
      const apiKey = "1ad47ec6172f19dfaf89eb3307f74785";
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${apiKey}`;

      const response = await axios.get(url);
      const data = response.data;

      const city = data.name;
      const country = data.sys.country;
      const temperature = data.main.temp;
      const feelsLike = data.main.feels_like;
      const minTemperature = data.main.temp_min;
      const maxTemperature = data.main.temp_max;
      const description = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = data.wind.speed;
      const rainVolume = data.rain ? data.rain["1h"] || 0 : 0;
      const cloudiness = data.clouds.all;
      const sunrise = new Date(data.sys.sunrise * 1000);
      const sunset = new Date(data.sys.sunset * 1000);

      // Formatage des heures de lever et coucher du soleil (juste h:min:s)
      const formatTime = (date) => {
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
      };

      const formattedSunrise = formatTime(sunrise);
      const formattedSunset = formatTime(sunset);

      const weatherMessage = `🌍 *Météo à ${city}, ${country}*  

🌡️ *Température :* ${temperature}°C  
🌡️ *Ressenti :* ${feelsLike}°C  
📉 *Température min :* ${minTemperature}°C  
📈 *Température max :* ${maxTemperature}°C  
📝 *Description :* ${description.charAt(0).toUpperCase() + description.slice(1)}  
💧 *Humidité :* ${humidity}%  
💨 *Vent :* ${windSpeed} m/s  
🌧️ *Précipitations (1h) :* ${rainVolume} mm  
☁️ *Nébulosité :* ${cloudiness}%  
🌄 *Lever du soleil (GMT) :* ${formattedSunrise}  
🌅 *Coucher du soleil (GMT) :* ${formattedSunset}`;

      await ovl.sendMessage(ms_org, { text: weatherMessage },  { quoted: ms });
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo :", error.message);
      await ovl.sendMessage(ms_org, { text: "❗ Impossible de trouver cette ville. Vérifiez l'orthographe et réessayez !" }, { quoted: ms });
    }
  }
);

ovlcmd(
  {
    nom_cmd: "anime",
    classe: "Search",
    react: "📺",
    desc: "Recherche un anime aléatoire avec un résumé et un lien vers MyAnimeList."
  },
  async (ms_org, ovl, cmd_options) => {
   
    const link = "https://api.jikan.moe/v4/random/anime";

    try {
      const response = await axios.get(link);
      const data = response.data.data;

      const title = data.title;
      let synopsis = data.synopsis;
      const imageUrl = data.images.jpg.image_url;
      const episodes = data.episodes;
      const status = data.status;

      const trts = await translate(synopsis, { to: 'fr' }).then(res => res.text).catch(() => synopsis);
      const trt_status = await translate(status, { to: 'fr' }).then(res => res.text).catch(() => status);
    
        const message = `✨ *ANIME ALÉATOIRE* ✨\n\n` +
          `📺 *Titre* : ${title}\n` +
          `🎬 *Épisodes* : ${episodes}\n` +
          `📡 *Statut* : ${trt_status}\n` +
          `🔗 *URL* : ${data.url}\n` +
          `📝 *Synopsis* : ${trts}\n`

      await ovl.sendMessage(ms_org, {
        image: { url: imageUrl },
        caption: message
      }, { quoted: cmd_options.ms });

    } catch (error) {
        console.error(error);
      ovl.sendMessage(ms_org, { text: 'Une erreur est survenue lors de la récupération des informations de l\'anime.' }, { quoted: cmd_options.ms });
    }
  }
);

ovlcmd(
  {
    nom_cmd: "lyrics",
    classe: "Search",
    react: "🎵",
    desc: "Cherche les paroles d'une chanson"
  },
  async (ms_org, ovl, { arg, ms, repondre }) => {
    const songName = arg.join(" ");
    if (!songName) return repondre("❌ Veuillez fournir un nom de chanson.");

    try {
      const apiUrl = `https://api.delirius.store/search/lyrics?query=${encodeURIComponent(songName)}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data?.lyrics) {
        return repondre("❌ Paroles introuvables pour cette chanson.");
      }

      const { title, artists, album, duration, lyrics } = data.data;

      const caption = `╭──〔 *🎵 OVL-MD-LYRICS* 〕──⬣
⬡ 🎧 *Titre* : ${title}
⬡ 👤 *Artiste* : ${artists}
⬡ 💿 *Album* : ${album || "N/A"}
⬡ ⏱️ *Durée* : ${duration || "N/A"}
╰───────────────────⬣

🎼 *Paroles :*

${lyrics}`;

      await ovl.sendMessage(ms_org, { text: caption }, { quoted: ms });

    } catch (e) {
      console.error("Erreur API Lyrics :", e.message);
      repondre("❌ Une erreur s'est produite lors de la récupération des paroles.");
    }
  }
);
 
const acr = new acrcloud({
  host: "identify-eu-west-1.acrcloud.com",
  access_key: "12e1a7cd0396b0c7419792fe23161175",
  access_secret: "IFXo3K5j6dwpFXMRR7FFitF1LWqx9jqj8KE6Cztj"
});

ovlcmd(
{
  nom_cmd: "shazam",
  classe: "Search",
  react: "🎵",
  desc: "Identifier une musique depuis un audio/vidéo",
  alias: []
},
async (ms_org, ovl, { msg_Repondu, ms, repondre }) => {

  let mediaMessage = null;

  if (msg_Repondu?.audioMessage) mediaMessage = msg_Repondu.audioMessage;
  else if (msg_Repondu?.videoMessage) mediaMessage = msg_Repondu.videoMessage;
  else if (ms.message?.videoMessage) mediaMessage = ms.message.videoMessage;

  if (!mediaMessage) {
    return repondre("Répondez à un audio ou une courte vidéo");
  }

  try {
    const media = await ovl.dl_save_media_ms(mediaMessage);
    let buffer = fs.readFileSync(media);
    const maxi = 1 * 1024 * 1024;
    if (buffer.length > maxi) buffer = buffer.slice(0, maxi);

    const result = await acr.identify(buffer);

    if (result.status.code !== 0 || !result.metadata?.music?.length) {
      return repondre("Impossible d’identifier la musique.");
    }
      
    const song = result.metadata.music[0];

    const title = song.title || "Inconnu";
    const artist = song.artists?.map(a => a.name).join(", ") || "Inconnu";
    const album = song.album?.name || "Inconnu";
    const genre = song.genres?.map(g => g.name).join(", ") || "N/A";
    const release = song.release_date || "N/A";

    const info = await ytdl(`${title} ${artist}`, "audio");
    const ytUrl = info.yts[0].url || "Aucun lien trouvé";
      
    const caption =
`╭━━〔 🎧 *OVL • SHAZAM* 〕━━╮

🎵 *Titre* : ${title}
👤 *Artiste* : ${artist}
💿 *Album* : ${album}
🎼 *Genre* : ${genre}
📅 *Sortie* : ${release}

🌐 *YouTube* :
${ytUrl}

╰━━━━━━━━━━━━━━━━━━╯`;

    await ovl.sendMessage(ms_org, { text: caption }, { quoted: ms });

  } catch (err) {
    console.error("Erreur Shazam :", err);
    repondre("Échec de la reconnaissance.");
  }
});
