'use strict';

const {
  registerCommand,
  getInfosUtilisateur,
  modifierSolde,
  mettreAJourCapaciteBanque,
  prixCapacite,
} = require('./_shared');

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
