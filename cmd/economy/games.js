'use strict';

const { registerCommand } = require('./register');
const { getInfosUtilisateur, modifierSolde, ECONOMIE, config } = require('./deps');
const { getCardPariImages } = require('../../lib/api-bases');

registerCommand({
  nom_cmd: "vol",
  desc: "Tenter de voler un autre utilisateur",
  react: "🕶️",
  classe: "Economie"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    auteur_Msg_Repondu,
    getJid,
    auteur_Message,
    arg,
    ms
  } = ctx;
  let victimJid = null;
  if (auteur_Msg_Repondu) {
    victimJid = auteur_Msg_Repondu;
  } else if (arg[0]?.includes("@")) {
    const victimeIdl = arg[0].replace("@", "") + "@lid";
    victimJid = await getJid(victimeIdl, chatJid, sock);
  }
  if (!victimJid) {
    return repondre("Mentionne un utilisateur valide ou réponds à son message.\nEx : *vol @user* ou *vol* en réponse à un message.");
  }
  if (victimJid === auteur_Message) {
    return repondre("Tu ne peux pas te voler toi-même, voleur paresseux 😒.");
  }
  const thiefInfo = await getInfosUtilisateur(auteur_Message);
  const victimInfo = await getInfosUtilisateur(victimJid);
  if (!thiefInfo || !victimInfo) {
    return repondre("Impossible de trouver les profils des utilisateurs.");
  }
  if (thiefInfo.portefeuille < 1000) {
    return repondre("💸 Tu dois avoir au moins 1000 🪙 pour tenter un vol (au cas où tu te fais attraper).");
  }
  if (victimInfo.portefeuille < 1000) {
    return repondre("🤷🏽‍♂️ Ta victime est trop pauvre... Trouve-toi une meilleure cible.");
  }
  const outcomes = ["echoue", "reussi", "attrape"];
  const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
  switch (outcome) {
    case "echoue":
      return repondre("😬 Ta victime s'est échappée ! Sois plus intimidant la prochaine fois.");
    case "reussi":
      {
        const stolenAmount = Math.floor(Math.random() * 1000) + 100;
        await modifierSolde(victimJid, "portefeuille", -stolenAmount);
        await modifierSolde(auteur_Message, "portefeuille", stolenAmount);
        return repondre("🤑 Vol réussi ! Tu as volé *" + stolenAmount + " 🪙* à ta victime.");
      }
    case "attrape":
      {
        const fine = Math.floor(Math.random() * 1000) + 100;
        await modifierSolde(auteur_Message, "portefeuille", -fine);
        return repondre("🚓 Oups ! Tu t'es fait attraper par la police. Amende : *" + fine + " 🪙*.");
      }
    default:
      return repondre("Une erreur est survenue. Essaie encore.");
  }
});
registerCommand({
  nom_cmd: "pari",
  desc: "Parier de l'argent en devinant une direction",
  react: "🎲",
  classe: "Economie"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    auteur_Message,
    arg,
    ms
  } = ctx;
  const betAmount = parseInt(arg[0]);
  const guess = arg[1]?.toLowerCase();
  const directions = ["haut", "bas", "gauche", "droite"];
  if (!betAmount || betAmount < 50) {
    return repondre("Tu dois miser au moins 50 🪙.");
  }
  if (!guess || !directions.includes(guess)) {
    return repondre("🧭 Choisis une direction valide : *haut, bas, gauche ou droite*.\nExemple : `pari 200 gauche`");
  }
  const userInfo = await getInfosUtilisateur(auteur_Message);
  if (userInfo.portefeuille < betAmount) {
    return repondre("💸 Fonds insuffisants dans ton portefeuille.");
  }
  const correctDirection = directions[Math.floor(Math.random() * directions.length)];
  const directionImages = getCardPariImages();
  await sock.sendMessage(chatJid, {
    image: {
      url: directionImages[correctDirection]
    },
    caption: ""
  }, {
    quoted: ms
  });
  if (guess === correctDirection) {
    const winnings = betAmount * 2;
    await modifierSolde(auteur_Message, "portefeuille", winnings);
    return repondre("🎉 *Bravo !* La direction était *" + correctDirection + "*.\n✅ Tu gagnes *" + winnings + " 🪙* !");
  } else {
    await modifierSolde(auteur_Message, "portefeuille", -betAmount);
    return repondre("😓 *Raté !* La direction correcte était *" + correctDirection + "*.\n❌ Tu perds *" + betAmount + " 🪙*.");
  }
});
registerCommand({
  nom_cmd: "slot",
  desc: "Jouer à la machine à sous",
  react: "🎰",
  classe: "Economie"
}, async (chatJid, sock, ctx) => {
  const {
    auteur_Message,
    repondre
  } = ctx;
  const {
    portefeuille: wallet
  } = await getInfosUtilisateur(auteur_Message);
  if (wallet < 100) {
    return repondre("💰 Tu as besoin d'au moins 100 🪙 pour jouer.");
  }
  const symbols = ["🔴", "🔵", "🟣", "🟢", "🟡", "⚪️", "⚫️"];
  const symbolIndexes = Array.from({
    length: 3
  }, () => Array.from({
    length: 3
  }, () => Math.floor(Math.random() * symbols.length)));
  const grid = symbolIndexes.map(row => row.map(index => symbols[index]));
  const display = grid.map(row => row.join("   ")).join("\n");
  const isLine = (a, b, c) => a === b && b === c;
  const isJackpot = isLine(grid[0][0], grid[0][1], grid[0][2]) || isLine(grid[1][0], grid[1][1], grid[1][2]) || isLine(grid[2][0], grid[2][1], grid[2][2]) || isLine(grid[0][0], grid[1][0], grid[2][0]) || isLine(grid[0][1], grid[1][1], grid[2][1]) || isLine(grid[0][2], grid[1][2], grid[2][2]) || isLine(grid[0][0], grid[1][1], grid[2][2]) || isLine(grid[0][2], grid[1][1], grid[2][0]);
  if (isJackpot) {
    const winnings = Math.floor(Math.random() * 5000);
    await modifierSolde(auteur_Message, "portefeuille", winnings * 2);
    return repondre("🎰 *Résultat*\n" + display + "\n\n🎉 *Jackpot ! Tu gagnes " + winnings * 2 + " 🪙*");
  } else {
    const loss = Math.floor(Math.random() * 300);
    await modifierSolde(auteur_Message, "portefeuille", -loss);
    return repondre("🎰 *Résultat*\n" + display + "\n\n📉 *Tu perds " + loss + " 🪙...*");
  }
});
registerCommand({
  nom_cmd: "bonus",
  classe: "Economie",
  react: "🎁",
  desc: "Réclame un bonus toutes les 2 heures"
}, async (chatJid, sock, ctx) => {
  const {
    auteur_Message,
    repondre
  } = ctx;
  const economyRecord = await ECONOMIE.findOne({
    where: {
      id: auteur_Message
    }
  });
  const userInfo = await getInfosUtilisateur(auteur_Message);
  const now = Date.now();
  const cooldown = 7200000;
  if (!userInfo.last_bonus) {
    userInfo.last_bonus = 0;
  }
  const elapsed = now - userInfo.last_bonus;
  if (elapsed < cooldown) {
    const remaining = cooldown - elapsed;
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor(remaining % 3600000 / 60000);
    const seconds = Math.floor(remaining % 60000 / 1000);
    let waitMessage = "⏳ Tu dois attendre encore ";
    if (hours > 0) {
      waitMessage += hours + " h ";
    }
    if (minutes > 0) {
      waitMessage += minutes + " min ";
    }
    if (seconds > 0 || hours === 0 && minutes === 0) {
      waitMessage += seconds + " sec";
    }
    return repondre(waitMessage.trim() + " avant de réclamer ton prochain bonus.");
  }
  await modifierSolde(auteur_Message, "portefeuille", 1000);
  economyRecord.last_bonus = now;
  await economyRecord.save();
  repondre("🎉 Tu as reçu *1000 pièces* ! Reviens dans 2h pour un autre bonus.");
});
