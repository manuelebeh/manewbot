'use strict';

const {
  registerCommand,
  fs,
} = require('./_shared');

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
