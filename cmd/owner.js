const {
  exec
} = require("child_process");
const {
  registerCommand
} = require("../lib/commands");
const {
  Bans,
  OnlyAdmins
} = require("../database/ban");
const {
  Sudo
} = require("../database/sudo");
const config = require("../set");
const axios = require("axios");
const {
  Sticker,
  StickerTypes
} = require("wa-sticker-formatter");
const cheerio = require("cheerio");
const {
  WA_CONF,
  WA_CONF2
} = require("../database/wa_conf");
const {
  ChatbotConf
} = require("../database/chatbot");
const path = require("path");
const fs = require("fs");
const {
  saveSecondSession,
  getSecondAllSessions,
  deleteSecondSession
} = require("../database/connect");
const {
  setMention,
  delMention,
  getMention
} = require("../database/mention");
const {
  set_stick_cmd,
  del_stick_cmd,
  get_stick_cmd
} = require("../database/stick_cmd");
const {
  set_cmd,
  del_cmd,
  list_cmd
} = require("../database/public_private_cmd");
const {
  Plugin
} = require("../database/plugin");
const {
  extractNpmModules,
  installModules,
  reloadCommands
} = require("../lib/plugin");
const {
  Levelup
} = require("../database/rank");
registerCommand({
  nom_cmd: "delete",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprimer un message.",
  alias: ["del", "dlt"]
}, async (_0x3c3dec, _0x129443, _0x3c7225) => {
  const {
    msg_Repondu: _0x23a5ba,
    ms: _0x4f8801,
    auteur_Msg_Repondu: _0x5dd6e0,
    mtype: _0x250318,
    verif_Admin: _0x475234,
    verif_Bot_Admin: _0x383ae0,
    verif_Groupe: _0xbfe3e0,
    dev_num: _0x38dbf1,
    dev_id: _0x3fd55b,
    repondre: _0x919ad3,
    id_Bot: _0x1cbe7b,
    isSudo: _0x532d0b
  } = _0x3c7225;
  if (!_0x23a5ba) {
    return _0x919ad3("Veuillez répondre à un message pour le supprimer.");
  }
  if (_0x38dbf1.includes(_0x5dd6e0) && !_0x3fd55b) {
    return _0x919ad3("Vous ne pouvez pas supprimer le message d'un développeur.");
  }
  if (_0xbfe3e0) {
    if (!_0x475234) {
      return _0x919ad3("Vous devez être administrateur pour supprimer un message dans le groupe.");
    }
    if (!_0x383ae0) {
      return _0x919ad3("Je dois être administrateur pour effectuer cette action.");
    }
  } else if (!_0x532d0b) {
    return _0x919ad3("Seuls les utilisateurs sudo peuvent utiliser cette commande en privé.");
  }
  try {
    const _0x31a76b = {
      remoteJid: _0x3c3dec,
      fromMe: _0x5dd6e0 == _0x1cbe7b,
      id: _0x4f8801.message?.[_0x250318]?.contextInfo?.stanzaId,
      ...(_0xbfe3e0 && {
        participant: _0x5dd6e0
      })
    };
    if (!_0x31a76b.id) {
      return _0x919ad3("Impossible de trouver l'ID du message à supprimer.");
    }
    await _0x129443.sendMessage(_0x3c3dec, {
      delete: _0x31a76b
    });
  } catch (_0x14ff3b) {
    _0x919ad3("Erreur : " + _0x14ff3b.message);
  }
});
registerCommand({
  nom_cmd: "clear",
  classe: "Owner",
  react: "🧹",
  desc: "Supprime tous les messages dans cette discussion"
}, async (_0x368f9b, _0x3e9cde, _0x10c20d) => {
  const {
    repondre: _0x57dfce,
    ms: _0x9f6899,
    isSudo: _0x4af01a
  } = _0x10c20d;
  try {
    if (!_0x4af01a) {
      return _0x57dfce("🔒 Vous n'avez pas le droit d'exécuter cette commande.");
    }
    await _0x3e9cde.chatModify({
      delete: true,
      lastMessages: [{
        key: _0x9f6899.key,
        messageTimestamp: _0x9f6899.messageTimestamp
      }]
    }, _0x368f9b);
    await _0x57dfce("🧹 Tous les messages ont été supprimés avec succès.");
  } catch (_0x596dec) {
    console.error("Erreur lors de la suppression :", _0x596dec);
    _0x57dfce("❌ Erreur lors de la suppression des messages.");
  }
});
registerCommand({
  nom_cmd: "block",
  classe: "Owner",
  react: "⛔",
  desc: "Bloquer un utilisateur par son JID"
}, async (_0x4b15c8, _0x173e5e, _0x2c37e2) => {
  const {
    repondre: _0x2a282f,
    verif_Groupe: _0x44d1a3,
    isSudo: _0x2936bd
  } = _0x2c37e2;
  if (_0x44d1a3) {
    return _0x2a282f("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
  }
  if (!_0x2936bd) {
    return _0x2a282f("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    await _0x173e5e.updateBlockStatus(_0x4b15c8, "block");
    _0x2a282f("✅ Utilisateur bloqué avec succès.");
  } catch (_0x11c29c) {
    console.error("Erreur block:", _0x11c29c);
    _0x2a282f("Impossible de bloquer l'utilisateur.");
  }
});
registerCommand({
  nom_cmd: "deblock",
  classe: "Owner",
  react: "✅",
  desc: "Débloquer un utilisateur par son JID"
}, async (_0xeca892, _0x328d8a, _0x5cf304) => {
  const {
    verif_Groupe: _0x4a2636,
    repondre: _0x2cfdd9,
    isSudo: _0x28f67d
  } = _0x5cf304;
  if (_0x4a2636) {
    return _0x2cfdd9("Veuillez vous diriger dans l'inbox de la personne à bloquer.");
  }
  if (!_0x28f67d) {
    return _0x2cfdd9("Vous n'avez pas le droit d'exécuter cette commande.");
  }
  try {
    await _0x328d8a.updateBlockStatus(_0xeca892, "unblock");
    _0x2cfdd9("✅ Utilisateur débloqué avec succès.");
  } catch (_0x3632d4) {
    console.error("Erreur deblock:", _0x3632d4);
    _0x2cfdd9("Impossible de débloquer l'utilisateur.");
  }
});
registerCommand({
  nom_cmd: "ban",
  classe: "Owner",
  react: "🚫",
  desc: "Bannir un utilisateur des commandes du bot"
}, async (_0x45c7d4, _0xaa623d, _0x5965b3) => {
  const {
    repondre: _0x253aa3,
    ms: _0xe150cc,
    arg: _0x4ac158,
    getJid: _0x1d0892,
    auteur_Msg_Repondu: _0x45fb7f,
    isSudo: _0x2e3f17,
    dev_num: _0x23644d
  } = _0x5965b3;
  try {
    if (!_0x2e3f17) {
      return _0xaa623d.sendMessage(ms_org, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: _0xe150cc
      });
    }
    const _0x1da3be = _0x45fb7f || _0x4ac158[0]?.includes("@") && _0x4ac158[0].replace("@", "") + "@lid";
    const _0x1225e8 = await _0x1d0892(_0x1da3be, _0x45c7d4, _0xaa623d);
    if (!_0x1225e8) {
      return _0x253aa3("Mentionnez un utilisateur valide à bannir.");
    }
    if (_0x23644d.includes(_0x1225e8)) {
      return _0xaa623d.sendMessage(_0x45c7d4, {
        text: "Vous ne pouvez pas bannir un développeur."
      }, {
        quoted: _0xe150cc
      });
    }
    const [_0x5ce572] = await Bans.findOrCreate({
      where: {
        id: _0x1225e8
      },
      defaults: {
        id: _0x1225e8,
        type: "user"
      }
    });
    if (!_0x5ce572._options.isNewRecord) {
      return _0x253aa3("Cet utilisateur est déjà banni !");
    }
    return _0xaa623d.sendMessage(_0x45c7d4, {
      text: "Utilisateur @" + _0x1225e8.split("@")[0] + " banni avec succès.",
      mentions: [_0x1225e8]
    }, {
      quoted: _0xe150cc
    });
  } catch (_0x179058) {
    console.error("Erreur lors de l'exécution de la commande ban :", _0x179058);
    return _0x253aa3("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "levelup",
  classe: "Owner",
  react: "⚙️",
  desc: "Activer ou désactiver le message de level up"
}, async (_0x4fbb29, _0x16ae48, _0x23c673) => {
  const {
    repondre: _0x319a49,
    ms: _0x261a67,
    arg: _0x5d9dc0
  } = _0x23c673;
  try {
    if (!_0x5d9dc0[0]) {
      return _0x319a49("Veuillez préciser 'on' ou 'off'.");
    }
    const _0x2032e0 = _0x5d9dc0[0].toLowerCase();
    if (_0x2032e0 !== "on" && _0x2032e0 !== "off") {
      return _0x319a49("Argument invalide, utilisez 'on' ou 'off'.");
    }
    const _0x2b2806 = _0x2032e0 === "on" ? "oui" : "non";
    let _0x451e38 = await Levelup.findOne({
      where: {
        id: 1
      }
    });
    if (!_0x451e38) {
      _0x451e38 = await Levelup.create({
        id: 1,
        levelup: _0x2b2806
      });
    } else {
      _0x451e38.levelup = _0x2b2806;
      await _0x451e38.save();
    }
    return _0x16ae48.sendMessage(_0x4fbb29, {
      text: "Le message de level up est maintenant " + (_0x2b2806 === "oui" ? "activé" : "désactivé") + "."
    }, {
      quoted: _0x261a67
    });
  } catch (_0x536344) {
    console.error("Erreur commande levelup :", _0x536344);
    return _0x319a49("Une erreur est survenue.");
  }
});
registerCommand({
  nom_cmd: "anticall",
  classe: "Owner",
  react: "📵",
  desc: "Active ou désactive le blocage automatique des appels."
}, async (_0xb9120, _0x120325, _0x540825) => {
  const {
    repondre: _0x272c81,
    ms: _0x502444,
    arg: _0x53040f,
    isSudo: _0x449f4a
  } = _0x540825;
  if (!_0x449f4a) {
    return _0x120325.sendMessage(_0xb9120, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: _0x502444
    });
  }
  const _0x3ae47f = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!_0x53040f[0]) {
    const _0x2ff610 = _0x3ae47f && _0x3ae47f.anticall === "oui" ? "activé" : "désactivé";
    return _0x120325.sendMessage(_0xb9120, {
      text: "Etat actuel de anticall : " + _0x2ff610 + "\nUsage : anticall on/off"
    }, {
      quoted: _0x502444
    });
  }
  const _0x474b4f = _0x53040f[0].toLowerCase();
  if (_0x474b4f !== "on" && _0x474b4f !== "off") {
    return _0x272c81("Merci d'utiliser : anticall on ou anticall off");
  }
  if (!_0x3ae47f) {
    await WA_CONF2.create({
      id: "1",
      anticall: _0x474b4f === "on" ? "oui" : "non"
    });
    return _0x120325.sendMessage(_0xb9120, {
      text: "anticall est maintenant " + (_0x474b4f === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: _0x502444
    });
  }
  if (_0x474b4f === "on" && _0x3ae47f.anticall === "oui" || _0x474b4f === "off" && _0x3ae47f.anticall === "non") {
    return _0x120325.sendMessage(_0xb9120, {
      text: "anticall est déjà " + (_0x474b4f === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: _0x502444
    });
  }
  _0x3ae47f.anticall = _0x474b4f === "on" ? "oui" : "non";
  await _0x3ae47f.save();
  return _0x120325.sendMessage(_0xb9120, {
    text: "anticall est maintenant " + (_0x474b4f === "on" ? "activé" : "désactivé") + "."
  }, {
    quoted: _0x502444
  });
});
registerCommand({
  nom_cmd: "lecture_msg",
  classe: "Owner",
  react: "📖",
  desc: "Active ou désactive la lecture automatique des messages."
}, async (_0x113c52, _0x3da3b2, _0x51d60c) => {
  const {
    repondre: _0x24432a,
    ms: _0x3fc69c,
    arg: _0x56ebc2,
    isSudo: _0x1d8820
  } = _0x51d60c;
  if (!_0x1d8820) {
    return _0x3da3b2.sendMessage(_0x113c52, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: _0x3fc69c
    });
  }
  const _0x418834 = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!_0x56ebc2[0]) {
    const _0x21e02b = _0x418834 && _0x418834.autoread_msg === "oui" ? "activé" : "désactivé";
    return _0x3da3b2.sendMessage(_0x113c52, {
      text: "Etat actuel de lecture_msg : " + _0x21e02b + "\nUsage : lecture_msg on/off"
    }, {
      quoted: _0x3fc69c
    });
  }
  const _0x12fae7 = _0x56ebc2[0].toLowerCase();
  if (_0x12fae7 !== "on" && _0x12fae7 !== "off") {
    return _0x24432a("Merci d'utiliser : lecture_msg on ou lecture_msg off");
  }
  if (!_0x418834) {
    await WA_CONF2.create({
      id: "1",
      autoread_msg: _0x12fae7 === "on" ? "oui" : "non"
    });
    return _0x3da3b2.sendMessage(_0x113c52, {
      text: "lecture_msg est maintenant " + (_0x12fae7 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: _0x3fc69c
    });
  }
  if (_0x12fae7 === "on" && _0x418834.autoread_msg === "oui" || _0x12fae7 === "off" && _0x418834.autoread_msg === "non") {
    return _0x3da3b2.sendMessage(_0x113c52, {
      text: "lecture_msg est déjà " + (_0x12fae7 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: _0x3fc69c
    });
  }
  _0x418834.autoread_msg = _0x12fae7 === "on" ? "oui" : "non";
  await _0x418834.save();
  return _0x3da3b2.sendMessage(_0x113c52, {
    text: "lecture_msg est maintenant " + (_0x12fae7 === "on" ? "activé" : "désactivé") + "."
  }, {
    quoted: _0x3fc69c
  });
});
registerCommand({
  nom_cmd: "react_msg",
  classe: "Owner",
  react: "🤖",
  desc: "Active ou désactive la réaction automatique aux messages."
}, async (_0x175b45, _0x3c9740, _0x26f23d) => {
  const {
    repondre: _0x37353d,
    ms: _0xc6fcf5,
    arg: _0x405d4d,
    isSudo: _0x434f80
  } = _0x26f23d;
  if (!_0x434f80) {
    return _0x3c9740.sendMessage(_0x175b45, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: _0xc6fcf5
    });
  }
  const _0x1dbe47 = await WA_CONF2.findOne({
    where: {
      id: "1"
    }
  });
  if (!_0x405d4d[0]) {
    const _0xb36be3 = _0x1dbe47 && _0x1dbe47.autoreact_msg === "oui" ? "activé" : "désactivé";
    return _0x3c9740.sendMessage(_0x175b45, {
      text: "Etat actuel de react_msg : " + _0xb36be3 + "\nUsage : react_msg on/off"
    }, {
      quoted: _0xc6fcf5
    });
  }
  const _0x435b64 = _0x405d4d[0].toLowerCase();
  if (_0x435b64 !== "on" && _0x435b64 !== "off") {
    return _0x37353d("Merci d'utiliser : react_msg on ou react_msg off");
  }
  if (!_0x1dbe47) {
    await WA_CONF2.create({
      id: "1",
      autoreact_msg: _0x435b64 === "on" ? "oui" : "non"
    });
    return _0x3c9740.sendMessage(_0x175b45, {
      text: "react_msg est maintenant " + (_0x435b64 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: _0xc6fcf5
    });
  }
  if (_0x435b64 === "on" && _0x1dbe47.autoreact_msg === "oui" || _0x435b64 === "off" && _0x1dbe47.autoreact_msg === "non") {
    return _0x3c9740.sendMessage(_0x175b45, {
      text: "react_msg est déjà " + (_0x435b64 === "on" ? "activé" : "désactivé") + "."
    }, {
      quoted: _0xc6fcf5
    });
  }
  _0x1dbe47.autoreact_msg = _0x435b64 === "on" ? "oui" : "non";
  await _0x1dbe47.save();
  return _0x3c9740.sendMessage(_0x175b45, {
    text: "react_msg est maintenant " + (_0x435b64 === "on" ? "activé" : "désactivé") + "."
  }, {
    quoted: _0xc6fcf5
  });
});
registerCommand({
  nom_cmd: "deban",
  classe: "Owner",
  react: "🚫",
  desc: "Débannir un utilisateur des commandes du bot"
}, async (_0x2660f2, _0x57c41d, _0x50c60d) => {
  const {
    repondre: _0x5ada82,
    arg: _0x3536e0,
    getJid: _0x20ea83,
    auteur_Msg_Repondu: _0x41c83a,
    isSudo: _0x315464,
    ms: _0x5d1357
  } = _0x50c60d;
  try {
    if (!_0x315464) {
      return _0x57c41d.sendMessage(ms_org, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: _0x5d1357
      });
    }
    const _0x1a42e3 = _0x41c83a || _0x3536e0[0]?.includes("@") && _0x3536e0[0].replace("@", "") + "@lid";
    const _0x3bcfa5 = await _0x20ea83(_0x1a42e3, _0x2660f2, _0x57c41d);
    if (!_0x3bcfa5) {
      return _0x5ada82("Mentionnez un utilisateur valide à débannir.");
    }
    const _0x14eaaf = await Bans.destroy({
      where: {
        id: _0x3bcfa5,
        type: "user"
      }
    });
    if (_0x14eaaf === 0) {
      return _0x5ada82("Cet utilisateur n'est pas banni.");
    }
    return _0x57c41d.sendMessage(_0x2660f2, {
      text: "Utilisateur @" + _0x3bcfa5.split("@")[0] + " débanni avec succès.",
      mentions: [_0x3bcfa5]
    }, {
      quoted: _0x5d1357
    });
  } catch (_0x24333d) {
    console.error("Erreur lors de l'exécution de la commande debannir :", _0x24333d);
    return _0x5ada82("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "bangroup",
  classe: "Owner",
  react: "🚫",
  desc: "Bannir un groupe des commandes du bot"
}, async (_0x470817, _0x12c543, _0x15981d) => {
  const {
    repondre: _0x44553c,
    arg: _0x2856f9,
    verif_Groupe: _0x1e8ba4,
    isSudo: _0x20eb3e,
    ms: _0x4e5c38
  } = _0x15981d;
  try {
    if (!_0x20eb3e) {
      return _0x12c543.sendMessage(ms_org, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: _0x4e5c38
      });
    }
    if (!_0x1e8ba4) {
      return _0x44553c("Cette commande fonctionne uniquement dans les groupes.");
    }
    const _0x570b4b = _0x470817;
    if (!_0x570b4b) {
      return _0x44553c("Impossible de récupérer l'identifiant du groupe.");
    }
    const [_0x1dcd42] = await Bans.findOrCreate({
      where: {
        id: _0x570b4b
      },
      defaults: {
        id: _0x570b4b,
        type: "group"
      }
    });
    if (!_0x1dcd42._options.isNewRecord) {
      return _0x44553c("Ce groupe est déjà banni !");
    }
    return _0x44553c("Groupe banni avec succès.");
  } catch (_0x4ccfea) {
    console.error("Erreur lors de l'exécution de la commande bangroup :", _0x4ccfea);
    return _0x44553c("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "debangroup",
  classe: "Owner",
  react: "🚫",
  desc: "Débannir un groupe des commandes du bot"
}, async (_0x358573, _0x13eb57, _0x2f2ff6) => {
  const {
    repondre: _0x2c9bc2,
    arg: _0x1e80a7,
    verif_Groupe: _0x3379ce,
    isSudo: _0x105b49,
    ms: _0x2ef26f
  } = _0x2f2ff6;
  try {
    if (!_0x105b49) {
      return _0x13eb57.sendMessage(ms_org, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: _0x2ef26f
      });
    }
    if (!_0x3379ce) {
      return _0x2c9bc2("Cette commande fonctionne uniquement dans les groupes.");
    }
    const _0x2e5010 = _0x358573;
    if (!_0x2e5010) {
      return _0x2c9bc2("Impossible de récupérer l'identifiant du groupe.");
    }
    const _0x2c5a04 = await Bans.destroy({
      where: {
        id: _0x2e5010,
        type: "group"
      }
    });
    if (_0x2c5a04 === 0) {
      return _0x2c9bc2("Ce groupe n'est pas banni.");
    }
    return _0x2c9bc2("Groupe débanni avec succès.");
  } catch (_0x3e2928) {
    console.error("Erreur lors de l'exécution de la commande debangroup :", _0x3e2928);
    return _0x2c9bc2("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "onlyadmins",
  react: "🛡️",
  desc: "Activer ou désactiver le mode only-admins dans un groupe",
  classe: "Owner"
}, async (_0x147f5e, _0x4a3b93, _0x4c2ab3) => {
  const {
    repondre: _0x516bef,
    arg: _0x12fd6b,
    verif_Groupe: _0x22bb40,
    ms: _0x284729,
    isSudo: _0x42348a
  } = _0x4c2ab3;
  try {
    if (!_0x22bb40) {
      return _0x516bef("❌ Cette commande ne fonctionne que dans un groupe.");
    }
    if (!_0x42348a) {
      return _0x4a3b93.sendMessage(_0x147f5e, {
        text: "⛔ Vous n'avez pas l'autorisation d'exécuter cette commande."
      }, {
        quoted: _0x284729
      });
    }
    const _0x19a44c = _0x12fd6b[0]?.toLowerCase();
    if (!["add", "del"].includes(_0x19a44c)) {
      return _0x516bef("❓ Utilisation : `onlyadmins add` pour activer, `onlyadmins del` pour désactiver.");
    }
    const _0x404bc1 = _0x147f5e;
    const _0x285fd9 = await OnlyAdmins.findOne({
      where: {
        id: _0x404bc1
      }
    });
    if (_0x19a44c === "add") {
      if (_0x285fd9) {
        return _0x516bef("⚠️ Le mode only-admin est **déjà activé** pour ce groupe.");
      }
      await OnlyAdmins.create({
        id: _0x404bc1
      });
      return _0x516bef("✅ Mode only-admin **activé** pour ce groupe.");
    }
    if (_0x19a44c === "del") {
      if (!_0x285fd9) {
        return _0x516bef("⚠️ Ce groupe **n'était pas en mode only-admin**.");
      }
      await OnlyAdmins.destroy({
        where: {
          id: _0x404bc1
        }
      });
      return _0x516bef("❌ Mode only-admin **désactivé** pour ce groupe.");
    }
  } catch (_0x3167b7) {
    console.error("Erreur onlyadmins:", _0x3167b7);
    return _0x516bef("❌ Une erreur s'est produite. Veuillez réessayer.");
  }
});
registerCommand({
  nom_cmd: "setsudo",
  classe: "Owner",
  react: "🔒",
  desc: "Ajoute un utilisateur dans la liste des utilisateurs sudo."
}, async (_0x33d070, _0x1fd0ff, _0x3d1815) => {
  const {
    repondre: _0x49e07a,
    arg: _0x3e998e,
    getJid: _0x205f72,
    auteur_Msg_Repondu: _0x4dfd23,
    isSudo: _0x378f7b,
    ms: _0x112e10
  } = _0x3d1815;
  if (!_0x378f7b) {
    return _0x1fd0ff.sendMessage(_0x33d070, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: _0x112e10
    });
  }
  const _0x44ef59 = _0x4dfd23 || _0x3e998e[0]?.includes("@") && _0x3e998e[0].replace("@", "") + "@lid";
  const _0x3974ad = await _0x205f72(_0x44ef59, _0x33d070, _0x1fd0ff);
  if (!_0x3974ad) {
    return _0x49e07a("Veuillez mentionner un utilisateur valide pour l'ajouter à la liste sudo.");
  }
  try {
    const [_0x300f9b] = await Sudo.findOrCreate({
      where: {
        id: _0x3974ad
      },
      defaults: {
        id: _0x3974ad
      }
    });
    if (!_0x300f9b._options.isNewRecord) {
      return _0x1fd0ff.sendMessage(_0x33d070, {
        text: "L'utilisateur @" + _0x3974ad.split("@")[0] + " est déjà un utilisateur sudo.",
        mentions: [_0x3974ad]
      }, {
        quoted: _0x112e10
      });
    }
    return _0x1fd0ff.sendMessage(_0x33d070, {
      text: "Utilisateur @" + _0x3974ad.split("@")[0] + " ajouté avec succès en tant qu'utilisateur sudo.",
      mentions: [_0x3974ad]
    }, {
      quoted: _0x112e10
    });
  } catch (_0x37023d) {
    console.error("Erreur lors de l'exécution de la commande setsudo :", _0x37023d);
    return _0x49e07a("Une erreur est survenue lors de l'ajout de l'utilisateur sudo.");
  }
});
registerCommand({
  nom_cmd: "sudolist",
  classe: "Owner",
  react: "📋",
  desc: "Affiche la liste des utilisateurs sudo."
}, async (_0x473836, _0x18cacc, _0x37c8d1) => {
  const {
    repondre: _0xa39776,
    isSudo: _0x59e377,
    ms: _0x3186ba
  } = _0x37c8d1;
  if (!_0x59e377) {
    return _0x18cacc.sendMessage(_0x473836, {
      text: "Vous n'avez pas la permission d'exécuter cette commande."
    }, {
      quoted: _0x3186ba
    });
  }
  try {
    const _0x49cad1 = await Sudo.findAll();
    if (!_0x49cad1.length) {
      return _0xa39776("Aucun utilisateur sudo n'est actuellement enregistré.");
    }
    const _0x1558d3 = _0x49cad1.map((_0x3902ec, _0xf59b0b) => "🔹 *" + (_0xf59b0b + 1) + ".* @" + _0x3902ec.id.split("@")[0]).join("\n");
    const _0x578ab9 = "✨ *Liste des utilisateurs sudo* ✨\n\n*Total*: " + _0x49cad1.length + "\n\n" + _0x1558d3;
    return _0x18cacc.sendMessage(_0x473836, {
      text: _0x578ab9,
      mentions: _0x49cad1.map(_0xae3491 => _0xae3491.id)
    }, {
      quoted: _0x3186ba
    });
  } catch (_0x5a02d1) {
    console.error("Erreur lors de l'exécution de la commande sudolist :", _0x5a02d1);
    return _0xa39776("Une erreur est survenue lors de l'affichage de la liste des utilisateurs sudo.");
  }
});
registerCommand({
  nom_cmd: "delsudo",
  classe: "Owner",
  react: "❌",
  desc: "Supprime un utilisateur de la liste des utilisateurs sudo."
}, async (_0x3bbdef, _0x14c084, _0x2e0699) => {
  const {
    repondre: _0x2826f8,
    getJid: _0x161715,
    arg: _0x22d455,
    auteur_Msg_Repondu: _0x1289d0,
    isSudo: _0x31ebdb,
    ms: _0x5bc9ce
  } = _0x2e0699;
  if (!_0x31ebdb) {
    return _0x14c084.sendMessage(_0x3bbdef, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: _0x5bc9ce
    });
  }
  const _0x4e3cfd = _0x1289d0 || _0x22d455[0]?.includes("@") && _0x22d455[0].replace("@", "") + "@lid";
  const _0x426164 = await _0x161715(_0x4e3cfd, _0x3bbdef, _0x14c084);
  if (!_0x426164) {
    return _0x2826f8("Veuillez mentionner un utilisateur");
  }
  try {
    const _0x30ba64 = await Sudo.destroy({
      where: {
        id: _0x426164
      }
    });
    if (_0x30ba64 === 0) {
      return _0x14c084.sendMessage(_0x3bbdef, {
        text: "L'utilisateur @" + _0x426164.split("@")[0] + " n'est pas un utilisateur sudo.",
        mentions: [_0x426164]
      }, {
        quoted: _0x5bc9ce
      });
    }
    return _0x14c084.sendMessage(_0x3bbdef, {
      text: "Utilisateur @" + _0x426164.split("@")[0] + " supprimé avec succès de la liste sudo.",
      mentions: [_0x426164]
    }, {
      quoted: _0x5bc9ce
    });
  } catch (_0x264141) {
    console.error("Erreur lors de l'exécution de la commande delsudo :", _0x264141);
    return _0x2826f8("Une erreur est survenue lors de la suppression de l'utilisateur de la liste sudo.");
  }
});
registerCommand({
  nom_cmd: "tgs",
  classe: "Owner",
  react: "🔍",
  desc: "Importe des stickers Telegram sur WhatsApp"
}, async (_0x95bee1, _0x7d7045, _0x48f1d2) => {
  const {
    repondre: _0xb5b74d,
    arg: _0xcf7a03,
    isSudo: _0x3080a2,
    ms: _0x4c25a0
  } = _0x48f1d2;
  if (!_0x3080a2) {
    return _0x7d7045.sendMessage(_0x95bee1, {
      text: "❌ Vous n'avez pas le droit d'exécuter cette commande."
    });
  }
  if (!_0xcf7a03[0]) {
    return _0xb5b74d("Merci de fournir un lien de stickers Telegram valide.");
  }
  const _0x5a9146 = _0xcf7a03[0];
  const _0x19eca2 = _0x5a9146.split("/addstickers/")[1];
  if (!_0x19eca2) {
    return _0xb5b74d("❌ Lien incorrect.");
  }
  const _0xe882f0 = "8408302436:AAFAKAtwCOywhSW0vqm9VNK71huTi8pUp1k";
  const _0x10b972 = "https://api.telegram.org/bot" + _0xe882f0 + "/getStickerSet?name=" + _0x19eca2;
  try {
    const {
      data: _0x3c34fd
    } = await axios.get(_0x10b972);
    const _0x488f14 = _0x3c34fd.result.stickers;
    if (!_0x488f14 || _0x488f14.length === 0) {
      return _0xb5b74d("Aucun sticker trouvé dans cet ensemble.");
    }
    _0xb5b74d("✅ Nom du pack: " + _0x3c34fd.result.name + "\nType : " + (_0x3c34fd.result.is_animated ? "animés" : "statiques") + "\nTotal : " + _0x488f14.length + " stickers\n");
    for (const _0x58ca6a of _0x488f14) {
      const _0xdd1c63 = await axios.get("https://api.telegram.org/bot" + _0xe882f0 + "/getFile?file_id=" + _0x58ca6a.file_id);
      const _0x3d95c9 = await axios({
        method: "get",
        url: "https://api.telegram.org/file/bot" + _0xe882f0 + "/" + _0xdd1c63.data.result.file_path,
        responseType: "arraybuffer"
      });
      const _0x1a7ae6 = new Sticker(_0x3d95c9.data, {
        pack: config.STICKER_PACK_NAME,
        author: config.STICKER_AUTHOR_NAME,
        type: StickerTypes.FULL,
        quality: 10
      });
      await _0x7d7045.sendMessage(_0x95bee1, {
        sticker: await _0x1a7ae6.toBuffer()
      }, {
        quoted: _0x4c25a0
      });
    }
    _0xb5b74d("✅ Tous les stickers ont été envoyés.");
  } catch (_0x4c25b4) {
    console.error(_0x4c25b4);
    _0xb5b74d("❌ Une erreur s'est produite lors du téléchargement des stickers.");
  }
});
registerCommand({
  nom_cmd: "fetch_sc",
  classe: "Owner",
  react: "💻",
  desc: "Extrait les données d'une page web, y compris HTML, CSS, JavaScript et médias"
}, async (_0x173516, _0x38a83e, _0x11bba1) => {
  const {
    arg: _0x2187f,
    isSudo: _0x81d6a2,
    ms: _0x5037bc
  } = _0x11bba1;
  const _0x42870a = _0x2187f[0];
  if (!_0x81d6a2) {
    return _0x38a83e.sendMessage(_0x173516, {
      text: "Vous n'avez pas le droit d'exécuter cette commande."
    }, {
      quoted: _0x5037bc
    });
  }
  if (!_0x42870a) {
    return _0x38a83e.sendMessage(_0x173516, {
      text: "Veuillez fournir un lien valide. Le bot extraira le HTML, CSS, JavaScript, et les médias de la page web."
    }, {
      quoted: _0x5037bc
    });
  }
  if (!/^https?:\/\//i.test(_0x42870a)) {
    return _0x38a83e.sendMessage(_0x173516, {
      text: "Veuillez fournir une URL valide commençant par http:// ou https://"
    }, {
      quoted: _0x5037bc
    });
  }
  try {
    const _0x4b1b9c = await axios.get(_0x42870a);
    const _0x115ba0 = _0x4b1b9c.data;
    const _0x1e8cc7 = cheerio.load(_0x115ba0);
    const _0x5bdb19 = [];
    _0x1e8cc7("img[src], video[src], audio[src]").each((_0x516df5, _0x45c321) => {
      let _0x2221c8 = _0x1e8cc7(_0x45c321).attr("src");
      if (_0x2221c8) {
        _0x5bdb19.push(_0x2221c8);
      }
    });
    const _0x4e64fa = [];
    _0x1e8cc7("link[rel=\"stylesheet\"]").each((_0x556769, _0x2d8f04) => {
      let _0x407409 = _0x1e8cc7(_0x2d8f04).attr("href");
      if (_0x407409) {
        _0x4e64fa.push(_0x407409);
      }
    });
    const _0x5e0b4c = [];
    _0x1e8cc7("script[src]").each((_0x24f452, _0x19b54d) => {
      let _0x1ab6c2 = _0x1e8cc7(_0x19b54d).attr("src");
      if (_0x1ab6c2) {
        _0x5e0b4c.push(_0x1ab6c2);
      }
    });
    await _0x38a83e.sendMessage(_0x173516, {
      text: "**Contenu HTML**:\n\n" + _0x115ba0
    }, {
      quoted: _0x5037bc
    });
    if (_0x4e64fa.length > 0) {
      for (const _0x1f85cc of _0x4e64fa) {
        const _0x5a0fd0 = await axios.get(new URL(_0x1f85cc, _0x42870a));
        const _0x589de5 = _0x5a0fd0.data;
        await _0x38a83e.sendMessage(_0x173516, {
          text: "**Contenu du fichier CSS**:\n\n" + _0x589de5
        }, {
          quoted: _0x5037bc
        });
      }
    } else {
      await _0x38a83e.sendMessage(_0x173516, {
        text: "Aucun fichier CSS externe trouvé."
      }, {
        quoted: _0x5037bc
      });
    }
    if (_0x5e0b4c.length > 0) {
      for (const _0x24f565 of _0x5e0b4c) {
        const _0xd14381 = await axios.get(new URL(_0x24f565, _0x42870a));
        const _0x45eaf2 = _0xd14381.data;
        await _0x38a83e.sendMessage(_0x173516, {
          text: "**Contenu du fichier JavaScript**:\n\n" + _0x45eaf2
        }, {
          quoted: _0x5037bc
        });
      }
    } else {
      await _0x38a83e.sendMessage(_0x173516, {
        text: "Aucun fichier JavaScript externe trouvé."
      }, {
        quoted: _0x5037bc
      });
    }
    if (_0x5bdb19.length > 0) {
      await _0x38a83e.sendMessage(_0x173516, {
        text: "**Fichiers médias trouvés**:\n" + _0x5bdb19.join("\n")
      }, {
        quoted: _0x5037bc
      });
    } else {
      await _0x38a83e.sendMessage(_0x173516, {
        text: "Aucun fichier média (images, vidéos, audios) trouvé."
      }, {
        quoted: _0x5037bc
      });
    }
  } catch (_0x5996da) {
    console.error(_0x5996da);
    return _0x38a83e.sendMessage(_0x173516, {
      text: "Une erreur est survenue lors de l'extraction du contenu de la page web."
    }, {
      quoted: _0x5037bc
    });
  }
});
registerCommand({
  nom_cmd: "antidelete",
  classe: "Owner",
  react: "🔗",
  desc: "Configure ou désactive l'Antidelete"
}, async (_0x5ad756, _0x353bc4, _0x4bdef9) => {
  const {
    ms: _0x58a983,
    repondre: _0x5bcc73,
    arg: _0x1df635,
    isSudo: _0x1700a8
  } = _0x4bdef9;
  try {
    if (!_0x1700a8) {
      return _0x5bcc73("🔒 Cette commande est réservée aux utilisateurs sudo.");
    }
    const _0x26f880 = _0x1df635[0]?.toLowerCase();
    const _0x41d812 = _0x1df635[1]?.toLowerCase();
    const _0x4bf1b5 = {
      1: "pm",
      2: "gc",
      3: "status",
      4: "all",
      5: "pm/gc",
      6: "pm/status",
      7: "gc/status"
    };
    const [_0xc25d1d] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        antidelete: "non"
      }
    });
    if (_0x26f880 === "off") {
      if (_0xc25d1d.antidelete === "non") {
        return _0x5bcc73("❌ L'antidelete est déjà désactivé.");
      }
      _0xc25d1d.antidelete = "non";
      await _0xc25d1d.save();
      return _0x5bcc73("✅ Antidelete désactivé avec succès.");
    }
    if (["pv", "org"].includes(_0x26f880)) {
      return _0x5bcc73("❌ Usage invalide.\nUtilisez : antidelete <numéro> [pv|org]\nExemple : antidelete 3 org");
    }
    const _0x20f1bf = parseInt(_0x26f880);
    if (!_0x4bf1b5[_0x20f1bf]) {
      return _0x5bcc73("📌 *Utilisation de la commande antidelete :*\n\n🔹 antidelete off : Désactiver l'antidelete\n\n🔹 antidelete 1 : Activer sur les messages privés (pm)\n🔹 antidelete 2 : Activer sur les messages de groupe (gc)\n🔹 antidelete 3 : Activer sur les statuts (status)\n🔹 antidelete 4 : Activer sur tous les types (all)\n🔹 antidelete 5 : Activer sur pm + gc\n🔹 antidelete 6 : Activer sur pm + status\n🔹 antidelete 7 : Activer sur gc + status\n\n➕ Vous pouvez ajouter `pv` ou `org` après le numéro pour choisir où renvoyer le message supprimé.\n   Exemple : `antidelete 3 org`\n\n✳️ Par défaut, si rien n’est précisé, c’est `pv` (inbox) qui est utilisé.");
    }
    if (_0x41d812 && !["pv", "org"].includes(_0x41d812)) {
      return _0x5bcc73("❌ Mode invalide. Utilisez soit 'pv' soit 'org' après le numéro.");
    }
    let _0x5a366a = _0x4bf1b5[_0x20f1bf];
    if (_0x41d812) {
      _0x5a366a += "-" + _0x41d812;
    } else {
      _0x5a366a += "-pv";
    }
    if (_0xc25d1d.antidelete === _0x5a366a) {
      return _0x5bcc73("⚠️ L'antidelete est déjà configuré sur '" + _0x5a366a + "'.");
    }
    _0xc25d1d.antidelete = _0x5a366a;
    await _0xc25d1d.save();
    return _0x5bcc73("✅ Antidelete configuré sur : *" + _0x5a366a + "*");
  } catch (_0x470a9f) {
    console.error("Erreur antidelete :", _0x470a9f);
    _0x5bcc73("❌ Une erreur s'est produite lors de la configuration de l'antidelete.");
  }
});
registerCommand({
  nom_cmd: "jid",
  classe: "Owner",
  react: "🆔",
  desc: "Fournit le JID d'une personne ou d'un groupe"
}, async (_0x559a7f, _0x477074, _0x4221c4) => {
  const {
    repondre: _0x3af74,
    auteur_Msg_Repondu: _0x50950a,
    isSudo: _0x48463d,
    msg_Repondu: _0x3f1976,
    arg: _0x1285ea,
    getJid: _0x55e0b6
  } = _0x4221c4;
  if (!_0x48463d) {
    return _0x3af74("Seuls les utilisateurs sudo peuvent utiliser cette commande");
  }
  let _0x29131d = _0x50950a || _0x1285ea[0]?.includes("@") && _0x1285ea[0].replace("@", "") + "@lid";
  let _0x3f3463;
  if (_0x29131d) {
    _0x3f3463 = await _0x55e0b6(_0x29131d, _0x559a7f, _0x477074);
  } else {
    _0x3f3463 = _0x559a7f;
  }
  _0x3af74(_0x3f3463);
});
registerCommand({
  nom_cmd: "restart",
  classe: "Owner",
  desc: "Redémarre le bot"
}, async (_0x29d16a, _0x7b4c50, _0x5e835b) => {
  const {
    ms: _0x1bf223,
    isSudo: _0xad6041
  } = _0x5e835b;
  if (!_0xad6041) {
    return _0x7b4c50.sendMessage(_0x29d16a, {
      text: "Vous n'avez pas la permission d'utiliser cette commande."
    }, {
      quoted: _0x1bf223
    });
  }
  await _0x7b4c50.sendMessage(_0x29d16a, {
    text: "♻️ Redémarrage du bot en cours..."
  }, {
    quoted: _0x1bf223
  });
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});
registerCommand({
  nom_cmd: "connect",
  classe: "Owner",
  desc: "Connexion d’un compte avec le bot via session_id"
}, async (_0xcfb566, _0x3c2ba0, _0x127e16) => {
  try {
    const {
      arg: _0x4a2d0a,
      ms: _0x5cfd1d,
      isSudo: _0x3f82e7,
      repondre: _0x1db258,
      auteur_Message: _0x35ca51
    } = _0x127e16;
    if (!_0x3f82e7) {
      return _0x3c2ba0.sendMessage(_0xcfb566, {
        text: "🚫 Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: _0x5cfd1d
      });
    }
    if (!_0x4a2d0a || !_0x4a2d0a[0]) {
      return _0x3c2ba0.sendMessage(_0xcfb566, {
        text: "❗ Exemple : .connect SESSION_ID"
      }, {
        quoted: _0x5cfd1d
      });
    }
    const _0x1554e8 = _0x4a2d0a[0].trim();
    console.log("🌀 Tentative de connexion par " + _0x35ca51 + " pour session_id: " + _0x1554e8);
    const _0x4a39b8 = await saveSecondSession(_0x1554e8);
    if (!_0x4a39b8) {
      return _0x1db258("❌ La session est invalide ou n’a pas pu être enregistrée.");
    }
    return _0x3c2ba0.sendMessage(_0xcfb566, {
      text: "✅ Tentative de connexion enregistrée pour la session : " + _0x1554e8
    }, {
      quoted: _0x5cfd1d
    });
  } catch (_0x1517f6) {
    return _0x3c2ba0.sendMessage(_0xcfb566, {
      text: "❌ Erreur : " + _0x1517f6.message
    });
  }
});
registerCommand({
  nom_cmd: "connect_session",
  classe: "Owner",
  desc: "Affiche la liste des numéros connectés"
}, async (_0x2d6283, _0x1b544c, _0x10042d) => {
  try {
    const {
      ms: _0x51ae32,
      isSudo: _0x4362f0
    } = _0x10042d;
    if (!_0x4362f0) {
      return _0x1b544c.sendMessage(_0x2d6283, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: _0x51ae32
      });
    }
    const _0x1d1cdc = await getSecondAllSessions();
    if (!_0x1d1cdc || _0x1d1cdc.length === 0) {
      return _0x1b544c.sendMessage(_0x2d6283, {
        text: "📭 Aucune session secondaire active pour le moment."
      }, {
        quoted: _0x51ae32
      });
    }
    const _0x4dd836 = _0x1d1cdc.map(_0x16df17 => _0x16df17.numero + "@s.whatsapp.net");
    const _0x12e22c = _0x4dd836.map(_0x1a834e => "@" + _0x1a834e.split("@")[0]).join("\n");
    await _0x1b544c.sendMessage(_0x2d6283, {
      text: "📡 *Sessions secondaires connectées (" + _0x1d1cdc.length + ")* :\n\n" + _0x12e22c,
      mentions: _0x4dd836
    }, {
      quoted: _0x51ae32
    });
  } catch (_0x8f2bd9) {
    return _0x1b544c.sendMessage(_0x2d6283, {
      text: "❌ Erreur : " + _0x8f2bd9.message
    });
  }
});
registerCommand({
  nom_cmd: "disconnect",
  classe: "Owner",
  desc: "Supprime une session connectée par session_id"
}, async (_0x4b1fd7, _0x5f2df0, _0x573bf6) => {
  try {
    const {
      arg: _0x59c2ff,
      ms: _0x2d0d33,
      isSudo: _0x41b178
    } = _0x573bf6;
    if (!_0x41b178) {
      return _0x5f2df0.sendMessage(_0x4b1fd7, {
        text: "Vous n'avez pas le droit d'exécuter cette commande."
      }, {
        quoted: _0x2d0d33
      });
    }
    if (!_0x59c2ff || !_0x59c2ff[0]) {
      return _0x5f2df0.sendMessage(_0x4b1fd7, {
        text: "Usage : .disconnect numero(sans le + et collé)"
      }, {
        quoted: _0x2d0d33
      });
    }
    const _0x1690e4 = _0x59c2ff.join(" ");
    const _0x15ab16 = _0x1690e4.replace(/[^0-9]/g, "");
    const _0x277baa = await deleteSecondSession(_0x15ab16);
    if (_0x277baa === 0) {
      return _0x5f2df0.sendMessage(_0x4b1fd7, {
        text: "Aucune session trouvée pour le numéro : " + _0x15ab16
      }, {
        quoted: _0x2d0d33
      });
    }
    await _0x5f2df0.sendMessage(_0x4b1fd7, {
      text: "✅ Session pour le numéro: " + _0x15ab16 + " supprimée avec succès."
    }, {
      quoted: _0x2d0d33
    });
  } catch (_0x48bda9) {
    return _0x5f2df0.sendMessage(_0x4b1fd7, {
      text: "❌ Erreur : " + _0x48bda9.message
    });
  }
});
registerCommand({
  nom_cmd: "setmention",
  classe: "Owner",
  react: "✅",
  desc: "Configurer le message d'antimention global"
}, async (_0x1c8302, _0x488b7c, _0x38b420) => {
  const {
    ms: _0x37ee5a,
    repondre: _0x6a6a28,
    arg: _0x5a7118,
    isSudo: _0x12b12e
  } = _0x38b420;
  if (!_0x12b12e) {
    return _0x6a6a28("❌ Seuls les utilisateurs sudo peuvent utiliser cette commande.");
  }
  try {
    const _0x4b23e6 = _0x5a7118.join(" ");
    if (!_0x4b23e6) {
      return _0x6a6a28("🛠️ Utilisation de la commande *setmention* :\n\n1️⃣ Pour une image, vidéo, audio ou texte avec type spécifié :\n> *setmention type=audio url=https://exemple.com/fichier.opus*\n> *setmention type=video url=https://exemple.com/video.mp4 text=Votre_message_ici*\n> *setmention type=texte text=Votre_message_ici*\n> *setmention type=image url=https://exemple.com/image.jpg text=Votre_message_ici*\n\n📌 Les types valides sont : audio, video, texte, image.");
    }
    let _0x999c14 = "";
    let _0x9f967d = "";
    let _0x33df97 = "";
    const _0x24c507 = /(type|url|text)=(.*?)(?=\s(?:type=|url=|text=)|$)/gis;
    let _0x34e929;
    while ((_0x34e929 = _0x24c507.exec(_0x4b23e6)) !== null) {
      const _0x2c50d3 = _0x34e929[1].toLowerCase();
      const _0x3c91ad = _0x34e929[2].trim();
      if (_0x2c50d3 === "type") {
        _0x33df97 = _0x3c91ad.toLowerCase();
      } else if (_0x2c50d3 === "url") {
        _0x999c14 = _0x3c91ad;
      } else if (_0x2c50d3 === "text") {
        _0x9f967d = _0x3c91ad.replace(/_/g, " ");
      }
    }
    if (!_0x33df97) {
      return _0x6a6a28("❌ Vous devez préciser le type avec 'type=audio', 'type=video', 'type=texte' ou 'type=image'.");
    }
    await setMention({
      url: _0x999c14,
      text: _0x9f967d,
      type: _0x33df97,
      mode: "oui"
    });
    const _0xdbc459 = "✅ Mention de type '" + _0x33df97 + "' enregistrée avec succès.";
    return _0x6a6a28(_0xdbc459);
  } catch (_0x4c487c) {
    console.error("Erreur dans setmention:", _0x4c487c);
    _0x6a6a28("Une erreur s'est produite lors de la configuration.");
  }
});
registerCommand({
  nom_cmd: "delmention",
  classe: "Owner",
  react: "🚫",
  desc: "Désactiver le système d'antimention"
}, async (_0x267f14, _0x1ab929, _0x593163) => {
  const {
    repondre: _0x39dc90,
    isSudo: _0x240dd9
  } = _0x593163;
  if (!_0x240dd9) {
    return _0x39dc90("Seuls les utilisateurs sudo peuvent utiliser cette commande.");
  }
  try {
    await delMention();
    return _0x39dc90("✅ mention désactivé.");
  } catch (_0xdae8c3) {
    console.error("Erreur dans delmention:", _0xdae8c3);
    _0x39dc90("Une erreur s'est produite.");
  }
});
registerCommand({
  nom_cmd: "getmention",
  classe: "Owner",
  react: "📄",
  desc: "Afficher la configuration actuelle de l'antimention"
}, async (_0x24508e, _0x26c34b, _0x1568ac) => {
  const {
    repondre: _0x12e8ed,
    isSudo: _0xac9001
  } = _0x1568ac;
  try {
    if (!_0xac9001) {
      return _0x12e8ed("Seuls les utilisateurs sudo peuvent utiliser cette commande.");
    }
    const _0x1c1dd3 = await getMention();
    if (!_0x1c1dd3 || _0x1c1dd3.mode === "non") {
      return _0x12e8ed("ℹ️ Antimention désactivé ou non configuré.");
    }
    const {
      mode: _0x3daebb,
      url: _0x3df1fb,
      text: _0x421095,
      type: _0x49827b
    } = _0x1c1dd3;
    if ((!_0x3df1fb || _0x3df1fb === "") && (!_0x421095 || _0x421095 === "")) {
      return _0x12e8ed("ℹ️ Antimention activé mais aucun contenu défini.");
    }
    switch (_0x49827b) {
      case "audio":
        if (!_0x3df1fb) {
          return _0x12e8ed(_0x421095 || "Aucun contenu audio défini.");
        }
        return await _0x26c34b.sendMessage(_0x24508e, {
          audio: {
            url: _0x3df1fb
          },
          mimetype: "audio/mp4",
          ptt: true
        }, {
          quoted: null
        });
      case "image":
        if (!_0x3df1fb) {
          return _0x12e8ed(_0x421095 || "Aucun contenu image défini.");
        }
        return await _0x26c34b.sendMessage(_0x24508e, {
          image: {
            url: _0x3df1fb
          },
          caption: _0x421095 || undefined
        }, {
          quoted: null
        });
      case "video":
        if (!_0x3df1fb) {
          return _0x12e8ed(_0x421095 || "Aucun contenu vidéo défini.");
        }
        return await _0x26c34b.sendMessage(_0x24508e, {
          video: {
            url: _0x3df1fb
          },
          caption: _0x421095 || undefined
        }, {
          quoted: null
        });
      case "texte":
        return _0x12e8ed(_0x421095 || "Aucun message texte défini.");
      default:
        return _0x12e8ed("Le type de média est inconnu ou non pris en charge.");
    }
  } catch (_0x2747ed) {
    console.error("Erreur dans getmention:", _0x2747ed);
    _0x12e8ed("Impossible d'afficher la configuration.");
  }
});
registerCommand({
  nom_cmd: "addstickcmd",
  classe: "Owner",
  react: "✨",
  alias: ["setstickcmd", "addcmd", "setcmd"],
  desc: "Associer une commande à un sticker (réponds à un sticker)"
}, async (_0x43de88, _0xd77c6a, {
  repondre: _0x18ad8f,
  msg_Repondu: _0x393bc9,
  arg: _0xaea9d0,
  isSudo: _0x3893f0
}) => {
  if (!_0x3893f0) {
    return _0x18ad8f("Pas autorisé.");
  }
  const _0x48cf99 = _0xaea9d0[0];
  if (!_0x48cf99) {
    return _0x18ad8f("Tu dois donner un nom à la commande.\nExemple : `addstickcmd test`");
  }
  if (!_0x393bc9 || !_0x393bc9.stickerMessage || !_0x393bc9.stickerMessage.url) {
    return _0x18ad8f("Tu dois répondre à un *sticker* pour l'enregistrer.");
  }
  const _0x3e6e96 = _0x393bc9.stickerMessage.fileSha256?.toString("base64");
  try {
    await set_stick_cmd(_0x48cf99.toLowerCase(), _0x3e6e96);
    _0x18ad8f("✅ Le sticker a été associé à la commande *" + _0x48cf99 + "*");
  } catch (_0x436c54) {
    console.error(_0x436c54);
    _0x18ad8f("Erreur lors de l'enregistrement.");
  }
});
registerCommand({
  nom_cmd: "delstickcmd",
  classe: "Owner",
  react: "🗑️",
  alias: ["delcmd"],
  desc: "Supprimer une commande sticker"
}, async (_0x43b7dc, _0x2125c6, {
  repondre: _0x3a3ed4,
  arg: _0x53ff87,
  isSudo: _0x266f34
}) => {
  if (!_0x266f34) {
    return _0x3a3ed4("Pas autorisé.");
  }
  const _0xce1757 = _0x53ff87[0];
  if (!_0xce1757) {
    return _0x3a3ed4("Exemple : `delstickcmd test`");
  }
  const _0x4adc27 = await del_stick_cmd(_0xce1757.toLowerCase());
  _0x3a3ed4(_0x4adc27 ? "🗑️ La commande *" + _0xce1757 + "* a été supprimée." : "Aucune commande nommée *" + _0xce1757 + "* trouvée.");
});
registerCommand({
  nom_cmd: "getstickcmd",
  classe: "Owner",
  react: "📋",
  alias: ["getcmd"],
  desc: "Liste des commandes stickers"
}, async (_0x58c63a, _0x196dec, {
  repondre: _0x48b9f7,
  isSudo: _0x276fc1
}) => {
  if (!_0x276fc1) {
    return _0x48b9f7("Pas autorisé.");
  }
  const _0x36e401 = await get_stick_cmd();
  if (!_0x36e401.length) {
    return _0x48b9f7("Aucune commande sticker trouvée.");
  }
  let _0x5de27a = "*📌 Liste des commandes stickers :*\n\n";
  for (const {
    no_cmd: _0x480b90,
    stick_hash: _0x2b71e8
  } of _0x36e401) {
    _0x5de27a += "• *" + _0x480b90 + "*\n";
  }
  _0x48b9f7(_0x5de27a);
});
registerCommand({
  nom_cmd: "setpublic_cmd",
  classe: "Owner",
  react: "✅",
  desc: "Ajoute une commande publique utilisable par tout le monde quand le bot est en mode privé"
}, async (_0x5c2edd, _0x39892a, {
  arg: _0x468057,
  repondre: _0xc7d689,
  isSudo: _0x3a6f4d
}) => {
  if (!_0x3a6f4d) {
    return _0xc7d689("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const _0x547b05 = _0x468057[0];
  if (!_0x547b05) {
    return _0xc7d689("❌ Utilisation: setpublic_cmd nom_cmd");
  }
  try {
    await set_cmd(_0x547b05, "public");
    _0xc7d689("✅ Commande publique '" + _0x547b05 + "' enregistrée.");
  } catch {
    _0xc7d689("❌ Erreur lors de l'enregistrement.");
  }
});
registerCommand({
  nom_cmd: "delpublic_cmd",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprime une commande des commandes publiques."
}, async (_0xd63ebe, _0xd5a150, {
  arg: _0xae208d,
  repondre: _0x57f695,
  isSudo: _0x261481
}) => {
  if (!_0x261481) {
    return _0x57f695("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const _0x4be8d5 = _0xae208d[0];
  if (!_0x4be8d5) {
    return _0x57f695("❌ Utilisation: delpublic_cmd nom_cmd");
  }
  try {
    const _0x37c262 = await del_cmd(_0x4be8d5, "public");
    _0x57f695(_0x37c262 ? "✅ Commande '" + _0x4be8d5 + "' supprimée." : "❌ Commande '" + _0x4be8d5 + "' introuvable.");
  } catch {
    _0x57f695("❌ Erreur lors de la suppression.");
  }
});
registerCommand({
  nom_cmd: "listpublic_cmd",
  classe: "Owner",
  react: "📜",
  desc: "Liste les commandes publiques utilisablent quand le bot est en mode privé"
}, async (_0x1e94a5, _0x159fa8, {
  repondre: _0x3b4e4d,
  isSudo: _0x59ff5b
}) => {
  if (!_0x59ff5b) {
    return _0x3b4e4d("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const _0x97fef = await list_cmd("public");
  if (!_0x97fef.length) {
    return _0x3b4e4d("❌ Aucune commande publique enregistrée.");
  }
  const _0x55d90b = _0x97fef.map((_0x186ee1, _0x39a67c) => "🔹 *" + (_0x39a67c + 1) + ".* " + _0x186ee1.nom_cmd).join("\n");
  _0x3b4e4d("📖 *Commandes publiques enregistrées :*\n\n" + _0x55d90b);
});
registerCommand({
  nom_cmd: "setprivate_cmd",
  classe: "Owner",
  react: "🔒",
  desc: "Ajoute une commande privée utilisable par les utilisateurs sudos quand le bot est en mode public"
}, async (_0x1feedf, _0x215c11, {
  arg: _0x241318,
  repondre: _0x47adce,
  isSudo: _0x176554
}) => {
  if (!_0x176554) {
    return _0x47adce("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const _0x599291 = _0x241318[0];
  if (!_0x599291) {
    return _0x47adce("❌ Utilisation: setprivate_cmd nom_cmd");
  }
  try {
    await set_cmd(_0x599291, "private");
    _0x47adce("🔐 Commande privée '" + _0x599291 + "' enregistrée.");
  } catch {
    _0x47adce("❌ Erreur lors de l'enregistrement.");
  }
});
registerCommand({
  nom_cmd: "delprivate_cmd",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprime une commande des commandes privée"
}, async (_0x5f1a6f, _0x212561, {
  arg: _0x4891dd,
  repondre: _0x5db6dd,
  isSudo: _0x5ec92a
}) => {
  if (!_0x5ec92a) {
    return _0x5db6dd("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const _0x4c9114 = _0x4891dd[0];
  if (!_0x4c9114) {
    return _0x5db6dd("❌ Utilisation: delprivate_cmd nom_cmd");
  }
  try {
    const _0x26d50b = await del_cmd(_0x4c9114, "private");
    _0x5db6dd(_0x26d50b ? "✅ Commande '" + _0x4c9114 + "' supprimée." : "❌ Commande '" + _0x4c9114 + "' introuvable.");
  } catch {
    _0x5db6dd("❌ Erreur lors de la suppression.");
  }
});
registerCommand({
  nom_cmd: "listprivate_cmd",
  classe: "Owner",
  react: "📃",
  desc: "Liste les commandes privées utilisablent par les utilisateurs sudos quand le bot est en mode public"
}, async (_0x451b9e, _0x197a1c, {
  repondre: _0x303d74,
  isSudo: _0xb39ac2
}) => {
  if (!_0xb39ac2) {
    return _0x303d74("❌ Vous n'avez pas la permission d'exécuter cette commande.");
  }
  const _0x557ef7 = await list_cmd("private");
  if (!_0x557ef7.length) {
    return _0x303d74("❌ Aucune commande privée enregistrée.");
  }
  const _0x2598cc = _0x557ef7.map((_0x43f8db, _0x9baa5d) => "🔹 *" + (_0x9baa5d + 1) + ".* " + _0x43f8db.nom_cmd).join("\n");
  _0x303d74("🔒 *Commandes privées enregistrées :*\n\n" + _0x2598cc);
});
registerCommand({
  nom_cmd: "chatbot",
  classe: "Owner",
  react: "🤖",
  desc: "Active ou désactive le chatbot ici ou globalement."
}, async (_0x419031, _0x401ee6, _0x1e00a7) => {
  const {
    ms: _0x24a3ad,
    repondre: _0x49f3d7,
    arg: _0x32906c,
    verif_Groupe: _0x130be6,
    isSudo: _0x1c25ce
  } = _0x1e00a7;
  const _0x32bfef = _0x32906c[0]?.toLowerCase();
  if (!_0x1c25ce) {
    _0x49f3d7("❌ Pas autorisé.");
    return;
  }
  try {
    const [_0x4c3e3b] = await ChatbotConf.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        chatbot_pm: "non",
        chatbot_gc: "non",
        enabled_ids: JSON.stringify([])
      }
    });
    let _0x2634a3 = [];
    try {
      _0x2634a3 = JSON.parse(_0x4c3e3b.enabled_ids || "[]");
    } catch {
      _0x2634a3 = [];
    }
    if (_0x32bfef === "on") {
      if (_0x2634a3.includes(_0x419031)) {
        _0x49f3d7("🔁 Le chatbot est *déjà activé ici*.");
      } else {
        _0x2634a3.push(_0x419031);
        _0x4c3e3b.enabled_ids = JSON.stringify([...new Set(_0x2634a3)]);
        _0x4c3e3b.chatbot_pm = "non";
        _0x4c3e3b.chatbot_gc = "non";
        await _0x4c3e3b.save();
        _0x49f3d7("✅ Le chatbot est maintenant activé *dans cette discussion*.");
      }
    } else if (_0x32bfef === "off") {
      _0x4c3e3b.chatbot_pm = "non";
      _0x4c3e3b.chatbot_gc = "non";
      _0x4c3e3b.enabled_ids = JSON.stringify([]);
      await _0x4c3e3b.save();
      _0x49f3d7("⛔️ Le chatbot est maintenant désactivé *partout*.");
    } else if (["pm", "gc", "all"].includes(_0x32bfef)) {
      _0x4c3e3b.chatbot_pm = _0x32bfef === "pm" || _0x32bfef === "all" ? "oui" : "non";
      _0x4c3e3b.chatbot_gc = _0x32bfef === "gc" || _0x32bfef === "all" ? "oui" : "non";
      _0x4c3e3b.enabled_ids = JSON.stringify([]);
      await _0x4c3e3b.save();
      const _0x379b8f = {
        pm: "✅ Le chatbot est maintenant activé *dans tous les chats privés*.",
        gc: "✅ Le chatbot est maintenant activé *dans tous les groupes*.",
        all: "✅ Le chatbot est maintenant activé *partout*."
      };
      _0x49f3d7(_0x379b8f[_0x32bfef]);
    } else {
      _0x49f3d7("🤖 *Gestion du Chatbot*\n\n`chatbot on` - Active ici uniquement\n`chatbot off` - Désactive *partout*\n`chatbot pm` - Active dans *tous les chats privés*\n`chatbot gc` - Active dans *tous les groupes*\n`chatbot all` - Active *partout*");
    }
  } catch (_0x52963d) {
    console.error("❌ Erreur dans la commande chatbot :", _0x52963d);
    _0x49f3d7("Une erreur est survenue.");
  }
});
registerCommand({
  nom_cmd: "pglist",
  classe: "Owner",
  react: "🧩",
  desc: "Affiche la liste des plugins disponibles avec statut d'installation.",
  alias: ["pgl", "plist"]
}, async (_0x3cfc52, _0x29269f, {
  repondre: _0x209a93
}) => {
  return _0x209a93("⛔ Les plugins distants sont désactivés sur cette instance.");
  try {
    const {
      data: _0x58e610
    } = await axios.get("https://127.0.0.1/plugins-disabled");
    const _0x444015 = await Plugin.findAll();
    const _0x37cafd = _0x444015.map(_0x18590f => _0x18590f.name.toLowerCase());
    let _0x23d29e = [];
    if (Array.isArray(_0x58e610)) {
      _0x23d29e = _0x58e610.map((_0x5bdc2c, _0x1875bd) => {
        const _0x3c96d7 = _0x37cafd.includes(_0x5bdc2c.name.toLowerCase());
        const _0x1b72e3 = _0x3c96d7 ? "✅" : "❌";
        return "*" + _0x1b72e3 + " Plugin #" + (_0x1875bd + 1) + "*\n🧩 *Nom:* " + _0x5bdc2c.name + "\n👤 *Auteur:* " + _0x5bdc2c.author + "\n📦 *Installé:* " + (_0x3c96d7 ? "Oui ✅" : "Non ❌") + "\n🔗 *Lien:* " + _0x5bdc2c.url + "\n📝 *Description:* " + (_0x5bdc2c.description || "Aucune description");
      });
    }
    const _0x55b389 = _0x444015.filter(_0x47fbe2 => {
      return !_0x58e610?.some(_0x367bf7 => _0x367bf7.name.toLowerCase() === _0x47fbe2.name.toLowerCase());
    });
    _0x55b389.forEach(_0x116f14 => {
      _0x23d29e.push("*✅ Plugin personnalisé*\n🧩 *Nom:* " + _0x116f14.name + "\n");
    });
    const _0x39d564 = _0x23d29e.length > 0 ? "📦 *Plugins disponibles :*\n\n" + _0x23d29e.join("\n\n") : "❌ Aucun plugin disponible.";
    await _0x209a93(_0x39d564);
  } catch (_0x2c246d) {
    console.error("Erreur pluginlist :", _0x2c246d);
    await _0x209a93("❌ Une erreur est survenue lors du chargement des plugins.");
  }
});
registerCommand({
  nom_cmd: "pgremove",
  classe: "Owner",
  react: "🗑️",
  desc: "Supprime un plugin installé par nom ou tape `remove all` pour tous.",
  alias: ["pgr"]
}, async (_0x2e0d3a, _0x194415, {
  arg: _0x116c27,
  repondre: _0x45fd0e
}) => {
  return _0x45fd0e("⛔ Les plugins distants sont désactivés sur cette instance.");
  const _0x39a6a1 = _0x116c27[0];
  if (!_0x39a6a1) {
    return _0x45fd0e("❌ Utilise `remove nom_plugin` ou `remove all`.");
  }
  if (_0x39a6a1 === "all") {
    const _0x47209e = await Plugin.findAll();
    for (const _0x5a82dd of _0x47209e) {
      const _0x32a002 = path.join(__dirname, "../plugins", _0x5a82dd.name + ".js");
      if (fs.existsSync(_0x32a002)) {
        fs.unlinkSync(_0x32a002);
      }
      await Plugin.destroy({
        where: {
          name: _0x5a82dd.name
        }
      });
    }
    await reloadCommands();
    return _0x45fd0e("🗑️ Tous les plugins ont été supprimés.");
  }
  const _0x49f167 = await Plugin.findOne({
    where: {
      name: _0x39a6a1
    }
  });
  if (!_0x49f167) {
    return _0x45fd0e("❌ Plugin non trouvé dans la base.");
  }
  const _0x2f149e = path.join(__dirname, "../plugins", _0x49f167.name + ".js");
  if (fs.existsSync(_0x2f149e)) {
    fs.unlinkSync(_0x2f149e);
  }
  await Plugin.destroy({
    where: {
      name: _0x39a6a1
    }
  });
  await reloadCommands();
  return _0x45fd0e("🗑️ Plugin *" + _0x39a6a1 + "* supprimé.");
});
registerCommand({
  nom_cmd: "pginstall",
  classe: "Owner",
  react: "📥",
  desc: "Installe un plugin.",
  alias: ["pgi"]
}, async (_0x4258ed, _0x57e3ce, {
  arg: _0x432a03,
  repondre: _0x10a4ee
}) => {
  return _0x10a4ee("⛔ Les plugins distants sont désactivés sur cette instance.");
  const _0x35a09d = _0x432a03[0];
  if (!_0x35a09d) {
    return _0x10a4ee("❌ Donne un lien direct vers un plugin ou tape `pginstall all` pour tout installer.");
  }
  const _0x2b392a = async (_0x28c364, _0x3aa143) => {
    try {
      const _0x1a402e = await Plugin.findOne({
        where: {
          name: _0x3aa143
        }
      });
      if (_0x1a402e) {
        await _0x10a4ee("⚠️ Plugin *" + _0x3aa143 + "* déjà installé. Ignoré.");
        return;
      }
      const _0x3da037 = await axios.get(_0x28c364);
      const _0x103f6e = _0x3da037.data;
      const _0x45e15b = path.join(__dirname, "../plugins", _0x3aa143 + ".js");
      fs.writeFileSync(_0x45e15b, _0x103f6e);
      const _0xca9df5 = extractNpmModules(_0x103f6e);
      if (_0xca9df5.length > 0) {
        await _0x10a4ee("⚙️ Installation des dépendances npm : " + _0xca9df5.join(", "));
        await installModules(_0xca9df5);
      }
      await Plugin.findOrCreate({
        where: {
          name: _0x3aa143
        },
        defaults: {
          url: _0x28c364
        }
      });
      await _0x10a4ee("✅ Plugin *" + _0x3aa143 + "* installé avec succès.");
      await reloadCommands();
    } catch (_0x52e88e) {
      await _0x10a4ee("❌ Erreur installation *" + _0x3aa143 + "* : " + _0x52e88e.message);
    }
  };
  if (_0x35a09d === "all") {
    try {
      const {
        data: _0x55c5d9
      } = await axios.get("https://pastebin.com/raw/5UA0CYYR");
      const _0x3ea23c = await Plugin.findAll();
      const _0x23721e = _0x3ea23c.map(_0x5f4a28 => _0x5f4a28.name.toLowerCase());
      const _0x283756 = _0x55c5d9.filter(_0x4cb46a => !_0x23721e.includes(_0x4cb46a.name.toLowerCase()));
      if (_0x283756.length === 0) {
        return await _0x10a4ee("✅ Tous les plugins sont déjà installés.");
      }
      for (const _0x1af8a9 of _0x283756) {
        await _0x2b392a(_0x1af8a9.url, _0x1af8a9.name);
      }
      await _0x10a4ee("✅ Installation terminée pour tous les plugins disponibles.");
    } catch (_0x1c33d9) {
      await _0x10a4ee("❌ Erreur de récupération des plugins : " + _0x1c33d9.message);
    }
  } else {
    const _0x394144 = _0x35a09d;
    const _0x48cd44 = path.basename(_0x394144).replace(".js", "");
    await _0x2b392a(_0x394144, _0x48cd44);
  }
});