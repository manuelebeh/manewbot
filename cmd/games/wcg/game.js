'use strict';

const { registerCommand } = require('../register');
const {
  isValidFrenchWord,
  getLetterOptions,
  getRoundTimeMs,
} = require('./helpers');

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
  while (list2.length > 1 && !false3 && !false4) {
    const list3 = [...list2];
    let currentPlayer2 = 0;
    const value14 = getRoundTimeMs(currentPlayer);
    const value15 = Math.floor(value14 / 1000);
    await sock.sendMessage(chatJid, {
      text: "\n━━━━━━━━━━━━━━━\n" + ("   🎯 TOUR " + currentPlayer + "\n") + "━━━━━━━━━━━━━━━━\n" + ("👥 " + list2.length + " survivant" + (list2.length > 1 ? "s" : "") + "\n") + ("⏱️ " + value15 + "s par mot")
    });
    await new Promise(tmp11 => setTimeout(tmp11, 1500));
    for (const tmp12 of list3) {
      const value16 = getLetterOptions(currentPlayer);
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
            const value19 = await isValidFrenchWord(groupJid);
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
