'use strict';

const { registerCommand } = require('./register');
const { delay, fs } = require('./deps');

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
