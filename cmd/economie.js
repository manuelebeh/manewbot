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
function generateUserId(_0xc3143) {
  const _0x45e2b1 = crypto.createHash("md5").update(_0xc3143).digest("hex");
  return "User-" + _0x45e2b1.slice(0, 6);
}
function generateTransactionId() {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}
registerCommand({
  nom_cmd: "myecon",
  desc: "Afficher votre portefeuille et banque",
  react: "💰",
  classe: "Economie"
}, async (_0x144fc7, _0x41ebbe, {
  ms: _0x39f90d,
  getJid: _0x522bb1,
  arg: _0x3dcece,
  auteur_Message: _0x19498e,
  auteur_Msg_Repondu: _0x2a1341,
  repondre: _0x4ee7ca
}) => {
  try {
    const _0x2eab11 = _0x3dcece[0]?.includes("@") && _0x3dcece[0].replace("@", "") + "@lid" || _0x2a1341 || _0x19498e;
    const _0x5939b0 = await _0x522bb1(_0x2eab11, _0x144fc7, _0x41ebbe);
    if (!_0x5939b0) {
      return await _0x4ee7ca("❌ Impossible de trouver l'utilisateur.");
    }
    let _0x5a5fa9 = "https://wallpapercave.com/uwp/uwp4820694.jpeg";
    try {
      _0x5a5fa9 = await _0x41ebbe.profilePictureUrl(_0x5939b0, "image");
    } catch {}
    const _0x43ccc2 = await getInfosUtilisateur(_0x5939b0);
    if (!_0x43ccc2) {
      return await _0x4ee7ca("⚠️ Aucune information trouvée pour cet utilisateur.");
    }
    const _0x16e2f8 = _0x43ccc2.pseudo || "Inconnu";
    const _0x856d4c = _0x43ccc2.portefeuille ?? 0;
    const _0xd5b9c3 = _0x43ccc2.banque ?? 0;
    const _0x3139ab = _0x43ccc2.capacite_banque ?? 10000;
    const _0x26696b = generateUserId(_0x5939b0);
    const _0x4dc3c4 = "╭────🎒 *ECONOMIE* 🎒────╮\n┃ 👤 *Pseudo :* " + _0x16e2f8 + "\n┃ 🆔 *Identifiant :* " + _0x26696b + "\n┃ 💼 *Portefeuille :* " + _0x856d4c + " 💸\n┃ 🏦 *Banque :* " + _0xd5b9c3 + " 🪙\n┃ 📈 *Capacité Banque :* " + _0x3139ab + " 🧱\n╰─────────────────────╯";
    await _0x41ebbe.sendMessage(_0x144fc7, {
      image: {
        url: _0x5a5fa9
      },
      caption: _0x4dc3c4
    }, {
      quoted: _0x39f90d
    });
  } catch (_0x517326) {
    console.error("Erreur dans myovl_econ:", _0x517326);
    await _0x4ee7ca("❌ Une erreur est survenue lors de la récupération des informations économiques.");
  }
});
registerCommand({
  nom_cmd: "transfer",
  desc: "Transférer de l'argent de votre banque vers la banque d'un autre utilisateur",
  react: "💸",
  classe: "Economie"
}, async (_0x3050ba, _0x3002cf, _0x29a911) => {
  const {
    ms: _0x3ea541,
    arg: _0x5878ce,
    auteur_Message: _0x214a43,
    repondre: _0x3471a0,
    getJid: _0x581d7a
  } = _0x29a911;
  if (_0x5878ce.length < 2) {
    return _0x3471a0("Usage : transfer @utilisateur montant");
  }
  const _0x52864c = _0x5878ce[0].includes("@") ? _0x5878ce[0].replace("@", "") + "@lid" : null;
  const _0x1f0456 = await _0x581d7a(_0x52864c, _0x3050ba, _0x3002cf);
  if (!_0x1f0456) {
    return _0x3471a0("Merci de mentionner un utilisateur valide (@numéro).");
  }
  if (_0x1f0456 === _0x214a43) {
    return _0x3471a0("Vous ne pouvez pas vous transférer de l'argent à vous-même.");
  }
  const _0x50226e = parseInt(_0x5878ce[1]);
  if (isNaN(_0x50226e) || _0x50226e <= 0) {
    return _0x3471a0("Le montant doit être un nombre entier positif.");
  }
  try {
    const _0x10d179 = await getInfosUtilisateur(_0x214a43);
    const _0x58a33d = await getInfosUtilisateur(_0x1f0456);
    if (!_0x10d179) {
      return _0x3471a0("Profil de l'expéditeur introuvable.");
    }
    if (!_0x58a33d) {
      return _0x3471a0("Profil du destinataire introuvable.");
    }
    if (_0x10d179.banque < _0x50226e) {
      return _0x3471a0("Fonds insuffisants dans votre banque.");
    }
    const _0x2e96bf = Math.floor(_0x50226e * 0.99);
    if (_0x58a33d.banque + _0x2e96bf > _0x58a33d.capacite_banque) {
      return _0x3471a0("Ce transfert dépasserait la capacité du destinataire (" + _0x58a33d.capacite_banque + " 🪙).");
    }
    await modifierSolde(_0x214a43, "banque", -_0x50226e);
    await modifierSolde(_0x1f0456, "banque", _0x2e96bf);
    const _0xc3bd74 = generateTransactionId();
    const _0x4a6596 = "╭── 💸 *REÇU DE TRANSFERT* 💸 ──╮\n┃ 🔁 *Transfert de banque à banque*\n┃ 🆔 *Transaction ID :* " + _0xc3bd74 + "\n┃ 👤 *Expéditeur :* " + (_0x10d179.pseudo || "Inconnu") + "\n┃ 👥 *Destinataire :* " + (_0x58a33d.pseudo || "Inconnu") + "\n┃ 💰 *Montant envoyé :* " + _0x50226e + " 🪙\n┃ 📉 *Frais (1%) :* " + (_0x50226e - _0x2e96bf) + " 🪙\n┃ 📥 *Montant reçu :* " + _0x2e96bf + " 🪙\n┃ 📅 *Date :* " + new Date().toLocaleString() + "\n╰─────────────────────────╯";
    return _0x3471a0(_0x4a6596);
  } catch (_0x52ce83) {
    console.error("Erreur lors du transfert :", _0x52ce83);
    return _0x3471a0("Une erreur est survenue. Réessayez plus tard.");
  }
});
registerCommand({
  nom_cmd: "resetaccount",
  classe: "Economie",
  react: "♻️",
  desc: "Réinitialise le compte économie d'un utilisateur"
}, async (_0x5a73b1, _0x5143c5, {
  arg: _0x72eefe,
  isSudo: _0x53d55e,
  getJid: _0x307898,
  auteur_Msg_Repondu: _0x261722
}) => {
  if (!_0x53d55e) {
    return repondre("Vous n'avez pas l'autorisation d'exécuter cette commande.");
  }
  const _0xdc98e6 = _0x72eefe[0]?.includes("@") && _0x72eefe[0].replace("@", "") + "@lid" || _0x261722;
  const _0x5965f9 = await _0x307898(_0xdc98e6, _0x5a73b1, _0x5143c5);
  if (!_0x5965f9) {
    repondre("Veuillez mentionner un utilisateur ou répondre à son message.\nEx: resetaccount @user");
  }
  const _0x53f36d = await resetEconomie(_0x5965f9, {
    wallet: true,
    banque: true,
    capacite: true
  });
  if (!_0x53f36d) {
    return repondre("Utilisateur introuvable dans la base de données.");
  }
  const _0x5f5530 = generateUserId(_0x5965f9);
  const _0x9c2434 = "✅ Le compte économie de l'utilisateur a bien été réinitialisé :\n╭── 💼 *RESET ECONOMIE* ──╮\n┃ 👤 Utilisateur : " + (_0x53f36d.pseudo || "Inconnu") + "\n┃ 🆔 ID : " + _0x5f5530 + "\n┃ 💰 Portefeuille : " + _0x53f36d.portefeuille + " 🪙\n┃ 🏦 Banque : " + _0x53f36d.banque + " 🪙\n┃ 📦 Capacité : " + _0x53f36d.capacite_banque + "\n╰──────────────────────╯";
  await repondre(_0x9c2434);
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
}, async (_0x2e2ec2, _0x327f31, {
  arg: _0x514c94,
  auteur_Message: _0x4e4dab,
  repondre: _0x4dcb4a
}) => {
  const _0x30b65c = parseInt(_0x514c94[0]);
  if (!_0x30b65c || !prixCapacite[_0x30b65c]) {
    let _0x28938c = "❌ *Niveau invalide.*\n\n📦 *Niveaux disponibles (Ex: capacite 1):*\n";
    for (const [_0x248aaf, {
      montant: _0xabfe6c,
      capacite: _0x7c12
    }] of Object.entries(prixCapacite)) {
      _0x28938c += "\n🔹 Niveau " + _0x248aaf + " → 💰 " + _0xabfe6c + " 🪙 → 📈 Capacité : " + _0x7c12 + " 🪙";
    }
    return _0x4dcb4a(_0x28938c);
  }
  const _0x10bb36 = await getInfosUtilisateur(_0x4e4dab);
  const {
    portefeuille: _0x125246
  } = _0x10bb36;
  const {
    montant: _0x4d3203,
    capacite: _0x800603
  } = prixCapacite[_0x30b65c];
  if (_0x125246 < _0x4d3203) {
    return _0x4dcb4a("💸 Fonds insuffisants. Il faut *" + _0x4d3203 + " 🪙* dans le portefeuille.");
  }
  await modifierSolde(_0x4e4dab, "portefeuille", -_0x4d3203);
  await mettreAJourCapaciteBanque(_0x4e4dab, _0x800603);
  _0x4dcb4a("✅ *Capacité améliorée au niveau " + _0x30b65c + "*\n📦 *Nouvelle capacité :* " + _0x800603 + " 🪙\n💰 *Coût :* " + _0x4d3203 + " 🪙");
});
registerCommand({
  nom_cmd: "depot",
  classe: "Economie",
  react: "🏦",
  desc: "Transférer des fonds du portefeuille vers la banque"
}, async (_0x5bfd96, _0xd44b9e, {
  arg: _0x2f63de,
  auteur_Message: _0x2b4df5,
  repondre: _0x176239
}) => {
  const _0x36327c = parseInt(_0x2f63de[0]);
  if (!_0x36327c || _0x36327c <= 0) {
    return _0x176239("Veuillez entrer un montant valide à déposer.\nEx: depot 1000");
  }
  const _0x436099 = await getInfosUtilisateur(_0x2b4df5);
  const {
    portefeuille: _0x217fd1,
    banque: _0x4b8901,
    capacite_banque: _0x318a4b
  } = _0x436099;
  if (_0x217fd1 < _0x36327c) {
    return _0x176239("Fonds insuffisants dans le portefeuille.");
  }
  if (_0x4b8901 + _0x36327c > _0x318a4b) {
    return _0x176239("Ce dépôt dépasserait la capacité de votre banque (" + _0x318a4b + " 🪙).");
  }
  await modifierSolde(_0x2b4df5, "portefeuille", -_0x36327c);
  await modifierSolde(_0x2b4df5, "banque", _0x36327c);
  _0x176239("🏦 *Dépôt effectué avec succès !*\n💰 *Montant déposé :* " + _0x36327c + " 🪙\n📦 *Banque actuelle :* " + (_0x4b8901 + _0x36327c) + " / " + _0x318a4b + " 🪙");
});
registerCommand({
  nom_cmd: "retrait",
  classe: "Economie",
  react: "💼",
  desc: "Transférer des fonds de la banque vers le portefeuille"
}, async (_0x44b994, _0x4f49f9, {
  arg: _0x37e70a,
  auteur_Message: _0x1f7b8e,
  repondre: _0xd56dc2
}) => {
  const _0x4dbc84 = parseInt(_0x37e70a[0]);
  if (!_0x4dbc84 || _0x4dbc84 <= 0) {
    return _0xd56dc2("Veuillez entrer un montant valide à retirer.\nEx: retrait 1000");
  }
  const _0x2285dd = await getInfosUtilisateur(_0x1f7b8e);
  const {
    portefeuille: _0x231f8f,
    banque: _0x178574
  } = _0x2285dd;
  if (_0x178574 < _0x4dbc84) {
    return _0xd56dc2("Fonds insuffisants dans la banque.");
  }
  const _0x1bcc67 = Math.floor(_0x4dbc84 * 0.99);
  const _0x1d00b2 = _0x4dbc84 - _0x1bcc67;
  await modifierSolde(_0x1f7b8e, "banque", -_0x4dbc84);
  await modifierSolde(_0x1f7b8e, "portefeuille", _0x1bcc67);
  _0xd56dc2("💼 *Retrait effectué avec succès !*\n💰 *Montant demandé :* " + _0x4dbc84 + " 🪙\n📉 *Frais (1%) :* " + _0x1d00b2 + " 🪙\n💵 *Montant reçu :* " + _0x1bcc67 + " 🪙\n👛 *Portefeuille actuel :* " + (_0x231f8f + _0x1bcc67) + " 🪙");
});
registerCommand({
  nom_cmd: "vol",
  desc: "Tenter de voler un autre utilisateur",
  react: "🕶️",
  classe: "Economie"
}, async (_0x44a40a, _0x259198, {
  repondre: _0x4e5ed8,
  auteur_Msg_Repondu: _0x11c5b6,
  getJid: _0x1eba4f,
  auteur_Message: _0x24b06e,
  arg: _0x5b404a,
  ms: _0x591417
}) => {
  let _0x57e373 = null;
  if (_0x11c5b6) {
    _0x57e373 = _0x11c5b6;
  } else if (_0x5b404a[0]?.includes("@")) {
    victimeIdl = _0x5b404a[0].replace("@", "") + "@lid";
    _0x57e373 = await _0x1eba4f(victimeIdl, _0x44a40a, _0x259198);
  }
  if (!_0x57e373) {
    return _0x4e5ed8("Mentionne un utilisateur valide ou réponds à son message.\nEx : *vol @user* ou *vol* en réponse à un message.");
  }
  if (_0x57e373 === _0x24b06e) {
    return _0x4e5ed8("Tu ne peux pas te voler toi-même, voleur paresseux 😒.");
  }
  const _0x17120e = await getInfosUtilisateur(_0x24b06e);
  const _0x1f1261 = await getInfosUtilisateur(_0x57e373);
  if (!_0x17120e || !_0x1f1261) {
    return _0x4e5ed8("Impossible de trouver les profils des utilisateurs.");
  }
  if (_0x17120e.portefeuille < 1000) {
    return _0x4e5ed8("💸 Tu dois avoir au moins 1000 🪙 pour tenter un vol (au cas où tu te fais attraper).");
  }
  if (_0x1f1261.portefeuille < 1000) {
    return _0x4e5ed8("🤷🏽‍♂️ Ta victime est trop pauvre... Trouve-toi une meilleure cible.");
  }
  const _0x328da8 = ["echoue", "reussi", "attrape"];
  const _0x4e8a1e = _0x328da8[Math.floor(Math.random() * _0x328da8.length)];
  switch (_0x4e8a1e) {
    case "echoue":
      return _0x4e5ed8("😬 Ta victime s'est échappée ! Sois plus intimidant la prochaine fois.");
    case "reussi":
      {
        const _0x3c0d2d = Math.floor(Math.random() * 1000) + 100;
        await modifierSolde(_0x57e373, "portefeuille", -_0x3c0d2d);
        await modifierSolde(_0x24b06e, "portefeuille", _0x3c0d2d);
        return _0x4e5ed8("🤑 Vol réussi ! Tu as volé *" + _0x3c0d2d + " 🪙* à ta victime.");
      }
    case "attrape":
      {
        const _0x5f2ea6 = Math.floor(Math.random() * 1000) + 100;
        await modifierSolde(_0x24b06e, "portefeuille", -_0x5f2ea6);
        return _0x4e5ed8("🚓 Oups ! Tu t'es fait attraper par la police. Amende : *" + _0x5f2ea6 + " 🪙*.");
      }
    default:
      return _0x4e5ed8("Une erreur est survenue. Essaie encore.");
  }
});
registerCommand({
  nom_cmd: "pari",
  desc: "Parier de l'argent en devinant une direction",
  react: "🎲",
  classe: "Economie"
}, async (_0x4cf90b, _0x22c0c4, {
  repondre: _0x3d3bb8,
  auteur_Message: _0x8e9bee,
  arg: _0x37de94,
  ms: _0x233d52
}) => {
  const _0xb4a9af = parseInt(_0x37de94[0]);
  const _0x445c29 = _0x37de94[1]?.toLowerCase();
  const _0x5def36 = ["haut", "bas", "gauche", "droite"];
  if (!_0xb4a9af || _0xb4a9af < 50) {
    return _0x3d3bb8("Tu dois miser au moins 50 🪙.");
  }
  if (!_0x445c29 || !_0x5def36.includes(_0x445c29)) {
    return _0x3d3bb8("🧭 Choisis une direction valide : *haut, bas, gauche ou droite*.\nExemple : `pari 200 gauche`");
  }
  const _0x23ee94 = await getInfosUtilisateur(_0x8e9bee);
  if (_0x23ee94.portefeuille < _0xb4a9af) {
    return _0x3d3bb8("💸 Fonds insuffisants dans ton portefeuille.");
  }
  const _0x1c501f = _0x5def36[Math.floor(Math.random() * _0x5def36.length)];
  const _0x2e58e9 = _0x1c501f;
  const _0x16820f = {
    haut: "https://files.catbox.moe/j0wmsd.jpg",
    bas: "https://files.catbox.moe/qizuxk.jpg",
    gauche: "https://files.catbox.moe/lj7xmc.jpg",
    droite: "https://files.catbox.moe/dsfbhl.jpg"
  };
  await _0x22c0c4.sendMessage(_0x4cf90b, {
    image: {
      url: _0x16820f[_0x2e58e9]
    },
    caption: ""
  }, {
    quoted: _0x233d52
  });
  if (_0x445c29 === _0x1c501f) {
    const _0x2ad5d8 = _0xb4a9af * 2;
    await modifierSolde(_0x8e9bee, "portefeuille", _0x2ad5d8);
    return _0x3d3bb8("🎉 *Bravo !* La direction était *" + _0x1c501f + "*.\n✅ Tu gagnes *" + _0x2ad5d8 + " 🪙* !");
  } else {
    await modifierSolde(_0x8e9bee, "portefeuille", -_0xb4a9af);
    return _0x3d3bb8("😓 *Raté !* La direction correcte était *" + _0x1c501f + "*.\n❌ Tu perds *" + _0xb4a9af + " 🪙*.");
  }
});
registerCommand({
  nom_cmd: "slot",
  desc: "Jouer à la machine à sous",
  react: "🎰",
  classe: "Economie"
}, async (_0x5ecad3, _0x3fc2f2, {
  auteur_Message: _0x198b9a,
  repondre: _0x43e2cf
}) => {
  const {
    portefeuille: _0x5b88db
  } = await getInfosUtilisateur(_0x198b9a);
  if (_0x5b88db < 100) {
    return _0x43e2cf("💰 Tu as besoin d'au moins 100 🪙 pour jouer.");
  }
  const _0x462566 = ["🔴", "🔵", "🟣", "🟢", "🟡", "⚪️", "⚫️"];
  const _0x3f6da8 = Array.from({
    length: 3
  }, () => Array.from({
    length: 3
  }, () => Math.floor(Math.random() * _0x462566.length)));
  const _0x15f910 = _0x3f6da8.map(_0x2390f6 => _0x2390f6.map(_0x563016 => _0x462566[_0x563016]));
  const _0x11f080 = _0x15f910.map(_0x1129b9 => _0x1129b9.join("   ")).join("\n");
  const _0x536864 = (_0x504d9e, _0x3a9169, _0x39a1c8) => _0x504d9e === _0x3a9169 && _0x3a9169 === _0x39a1c8;
  const _0x54d8d6 = _0x536864(_0x15f910[0][0], _0x15f910[0][1], _0x15f910[0][2]) || _0x536864(_0x15f910[1][0], _0x15f910[1][1], _0x15f910[1][2]) || _0x536864(_0x15f910[2][0], _0x15f910[2][1], _0x15f910[2][2]) || _0x536864(_0x15f910[0][0], _0x15f910[1][0], _0x15f910[2][0]) || _0x536864(_0x15f910[0][1], _0x15f910[1][1], _0x15f910[2][1]) || _0x536864(_0x15f910[0][2], _0x15f910[1][2], _0x15f910[2][2]) || _0x536864(_0x15f910[0][0], _0x15f910[1][1], _0x15f910[2][2]) || _0x536864(_0x15f910[0][2], _0x15f910[1][1], _0x15f910[2][0]);
  if (_0x54d8d6) {
    const _0x42c61a = Math.floor(Math.random() * 5000);
    await modifierSolde(_0x198b9a, "portefeuille", _0x42c61a * 2);
    return _0x43e2cf("🎰 *Résultat*\n" + _0x11f080 + "\n\n🎉 *Jackpot ! Tu gagnes " + _0x42c61a * 2 + " 🪙*");
  } else {
    const _0x3b3e5e = Math.floor(Math.random() * 300);
    await modifierSolde(_0x198b9a, "portefeuille", -_0x3b3e5e);
    return _0x43e2cf("🎰 *Résultat*\n" + _0x11f080 + "\n\n📉 *Tu perds " + _0x3b3e5e + " 🪙...*");
  }
});
registerCommand({
  nom_cmd: "bonus",
  classe: "Economie",
  react: "🎁",
  desc: "Réclame un bonus toutes les 2 heures"
}, async (_0x54fa1f, _0x5cdf68, {
  auteur_Message: _0x463125,
  repondre: _0x13d1b6
}) => {
  const _0x123433 = await ECONOMIE.findOne({
    where: {
      id: _0x463125
    }
  });
  const _0x459f2f = await getInfosUtilisateur(_0x463125);
  const _0x18703b = Date.now();
  const _0x1c1f39 = 7200000;
  if (!_0x459f2f.last_bonus) {
    _0x459f2f.last_bonus = 0;
  }
  const _0x515a41 = _0x18703b - _0x459f2f.last_bonus;
  if (_0x515a41 < _0x1c1f39) {
    const _0x44a5cc = _0x1c1f39 - _0x515a41;
    const _0x368f25 = Math.floor(_0x44a5cc / 3600000);
    const _0xe93d4f = Math.floor(_0x44a5cc % 3600000 / 60000);
    const _0x55cf1c = Math.floor(_0x44a5cc % 60000 / 1000);
    let _0x31ea96 = "⏳ Tu dois attendre encore ";
    if (_0x368f25 > 0) {
      _0x31ea96 += _0x368f25 + " h ";
    }
    if (_0xe93d4f > 0) {
      _0x31ea96 += _0xe93d4f + " min ";
    }
    if (_0x55cf1c > 0 || _0x368f25 === 0 && _0xe93d4f === 0) {
      _0x31ea96 += _0x55cf1c + " sec";
    }
    return _0x13d1b6(_0x31ea96.trim() + " avant de réclamer ton prochain bonus.");
  }
  await modifierSolde(_0x463125, "portefeuille", 1000);
  _0x123433.last_bonus = _0x18703b;
  await _0x123433.save();
  _0x13d1b6("🎉 Tu as reçu *1000 pièces* ! Reviens dans 2h pour un autre bonus.");
});
registerCommand({
  nom_cmd: "don",
  classe: "Economie",
  react: "🤝",
  desc: "Permet à un utilisateur sudo de donner des pièces à un autre utilisateur"
}, async (_0x2742a5, _0x2d1e84, {
  arg: _0x5827dc,
  auteur_Message: _0x4d7370,
  getJid: _0x4c231f,
  auteur_Msg_Repondu: _0x2ee283,
  ms: _0x2f465c,
  repondre: _0x308571,
  isSudo: _0xbf79c9,
  dev_id: _0x3d9418
}) => {
  const _0x509ec7 = await getInfosUtilisateur(_0x4d7370);
  if (!_0xbf79c9) {
    return _0x308571("Cette commande est réservée aux utilisateurs sudo.");
  }
  let _0x471b45 = null;
  if (_0x2ee283) {
    _0x471b45 = _0x2ee283;
  } else if (_0x5827dc[0]?.includes("@")) {
    destinatairl = _0x5827dc[0].replace("@", "") + "@lid";
    _0x471b45 = await _0x4c231f(destinatairl, _0x2742a5, _0x2d1e84);
  }
  if (!_0x471b45) {
    return _0x308571("Mentionne un utilisateur *ou* réponds à son message pour lui faire un don.");
  }
  const _0x329b6c = parseInt(_0x2ee283 ? _0x5827dc[0] : _0x5827dc[1]);
  if (!_0x329b6c || _0x329b6c <= 0) {
    return _0x308571("Montant invalide.");
  }
  const _0xe2bb37 = 50000;
  if (_0x329b6c > _0xe2bb37 && !_0x3d9418) {
    return _0x308571("Tu ne peux pas donner plus de *" + _0xe2bb37 + " pièces*.");
  }
  const _0x753bcd = await ECONOMIE.findOne({
    where: {
      id: _0x471b45
    }
  });
  if (!_0x753bcd) {
    return _0x308571("L'utilisateur mentionné n'est pas enregistré dans le système.");
  }
  await modifierSolde(_0x471b45, "portefeuille", _0x329b6c);
  await _0x2d1e84.sendMessage(_0x2742a5, {
    text: "✅ Tu as donné *" + _0x329b6c + " pièces* à @" + _0x471b45.split("@")[0] + " 💸",
    mentions: [_0x471b45]
  }, {
    quoted: _0x2f465c
  });
});