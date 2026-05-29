'use strict';

const {
  registerCommand,
  axios,
} = require('./_shared');

registerCommand({
  nom_cmd: "blague",
  classe: "Fun",
  react: "😂",
  desc: "Renvoie une blague"
}, async (chatJid, sock, ctx) => {
  try {
    let jokeUrl = "https://v2.jokeapi.dev/joke/Any?lang=fr";
    let response = await axios.get(jokeUrl);
    let jokeData = response.data;
    if (jokeData.type === "single") {
      sock.sendMessage(chatJid, {
        text: "*Blague du jour :* " + jokeData.joke
      }, {
        quoted: ctx.ms
      });
    } else if (jokeData.type === "twopart") {
      sock.sendMessage(chatJid, {
        text: "*Blague du jour :* " + jokeData.setup + "\n\n*Réponse :* " + jokeData.delivery
      }, {
        quoted: ctx.ms
      });
    } else {
      sock.sendMessage(chatJid, {
        text: "Désolé, je n'ai pas trouvé de blague à vous raconter."
      }, {
        quoted: ctx.ms
      });
    }
  } catch (err) {
    sock.sendMessage(chatJid, {
      text: "Une erreur s'est produite lors de la récupération de la blague."
    }, {
      quoted: ctx.ms
    });
  }
});
registerCommand({
  nom_cmd: "citation",
  classe: "Fun",
  react: "💬",
  desc: "Renvoie une citation"
}, async (chatJid, sock) => {
  try {
    const apiUrl = "https://kaamelott.chaudie.re/api/random";
    const response = await axios.get(apiUrl);
    const quoteData = response.data;
    if (quoteData.status === 1 && quoteData.citation) {
      const quoteText = quoteData.citation.citation;
      const author = quoteData.citation.infos.auteur || "Inconnu";
      const character = quoteData.citation.infos.personnage || "Personnage inconnu";
      const season = quoteData.citation.infos.saison || "Saison inconnue";
      const episode = quoteData.citation.infos.episode || "Épisode inconnu";
      const caption = "*Citation du jour :*\n\"" + quoteText + "\"\n\n*Auteur :* " + author + "\n*Personnage :* " + character + "\n*Saison :* " + season + "\n*Épisode :* " + episode;
      sock.sendMessage(chatJid, {
        text: caption
      });
    } else {
      sock.sendMessage(chatJid, {
        text: "Désolé, je n'ai pas trouvé de citation à vous donner."
      });
    }
  } catch (err) {
    sock.sendMessage(chatJid, {
      text: "Une erreur s'est produite lors de la récupération de la citation."
    });
  }
});
