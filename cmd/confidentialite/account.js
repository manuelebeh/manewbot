'use strict';

const { registerCommand } = require('./_shared');
const config = require('../../set');

registerCommand({
  nom_cmd: "getprivacy",
  classe: "confidentialité",
  react: "📋",
  desc: "Obtenir vos paramètres de confidentialité"
}, async (jid, bot, {
  repondre,
  isOwner,
  ms
}) => {
  if (!isOwner) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    const {
      readreceipts,
      profile,
      status,
      online,
      last,
      groupadd,
      calladd
    } = await bot.fetchPrivacySettings(true);
    const caption = "*♺ Mes paramètres de confidentialité*\n\n*ᝄ Nom :* " + ms.pushName + "\n*ᝄ En ligne :* " + online + "\n*ᝄ Profil :* " + profile + "\n*ᝄ Dernière vue :* " + last + "\n*ᝄ Confirmation lecture :* " + readreceipts + "\n*ᝄ Statut :* " + status + "\n*ᝄ Ajout groupe :* " + groupadd + "\n*ᝄ Ajout appel :* " + calladd;
    let profilePicUrl;
    try {
      profilePicUrl = await bot.profilePictureUrl(jid, "image");
    } catch {
      profilePicUrl = config.DEFAULT_AVATAR_URL;
    }
    await bot.sendMessage(jid, {
      image: {
        url: profilePicUrl
      },
      caption
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error(err);
    await repondre("Erreur lors de la récupération des paramètres de confidentialité.");
  }
});
registerCommand({
  nom_cmd: "setbio",
  classe: "confidentialité",
  react: "✍️",
  desc: "Modifier votre statut de profil"
}, async (jid, bot, {
  repondre,
  isOwner,
  arg
}) => {
  if (!isOwner) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  let bio = arg.join(" ");
  if (!bio) {
    return repondre("entrez la bio\nExemple : setbio Salut!  j'utilise WhatsApp.");
  }
  try {
    await bot.updateProfileStatus(bio);
    await repondre("Statut de profil mis à jour.");
  } catch (err) {
    console.error(err);
    await repondre("Erreur lors de la mise à jour du statut.");
  }
});
