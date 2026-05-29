'use strict';

const { registerCommand } = require('./register');
const { axios, config, wiki, translate } = require('./deps');

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
    const response = await axios.get(config.GOOGLE_CSE_BASE || 'https://www.googleapis.com/customsearch/v1', {
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
    const ghBase = (config.GITHUB_API_BASE || 'https://api.github.com').replace(/\/$/, '');
    const response = await axios.get(ghBase + "/users/" + encodeURIComponent(username));
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
