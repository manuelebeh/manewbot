const {
  registerCommand
} = require("../lib/commands");
const fancy = require("../lib/style");
const config = require("../set");
const fs = require("fs");
const axios = require("axios");
const {
  levels
} = require("../database/levels");
const {
  Ranks
} = require("../database/rank");
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
    } = await axios.get("https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json");
    const couple = couples[Math.floor(Math.random() * couples.length)];
    await sock.sendMessage(chatJid, {
      image: {
        url: couple.female
      },
      caption: "❤️ *Pour Madame 💁🏻‍♀️*"
    }, {
      quoted: ctx.ms
    });
    await sock.sendMessage(chatJid, {
      image: {
        url: couple.male
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
registerCommand({
  nom_cmd: "rank",
  classe: "Fun",
  react: "🏆",
  desc: "Affiche le rang d'un utilisateur selon ses messages envoyés et gère l'activation/désactivation globale du level up."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    auteur_Message,
    getJid,
    auteur_Msg_Repondu,
    ms
  } = ctx;
  const targetJid = arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid" || auteur_Msg_Repondu || auteur_Message;
  const resolvedJid = await getJid(targetJid, chatJid, sock);
  let profilePic;
  try {
    profilePic = await sock.profilePictureUrl(resolvedJid, "image");
  } catch {
    profilePic = "https://files.catbox.moe/ulwqtr.jpg";
  }
  const allRanks = await Ranks.findAll({
    order: [["messages", "DESC"]]
  });
  const userRank = await Ranks.findOne({
    where: {
      id: resolvedJid
    }
  });
  if (!userRank) {
    return sock.sendMessage(chatJid, {
      text: "Vous n'avez pas encore de rang. Commencez à interagir pour en obtenir un !"
    }, {
      quoted: ms
    });
  }
  const {
    name,
    level,
    exp,
    messages
  } = userRank;
  const nextLevelExp = levels[level] ? levels[level + 1].expRequired : "Max";
  const rankPosition = allRanks.findIndex(entry => entry.id === resolvedJid) + 1;
  const totalUsers = allRanks.length;
  const rankCaption = "╭───🏆 *Classement* 🏆───╮\n┃ 🏷️ *Nom :* " + (name || "Inconnu") + "\n┃ 🥇 *Classement :* " + rankPosition + "/" + totalUsers + "\n┃ 🔰 *Niveau :* " + level + "\n┃ 🏅 *Titre :* " + (levels[level - 1]?.name || "Niveau Divin") + " \n┃ 📊 *EXP :* " + exp + "/" + (nextLevelExp || "Max") + "\n┃ ✉️ *Messages :* " + messages + "\n╰──────────────────╯";
  await sock.sendMessage(chatJid, {
    image: {
      url: profilePic
    },
    caption: rankCaption
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "toprank",
  classe: "Fun",
  react: "🥇",
  desc: "Voir les meilleurs utilisateurs"
}, async (chatJid, sock, ctx) => {
  const topUsers = await Ranks.findAll({
    order: [["messages", "DESC"]],
    limit: 10
  });
  if (topUsers.length === 0) {
    return sock.sendMessage(chatJid, {
      text: "Aucune donnée disponible pour le moment."
    }, {
      quoted: ctx.ms
    });
  }
  let leaderboard = "🏆 *TOP 10 UTILISATEURS* 🏆\n\n";
  topUsers.forEach((user, index) => {
    const medals = ["🥇", "🥈", "🥉"];
    const medal = medals[index] || "🔹";
    leaderboard += medal + " *#" + (index + 1) + "* — " + (user.name || "Inconnu") + "\n";
    leaderboard += "   💬 Messages : " + user.messages + "\n";
    leaderboard += "   🎯 Niveau : " + user.level + " (" + (levels[user.level - 1]?.name || "Niveau Divin") + ")\n\n";
  });
  leaderboard += "✨ _Continuez à discuter pour monter dans le classement !_";
  await sock.sendMessage(chatJid, {
    text: leaderboard
  }, {
    quoted: ctx.ms
  });
});
registerCommand({
  nom_cmd: "profile",
  classe: "Fun",
  react: "👤",
  desc: "Affiche le nom, le numéro et la bio d'un utilisateur"
}, async (chatJid, sock, {
  msg_Repondu,
  ms,
  auteur_Message,
  arg,
  getJid,
  auteur_Msg_Repondu
}) => {
  const targetJid = arg[0]?.includes("@") && arg[0].replace("@", "") + "@s.whatsapp.net" || auteur_Msg_Repondu || auteur_Message;
  const resolvedJid = await getJid(targetJid, chatJid, sock);
  let profilePic;
  try {
    profilePic = await sock.profilePictureUrl(resolvedJid, "image");
  } catch {
    profilePic = "https://files.catbox.moe/ulwqtr.jpg";
  }
  const rankRecord = await Ranks.findOne({
    where: {
      id: resolvedJid
    }
  });
  const displayName = rankRecord?.name || "Inconnu";
  const phoneNumber = resolvedJid.split("@")[0];
  let bio = "Pas de bio";
  try {
    const statusList = await sock.fetchStatus(resolvedJid);
    if (statusList.length > 0 && statusList[0].status) {
      bio = typeof statusList[0].status === "string" ? statusList[0].status : statusList[0].status.status || "Pas de bio";
    }
  } catch {}
  const profileCaption = "👤 Nom: " + displayName + "\n📱 Numéro: " + phoneNumber + "\n💬 Bio: " + bio;
  await sock.sendMessage(chatJid, {
    image: {
      url: profilePic
    },
    caption: profileCaption
  }, {
    quoted: ms
  });
});
registerCommand({
  nom_cmd: "fake",
  classe: "Fun",
  react: "📝",
  desc: "Envoie un message fake comme si un autre utilisateur l'avait envoyé"
}, async (chatJid, sock, {
  ms,
  arg,
  getJid
}) => {
  if (!arg[0] || !arg.join(" ").includes("/")) {
    return sock.sendMessage(chatJid, {
      text: "❌ Usage: fake @user fake_message / bot_message"
    }, {
      quoted: ms
    });
  }
  const fakeUserJid = arg[0].replace("@", "") + "@lid";
  const resolvedFakeUser = await getJid(fakeUserJid, chatJid, sock);
  const messageParts = arg.slice(1).join(" ");
  const [fakeMessage, botMessage] = messageParts.split("/").map(part => part.trim());
  const fakeQuotedMsg = {
    key: {
      fromMe: false,
      participant: resolvedFakeUser,
      remoteJid: resolvedFakeUser
    },
    message: {
      extendedTextMessage: {
        text: fakeMessage,
        contextInfo: {
          mentionedJid: []
        }
      }
    }
  };
  await sock.sendMessage(chatJid, {
    text: botMessage
  }, {
    quoted: fakeQuotedMsg
  });
});
