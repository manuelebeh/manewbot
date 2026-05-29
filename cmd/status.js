const {
  registerCommand
} = require("../lib/commands");
const {
  WA_CONF
} = require("../database/wa_conf");
const config = require("../set");
registerCommand({
  nom_cmd: "save",
  classe: "Status",
  react: "💾",
  desc: "Télécharge un statut WhatsApp"
}, async (_0x310314, _0x482454, _0x23f909) => {
  const {
    ms: _0x4c4fc2,
    msg_Repondu: _0x944416,
    repondre: _0x53e178,
    quote: _0x5ddbf2,
    id_Bot: _0x1d3ff4
  } = _0x23f909;
  try {
    if (!_0x944416 || !_0x5ddbf2?.remoteJid || _0x5ddbf2.remoteJid !== "status@broadcast") {
      return _0x53e178("Merci de répondre à un statut WhatsApp.");
    }
    let _0x6db476;
    let _0x332bb7 = {
      quoted: _0x4c4fc2
    };
    if (_0x944416.extendedTextMessage) {
      await _0x482454.sendMessage(_0x1d3ff4, {
        text: _0x944416.extendedTextMessage.text
      }, _0x332bb7);
    } else if (_0x944416.imageMessage) {
      _0x6db476 = await _0x482454.dl_save_media_ms(_0x944416.imageMessage);
      await _0x482454.sendMessage(_0x1d3ff4, {
        image: {
          url: _0x6db476
        },
        caption: _0x944416.imageMessage.caption
      }, _0x332bb7);
    } else if (_0x944416.videoMessage) {
      _0x6db476 = await _0x482454.dl_save_media_ms(_0x944416.videoMessage);
      await _0x482454.sendMessage(_0x1d3ff4, {
        video: {
          url: _0x6db476
        },
        caption: _0x944416.videoMessage.caption
      }, _0x332bb7);
    } else if (_0x944416.audioMessage) {
      _0x6db476 = await _0x482454.dl_save_media_ms(_0x944416.audioMessage);
      await _0x482454.sendMessage(_0x1d3ff4, {
        audio: {
          url: _0x6db476
        },
        mimetype: "audio/mp4",
        ptt: false
      }, _0x332bb7);
    } else {
      return _0x53e178("Ce type de statut n'est pas pris en charge.");
    }
  } catch (_0x5cb250) {
    console.error("Erreur lors du téléchargement du statut :", _0x5cb250);
  }
});
registerCommand({
  nom_cmd: "sendme",
  classe: "Status",
  react: "📤",
  desc: "Renvoie un statut mentionné par l'utilisateur"
}, async (_0x118853, _0x524d92, _0xd3326f) => {
  const {
    ms: _0x3e8e9c,
    msg_Repondu: _0x1e8737,
    repondre: _0x55c90f,
    quote: _0x312815
  } = _0xd3326f;
  try {
    if (!_0x1e8737 || !_0x312815?.remoteJid || _0x312815.remoteJid !== "status@broadcast") {
      return _0x55c90f("❌ Réponds à un statut WhatsApp pour l'envoyer ici.");
    }
    let _0x3737bb;
    const _0x1c53d0 = {
      quoted: _0x3e8e9c
    };
    if (_0x1e8737.extendedTextMessage) {
      const _0x3be525 = _0x1e8737.extendedTextMessage.text;
      await _0x524d92.sendMessage(_0x118853, {
        text: _0x3be525
      }, _0x1c53d0);
    } else if (_0x1e8737.imageMessage) {
      _0x3737bb = await _0x524d92.dl_save_media_ms(_0x1e8737.imageMessage);
      await _0x524d92.sendMessage(_0x118853, {
        image: {
          url: _0x3737bb
        },
        caption: _0x1e8737.imageMessage.caption || ""
      }, _0x1c53d0);
    } else if (_0x1e8737.videoMessage) {
      _0x3737bb = await _0x524d92.dl_save_media_ms(_0x1e8737.videoMessage);
      await _0x524d92.sendMessage(_0x118853, {
        video: {
          url: _0x3737bb
        },
        caption: _0x1e8737.videoMessage.caption || ""
      }, _0x1c53d0);
    } else if (_0x1e8737.audioMessage) {
      _0x3737bb = await _0x524d92.dl_save_media_ms(_0x1e8737.audioMessage);
      await _0x524d92.sendMessage(_0x118853, {
        audio: {
          url: _0x3737bb
        },
        mimetype: "audio/mp4",
        ptt: false
      }, _0x1c53d0);
    } else {
      return _0x55c90f("❌ Ce type de statut n'est pas pris en charge.");
    }
  } catch (_0x2a06bb) {
    console.error("Erreur lors du renvoi du statut :", _0x2a06bb.message || _0x2a06bb);
    return _0x55c90f("❌ Une erreur est survenue pendant le traitement.");
  }
});
registerCommand({
  nom_cmd: "lecture_status",
  classe: "Status",
  react: "📖",
  desc: "Active ou désactive la lecture auto des status"
}, async (_0x55d6c2, _0xe89314, _0x4cb558) => {
  const {
    ms: _0x2b1205,
    repondre: _0xe7b584,
    arg: _0x2502ce,
    prenium_id: _0x1a2808
  } = _0x4cb558;
  try {
    if (!_0x1a2808) {
      return _0xe7b584("Seuls les utilisateurs prenium peuvent utiliser cette commande");
    }
    const _0x3a0ffc = _0x2502ce[0]?.toLowerCase();
    const [_0x2964a3] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        lecture_status: "non"
      }
    });
    if (_0x3a0ffc === "off") {
      _0x2964a3.lecture_status = "non";
      await _0x2964a3.save();
      return _0xe7b584("La lecture du statut est maintenant désactivée.");
    }
    if (_0x3a0ffc === "on") {
      _0x2964a3.lecture_status = "oui";
      await _0x2964a3.save();
      return _0xe7b584("La lecture du statut est maintenant activée.");
    }
    return _0xe7b584("Utilisation :\nlecture_status on: Activer la lecture du statut\nlecture_status off: Désactiver la lecture du statut");
  } catch (_0x23f19e) {
    console.error("Erreur lors de la configuration de lecture_status :", _0x23f19e);
    _0xe7b584("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "dl_status",
  classe: "Status",
  react: "📥",
  desc: "Active ou désactive le téléchargement auto des status"
}, async (_0x43a9ea, _0x50e819, _0x1f52cd) => {
  const {
    ms: _0x15db0d,
    repondre: _0x2db246,
    arg: _0x503b92,
    prenium_id: _0x1d5cc0
  } = _0x1f52cd;
  try {
    if (!_0x1d5cc0) {
      return _0x2db246("Seuls les utilisateurs prenium peuvent utiliser cette commande");
    }
    const _0xeb53fd = _0x503b92[0]?.toLowerCase();
    const [_0x466317] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        dl_status: "non"
      }
    });
    if (_0xeb53fd === "off") {
      _0x466317.dl_status = "non";
      await _0x466317.save();
      return _0x2db246("Le téléchargement du statut est maintenant désactivé.");
    }
    if (_0xeb53fd === "on") {
      _0x466317.dl_status = "oui";
      await _0x466317.save();
      return _0x2db246("Le téléchargement du statut est maintenant activé.");
    }
    return _0x2db246("Utilisation :\ndl_status on: Activer le téléchargement du statut\ndl_status off: Désactiver le téléchargement du statut");
  } catch (_0x4b3d7d) {
    console.error("Erreur lors de la configuration de dl_status :", _0x4b3d7d);
    _0x2db246("Une erreur s'est produite lors de l'exécution de la commande.");
  }
});
registerCommand({
  nom_cmd: "likestatus",
  classe: "Status",
  react: "👍",
  desc: "Active ou désactive les likes automatiques sur les statuts"
}, async (_0x2b160d, _0x2ebd67, _0xe9e13a) => {
  const {
    ms: _0x19368f,
    repondre: _0x5dca2d,
    arg: _0xa8a710,
    prenium_id: _0x3f0f2f
  } = _0xe9e13a;
  try {
    if (!_0x3f0f2f) {
      return _0x5dca2d("❌ Seuls les utilisateurs *premium* peuvent utiliser cette commande.");
    }
    const _0x2fe332 = _0xa8a710[0]?.toLowerCase();
    const [_0x36cc6a] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        like_status: "non"
      }
    });
    const _0x2d4bbc = () => {
      return _0x5dca2d("🔧 *Paramètres des Likes Auto sur Statuts :*\n\n" + ("• *" + config.PREFIXE + "likestatus <emojie>* : Active avec <emojie>\n") + ("• *" + config.PREFIXE + "likestatus off* : Désactive les likes automatiques\n\n") + ("📌 *Exemple :* " + config.PREFIXE + "likestatus 🤣\n") + ("📊 Statut actuel : *" + (_0x36cc6a.like_status === "non" ? "Désactivé" : "Activé (" + _0x36cc6a.like_status + ")") + "*"));
    };
    if (!_0x2fe332 || _0x2fe332 === "") {
      return _0x2d4bbc();
    }
    if (_0x2fe332 === "off") {
      _0x36cc6a.like_status = "non";
      await _0x36cc6a.save();
      return _0x5dca2d("👍 Les likes automatiques ont été *désactivés*.");
    }
    const _0x379cfa = /^(?:\p{Emoji}(?:\p{Emoji_Modifier}?|\uFE0F)?(?:\u200D\p{Emoji})*)$/u;
    if (!_0x379cfa.test(_0x2fe332)) {
      return _0x2d4bbc();
    }
    _0x36cc6a.like_status = _0x2fe332;
    await _0x36cc6a.save();
    return _0x5dca2d("✅ Les likes automatiques sont maintenant activés avec l'emoji " + _0x2fe332);
  } catch (_0x1e97c6) {
    console.error("❌ Erreur dans likestatus :", _0x1e97c6);
    return _0x5dca2d("❌ Une erreur s'est produite lors de la configuration.");
  }
});