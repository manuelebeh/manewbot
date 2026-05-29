'use strict';

const {
  registerCommand,
  config,
  fancy,
  axios,
} = require('./_shared');

registerCommand({
  nom_cmd: "fliptext",
  classe: "Fun",
  desc: "Inverse le texte fourni."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  const inputText = arg.join(" ");
  if (!inputText) {
    return await sock.sendMessage(chatJid, {
      text: "Veuillez fournir un texte à inverser !"
    }, {
      quoted: ms
    });
  }
  const flippedText = inputText.split("").reverse().join("");
  await sock.sendMessage(chatJid, {
    text: flippedText
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "readmore",
  classe: "Fun",
  desc: "Ajoute un effet 'voir plus' au texte."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  const inputText = arg.join(" ");
  if (!inputText) {
    return await sock.sendMessage(chatJid, {
      text: "Veuillez fournir un texte"
    }, {
      quoted: ms
    });
  }
  const readMoreText = "" + inputText.split(" ").join(" ") + String.fromCharCode(8206).repeat(4001);
  await sock.sendMessage(chatJid, {
    text: readMoreText
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "ship",
  classe: "Fun",
  desc: "Test de compatibilité entre deux personnes",
  alias: ["match"]
}, async (chatJid, sock, ctx) => {
  const {
    auteur_Msg_Repondu,
    auteur_Message,
    arg,
    ms,
    getJid
  } = ctx;
  let person1Jid;
  let person2Jid;
  if (arg.length >= 2 && arg[0].includes("@") && arg[1].includes("@")) {
    person1Jid = arg[0].replace("@", "") + "@lid";
    person2Jid = arg[1].replace("@", "") + "@lid";
  } else if (arg.length >= 1 && arg[0].includes("@") && auteur_Msg_Repondu) {
    person1Jid = arg[0].replace("@", "") + "@lid";
    person2Jid = auteur_Msg_Repondu;
  } else if (auteur_Msg_Repondu) {
    person1Jid = auteur_Message;
    person2Jid = auteur_Msg_Repondu;
  } else {
    return await sock.sendMessage(chatJid, {
      text: "Mentionne deux personnes"
    }, {
      quoted: ms
    });
  }
  const resolvedPerson1 = await getJid(person1Jid, chatJid, sock);
  const resolvedPerson2 = await getJid(person2Jid, chatJid, sock);
  const compatibility = Math.floor(Math.random() * 101);
  let message;
  if (compatibility <= 30) {
    message = "💔 Pas vraiment compatibles... 😢";
  } else if (compatibility <= 70) {
    message = "🤔 Il y a du potentiel, mais cela demande du travail !";
  } else {
    message = "💖 Vous êtes faits l'un pour l'autre ! 🌹";
  }
  await sock.sendMessage(chatJid, {
    text: "💘 *Ship*\n\n@" + resolvedPerson1.split("@")[0] + " & @" + resolvedPerson2.split("@")[0] + ", " + message + "\n💖 Compatibilité : *" + compatibility + "%*",
    mentions: [resolvedPerson1, resolvedPerson2]
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "couplepp",
  classe: "Fun",
  desc: "Envoie des photos de couple animées.",
  alias: ["cpp"]
}, async (chatJid, sock, ctx) => {
  try {
    const {
      data: couples
    } = await axios.get(config.GITHUB_KOPEL_JSON_URL);
    const couple = couples[Math.floor(Math.random() * couples.length)];
    const { validateRemoteMediaUrl } = require('../../lib/url-safety');
    const femaleCheck = validateRemoteMediaUrl(couple.female);
    const maleCheck = validateRemoteMediaUrl(couple.male);
    if (!femaleCheck.ok || !maleCheck.ok) {
      return sock.sendMessage(chatJid, { text: 'Image couple invalide.' }, { quoted: ctx.ms });
    }
    await sock.sendMessage(chatJid, {
      image: {
        url: femaleCheck.href
      },
      caption: "❤️ *Pour Madame 💁🏻‍♀️*"
    }, {
      quoted: ctx.ms
    });
    await sock.sendMessage(chatJid, {
      image: {
        url: maleCheck.href
      },
      caption: "❤️ *Pour Monsieur 💁🏻‍♂️*"
    }, {
      quoted: ctx.ms
    });
  } catch (err) {
    console.error("Erreur lors de la récupération des données :", err);
    await sock.sendMessage(chatJid, {
      text: "❗ Impossible de récupérer les images. Réessaie plus tard."
    }, {
      quoted: ctx.ms
    });
  }
});
registerCommand({
  nom_cmd: "fancy",
  classe: "Fun",
  react: "✍️",
  desc: "Applique un style fancy au texte"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre
  } = ctx;
  const prefix = config.PREFIXE;
  if (arg.length === 0) {
    return await repondre("Utilisation :\n" + (prefix + "fancy <ID> <texte> — Appliquer un style au texte\n") + (prefix + "fancy list [nom] — Lister les styles disponibles (optionnel : filtrer par nom)\n\n") + ("Exemple : " + prefix + "fancy 3 Hello World\n") + ("Exemple pour la liste : " + prefix + "fancy list manew\n\n"));
  }
  if (arg[0].toLowerCase() === "list") {
    const filterName = arg[1] || "Manewbot";
    return await repondre(fancy.list(filterName, fancy));
  }
  const styleId = parseInt(arg[0], 10);
  const styleText = arg.slice(1).join(" ");
  if (isNaN(styleId) || !styleText) {
    return await repondre("❌ Arguments invalides.\n" + ("Utilisation : " + prefix + "fancy <ID> <texte>\n") + ("Pour voir la liste des styles : " + prefix + "fancy list"));
  }
  try {
    const styleKeys = Object.keys(fancy).filter(key => key.length < 3);
    const styleKey = styleKeys[styleId - 1];
    if (!styleKey) {
      return await repondre("_Style introuvable pour l'ID : " + styleId + "_");
    }
    const styleFn = fancy[styleKey];
    return await repondre(fancy.apply(styleFn, styleText));
  } catch {
    return await repondre("_Une erreur s'est produite :(_");
  }
});
