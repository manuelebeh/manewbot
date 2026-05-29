const {
  registerCommand
} = require("../lib/commands");
const axios = require("axios");
const {
  delay
} = require("@whiskeysockets/baileys");
const config = require("../set");
const fs = require("fs");
let activeGames = {};
registerCommand({
  nom_cmd: "tictactoe",
  classe: "Jeux",
  react: "🎮",
  desc: "Jeu du Tic-Tac-Toe",
  alias: ["ttt"]
}, async (_0x53a25c, _0x5e3db1, _0x1c2c2f) => {
  const {
    arg: _0x1e4776,
    ms: _0x180084,
    msg_Repondu: _0x56646a,
    auteur_Msg_Repondu: _0x29ad03,
    auteur_Message: _0x11b4c0,
    getJid: _0x26cf88
  } = _0x1c2c2f;
  let _0x2fc365 = _0x11b4c0.split("@")[0];
  let _0x5d3619;
  let _0x38c220;
  if (_0x56646a) {
    _0x5d3619 = _0x29ad03.split("@")[0];
    _0x38c220 = _0x29ad03;
  } else if (_0x1e4776.length > 0 && _0x1e4776[0].includes("@")) {
    _0x38c220 = await _0x26cf88(_0x1e4776[0].replace("@", "") + "@lid", _0x53a25c, _0x5e3db1);
    _0x5d3619 = _0x38c220.split("@")[0];
  } else {
    return _0x5e3db1.sendMessage(_0x53a25c, {
      text: "🙋‍♂️ Veuillez *mentionner* ou *répondre* au message du joueur pour lancer une partie."
    }, {
      quoted: _0x180084
    });
  }
  if (_0x11b4c0 === _0x38c220) {
    return _0x5e3db1.sendMessage(_0x53a25c, {
      text: "🚫 Vous ne pouvez pas jouer contre vous-même !"
    }, {
      quoted: _0x180084
    });
  }
  if (activeGames[_0x11b4c0] || activeGames[_0x38c220]) {
    delete activeGames[_0x11b4c0];
    delete activeGames[_0x38c220];
  }
  const _0x13a1f7 = Date.now() + "-" + _0x11b4c0 + "-" + _0x38c220;
  activeGames[_0x11b4c0] = {
    opponent: _0x38c220,
    gameID: _0x13a1f7
  };
  activeGames[_0x38c220] = {
    opponent: _0x11b4c0,
    gameID: _0x13a1f7
  };
  await _0x5e3db1.sendMessage(_0x53a25c, {
    text: "🎮 *Tic-Tac-Toe Défi !*\n\n🔸 @" + _0x2fc365 + " défie @" + _0x5d3619 + " !\n\n✍️ Pour accepter, réponds *oui* dans les 60 secondes.",
    mentions: [_0x11b4c0, _0x38c220]
  }, {
    quoted: _0x180084
  });
  try {
    const _0x3a8604 = await _0x5e3db1.recup_msg({
      auteur: _0x38c220,
      ms_org: _0x53a25c,
      temps: 60000
    });
    const _0x2ec154 = _0x3a8604?.message?.conversation || _0x3a8604?.message?.extendedTextMessage?.text || "";
    if (_0x2ec154.toLowerCase() === "oui") {
      let _0x4b2c68 = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
      let _0xdcef73 = 0;
      let _0x50d71d = ["❌", "⭕"];
      let _0x48a754 = [_0x11b4c0, _0x38c220];
      activeGames[_0x11b4c0] = {
        opponent: _0x38c220,
        grid: _0x4b2c68,
        currentPlayer: _0xdcef73,
        gameID: _0x13a1f7
      };
      activeGames[_0x38c220] = {
        opponent: _0x11b4c0,
        grid: _0x4b2c68,
        currentPlayer: _0xdcef73,
        gameID: _0x13a1f7
      };
      const _0x5f51ba = (_0x1c2be8 = false) => {
        let _0x9eceec = "\n╔═══╦═══╦═══╗\n║ " + _0x4b2c68[0] + "    " + _0x4b2c68[1] + "    " + _0x4b2c68[2] + "\n╠═══╬═══╬═══╣\n║ " + _0x4b2c68[3] + "    " + _0x4b2c68[4] + "    " + _0x4b2c68[5] + "\n╠═══╬═══╬═══╣\n║ " + _0x4b2c68[6] + "    " + _0x4b2c68[7] + "    " + _0x4b2c68[8] + "\n╚═══╩═══╩═══╝\n\n❌ : @" + _0x2fc365 + "\n⭕ : @" + _0x5d3619;
        if (!_0x1c2be8) {
          _0x9eceec += "\n\n🎯 C'est au tour de @" + _0x48a754[_0xdcef73].split("@")[0] + " de jouer !";
        }
        return _0x9eceec;
      };
      const _0x5905e8 = _0x15a25f => {
        const _0x174c8d = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        return _0x174c8d.some(_0x5939f5 => _0x5939f5.every(_0x338292 => _0x4b2c68[_0x338292] === _0x15a25f));
      };
      for (let _0x54b176 = 0; _0x54b176 < 9; _0x54b176++) {
        let _0x53a762 = _0x50d71d[_0xdcef73];
        await _0x5e3db1.sendMessage(_0x53a25c, {
          text: _0x5f51ba(),
          mentions: [_0x11b4c0, _0x38c220]
        }, {
          quoted: _0x180084
        });
        let _0x5289b2;
        let _0x50ad24 = false;
        while (!_0x50ad24) {
          const _0x5b101f = await _0x5e3db1.recup_msg({
            auteur: _0x48a754[_0xdcef73],
            ms_org: _0x53a25c,
            temps: 60000
          });
          let _0x1a985b = _0x5b101f?.message?.conversation || _0x5b101f?.message?.extendedTextMessage?.text || "";
          if (!isNaN(_0x1a985b)) {
            _0x5289b2 = parseInt(_0x1a985b);
            if (_0x4b2c68[_0x5289b2 - 1] !== "❌" && _0x4b2c68[_0x5289b2 - 1] !== "⭕" && _0x5289b2 >= 1 && _0x5289b2 <= 9) {
              _0x4b2c68[_0x5289b2 - 1] = _0x53a762;
              _0x50ad24 = true;
            } else {
              await _0x5e3db1.sendMessage(_0x53a25c, {
                text: "❗ *Position invalide !* Choisis une case encore libre (1 à 9).",
                mentions: _0x48a754
              }, {
                quoted: _0x180084
              });
            }
          } else if (_0x1a985b.toLowerCase().startsWith(config.PREFIXE + "ttt")) {} else {
            await _0x5e3db1.sendMessage(_0x53a25c, {
              text: "❌ *Entrée invalide !* Réponds avec un chiffre entre 1 et 9.",
              mentions: _0x48a754
            }, {
              quoted: _0x180084
            });
          }
        }
        if (_0x5905e8(_0x53a762)) {
          await _0x5e3db1.sendMessage(_0x53a25c, {
            text: "🏆 *Victoire !*\n\n🎉 @" + _0x48a754[_0xdcef73].split("@")[0] + " a gagné la partie !\n" + _0x5f51ba(true),
            mentions: _0x48a754
          }, {
            quoted: _0x180084
          });
          delete activeGames[_0x11b4c0];
          delete activeGames[_0x38c220];
          return;
        }
        _0xdcef73 = 1 - _0xdcef73;
        activeGames[_0x11b4c0].currentPlayer = _0xdcef73;
        activeGames[_0x38c220].currentPlayer = _0xdcef73;
      }
      await _0x5e3db1.sendMessage(_0x53a25c, {
        text: "🤝 *Match Nul !*\n\nAucun gagnant cette fois-ci !\n" + _0x5f51ba(true),
        mentions: _0x48a754
      }, {
        quoted: _0x180084
      });
      delete activeGames[_0x11b4c0];
      delete activeGames[_0x38c220];
    } else {
      return _0x5e3db1.sendMessage(_0x53a25c, {
        text: "❌ Invitation refusée par le joueur."
      }, {
        quoted: _0x180084
      });
    }
  } catch (_0x16a976) {
    if (_0x16a976.message === "Timeout") {
      await _0x5e3db1.sendMessage(_0x53a25c, {
        text: "⏱️ @" + _0x5d3619 + " a mis trop de temps. Partie annulée.",
        mentions: [_0x11b4c0, _0x38c220]
      }, {
        quoted: _0x180084
      });
    } else {
      console.error(_0x16a976);
    }
    delete activeGames[_0x11b4c0];
    delete activeGames[_0x38c220];
  }
});
registerCommand({
  nom_cmd: "anime-quizz",
  classe: "Jeux",
  react: "📺",
  desc: "Lance un quiz anime.",
  alias: ["a-quizz"]
}, async (_0x592fc9, _0x5812a6, {
  repondre: _0x575a94,
  auteur_Message: _0x559579,
  verif_Groupe: _0x5a3d0e,
  isSudo: _0x37fdc4,
  getJid: _0x55a58b
}) => {
  if (!_0x5a3d0e) {
    return _0x575a94("❌ Cette commande fonctionne uniquement dans les groupes.");
  }
  const _0x322507 = _0x559579 || _0x37fdc4;
  const _0xccc26f = "🎯 *Anime Quiz*\n\nChoisis le nombre de questions :\n1️⃣ 10 questions\n2️⃣ 20 questions\n3️⃣ 30 questions\n\n✋ Envoie *stop* à tout moment pour annuler (créateur uniquement).";
  await _0x5812a6.sendMessage(_0x592fc9, {
    text: _0xccc26f
  });
  let _0x353dc0 = 10;
  try {
    const _0x500ed4 = await _0x5812a6.recup_msg({
      ms_org: _0x592fc9,
      auteur: _0x322507,
      temps: 30000
    });
    const _0x4cee2f = (_0x500ed4?.message?.conversation || _0x500ed4?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
    if (_0x4cee2f === "stop") {
      return _0x575a94("🛑 Quiz annulé.");
    }
    if (_0x4cee2f === "1") {
      _0x353dc0 = 10;
    } else if (_0x4cee2f === "2") {
      _0x353dc0 = 20;
    } else if (_0x4cee2f === "3") {
      _0x353dc0 = 30;
    } else {
      return _0x575a94("❗ Choix invalide. Réponds par 1, 2 ou 3.");
    }
  } catch {
    return _0x575a94("⏱️ Temps écoulé. Relance la commande pour recommencer.");
  }
  let _0x3ff363;
  try {
    const _0x424279 = fs.readFileSync("./lib/aquizz.json", "utf8");
    _0x3ff363 = JSON.parse(_0x424279).sort(() => 0.5 - Math.random()).slice(0, _0x353dc0);
  } catch {
    return _0x575a94("❌ Impossible de récupérer les questions.");
  }
  const _0x58305b = {
    "1": "a",
    "2": "b",
    "3": "c",
    "4": "d"
  };
  const _0x5ba8de = {};
  for (let _0x502fad = 0; _0x502fad < _0x353dc0; _0x502fad++) {
    const {
      question: _0x4fce8b,
      options: _0x2c5276,
      answer: _0x4b19c2
    } = _0x3ff363[_0x502fad];
    const _0x1190ea = _0x4b19c2.toLowerCase();
    const _0x47f60a = _0x2c5276[_0x1190ea];
    const _0x5f3609 = Object.values(_0x2c5276).map((_0x51cc30, _0x5a4ee4) => _0x5a4ee4 + 1 + ". " + _0x51cc30).join("\n");
    const _0x52d207 = "📺 *Question " + (_0x502fad + 1) + "/" + _0x353dc0 + "*\n\n" + (_0x4fce8b + "\n\n") + (_0x5f3609 + "\n\n") + "⏳ *15 secondes* — Réponds avec 1, 2, 3 ou 4\n🛑 Le créateur peut envoyer *stop* pour annuler.";
    await _0x5812a6.sendMessage(_0x592fc9, {
      text: _0x52d207
    });
    const _0x39740a = Date.now();
    let _0x3f482e = false;
    while (Date.now() - _0x39740a < 15000 && !_0x3f482e) {
      try {
        const _0x246107 = await _0x5812a6.recup_msg({
          ms_org: _0x592fc9,
          temps: 15000 - (Date.now() - _0x39740a)
        });
        const _0x500d20 = (_0x246107?.message?.conversation || _0x246107?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
        const _0xb70a70 = _0x246107.key.participant || _0x246107.key.remoteJid;
        const _0x481dc6 = await _0x55a58b(_0xb70a70, _0x592fc9, _0x5812a6);
        if (_0x500d20 === "stop" && _0x481dc6 === _0x322507) {
          return _0x5812a6.sendMessage(_0x592fc9, {
            text: "🛑 Quiz annulé par le créateur @" + _0x481dc6.split("@")[0],
            mentions: [_0x481dc6]
          });
        }
        if (!["1", "2", "3", "4"].includes(_0x500d20)) {
          continue;
        }
        const _0x5226d6 = _0x58305b[_0x500d20];
        if (_0x5226d6 === _0x1190ea) {
          _0x5ba8de[_0x481dc6] = (_0x5ba8de[_0x481dc6] || 0) + 1;
          await _0x5812a6.sendMessage(_0x592fc9, {
            text: "✅ Bonne réponse @" + _0x481dc6.split("@")[0] + " ! C'était *" + _0x47f60a + "*",
            quoted: _0x246107,
            mentions: [_0x481dc6]
          });
          _0x3f482e = true;
        }
      } catch {
        break;
      }
    }
    if (!_0x3f482e) {
      await _0x5812a6.sendMessage(_0x592fc9, {
        text: "⌛ Temps écoulé ! La bonne réponse était *" + _0x47f60a + "*"
      });
    }
    await delay(1000);
  }
  if (!Object.keys(_0x5ba8de).length) {
    return _0x5812a6.sendMessage(_0x592fc9, {
      text: "😢 Personne n'a marqué de point. Fin du quiz."
    });
  }
  const _0x419f35 = Object.entries(_0x5ba8de).sort(([, _0x212fad], [, _0x4dc764]) => _0x4dc764 - _0x212fad).map(([_0x35c2ff, _0xcb4fc8], _0x26dd15) => _0x26dd15 + 1 + ". @" + _0x35c2ff.split("@")[0] + " — *" + _0xcb4fc8 + "* point" + (_0xcb4fc8 > 1 ? "s" : "")).join("\n");
  const _0x2b8269 = "🏁 *Fin du Quiz Anime !*\n\n📊 *Classement final :*\n\n" + _0x419f35;
  await _0x5812a6.sendMessage(_0x592fc9, {
    text: _0x2b8269,
    mentions: Object.keys(_0x5ba8de)
  });
});
registerCommand({
  nom_cmd: "dmots",
  classe: "Jeux",
  react: "🪹",
  desc: "Jouez à plusieurs au jeu du Mot Mélangé"
}, async (_0x3a939f, _0x42f13f, {
  repondre: _0x56ef2a,
  auteur_Message: _0x9a4334,
  isSudo: _0x20727d,
  getJid: _0x14ea36
}) => {
  const _0x487722 = new Map();
  const _0x3472ad = Date.now();
  let _0x5c0b39 = [];
  const _0x5b2c2b = new Set();
  try {
    const _0x591154 = fs.readFileSync("./lib/mots.json", "utf8");
    _0x5c0b39 = JSON.parse(_0x591154);
    _0x5c0b39 = _0x5c0b39.sort(() => Math.random() - 0.5);
  } catch (_0x265bdc) {
    return _0x56ef2a("❌ Impossible de récupérer les mots.");
  }
  function _0x3cf51e(_0x142c48) {
    return _0x142c48.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
  }
  const _0x441107 = _0x2b8891 => {
    let _0x233683;
    let _0x3f2fbf = 0;
    const _0x504d3e = _0x2b8891.toLowerCase();
    do {
      const _0x2ba2d6 = _0x2b8891.split("");
      for (let _0x56629b = _0x2ba2d6.length - 1; _0x56629b > 0; _0x56629b--) {
        const _0x495381 = Math.floor(Math.random() * (_0x56629b + 1));
        [_0x2ba2d6[_0x56629b], _0x2ba2d6[_0x495381]] = [_0x2ba2d6[_0x495381], _0x2ba2d6[_0x56629b]];
      }
      _0x233683 = _0x2ba2d6.join("");
      _0x3f2fbf++;
    } while (_0x3f2fbf < 20 && (_0x233683.toLowerCase() === _0x504d3e || _0x233683 === _0x2b8891.split("").reverse().join("") || _0x233683.toLowerCase() === _0x2b8891.split("").reverse().join("").toLowerCase()));
    return _0x233683;
  };
  const _0x776ad1 = _0x2364b4 => {
    const _0x4b7e1d = _0x2364b4.filter(_0x5c655d => !_0x5b2c2b.has(_0x3cf51e(_0x5c655d)));
    if (_0x4b7e1d.length === 0) {
      _0x5b2c2b.clear();
      return _0x2364b4[Math.floor(Math.random() * _0x2364b4.length)];
    }
    const _0x5a68e1 = _0x4b7e1d[Math.floor(Math.random() * _0x4b7e1d.length)];
    _0x5b2c2b.add(_0x3cf51e(_0x5a68e1));
    return _0x5a68e1;
  };
  _0x487722.set(_0x9a4334, {
    id: _0x9a4334,
    score: 0
  });
  const _0x28cb82 = _0x9a4334 || _0x20727d;
  await _0x42f13f.sendMessage(_0x3a939f, {
    text: "🎮 *Jeu du Mot Mélangé - MULTIJOUEURS* 🎮\n\nTapez 'join' pour participer !\n🆕 Tapez 'start' pour commencer immédiatement (créateur)\n❌ Tapez 'stop' pour annuler (créateur)\n⏳ Temps max d'inscription : 60s\n🎯 Dernier survivant gagne !"
  });
  const _0x536ecd = [45000, 30000, 15000];
  const _0x5bb79b = new Set();
  let _0x3564cc = false;
  let _0x25a184 = false;
  const _0x54d407 = setInterval(async () => {
    const _0x56fb54 = 60000 - (Date.now() - _0x3472ad);
    if (_0x56fb54 <= 0 || _0x3564cc || _0x25a184) {
      return clearInterval(_0x54d407);
    }
    const _0xde699b = Math.floor(_0x56fb54 / 1000);
    for (let _0x40e97f of _0x536ecd) {
      if (_0xde699b === _0x40e97f / 1000 && !_0x5bb79b.has(_0x40e97f)) {
        _0x5bb79b.add(_0x40e97f);
        await _0x42f13f.sendMessage(_0x3a939f, {
          text: "⏳ Temps restant : " + _0x40e97f / 1000 + "s ! Tapez *join* pour participer ou *start* pour commencer."
        });
      }
    }
  }, 1000);
  while (Date.now() - _0x3472ad < 60000 && !_0x3564cc && !_0x25a184) {
    try {
      const _0x4af9ba = await _0x42f13f.recup_msg({
        ms_org: _0x3a939f,
        temps: 60000 - (Date.now() - _0x3472ad)
      });
      const _0x144cc4 = (_0x4af9ba?.message?.conversation || _0x4af9ba?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
      const _0x2bff40 = _0x4af9ba?.key?.participant || _0x4af9ba?.key?.remoteJid || _0x4af9ba?.message?.senderKey;
      const _0x1ba501 = await _0x14ea36(_0x2bff40, _0x3a939f, _0x42f13f);
      if (_0x144cc4 === "join" && _0x1ba501 && !_0x487722.has(_0x1ba501)) {
        _0x487722.set(_0x1ba501, {
          id: _0x1ba501,
          score: 0
        });
        await _0x42f13f.sendMessage(_0x3a939f, {
          text: "✅ @" + _0x1ba501.split("@")[0] + " a rejoint la partie ! (" + _0x487722.size + " joueur" + (_0x487722.size > 1 ? "s" : "") + ")",
          mentions: [_0x1ba501]
        });
      } else if (_0x144cc4 === "start" && _0x1ba501 === _0x28cb82) {
        if (_0x487722.size < 2) {
          await _0x42f13f.sendMessage(_0x3a939f, {
            text: "❌ Il faut au moins 2 joueurs pour démarrer. (Actuellement : " + _0x487722.size + ")",
            mentions: [_0x1ba501]
          });
        } else {
          _0x3564cc = true;
          clearInterval(_0x54d407);
          break;
        }
      } else if (_0x144cc4 === "stop" && _0x1ba501 === _0x28cb82) {
        _0x25a184 = true;
        clearInterval(_0x54d407);
        await _0x42f13f.sendMessage(_0x3a939f, {
          text: "🛑 Partie annulée par @" + _0x1ba501.split("@")[0],
          mentions: [_0x1ba501]
        });
        return;
      }
    } catch {}
  }
  if (_0x25a184) {
    return;
  }
  if (!_0x3564cc) {
    if (_0x487722.size < 2) {
      await _0x56ef2a("❌ Pas assez de joueurs (minimum 2). Partie annulée.");
      return;
    }
    _0x3564cc = true;
    clearInterval(_0x54d407);
  }
  await _0x42f13f.sendMessage(_0x3a939f, {
    text: "🚀 *Début de la Partie*\n" + ("👥 Joueurs (" + _0x487722.size + ") : " + [..._0x487722.values()].map(_0x3dc304 => "@" + _0x3dc304.id.split("@")[0]).join(", ") + "\n") + "⏱️ 20 secondes par mot\nBonne chance à tous 🍀",
    mentions: [..._0x487722.keys()]
  });
  let _0xb0c227 = 1;
  let _0x1b4c48 = [..._0x487722.values()];
  const _0x8e668f = _0x17b894 => {
    if (_0x17b894 === 1) {
      return _0x5c0b39.filter(_0x24d51c => _0x24d51c.length >= 4 && _0x24d51c.length <= 5);
    }
    if (_0x17b894 === 2) {
      return _0x5c0b39.filter(_0x9a5678 => _0x9a5678.length >= 6 && _0x9a5678.length <= 7);
    }
    if (_0x17b894 === 3) {
      return _0x5c0b39.filter(_0x169982 => _0x169982.length >= 8 && _0x169982.length <= 9);
    }
    return _0x5c0b39.filter(_0x695adb => _0x695adb.length >= 10);
  };
  while (_0x1b4c48.length > 1 && !_0x25a184) {
    const _0x266111 = [..._0x1b4c48];
    let _0xcf4475 = 0;
    await _0x42f13f.sendMessage(_0x3a939f, {
      text: "📢 *Tour " + _0xb0c227 + "* - " + _0x1b4c48.length + " joueur" + (_0x1b4c48.length > 1 ? "s" : "") + " en lice !"
    });
    for (const _0x14e575 of _0x266111) {
      const _0x4b5d2c = _0x8e668f(_0xb0c227);
      if (!_0x4b5d2c.length) {
        await _0x42f13f.sendMessage(_0x3a939f, {
          text: "❌ Plus de mots disponibles pour ce tour. Fin de partie !"
        });
        break;
      }
      const _0x296e93 = _0x776ad1(_0x4b5d2c);
      const _0x3b3d11 = _0x441107(_0x296e93);
      await _0x42f13f.sendMessage(_0x3a939f, {
        text: "🎯 Tour de @" + _0x14e575.id.split("@")[0] + "\n" + ("🔀 Mot mélangé : *" + _0x3b3d11 + "*\n") + ("💡 Indice : " + _0x296e93.length + " lettres, commence par *" + _0x296e93[0].toUpperCase() + "*\n") + "⏱️ 20 secondes pour répondre !",
        mentions: [_0x14e575.id]
      });
      let _0x427055 = false;
      const _0x46803a = Date.now();
      try {
        const _0x39ebf3 = await _0x42f13f.recup_msg({
          ms_org: _0x3a939f,
          auteur: _0x14e575.id,
          temps: 20000
        });
        const _0x4f5cf7 = (_0x39ebf3?.message?.conversation || _0x39ebf3?.message?.extendedTextMessage?.text || "").trim();
        const _0x1e5ab9 = await _0x14ea36(_0x39ebf3?.key?.participant || _0x39ebf3?.key?.remoteJid || _0x39ebf3?.message?.senderKey, _0x3a939f, _0x42f13f);
        if (_0x1e5ab9 !== _0x14e575.id) {
          throw new Error("Mauvais joueur");
        }
        if (_0x4f5cf7.toLowerCase() === "stop" && _0x1e5ab9 === _0x28cb82) {
          _0x25a184 = true;
          await _0x42f13f.sendMessage(_0x3a939f, {
            text: "🛑 Partie arrêtée par @" + _0x28cb82.split("@")[0],
            mentions: [_0x28cb82]
          });
          return;
        }
        if (_0x3cf51e(_0x4f5cf7) === _0x3cf51e(_0x296e93)) {
          _0x14e575.score++;
          _0x427055 = true;
          _0xcf4475++;
          await _0x42f13f.sendMessage(_0x3a939f, {
            text: "✅ Excellent @" + _0x14e575.id.split("@")[0] + " ! Le mot était *" + _0x296e93 + "*",
            mentions: [_0x14e575.id]
          });
        } else {
          await _0x42f13f.sendMessage(_0x3a939f, {
            text: "❌ Dommage @" + _0x14e575.id.split("@")[0] + " ! Vous avez dit \"" + _0x4f5cf7 + "\" mais c'était *" + _0x296e93 + "*",
            mentions: [_0x14e575.id]
          });
        }
      } catch (_0x5f8611) {
        await _0x42f13f.sendMessage(_0x3a939f, {
          text: "⏰ Temps écoulé ! @" + _0x14e575.id.split("@")[0] + " est éliminé... Le mot était *" + _0x296e93 + "*",
          mentions: [_0x14e575.id]
        });
      }
      if (!_0x427055) {
        _0x14e575.elimine = true;
      }
      await new Promise(_0x526747 => setTimeout(_0x526747, 1500));
    }
    _0x1b4c48 = _0x1b4c48.filter(_0x539504 => !_0x539504.elimine);
    if (_0x25a184) {
      return;
    }
    if (_0xcf4475 === 0) {
      await _0x42f13f.sendMessage(_0x3a939f, {
        text: "💥 Aucun joueur n'a trouvé au tour " + _0xb0c227 + ". Fin de la partie !"
      });
      break;
    }
    if (_0x1b4c48.length > 1) {
      _0xb0c227++;
      await _0x42f13f.sendMessage(_0x3a939f, {
        text: "📊 *Fin du tour " + (_0xb0c227 - 1) + "*\n" + ("✅ Survivants : " + _0x1b4c48.map(_0x3efe04 => "@" + _0x3efe04.id.split("@")[0]).join(", ") + "\n") + ("⬆️ Tour " + _0xb0c227 + " - Difficulté accrue !"),
        mentions: _0x1b4c48.map(_0x33e06a => _0x33e06a.id)
      });
      await new Promise(_0x46fdf8 => setTimeout(_0x46fdf8, 3000));
    }
  }
  let _0x566514 = "";
  if (_0x1b4c48.length === 1) {
    _0x566514 = "🏆 *VICTOIRE !*\n\n" + ("👑 Vainqueur : @" + _0x1b4c48[0].id.split("@")[0] + "\n") + ("🎯 Score final : " + _0x1b4c48[0].score + " point(s)\n") + ("📈 Tours complétés : " + _0xb0c227 + "\n\n");
  } else if (_0x1b4c48.length === 0) {
    _0x566514 = "💥 *Fin de Partie - Aucun survivant !*\n\n";
  } else {
    _0x566514 = "🏁 *Fin de Partie*\n\n";
  }
  _0x566514 += "📊 *Classement Final :*\n";
  const _0x1d8049 = [..._0x487722.values()].sort((_0x4d2021, _0x241b01) => _0x241b01.score - _0x4d2021.score);
  _0x1d8049.forEach((_0x548832, _0x21bfb5) => {
    const _0xe58b47 = _0x21bfb5 === 0 ? "🥇" : _0x21bfb5 === 1 ? "🥈" : _0x21bfb5 === 2 ? "🥉" : "  ";
    _0x566514 += _0xe58b47 + " @" + _0x548832.id.split("@")[0] + " : " + _0x548832.score + " point(s)\n";
  });
  _0x566514 += "\n🎮 Merci d'avoir joué ! Tapez *dmots* pour rejouer.";
  await _0x42f13f.sendMessage(_0x3a939f, {
    text: _0x566514,
    mentions: [..._0x487722.keys()]
  });
});
registerCommand({
  nom_cmd: "wcg",
  classe: "Jeux",
  react: "🎯",
  desc: "Word Chain Game - Survivez en trouvant des mots !"
}, async (_0x605ab0, _0x2b1ae2, {
  repondre: _0x77221c,
  auteur_Message: _0x217e93,
  isSudo: _0x5d1b86,
  getJid: _0x5072d5
}) => {
  const _0x5e3795 = new Map();
  const _0x3dcd9b = Date.now();
  const _0x59a5f7 = new Set();
  function _0x3461f7(_0x41257c) {
    return _0x41257c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "").trim();
  }
  async function _0x21b5df(_0x14e369) {
    try {
      const _0x42d00e = _0x3461f7(_0x14e369);
      const _0x32350d = "https://fr.wiktionary.org/wiki/" + encodeURIComponent(_0x42d00e);
      const _0x10d6be = await fetch(_0x32350d);
      if (!_0x10d6be.ok) {
        return false;
      }
      const _0x3c9375 = await _0x10d6be.text();
      if (_0x3c9375.includes("Pas de résultat pour")) {
        return false;
      }
      return true;
    } catch (_0xfeeb7a) {
      console.error(_0xfeeb7a);
      return false;
    }
  }
  _0x5e3795.set(_0x217e93, {
    id: _0x217e93,
    score: 0
  });
  const _0x1358e3 = _0x217e93 || _0x5d1b86;
  await _0x2b1ae2.sendMessage(_0x605ab0, {
    text: "╔════════════════╗\n  🎮 WORD CHAIN GAME\n╚════════════════╝\n\n📝 Trouvez des mots valides\n🎯 Dernier survivant gagne\n💬 'join' pour rejoindre\n🚀 'start' pour lancer\n🛑 'stop' pour annuler\n\n⏳ Inscription : 60s"
  });
  const _0xcbef9d = [45000, 30000, 15000];
  const _0x1b0850 = new Set();
  let _0x51f2ba = false;
  let _0x5b4e2f = false;
  const _0x1c662c = setInterval(async () => {
    const _0x3f1d4a = 60000 - (Date.now() - _0x3dcd9b);
    if (_0x3f1d4a <= 0 || _0x51f2ba || _0x5b4e2f) {
      return clearInterval(_0x1c662c);
    }
    const _0xc612b4 = Math.floor(_0x3f1d4a / 1000);
    for (let _0x3c95cc of _0xcbef9d) {
      if (_0xc612b4 === _0x3c95cc / 1000 && !_0x1b0850.has(_0x3c95cc)) {
        _0x1b0850.add(_0x3c95cc);
        await _0x2b1ae2.sendMessage(_0x605ab0, {
          text: "⏰ Plus que " + _0x3c95cc / 1000 + "s pour rejoindre !"
        });
      }
    }
  }, 1000);
  while (Date.now() - _0x3dcd9b < 60000 && !_0x51f2ba && !_0x5b4e2f) {
    try {
      const _0x2fad4c = await _0x2b1ae2.recup_msg({
        ms_org: _0x605ab0,
        temps: 60000 - (Date.now() - _0x3dcd9b)
      });
      const _0x55e274 = (_0x2fad4c?.message?.conversation || _0x2fad4c?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
      const _0x5e7521 = _0x2fad4c?.key?.participant || _0x2fad4c?.key?.remoteJid || _0x2fad4c?.message?.senderKey;
      const _0x123fe4 = await _0x5072d5(_0x5e7521, _0x605ab0, _0x2b1ae2);
      if (_0x55e274 === "join" && _0x123fe4 && !_0x5e3795.has(_0x123fe4)) {
        _0x5e3795.set(_0x123fe4, {
          id: _0x123fe4,
          score: 0
        });
        await _0x2b1ae2.sendMessage(_0x605ab0, {
          text: "✅ @" + _0x123fe4.split("@")[0] + " a rejoint la partie !\n👥 Total : " + _0x5e3795.size + " joueur" + (_0x5e3795.size > 1 ? "s" : ""),
          mentions: [_0x123fe4]
        });
      } else if (_0x55e274 === "start" && _0x123fe4 === _0x1358e3) {
        if (_0x5e3795.size < 2) {
          await _0x2b1ae2.sendMessage(_0x605ab0, {
            text: "❌ Minimum 2 joueurs requis\n📊 Actuellement : " + _0x5e3795.size
          });
        } else {
          _0x51f2ba = true;
          clearInterval(_0x1c662c);
          break;
        }
      } else if (_0x55e274 === "stop" && _0x123fe4 === _0x1358e3) {
        _0x5b4e2f = true;
        clearInterval(_0x1c662c);
        await _0x2b1ae2.sendMessage(_0x605ab0, {
          text: "🛑 Partie annulée par @" + _0x123fe4.split("@")[0],
          mentions: [_0x123fe4]
        });
        return;
      }
    } catch {}
  }
  if (_0x5b4e2f) {
    return;
  }
  if (!_0x51f2ba) {
    if (_0x5e3795.size < 2) {
      await _0x77221c("❌ Pas assez de joueurs");
      return;
    }
    _0x51f2ba = true;
    clearInterval(_0x1c662c);
  }
  await _0x2b1ae2.sendMessage(_0x605ab0, {
    text: "╔═════════════╗\n    🚀 DÉBUT DU JEU\n╚═════════════╝\n\n" + ("👥 Joueurs (" + _0x5e3795.size + ") :\n") + ([..._0x5e3795.values()].map(_0x386099 => "  • @" + _0x386099.id.split("@")[0]).join("\n") + "\n\n") + "🎯 Bonne chance à tous !",
    mentions: [..._0x5e3795.keys()]
  });
  await new Promise(_0xa8ab5c => setTimeout(_0xa8ab5c, 2000));
  let _0x1350f6 = 1;
  let _0x54ee1d = [..._0x5e3795.values()];
  let _0x8d07a1 = false;
  const _0x9cdd9e = _0x1b8132 => {
    if (_0x1b8132 === 1) {
      return [3, 4];
    }
    if (_0x1b8132 === 2) {
      return [4, 5, 6];
    }
    if (_0x1b8132 === 3) {
      return [5, 6, 7];
    }
    if (_0x1b8132 === 4) {
      return [6, 7, 8];
    }
    if (_0x1b8132 === 5) {
      return [7, 8, 9];
    }
    if (_0x1b8132 === 6) {
      return [8, 9, 10];
    }
    if (_0x1b8132 === 7) {
      return [9, 10, 11];
    }
    if (_0x1b8132 === 8) {
      return [10, 11, 12];
    }
    if (_0x1b8132 === 9) {
      return [11, 12, 13];
    }
    if (_0x1b8132 === 10) {
      return [12, 13, 14];
    }
    if (_0x1b8132 === 11) {
      return [13, 14, 15];
    }
    if (_0x1b8132 === 12) {
      return [14, 15, 16];
    }
    if (_0x1b8132 === 13) {
      return [15, 16, 17];
    }
    if (_0x1b8132 === 14) {
      return [16, 17, 18];
    }
    if (_0x1b8132 === 15) {
      return [18, 19, 20];
    }
    if (_0x1b8132 === 16) {
      return [20, 21, 22];
    }
    if (_0x1b8132 === 17) {
      return [22, 23, 24];
    }
    return [25];
  };
  const _0x3a6b48 = _0x49353d => {
    if (_0x49353d <= 4) {
      return 10000;
    }
    if (_0x49353d <= 6) {
      return 15000;
    }
    if (_0x49353d <= 8) {
      return 18000;
    }
    if (_0x49353d <= 10) {
      return 20000;
    }
    if (_0x49353d <= 14) {
      return 25000;
    }
    return 30000;
  };
  while (_0x54ee1d.length > 1 && !_0x5b4e2f && !_0x8d07a1) {
    const _0x396eb2 = [..._0x54ee1d];
    let _0x13de4c = 0;
    const _0x7448bf = _0x3a6b48(_0x1350f6);
    const _0x58e735 = Math.floor(_0x7448bf / 1000);
    await _0x2b1ae2.sendMessage(_0x605ab0, {
      text: "\n━━━━━━━━━━━━━━━\n" + ("   🎯 TOUR " + _0x1350f6 + "\n") + "━━━━━━━━━━━━━━━━\n" + ("👥 " + _0x54ee1d.length + " survivant" + (_0x54ee1d.length > 1 ? "s" : "") + "\n") + ("⏱️ " + _0x58e735 + "s par mot")
    });
    await new Promise(_0x1e3358 => setTimeout(_0x1e3358, 1500));
    for (const _0x4653b9 of _0x396eb2) {
      const _0x2e3693 = _0x9cdd9e(_0x1350f6);
      const _0x500f3c = _0x2e3693[Math.floor(Math.random() * _0x2e3693.length)];
      await _0x2b1ae2.sendMessage(_0x605ab0, {
        text: "┌────── TOUR ─────┐\n" + ("│ @" + _0x4653b9.id.split("@")[0] + "\n") + ("│ Longueur : " + _0x500f3c + " lettres\n") + "└───────────────┘\n" + ("⏰ " + _0x58e735 + " secondes !"),
        mentions: [_0x4653b9.id]
      });
      let _0x30cad2 = false;
      let _0x6869e1 = 3;
      while (_0x6869e1 > 0 && !_0x30cad2) {
        try {
          const _0x2738f3 = await _0x2b1ae2.recup_msg({
            ms_org: _0x605ab0,
            auteur: _0x4653b9.id,
            temps: _0x7448bf
          });
          const _0x1e20f8 = (_0x2738f3?.message?.conversation || _0x2738f3?.message?.extendedTextMessage?.text || "").trim();
          const _0x24e805 = await _0x5072d5(_0x2738f3?.key?.participant || _0x2738f3?.key?.remoteJid || _0x2738f3?.message?.senderKey, _0x605ab0, _0x2b1ae2);
          if (_0x24e805 !== _0x4653b9.id) {
            throw new Error("Mauvais joueur");
          }
          if (!_0x1e20f8 || _0x1e20f8 === "") {
            _0x6869e1--;
            if (_0x6869e1 > 0) {
              await _0x2b1ae2.sendMessage(_0x605ab0, {
                text: "⚠️ @" + _0x4653b9.id.split("@")[0] + ", envoyez un MESSAGE TEXTE svp !\n⏰ " + _0x6869e1 + " tentative" + (_0x6869e1 > 1 ? "s" : "") + " restante" + (_0x6869e1 > 1 ? "s" : ""),
                mentions: [_0x4653b9.id]
              });
              continue;
            } else {
              await _0x2b1ae2.sendMessage(_0x605ab0, {
                text: "❌ Éliminé : @" + _0x4653b9.id.split("@")[0] + "\nRaison : Aucun message texte envoyé",
                mentions: [_0x4653b9.id]
              });
              break;
            }
          }
          if (_0x1e20f8.toLowerCase() === "stop" && _0x24e805 === _0x1358e3) {
            _0x5b4e2f = true;
            await _0x2b1ae2.sendMessage(_0x605ab0, {
              text: "🛑 Partie interrompue"
            });
            return;
          }
          const _0x33b6f9 = _0x1e20f8;
          if (_0x33b6f9.length < _0x500f3c) {
            await _0x2b1ae2.sendMessage(_0x605ab0, {
              text: "❌ Éliminé : @" + _0x4653b9.id.split("@")[0] + "\n" + ("Raison : Longueur incorrecte (" + _0x33b6f9.length + " < " + _0x500f3c + ")"),
              mentions: [_0x4653b9.id]
            });
            break;
          } else if (_0x59a5f7.has(_0x33b6f9.toLowerCase())) {
            await _0x2b1ae2.sendMessage(_0x605ab0, {
              text: "❌ Éliminé : @" + _0x4653b9.id.split("@")[0] + "\nRaison : Mot déjà utilisé",
              mentions: [_0x4653b9.id]
            });
            break;
          } else {
            const _0x288683 = await _0x21b5df(_0x33b6f9);
            if (_0x288683) {
              _0x59a5f7.add(_0x33b6f9.toLowerCase());
              _0x4653b9.score++;
              _0x30cad2 = true;
              _0x13de4c++;
              if (_0x500f3c === 25) {
                _0x8d07a1 = true;
                await _0x2b1ae2.sendMessage(_0x605ab0, {
                  text: "\n🏆🏆🏆 EXPLOIT ! 🏆🏆🏆\n\n" + ("@" + _0x4653b9.id.split("@")[0] + " a trouvé un mot de 25 lettres !\n") + ("Mot : *" + _0x1e20f8.toUpperCase() + "*\n\n") + "🎉 VICTOIRE ABSOLUE !",
                  mentions: [_0x4653b9.id]
                });
                break;
              } else {
                await _0x2b1ae2.sendMessage(_0x605ab0, {
                  text: "✅ *" + _0x1e20f8.toUpperCase() + "* validé !"
                });
              }
              break;
            } else {
              await _0x2b1ae2.sendMessage(_0x605ab0, {
                text: "❌ Éliminé : @" + _0x4653b9.id.split("@")[0] + "\nRaison : Mot inexistant",
                mentions: [_0x4653b9.id]
              });
              break;
            }
          }
        } catch (_0x432c3f) {
          console.error(_0x432c3f);
          await _0x2b1ae2.sendMessage(_0x605ab0, {
            text: "⏰ Temps écoulé : @" + _0x4653b9.id.split("@")[0] + "\nÉliminé !",
            mentions: [_0x4653b9.id]
          });
          break;
        }
      }
      if (!_0x30cad2) {
        _0x4653b9.elimine = true;
      }
      await new Promise(_0x22b91a => setTimeout(_0x22b91a, 1000));
    }
    if (_0x8d07a1) {
      break;
    }
    _0x54ee1d = _0x54ee1d.filter(_0x4c5b84 => !_0x4c5b84.elimine);
    if (_0x5b4e2f) {
      return;
    }
    if (_0x13de4c === 0) {
      await _0x2b1ae2.sendMessage(_0x605ab0, {
        text: "\n💥 Aucun survivant au tour " + _0x1350f6 + "\nFin de partie !"
      });
      break;
    }
    if (_0x54ee1d.length > 1) {
      _0x1350f6++;
      await _0x2b1ae2.sendMessage(_0x605ab0, {
        text: "\n✅ Survivants :\n" + (_0x54ee1d.map(_0x24e7dd => "  • @" + _0x24e7dd.id.split("@")[0]).join("\n") + "\n\n") + ("⏭️ Passage au tour " + _0x1350f6 + "..."),
        mentions: _0x54ee1d.map(_0x171124 => _0x171124.id)
      });
      await new Promise(_0x4dd8b1 => setTimeout(_0x4dd8b1, 2500));
    }
  }
  let _0x1170e2 = "";
  if (_0x8d07a1) {
    const _0x12fe3a = _0x54ee1d.filter(_0x1129fc => !_0x1129fc.elimine);
    if (_0x12fe3a.length === 1) {
      _0x1170e2 = "\n╔══════════════════╗\n   🏆 VICTOIRE TOTALE 🏆\n╚══════════════════╝\n\n" + ("👑 Champion ultime : @" + _0x12fe3a[0].id.split("@")[0] + "\n") + ("🎯 Score : " + _0x12fe3a[0].score + " point" + (_0x12fe3a[0].score > 1 ? "s" : "") + "\n") + ("📈 Tours : " + _0x1350f6 + "\n") + "🏅 Exploit : Mot de 25 lettres !\n\n";
    } else {
      _0x1170e2 = "\n╔══════════════════╗\n   🏆 VICTOIRE TOTALE 🏆\n╚══════════════════╝\n\n" + ("👑 Champions : " + _0x12fe3a.map(_0x124a84 => "@" + _0x124a84.id.split("@")[0]).join(", ") + "\n") + ("📈 Tours : " + _0x1350f6 + "\n") + "🏅 Exploit : Mots de 25 lettres !\n\n";
    }
  } else if (_0x54ee1d.length === 1) {
    _0x1170e2 = "\n╔══════════════════╗\n     👑 VICTOIRE ! 👑\n╚══════════════════╝\n\n" + ("🏆 Vainqueur : @" + _0x54ee1d[0].id.split("@")[0] + "\n") + ("🎯 Score : " + _0x54ee1d[0].score + " point" + (_0x54ee1d[0].score > 1 ? "s" : "") + "\n") + ("📈 Tours complétés : " + _0x1350f6 + "\n\n");
  } else {
    _0x1170e2 = "\n💥 Fin de partie - Aucun survivant\n\n";
  }
  const _0x77d48b = [..._0x5e3795.values()].sort((_0x203cf1, _0x5d81d3) => _0x5d81d3.score - _0x203cf1.score);
  _0x1170e2 += "━━━━━━━━━━━━━━━━━━━\n📊 CLASSEMENT FINAL\n━━━━━━━━━━━━━━━━━━━\n\n";
  _0x77d48b.forEach((_0x47acab, _0x433c9b) => {
    const _0x37cd78 = _0x433c9b === 0 ? "🥇" : _0x433c9b === 1 ? "🥈" : _0x433c9b === 2 ? "🥉" : _0x433c9b + 1 + ".";
    _0x1170e2 += _0x37cd78 + " @" + _0x47acab.id.split("@")[0] + " : " + _0x47acab.score + " point" + (_0x47acab.score > 1 ? "s" : "") + "\n";
  });
  _0x1170e2 += "\n🎮 Tapez 'wcg' pour rejouer !";
  await _0x2b1ae2.sendMessage(_0x605ab0, {
    text: _0x1170e2,
    mentions: [..._0x5e3795.keys()]
  });
});