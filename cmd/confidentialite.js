const {
  registerCommand
} = require("../lib/commands");
const {
  WA_CONF
} = require("../database/wa_conf");
registerCommand({
  nom_cmd: "presence",
  classe: "confidentialité",
  react: "👤",
  desc: "Active ou configure la présence sur WhatsApp"
}, async (jid, bot, ctx) => {
  const {
    ms,
    repondre,
    arg,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("Seuls les utilisateurs sudo peuvent utiliser cette commande");
    }
    const mode = arg[0]?.toLowerCase();
    const presenceByNumber = {
      "1": "enligne",
      "2": "enregistre",
      "3": "ecrit"
    };
    const [waConf] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        presence: "non"
      }
    });
    if (mode === "off") {
      waConf.presence = "non";
      await waConf.save();
      return repondre("La présence est maintenant désactivée.");
    }
    if (presenceByNumber[mode]) {
      if (waConf.presence === presenceByNumber[mode]) {
        return repondre("La présence est déjà configurée sur " + presenceByNumber[mode]);
      }
      waConf.presence = presenceByNumber[mode];
      await waConf.save();
      return repondre("La présence est maintenant définie sur " + presenceByNumber[mode]);
    }
    return repondre("Utilisation :\npresence 1: Configurer la présence sur 'enligne'\npresence 2: Configurer la présence sur 'enregistre'\npresence 3: Configurer la présence sur 'ecrit'\npresence off: Désactiver la présence");
  } catch (err) {
    console.error("Erreur lors de la configuration de presence :", err);
    repondre("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "getprivacy",
  classe: "confidentialité",
  react: "📋",
  desc: "Obtenir vos paramètres de confidentialité"
}, async (jid, bot, {
  repondre,
  isSudo,
  ms
}) => {
  if (!isSudo) {
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
      profilePicUrl = "https://files.catbox.moe/ulwqtr.jpg";
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
  isSudo,
  arg
}) => {
  if (!isSudo) {
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
const privacyValues = {
  lastseen: [{
    key: "all",
    desc: "Tout le monde"
  }, {
    key: "contacts",
    desc: "Seulement vos contacts"
  }, {
    key: "contact_blacklist",
    desc: "Tous sauf certains"
  }, {
    key: "none",
    desc: "Personne"
  }],
  online: [{
    key: "all",
    desc: "Visible pour tout le monde"
  }, {
    key: "match_last_seen",
    desc: "Même que votre visibilité de dernière vue"
  }],
  profile: [{
    key: "all",
    desc: "Tout le monde"
  }, {
    key: "contacts",
    desc: "Seulement vos contacts"
  }, {
    key: "contact_blacklist",
    desc: "Tous sauf certains"
  }, {
    key: "none",
    desc: "Personne"
  }],
  status: [{
    key: "all",
    desc: "Tout le monde"
  }, {
    key: "contacts",
    desc: "Seulement vos contacts"
  }, {
    key: "contact_blacklist",
    desc: "Tous sauf certains"
  }, {
    key: "none",
    desc: "Personne"
  }],
  read: [{
    key: "all",
    desc: "Activé (vous voyez qui a lu, et eux aussi)"
  }, {
    key: "none",
    desc: "Désactivé (vous ne verrez rien, eux non plus)"
  }],
  groupadd: [{
    key: "all",
    desc: "Tout le monde peut vous ajouter"
  }, {
    key: "contacts",
    desc: "Seuls vos contacts peuvent vous ajouter"
  }, {
    key: "contact_blacklist",
    desc: "Tous sauf certains"
  }, {
    key: "none",
    desc: "Personne ne peut vous ajouter"
  }]
};
async function handlePrivacyCommand({
  type,
  bot,
  repondre,
  arg,
  isSudo,
  updateFunction,
  label
}) {
  if (!isSudo) {
    return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  const options = privacyValues[type];
  let choice = arg[0];
  if (!choice || !isNaN(choice) && !options[Number(choice) - 1]) {
    const lines = ["🔐 *Options pour " + label + "* :"];
    options.forEach((opt, index) => {
      lines.push("*" + (index + 1) + ".* " + opt.key + " - _" + opt.desc + "_");
    });
    lines.push("\n*Exemple :* " + type + " 1");
    return repondre(lines.join("\n"));
  }
  let selectedKey;
  if (!isNaN(choice)) {
    const index = Number(choice) - 1;
    selectedKey = options[index]?.key;
  } else {
    selectedKey = options.find(opt => opt.key === choice)?.key;
  }
  if (!selectedKey) {
    return repondre("Option invalide. Veuillez choisir un numéro ou une valeur valide.");
  }
  try {
    await updateFunction(selectedKey);
    return repondre("✅ Confidentialité *" + label + "* mise à jour en *" + selectedKey + "*");
  } catch (err) {
    console.error(err);
    return repondre("Erreur lors de la mise à jour de *" + label + "*");
  }
}
registerCommand({
  nom_cmd: "lastseen",
  classe: "confidentialité",
  react: "⏳",
  desc: "Modifier la confidentialité de la dernière vue"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "lastseen",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateLastSeenPrivacy,
    label: "dernière vue"
  });
});
registerCommand({
  nom_cmd: "online",
  classe: "confidentialité",
  react: "🟢",
  desc: "Modifier la confidentialité en ligne"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "online",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateOnlinePrivacy,
    label: "en ligne"
  });
});
registerCommand({
  nom_cmd: "mypp",
  classe: "confidentialité",
  react: "🖼️",
  desc: "Modifier la confidentialité de la photo de profil"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "profile",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateProfilePicturePrivacy,
    label: "photo de profil"
  });
});
registerCommand({
  nom_cmd: "mystatus",
  classe: "confidentialité",
  react: "📃",
  desc: "Modifier la confidentialité du statut"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "status",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateStatusPrivacy,
    label: "statut"
  });
});
registerCommand({
  nom_cmd: "read",
  classe: "confidentialité",
  react: "📖",
  desc: "Modifier la confidentialité des confirmations de lecture"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "read",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateReadReceiptsPrivacy,
    label: "confirmation de lecture"
  });
});
registerCommand({
  nom_cmd: "groupadd",
  classe: "confidentialité",
  react: "➕",
  desc: "Modifier la confidentialité d'ajout en groupe"
}, async (jid, bot, ctx) => {
  await handlePrivacyCommand({
    type: "groupadd",
    bot,
    repondre: ctx.repondre,
    arg: ctx.arg,
    isSudo: ctx.isSudo,
    updateFunction: bot.updateGroupsAddPrivacy,
    label: "ajout en groupe"
  });
});
