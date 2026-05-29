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
}, async (_0x11be70, _0x586e52, _0xccfb34) => {
  const {
    ms: _0x36111e,
    repondre: _0x1e39d6,
    arg: _0x1be4bd,
    prenium_id: _0x5f2c90
  } = _0xccfb34;
  try {
    if (!_0x5f2c90) {
      return _0x1e39d6("Seuls les utilisateurs prenium peuvent utiliser cette commande");
    }
    const _0x142270 = _0x1be4bd[0]?.toLowerCase();
    const _0x5dad3b = ["off", "enligne", "enregistre", "ecrit"];
    const _0x333dd8 = {
      "1": "enligne",
      "2": "enregistre",
      "3": "ecrit"
    };
    const [_0x2d080d] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        presence: "non"
      }
    });
    if (_0x142270 === "off") {
      _0x2d080d.presence = "non";
      await _0x2d080d.save();
      return _0x1e39d6("La présence est maintenant désactivée.");
    }
    if (_0x333dd8[_0x142270]) {
      if (_0x2d080d.presence === _0x333dd8[_0x142270]) {
        return _0x1e39d6("La présence est déjà configurée sur " + _0x333dd8[_0x142270]);
      }
      _0x2d080d.presence = _0x333dd8[_0x142270];
      await _0x2d080d.save();
      return _0x1e39d6("La présence est maintenant définie sur " + _0x333dd8[_0x142270]);
    }
    return _0x1e39d6("Utilisation :\npresence 1: Configurer la présence sur 'enligne'\npresence 2: Configurer la présence sur 'enregistre'\npresence 3: Configurer la présence sur 'ecrit'\npresence off: Désactiver la présence");
  } catch (_0xe030ef) {
    console.error("Erreur lors de la configuration de presence :", _0xe030ef);
    _0x1e39d6("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "getprivacy",
  classe: "confidentialité",
  react: "📋",
  desc: "Obtenir vos paramètres de confidentialité"
}, async (_0x47ee0a, _0x37ed04, {
  repondre: _0xbf1862,
  prenium_id: _0x3e6aea,
  ms: _0x12b063
}) => {
  if (!_0x3e6aea) {
    return _0xbf1862("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    const {
      readreceipts: _0x5655b2,
      profile: _0x402ea3,
      status: _0x4c3b78,
      online: _0x10776e,
      last: _0x4fcf9f,
      groupadd: _0x250f89,
      calladd: _0x19aa62
    } = await _0x37ed04.fetchPrivacySettings(true);
    const _0x1d31a9 = "*♺ Mes paramètres de confidentialité*\n\n*ᝄ Nom :* " + _0x12b063.pushName + "\n*ᝄ En ligne :* " + _0x10776e + "\n*ᝄ Profil :* " + _0x402ea3 + "\n*ᝄ Dernière vue :* " + _0x4fcf9f + "\n*ᝄ Confirmation lecture :* " + _0x5655b2 + "\n*ᝄ Statut :* " + _0x4c3b78 + "\n*ᝄ Ajout groupe :* " + _0x250f89 + "\n*ᝄ Ajout appel :* " + _0x19aa62;
    let _0x30d2e1;
    try {
      _0x30d2e1 = await _0x37ed04.profilePictureUrl(_0x47ee0a, "image");
    } catch {
      _0x30d2e1 = "https://files.catbox.moe/ulwqtr.jpg";
    }
    await _0x37ed04.sendMessage(_0x47ee0a, {
      image: {
        url: _0x30d2e1
      },
      caption: _0x1d31a9
    }, {
      quoted: _0x12b063
    });
  } catch (_0x57ac25) {
    console.error(_0x57ac25);
    await _0xbf1862("Erreur lors de la récupération des paramètres de confidentialité.");
  }
});
registerCommand({
  nom_cmd: "setbio",
  classe: "confidentialité",
  react: "✍️",
  desc: "Modifier votre statut de profil"
}, async (_0x1fd6a0, _0x81b8e4, {
  repondre: _0x5f4888,
  prenium_id: _0x2fc31b,
  arg: _0x320292
}) => {
  if (!_0x2fc31b) {
    return _0x5f4888("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  let _0x1b9b2f = _0x320292.join(" ");
  if (!_0x1b9b2f) {
    return _0x5f4888("entrez la bio\nExemple : setbio Salut!  j'utilise WhatsApp.");
  }
  try {
    await _0x81b8e4.updateProfileStatus(_0x1b9b2f);
    await _0x5f4888("Statut de profil mis à jour.");
  } catch (_0x1e0952) {
    console.error(_0x1e0952);
    await _0x5f4888("Erreur lors de la mise à jour du statut.");
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
  type: _0x1da8e0,
  bot: _0x572e4b,
  repondre: _0x3311ca,
  arg: _0x16cf44,
  prenium_id: _0x55998a,
  updateFunction: _0x3954f5,
  label: _0x552d68
}) {
  if (!_0x55998a) {
    return _0x3311ca("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  const _0x1a8fae = privacyValues[_0x1da8e0];
  let _0x12c81b = _0x16cf44[0];
  if (!_0x12c81b || !isNaN(_0x12c81b) && !_0x1a8fae[Number(_0x12c81b) - 1]) {
    const _0x121341 = ["🔐 *Options pour " + _0x552d68 + "* :"];
    _0x1a8fae.forEach((_0x15e91b, _0x5e79b8) => {
      _0x121341.push("*" + (_0x5e79b8 + 1) + ".* " + _0x15e91b.key + " - _" + _0x15e91b.desc + "_");
    });
    _0x121341.push("\n*Exemple :* " + _0x1da8e0 + " 1");
    return _0x3311ca(_0x121341.join("\n"));
  }
  let _0x3bccc3;
  if (!isNaN(_0x12c81b)) {
    const _0x53b22d = Number(_0x12c81b) - 1;
    _0x3bccc3 = _0x1a8fae[_0x53b22d]?.key;
  } else {
    _0x3bccc3 = _0x1a8fae.find(_0x11a57d => _0x11a57d.key === _0x12c81b)?.key;
  }
  if (!_0x3bccc3) {
    return _0x3311ca("Option invalide. Veuillez choisir un numéro ou une valeur valide.");
  }
  try {
    await _0x3954f5(_0x3bccc3);
    return _0x3311ca("✅ Confidentialité *" + _0x552d68 + "* mise à jour en *" + _0x3bccc3 + "*");
  } catch (_0x3d9741) {
    console.error(_0x3d9741);
    return _0x3311ca("Erreur lors de la mise à jour de *" + _0x552d68 + "*");
  }
}
registerCommand({
  nom_cmd: "lastseen",
  classe: "confidentialité",
  react: "⏳",
  desc: "Modifier la confidentialité de la dernière vue"
}, async (_0x816ab3, _0x1d23b1, _0x34605c) => {
  await handlePrivacyCommand({
    type: "lastseen",
    bot: _0x1d23b1,
    repondre: _0x34605c.repondre,
    arg: _0x34605c.arg,
    prenium_id: _0x34605c.prenium_id,
    updateFunction: _0x1d23b1.updateLastSeenPrivacy,
    label: "dernière vue"
  });
});
registerCommand({
  nom_cmd: "online",
  classe: "confidentialité",
  react: "🟢",
  desc: "Modifier la confidentialité en ligne"
}, async (_0x3f8a0b, _0x3f2297, _0x1496cd) => {
  await handlePrivacyCommand({
    type: "online",
    bot: _0x3f2297,
    repondre: _0x1496cd.repondre,
    arg: _0x1496cd.arg,
    prenium_id: _0x1496cd.prenium_id,
    updateFunction: _0x3f2297.updateOnlinePrivacy,
    label: "en ligne"
  });
});
registerCommand({
  nom_cmd: "mypp",
  classe: "confidentialité",
  react: "🖼️",
  desc: "Modifier la confidentialité de la photo de profil"
}, async (_0x29a153, _0xb13022, _0x31f10e) => {
  await handlePrivacyCommand({
    type: "profile",
    bot: _0xb13022,
    repondre: _0x31f10e.repondre,
    arg: _0x31f10e.arg,
    prenium_id: _0x31f10e.prenium_id,
    updateFunction: _0xb13022.updateProfilePicturePrivacy,
    label: "photo de profil"
  });
});
registerCommand({
  nom_cmd: "mystatus",
  classe: "confidentialité",
  react: "📃",
  desc: "Modifier la confidentialité du statut"
}, async (_0x467d88, _0x46e8b0, _0x2781ca) => {
  await handlePrivacyCommand({
    type: "status",
    bot: _0x46e8b0,
    repondre: _0x2781ca.repondre,
    arg: _0x2781ca.arg,
    prenium_id: _0x2781ca.prenium_id,
    updateFunction: _0x46e8b0.updateStatusPrivacy,
    label: "statut"
  });
});
registerCommand({
  nom_cmd: "read",
  classe: "confidentialité",
  react: "📖",
  desc: "Modifier la confidentialité des confirmations de lecture"
}, async (_0x24e779, _0x1c5a2d, _0x45751b) => {
  await handlePrivacyCommand({
    type: "read",
    bot: _0x1c5a2d,
    repondre: _0x45751b.repondre,
    arg: _0x45751b.arg,
    prenium_id: _0x45751b.prenium_id,
    updateFunction: _0x1c5a2d.updateReadReceiptsPrivacy,
    label: "confirmation de lecture"
  });
});
registerCommand({
  nom_cmd: "groupadd",
  classe: "confidentialité",
  react: "➕",
  desc: "Modifier la confidentialité d'ajout en groupe"
}, async (_0x3abb40, _0x46513b, _0x4a4afb) => {
  await handlePrivacyCommand({
    type: "groupadd",
    bot: _0x46513b,
    repondre: _0x4a4afb.repondre,
    arg: _0x4a4afb.arg,
    prenium_id: _0x4a4afb.prenium_id,
    updateFunction: _0x46513b.updateGroupsAddPrivacy,
    label: "ajout en groupe"
  });
});