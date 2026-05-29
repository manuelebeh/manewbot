const {
  registerCommand
} = require("../lib/commands");
const {
  Sticker,
  StickerTypes
} = require("wa-sticker-formatter");
const {
  Antilink
} = require("../database/antilink");
const {
  Antitag
} = require("../database/antitag");
const {
  Antibot
} = require("../database/antibot");
const {
  GroupSettings,
  Events2
} = require("../database/events");
const fs = require("fs");
const {
  setWarn,
  delWarn,
  getLimit,
  setLimit
} = require("../database/warn");
const {
  Antimention
} = require("../database/antimention");
const {
  Ranks
} = require("../database/rank");
const {
  Antispam
} = require("../database/antispam");
registerCommand({
  nom_cmd: "tagall",
  classe: "Groupe",
  react: "💬",
  desc: "Commande pour taguer tous les membres d'un groupe"
}, async (_0x53b53a, _0x5300b1, _0x6d4b0d) => {
  try {
    const {
      ms: _0x1a8342,
      repondre: _0x24846a,
      arg: _0x3848f9,
      mbre_membre: _0x26c9b9,
      verif_Groupe: _0x24f575,
      infos_Groupe: _0x115821,
      nom_Auteur_Message: _0x235ff9,
      verif_Admin: _0x120359
    } = _0x6d4b0d;
    if (!_0x24f575) {
      return _0x24846a("Cette commande ne fonctionne que dans les groupes");
    }
    const _0x4c234e = _0x3848f9 && _0x3848f9.length > 0 ? _0x3848f9.join(" ") : "";
    let _0x15cc6b = "╭───〔  TAG ALL 〕───⬣\n";
    _0x15cc6b += "│👤 Auteur : *" + _0x235ff9 + "*\n";
    _0x15cc6b += "│💬 Message : *" + _0x4c234e + "*\n│\n";
    _0x26c9b9.forEach(_0x83223d => {
      _0x15cc6b += "│◦❒ @" + _0x83223d.id.split("@")[0] + "\n";
    });
    _0x15cc6b += "╰═══════════════⬣\n";
    if (_0x120359) {
      await _0x5300b1.sendMessage(_0x53b53a, {
        text: _0x15cc6b,
        mentions: _0x26c9b9.map(_0x10d32d => _0x10d32d.id)
      }, {
        quoted: _0x1a8342
      });
    } else {
      _0x24846a("Seuls les administrateurs peuvent utiliser cette commande");
    }
  } catch (_0x166ea6) {
    console.error("Erreur lors de l'envoi du message avec tagall :", _0x166ea6);
  }
});
registerCommand({
  nom_cmd: "tagadmin",
  classe: "Groupe",
  react: "💬",
  desc: "Commande pour taguer tous les administrateurs d'un groupe"
}, async (_0x3a2b0f, _0x215a10, _0x99d111) => {
  try {
    const {
      ms: _0x393cf9,
      repondre: _0x315d8,
      arg: _0x575a56,
      verif_Groupe: _0x5ba6ef,
      mbre_membre: _0x2c2a7f,
      infos_Groupe: _0x2665a7,
      nom_Auteur_Message: _0x50ee18,
      verif_Admin: _0x449421
    } = _0x99d111;
    if (!_0x5ba6ef) {
      return _0x315d8("Cette commande ne fonctionne que dans les groupes");
    }
    const _0x28b7f6 = _0x575a56 && _0x575a56.length > 0 ? _0x575a56.join(" ") : "";
    const _0x4477ae = _0x2c2a7f.filter(_0x294864 => _0x294864.admin).map(_0x4dc1e6 => _0x4dc1e6.id);
    if (_0x4477ae.length === 0) {
      return _0x315d8("Aucun administrateur trouvé dans ce groupe.");
    }
    let _0x54e62a = "╭───〔  TAG ADMINS 〕───⬣\n";
    _0x54e62a += "│👤 Auteur : *" + _0x50ee18 + "*\n";
    _0x54e62a += "│💬 Message : *" + _0x28b7f6 + "*\n│\n";
    _0x2c2a7f.forEach(_0x42cffe => {
      if (_0x42cffe.admin) {
        _0x54e62a += "│◦❒ @" + _0x42cffe.id.split("@")[0] + "\n";
      }
    });
    _0x54e62a += "╰═══════════════⬣\n";
    if (_0x449421) {
      await _0x215a10.sendMessage(_0x3a2b0f, {
        text: _0x54e62a,
        mentions: _0x4477ae
      }, {
        quoted: _0x393cf9
      });
    } else {
      _0x315d8("Seuls les administrateurs peuvent utiliser cette commande");
    }
  } catch (_0x580597) {
    console.error("Erreur lors de l'envoi du message avec tagadmins :", _0x580597);
  }
});
registerCommand({
  nom_cmd: "tag",
  classe: "Groupe",
  react: "💬",
  alias: ["htag", "hidetag"],
  desc: "partager un message à tous les membres d'un groupe"
}, async (_0x636325, _0x13ebc2, _0x58178b) => {
  const {
    repondre: _0x101e69,
    msg_Repondu: _0xa01b0,
    verif_Groupe: _0x38be99,
    infos_Groupe: _0x8cad7e,
    arg: _0x4ce9fb,
    verif_Admin: _0x31f9e9,
    ms: _0x1e31ba
  } = _0x58178b;
  if (!_0x38be99) {
    _0x101e69("Cette commande ne fonctionne que dans les groupes");
    return;
  }
  if (_0x31f9e9) {
    let _0x48d67b = _0x8cad7e;
    let _0xa1c7cb = _0x48d67b.participants.map(_0x481290 => _0x481290.id);
    let _0x57e5af;
    if (_0xa01b0) {
      if (_0xa01b0.imageMessage) {
        let _0x146a58 = await _0x13ebc2.dl_save_media_ms(_0xa01b0.imageMessage);
        _0x57e5af = {
          image: {
            url: _0x146a58
          },
          caption: _0xa01b0.imageMessage.caption,
          mentions: _0xa1c7cb
        };
      } else if (_0xa01b0.videoMessage) {
        let _0xa910bd = await _0x13ebc2.dl_save_media_ms(_0xa01b0.videoMessage);
        _0x57e5af = {
          video: {
            url: _0xa910bd
          },
          caption: _0xa01b0.videoMessage.caption,
          mentions: _0xa1c7cb
        };
      } else if (_0xa01b0.audioMessage) {
        let _0x50ff42 = await _0x13ebc2.dl_save_media_ms(_0xa01b0.audioMessage);
        _0x57e5af = {
          audio: {
            url: _0x50ff42
          },
          mimetype: "audio/mp4",
          mentions: _0xa1c7cb
        };
      } else if (_0xa01b0.stickerMessage) {
        let _0x4cd7c4 = await _0x13ebc2.dl_save_media_ms(_0xa01b0.stickerMessage);
        let _0x4ec3f8 = new Sticker(_0x4cd7c4, {
          pack: "Manewbot Hidtag",
          type: StickerTypes.FULL,
          quality: 80,
          background: "transparent"
        });
        const _0x3de472 = await _0x4ec3f8.toBuffer();
        _0x57e5af = {
          sticker: _0x3de472,
          mentions: _0xa1c7cb
        };
      } else {
        _0x57e5af = {
          text: _0xa01b0.conversation || _0xa01b0.extendedTextMessage?.text,
          mentions: _0xa1c7cb
        };
      }
      _0x13ebc2.sendMessage(_0x636325, _0x57e5af, {
        quoted: _0x1e31ba
      });
    } else {
      if (!_0x4ce9fb || !_0x4ce9fb[0]) {
        _0x101e69("Veuillez inclure ou mentionner un message à partager.");
        return;
      }
      _0x13ebc2.sendMessage(_0x636325, {
        text: _0x4ce9fb.join(" "),
        mentions: _0xa1c7cb
      }, {
        quoted: _0x1e31ba
      });
    }
  } else {
    _0x101e69("Cette commande est réservée aux administrateurs du groupe");
  }
});
registerCommand({
  nom_cmd: "poll",
  classe: "Groupe",
  react: "📊",
  desc: "Crée un sondage dans le groupe(plusieurs votés autorisé)."
}, async (_0x4ccc51, _0x13e2b6, _0x36bd05) => {
  try {
    const {
      ms: _0x1bc922,
      repondre: _0x3827d2,
      arg: _0x247847,
      verif_Groupe: _0x149c57,
      infos_Groupe: _0x4118ac,
      nom_Auteur_Message: _0x3fbd3d,
      verif_Admin: _0x351fc9
    } = _0x36bd05;
    if (!_0x149c57) {
      return _0x3827d2("Cette commande ne fonctionne que dans les groupes.");
    }
    let [_0x758653, _0x43c60f] = _0x247847.join(" ").split(";");
    if (!_0x43c60f) {
      return _0x3827d2("Veuillez fournir une question suivie des options, séparées par des virgules. Exemple : poll question;option1,option2,option3");
    }
    let _0x162000 = _0x43c60f.split(",").map(_0x85d865 => _0x85d865.trim()).filter(_0x4cff5c => _0x4cff5c.length > 0);
    if (_0x162000.length < 2) {
      return _0x3827d2("Le sondage doit contenir au moins deux options.");
    }
    if (_0x351fc9) {
      await _0x13e2b6.sendMessage(_0x4ccc51, {
        poll: {
          name: _0x758653,
          values: _0x162000
        }
      }, {
        quoted: _0x1bc922
      });
    } else {
      _0x3827d2("Seuls les administrateurs peuvent utiliser cette commande.");
    }
  } catch (_0x55e0d8) {
    console.error("Erreur lors de l'envoi du sondage :", _0x55e0d8);
    repondre("Une erreur est survenue lors de la création du sondage.");
  }
});
registerCommand({
  nom_cmd: "poll2",
  classe: "Groupe",
  react: "📊",
  desc: "Crée un sondage dans le groupe(un seul vote autorisé)."
}, async (_0x284d4e, _0x3c7073, _0x75b0eb) => {
  try {
    const {
      ms: _0x5413b1,
      repondre: _0x3a5bfc,
      arg: _0x19fb70,
      verif_Groupe: _0x43a7b2,
      infos_Groupe: _0x58ed5b,
      nom_Auteur_Message: _0x2b74dc,
      verif_Admin: _0x2733c9
    } = _0x75b0eb;
    if (!_0x43a7b2) {
      return _0x3a5bfc("Cette commande ne fonctionne que dans les groupes.");
    }
    let [_0x55619a, _0x2e6339] = _0x19fb70.join(" ").split(";");
    if (!_0x2e6339) {
      return _0x3a5bfc("Veuillez fournir une question suivie des options, séparées par des virgules. Exemple : poll question;option1,option2,option3");
    }
    let _0x27a61d = _0x2e6339.split(",").map(_0x1b2ae3 => _0x1b2ae3.trim()).filter(_0x11912b => _0x11912b.length > 0);
    if (_0x27a61d.length < 2) {
      return _0x3a5bfc("Le sondage doit contenir au moins deux options.");
    }
    if (_0x2733c9) {
      await _0x3c7073.sendMessage(_0x284d4e, {
        poll: {
          name: _0x55619a,
          values: _0x27a61d,
          selectableCount: 1
        }
      }, {
        quoted: _0x5413b1
      });
    } else {
      _0x3a5bfc("Seuls les administrateurs peuvent utiliser cette commande.");
    }
  } catch (_0x1aa5b8) {
    console.error("Erreur lors de l'envoi du sondage :", _0x1aa5b8);
    repondre("Une erreur est survenue lors de la création du sondage.");
  }
});
registerCommand({
  nom_cmd: "kick",
  classe: "Groupe",
  react: "🛑",
  desc: "Supprime un membre du groupe."
}, async (_0x12fb4a, _0x56a01a, _0xa7443a) => {
  const {
    verif_Groupe: _0x32eecc,
    getJid: _0x25a217,
    auteur_Msg_Repondu: _0x225c23,
    arg: _0x1e12dd,
    infos_Groupe: _0x4df440,
    verif_Admin: _0x1c28a9,
    verif_Bot_Admin: _0x523334,
    prenium_id: _0x211bea,
    dev_num: _0x419b6b,
    ms: _0x519af5
  } = _0xa7443a;
  if (!_0x32eecc) {
    return _0x56a01a.sendMessage(_0x12fb4a, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x519af5
    });
  }
  if (_0x211bea || _0x1c28a9) {
    const _0x4cc809 = await _0x4df440.participants;
    const _0x329ddf = _0x4cc809.filter(_0x52c8f6 => _0x52c8f6.admin).map(_0xaec965 => _0xaec965.jid);
    const _0x296e43 = _0x225c23 || _0x1e12dd[0]?.includes("@") && _0x1e12dd[0].replace("@", "") + "@lid";
    const _0x2d9435 = await _0x25a217(_0x296e43, _0x12fb4a, _0x56a01a);
    if (!_0x523334) {
      return _0x56a01a.sendMessage(_0x12fb4a, {
        text: "Je dois être administrateur pour effectuer cette action."
      }, {
        quoted: _0x519af5
      });
    }
    if (!_0x2d9435 || !_0x4cc809.find(_0x546af8 => _0x546af8.jid === _0x2d9435)) {
      return _0x56a01a.sendMessage(_0x12fb4a, {
        text: "Membre introuvable dans ce groupe."
      }, {
        quoted: _0x519af5
      });
    }
    if (_0x329ddf.includes(_0x2d9435)) {
      return _0x56a01a.sendMessage(_0x12fb4a, {
        text: "Impossible d'exclure un administrateur du groupe."
      }, {
        quoted: _0x519af5
      });
    }
    if (_0x419b6b.includes(_0x2d9435)) {
      return _0x56a01a.sendMessage(_0x12fb4a, {
        text: "Vous ne pouvez pas exclure un développeur."
      }, {
        quoted: _0x519af5
      });
    }
    try {
      await _0x56a01a.groupParticipantsUpdate(_0x12fb4a, [_0x2d9435], "remove");
      _0x56a01a.sendMessage(_0x12fb4a, {
        text: "@" + _0x2d9435.split("@")[0] + " a été exclu.",
        mentions: [_0x2d9435]
      }, {
        quoted: _0x519af5
      });
    } catch (_0x5bc9cd) {
      console.error("Erreur :", _0x5bc9cd);
      _0x56a01a.sendMessage(_0x12fb4a, {
        text: "Une erreur est survenue lors de l'exclusion."
      }, {
        quoted: _0x519af5
      });
    }
  } else {
    return _0x56a01a.sendMessage(_0x12fb4a, {
      text: "Vous n'avez pas la permission d'utiliser cette commande."
    }, {
      quoted: _0x519af5
    });
  }
  ;
});
registerCommand({
  nom_cmd: "kickall",
  classe: "Groupe",
  react: "🛑",
  desc: "Supprime tous les membres non administrateurs du groupe."
}, async (_0x434f58, _0x167684, _0x55b82d) => {
  const {
    verif_Groupe: _0x38c176,
    infos_Groupe: _0x22ad6c,
    ms: _0x459cbd,
    auteur_Message: _0x7516dc,
    verif_Bot_Admin: _0x5745b6,
    dev_num: _0x4574c4,
    id_Bot: _0x2a7344,
    getJid: _0x28db40
  } = _0x55b82d;
  if (!_0x38c176) {
    return _0x167684.sendMessage(_0x434f58, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x459cbd
    });
  }
  const _0x253d4d = _0x22ad6c.participants;
  let _0x149fed = _0x253d4d.find(_0x4f6efc => _0x4f6efc.admin === "superadmin")?.jid;
  if (!_0x149fed) {
    _0x149fed = _0x253d4d[0]?.jid;
  }
  if (![_0x149fed, _0x2a7344, ..._0x4574c4].includes(_0x7516dc)) {
    return _0x167684.sendMessage(_0x434f58, {
      text: "Seul le créateur du groupe ou le propriétaire du bot peut utiliser cette commande."
    }, {
      quoted: _0x459cbd
    });
  }
  if (!_0x5745b6) {
    return _0x167684.sendMessage(_0x434f58, {
      text: "Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: _0x459cbd
    });
  }
  const _0x2b0670 = await GroupSettings.findOne({
    where: {
      id: _0x434f58
    }
  });
  if (_0x2b0670?.goodbye === "oui") {
    return _0x167684.sendMessage(_0x434f58, {
      text: "Désactivez le goodbye message (goodbye off) avant de continuer."
    }, {
      quoted: _0x459cbd
    });
  }
  const _0xd09163 = _0x253d4d.filter(_0x2e01f5 => !_0x2e01f5.admin && !_0x4574c4.includes(_0x2e01f5.jid)).map(_0x27c8a4 => _0x27c8a4.jid);
  if (_0xd09163.length === 0) {
    return _0x167684.sendMessage(_0x434f58, {
      text: "Aucun membre non administrateur à exclure."
    }, {
      quoted: _0x459cbd
    });
  }
  await _0x167684.sendMessage(_0x434f58, {
    text: "⚠️ Kickall va commencer dans 5 secondes.\nEnvoyez 'stop' pour annuler."
  }, {
    quoted: _0x459cbd
  });
  await new Promise(_0x86596d => setTimeout(_0x86596d, 5000));
  let _0x4aa43b = false;
  for (const _0x5e85ac of _0xd09163) {
    const _0xf5fac6 = await _0x167684.recup_msg({
      ms_org: _0x434f58,
      temps: 300000
    });
    const _0x39f004 = (_0xf5fac6?.message?.conversation || _0xf5fac6?.message?.extendedTextMessage?.text || "").trim().toLowerCase();
    const _0x29db64 = _0xf5fac6?.key?.participant || _0xf5fac6?.key?.remoteJid;
    const _0x40b153 = await _0x28db40(_0x29db64, _0x434f58, _0x167684);
    if (_0x39f004 === "stop" && [_0x149fed, _0x2a7344, ..._0x4574c4].includes(_0x40b153)) {
      _0x4aa43b = true;
      await _0x167684.sendMessage(_0x434f58, {
        text: "⛔ Kickall annulé !"
      }, {
        quoted: _0x459cbd
      });
      break;
    }
    try {
      await _0x167684.groupParticipantsUpdate(_0x434f58, [_0x5e85ac], "remove");
      await new Promise(_0x196563 => setTimeout(_0x196563, 500));
    } catch (_0xf5b1f7) {
      console.error("Erreur exclusion " + _0x5e85ac + " :", _0xf5b1f7);
    }
  }
  if (!_0x4aa43b) {
    _0x167684.sendMessage(_0x434f58, {
      text: "✅ " + _0xd09163.length + " membre(s) ont été exclus."
    }, {
      quoted: _0x459cbd
    });
  }
});
registerCommand({
  nom_cmd: "kickall2",
  classe: "Groupe",
  react: "🚫",
  desc: "Exclut tous les membres non administrateurs d’un coup."
}, async (_0x4ebb3d, _0x39ec27, _0x3bba86) => {
  const {
    verif_Groupe: _0x5526c3,
    verif_Bot_Admin: _0x384563,
    infos_Groupe: _0x889f13,
    dev_num: _0x56e36c,
    ms: _0x5b40ff,
    auteur_Message: _0x3f64fb,
    id_Bot: _0x1ea0c0
  } = _0x3bba86;
  if (!_0x5526c3) {
    return _0x39ec27.sendMessage(_0x4ebb3d, {
      text: "❌ Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x5b40ff
    });
  }
  const _0x21e924 = _0x889f13.participants;
  let _0x4d1d50 = _0x21e924.find(_0x2a1a3e => _0x2a1a3e.admin === "superadmin")?.jid;
  if (!_0x4d1d50) {
    _0x4d1d50 = _0x21e924[0]?.jid;
  }
  if (![_0x4d1d50, _0x1ea0c0, ..._0x56e36c].includes(_0x3f64fb)) {
    return _0x39ec27.sendMessage(_0x4ebb3d, {
      text: "❌ Seul le superadmin, le créateur du groupe, le créateur du bot ou un dev peut utiliser cette commande."
    }, {
      quoted: _0x5b40ff
    });
  }
  if (!_0x384563) {
    return _0x39ec27.sendMessage(_0x4ebb3d, {
      text: "❌ Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: _0x5b40ff
    });
  }
  const _0x10588f = await GroupSettings.findOne({
    where: {
      id: _0x4ebb3d
    }
  });
  if (_0x10588f?.goodbye === "oui") {
    return _0x39ec27.sendMessage(_0x4ebb3d, {
      text: "❗ Désactivez d’abord le message de départ (goodbye off).",
      quoted: _0x5b40ff
    });
  }
  const _0x42ef6c = _0x21e924.filter(_0xf5e49 => !_0xf5e49.admin && !_0x56e36c.includes(_0xf5e49.jid)).map(_0x30c04e => _0x30c04e.jid);
  if (_0x42ef6c.length === 0) {
    return _0x39ec27.sendMessage(_0x4ebb3d, {
      text: "✅ Aucun membre non administrateur à exclure."
    }, {
      quoted: _0x5b40ff
    });
  }
  try {
    await _0x39ec27.groupParticipantsUpdate(_0x4ebb3d, _0x42ef6c, "remove");
    _0x39ec27.sendMessage(_0x4ebb3d, {
      text: "✅ " + _0x42ef6c.length + " membre(s) ont été exclus.",
      quoted: _0x5b40ff
    });
  } catch (_0x5d4aa5) {
    console.error("❌ Erreur exclusion en masse :", _0x5d4aa5);
    _0x39ec27.sendMessage(_0x4ebb3d, {
      text: "❌ Échec de l’exclusion en masse. Certains membres n’ont peut-être pas été retirés."
    }, {
      quoted: _0x5b40ff
    });
  }
});
registerCommand({
  nom_cmd: "ckick",
  classe: "Groupe",
  react: "🛑",
  desc: "Supprime tous les membres non administrateurs dont le JID commence par un indicatif spécifique."
}, async (_0x598a0f, _0x48010f, _0x1b9aea) => {
  const {
    verif_Groupe: _0xd1b74e,
    verif_Bot_Admin: _0x274b27,
    infos_Groupe: _0x588991,
    arg: _0xecf87c,
    dev_num: _0x1a9cfe,
    ms: _0x54e9bf,
    auteur_Message: _0x5ab44f,
    id_Bot: _0x4989a7
  } = _0x1b9aea;
  if (!_0xd1b74e) {
    return _0x48010f.sendMessage(_0x598a0f, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x54e9bf
    });
  }
  const _0x2999bd = _0x588991.participants;
  let _0x1545ad = _0x2999bd.find(_0x2227a7 => _0x2227a7.admin === "superadmin")?.jid;
  if (!_0x1545ad) {
    _0x1545ad = _0x2999bd[0]?.jid;
  }
  if (![_0x1545ad, _0x4989a7, ..._0x1a9cfe].includes(_0x5ab44f)) {
    return _0x48010f.sendMessage(_0x598a0f, {
      text: "❌ Seul le superadmin, le créateur du groupe, le créateur du bot ou un dev peut utiliser cette commande."
    }, {
      quoted: _0x54e9bf
    });
  }
  if (!_0xecf87c[0]) {
    return _0x48010f.sendMessage(_0x598a0f, {
      text: "Veuillez spécifier l'indicatif."
    }, {
      quoted: _0x54e9bf
    });
  }
  if (!_0x274b27) {
    return _0x48010f.sendMessage(_0x598a0f, {
      text: "Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: _0x54e9bf
    });
  }
  const _0x14aa3f = await GroupSettings.findOne({
    where: {
      id: _0x598a0f
    }
  });
  if (_0x14aa3f?.goodbye === "oui") {
    return _0x48010f.sendMessage(_0x598a0f, {
      text: "Désactivez le goodbye message (goodbye off) avant de continuer."
    }, {
      quoted: _0x54e9bf
    });
  }
  const _0x5d45f8 = _0xecf87c[0];
  const _0x1527f5 = _0x2999bd.filter(_0x322001 => _0x322001.jid.startsWith(_0x5d45f8) && !_0x322001.admin && !_0x1a9cfe.includes(_0x322001.jid)).map(_0x2c91c6 => _0x2c91c6.jid);
  if (_0x1527f5.length === 0) {
    return _0x48010f.sendMessage(_0x598a0f, {
      text: "Aucun membre non admin avec l'indicatif " + _0x5d45f8 + "."
    }, {
      quoted: _0x54e9bf
    });
  }
  for (const _0x3cc1b7 of _0x1527f5) {
    try {
      await _0x48010f.groupParticipantsUpdate(_0x598a0f, [_0x3cc1b7], "remove");
      await new Promise(_0x17db65 => setTimeout(_0x17db65, 500));
    } catch (_0x48dd8a) {
      console.error("Erreur exclusion " + _0x3cc1b7 + " :", _0x48dd8a);
    }
  }
  _0x48010f.sendMessage(_0x598a0f, {
    text: "✅ " + _0x1527f5.length + " membre(s) avec l'indicatif " + _0x5d45f8 + " ont été exclus."
  }, {
    quoted: _0x54e9bf
  });
});
registerCommand({
  nom_cmd: "promote",
  classe: "Groupe",
  react: "⬆️",
  desc: "Promouvoir un membre comme administrateur."
}, async (_0x2a1464, _0xb5f28, _0x104d16) => {
  const {
    verif_Groupe: _0x58d3e4,
    auteur_Msg_Repondu: _0x17e32e,
    arg: _0x3a3d65,
    getJid: _0x4419cc,
    infos_Groupe: _0x402448,
    verif_Admin: _0x248d15,
    prenium_id: _0x1d3686,
    verif_Bot_Admin: _0x49a84a,
    ms: _0x390e05
  } = _0x104d16;
  if (!_0x58d3e4) {
    return _0xb5f28.sendMessage(_0x2a1464, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x390e05
    });
  }
  if (_0x248d15 || _0x1d3686) {
    const _0x7076d9 = await _0x402448.participants;
    const _0x406b1a = _0x7076d9.filter(_0x1493fb => _0x1493fb.admin).map(_0x484e85 => _0x484e85.jid);
    const _0x555172 = _0x17e32e || _0x3a3d65[0]?.includes("@") && _0x3a3d65[0].replace("@", "") + "@lid";
    const _0x43f556 = await _0x4419cc(_0x555172, _0x2a1464, _0xb5f28);
    if (!_0x49a84a) {
      return _0xb5f28.sendMessage(_0x2a1464, {
        text: "Je dois être administrateur pour effectuer cette action."
      }, {
        quoted: _0x390e05
      });
    }
    if (!_0x43f556) {
      return _0xb5f28.sendMessage(_0x2a1464, {
        text: "Veuillez mentionner un membre à promouvoir."
      }, {
        quoted: _0x390e05
      });
    }
    if (!_0x7076d9.find(_0x4a44dc => _0x4a44dc.jid === _0x43f556)) {
      return _0xb5f28.sendMessage(_0x2a1464, {
        text: "Membre introuvable dans ce groupe."
      }, {
        quoted: _0x390e05
      });
    }
    if (_0x406b1a.includes(_0x43f556)) {
      return _0xb5f28.sendMessage(_0x2a1464, {
        text: "ce membre est déjà un administrateur du groupe."
      }, {
        quoted: _0x390e05
      });
    }
    try {
      await _0xb5f28.groupParticipantsUpdate(_0x2a1464, [_0x43f556], "promote");
      _0xb5f28.sendMessage(_0x2a1464, {
        text: "@" + _0x43f556.split("@")[0] + " a été promu administrateur.",
        mentions: [_0x43f556]
      }, {
        quoted: _0x390e05
      });
    } catch (_0x5c9dc0) {
      console.error("Erreur :", _0x5c9dc0);
      _0xb5f28.sendMessage(_0x2a1464, {
        text: "Une erreur est survenue lors de la promotion."
      }, {
        quoted: _0x390e05
      });
    }
  } else {
    return _0xb5f28.sendMessage(_0x2a1464, {
      text: "Vous n'avez pas la permission d'utiliser cette commande."
    }, {
      quoted: _0x390e05
    });
  }
});
registerCommand({
  nom_cmd: "demote",
  classe: "Groupe",
  react: "⬇️",
  desc: "Retirer le rôle d'administrateur à un membre."
}, async (_0x34dd0a, _0xf6e3ec, _0x539fb6) => {
  const {
    verif_Groupe: _0x208ea8,
    getJid: _0x4f4275,
    auteur_Msg_Repondu: _0x51c66a,
    arg: _0x685db3,
    infos_Groupe: _0x1edebb,
    verif_Admin: _0x53f965,
    prenium_id: _0x2713d9,
    verif_Bot_Admin: _0x3b8f2a,
    dev_num: _0x2a6f95,
    dev_id: _0xd07607,
    ms: _0x577284
  } = _0x539fb6;
  if (!_0x208ea8) {
    return _0xf6e3ec.sendMessage(_0x34dd0a, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x577284
    });
  }
  if (_0x53f965 || _0x2713d9) {
    const _0x3801b4 = await _0x1edebb.participants;
    const _0x4be29e = _0x3801b4.filter(_0x1ff3f9 => _0x1ff3f9.admin).map(_0x3f0e75 => _0x3f0e75.jid);
    const _0x2d22ce = _0x51c66a || _0x685db3[0]?.includes("@") && _0x685db3[0].replace("@", "") + "@lid";
    const _0x514d7c = await _0x4f4275(_0x2d22ce, _0x34dd0a, _0xf6e3ec);
    if (!_0x3b8f2a) {
      return _0xf6e3ec.sendMessage(_0x34dd0a, {
        text: "Je dois être administrateur pour effectuer cette action."
      }, {
        quoted: _0x577284
      });
    }
    if (!_0x514d7c) {
      return _0xf6e3ec.sendMessage(_0x34dd0a, {
        text: "Veuillez mentionner un membre à rétrograder."
      }, {
        quoted: _0x577284
      });
    }
    if (!_0x3801b4.find(_0x2ae93b => _0x2ae93b.jid === _0x514d7c)) {
      return _0xf6e3ec.sendMessage(_0x34dd0a, {
        text: "Membre introuvable dans ce groupe."
      });
    }
    if (!_0x4be29e.includes(_0x514d7c)) {
      return _0xf6e3ec.sendMessage(_0x34dd0a, {
        text: "ce membre n'est pas un administrateur du groupe."
      }, {
        quoted: _0x577284
      });
    }
    if (_0x2a6f95.includes(_0x514d7c)) {
      return _0xf6e3ec.sendMessage(_0x34dd0a, {
        text: "Vous ne pouvez pas rétrograder un développeur."
      }, {
        quoted: _0x577284
      });
    }
    try {
      await _0xf6e3ec.groupParticipantsUpdate(_0x34dd0a, [_0x514d7c], "demote");
      _0xf6e3ec.sendMessage(_0x34dd0a, {
        text: "@" + _0x514d7c.split("@")[0] + " a été rétrogradé.",
        mentions: [_0x514d7c]
      }, {
        quoted: _0x577284
      });
    } catch (_0xd2bdd6) {
      console.error("Erreur :", _0xd2bdd6);
      _0xf6e3ec.sendMessage(_0x34dd0a, {
        text: "Une erreur est survenue lors de la rétrogradation."
      }, {
        quoted: _0x577284
      });
    }
  } else {
    return _0xf6e3ec.sendMessage(_0x34dd0a, {
      text: "Vous n'avez pas la permission d'utiliser cette commande."
    }, {
      quoted: _0x577284
    });
  }
});
registerCommand({
  nom_cmd: "gcreate",
  classe: "Groupe",
  react: "✅",
  desc: "Crée un groupe avec juste toi comme membre."
}, async (_0x23d5c2, _0x417567, {
  arg: _0x5ddeb7,
  prenium_id: _0xed52d,
  ms: _0x46a4b5
}) => {
  if (!_0xed52d) {
    return _0x417567.sendMessage(_0x23d5c2, {
      text: "❌ Vous n'avez pas les permissions pour créer un groupe."
    }, {
      quoted: _0x46a4b5
    });
  }
  if (_0x5ddeb7.length === 0) {
    return _0x417567.sendMessage(_0x23d5c2, {
      text: "⚠️ Veuillez fournir un nom pour le groupe. Exemple : *gcreate MonGroupe*"
    }, {
      quoted: _0x46a4b5
    });
  }
  const _0x54fc66 = _0x5ddeb7.join(" ");
  try {
    const _0x4d1595 = await _0x417567.groupCreate(_0x54fc66, []);
    await _0x417567.sendMessage(_0x4d1595.id, {
      text: "🎉 Groupe *\"" + _0x54fc66 + "\"* créé avec succès !"
    }, {
      quoted: _0x46a4b5
    });
  } catch (_0x413276) {
    console.error("❌ Erreur lors de la création du groupe :", _0x413276);
    await _0x417567.sendMessage(_0x23d5c2, {
      text: "❌ Une erreur est survenue lors de la création du groupe."
    }, {
      quoted: _0x46a4b5
    });
  }
});
registerCommand({
  nom_cmd: "gdesc",
  classe: "Groupe",
  react: "🔤",
  desc: "Permet de changer la description d'un groupe"
}, async (_0x2a87c5, _0x1cc932, _0x378578) => {
  const {
    verif_Groupe: _0x5113cb,
    verif_Admin: _0x7ac3de,
    verif_Bot_Admin: _0x26a492,
    msg_Repondu: _0x2ebde8,
    arg: _0x22cf77,
    ms: _0x11b5c7
  } = _0x378578;
  if (!_0x5113cb) {
    return _0x1cc932.sendMessage(_0x2a87c5, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x11b5c7
    });
  }
  if (_0x7ac3de && _0x26a492) {
    let _0x1813e2;
    if (_0x2ebde8) {
      _0x1813e2 = _0x2ebde8.conversation || _0x2ebde8.extendedTextMessage?.text;
    } else if (_0x22cf77) {
      _0x1813e2 = _0x22cf77.join(" ");
    } else {
      return _0x1cc932.sendMessage(_0x2a87c5, {
        text: "Entrez la nouvelle description."
      }, {
        quoted: _0x11b5c7
      });
    }
    await _0x1cc932.groupUpdateDescription(_0x2a87c5, _0x1813e2);
  } else {
    _0x1cc932.sendMessage(_0x2a87c5, {
      text: "je n'ai pas les droits requis pour exécuter cette commande"
    }, {
      quoted: _0x11b5c7
    });
  }
});
registerCommand({
  nom_cmd: "gname",
  classe: "Groupe",
  react: "🔤",
  desc: "Permet de changer le nom d'un groupe"
}, async (_0x1eb063, _0x1bbb4a, _0x46e862) => {
  const {
    verif_Groupe: _0x4cd1be,
    verif_Admin: _0x590b52,
    verif_Bot_Admin: _0x36fa48,
    msg_Repondu: _0x40c0b4,
    arg: _0x3e74a0,
    ms: _0x1202c3
  } = _0x46e862;
  if (!_0x4cd1be) {
    return _0x1bbb4a.sendMessage(_0x1eb063, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x1202c3
    });
  }
  if (_0x590b52 && _0x36fa48) {
    let _0x48cada;
    if (_0x40c0b4) {
      _0x48cada = _0x40c0b4.conversation || _0x40c0b4.extendedTextMessage?.text;
    } else if (_0x3e74a0) {
      _0x48cada = _0x3e74a0.join(" ");
    } else {
      return _0x1bbb4a.sendMessage(_0x1eb063, {
        text: "Entrez un nouveau nom"
      }, {
        quoted: _0x1202c3
      });
    }
    await _0x1bbb4a.groupUpdateSubject(_0x1eb063, _0x48cada);
  } else {
    _0x1bbb4a.sendMessage(_0x1eb063, {
      text: "je n'ai pas les droits requis pour exécuter cette commande"
    }, {
      quoted: _0x1202c3
    });
  }
});
registerCommand({
  nom_cmd: "close",
  classe: "Groupe",
  react: "✅",
  desc: "Seuls les admins peuvent envoyer des messages"
}, async (_0x1a70f2, _0x1aa64d, _0x524d0d) => {
  const {
    verif_Groupe: _0x27c84b,
    verif_Admin: _0x240d8f,
    verif_Bot_Admin: _0x4e248d,
    ms: _0x314024
  } = _0x524d0d;
  if (!_0x27c84b) {
    return _0x1aa64d.sendMessage(_0x1a70f2, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x314024
    });
  }
  if (!_0x240d8f || !_0x4e248d) {
    return _0x1aa64d.sendMessage(_0x1a70f2, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: _0x314024
    });
  }
  await _0x1aa64d.groupSettingUpdate(_0x1a70f2, "announcement");
  return _0x1aa64d.sendMessage(_0x1a70f2, {
    text: "Mode défini : seuls les admins peuvent envoyer des messages."
  }, {
    quoted: _0x314024
  });
});
registerCommand({
  nom_cmd: "open",
  classe: "Groupe",
  react: "✅",
  desc: "Tout le monde peut envoyer des messages"
}, async (_0x3d1bcd, _0x4fb019, _0x1eba30) => {
  const {
    verif_Groupe: _0x3e206d,
    verif_Admin: _0x181745,
    verif_Bot_Admin: _0x1702da,
    ms: _0x37cb5e
  } = _0x1eba30;
  if (!_0x3e206d) {
    return _0x4fb019.sendMessage(_0x3d1bcd, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x37cb5e
    });
  }
  if (!_0x181745 || !_0x1702da) {
    return _0x4fb019.sendMessage(_0x3d1bcd, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: _0x37cb5e
    });
  }
  await _0x4fb019.groupSettingUpdate(_0x3d1bcd, "not_announcement");
  return _0x4fb019.sendMessage(_0x3d1bcd, {
    text: "Mode défini : tout le monde peut envoyer des messages."
  }, {
    quoted: _0x37cb5e
  });
});
registerCommand({
  nom_cmd: "lock",
  classe: "Groupe",
  react: "✅",
  desc: "Tout le monde peut modifier les paramètres du groupe"
}, async (_0x29d702, _0xe32a24, _0x486c81) => {
  const {
    verif_Groupe: _0x22c7ef,
    verif_Admin: _0x245529,
    verif_Bot_Admin: _0x3a2e6d,
    ms: _0x2d4430
  } = _0x486c81;
  if (!_0x22c7ef) {
    return _0xe32a24.sendMessage(_0x29d702, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x2d4430
    });
  }
  if (!_0x245529 || !_0x3a2e6d) {
    return _0xe32a24.sendMessage(_0x29d702, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: _0x2d4430
    });
  }
  await _0xe32a24.groupSettingUpdate(_0x29d702, "unlocked");
  return _0xe32a24.sendMessage(_0x29d702, {
    text: "Mode défini : tout le monde peut modifier les paramètres du groupe."
  }, {
    quoted: _0x2d4430
  });
});
registerCommand({
  nom_cmd: "unlock",
  classe: "Groupe",
  react: "✅",
  desc: "Seuls les admins peuvent modifier les paramètres du groupe"
}, async (_0x32e384, _0x2ff174, _0x5012ce) => {
  const {
    verif_Groupe: _0x29497b,
    verif_Admin: _0x2feea3,
    verif_Bot_Admin: _0x2c79a8,
    ms: _0x28f1d4
  } = _0x5012ce;
  if (!_0x29497b) {
    return _0x2ff174.sendMessage(_0x32e384, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x28f1d4
    });
  }
  if (!_0x2feea3 || !_0x2c79a8) {
    return _0x2ff174.sendMessage(_0x32e384, {
      text: "Je n'ai pas les droits requis pour exécuter cette commande."
    }, {
      quoted: _0x28f1d4
    });
  }
  await _0x2ff174.groupSettingUpdate(_0x32e384, "locked");
  return _0x2ff174.sendMessage(_0x32e384, {
    text: "Mode défini : seuls les admins peuvent modifier les paramètres du groupe."
  }, {
    quoted: _0x28f1d4
  });
});
registerCommand({
  nom_cmd: "leave",
  classe: "Groupe",
  react: "😐",
  desc: "Commande pour quitter un groupe"
}, async (_0x6525e9, _0x4721b4, _0x4d2aef) => {
  const {
    prenium_id: _0x5699a6
  } = _0x4d2aef;
  if (!_0x5699a6) {
    return _0x4721b4.sendMessage(_0x6525e9, {
      text: "Vous n'avez pas les permissions requises pour quitter ce groupe."
    }, {
      quoted: _0x4d2aef.ms
    });
  }
  await _0x4721b4.sendMessage(_0x6525e9, {
    text: "Sayonara"
  }, {
    quoted: _0x4d2aef.ms
  });
  await _0x4721b4.groupLeave(_0x6525e9);
});
registerCommand({
  nom_cmd: "link",
  classe: "Groupe",
  react: "🔗",
  desc: "Permet d'obtenir le lien d'invitation d'un groupe"
}, async (_0x2ee2ea, _0x5d5457, _0x58b31f) => {
  const {
    verif_Groupe: _0x1a3ac1,
    verif_Admin: _0x593caf,
    verif_Bot_Admin: _0x8c70f5,
    ms: _0x5b1ae8
  } = _0x58b31f;
  if (!_0x1a3ac1) {
    return _0x5d5457.sendMessage(_0x2ee2ea, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x5b1ae8
    });
  }
  if (_0x593caf && _0x8c70f5) {
    const _0x11cdde = await _0x5d5457.groupInviteCode(_0x2ee2ea);
    await _0x5d5457.sendMessage(_0x2ee2ea, {
      text: "Lien d'invitation: https://chat.whatsapp.com/" + _0x11cdde
    }, {
      quoted: _0x5b1ae8
    });
  }
});
registerCommand({
  nom_cmd: "revoke",
  classe: "Groupe",
  react: "🔗",
  desc: "Réinitialise le lien d'invitation d'un groupe"
}, async (_0x3035cf, _0x4c3393, _0xe270b2) => {
  const {
    verif_Groupe: _0xde711d,
    verif_Admin: _0x2173cc,
    verif_Bot_Admin: _0x27ac37,
    ms: _0x5b9dae
  } = _0xe270b2;
  if (!_0xde711d) {
    return _0x4c3393.sendMessage(_0x3035cf, {
      text: "Commande utilisable uniquement dans les groupes."
    }, {
      quoted: _0x5b9dae
    });
  }
  if (_0x2173cc && _0x27ac37) {
    await _0x4c3393.groupRevokeInvite(_0x3035cf);
    await _0x4c3393.sendMessage(_0x3035cf, {
      text: "Le lien d'invitation a été Réinitialisé."
    }, {
      quoted: _0x5b9dae
    });
  }
});
registerCommand({
  nom_cmd: "ginfo",
  classe: "Groupe",
  react: "🔎",
  desc: "Affiche les informations du groupe"
}, async (_0x30d14a, _0x69b893, _0x59685d) => {
  const _0x201233 = await _0x69b893.groupMetadata(_0x30d14a);
  await _0x69b893.sendMessage(_0x30d14a, {
    text: "ID: " + _0x201233.id + "\nNom: " + _0x201233.subject + "\nDescription: " + _0x201233.desc
  }, {
    quoted: _0x59685d.ms
  });
});
registerCommand({
  nom_cmd: "join",
  classe: "Groupe",
  react: "😶‍🌫",
  desc: "Permet de rejoindre un groupe via un lien d'invitation"
}, async (_0x4638e9, _0x1688c3, _0x24f28f) => {
  const {
    prenium_id: _0x4e5647,
    arg: _0x3b96dd,
    ms: _0xb9f427
  } = _0x24f28f;
  if (!_0x4e5647) {
    return _0x1688c3.sendMessage(_0x4638e9, {
      text: "Vous n'avez pas les permissions requises pour rejoindre un groupe."
    }, {
      quoted: _0xb9f427
    });
  }
  if (!_0x3b96dd) {
    return _0x1688c3.sendMessage(_0x4638e9, {
      text: "Veuillez fournir le lien d'invitation du groupe."
    }, {
      quoted: _0xb9f427
    });
  }
  const _0x2b3413 = _0x3b96dd.join("");
  const _0x37ea24 = _0x2b3413.split("/")[3];
  await _0x1688c3.groupAcceptInvite(_0x37ea24);
  await _0x1688c3.sendMessage(_0x4638e9, {
    text: "Vous avez rejoint le groupe avec succès."
  }, {
    quoted: _0xb9f427
  });
});
async function gererDemandesIndividuellement(_0x3116bf, _0xdd8961, _0xe2c1c7, _0x569c47) {
  const {
    verif_Admin: _0x211444,
    prenium_id: _0x16ba11,
    verif_Bot_Admin: _0x500934,
    verif_Groupe: _0x3c3cbf,
    ms: _0x2fe389
  } = _0x569c47;
  if (!_0x3c3cbf) {
    return _0xe2c1c7.sendMessage(_0x3116bf, {
      text: "❌ Commande réservée aux groupes uniquement."
    }, {
      quoted: _0x2fe389
    });
  }
  if (!_0x211444 && !_0x16ba11) {
    return _0xe2c1c7.sendMessage(_0x3116bf, {
      text: "❌ Vous n'avez pas les permissions pour utiliser cette commande."
    }, {
      quoted: _0x2fe389
    });
  }
  if (!_0x500934) {
    return _0xe2c1c7.sendMessage(_0x3116bf, {
      text: "❌ Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: _0x2fe389
    });
  }
  try {
    const _0x5d8d31 = await _0xe2c1c7.groupRequestParticipantsList(_0x3116bf);
    if (!_0x5d8d31 || _0x5d8d31.length === 0) {
      return _0xe2c1c7.sendMessage(_0x3116bf, {
        text: "ℹ️ Aucune demande en attente."
      }, {
        quoted: _0x2fe389
      });
    }
    const _0x27443e = _0x5d8d31.map(_0x5080c7 => _0x5080c7.jid);
    let _0x5f372e = 0;
    for (const _0x200957 of _0x27443e) {
      try {
        await _0xe2c1c7.groupRequestParticipantsUpdate(_0x3116bf, [_0x200957], _0xdd8961);
        _0x5f372e++;
        await new Promise(_0xa32169 => setTimeout(_0xa32169, 500));
      } catch (_0x95e7ce) {
        console.error("❌ Erreur " + _0xdd8961 + " pour " + _0x200957 + " :", _0x95e7ce.message);
      }
    }
    const _0x26f72a = _0xdd8961 === "approve" ? "✅" : "❌";
    const _0x5b2856 = _0xdd8961 === "approve" ? "acceptée(s)" : "rejetée(s)";
    _0xe2c1c7.sendMessage(_0x3116bf, {
      text: _0x26f72a + " " + _0x5f372e + " demande(s) " + _0x5b2856 + ".",
      quoted: _0x2fe389
    });
  } catch (_0x403345) {
    console.error("❌ Erreur générale :", _0x403345);
    _0xe2c1c7.sendMessage(_0x3116bf, {
      text: "❌ Une erreur est survenue.",
      quoted: _0x2fe389
    });
  }
}
registerCommand({
  nom_cmd: "acceptall",
  classe: "Groupe",
  react: "✅",
  desc: "Accepte toutes les demandes une par une."
}, async (_0x50e1c9, _0x359bea, _0x1665c7) => {
  await gererDemandesIndividuellement(_0x50e1c9, "approve", _0x359bea, _0x1665c7);
});
registerCommand({
  nom_cmd: "rejectall",
  classe: "Groupe",
  react: "❌",
  desc: "Rejette toutes les demandes une par une."
}, async (_0x78d66e, _0x4574be, _0x4032da) => {
  await gererDemandesIndividuellement(_0x78d66e, "reject", _0x4574be, _0x4032da);
});
registerCommand({
  nom_cmd: "getpp",
  classe: "Groupe",
  react: "🔎",
  desc: "Affiche la pp d'un groupe",
  alias: ["gpp"]
}, async (_0x1819ba, _0x90122, _0x46c490) => {
  try {
    const _0x346c49 = await _0x90122.profilePictureUrl(_0x1819ba, "image");
    await _0x90122.sendMessage(_0x1819ba, {
      image: {
        url: _0x346c49
      }
    }, {
      quoted: _0x46c490.ms
    });
  } catch (_0x3fa973) {
    console.error("Erreur lors de l'obtention de la photo de profil :", _0x3fa973);
    await _0x90122.sendMessage(_0x1819ba, "Désolé, je n'ai pas pu obtenir la photo de profil du groupe.", {
      quoted: _0x46c490.ms
    });
  }
});
registerCommand({
  nom_cmd: "updatepp",
  classe: "Groupe",
  react: "🎨",
  desc: "Commande pour changer la photo de profil d'un groupe",
  alias: ["upp"]
}, async (_0x4e15e5, _0x58a3fb, _0x59ecd0) => {
  const {
    arg: _0xaeb376,
    verif_Groupe: _0x55a9aa,
    msg_Repondu: _0x177e31,
    verif_Admin: _0xb27e9e,
    prenium_id: _0xb4de8c,
    verif_Bot_Admin: _0x4b94e7,
    ms: _0x15f350
  } = _0x59ecd0;
  if (!_0xb27e9e && !_0xb4de8c) {
    return _0x58a3fb.sendMessage(_0x4e15e5, {
      text: "Vous n'avez pas les permissions requises pour modifier la photo du groupe."
    }, {
      quoted: _0x15f350
    });
  }
  if (!_0x4b94e7) {
    return _0x58a3fb.sendMessage(_0x4e15e5, {
      text: "Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: _0x15f350
    });
  }
  if (!_0x177e31 || !_0x177e31.imageMessage) {
    return _0x58a3fb.sendMessage(_0x4e15e5, {
      text: "Mentionnez une image."
    }, {
      quoted: _0x15f350
    });
  }
  try {
    if (_0x177e31?.imageMessage) {
      const _0x1bf898 = await _0x58a3fb.dl_save_media_ms(_0x177e31.imageMessage);
      await _0x58a3fb.updateProfilePicture(_0x4e15e5, {
        url: _0x1bf898
      });
      _0x58a3fb.sendMessage(_0x4e15e5, {
        text: "✅ La photo de profil du groupe a été mise à jour avec succès."
      }, {
        quoted: _0x15f350
      });
    }
  } catch (_0x255aab) {
    console.error("Erreur lors du changement de PP :", _0x255aab);
    _0x58a3fb.sendMessage(_0x4e15e5, {
      text: "❌ Une erreur est survenue lors de la modification de la photo du groupe."
    }, {
      quoted: _0x15f350
    });
  }
});
registerCommand({
  nom_cmd: "removepp",
  classe: "Groupe",
  react: "🗑️",
  desc: "Commande pour supprimer la photo de profil d'un groupe",
  alias: ["rpp"]
}, async (_0x393a20, _0x4379b3, _0x1ba005) => {
  const {
    verif_Groupe: _0x8f29a2,
    verif_Admin: _0x59bb4d,
    prenium_id: _0x17edfc,
    verif_Bot_Admin: _0xae964c,
    ms: _0x149ded
  } = _0x1ba005;
  if (!_0x59bb4d && !_0x17edfc) {
    return _0x4379b3.sendMessage(_0x393a20, {
      text: "Vous n'avez pas les permissions requises pour supprimer la photo du groupe."
    }, {
      quoted: _0x149ded
    });
  }
  if (!_0xae964c) {
    return _0x4379b3.sendMessage(_0x393a20, {
      text: "Je dois être administrateur pour effectuer cette action."
    }, {
      quoted: _0x149ded
    });
  }
  try {
    await _0x4379b3.removeProfilePicture(_0x393a20);
    _0x4379b3.sendMessage(_0x393a20, {
      text: "✅ La photo de profil du groupe a été supprimée avec succès."
    }, {
      quoted: _0x149ded
    });
  } catch (_0x47a6f9) {
    console.error("Erreur lors de la suppression de la PP :", _0x47a6f9);
    _0x4379b3.sendMessage(_0x393a20, {
      text: "❌ Une erreur est survenue lors de la suppression de la photo du groupe."
    }, {
      quoted: _0x149ded
    });
  }
});
registerCommand({
  nom_cmd: "warn",
  classe: "Groupe",
  react: "⚠️",
  desc: "Avertit un membre du groupe ou gère les avertissements."
}, async (_0x2e3a0c, _0xb51949, _0x5bfe8d) => {
  const {
    verif_Groupe: _0x17343f,
    getJid: _0x5bb1e8,
    infos_Groupe: _0x2b5051,
    arg: _0x202bac,
    verif_Admin: _0x38ff48,
    verif_Bot_Admin: _0x1661ed,
    prenium_id: _0x5bfcc7,
    dev_num: _0xc7b519,
    ms: _0x420561,
    auteur_Message: _0x12849e,
    auteur_Msg_Repondu: _0x3f7db0,
    repondre: _0x3baab7
  } = _0x5bfe8d;
  if (!_0x17343f) {
    return _0x3baab7("Commande utilisable uniquement dans les groupes.");
  }
  const _0x21b0e3 = await _0x2b5051.participants;
  const _0xb9500b = _0x21b0e3.filter(_0xa4bf6 => _0xa4bf6.admin).map(_0x9f46f8 => _0x9f46f8.phoneNumber);
  if (!_0x202bac[0] && !_0x3f7db0) {
    return _0x3baab7("⚠️ *Utilisation de la commande warn*\n\n• `warn @utilisateur` ou warn en répondant à un de ses messages : Ajouter un avertissement.\n• `warn reset @utilisateur` ou warn reset en répondant à un de ses messages : Réinitialiser les avertissements.\n• `warn limit <nombre>` : Définir la limite d'avertissements.");
  }
  if (_0x202bac[0] === "limit") {
    if (!_0x5bfcc7 && !_0x38ff48) {
      return _0x3baab7("Vous n'avez pas la permission.");
    }
    const _0x39f8bc = parseInt(_0x202bac[1]);
    if (isNaN(_0x39f8bc) || _0x39f8bc < 1) {
      return _0x3baab7("Veuillez entrer une limite valide.");
    }
    await setLimit(_0x39f8bc);
    return _0x3baab7("✅ Limite d'avertissements définie à " + _0x39f8bc + ".");
  }
  if (_0x202bac[0] === "reset") {
    if (!_0x5bfcc7 && !_0x38ff48) {
      return _0x3baab7("Vous n'avez pas la permission.");
    }
    const _0x3e89ea = _0x3f7db0 || _0x202bac[1]?.includes("@") && _0x202bac[1].replace("@", "") + "@lid";
    const _0x15ed69 = await _0x5bb1e8(_0x3e89ea, _0x2e3a0c, _0xb51949);
    await delWarn(_0x15ed69);
    return _0xb51949.sendMessage(_0x2e3a0c, {
      text: "✅ Les avertissements de @" + _0x15ed69.split("@")[0] + " ont été réinitialisés.",
      mentions: [_0x15ed69]
    }, {
      quoted: _0x420561
    });
  }
  const _0x392256 = _0x3f7db0 || _0x202bac[0]?.includes("@") && _0x202bac[0].replace("@", "") + "@lid";
  const _0x1dca1b = await _0x5bb1e8(_0x392256, _0x2e3a0c, _0xb51949);
  if (!_0x5bfcc7 && !_0x38ff48) {
    return _0x3baab7("Vous n'avez pas la permission.");
  }
  if (!_0x1661ed) {
    return _0x3baab7("Je dois être administrateur pour effectuer cette action.");
  }
  if (_0xb9500b.includes(_0x1dca1b)) {
    return _0x3baab7("Impossible d'avertir un administrateur.");
  }
  if (_0xc7b519.includes(_0x1dca1b)) {
    return _0x3baab7("Impossible d'avertir un développeur.");
  }
  const _0x3d22a7 = await getLimit();
  const _0x215229 = await setWarn(_0x1dca1b);
  const _0x3b5c29 = new Date().toLocaleString("fr-FR");
  await _0xb51949.sendMessage(_0x2e3a0c, {
    text: "⚠️ **Avertissement** ⚠️\n\n👤 Utilisateur : @" + _0x1dca1b.split("@")[0] + "\n📌 Warn par : @" + _0x12849e.split("@")[0] + "\n📅 Date : " + _0x3b5c29 + "\n📊 Total warns : " + _0x215229.count + "/" + _0x3d22a7,
    mentions: [_0x1dca1b, _0x12849e]
  }, {
    quoted: _0x420561
  });
  if (_0x215229.count >= _0x3d22a7) {
    try {
      await _0xb51949.groupParticipantsUpdate(_0x2e3a0c, [_0x1dca1b], "remove");
      _0xb51949.sendMessage(_0x2e3a0c, {
        text: "🚫 @" + _0x1dca1b.split("@")[0] + " a été exclu pour avoir atteint la limite d'avertissements.",
        mentions: [_0x1dca1b]
      }, {
        quoted: _0x420561
      });
      await delWarn(_0x1dca1b);
    } catch {
      _0x3baab7("Erreur lors de l'exclusion.");
    }
  }
});
registerCommand({
  nom_cmd: "vcf",
  classe: "Groupe",
  react: "📇",
  desc: "Enregistre les contacts de tous les membres du groupe dans un fichier VCF"
}, async (_0x44107a, _0x25b688, _0x5ab952) => {
  const {
    verif_Groupe: _0x1087e7,
    infos_Groupe: _0x490458,
    prenium_id: _0x3d24ea,
    ms: _0x32044d
  } = _0x5ab952;
  try {
    if (!_0x1087e7) {
      return _0x25b688.sendMessage(_0x44107a, {
        text: "Cette commande doit être utilisée dans un groupe."
      }, {
        quoted: _0x32044d
      });
    }
    if (!_0x3d24ea) {
      return _0x25b688.sendMessage(_0x44107a, {
        text: "Vous n'avez pas les permissions requises pour utiliser cette commande."
      }, {
        quoted: _0x32044d
      });
    }
    const _0xe49fdb = _0x490458;
    if (!_0xe49fdb || !_0xe49fdb.participants) {
      return _0x25b688.sendMessage(_0x44107a, {
        text: "Échec de la récupération des métadonnées du groupe ou de la liste des participants."
      }, {
        quoted: _0x32044d
      });
    }
    const _0x2389d8 = _0xe49fdb.participants;
    const _0x387400 = [];
    for (const _0xe99ce2 of _0x2389d8) {
      const _0xa375af = _0xe99ce2.jid;
      const _0x1d4841 = _0xa375af.split("@")[0];
      let _0x5951fa = _0x1d4841;
      try {
        const _0x2e509c = await Ranks.findOne({
          where: {
            id: _0xa375af
          }
        }).catch(() => null);
        if (_0x2e509c && _0x2e509c.name) {
          _0x5951fa = _0x2e509c.name;
        } else if (_0xe99ce2.notify) {
          _0x5951fa = _0xe99ce2.notify;
        }
      } catch {
        _0x5951fa = _0x1d4841;
      }
      _0x387400.push("BEGIN:VCARD\nVERSION:3.0\nFN:" + _0x5951fa + "\nTEL;TYPE=CELL:" + _0x1d4841 + "\nEND:VCARD");
    }
    const _0x3eb21d = _0xe49fdb.subject || "Groupe_" + _0x44107a.key.remoteJid.replace(/[@.]/g, "_");
    const _0x2cb91a = "contacts_groupe_" + _0x3eb21d + ".vcf";
    const _0x3d9335 = "./" + _0x2cb91a;
    fs.writeFileSync(_0x3d9335, _0x387400.join("\n"));
    const _0x3a01e6 = "*TOUS LES CONTACTS DES MEMBRES ENREGISTRÉS*\nGroupe : *" + _0x3eb21d + "*\nContacts : *" + _0x2389d8.length + "*";
    await _0x25b688.sendMessage(_0x44107a, {
      document: fs.readFileSync(_0x3d9335),
      mimetype: "text/vcard",
      filename: _0x2cb91a,
      caption: _0x3a01e6
    }, {
      quoted: _0x32044d
    });
    fs.unlinkSync(_0x3d9335);
  } catch (_0x15c72a) {
    console.error("Erreur lors du traitement de la commande vcf:", _0x15c72a);
    return _0x25b688.sendMessage(_0x44107a, {
      text: "Une erreur est survenue lors du traitement de la commande vcf."
    }, {
      quoted: _0x32044d
    });
  }
});
registerCommand({
  nom_cmd: "antilink",
  classe: "Groupe",
  react: "🔗",
  desc: "Active ou configure l'antilink pour les groupes"
}, async (_0x5fd21c, _0x93ada4, _0x234c62) => {
  const {
    ms: _0xb053f5,
    repondre: _0x22dc27,
    arg: _0x271171,
    verif_Groupe: _0x440b1a,
    verif_Admin: _0x40761e
  } = _0x234c62;
  try {
    if (!_0x440b1a) {
      return _0x22dc27("Cette commande ne fonctionne que dans les groupes");
    }
    if (!_0x40761e) {
      return _0x22dc27("Seuls les administrateurs peuvent utiliser cette commande");
    }
    const _0x5bb23c = _0x271171[0]?.toLowerCase();
    const _0x5c110b = ["on", "off"];
    const _0x518e6f = ["supp", "warn", "kick"];
    const [_0x4a6671] = await Antilink.findOrCreate({
      where: {
        id: _0x5fd21c
      },
      defaults: {
        id: _0x5fd21c,
        mode: "non",
        type: "supp"
      }
    });
    if (_0x5c110b.includes(_0x5bb23c)) {
      const _0x185958 = _0x5bb23c === "on" ? "oui" : "non";
      if (_0x4a6671.mode === _0x185958) {
        return _0x22dc27("L'Antilink est déjà " + _0x5bb23c);
      }
      _0x4a6671.mode = _0x185958;
      await _0x4a6671.save();
      return _0x22dc27("L'Antilink " + (_0x5bb23c === "on" ? "activé" : "désactivé") + " avec succès !");
    }
    if (_0x518e6f.includes(_0x5bb23c)) {
      if (_0x4a6671.mode !== "oui") {
        return _0x22dc27("Veuillez activer l'antilink d'abord en utilisant `antilink on`");
      }
      if (_0x4a6671.type === _0x5bb23c) {
        return _0x22dc27("L'action antilink est déjà définie sur " + _0x5bb23c);
      }
      _0x4a6671.type = _0x5bb23c;
      await _0x4a6671.save();
      return _0x22dc27("L'Action de l'antilink définie sur " + _0x5bb23c + " avec succès !");
    }
    return _0x22dc27("Utilisation :\nantilink on/off: Activer ou désactiver l'antilink\nantilink supp/warn/kick: Configurer l'action antilink");
  } catch (_0x1f37ab) {
    console.error("Erreur lors de la configuration d'antilink :", _0x1f37ab);
    _0x22dc27("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "antitag",
  classe: "Groupe",
  react: "🔗",
  desc: "Active ou configure l'antitag pour les groupes"
}, async (_0x773a41, _0x3dd1d7, _0x582ea4) => {
  const {
    ms: _0x57edd0,
    repondre: _0x5434a5,
    arg: _0x5f1207,
    verif_Groupe: _0x210196,
    verif_Admin: _0x2047b8
  } = _0x582ea4;
  try {
    if (!_0x210196) {
      return _0x5434a5("Cette commande ne fonctionne que dans les groupes");
    }
    if (!_0x2047b8) {
      return _0x5434a5("Seuls les administrateurs peuvent utiliser cette commande");
    }
    const _0x5d5bfb = _0x5f1207[0]?.toLowerCase();
    const _0x220f3d = ["on", "off"];
    const _0x3f7366 = ["supp", "warn", "kick"];
    const [_0x2274ad] = await Antitag.findOrCreate({
      where: {
        id: _0x773a41
      },
      defaults: {
        id: _0x773a41,
        mode: "non",
        type: "supp"
      }
    });
    if (_0x220f3d.includes(_0x5d5bfb)) {
      const _0x1b0d24 = _0x5d5bfb === "on" ? "oui" : "non";
      if (_0x2274ad.mode === _0x1b0d24) {
        return _0x5434a5("L'Antitag est déjà " + _0x5d5bfb);
      }
      _0x2274ad.mode = _0x1b0d24;
      await _0x2274ad.save();
      return _0x5434a5("L'Antitag " + (_0x5d5bfb === "on" ? "activé" : "désactivé") + " avec succès !");
    }
    if (_0x3f7366.includes(_0x5d5bfb)) {
      if (_0x2274ad.mode !== "oui") {
        return _0x5434a5("Veuillez activer l'antitag d'abord en utilisant `antitag on`");
      }
      if (_0x2274ad.type === _0x5d5bfb) {
        return _0x5434a5("L'action antitag est déjà définie sur " + _0x5d5bfb);
      }
      _0x2274ad.type = _0x5d5bfb;
      await _0x2274ad.save();
      return _0x5434a5("L'Action de l'antitag définie sur " + _0x5d5bfb + " avec succès !");
    }
    return _0x5434a5("Utilisation :\nantitag on/off: Activer ou désactiver l'antitag\nantitag supp/warn/kick: Configurer l'action antitag");
  } catch (_0x410034) {
    console.error("Erreur lors de la configuration d'antitag :", _0x410034);
    _0x5434a5("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "antispam",
  classe: "Groupe",
  react: "🔗",
  desc: "Active ou configure l'antispam pour les groupes"
}, async (_0xecacd0, _0x18bf63, _0x52e3ac) => {
  const {
    repondre: _0x468079,
    arg: _0x4a5de8,
    verif_Groupe: _0x2345a6,
    verif_Admin: _0x3379ac
  } = _0x52e3ac;
  try {
    if (!_0x2345a6) {
      return _0x468079("❌ Cette commande fonctionne uniquement dans les groupes.");
    }
    if (!_0x3379ac) {
      return _0x468079("❌ Seuls les administrateurs peuvent utiliser cette commande.");
    }
    const _0x488413 = _0x4a5de8[0]?.toLowerCase();
    const _0x309cc1 = ["on", "off"];
    const _0x246550 = ["supp", "warn", "kick"];
    const [_0xcfb371] = await Antispam.findOrCreate({
      where: {
        id: _0xecacd0
      },
      defaults: {
        id: _0xecacd0,
        mode: "non",
        type: "supp"
      }
    });
    if (_0x309cc1.includes(_0x488413)) {
      const _0x100dc3 = _0x488413 === "on" ? "oui" : "non";
      if (_0xcfb371.mode === _0x100dc3) {
        return _0x468079("L'Antispam est déjà " + _0x488413 + ".");
      }
      _0xcfb371.mode = _0x100dc3;
      await _0xcfb371.save();
      return _0x468079("L'Antispam a été " + (_0x488413 === "on" ? "activé" : "désactivé") + " avec succès !");
    }
    if (_0x246550.includes(_0x488413)) {
      if (_0xcfb371.mode !== "oui") {
        return _0x468079("❌ Veuillez activer l'antispam d'abord avec `antispam on`.");
      }
      if (_0xcfb371.type === _0x488413) {
        return _0x468079("⚠️ L'action antispam est déjà définie sur " + _0x488413 + ".");
      }
      _0xcfb371.type = _0x488413;
      await _0xcfb371.save();
      return _0x468079("✅ L'action antispam est maintenant définie sur " + _0x488413 + ".");
    }
    return _0x468079("Utilisation :\nantispam on/off : Activer ou désactiver l'antispam.\nantispam supp/warn/kick : Configurer l'action antispam.");
  } catch (_0x10122c) {
    console.error("Erreur lors de la configuration d'antispam :", _0x10122c);
    return _0x468079("❌ Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "antibot",
  classe: "Groupe",
  react: "🔗",
  desc: "Active ou configure l'antibot pour les groupes"
}, async (_0x5b2a33, _0x5097dc, _0x492264) => {
  const {
    repondre: _0x145722,
    arg: _0x5432d3,
    verif_Groupe: _0x13844d,
    verif_Admin: _0x204166
  } = _0x492264;
  try {
    if (!_0x13844d) {
      return _0x145722("❌ Cette commande fonctionne uniquement dans les groupes.");
    }
    if (!_0x204166) {
      return _0x145722("❌ Seuls les administrateurs peuvent utiliser cette commande.");
    }
    const _0x5682d5 = _0x5432d3[0]?.toLowerCase();
    const _0x34a342 = ["on", "off"];
    const _0x9cd29e = ["supp", "warn", "kick"];
    const [_0x1bfe6b] = await Antibot.findOrCreate({
      where: {
        id: _0x5b2a33
      },
      defaults: {
        id: _0x5b2a33,
        mode: "non",
        type: "supp"
      }
    });
    if (_0x34a342.includes(_0x5682d5)) {
      const _0x4c4e8d = _0x5682d5 === "on" ? "oui" : "non";
      if (_0x1bfe6b.mode === _0x4c4e8d) {
        return _0x145722("L'Antibot est déjà " + _0x5682d5 + ".");
      }
      _0x1bfe6b.mode = _0x4c4e8d;
      await _0x1bfe6b.save();
      return _0x145722("L'Antibot a été " + (_0x5682d5 === "on" ? "activé" : "désactivé") + " avec succès !");
    }
    if (_0x9cd29e.includes(_0x5682d5)) {
      if (_0x1bfe6b.mode !== "oui") {
        return _0x145722("❌ Veuillez activer l'antibot d'abord avec `antibot on`.");
      }
      if (_0x1bfe6b.type === _0x5682d5) {
        return _0x145722("⚠️ L'action antibot est déjà définie sur " + _0x5682d5 + ".");
      }
      _0x1bfe6b.type = _0x5682d5;
      await _0x1bfe6b.save();
      return _0x145722("✅ L'action antibot est maintenant définie sur " + _0x5682d5 + ".");
    }
    return _0x145722("Utilisation :\nantibot on/off : Activer ou désactiver l'antibot.\nantibot supp/warn/kick : Configurer l'action antibot.");
  } catch (_0x5b0197) {
    console.error("Erreur lors de la configuration d'antibot :", _0x5b0197);
    return _0x145722("❌ Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "antimentiongc",
  classe: "Groupe",
  react: "📢",
  desc: "Active ou configure l'antimention pour les groupes"
}, async (_0x30564f, _0x1d4807, _0x2e4232) => {
  const {
    ms: _0x3df16b,
    repondre: _0x3bd4cd,
    arg: _0x52a98d,
    verif_Groupe: _0x313d7e,
    verif_Admin: _0x84b97e
  } = _0x2e4232;
  try {
    if (!_0x313d7e) {
      return _0x3bd4cd("Cette commande ne fonctionne que dans les groupes.");
    }
    if (!_0x84b97e) {
      return _0x3bd4cd("Seuls les administrateurs peuvent utiliser cette commande.");
    }
    const _0x2da043 = _0x52a98d[0]?.toLowerCase();
    const _0x59d2bf = ["on", "off"];
    const _0x56c3ed = ["supp", "warn", "kick"];
    const [_0x49fac2] = await Antimention.findOrCreate({
      where: {
        id: _0x30564f
      },
      defaults: {
        id: _0x30564f,
        mode: "non",
        type: "supp"
      }
    });
    if (_0x59d2bf.includes(_0x2da043)) {
      const _0x4b133b = _0x2da043 === "on" ? "oui" : "non";
      if (_0x49fac2.mode === _0x4b133b) {
        return _0x3bd4cd("L'antimention est déjà " + _0x2da043 + ".");
      }
      _0x49fac2.mode = _0x4b133b;
      await _0x49fac2.save();
      return _0x3bd4cd("L'antimention a été " + (_0x2da043 === "on" ? "activé" : "désactivé") + " avec succès.");
    }
    if (_0x56c3ed.includes(_0x2da043)) {
      if (_0x49fac2.mode !== "oui") {
        return _0x3bd4cd("Veuillez d'abord activer l'antimention avec `antimention on`.");
      }
      if (_0x49fac2.type === _0x2da043) {
        return _0x3bd4cd("L'action antimention est déjà définie sur " + _0x2da043 + ".");
      }
      _0x49fac2.type = _0x2da043;
      await _0x49fac2.save();
      return _0x3bd4cd("Action antimention définie sur " + _0x2da043 + " avec succès.");
    }
    return _0x3bd4cd("Utilisation :\n- antimention on/off : Activer ou désactiver l'antimention\n- antimention supp/warn/kick : Définir l'action à appliquer");
  } catch (_0x3ebcf9) {
    console.error("Erreur lors de la configuration d'antimention :", _0x3ebcf9);
    return _0x3bd4cd("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
const welcomeGoodbyeCmd = _0xd6cdc0 => {
  const _0x360f43 = _0xd6cdc0 === "welcome";
  registerCommand({
    nom_cmd: _0xd6cdc0,
    classe: "Groupe",
    react: "👋",
    desc: _0x360f43 ? "Configurer ou activer les messages de bienvenue" : "Configurer ou activer les messages d’adieu"
  }, async (_0x571edc, _0x455eb3, {
    repondre: _0x554e0e,
    arg: _0x42fa42,
    verif_Admin: _0x597012,
    verif_Groupe: _0xe6510f,
    auteur_Message: _0x1dba8d
  }) => {
    try {
      if (!_0xe6510f) {
        return _0x554e0e("❌ Commande utilisable uniquement dans les groupes.");
      }
      if (!_0x597012) {
        return _0x554e0e("❌ Seuls les administrateurs peuvent utiliser cette commande.");
      }
      const _0x3508ef = _0x42fa42[0]?.toLowerCase();
      const [_0x1533fb] = await GroupSettings.findOrCreate({
        where: {
          id: _0x571edc
        },
        defaults: {
          id: _0x571edc,
          [_0xd6cdc0]: "non"
        }
      });
      const [_0x40d2b0] = await Events2.findOrCreate({
        where: {
          id: _0x571edc
        },
        defaults: {
          id: _0x571edc
        }
      });
      const _0x3cfa9b = _0x360f43 ? "welcome_msg" : "goodbye_msg";
      const _0x24785b = _0x40d2b0[_0x3cfa9b];
      if (!_0x42fa42.length) {
        return _0x554e0e("🛠️ *Utilisation de la commande " + _0xd6cdc0 + "* :\n\n1️⃣ *" + _0xd6cdc0 + " on/off* – Active ou désactive les messages de " + (_0x360f43 ? "bienvenue" : "d’adieu") + ".\n2️⃣ *" + _0xd6cdc0 + " get* – Affiche le message " + (_0x360f43 ? "de bienvenue" : "d’adieu") + " personnalisé.\n3️⃣ *" + _0xd6cdc0 + " Votre message...* – Définir un message personnalisé.\n4️⃣ *" + _0xd6cdc0 + " défaut* – Réinitialise le message " + (_0x360f43 ? "de bienvenue" : "d’adieu") + ".\n\n📌 Variables disponibles :\n@user → Mention du membre\n#groupe → Nom du groupe\n#membre → Nombre de membres\n#desc → Description du groupe\n#url=lien → Utilise un média (image, vidéo)\n#pp → Utilise la photo de profil du membre\n#gpp → Utilise la photo de profil du groupe\n#audio=url → Utilise un audio");
      }
      if (["on", "off"].includes(_0x3508ef)) {
        const _0x25b7c3 = _0x3508ef === "on" ? "oui" : "non";
        if (_0x1533fb[_0xd6cdc0] === _0x25b7c3) {
          return _0x554e0e("ℹ️ Le message " + (_0x360f43 ? "de bienvenue" : "d’adieu") + " est déjà " + (_0x3508ef === "on" ? "activé" : "désactivé") + ".");
        }
        _0x1533fb[_0xd6cdc0] = _0x25b7c3;
        await _0x1533fb.save();
        return _0x554e0e("✅ Message " + (_0x360f43 ? "de bienvenue" : "d’adieu") + " " + (_0x3508ef === "on" ? "activé" : "désactivé") + " avec succès.");
      }
      if (_0x3508ef === "get") {
        if (!_0x24785b || !_0x24785b.trim()) {
          return _0x554e0e("⚠️ Aucun message " + (_0x360f43 ? "de bienvenue" : "d’adieu") + " personnalisé configuré.");
        }
        const _0x49b6ad = await _0x455eb3.groupMetadata(_0x571edc);
        const _0x23630a = _0x49b6ad.subject || "Groupe";
        const _0x518c8d = _0x49b6ad.participants.length;
        const _0x1912f6 = _0x49b6ad.desc || "Aucune description";
        const _0x5cef22 = "@" + _0x1dba8d.split("@")[0];
        let _0x5ed690 = _0x24785b;
        const _0x2301a6 = _0x5ed690.match(/#url=(\S+)/i);
        const _0x2565e3 = _0x5ed690.match(/#audio=(\S+)/i);
        const _0x3e4398 = _0x5ed690.includes("#pp");
        const _0x542009 = _0x5ed690.includes("#gpp");
        _0x5ed690 = _0x5ed690.replace(/#url=\S+/i, "").replace(/#audio=\S+/i, "").replace(/#pp/gi, "").replace(/#gpp/gi, "").replace(/@user/gi, _0x5cef22).replace(/#groupe/gi, _0x23630a).replace(/#membre/gi, _0x518c8d).replace(/#desc/gi, _0x1912f6);
        let _0xb1192e = false;
        if (_0x2301a6) {
          const _0x1084eb = _0x2301a6[1];
          const _0x5f38a1 = _0x1084eb.split(".").pop().toLowerCase();
          let _0x461748 = null;
          if (["mp4", "mov", "webm"].includes(_0x5f38a1)) {
            _0x461748 = {
              video: {
                url: _0x1084eb
              },
              caption: _0x5ed690.trim(),
              gifPlayback: true,
              mentions: [_0x1dba8d]
            };
          } else if (["jpg", "jpeg", "png", "webp"].includes(_0x5f38a1)) {
            _0x461748 = {
              image: {
                url: _0x1084eb
              },
              caption: _0x5ed690.trim(),
              mentions: [_0x1dba8d]
            };
          }
          if (_0x461748) {
            await _0x455eb3.sendMessage(_0x571edc, _0x461748);
            _0xb1192e = true;
          }
        } else if (_0x3e4398) {
          try {
            const _0x4d1c1f = await _0x455eb3.profilePictureUrl(_0x1dba8d, "image");
            await _0x455eb3.sendMessage(_0x571edc, {
              image: {
                url: _0x4d1c1f
              },
              caption: _0x5ed690.trim(),
              mentions: [_0x1dba8d]
            });
            _0xb1192e = true;
          } catch {}
        } else if (_0x542009) {
          try {
            const _0x7a24fe = await _0x455eb3.profilePictureUrl(_0x571edc, "image");
            await _0x455eb3.sendMessage(_0x571edc, {
              image: {
                url: _0x7a24fe
              },
              caption: _0x5ed690.trim(),
              mentions: [_0x1dba8d]
            });
            _0xb1192e = true;
          } catch {}
        }
        if (_0x2565e3) {
          const _0x1eb6b7 = _0x2565e3[1];
          await _0x455eb3.sendMessage(_0x571edc, {
            audio: {
              url: _0x1eb6b7
            },
            mimetype: "audio/mpeg"
          });
          _0xb1192e = true;
        }
        if (!_0xb1192e && _0x5ed690.trim()) {
          await _0x455eb3.sendMessage(_0x571edc, {
            text: _0x5ed690.trim(),
            mentions: [_0x1dba8d]
          });
        }
        return;
      }
      if (_0x3508ef === "défaut" || _0x3508ef === "default") {
        if (!_0x24785b) {
          return _0x554e0e("ℹ️ Aucun message " + (_0x360f43 ? "de bienvenue" : "d’adieu") + " n’est actuellement défini.");
        }
        _0x40d2b0[_0x3cfa9b] = null;
        await _0x40d2b0.save();
        return _0x554e0e("✅ Message " + (_0x360f43 ? "de bienvenue" : "d’adieu") + " réinitialisé aux paramètres par défaut.");
      }
      const _0xd0422f = _0x42fa42.join(" ").trim();
      if (!_0xd0422f) {
        return _0x554e0e("❌ Le message ne peut pas être vide.");
      }
      _0x40d2b0[_0x3cfa9b] = _0xd0422f;
      await _0x40d2b0.save();
      return _0x554e0e("✅ Nouveau message " + (_0x360f43 ? "de bienvenue" : "d’adieu") + " enregistré avec succès !");
    } catch (_0x22a649) {
      console.error("❌ Erreur " + _0xd6cdc0 + " :", _0x22a649);
      _0x554e0e("❌ Une erreur s’est produite.");
    }
  });
};
welcomeGoodbyeCmd("welcome");
welcomeGoodbyeCmd("goodbye");
const commands = [{
  nom_cmd: "antipromote",
  colonne: "antipromote",
  react: "🛑",
  desc: "Active ou désactive l'antipromotion",
  table: GroupSettings
}, {
  nom_cmd: "antidemote",
  colonne: "antidemote",
  react: "🛑",
  desc: "Active ou désactive l'antidémotion",
  table: GroupSettings
}, {
  nom_cmd: "promotealert",
  colonne: "promoteAlert",
  react: "⚠️",
  desc: "Active ou désactive l'alerte de promotion",
  table: Events2
}, {
  nom_cmd: "demotealert",
  colonne: "demoteAlert",
  react: "⚠️",
  desc: "Active ou désactive l'alerte de rétrogradation",
  table: Events2
}];
commands.forEach(({
  nom_cmd: _0x2195e2,
  colonne: _0x422f8f,
  react: _0x243bde,
  desc: _0x4ef257,
  table: _0xae62c3
}) => {
  registerCommand({
    nom_cmd: _0x2195e2,
    classe: "Groupe",
    react: _0x243bde,
    desc: _0x4ef257
  }, async (_0x317418, _0x120978, {
    repondre: _0xf758f2,
    arg: _0x1e7ba0,
    verif_Groupe: _0x525b43,
    verif_Admin: _0x5df51e
  }) => {
    try {
      if (!_0x525b43) {
        return _0xf758f2("❌ Cette commande fonctionne uniquement dans les groupes.");
      }
      if (!_0x5df51e) {
        return _0xf758f2("❌ Seuls les administrateurs peuvent utiliser cette commande.");
      }
      const _0xa3b93e = _0x1e7ba0[0]?.toLowerCase();
      const _0x3606aa = ["on", "off"];
      const [_0x314901] = await _0xae62c3.findOrCreate({
        where: {
          id: _0x317418
        },
        defaults: {
          id: _0x317418,
          [_0x422f8f]: "non"
        }
      });
      if (_0x3606aa.includes(_0xa3b93e)) {
        const _0x455f48 = _0xa3b93e === "on" ? "oui" : "non";
        if (_0x314901[_0x422f8f] === _0x455f48) {
          return _0xf758f2("ℹ️ " + _0x2195e2 + " est déjà " + _0xa3b93e + ".");
        }
        _0x314901[_0x422f8f] = _0x455f48;
        await _0x314901.save();
        return _0xf758f2("✅ " + _0x2195e2 + " " + (_0xa3b93e === "on" ? "activé" : "désactivé") + " avec succès.");
      }
      return _0xf758f2("🛠️ Utilisation :\n> " + _0x2195e2 + " on/off – " + _0x4ef257.toLowerCase());
    } catch (_0x1785d4) {
      console.error("Erreur lors de la configuration de " + _0x2195e2 + " :", _0x1785d4);
      return _0xf758f2("❌ Une erreur s'est produite lors de l'exécution de la commande.");
    }
  });
});