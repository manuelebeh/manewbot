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
}, async (_0x5eca97, _0xfcdad2, _0x2e134e) => {
  const {
    arg: _0xc90552,
    ms: _0x4acab7
  } = _0x2e134e;
  const _0x41ec48 = _0xc90552.join(" ");
  if (!_0x41ec48) {
    return await _0xfcdad2.sendMessage(_0x5eca97, {
      text: "Veuillez fournir un texte à inverser !"
    }, {
      quoted: _0x4acab7
    });
  }
  const _0x3c9d29 = _0x41ec48.split("").reverse().join("");
  await _0xfcdad2.sendMessage(_0x5eca97, {
    text: _0x3c9d29
  }, {
    quoted: _0x4acab7
  });
});
registerCommand({
  nom_cmd: "readmore",
  classe: "Fun",
  desc: "Ajoute un effet 'voir plus' au texte."
}, async (_0x2f3195, _0x24eac9, _0xbcff99) => {
  const {
    arg: _0x46f878,
    ms: _0x561103
  } = _0xbcff99;
  const _0x3b4a64 = _0x46f878.join(" ");
  if (!_0x3b4a64) {
    return await _0x24eac9.sendMessage(_0x2f3195, {
      text: "Veuillez fournir un texte"
    }, {
      quoted: _0x561103
    });
  }
  const _0x1447a1 = "" + _0x3b4a64.split(" ").join(" ") + String.fromCharCode(8206).repeat(4001);
  await _0x24eac9.sendMessage(_0x2f3195, {
    text: _0x1447a1
  }, {
    quoted: _0x561103
  });
});
registerCommand({
  nom_cmd: "ship",
  classe: "Fun",
  desc: "Test de compatibilité entre deux personnes",
  alias: ["match"]
}, async (_0x18161e, _0x457a95, _0x2d5d70) => {
  const {
    auteur_Msg_Repondu: _0x4b697b,
    auteur_Message: _0x3bfe94,
    arg: _0x231bdf,
    ms: _0x317918,
    getJid: _0x34dab8
  } = _0x2d5d70;
  let _0x23354d;
  let _0x5b6745;
  if (_0x231bdf.length >= 2 && _0x231bdf[0].includes("@") && _0x231bdf[1].includes("@")) {
    _0x23354d = _0x231bdf[0].replace("@", "") + "@lid";
    _0x5b6745 = _0x231bdf[1].replace("@", "") + "@lid";
  } else if (_0x231bdf.length >= 1 && _0x231bdf[0].includes("@") && _0x4b697b) {
    _0x23354d = _0x231bdf[0].replace("@", "") + "@lid";
    _0x5b6745 = _0x4b697b;
  } else if (_0x4b697b) {
    _0x23354d = _0x3bfe94;
    _0x5b6745 = _0x4b697b;
  } else {
    return await _0x457a95.sendMessage(_0x18161e, {
      text: "Mentionne deux personnes"
    }, {
      quoted: _0x317918
    });
  }
  const _0x49d641 = await _0x34dab8(_0x23354d, _0x18161e, _0x457a95);
  const _0x28c2d7 = await _0x34dab8(_0x5b6745, _0x18161e, _0x457a95);
  const _0x2a3a55 = Math.floor(Math.random() * 101);
  let _0x25e7ca;
  if (_0x2a3a55 <= 30) {
    _0x25e7ca = "💔 Pas vraiment compatibles... 😢";
  } else if (_0x2a3a55 <= 70) {
    _0x25e7ca = "🤔 Il y a du potentiel, mais cela demande du travail !";
  } else {
    _0x25e7ca = "💖 Vous êtes faits l'un pour l'autre ! 🌹";
  }
  await _0x457a95.sendMessage(_0x18161e, {
    text: "💘 *Ship*\n\n@" + _0x49d641.split("@")[0] + " & @" + _0x28c2d7.split("@")[0] + ", " + _0x25e7ca + "\n💖 Compatibilité : *" + _0x2a3a55 + "%*",
    mentions: [_0x49d641, _0x28c2d7]
  }, {
    quoted: _0x317918
  });
});
registerCommand({
  nom_cmd: "couplepp",
  classe: "Fun",
  desc: "Envoie des photos de couple animées.",
  alias: ["cpp"]
}, async (_0x296241, _0x53b637, _0x331eab) => {
  try {
    const {
      data: _0x53e7f0
    } = await axios.get("https://raw.githubusercontent.com/iamriz7/kopel_/main/kopel.json");
    const _0xb94e8d = _0x53e7f0[Math.floor(Math.random() * _0x53e7f0.length)];
    await _0x53b637.sendMessage(_0x296241, {
      image: {
        url: _0xb94e8d.female
      },
      caption: "❤️ *Pour Madame 💁🏻‍♀️*"
    }, {
      quoted: _0x331eab.ms
    });
    await _0x53b637.sendMessage(_0x296241, {
      image: {
        url: _0xb94e8d.male
      },
      caption: "❤️ *Pour Monsieur 💁🏻‍♂️*"
    }, {
      quoted: _0x331eab.ms
    });
  } catch (_0x5c9f07) {
    console.error("Erreur lors de la récupération des données :", _0x5c9f07);
    await _0x53b637.sendMessage(_0x296241, {
      text: "❗ Impossible de récupérer les images. Réessaie plus tard."
    }, {
      quoted: _0x331eab.ms
    });
  }
});
registerCommand({
  nom_cmd: "fancy",
  classe: "Fun",
  react: "✍️",
  desc: "Applique un style fancy au texte"
}, async (_0x218f5a, _0x32bed4, _0x59a093) => {
  const {
    arg: _0x2182e7,
    repondre: _0x5d050a
  } = _0x59a093;
  const _0x168b61 = config.PREFIXE;
  if (_0x2182e7.length === 0) {
    return await _0x5d050a("Utilisation :\n" + (_0x168b61 + "fancy <ID> <texte> — Appliquer un style au texte\n") + (_0x168b61 + "fancy list [nom] — Lister les styles disponibles (optionnel : filtrer par nom)\n\n") + ("Exemple : " + _0x168b61 + "fancy 3 Hello World\n") + ("Exemple pour la liste : " + _0x168b61 + "fancy list manew\n\n"));
  }
  if (_0x2182e7[0].toLowerCase() === "list") {
    const _0x5ed1ea = _0x2182e7[1] || "Manewbot";
    return await _0x5d050a(fancy.list(_0x5ed1ea, fancy));
  }
  const _0x4fcd48 = parseInt(_0x2182e7[0], 10);
  const _0x42a0a8 = _0x2182e7.slice(1).join(" ");
  if (isNaN(_0x4fcd48) || !_0x42a0a8) {
    return await _0x5d050a("❌ Arguments invalides.\n" + ("Utilisation : " + _0x168b61 + "fancy <ID> <texte>\n") + ("Pour voir la liste des styles : " + _0x168b61 + "fancy list"));
  }
  try {
    const _0x43a2de = Object.keys(fancy).filter(_0x2cc0ea => _0x2cc0ea.length < 3);
    const _0x5ead55 = _0x43a2de[_0x4fcd48 - 1];
    if (!_0x5ead55) {
      return await _0x5d050a("_Style introuvable pour l'ID : " + _0x4fcd48 + "_");
    }
    const _0x1ab831 = fancy[_0x5ead55];
    return await _0x5d050a(fancy.apply(_0x1ab831, _0x42a0a8));
  } catch {
    return await _0x5d050a("_Une erreur s'est produite :(_");
  }
});
registerCommand({
  nom_cmd: "blague",
  classe: "Fun",
  react: "😂",
  desc: "Renvoie une blague"
}, async (_0x25102c, _0x234efc, _0x140d74) => {
  try {
    let _0x384c23 = "https://v2.jokeapi.dev/joke/Any?lang=fr";
    let _0x540e53 = await axios.get(_0x384c23);
    let _0xa5667f = _0x540e53.data;
    if (_0xa5667f.type === "single") {
      _0x234efc.sendMessage(_0x25102c, {
        text: "*Blague du jour :* " + _0xa5667f.joke
      }, {
        quoted: _0x140d74.ms
      });
    } else if (_0xa5667f.type === "twopart") {
      _0x234efc.sendMessage(_0x25102c, {
        text: "*Blague du jour :* " + _0xa5667f.setup + "\n\n*Réponse :* " + _0xa5667f.delivery
      }, {
        quoted: _0x140d74.ms
      });
    } else {
      _0x234efc.sendMessage(_0x25102c, {
        text: "Désolé, je n'ai pas trouvé de blague à vous raconter."
      }, {
        quoted: _0x140d74.ms
      });
    }
  } catch (_0x2a9862) {
    _0x234efc.sendMessage(_0x25102c, {
      text: "Une erreur s'est produite lors de la récupération de la blague."
    }, {
      quoted: _0x140d74.ms
    });
  }
});
registerCommand({
  nom_cmd: "citation",
  classe: "Fun",
  react: "💬",
  desc: "Renvoie une citation"
}, async (_0x3db47e, _0x212d6f) => {
  try {
    const _0x2fa10f = "https://kaamelott.chaudie.re/api/random";
    const _0x49b172 = await axios.get(_0x2fa10f);
    const _0xc89508 = _0x49b172.data;
    if (_0xc89508.status === 1 && _0xc89508.citation) {
      const _0x2f995d = _0xc89508.citation.citation;
      const _0x2ac315 = _0xc89508.citation.infos.auteur || "Inconnu";
      const _0x1c0781 = _0xc89508.citation.infos.personnage || "Personnage inconnu";
      const _0xc6e5e5 = _0xc89508.citation.infos.saison || "Saison inconnue";
      const _0x79942b = _0xc89508.citation.infos.episode || "Épisode inconnu";
      const _0x3a9712 = "*Citation du jour :*\n\"" + _0x2f995d + "\"\n\n*Auteur :* " + _0x2ac315 + "\n*Personnage :* " + _0x1c0781 + "\n*Saison :* " + _0xc6e5e5 + "\n*Épisode :* " + _0x79942b;
      _0x212d6f.sendMessage(_0x3db47e, {
        text: _0x3a9712
      });
    } else {
      _0x212d6f.sendMessage(_0x3db47e, {
        text: "Désolé, je n'ai pas trouvé de citation à vous donner."
      });
    }
  } catch (_0x559987) {
    _0x212d6f.sendMessage(_0x3db47e, {
      text: "Une erreur s'est produite lors de la récupération de la citation."
    });
  }
});
registerCommand({
  nom_cmd: "rank",
  classe: "Fun",
  react: "🏆",
  desc: "Affiche le rang d'un utilisateur selon ses messages envoyés et gère l'activation/désactivation globale du level up."
}, async (_0x154bf4, _0x429066, _0x5183aa) => {
  const {
    arg: _0x199baa,
    auteur_Message: _0x3aa9ee,
    getJid: _0x3f053f,
    auteur_Msg_Repondu: _0x3a7ea8,
    ms: _0x52cc6f
  } = _0x5183aa;
  const _0x5f501e = _0x199baa[0]?.includes("@") && _0x199baa[0].replace("@", "") + "@lid" || _0x3a7ea8 || _0x3aa9ee;
  const _0x5d13c1 = await _0x3f053f(_0x5f501e, _0x154bf4, _0x429066);
  let _0x28e6c8;
  try {
    _0x28e6c8 = await _0x429066.profilePictureUrl(_0x5d13c1, "image");
  } catch {
    _0x28e6c8 = "https://files.catbox.moe/ulwqtr.jpg";
  }
  const _0x3465a7 = await Ranks.findAll({
    order: [["messages", "DESC"]]
  });
  const _0x659965 = await Ranks.findOne({
    where: {
      id: _0x5d13c1
    }
  });
  if (!_0x659965) {
    return _0x429066.sendMessage(_0x154bf4, {
      text: "Vous n'avez pas encore de rang. Commencez à interagir pour en obtenir un !"
    }, {
      quoted: _0x52cc6f
    });
  }
  const {
    name: _0x47c30c,
    level: _0x4b3989,
    exp: _0x2be37f,
    messages: _0x3e39d4
  } = _0x659965;
  const _0x55d134 = levels[_0x4b3989] ? levels[_0x4b3989 + 1].expRequired : "Max";
  const _0x15d42a = _0x3465a7.findIndex(_0x3bde12 => _0x3bde12.id === _0x5d13c1) + 1;
  const _0x4be5e3 = _0x3465a7.length;
  const _0x230456 = "╭───🏆 *Classement* 🏆───╮\n┃ 🏷️ *Nom :* " + (_0x47c30c || "Inconnu") + "\n┃ 🥇 *Classement :* " + _0x15d42a + "/" + _0x4be5e3 + "\n┃ 🔰 *Niveau :* " + _0x4b3989 + "\n┃ 🏅 *Titre :* " + (levels[_0x4b3989 - 1]?.name || "Niveau Divin") + " \n┃ 📊 *EXP :* " + _0x2be37f + "/" + (_0x55d134 || "Max") + "\n┃ ✉️ *Messages :* " + _0x3e39d4 + "\n╰──────────────────╯";
  await _0x429066.sendMessage(_0x154bf4, {
    image: {
      url: _0x28e6c8
    },
    caption: _0x230456
  }, {
    quoted: _0x52cc6f
  });
});
registerCommand({
  nom_cmd: "toprank",
  classe: "Fun",
  react: "🥇",
  desc: "Voir les meilleurs utilisateurs"
}, async (_0x3e85ea, _0x58b866, _0x256187) => {
  const _0x56599e = await Ranks.findAll({
    order: [["messages", "DESC"]],
    limit: 10
  });
  if (_0x56599e.length === 0) {
    return _0x58b866.sendMessage(_0x3e85ea, {
      text: "Aucune donnée disponible pour le moment."
    }, {
      quoted: _0x256187.ms
    });
  }
  let _0x3eb5d5 = "🏆 *TOP 10 UTILISATEURS* 🏆\n\n";
  _0x56599e.forEach((_0x1da40a, _0xf13330) => {
    const _0x5039f4 = ["🥇", "🥈", "🥉"];
    const _0x49bffd = _0x5039f4[_0xf13330] || "🔹";
    _0x3eb5d5 += _0x49bffd + " *#" + (_0xf13330 + 1) + "* — " + (_0x1da40a.name || "Inconnu") + "\n";
    _0x3eb5d5 += "   💬 Messages : " + _0x1da40a.messages + "\n";
    _0x3eb5d5 += "   🎯 Niveau : " + _0x1da40a.level + " (" + (levels[_0x1da40a.level - 1]?.name || "Niveau Divin") + ")\n\n";
  });
  _0x3eb5d5 += "✨ _Continuez à discuter pour monter dans le classement !_";
  await _0x58b866.sendMessage(_0x3e85ea, {
    text: _0x3eb5d5
  }, {
    quoted: _0x256187.ms
  });
});
registerCommand({
  nom_cmd: "profile",
  classe: "Fun",
  react: "👤",
  desc: "Affiche le nom, le numéro et la bio d'un utilisateur"
}, async (_0x2789ff, _0x1191f5, {
  msg_Repondu: _0x31e581,
  ms: _0x20ced3,
  auteur_Message: _0x16355f,
  arg: _0x5df4f3,
  getJid: _0x30bd41,
  auteur_Msg_Repondu: _0x4b9de3
}) => {
  const _0x5b55ef = _0x5df4f3[0]?.includes("@") && _0x5df4f3[0].replace("@", "") + "@s.whatsapp.net" || _0x4b9de3 || _0x16355f;
  const _0x33d1e2 = await _0x30bd41(_0x5b55ef, _0x2789ff, _0x1191f5);
  let _0x26436e;
  try {
    _0x26436e = await _0x1191f5.profilePictureUrl(_0x33d1e2, "image");
  } catch {
    _0x26436e = "https://files.catbox.moe/ulwqtr.jpg";
  }
  const _0x1061d1 = await Ranks.findOne({
    where: {
      id: _0x33d1e2
    }
  });
  const _0x53d6b2 = _0x1061d1?.name || "Inconnu";
  const _0x23a51a = _0x33d1e2.split("@")[0];
  let _0x338beb = "Pas de bio";
  try {
    const _0x1b9348 = await _0x1191f5.fetchStatus(_0x33d1e2);
    if (_0x1b9348.length > 0 && _0x1b9348[0].status) {
      _0x338beb = typeof _0x1b9348[0].status === "string" ? _0x1b9348[0].status : _0x1b9348[0].status.status || "Pas de bio";
    }
  } catch {}
  const _0x3f3dd1 = "👤 Nom: " + _0x53d6b2 + "\n📱 Numéro: " + _0x23a51a + "\n💬 Bio: " + _0x338beb;
  await _0x1191f5.sendMessage(_0x2789ff, {
    image: {
      url: _0x26436e
    },
    caption: _0x3f3dd1
  }, {
    quoted: _0x20ced3
  });
});
registerCommand({
  nom_cmd: "fake",
  classe: "Fun",
  react: "📝",
  desc: "Envoie un message fake comme si un autre utilisateur l'avait envoyé"
}, async (_0x56cfa6, _0x425204, {
  ms: _0x3ef165,
  arg: _0x20b9a5,
  getJid: _0x3273d0
}) => {
  if (!_0x20b9a5[0] || !_0x20b9a5.join(" ").includes("/")) {
    return _0x425204.sendMessage(_0x56cfa6, {
      text: "❌ Usage: fake @user fake_message / bot_message"
    }, {
      quoted: _0x3ef165
    });
  }
  const _0x1fe9be = _0x20b9a5[0].replace("@", "") + "@lid";
  const _0x1e9a8d = await _0x3273d0(_0x1fe9be, _0x56cfa6, _0x425204);
  const _0x38fe9d = _0x20b9a5.slice(1).join(" ");
  const [_0x1c60bd, _0x58c19e] = _0x38fe9d.split("/").map(_0xa8f99e => _0xa8f99e.trim());
  const _0x21a093 = {
    key: {
      fromMe: false,
      participant: _0x1e9a8d,
      remoteJid: _0x1e9a8d
    },
    message: {
      extendedTextMessage: {
        text: _0x1c60bd,
        contextInfo: {
          mentionedJid: []
        }
      }
    }
  };
  await _0x425204.sendMessage(_0x56cfa6, {
    text: _0x58c19e
  }, {
    quoted: _0x21a093
  });
});