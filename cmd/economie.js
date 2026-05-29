const {
  registerCommand
} = require("../lib/commands");
const {
  modifierSolde,
  getInfosUtilisateur,
  resetEconomie,
  mettreAJourCapaciteBanque,
  ECONOMIE,
  TopBanque
} = require("../database/economie");
const crypto = require("crypto");
function generateUserId(jid) {
  const hash = crypto.createHash("md5").update(jid).digest("hex");
  return "User-" + hash.slice(0, 6);
}
function generateTransactionId() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}
registerCommand({
  nom_cmd: "myecon",
  desc: "Afficher votre portefeuille et banque",
  react: "💰",
  classe: "Economie"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    getJid,
    arg,
    auteur_Message,
    auteur_Msg_Repondu,
    repondre
  } = ctx;
  try {
    const targetJid = arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid" || auteur_Msg_Repondu || auteur_Message;
    const resolvedJid = await getJid(targetJid, chatJid, sock);
    if (!resolvedJid) {
      return await repondre("❌ Impossible de trouver l'utilisateur.");
    }
    let profilePic = "https://wallpapercave.com/uwp/uwp4820694.jpeg";
    try {
      profilePic = await sock.profilePictureUrl(resolvedJid, "image");
    } catch {}
    const userInfo = await getInfosUtilisateur(resolvedJid);
    if (!userInfo) {
      return await repondre("⚠️ Aucune information trouvée pour cet utilisateur.");
    }
    const pseudo = userInfo.pseudo || "Inconnu";
    const wallet = userInfo.portefeuille ?? 0;
    const bank = userInfo.banque ?? 0;
    const bankCapacity = userInfo.capacite_banque ?? 10000;
    const userId = generateUserId(resolvedJid);
    const caption = "╭────🎒 *ECONOMIE* 🎒────╮\n┃ 👤 *Pseudo :* " + pseudo + "\n┃ 🆔 *Identifiant :* " + userId + "\n┃ 💼 *Portefeuille :* " + wallet + " 💸\n┃ 🏦 *Banque :* " + bank + " 🪙\n┃ 📈 *Capacité Banque :* " + bankCapacity + " 🧱\n╰─────────────────────╯";
    await sock.sendMessage(chatJid, {
      image: {
        url: profilePic
      },
      caption
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur dans myovl_econ:", err);
    await repondre("❌ Une erreur est survenue lors de la récupération des informations économiques.");
  }
});
registerCommand({
  nom_cmd: "transfer",
  desc: "Transférer de l'argent de votre banque vers la banque d'un autre utilisateur",
  react: "💸",
  classe: "Economie"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    arg,
    auteur_Message,
    repondre,
    getJid
  } = ctx;
  if (arg.length < 2) {
    return repondre("Usage : transfer @utilisateur montant");
  }
  const recipientJid = arg[0].includes("@") ? arg[0].replace("@", "") + "@lid" : null;
  const resolvedRecipient = await getJid(recipientJid, chatJid, sock);
  if (!resolvedRecipient) {
    return repondre("Merci de mentionner un utilisateur valide (@numéro).");
  }
  if (resolvedRecipient === auteur_Message) {
    return repondre("Vous ne pouvez pas vous transférer de l'argent à vous-même.");
  }
  const amount = parseInt(arg[1]);
  if (isNaN(amount) || amount <= 0) {
    return repondre("Le montant doit être un nombre entier positif.");
  }
  try {
    const senderInfo = await getInfosUtilisateur(auteur_Message);
    const recipientInfo = await getInfosUtilisateur(resolvedRecipient);
    if (!senderInfo) {
      return repondre("Profil de l'expéditeur introuvable.");
    }
    if (!recipientInfo) {
      return repondre("Profil du destinataire introuvable.");
    }
    if (senderInfo.banque < amount) {
      return repondre("Fonds insuffisants dans votre banque.");
    }
    const receivedAmount = Math.floor(amount * 0.99);
    if (recipientInfo.banque + receivedAmount > recipientInfo.capacite_banque) {
      return repondre("Ce transfert dépasserait la capacité du destinataire (" + recipientInfo.capacite_banque + " 🪙).");
    }
    await modifierSolde(auteur_Message, "banque", -amount);
    await modifierSolde(resolvedRecipient, "banque", receivedAmount);
    const transactionId = generateTransactionId();
    const receipt = "╭── 💸 *REÇU DE TRANSFERT* 💸 ──╮\n┃ 🔁 *Transfert de banque à banque*\n┃ 🆔 *Transaction ID :* " + transactionId + "\n┃ 👤 *Expéditeur :* " + (senderInfo.pseudo || "Inconnu") + "\n┃ 👥 *Destinataire :* " + (recipientInfo.pseudo || "Inconnu") + "\n┃ 💰 *Montant envoyé :* " + amount + " 🪙\n┃ 📉 *Frais (1%) :* " + (amount - receivedAmount) + " 🪙\n┃ 📥 *Montant reçu :* " + receivedAmount + " 🪙\n┃ 📅 *Date :* " + new Date().toLocaleString() + "\n╰─────────────────────────╯";
    return repondre(receipt);
  } catch (err) {
    console.error("Erreur lors du transfert :", err);
    return repondre("Une erreur est survenue. Réessayez plus tard.");
  }
});
registerCommand({
  nom_cmd: "resetaccount",
  classe: "Economie",
  react: "♻️",
  desc: "Réinitialise le compte économie d'un utilisateur"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    isSudo,
    getJid,
    auteur_Msg_Repondu,
    repondre
  } = ctx;
  if (!isSudo) {
    return repondre("Vous n'avez pas l'autorisation d'exécuter cette commande.");
  }
  const targetJid = arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid" || auteur_Msg_Repondu;
  const resolvedJid = await getJid(targetJid, chatJid, sock);
  if (!resolvedJid) {
    repondre("Veuillez mentionner un utilisateur ou répondre à son message.\nEx: resetaccount @user");
  }
  const resetResult = await resetEconomie(resolvedJid, {
    wallet: true,
    banque: true,
    capacite: true
  });
  if (!resetResult) {
    return repondre("Utilisateur introuvable dans la base de données.");
  }
  const userId = generateUserId(resolvedJid);
  const message = "✅ Le compte économie de l'utilisateur a bien été réinitialisé :\n╭── 💼 *RESET ECONOMIE* ──╮\n┃ 👤 Utilisateur : " + (resetResult.pseudo || "Inconnu") + "\n┃ 🆔 ID : " + userId + "\n┃ 💰 Portefeuille : " + resetResult.portefeuille + " 🪙\n┃ 🏦 Banque : " + resetResult.banque + " 🪙\n┃ 📦 Capacité : " + resetResult.capacite_banque + "\n╰──────────────────────╯";
  await repondre(message);
});
const prixCapacite = {
  1: {
    montant: 10000,
    capacite: 100000
  },
  2: {
    montant: 100000,
    capacite: 1000000
  },
  3: {
    montant: 1000000,
    capacite: 10000000
  },
  4: {
    montant: 10000000,
    capacite: 100000000
  },
  5: {
    montant: 100000000,
    capacite: 1000000000
  }
};
registerCommand({
  nom_cmd: "capacite",
  classe: "Economie",
  react: "📦",
  desc: "Augmenter la capacite de la banque"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    auteur_Message,
    repondre
  } = ctx;
  const level = parseInt(arg[0]);
  if (!level || !prixCapacite[level]) {
    let message = "❌ *Niveau invalide.*\n\n📦 *Niveaux disponibles (Ex: capacite 1):*\n";
    for (const [levelKey, {
      montant,
      capacite
    }] of Object.entries(prixCapacite)) {
      message += "\n🔹 Niveau " + levelKey + " → 💰 " + montant + " 🪙 → 📈 Capacité : " + capacite + " 🪙";
    }
    return repondre(message);
  }
  const userInfo = await getInfosUtilisateur(auteur_Message);
  const {
    portefeuille: wallet
  } = userInfo;
  const {
    montant: cost,
    capacite: newCapacity
  } = prixCapacite[level];
  if (wallet < cost) {
    return repondre("💸 Fonds insuffisants. Il faut *" + cost + " 🪙* dans le portefeuille.");
  }
  await modifierSolde(auteur_Message, "portefeuille", -cost);
  await mettreAJourCapaciteBanque(auteur_Message, newCapacity);
  repondre("✅ *Capacité améliorée au niveau " + level + "*\n📦 *Nouvelle capacité :* " + newCapacity + " 🪙\n💰 *Coût :* " + cost + " 🪙");
});
registerCommand({
  nom_cmd: "depot",
  classe: "Economie",
  react: "🏦",
  desc: "Transférer des fonds du portefeuille vers la banque"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    auteur_Message,
    repondre
  } = ctx;
  const amount = parseInt(arg[0]);
  if (!amount || amount <= 0) {
    return repondre("Veuillez entrer un montant valide à déposer.\nEx: depot 1000");
  }
  const userInfo = await getInfosUtilisateur(auteur_Message);
  const {
    portefeuille: wallet,
    banque: bank,
    capacite_banque: bankCapacity
  } = userInfo;
  if (wallet < amount) {
    return repondre("Fonds insuffisants dans le portefeuille.");
  }
  if (bank + amount > bankCapacity) {
    return repondre("Ce dépôt dépasserait la capacité de votre banque (" + bankCapacity + " 🪙).");
  }
  await modifierSolde(auteur_Message, "portefeuille", -amount);
  await modifierSolde(auteur_Message, "banque", amount);
  repondre("🏦 *Dépôt effectué avec succès !*\n💰 *Montant déposé :* " + amount + " 🪙\n📦 *Banque actuelle :* " + (bank + amount) + " / " + bankCapacity + " 🪙");
});
registerCommand({
  nom_cmd: "retrait",
  classe: "Economie",
  react: "💼",
  desc: "Transférer des fonds de la banque vers le portefeuille"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    auteur_Message,
    repondre
  } = ctx;
  const amount = parseInt(arg[0]);
  if (!amount || amount <= 0) {
    return repondre("Veuillez entrer un montant valide à retirer.\nEx: retrait 1000");
  }
  const userInfo = await getInfosUtilisateur(auteur_Message);
  const {
    portefeuille: wallet,
    banque: bank
  } = userInfo;
  if (bank < amount) {
    return repondre("Fonds insuffisants dans la banque.");
  }
  const receivedAmount = Math.floor(amount * 0.99);
  const fee = amount - receivedAmount;
  await modifierSolde(auteur_Message, "banque", -amount);
  await modifierSolde(auteur_Message, "portefeuille", receivedAmount);
  repondre("💼 *Retrait effectué avec succès !*\n💰 *Montant demandé :* " + amount + " 🪙\n📉 *Frais (1%) :* " + fee + " 🪙\n💵 *Montant reçu :* " + receivedAmount + " 🪙\n👛 *Portefeuille actuel :* " + (wallet + receivedAmount) + " 🪙");
});
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
  const directionImages = {
    haut: "https://files.catbox.moe/j0wmsd.jpg",
    bas: "https://files.catbox.moe/qizuxk.jpg",
    gauche: "https://files.catbox.moe/lj7xmc.jpg",
    droite: "https://files.catbox.moe/dsfbhl.jpg"
  };
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
registerCommand({
  nom_cmd: "don",
  classe: "Economie",
  react: "🤝",
  desc: "Permet à un utilisateur sudo de donner des pièces à un autre utilisateur"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    auteur_Message,
    getJid,
    auteur_Msg_Repondu,
    ms,
    repondre,
    isSudo
  } = ctx;
  await getInfosUtilisateur(auteur_Message);
  if (!isSudo) {
    return repondre("Cette commande est réservée aux utilisateurs sudo.");
  }
  let recipientJid = null;
  if (auteur_Msg_Repondu) {
    recipientJid = auteur_Msg_Repondu;
  } else if (arg[0]?.includes("@")) {
    const destinatairl = arg[0].replace("@", "") + "@lid";
    recipientJid = await getJid(destinatairl, chatJid, sock);
  }
  if (!recipientJid) {
    return repondre("Mentionne un utilisateur *ou* réponds à son message pour lui faire un don.");
  }
  const amount = parseInt(auteur_Msg_Repondu ? arg[0] : arg[1]);
  if (!amount || amount <= 0) {
    return repondre("Montant invalide.");
  }
  const maxDonation = 50000;
  if (amount > maxDonation) {
    return repondre("Tu ne peux pas donner plus de *" + maxDonation + " pièces*.");
  }
  const recipientRecord = await ECONOMIE.findOne({
    where: {
      id: recipientJid
    }
  });
  if (!recipientRecord) {
    return repondre("L'utilisateur mentionné n'est pas enregistré dans le système.");
  }
  await modifierSolde(recipientJid, "portefeuille", amount);
  await sock.sendMessage(chatJid, {
    text: "✅ Tu as donné *" + amount + " pièces* à @" + recipientJid.split("@")[0] + " 💸",
    mentions: [recipientJid]
  }, {
    quoted: ms
  });
});
