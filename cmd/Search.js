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
async function searchImages(_0x2f6ddf) {
  try {
    const _0x2ea540 = await axios.get("https://duckduckgo.com/", {
      params: {
        q: _0x2f6ddf
      },
      headers: {
        "user-agent": "Mozilla/5.0"
      }
    });
    const _0x2ea347 = _0x2ea540.data;
    let _0x59aba7;
    const _0xd071c9 = [/vqd="(.*?)"/, /vqd='(.*?)'/, /"vqd":"(.*?)"/, /vqd=([\d-]+)\&/];
    for (const _0x6894b4 of _0xd071c9) {
      const _0x4b6ed7 = _0x2ea347.match(_0x6894b4);
      if (_0x4b6ed7) {
        _0x59aba7 = _0x4b6ed7[1];
        break;
      }
    }
    if (!_0x59aba7) {
      throw new Error("Impossible de récupérer le token");
    }
    const _0x5bab0a = await axios.get("https://duckduckgo.com/i.js", {
      params: {
        q: _0x2f6ddf,
        vqd: _0x59aba7,
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
    return _0x5bab0a.data.results || [];
  } catch (_0x4f3232) {
    console.error(_0x4f3232);
    return [];
  }
}
registerCommand({
  nom_cmd: "img",
  classe: "Search",
  react: "🔍",
  desc: "Recherche d'images"
}, async (_0x590d9d, _0x10a251, _0x8f2a00) => {
  const {
    arg: _0x520fbf,
    ms: _0x23bf28
  } = _0x8f2a00;
  const _0x4b98b6 = _0x520fbf.join(" ");
  if (!_0x4b98b6) {
    return _0x10a251.sendMessage(_0x590d9d, {
      text: "Exemple : img luffy"
    }, {
      quoted: _0x23bf28
    });
  }
  try {
    const _0x53396e = await searchImages(_0x4b98b6);
    if (!_0x53396e || _0x53396e.length === 0) {
      return _0x10a251.sendMessage(_0x590d9d, {
        text: "Aucune image trouvée."
      }, {
        quoted: _0x23bf28
      });
    }
    let _0x4c85e2 = 0;
    let _0x314b9a = 0;
    while (_0x4c85e2 < 5 && _0x314b9a < _0x53396e.length) {
      const _0x269983 = _0x53396e[_0x314b9a].image;
      _0x314b9a++;
      if (!_0x269983) {
        continue;
      }
      try {
        await _0x10a251.sendMessage(_0x590d9d, {
          image: {
            url: _0x269983
          },
          caption: "```Powered by Manewbot```"
        }, {
          quoted: _0x23bf28
        });
        _0x4c85e2++;
      } catch (_0x5c8ef3) {
        continue;
      }
    }
    if (_0x4c85e2 === 0) {
      await _0x10a251.sendMessage(_0x590d9d, {
        text: "❌ Impossible d'envoyer les images."
      }, {
        quoted: _0x23bf28
      });
    }
  } catch (_0xe24071) {
    await _0x10a251.sendMessage(_0x590d9d, {
      text: "Erreur lors de la recherche."
    }, {
      quoted: _0x23bf28
    });
  }
});
registerCommand({
  nom_cmd: "google",
  classe: "Search",
  desc: "Recherche sur Google.",
  alias: ["search"]
}, async (_0x113670, _0x24e2ef, _0x1348b3) => {
  const {
    arg: _0x6fe831,
    ms: _0x29f14d
  } = _0x1348b3;
  if (!_0x6fe831[0]) {
    return await _0x24e2ef.sendMessage(_0x113670, {
      text: "❗ Entrez un terme à rechercher sur Google."
    }, {
      quoted: _0x29f14d
    });
  }
  const _0x4cdb82 = _0x6fe831.join(" ");
  try {
    const _0x46d092 = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        q: _0x4cdb82,
        key: "AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI",
        cx: "baf9bdb0c631236e5"
      }
    });
    if (!_0x46d092.data.items || _0x46d092.data.items.length === 0) {
      return await _0x24e2ef.sendMessage(_0x113670, {
        text: "❗ Aucun résultat trouvé pour cette recherche."
      }, {
        quoted: _0x29f14d
      });
    }
    const _0x1023d9 = _0x46d092.data.items.slice(0, 3);
    let _0x172a53 = "*🔍 Résultats de recherche pour : " + _0x4cdb82 + "*\n\n";
    _0x1023d9.forEach((_0x12494e, _0x7fbb76) => {
      _0x172a53 += _0x7fbb76 + 1 + ".\n *📌Titre:* " + _0x12494e.title + "\n*📃Description:* " + _0x12494e.snippet + "\n*🌐Lien:* " + _0x12494e.link + "\n\n";
    });
    await _0x24e2ef.sendMessage(_0x113670, {
      text: _0x172a53
    }, {
      quoted: _0x29f14d
    });
  } catch (_0x5532dd) {
    console.error("Erreur dans la recherche Google :", _0x5532dd);
    await _0x24e2ef.sendMessage(_0x113670, {
      text: "❗ Une erreur est survenue lors de la recherche sur Google. Veuillez réessayer."
    }, {
      quoted: _0x29f14d
    });
  }
});
registerCommand({
  nom_cmd: "wiki",
  classe: "Search",
  react: "📖",
  desc: "Recherche sur Wikipédia."
}, async (_0x2c46a9, _0x211a63, _0x4df351) => {
  const {
    arg: _0x5e8458,
    ms: _0x420497
  } = _0x4df351;
  if (!_0x5e8458[0]) {
    return await _0x211a63.sendMessage(_0x2c46a9, {
      text: "❗ Entrez un terme à rechercher sur Wikipédia."
    }, {
      quoted: _0x420497
    });
  }
  const _0xaeaa78 = _0x5e8458.join(" ");
  try {
    const _0x44075d = await wiki.summary(_0xaeaa78);
    const _0x479329 = "*📖Wikipédia :*\n\n*📌Titre:* " + _0x44075d.title + "\n\n*📃Description:* " + _0x44075d.description + "\n\n*📄Résumé:* " + _0x44075d.extract + "\n\n*🌐Lien:* " + _0x44075d.content_urls.mobile.page;
    await _0x211a63.sendMessage(_0x2c46a9, {
      text: _0x479329
    }, {
      quoted: _0x420497
    });
  } catch (_0x279156) {
    console.error("Erreur dans la recherche Wikipédia :", _0x279156);
    await _0x211a63.sendMessage(_0x2c46a9, {
      text: "❗ Une erreur est survenue lors de la recherche sur Wikipédia. Veuillez réessayer."
    }, {
      quoted: _0x420497
    });
  }
});
registerCommand({
  nom_cmd: "github",
  classe: "Search",
  react: "🔍",
  desc: "Récupère les informations d'un utilisateur GitHub"
}, async (_0x5bfac7, _0x3e7eaa, _0x4196ac) => {
  const {
    arg: _0x290cda,
    ms: _0x107c49
  } = _0x4196ac;
  const _0x1abd69 = _0x290cda.join(" ");
  if (!_0x1abd69) {
    return _0x3e7eaa.sendMessage(_0x5bfac7, {
      text: "❗ Veuillez fournir un nom d'utilisateur GitHub à rechercher."
    }, {
      quoted: _0x107c49
    });
  }
  try {
    const _0x3802f3 = await axios.get("https://api.github.com/users/" + encodeURIComponent(_0x1abd69));
    const _0xd29edb = _0x3802f3.data;
    const _0x31ff16 = "*👤 Nom d'utilisateur :* " + _0xd29edb.login + "\n" + ("*📛 Nom affiché :* " + (_0xd29edb.name || "Non spécifié") + "\n") + ("*📝 Bio :* " + (_0xd29edb.bio || "Aucune bio") + "\n") + ("*🏢 Entreprise :* " + (_0xd29edb.company || "Non spécifiée") + "\n") + ("*📍 Localisation :* " + (_0xd29edb.location || "Non spécifiée") + "\n") + ("*🔗 Lien :* " + _0xd29edb.html_url + "\n") + ("*👥 Followers :* " + _0xd29edb.followers + "\n") + ("*👤 Following :* " + _0xd29edb.following + "\n") + ("*📦 Repos publics :* " + _0xd29edb.public_repos + "\n") + ("*🕰️ Créé le :* " + _0xd29edb.created_at.split("T")[0]);
    if (_0xd29edb.avatar_url) {
      await _0x3e7eaa.sendMessage(_0x5bfac7, {
        image: {
          url: _0xd29edb.avatar_url
        },
        caption: _0x31ff16
      }, {
        quoted: _0x107c49
      });
    } else {
      await _0x3e7eaa.sendMessage(_0x5bfac7, {
        text: _0x31ff16
      }, {
        quoted: _0x107c49
      });
    }
  } catch (_0x5f0e85) {
    console.error("Erreur lors de la récupération des données GitHub :", _0x5f0e85.message);
    _0x3e7eaa.sendMessage(_0x5bfac7, {
      text: "❗ Impossible de récupérer les données GitHub.\n" + _0x5f0e85.message
    }, {
      quoted: _0x107c49
    });
  }
});
registerCommand({
  nom_cmd: "imdb",
  classe: "Search",
  react: "🎬",
  desc: "Recherche des informations sur un film ou une série via IMDB"
}, async (_0x222936, _0xdbcfde, _0x52da81) => {
  const {
    arg: _0x270cde,
    ms: _0x391c99
  } = _0x52da81;
  const _0x18f83c = _0x270cde.join(" ");
  if (!_0x18f83c) {
    return _0xdbcfde.sendMessage(_0x222936, {
      text: "❗ Veuillez fournir un nom de film ou de série à rechercher."
    }, {
      quoted: _0x391c99
    });
  }
  try {
    const _0xe2d23 = await axios.get("http://www.omdbapi.com/?apikey=742b2d09&t=" + encodeURIComponent(_0x18f83c) + "&plot=full&lang=fr");
    const _0x390157 = _0xe2d23.data;
    if (_0x390157.Response === "False") {
      return _0xdbcfde.sendMessage(_0x222936, {
        text: "❗ Impossible de trouver ce film ou cette série."
      }, {
        quoted: _0x391c99
      });
    }
    const _0xf072fe = await translate(_0x390157.Plot, {
      to: "fr"
    }).then(_0x149ce9 => _0x149ce9.text).catch(() => _0x390157.Plot);
    const _0x23f27b = await translate(_0x390157.Language, {
      to: "fr"
    }).then(_0x5b7546 => _0x5b7546.text).catch(() => _0x390157.Language);
    const _0x31a638 = await translate(_0x390157.Country, {
      to: "fr"
    }).then(_0x55588c => _0x55588c.text).catch(() => _0x390157.Country);
    const _0x58e6d0 = await translate(_0x390157.Awards, {
      to: "fr"
    }).then(_0x348c03 => _0x348c03.text).catch(() => _0x390157.Awards);
    const _0x5f5364 = "⚍⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚍\n🎬 *IMDB MOVIE SEARCH*\n⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎⚎\n" + ("*🎞️ Titre :* " + _0x390157.Title + "\n") + ("*📅 Année :* " + _0x390157.Year + "\n") + ("*⭐ Classement :* " + _0x390157.Rated + "\n") + ("*📆 Sortie :* " + _0x390157.Released + "\n") + ("*⏳ Durée :* " + _0x390157.Runtime + "\n") + ("*🌀 Genre :* " + _0x390157.Genre + "\n") + ("*👨🏻‍💻 Réalisateur :* " + _0x390157.Director + "\n") + ("*✍ Scénariste :* " + _0x390157.Writer + "\n") + ("*👨 Acteurs :* " + _0x390157.Actors + "\n") + ("*📃 Synopsis :* " + _0xf072fe + "\n") + ("*🌐 Langue :* " + _0x23f27b + "\n") + ("*🌍 Pays :* " + _0x31a638 + "\n") + ("*🎖️ Récompenses :* " + (_0x58e6d0 || "Aucune") + "\n") + ("*📦 Box-office :* " + (_0x390157.BoxOffice || "Non disponible") + "\n") + ("*🏙️ Production :* " + (_0x390157.Production || "Non spécifiée") + "\n") + ("*🌟 Note IMDb :* " + _0x390157.imdbRating + " ⭐\n") + ("*❎ Votes IMDb :* " + _0x390157.imdbVotes);
    if (_0x390157.Poster && _0x390157.Poster !== "N/A") {
      await _0xdbcfde.sendMessage(_0x222936, {
        image: {
          url: _0x390157.Poster
        },
        caption: _0x5f5364
      }, {
        quoted: _0x391c99
      });
    } else {
      await _0xdbcfde.sendMessage(_0x222936, {
        text: _0x5f5364
      }, {
        quoted: _0x391c99
      });
    }
  } catch (_0x493c18) {
    console.error("Erreur lors de la récupération des données IMDB :", _0x493c18.message);
    _0xdbcfde.sendMessage(_0x222936, {
      text: "❗ Une erreur s'est produite lors de la recherche du film.\n" + _0x493c18.message
    }, {
      quoted: _0x391c99
    });
  }
});
registerCommand({
  nom_cmd: "stickersearch",
  classe: "Search",
  react: "🖼️",
  desc: "Recherche et envoie des stickers animés basés sur un mot-clé.",
  alias: ["sstick"]
}, async (_0x4b0f11, _0x128fc7, _0x57ca45) => {
  const {
    arg: _0x4594e5,
    auteur_Message: _0x54c59e,
    ms: _0x529e0a
  } = _0x57ca45;
  if (!_0x4594e5.length) {
    return _0x128fc7.sendMessage(_0x4b0f11, {
      text: "Veuillez fournir un terme de recherche pour le sticker !"
    }, {
      quoted: _0x529e0a
    });
  }
  const _0x1f03ae = "AIzaSyCyouca1_KKy4W_MG1xsPzuku5oa8W358c";
  const _0x1fe3f6 = encodeURIComponent(_0x4594e5.join(" "));
  try {
    const _0x9e2416 = await axios.get("https://tenor.googleapis.com/v2/search?q=" + _0x1fe3f6 + "&key=" + _0x1f03ae + "&client_key=my_project&limit=8&media_filter=gif");
    const _0x40e519 = _0x9e2416.data.results;
    if (!_0x40e519.length) {
      return _0x128fc7.sendMessage(_0x4b0f11, {
        text: "Aucun sticker trouvé pour cette recherche."
      }, {
        quoted: _0x529e0a
      });
    }
    for (let _0x5ab591 = 0; _0x5ab591 < Math.min(8, _0x40e519.length); _0x5ab591++) {
      const _0x51e018 = _0x40e519[_0x5ab591].media_formats.gif.url;
      const _0xd238af = new Sticker(_0x51e018, {
        pack: config.STICKER_PACK_NAME,
        author: config.STICKER_AUTHOR_NAME,
        type: StickerTypes.FULL,
        categories: ["🤩", "🎉"],
        id: "12345",
        quality: 60,
        background: "transparent"
      });
      const _0x1cbb2d = await _0xd238af.toBuffer();
      await _0x128fc7.sendMessage(_0x4b0f11, {
        sticker: _0x1cbb2d
      }, {
        quoted: _0x529e0a
      });
    }
  } catch (_0xc8eabc) {
    console.error(_0xc8eabc);
    _0x128fc7.sendMessage(_0x4b0f11, {
      text: "Une erreur s'est produite lors de la récupération des stickers."
    }, {
      quoted: _0x529e0a
    });
  }
});
registerCommand({
  nom_cmd: "meteo",
  classe: "Search",
  react: "🌦️",
  desc: "Affiche la météo d'une ville."
}, async (_0x65d7f2, _0x5d296e, _0x22b3f1) => {
  const {
    arg: _0x4c6bf7,
    ms: _0x24d454
  } = _0x22b3f1;
  const _0x1563e1 = _0x4c6bf7.join(" ");
  if (!_0x1563e1) {
    return _0x5d296e.sendMessage(_0x65d7f2, {
      text: "❗ Veuillez fournir un nom de ville."
    }, {
      quoted: _0x24d454
    });
  }
  try {
    const _0x498aec = "1ad47ec6172f19dfaf89eb3307f74785";
    const _0x135470 = "https://api.openweathermap.org/data/2.5/weather?q=" + encodeURIComponent(_0x1563e1) + "&units=metric&appid=" + _0x498aec;
    const _0x289bd3 = await axios.get(_0x135470);
    const _0x214849 = _0x289bd3.data;
    const _0xb1bce8 = _0x214849.name;
    const _0x5dc9db = _0x214849.sys.country;
    const _0x4f8689 = _0x214849.main.temp;
    const _0x103588 = _0x214849.main.feels_like;
    const _0x2b769e = _0x214849.main.temp_min;
    const _0x50c99b = _0x214849.main.temp_max;
    const _0x3c34d4 = _0x214849.weather[0].description;
    const _0x5c0d5c = _0x214849.main.humidity;
    const _0x2fffd0 = _0x214849.wind.speed;
    const _0x471347 = _0x214849.rain ? _0x214849.rain["1h"] || 0 : 0;
    const _0x2044ce = _0x214849.clouds.all;
    const _0x238e27 = new Date(_0x214849.sys.sunrise * 1000);
    const _0x4f36f8 = new Date(_0x214849.sys.sunset * 1000);
    const _0x301a89 = _0x4830e7 => {
      const _0x5a3855 = _0x4830e7.getUTCHours().toString().padStart(2, "0");
      const _0x5edee0 = _0x4830e7.getUTCMinutes().toString().padStart(2, "0");
      const _0x517e96 = _0x4830e7.getUTCSeconds().toString().padStart(2, "0");
      return _0x5a3855 + ":" + _0x5edee0 + ":" + _0x517e96;
    };
    const _0x2156c6 = _0x301a89(_0x238e27);
    const _0x66864f = _0x301a89(_0x4f36f8);
    const _0x15f559 = "🌍 *Météo à " + _0xb1bce8 + ", " + _0x5dc9db + "*  \n\n🌡️ *Température :* " + _0x4f8689 + "°C  \n🌡️ *Ressenti :* " + _0x103588 + "°C  \n📉 *Température min :* " + _0x2b769e + "°C  \n📈 *Température max :* " + _0x50c99b + "°C  \n📝 *Description :* " + (_0x3c34d4.charAt(0).toUpperCase() + _0x3c34d4.slice(1)) + "  \n💧 *Humidité :* " + _0x5c0d5c + "%  \n💨 *Vent :* " + _0x2fffd0 + " m/s  \n🌧️ *Précipitations (1h) :* " + _0x471347 + " mm  \n☁️ *Nébulosité :* " + _0x2044ce + "%  \n🌄 *Lever du soleil (GMT) :* " + _0x2156c6 + "  \n🌅 *Coucher du soleil (GMT) :* " + _0x66864f;
    await _0x5d296e.sendMessage(_0x65d7f2, {
      text: _0x15f559
    }, {
      quoted: _0x24d454
    });
  } catch (_0x35e4fd) {
    console.error("Erreur lors de la récupération des données météo :", _0x35e4fd.message);
    await _0x5d296e.sendMessage(_0x65d7f2, {
      text: "❗ Impossible de trouver cette ville. Vérifiez l'orthographe et réessayez !"
    }, {
      quoted: _0x24d454
    });
  }
});
registerCommand({
  nom_cmd: "anime",
  classe: "Search",
  react: "📺",
  desc: "Recherche un anime aléatoire avec un résumé et un lien vers MyAnimeList."
}, async (_0x4634b1, _0x489f80, _0x37af82) => {
  const _0x384a35 = "https://api.jikan.moe/v4/random/anime";
  try {
    const _0x36b7e6 = await axios.get(_0x384a35);
    const _0x562d6d = _0x36b7e6.data.data;
    const _0x486c0c = _0x562d6d.title;
    let _0x2d9aa7 = _0x562d6d.synopsis;
    const _0x547c02 = _0x562d6d.images.jpg.image_url;
    const _0x2c2911 = _0x562d6d.episodes;
    const _0x590016 = _0x562d6d.status;
    const _0x311227 = await translate(_0x2d9aa7, {
      to: "fr"
    }).then(_0x3e410a => _0x3e410a.text).catch(() => _0x2d9aa7);
    const _0x360486 = await translate(_0x590016, {
      to: "fr"
    }).then(_0x224096 => _0x224096.text).catch(() => _0x590016);
    const _0x5cec14 = "✨ *ANIME ALÉATOIRE* ✨\n\n" + ("📺 *Titre* : " + _0x486c0c + "\n") + ("🎬 *Épisodes* : " + _0x2c2911 + "\n") + ("📡 *Statut* : " + _0x360486 + "\n") + ("🔗 *URL* : " + _0x562d6d.url + "\n") + ("📝 *Synopsis* : " + _0x311227 + "\n");
    await _0x489f80.sendMessage(_0x4634b1, {
      image: {
        url: _0x547c02
      },
      caption: _0x5cec14
    }, {
      quoted: _0x37af82.ms
    });
  } catch (_0x3fa59f) {
    console.error(_0x3fa59f);
    _0x489f80.sendMessage(_0x4634b1, {
      text: "Une erreur est survenue lors de la récupération des informations de l'anime."
    }, {
      quoted: _0x37af82.ms
    });
  }
});
registerCommand({
  nom_cmd: "lyrics",
  classe: "Search",
  react: "🎵",
  desc: "Cherche les paroles d'une chanson"
}, async (_0x5250a7, _0x427cf9, {
  arg: _0x2ccdf0,
  ms: _0x2de23a,
  repondre: _0x2a2fe1
}) => {
  const _0x37abfa = _0x2ccdf0.join(" ");
  if (!_0x37abfa) {
    return _0x2a2fe1("❌ Veuillez fournir un nom de chanson.");
  }
  try {
    const _0x56fa91 = "https://api.delirius.store/search/lyrics?query=" + encodeURIComponent(_0x37abfa);
    const {
      data: _0x1333db
    } = await axios.get(_0x56fa91);
    if (!_0x1333db.status || !_0x1333db.data?.lyrics) {
      return _0x2a2fe1("❌ Paroles introuvables pour cette chanson.");
    }
    const {
      title: _0x54fdc0,
      artists: _0x403563,
      album: _0x5f2bcb,
      duration: _0x4faa98,
      lyrics: _0x32fa1f
    } = _0x1333db.data;
    const _0x6649bf = "╭──〔 *🎵 Manewbot-LYRICS* 〕──⬣\n⬡ 🎧 *Titre* : " + _0x54fdc0 + "\n⬡ 👤 *Artiste* : " + _0x403563 + "\n⬡ 💿 *Album* : " + (_0x5f2bcb || "N/A") + "\n⬡ ⏱️ *Durée* : " + (_0x4faa98 || "N/A") + "\n╰───────────────────⬣\n\n🎼 *Paroles :*\n\n" + _0x32fa1f;
    await _0x427cf9.sendMessage(_0x5250a7, {
      text: _0x6649bf
    }, {
      quoted: _0x2de23a
    });
  } catch (_0x3e5048) {
    console.error("Erreur API Lyrics :", _0x3e5048.message);
    _0x2a2fe1("❌ Une erreur s'est produite lors de la récupération des paroles.");
  }
});
const acr = new acrcloud({
  host: "identify-eu-west-1.acrcloud.com",
  access_key: "12e1a7cd0396b0c7419792fe23161175",
  access_secret: "IFXo3K5j6dwpFXMRR7FFitF1LWqx9jqj8KE6Cztj"
});
registerCommand({
  nom_cmd: "shazam",
  classe: "Search",
  react: "🎵",
  desc: "Identifier une musique depuis un audio/vidéo",
  alias: []
}, async (_0x54cfab, _0x1c73db, {
  msg_Repondu: _0x3d9e00,
  ms: _0x3cbcd8,
  repondre: _0x44bb92
}) => {
  let _0x47ac85 = null;
  if (_0x3d9e00?.audioMessage) {
    _0x47ac85 = _0x3d9e00.audioMessage;
  } else if (_0x3d9e00?.videoMessage) {
    _0x47ac85 = _0x3d9e00.videoMessage;
  } else if (_0x3cbcd8.message?.videoMessage) {
    _0x47ac85 = _0x3cbcd8.message.videoMessage;
  }
  if (!_0x47ac85) {
    return _0x44bb92("Répondez à un audio ou une courte vidéo");
  }
  try {
    const _0x5d8337 = await _0x1c73db.dl_save_media_ms(_0x47ac85);
    let _0x6ef542 = fs.readFileSync(_0x5d8337);
    const _0x58aaef = 1048576;
    if (_0x6ef542.length > _0x58aaef) {
      _0x6ef542 = _0x6ef542.slice(0, _0x58aaef);
    }
    const _0x4a2e5e = await acr.identify(_0x6ef542);
    if (_0x4a2e5e.status.code !== 0 || !_0x4a2e5e.metadata?.music?.length) {
      return _0x44bb92("Impossible d’identifier la musique.");
    }
    const _0x348b55 = _0x4a2e5e.metadata.music[0];
    const _0x1ae471 = _0x348b55.title || "Inconnu";
    const _0x3020d6 = _0x348b55.artists?.map(_0x28f233 => _0x28f233.name).join(", ") || "Inconnu";
    const _0x2d419c = _0x348b55.album?.name || "Inconnu";
    const _0x4564de = _0x348b55.genres?.map(_0x521350 => _0x521350.name).join(", ") || "N/A";
    const _0x48620a = _0x348b55.release_date || "N/A";
    const _0x96fd4c = await ytdl(_0x1ae471 + " " + _0x3020d6, "audio");
    const _0x4afbfb = _0x96fd4c.yts[0].url || "Aucun lien trouvé";
    const _0x38d2eb = "╭━━〔 🎧 *Manewbot • SHAZAM* 〕━━╮\n\n🎵 *Titre* : " + _0x1ae471 + "\n👤 *Artiste* : " + _0x3020d6 + "\n💿 *Album* : " + _0x2d419c + "\n🎼 *Genre* : " + _0x4564de + "\n📅 *Sortie* : " + _0x48620a + "\n\n🌐 *YouTube* :\n" + _0x4afbfb + "\n\n╰━━━━━━━━━━━━━━━━━━╯";
    await _0x1c73db.sendMessage(_0x54cfab, {
      text: _0x38d2eb
    }, {
      quoted: _0x3cbcd8
    });
  } catch (_0x520cdc) {
    console.error("Erreur Shazam :", _0x520cdc);
    _0x44bb92("Échec de la reconnaissance.");
  }
});