'use strict';

const {
  registerCommand,
  getInfosUtilisateur,
  modifierSolde,
  ECONOMIE,
  generateUserId,
} = require('./_shared');

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
