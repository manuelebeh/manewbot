'use strict';

const {
  registerCommand,
  axios,
  config,
  fs,
  activeGames,
} = require('./_shared');

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
