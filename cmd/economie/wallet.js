'use strict';

const { registerCommand } = require('./register');
const { getInfosUtilisateur, modifierSolde, resetEconomie, generateUserId, generateTransactionId, TopBanque, config } = require('./deps');

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
    let profilePic = config.ECONOMY_PROFILE_FALLBACK_URL;
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
