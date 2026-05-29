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
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    msg_Repondu,
    auteur_Msg_Repondu,
    auteur_Message,
    getJid
  } = ctx;
  const challengerTag = auteur_Message.split("@")[0];
  let opponentTag;
  let opponentJid;
  if (msg_Repondu) {
    opponentTag = auteur_Msg_Repondu.split("@")[0];
    opponentJid = auteur_Msg_Repondu;
  } else if (arg.length > 0 && arg[0].includes("@")) {
    opponentJid = await getJid(arg[0].replace("@", "") + "@lid", chatJid, sock);
    opponentTag = opponentJid.split("@")[0];
  } else {
    return sock.sendMessage(chatJid, {
      text: "🙋‍♂️ Veuillez *mentionner* ou *répondre* au message du joueur pour lancer une partie."
    }, {
      quoted: ms
    });
  }
  if (auteur_Message === opponentJid) {
    return sock.sendMessage(chatJid, {
      text: "🚫 Vous ne pouvez pas jouer contre vous-même !"
    }, {
      quoted: ms
    });
  }
  if (activeGames[auteur_Message] || activeGames[opponentJid]) {
    delete activeGames[auteur_Message];
    delete activeGames[opponentJid];
  }
  const gameId = Date.now() + "-" + auteur_Message + "-" + opponentJid;
  activeGames[auteur_Message] = {
    opponent: opponentJid,
    gameID: gameId
  };
  activeGames[opponentJid] = {
    opponent: auteur_Message,
    gameID: gameId
  };
  await sock.sendMessage(chatJid, {
    text: "🎮 *Tic-Tac-Toe Défi !*\n\n🔸 @" + challengerTag + " défie @" + opponentTag + " !\n\n✍️ Pour accepter, réponds *oui* dans les 60 secondes.",
    mentions: [auteur_Message, opponentJid]
  }, {
    quoted: ms
  });
  try {
    const acceptReply = await sock.recup_msg({
      auteur: opponentJid,
      ms_org: chatJid,
      temps: 60000
    });
    const acceptText = acceptReply?.message?.conversation || acceptReply?.message?.extendedTextMessage?.text || "";
    if (acceptText.toLowerCase() === "oui") {
      const grid = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
      let currentPlayerIndex = 0;
      const symbols = ["❌", "⭕"];
      const players = [auteur_Message, opponentJid];
      activeGames[auteur_Message] = {
        opponent: opponentJid,
        grid,
        currentPlayer: currentPlayerIndex,
        gameID: gameId
      };
      activeGames[opponentJid] = {
        opponent: auteur_Message,
        grid,
        currentPlayer: currentPlayerIndex,
        gameID: gameId
      };
      const renderBoard = (finished = false) => {
        let boardText = "\n╔═══╦═══╦═══╗\n║ " + grid[0] + "    " + grid[1] + "    " + grid[2] + "\n╠═══╬═══╬═══╣\n║ " + grid[3] + "    " + grid[4] + "    " + grid[5] + "\n╠═══╬═══╬═══╣\n║ " + grid[6] + "    " + grid[7] + "    " + grid[8] + "\n╚═══╩═══╩═══╝\n\n❌ : @" + challengerTag + "\n⭕ : @" + opponentTag;
        if (!finished) {
          boardText += "\n\n🎯 C'est au tour de @" + players[currentPlayerIndex].split("@")[0] + " de jouer !";
        }
        return boardText;
      };
      const checkWin = symbol => {
        const winLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        return winLines.some(line => line.every(index => grid[index] === symbol));
      };
      for (let turn = 0; turn < 9; turn++) {
        const currentSymbol = symbols[currentPlayerIndex];
        await sock.sendMessage(chatJid, {
          text: renderBoard(),
          mentions: [auteur_Message, opponentJid]
        }, {
          quoted: ms
        });
        let cellIndex;
        let validMove = false;
        while (!validMove) {
          const moveReply = await sock.recup_msg({
            auteur: players[currentPlayerIndex],
            ms_org: chatJid,
            temps: 60000
          });
          const moveText = moveReply?.message?.conversation || moveReply?.message?.extendedTextMessage?.text || "";
          if (!isNaN(moveText)) {
            cellIndex = parseInt(moveText);
            if (grid[cellIndex - 1] !== "❌" && grid[cellIndex - 1] !== "⭕" && cellIndex >= 1 && cellIndex <= 9) {
              grid[cellIndex - 1] = currentSymbol;
              validMove = true;
            } else {
              await sock.sendMessage(chatJid, {
                text: "❗ *Position invalide !* Choisis une case encore libre (1 à 9).",
                mentions: players
              }, {
                quoted: ms
              });
            }
          } else if (moveText.toLowerCase().startsWith(config.PREFIXE + "ttt")) {} else {
            await sock.sendMessage(chatJid, {
              text: "❌ *Entrée invalide !* Réponds avec un chiffre entre 1 et 9.",
              mentions: players
            }, {
              quoted: ms
            });
          }
        }
        if (checkWin(currentSymbol)) {
          await sock.sendMessage(chatJid, {
            text: "🏆 *Victoire !*\n\n🎉 @" + players[currentPlayerIndex].split("@")[0] + " a gagné la partie !\n" + renderBoard(true),
            mentions: players
          }, {
            quoted: ms
          });
          delete activeGames[auteur_Message];
          delete activeGames[opponentJid];
          return;
        }
        currentPlayerIndex = 1 - currentPlayerIndex;
        activeGames[auteur_Message].currentPlayer = currentPlayerIndex;
        activeGames[opponentJid].currentPlayer = currentPlayerIndex;
      }
      await sock.sendMessage(chatJid, {
        text: "🤝 *Match Nul !*\n\nAucun gagnant cette fois-ci !\n" + renderBoard(true),
        mentions: players
      }, {
        quoted: ms
      });
      delete activeGames[auteur_Message];
      delete activeGames[opponentJid];
    } else {
      return sock.sendMessage(chatJid, {
        text: "❌ Invitation refusée par le joueur."
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    if (err.message === "Timeout") {
      await sock.sendMessage(chatJid, {
        text: "⏱️ @" + opponentTag + " a mis trop de temps. Partie annulée.",
        mentions: [auteur_Message, opponentJid]
      }, {
        quoted: ms
      });
    } else {
      console.error(err);
    }
    delete activeGames[auteur_Message];
    delete activeGames[opponentJid];
  }
});

registerCommand({
  nom_cmd: "anime-quizz",
  classe: "Jeux",
  react: "📺",
  desc: "Lance un quiz anime.",
  alias: ["a-quizz"]
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    auteur_Message,
    verif_Groupe,
    isSudo,
    getJid
  } = ctx;
  if (!verif_Groupe) {
    return repondre("❌ Cette commande fonctionne uniquement dans les groupes.");
  }
  const value = auteur_Message || isSudo;
  const url = "🎯 *Anime Quiz*\n\nChoisis le nombre de questions :\n1️⃣ 10 questions\n2️⃣ 20 questions\n3️⃣ 30 questions\n\n✋ Envoie *stop* à tout moment pour annuler (créateur uniquement).";
  await sock.sendMessage(chatJid, {
    text: url
  });
  let currentPlayer = 10;
  try {
    const replyMsg = await sock.recup_msg({
      ms_org: chatJid,
      auteur: value,
      temps: 30000
    });
    const value2 = (replyMsg?.message?.conversation || replyMsg?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
    if (value2 === "stop") {
      return repondre("🛑 Quiz annulé.");
    }
    if (value2 === "1") {
      currentPlayer = 10;
    } else if (value2 === "2") {
      currentPlayer = 20;
    } else if (value2 === "3") {
      currentPlayer = 30;
    } else {
      return repondre("❗ Choix invalide. Réponds par 1, 2 ou 3.");
    }
  } catch {
    return repondre("⏱️ Temps écoulé. Relance la commande pour recommencer.");
  }
  let item;
  try {
    const fileData = fs.readFileSync("./lib/aquizz.json", "utf8");
    item = JSON.parse(fileData).sort(() => 0.5 - Math.random()).slice(0, currentPlayer);
  } catch {
    return repondre("❌ Impossible de récupérer les questions.");
  }
  const options = {
    "1": "a",
    "2": "b",
    "3": "c",
    "4": "d"
  };
  const options2 = {};
  for (let currentPlayer2 = 0; currentPlayer2 < currentPlayer; currentPlayer2++) {
    const {
      question: tmp,
      options: tmp2,
      answer: tmp3
    } = item[currentPlayer2];
    const value3 = tmp3.toLowerCase();
    const value4 = tmp2[value3];
    const text = Object.values(tmp2).map((tmp4, tmp5) => tmp5 + 1 + ". " + tmp4).join("\n");
    const url2 = "📺 *Question " + (currentPlayer2 + 1) + "/" + currentPlayer + "*\n\n" + (tmp + "\n\n") + (text + "\n\n") + "⏳ *15 secondes* — Réponds avec 1, 2, 3 ou 4\n🛑 Le créateur peut envoyer *stop* pour annuler.";
    await sock.sendMessage(chatJid, {
      text: url2
    });
    const timestamp = Date.now();
    let false2 = false;
    while (Date.now() - timestamp < 15000 && !false2) {
      try {
        const timestamp2 = await sock.recup_msg({
          ms_org: chatJid,
          temps: 15000 - (Date.now() - timestamp)
        });
        const value5 = (timestamp2?.message?.conversation || timestamp2?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
        const value6 = timestamp2.key.participant || timestamp2.key.remoteJid;
        const value7 = await getJid(value6, chatJid, sock);
        if (value5 === "stop" && value7 === value) {
          return sock.sendMessage(chatJid, {
            text: "🛑 Quiz annulé par le créateur @" + value7.split("@")[0],
            mentions: [value7]
          });
        }
        if (!["1", "2", "3", "4"].includes(value5)) {
          continue;
        }
        const value8 = options[value5];
        if (value8 === value3) {
          options2[value7] = (options2[value7] || 0) + 1;
          await sock.sendMessage(chatJid, {
            text: "✅ Bonne réponse @" + value7.split("@")[0] + " ! C'était *" + value4 + "*",
            quoted: timestamp2,
            mentions: [value7]
          });
          false2 = true;
        }
      } catch {
        break;
      }
    }
    if (!false2) {
      await sock.sendMessage(chatJid, {
        text: "⌛ Temps écoulé ! La bonne réponse était *" + value4 + "*"
      });
    }
    await delay(1000);
  }
  if (!Object.keys(options2).length) {
    return sock.sendMessage(chatJid, {
      text: "😢 Personne n'a marqué de point. Fin du quiz."
    });
  }
  const text2 = Object.entries(options2).sort(([, tmp6], [, tmp7]) => tmp7 - tmp6).map(([tmp8, tmp9], tmp10) => tmp10 + 1 + ". @" + tmp8.split("@")[0] + " — *" + tmp9 + "* point" + (tmp9 > 1 ? "s" : "")).join("\n");
  const url3 = "🏁 *Fin du Quiz Anime !*\n\n📊 *Classement final :*\n\n" + text2;
  await sock.sendMessage(chatJid, {
    text: url3,
    mentions: Object.keys(options2)
  });
});
registerCommand({
  nom_cmd: "dmots",
  classe: "Jeux",
  react: "🪹",
  desc: "Jouez à plusieurs au jeu du Mot Mélangé"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    auteur_Message,
    isSudo,
    getJid
  } = ctx;
  const value = new Map();
  const timestamp = Date.now();
  let list = [];
  const value2 = new Set();
  try {
    const fileData = fs.readFileSync("./lib/mots.json", "utf8");
    list = JSON.parse(fileData);
    list = list.sort(() => Math.random() - 0.5);
  } catch (err) {
    return repondre("❌ Impossible de récupérer les mots.");
  }
  function tmp(tmp2) {
    return tmp2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "").trim();
  }
  const value3 = tmp3 => {
    let item;
    let currentPlayer = 0;
    const value4 = tmp3.toLowerCase();
    do {
      const value5 = tmp3.split("");
      for (let value6 = value5.length - 1; value6 > 0; value6--) {
        const randomValue = Math.floor(Math.random() * (value6 + 1));
        [value5[value6], value5[randomValue]] = [value5[randomValue], value5[value6]];
      }
      item = value5.join("");
      currentPlayer++;
    } while (currentPlayer < 20 && (item.toLowerCase() === value4 || item === tmp3.split("").reverse().join("") || item.toLowerCase() === tmp3.split("").reverse().join("").toLowerCase()));
    return item;
  };
  const value7 = tmp4 => {
    const tmp5 = tmp4.filter(tmp6 => !value2.has(tmp(tmp6)));
    if (tmp5.length === 0) {
      value2.clear();
      return tmp4[Math.floor(Math.random() * tmp4.length)];
    }
    const randomValue2 = tmp5[Math.floor(Math.random() * tmp5.length)];
    value2.add(tmp(randomValue2));
    return randomValue2;
  };
  value.set(auteur_Message, {
    id: auteur_Message,
    score: 0
  });
  const value8 = auteur_Message || isSudo;
  await sock.sendMessage(chatJid, {
    text: "🎮 *Jeu du Mot Mélangé - MULTIJOUEURS* 🎮\n\nTapez 'join' pour participer !\n🆕 Tapez 'start' pour commencer immédiatement (créateur)\n❌ Tapez 'stop' pour annuler (créateur)\n⏳ Temps max d'inscription : 60s\n🎯 Dernier survivant gagne !"
  });
  const list2 = [45000, 30000, 15000];
  const value9 = new Set();
  let false2 = false;
  let false3 = false;
  const timestamp2 = setInterval(async () => {
    const tmp7 = 60000 - (Date.now() - timestamp);
    if (tmp7 <= 0 || false2 || false3) {
      return clearInterval(timestamp2);
    }
    const value10 = Math.floor(tmp7 / 1000);
    for (let tmp8 of list2) {
      if (value10 === tmp8 / 1000 && !value9.has(tmp8)) {
        value9.add(tmp8);
        await sock.sendMessage(chatJid, {
          text: "⏳ Temps restant : " + tmp8 / 1000 + "s ! Tapez *join* pour participer ou *start* pour commencer."
        });
      }
    }
  }, 1000);
  while (Date.now() - timestamp < 60000 && !false2 && !false3) {
    try {
      const timestamp3 = await sock.recup_msg({
        ms_org: chatJid,
        temps: 60000 - (Date.now() - timestamp)
      });
      const value11 = (timestamp3?.message?.conversation || timestamp3?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
      const value12 = timestamp3?.key?.participant || timestamp3?.key?.remoteJid || timestamp3?.message?.senderKey;
      const value13 = await getJid(value12, chatJid, sock);
      if (value11 === "join" && value13 && !value.has(value13)) {
        value.set(value13, {
          id: value13,
          score: 0
        });
        await sock.sendMessage(chatJid, {
          text: "✅ @" + value13.split("@")[0] + " a rejoint la partie ! (" + value.size + " joueur" + (value.size > 1 ? "s" : "") + ")",
          mentions: [value13]
        });
      } else if (value11 === "start" && value13 === value8) {
        if (value.size < 2) {
          await sock.sendMessage(chatJid, {
            text: "❌ Il faut au moins 2 joueurs pour démarrer. (Actuellement : " + value.size + ")",
            mentions: [value13]
          });
        } else {
          false2 = true;
          clearInterval(timestamp2);
          break;
        }
      } else if (value11 === "stop" && value13 === value8) {
        false3 = true;
        clearInterval(timestamp2);
        await sock.sendMessage(chatJid, {
          text: "🛑 Partie annulée par @" + value13.split("@")[0],
          mentions: [value13]
        });
        return;
      }
    } catch {}
  }
  if (false3) {
    return;
  }
  if (!false2) {
    if (value.size < 2) {
      await repondre("❌ Pas assez de joueurs (minimum 2). Partie annulée.");
      return;
    }
    false2 = true;
    clearInterval(timestamp2);
  }
  await sock.sendMessage(chatJid, {
    text: "🚀 *Début de la Partie*\n" + ("👥 Joueurs (" + value.size + ") : " + [...value.values()].map(tmp9 => "@" + tmp9.id.split("@")[0]).join(", ") + "\n") + "⏱️ 20 secondes par mot\nBonne chance à tous 🍀",
    mentions: [...value.keys()]
  });
  let currentPlayer2 = 1;
  let list3 = [...value.values()];
  const value14 = tmp10 => {
    if (tmp10 === 1) {
      return list.filter(tmp11 => tmp11.length >= 4 && tmp11.length <= 5);
    }
    if (tmp10 === 2) {
      return list.filter(tmp12 => tmp12.length >= 6 && tmp12.length <= 7);
    }
    if (tmp10 === 3) {
      return list.filter(tmp13 => tmp13.length >= 8 && tmp13.length <= 9);
    }
    return list.filter(tmp14 => tmp14.length >= 10);
  };
  while (list3.length > 1 && !false3) {
    const list4 = [...list3];
    let currentPlayer3 = 0;
    await sock.sendMessage(chatJid, {
      text: "📢 *Tour " + currentPlayer2 + "* - " + list3.length + " joueur" + (list3.length > 1 ? "s" : "") + " en lice !"
    });
    for (const tmp15 of list4) {
      const value15 = value14(currentPlayer2);
      if (!value15.length) {
        await sock.sendMessage(chatJid, {
          text: "❌ Plus de mots disponibles pour ce tour. Fin de partie !"
        });
        break;
      }
      const value16 = value7(value15);
      const value17 = value3(value16);
      await sock.sendMessage(chatJid, {
        text: "🎯 Tour de @" + tmp15.id.split("@")[0] + "\n" + ("🔀 Mot mélangé : *" + value17 + "*\n") + ("💡 Indice : " + value16.length + " lettres, commence par *" + value16[0].toUpperCase() + "*\n") + "⏱️ 20 secondes pour répondre !",
        mentions: [tmp15.id]
      });
      let false4 = false;
      const timestamp4 = Date.now();
      try {
        const replyMsg = await sock.recup_msg({
          ms_org: chatJid,
          auteur: tmp15.id,
          temps: 20000
        });
        const value18 = (replyMsg?.message?.conversation || replyMsg?.message?.extendedTextMessage?.text || "").trim();
        const value19 = await getJid(replyMsg?.key?.participant || replyMsg?.key?.remoteJid || replyMsg?.message?.senderKey, chatJid, sock);
        if (value19 !== tmp15.id) {
          throw new Error("Mauvais joueur");
        }
        if (value18.toLowerCase() === "stop" && value19 === value8) {
          false3 = true;
          await sock.sendMessage(chatJid, {
            text: "🛑 Partie arrêtée par @" + value8.split("@")[0],
            mentions: [value8]
          });
          return;
        }
        if (tmp(value18) === tmp(value16)) {
          tmp15.score++;
          false4 = true;
          currentPlayer3++;
          await sock.sendMessage(chatJid, {
            text: "✅ Excellent @" + tmp15.id.split("@")[0] + " ! Le mot était *" + value16 + "*",
            mentions: [tmp15.id]
          });
        } else {
          await sock.sendMessage(chatJid, {
            text: "❌ Dommage @" + tmp15.id.split("@")[0] + " ! Vous avez dit \"" + value18 + "\" mais c'était *" + value16 + "*",
            mentions: [tmp15.id]
          });
        }
      } catch (tmp16) {
        await sock.sendMessage(chatJid, {
          text: "⏰ Temps écoulé ! @" + tmp15.id.split("@")[0] + " est éliminé... Le mot était *" + value16 + "*",
          mentions: [tmp15.id]
        });
      }
      if (!false4) {
        tmp15.elimine = true;
      }
      await new Promise(tmp17 => setTimeout(tmp17, 1500));
    }
    list3 = list3.filter(tmp18 => !tmp18.elimine);
    if (false3) {
      return;
    }
    if (currentPlayer3 === 0) {
      await sock.sendMessage(chatJid, {
        text: "💥 Aucun joueur n'a trouvé au tour " + currentPlayer2 + ". Fin de la partie !"
      });
      break;
    }
    if (list3.length > 1) {
      currentPlayer2++;
      await sock.sendMessage(chatJid, {
        text: "📊 *Fin du tour " + (currentPlayer2 - 1) + "*\n" + ("✅ Survivants : " + list3.map(tmp19 => "@" + tmp19.id.split("@")[0]).join(", ") + "\n") + ("⬆️ Tour " + currentPlayer2 + " - Difficulté accrue !"),
        mentions: list3.map(tmp20 => tmp20.id)
      });
      await new Promise(tmp21 => setTimeout(tmp21, 3000));
    }
  }
  let url = "";
  if (list3.length === 1) {
    url = "🏆 *VICTOIRE !*\n\n" + ("👑 Vainqueur : @" + list3[0].id.split("@")[0] + "\n") + ("🎯 Score final : " + list3[0].score + " point(s)\n") + ("📈 Tours complétés : " + currentPlayer2 + "\n\n");
  } else if (list3.length === 0) {
    url = "💥 *Fin de Partie - Aucun survivant !*\n\n";
  } else {
    url = "🏁 *Fin de Partie*\n\n";
  }
  url += "📊 *Classement Final :*\n";
  const list5 = [...value.values()].sort((tmp22, tmp23) => tmp23.score - tmp22.score);
  list5.forEach((tmp24, tmp25) => {
    const value20 = tmp25 === 0 ? "🥇" : tmp25 === 1 ? "🥈" : tmp25 === 2 ? "🥉" : "  ";
    url += value20 + " @" + tmp24.id.split("@")[0] + " : " + tmp24.score + " point(s)\n";
  });
  url += "\n🎮 Merci d'avoir joué ! Tapez *dmots* pour rejouer.";
  await sock.sendMessage(chatJid, {
    text: url,
    mentions: [...value.keys()]
  });
});
registerCommand({
  nom_cmd: "wcg",
  classe: "Jeux",
  react: "🎯",
  desc: "Word Chain Game - Survivez en trouvant des mots !"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    auteur_Message,
    isSudo,
    getJid
  } = ctx;
  const value = new Map();
  const timestamp = Date.now();
  const value2 = new Set();
  function tmp(tmp2) {
    return tmp2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "").trim();
  }
  async function tmp3(tmp4) {
    try {
      const value3 = tmp(tmp4);
      const apiUrl = "https://fr.wiktionary.org/wiki/" + encodeURIComponent(value3);
      const value4 = await fetch(apiUrl);
      if (!value4.ok) {
        return false;
      }
      const value5 = await value4.text();
      if (value5.includes("Pas de résultat pour")) {
        return false;
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  value.set(auteur_Message, {
    id: auteur_Message,
    score: 0
  });
  const value6 = auteur_Message || isSudo;
  await sock.sendMessage(chatJid, {
    text: "╔════════════════╗\n  🎮 WORD CHAIN GAME\n╚════════════════╝\n\n📝 Trouvez des mots valides\n🎯 Dernier survivant gagne\n💬 'join' pour rejoindre\n🚀 'start' pour lancer\n🛑 'stop' pour annuler\n\n⏳ Inscription : 60s"
  });
  const list = [45000, 30000, 15000];
  const value7 = new Set();
  let false2 = false;
  let false3 = false;
  const timestamp2 = setInterval(async () => {
    const tmp5 = 60000 - (Date.now() - timestamp);
    if (tmp5 <= 0 || false2 || false3) {
      return clearInterval(timestamp2);
    }
    const value8 = Math.floor(tmp5 / 1000);
    for (let tmp6 of list) {
      if (value8 === tmp6 / 1000 && !value7.has(tmp6)) {
        value7.add(tmp6);
        await sock.sendMessage(chatJid, {
          text: "⏰ Plus que " + tmp6 / 1000 + "s pour rejoindre !"
        });
      }
    }
  }, 1000);
  while (Date.now() - timestamp < 60000 && !false2 && !false3) {
    try {
      const timestamp3 = await sock.recup_msg({
        ms_org: chatJid,
        temps: 60000 - (Date.now() - timestamp)
      });
      const value9 = (timestamp3?.message?.conversation || timestamp3?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
      const value10 = timestamp3?.key?.participant || timestamp3?.key?.remoteJid || timestamp3?.message?.senderKey;
      const value11 = await getJid(value10, chatJid, sock);
      if (value9 === "join" && value11 && !value.has(value11)) {
        value.set(value11, {
          id: value11,
          score: 0
        });
        await sock.sendMessage(chatJid, {
          text: "✅ @" + value11.split("@")[0] + " a rejoint la partie !\n👥 Total : " + value.size + " joueur" + (value.size > 1 ? "s" : ""),
          mentions: [value11]
        });
      } else if (value9 === "start" && value11 === value6) {
        if (value.size < 2) {
          await sock.sendMessage(chatJid, {
            text: "❌ Minimum 2 joueurs requis\n📊 Actuellement : " + value.size
          });
        } else {
          false2 = true;
          clearInterval(timestamp2);
          break;
        }
      } else if (value9 === "stop" && value11 === value6) {
        false3 = true;
        clearInterval(timestamp2);
        await sock.sendMessage(chatJid, {
          text: "🛑 Partie annulée par @" + value11.split("@")[0],
          mentions: [value11]
        });
        return;
      }
    } catch {}
  }
  if (false3) {
    return;
  }
  if (!false2) {
    if (value.size < 2) {
      await repondre("❌ Pas assez de joueurs");
      return;
    }
    false2 = true;
    clearInterval(timestamp2);
  }
  await sock.sendMessage(chatJid, {
    text: "╔═════════════╗\n    🚀 DÉBUT DU JEU\n╚═════════════╝\n\n" + ("👥 Joueurs (" + value.size + ") :\n") + ([...value.values()].map(tmp7 => "  • @" + tmp7.id.split("@")[0]).join("\n") + "\n\n") + "🎯 Bonne chance à tous !",
    mentions: [...value.keys()]
  });
  await new Promise(tmp8 => setTimeout(tmp8, 2000));
  let currentPlayer = 1;
  let list2 = [...value.values()];
  let false4 = false;
  const value12 = tmp9 => {
    if (tmp9 === 1) {
      return [3, 4];
    }
    if (tmp9 === 2) {
      return [4, 5, 6];
    }
    if (tmp9 === 3) {
      return [5, 6, 7];
    }
    if (tmp9 === 4) {
      return [6, 7, 8];
    }
    if (tmp9 === 5) {
      return [7, 8, 9];
    }
    if (tmp9 === 6) {
      return [8, 9, 10];
    }
    if (tmp9 === 7) {
      return [9, 10, 11];
    }
    if (tmp9 === 8) {
      return [10, 11, 12];
    }
    if (tmp9 === 9) {
      return [11, 12, 13];
    }
    if (tmp9 === 10) {
      return [12, 13, 14];
    }
    if (tmp9 === 11) {
      return [13, 14, 15];
    }
    if (tmp9 === 12) {
      return [14, 15, 16];
    }
    if (tmp9 === 13) {
      return [15, 16, 17];
    }
    if (tmp9 === 14) {
      return [16, 17, 18];
    }
    if (tmp9 === 15) {
      return [18, 19, 20];
    }
    if (tmp9 === 16) {
      return [20, 21, 22];
    }
    if (tmp9 === 17) {
      return [22, 23, 24];
    }
    return [25];
  };
  const value13 = tmp10 => {
    if (tmp10 <= 4) {
      return 10000;
    }
    if (tmp10 <= 6) {
      return 15000;
    }
    if (tmp10 <= 8) {
      return 18000;
    }
    if (tmp10 <= 10) {
      return 20000;
    }
    if (tmp10 <= 14) {
      return 25000;
    }
    return 30000;
  };
  while (list2.length > 1 && !false3 && !false4) {
    const list3 = [...list2];
    let currentPlayer2 = 0;
    const value14 = value13(currentPlayer);
    const value15 = Math.floor(value14 / 1000);
    await sock.sendMessage(chatJid, {
      text: "\n━━━━━━━━━━━━━━━\n" + ("   🎯 TOUR " + currentPlayer + "\n") + "━━━━━━━━━━━━━━━━\n" + ("👥 " + list2.length + " survivant" + (list2.length > 1 ? "s" : "") + "\n") + ("⏱️ " + value15 + "s par mot")
    });
    await new Promise(tmp11 => setTimeout(tmp11, 1500));
    for (const tmp12 of list3) {
      const value16 = value12(currentPlayer);
      const randomValue = value16[Math.floor(Math.random() * value16.length)];
      await sock.sendMessage(chatJid, {
        text: "┌────── TOUR ─────┐\n" + ("│ @" + tmp12.id.split("@")[0] + "\n") + ("│ Longueur : " + randomValue + " lettres\n") + "└───────────────┘\n" + ("⏰ " + value15 + " secondes !"),
        mentions: [tmp12.id]
      });
      let false5 = false;
      let currentPlayer3 = 3;
      while (currentPlayer3 > 0 && !false5) {
        try {
          const replyMsg = await sock.recup_msg({
            ms_org: chatJid,
            auteur: tmp12.id,
            temps: value14
          });
          const value17 = (replyMsg?.message?.conversation || replyMsg?.message?.extendedTextMessage?.text || "").trim();
          const value18 = await getJid(replyMsg?.key?.participant || replyMsg?.key?.remoteJid || replyMsg?.message?.senderKey, chatJid, sock);
          if (value18 !== tmp12.id) {
            throw new Error("Mauvais joueur");
          }
          if (!value17 || value17 === "") {
            currentPlayer3--;
            if (currentPlayer3 > 0) {
              await sock.sendMessage(chatJid, {
                text: "⚠️ @" + tmp12.id.split("@")[0] + ", envoyez un MESSAGE TEXTE svp !\n⏰ " + currentPlayer3 + " tentative" + (currentPlayer3 > 1 ? "s" : "") + " restante" + (currentPlayer3 > 1 ? "s" : ""),
                mentions: [tmp12.id]
              });
              continue;
            } else {
              await sock.sendMessage(chatJid, {
                text: "❌ Éliminé : @" + tmp12.id.split("@")[0] + "\nRaison : Aucun message texte envoyé",
                mentions: [tmp12.id]
              });
              break;
            }
          }
          if (value17.toLowerCase() === "stop" && value18 === value6) {
            false3 = true;
            await sock.sendMessage(chatJid, {
              text: "🛑 Partie interrompue"
            });
            return;
          }
          const groupJid = value17;
          if (groupJid.length < randomValue) {
            await sock.sendMessage(chatJid, {
              text: "❌ Éliminé : @" + tmp12.id.split("@")[0] + "\n" + ("Raison : Longueur incorrecte (" + groupJid.length + " < " + randomValue + ")"),
              mentions: [tmp12.id]
            });
            break;
          } else if (value2.has(groupJid.toLowerCase())) {
            await sock.sendMessage(chatJid, {
              text: "❌ Éliminé : @" + tmp12.id.split("@")[0] + "\nRaison : Mot déjà utilisé",
              mentions: [tmp12.id]
            });
            break;
          } else {
            const value19 = await tmp3(groupJid);
            if (value19) {
              value2.add(groupJid.toLowerCase());
              tmp12.score++;
              false5 = true;
              currentPlayer2++;
              if (randomValue === 25) {
                false4 = true;
                await sock.sendMessage(chatJid, {
                  text: "\n🏆🏆🏆 EXPLOIT ! 🏆🏆🏆\n\n" + ("@" + tmp12.id.split("@")[0] + " a trouvé un mot de 25 lettres !\n") + ("Mot : *" + value17.toUpperCase() + "*\n\n") + "🎉 VICTOIRE ABSOLUE !",
                  mentions: [tmp12.id]
                });
                break;
              } else {
                await sock.sendMessage(chatJid, {
                  text: "✅ *" + value17.toUpperCase() + "* validé !"
                });
              }
              break;
            } else {
              await sock.sendMessage(chatJid, {
                text: "❌ Éliminé : @" + tmp12.id.split("@")[0] + "\nRaison : Mot inexistant",
                mentions: [tmp12.id]
              });
              break;
            }
          }
        } catch (tmp13) {
          console.error(tmp13);
          await sock.sendMessage(chatJid, {
            text: "⏰ Temps écoulé : @" + tmp12.id.split("@")[0] + "\nÉliminé !",
            mentions: [tmp12.id]
          });
          break;
        }
      }
      if (!false5) {
        tmp12.elimine = true;
      }
      await new Promise(tmp14 => setTimeout(tmp14, 1000));
    }
    if (false4) {
      break;
    }
    list2 = list2.filter(tmp15 => !tmp15.elimine);
    if (false3) {
      return;
    }
    if (currentPlayer2 === 0) {
      await sock.sendMessage(chatJid, {
        text: "\n💥 Aucun survivant au tour " + currentPlayer + "\nFin de partie !"
      });
      break;
    }
    if (list2.length > 1) {
      currentPlayer++;
      await sock.sendMessage(chatJid, {
        text: "\n✅ Survivants :\n" + (list2.map(tmp16 => "  • @" + tmp16.id.split("@")[0]).join("\n") + "\n\n") + ("⏭️ Passage au tour " + currentPlayer + "..."),
        mentions: list2.map(tmp17 => tmp17.id)
      });
      await new Promise(tmp18 => setTimeout(tmp18, 2500));
    }
  }
  let url = "";
  if (false4) {
    const value20 = list2.filter(tmp19 => !tmp19.elimine);
    if (value20.length === 1) {
      url = "\n╔══════════════════╗\n   🏆 VICTOIRE TOTALE 🏆\n╚══════════════════╝\n\n" + ("👑 Champion ultime : @" + value20[0].id.split("@")[0] + "\n") + ("🎯 Score : " + value20[0].score + " point" + (value20[0].score > 1 ? "s" : "") + "\n") + ("📈 Tours : " + currentPlayer + "\n") + "🏅 Exploit : Mot de 25 lettres !\n\n";
    } else {
      url = "\n╔══════════════════╗\n   🏆 VICTOIRE TOTALE 🏆\n╚══════════════════╝\n\n" + ("👑 Champions : " + value20.map(tmp20 => "@" + tmp20.id.split("@")[0]).join(", ") + "\n") + ("📈 Tours : " + currentPlayer + "\n") + "🏅 Exploit : Mots de 25 lettres !\n\n";
    }
  } else if (list2.length === 1) {
    url = "\n╔══════════════════╗\n     👑 VICTOIRE ! 👑\n╚══════════════════╝\n\n" + ("🏆 Vainqueur : @" + list2[0].id.split("@")[0] + "\n") + ("🎯 Score : " + list2[0].score + " point" + (list2[0].score > 1 ? "s" : "") + "\n") + ("📈 Tours complétés : " + currentPlayer + "\n\n");
  } else {
    url = "\n💥 Fin de partie - Aucun survivant\n\n";
  }
  const list4 = [...value.values()].sort((tmp21, tmp22) => tmp22.score - tmp21.score);
  url += "━━━━━━━━━━━━━━━━━━━\n📊 CLASSEMENT FINAL\n━━━━━━━━━━━━━━━━━━━\n\n";
  list4.forEach((tmp23, tmp24) => {
    const value21 = tmp24 === 0 ? "🥇" : tmp24 === 1 ? "🥈" : tmp24 === 2 ? "🥉" : tmp24 + 1 + ".";
    url += value21 + " @" + tmp23.id.split("@")[0] + " : " + tmp23.score + " point" + (tmp23.score > 1 ? "s" : "") + "\n";
  });
  url += "\n🎮 Tapez 'wcg' pour rejouer !";
  await sock.sendMessage(chatJid, {
    text: url,
    mentions: [...value.keys()]
  });
});