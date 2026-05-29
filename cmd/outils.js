const {
  registerCommand,
  cmd
} = require("../lib/commands");
const config = require("../set");
const {
  translate
} = require("@vitalets/google-translate-api");
const prefixe = config.PREFIXE;
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const {
  WA_CONF
} = require("../database/wa_conf");
const {
  TempMail
} = require("tempmail.lol");
const JavaScriptObfuscator = require("javascript-obfuscator");
const {
  exec
} = require("child_process");
const AdmZip = require("adm-zip");
const os = require("os");
const pkg = require("../package");
function stylize(_0x19c5e9) {
  const _0x5825ca = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const _0x206c9b = "0123456789";
  return _0x19c5e9.split("").map(_0x187707 => {
    const _0x2aa9f5 = _0x5825ca.indexOf(_0x187707);
    if (_0x2aa9f5 !== -1) {
      return _0x206c9b[_0x2aa9f5];
    } else {
      return _0x187707;
    }
  }).join("");
}
const contextInfo = {
  forwardingScore: 1,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363371282577847@newsletter",
    newsletterName: "ᴏᴠʟ-ᴍᴅ-ᴠ𝟸"
  }
};
registerCommand({
  nom_cmd: "test",
  classe: "Outils",
  react: "🌟",
  desc: "Tester la connectivité du bot"
}, async (_0x29049f, _0x151f92, {
  ms: _0x19d5ea,
  repondre: _0x26c3d4,
  arg: _0x5b97e7
}) => {
  try {
    const _0x452d54 = "./lib/theme.json";
    const _0x3a68a1 = fs.readFileSync(_0x452d54, "utf8");
    const _0x2f8a03 = JSON.parse(_0x3a68a1);
    const [_0x18484b] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        mention: "1"
      }
    });
    const _0x262baa = "🌐 Bienvenue sur *Manewbot*, votre bot WhatsApp multi-device.\n🔍 Tapez *" + config.PREFIXE + "allmenu* pour voir toutes les commandes disponibles.\n> ©2025 Manewbot by *Manewbie*";
    let _0x3b0c71;
    if (_0x18484b.mention.startsWith("[")) {
      const _0x47cab5 = JSON.parse(_0x18484b.mention);
      _0x3b0c71 = _0x47cab5[Math.floor(Math.random() * _0x47cab5.length)];
    } else if (_0x18484b.mention.startsWith("http://") || _0x18484b.mention.startsWith("https://")) {
      const _0x26f4b9 = JSON.parse(_0x18484b.mention);
      _0x3b0c71 = _0x26f4b9[Math.floor(Math.random() * _0x26f4b9.length)];
    } else {
      const _0x271633 = _0x2f8a03.find(_0xf0e415 => _0xf0e415.id === _0x18484b.mention);
      if (!_0x271633) {
        throw new Error("Thème introuvable");
      }
      _0x3b0c71 = _0x271633.theme[Math.floor(Math.random() * _0x271633.theme.length)];
    }
    if (_0x3b0c71.endsWith(".mp4")) {
      await _0x151f92.sendMessage(_0x29049f, {
        video: {
          url: _0x3b0c71
        },
        caption: stylize(_0x262baa),
        gifPlayback: true
      }, {
        quoted: _0x19d5ea
      });
    } else {
      await _0x151f92.sendMessage(_0x29049f, {
        image: {
          url: _0x3b0c71
        },
        caption: stylize(_0x262baa)
      }, {
        quoted: _0x19d5ea
      });
    }
  } catch (_0x316e74) {
    console.error("Erreur dans test:", _0x316e74);
    const _0x28328c = "🌐 Bienvenue sur *Manewbot*, votre bot WhatsApp multi-device.\n🔍 Tapez *" + config.PREFIXE + "menu* pour voir toutes les commandes disponibles.\n> ©2025 Manewbot by *Manewbie*";
    await _0x151f92.sendMessage(_0x29049f, {
      text: stylize(_0x28328c)
    }, {
      quoted: _0x19d5ea
    });
  }
});
registerCommand({
  nom_cmd: "description",
  classe: "Outils",
  desc: "Menu des commandes : toutes, par catégorie ou détail d’une commande.",
  alias: ["desc", "help"]
}, async (_0x56b735, _0x529689, _0x4c905f) => {
  try {
    const {
      arg: _0x4fe58d,
      ms: _0x5e5d0d
    } = _0x4c905f;
    const _0x330200 = cmd;
    if (_0x4fe58d.length) {
      const _0x25ef41 = _0x4fe58d[0].toLowerCase();
      if (_0x25ef41 === "all") {
        let _0x103212 = "📚 *Toutes les commandes disponibles :*\n\n";
        _0x330200.forEach(_0x3196f1 => {
          _0x103212 += "🔹 *" + _0x3196f1.nom_cmd + "* — _" + _0x3196f1.desc + "_\nAlias : [" + _0x3196f1.alias.join(", ") + "]\nClasse : " + _0x3196f1.classe + "\n\n";
        });
        return await _0x529689.sendMessage(_0x56b735, {
          text: _0x103212
        }, {
          quoted: _0x5e5d0d
        });
      }
      if (_0x25ef41 === "cat") {
        const _0x497563 = [...new Set(_0x330200.map(_0x11936f => _0x11936f.classe))];
        let _0x407bd1 = "📂 *Catégories disponibles :*\n\n";
        _0x497563.forEach(_0x37b4c3 => {
          const _0x3503f1 = _0x330200.filter(_0x3bfb27 => _0x3bfb27.classe === _0x37b4c3);
          _0x407bd1 += "📁 *" + _0x37b4c3 + "* (" + _0x3503f1.length + ")\n";
          _0x3503f1.forEach(_0x3accd7 => {
            _0x407bd1 += " ┗ 🧩 *" + _0x3accd7.nom_cmd + "* — _" + _0x3accd7.desc + "_\n";
          });
          _0x407bd1 += "\n";
        });
        return await _0x529689.sendMessage(_0x56b735, {
          text: _0x407bd1
        }, {
          quoted: _0x5e5d0d
        });
      }
      if (_0x25ef41.startsWith("cat=")) {
        const _0x5aff8c = _0x25ef41.split("cat=")[1].toLowerCase();
        const _0x4d2d8f = [...new Set(_0x330200.map(_0x10dbe2 => _0x10dbe2.classe.toLowerCase()))];
        if (!_0x4d2d8f.includes(_0x5aff8c)) {
          return await _0x529689.sendMessage(_0x56b735, {
            text: "❌ Catégorie *\"" + _0x5aff8c + "\"* introuvable.\nUtilise *desc cat* pour voir les catégories disponibles."
          }, {
            quoted: _0x5e5d0d
          });
        }
        const _0x292dc9 = _0x330200.filter(_0xa28908 => _0xa28908.classe.toLowerCase() === _0x5aff8c);
        let _0x33aad9 = "📁 *Commandes de la catégorie \"" + _0x5aff8c + "\"* (" + _0x292dc9.length + ") :\n\n";
        _0x292dc9.forEach(_0x14d7e7 => {
          _0x33aad9 += "🧩 *" + _0x14d7e7.nom_cmd + "* — _" + _0x14d7e7.desc + "_\nAlias : [" + _0x14d7e7.alias.join(", ") + "]\n\n";
        });
        return await _0x529689.sendMessage(_0x56b735, {
          text: _0x33aad9
        }, {
          quoted: _0x5e5d0d
        });
      }
      const _0x332743 = _0x330200.find(_0x5219d4 => _0x5219d4.nom_cmd.toLowerCase() === _0x25ef41 || _0x5219d4.alias.map(_0x2f7518 => _0x2f7518.toLowerCase()).includes(_0x25ef41));
      if (_0x332743) {
        const _0x1d5910 = "🧩 *Détails de la commande :*\n\n" + ("🔹 *Nom* : " + _0x332743.nom_cmd + "\n") + ("📚 *Alias* : [" + _0x332743.alias.join(", ") + "]\n") + ("🗂️ *Classe* : " + _0x332743.classe + "\n") + ("📝 *Description* : " + _0x332743.desc);
        return await _0x529689.sendMessage(_0x56b735, {
          text: _0x1d5910
        }, {
          quoted: _0x5e5d0d
        });
      } else {
        return await _0x529689.sendMessage(_0x56b735, {
          text: "❌ Commande ou alias *\"" + _0x25ef41 + "\"* introuvable."
        }, {
          quoted: _0x5e5d0d
        });
      }
    }
    const _0x29ca4c = "📖 *Menu d'aide des commandes :*\n\n📌 *desc all* → Toutes les commandes\n📌 *desc cat=[catégorie]* → Commandes d’une seule catégorie\n📌 *desc [commande]* → Détail d'une commande spécifique\n\nExemples :\n• desc all\n• desc cat=groupe\n• desc tagall";
    await _0x529689.sendMessage(_0x56b735, {
      text: _0x29ca4c
    }, {
      quoted: _0x5e5d0d
    });
  } catch (_0x2015dd) {
    console.error("Erreur dans description :", _0x2015dd);
    await _0x529689.sendMessage(_0x56b735, {
      text: "❌ Une erreur s’est produite dans le menu description."
    }, {
      quoted: _0x4c905f.ms
    });
  }
});
registerCommand({
  nom_cmd: "theme",
  classe: "Outils",
  react: "🎨",
  desc: "Gérer les thèmes disponibles"
}, async (_0xaae641, _0x7a8c9b, _0x45d5bd) => {
  const {
    arg: _0x1255a2,
    ms: _0x54fc65,
    repondre: _0xa9921d,
    prenium_id: _0x1bf893
  } = _0x45d5bd;
  try {
    if (!_0x1bf893) {
      return _0xa9921d("Vous n'avez pas le droit d'exécuter cette commande.");
    }
    const _0x40c32d = "./lib/theme.json";
    const _0x457abe = fs.readFileSync(_0x40c32d, "utf8");
    const _0xf01eb6 = JSON.parse(_0x457abe);
    const [_0x400b37] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        mention: "1"
      }
    });
    const _0x4dc01d = () => {
      const _0x1da948 = config.PREFIXE + "theme 2";
      const _0x255684 = config.PREFIXE + "theme https://exemple.com/theme1.jpg;https://exemple.com/theme2.png";
      return _0x7a8c9b.sendMessage(_0xaae641, {
        text: "🎨 *Utilisation de la commande thème :*\n\n" + ("• *" + config.PREFIXE + "theme list* : Affiche la liste des thèmes disponibles\n") + ("• *" + config.PREFIXE + "theme <numéro>* : Applique un thème par son numéro\n") + ("• *" + config.PREFIXE + "theme <url>* : Utilise une ou plusieurs images personnalisées (séparées par ; )\n\n") + "📌 *Exemples :*\n" + ("- " + _0x1da948 + "\n") + ("- " + _0x255684)
      }, {
        quoted: _0x54fc65
      });
    };
    if (_0x1255a2.length === 0) {
      return _0x4dc01d();
    }
    const _0x3fa810 = _0x1255a2.join(" ").toLowerCase();
    if (_0x3fa810 === "list") {
      let _0x180a30 = "*🎨 Liste des thèmes disponibles :*\n";
      _0xf01eb6.forEach((_0x4bf4d4, _0x527786) => {
        _0x180a30 += _0x527786 + 1 + ". " + _0x4bf4d4.nom + "\n";
      });
      return _0x7a8c9b.sendMessage(_0xaae641, {
        image: {
          url: "https://files.catbox.moe/6xlk10.jpg"
        },
        caption: _0x180a30
      }, {
        quoted: _0x54fc65
      });
    }
    if (_0x3fa810.startsWith("http://") || _0x3fa810.startsWith("https://")) {
      const _0x34dc5c = _0x1255a2.join(" ").split(";").map(_0x4b33ff => _0x4b33ff.trim()).filter(_0x2f9cd6 => _0x2f9cd6.length > 0);
      const _0x18813a = /^https?:\/\/.+/i;
      for (const _0x143a7e of _0x34dc5c) {
        if (!_0x18813a.test(_0x143a7e)) {
          return _0xa9921d("❌ URL invalide : " + _0x143a7e);
        }
      }
      _0x400b37.mention = JSON.stringify(_0x34dc5c);
      await _0x400b37.save();
      return _0x7a8c9b.sendMessage(_0xaae641, {
        text: "✅ " + _0x34dc5c.length + " thème(s) personnalisé(s) défini(s)."
      }, {
        quoted: _0x54fc65
      });
    }
    const _0x35244 = parseInt(_0x3fa810, 10);
    if (isNaN(_0x35244) || _0x35244 < 1 || _0x35244 > _0xf01eb6.length) {
      return _0x7a8c9b.sendMessage(_0xaae641, {
        text: "❌ Numéro invalide.\n📌 Utilise *" + config.PREFIXE + "theme list* pour voir les numéros disponibles."
      }, {
        quoted: _0x54fc65
      });
    }
    const _0x3bf2dc = _0xf01eb6[_0x35244 - 1];
    const _0x43d619 = _0x3bf2dc.id;
    _0x400b37.mention = _0x43d619;
    await _0x400b37.save();
    return _0x7a8c9b.sendMessage(_0xaae641, {
      text: "✅ Thème *" + _0x3bf2dc.nom + "* sélectionné avec succès !"
    }, {
      quoted: _0x54fc65
    });
  } catch (_0x1b4ab0) {
    console.error("Erreur dans la commande theme :", _0x1b4ab0);
    return _0x7a8c9b.sendMessage(_0xaae641, {
      text: "❌ Une erreur est survenue lors du traitement de la commande."
    }, {
      quoted: _0x54fc65
    });
  }
});
registerCommand({
  nom_cmd: "menu",
  classe: "Outils",
  react: "🔅",
  desc: "Affiche le menu du bot"
}, async (_0x1f1cac, _0x1ffe32, _0x47ebd2) => {
  const {
    ms: _0x264f18,
    arg: _0x244a83
  } = _0x47ebd2;
  try {
    const _0x49404b = process.uptime();
    const _0x3418cd = Math.floor(_0x49404b / 86400);
    const _0xa62a10 = Math.floor(_0x49404b / 3600 % 24);
    const _0x27c8d2 = Math.floor(_0x49404b % 3600 / 60);
    const _0x4f33ca = Math.floor(_0x49404b % 60);
    let _0x4ea20 = "";
    if (_0x3418cd > 0) {
      _0x4ea20 += _0x3418cd + "J ";
    }
    if (_0xa62a10 > 0) {
      _0x4ea20 += _0xa62a10 + "H ";
    }
    if (_0x27c8d2 > 0) {
      _0x4ea20 += _0x27c8d2 + "M ";
    }
    if (_0x4f33ca > 0) {
      _0x4ea20 += _0x4f33ca + "S";
    }
    const _0x3bc62d = new Date();
    const _0x7a9b1 = _0x3bc62d.toLocaleDateString("fr-FR");
    const _0x510504 = _0x3bc62d.toLocaleTimeString("fr-FR");
    const _0x3967a9 = process.platform;
    const _0x48b7d4 = cmd;
    const _0x5c70eb = {};
    _0x48b7d4.forEach(_0x5c81b5 => {
      if (!_0x5c70eb[_0x5c81b5.classe]) {
        _0x5c70eb[_0x5c81b5.classe] = [];
      }
      _0x5c70eb[_0x5c81b5.classe].push(_0x5c81b5);
    });
    const _0xb0843c = Object.keys(_0x5c70eb).sort((_0x309b7e, _0x5cdeb8) => _0x309b7e.localeCompare(_0x5cdeb8, undefined, {
      sensitivity: "base"
    }));
    _0xb0843c.forEach(_0x688874 => {
      _0x5c70eb[_0x688874].sort((_0x8bd3fc, _0x31ed32) => _0x8bd3fc.nom_cmd.localeCompare(_0x31ed32.nom_cmd, undefined, {
        numeric: true
      }));
    });
    let _0x4e58a0 = "";
    if (_0x244a83.length === 0) {
      _0x4e58a0 += "╭──⟪ " + config.NOM_BOT + " ⟫──╮\n├ ߷ Préfixe       : " + config.PREFIXE + "\n├ ߷ Owner         : " + config.NOM_OWNER + "\n├ ߷ Commandes     : " + _0x48b7d4.length + "\n├ ߷ Uptime        : " + _0x4ea20.trim() + "\n├ ߷ Date          : " + _0x7a9b1 + "\n├ ߷ Heure         : " + _0x510504 + "\n├ ߷ Plateforme    : " + _0x3967a9 + "\n├ ߷ Développeur   : " + config.NOM_OWNER + "\n├ ߷ Version       : " + pkg.version + "\n╰──────────────────╯\n\n";
      _0x4e58a0 += "╭───⟪ Catégories ⟫───╮\n";
      _0xb0843c.forEach((_0x3d0405, _0x2f1cd2) => {
        _0x4e58a0 += "├ ߷ " + (_0x2f1cd2 + 1) + " • " + _0x3d0405 + "\n";
      });
      _0x4e58a0 += "╰───────────────────╯\n";
      _0x4e58a0 += "\n💡 Tape *" + config.PREFIXE + "menu <numéro>* ou *" + config.PREFIXE + "menu <nom>* pour voir les commandes d'une catégorie.\n💡 Tape *" + config.PREFIXE + "allmenu* pour voir la liste de toutes les commandes disponibles.\n📌 Exemples :\n• *" + config.PREFIXE + "menu 1*\n• *" + config.PREFIXE + "menu outils*\n\n> ©2025 Manewbot by *Manewbie*";
    } else if (_0x244a83[0].toLowerCase() === "allmenu") {
      _0x4e58a0 += "╭──⟪ Toutes les commandes ⟫──╮\n";
      _0x48b7d4.forEach(_0x19f2c8 => {
        _0x4e58a0 += "├ ߷ [" + _0x19f2c8.classe + "] " + _0x19f2c8.nom_cmd + "\n";
      });
      _0x4e58a0 += "╰───────────────────────────╯\n";
    } else {
      const _0x34ab7a = _0x244a83.join(" ").toLowerCase();
      let _0x102010 = null;
      const _0x11a3e1 = parseInt(_0x34ab7a, 10);
      if (!isNaN(_0x11a3e1)) {
        if (_0x11a3e1 < 1 || _0x11a3e1 > _0xb0843c.length) {
          return _0x1ffe32.sendMessage(_0x1f1cac, {
            text: "Catégorie introuvable : " + _0x244a83[0]
          }, {
            quoted: _0x264f18
          });
        }
        _0x102010 = _0xb0843c[_0x11a3e1 - 1];
      } else {
        _0x102010 = _0xb0843c.find(_0x5aa545 => _0x5aa545.toLowerCase() === _0x34ab7a);
        if (!_0x102010) {
          return _0x1ffe32.sendMessage(_0x1f1cac, {
            text: "Catégorie introuvable : " + _0x244a83.join(" ")
          }, {
            quoted: _0x264f18
          });
        }
      }
      _0x4e58a0 += "╭────⟪ " + _0x102010.toUpperCase() + " ⟫────╮\n";
      _0x5c70eb[_0x102010].forEach(_0x2a6b38 => {
        _0x4e58a0 += "├ ߷ " + _0x2a6b38.nom_cmd + "\n";
      });
      _0x4e58a0 += "╰──────────────────╯\n\nTape *" + config.PREFIXE + "menu* pour revenir au menu principal.";
    }
    const [_0x855630] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        mention: "1"
      }
    });
    const _0x31ce42 = "./lib/theme.json";
    const _0x50a8a5 = fs.readFileSync(_0x31ce42, "utf8");
    const _0x1ba83a = JSON.parse(_0x50a8a5);
    let _0x549542;
    if (_0x855630.mention.startsWith("[")) {
      const _0x1f132d = JSON.parse(_0x855630.mention);
      _0x549542 = _0x1f132d[Math.floor(Math.random() * _0x1f132d.length)];
    } else if (_0x855630.mention.startsWith("http")) {
      const _0xdd789b = JSON.parse(_0x855630.mention);
      _0x549542 = _0xdd789b[Math.floor(Math.random() * _0xdd789b.length)];
    } else {
      const _0x17de6d = _0x1ba83a.find(_0x47df82 => _0x47df82.id === _0x855630.mention);
      if (!_0x17de6d) {
        throw new Error();
      }
      _0x549542 = _0x17de6d.theme[Math.floor(Math.random() * _0x17de6d.theme.length)];
    }
    try {
      if (_0x549542 && _0x549542.endsWith(".mp4")) {
        await _0x1ffe32.sendMessage(_0x1f1cac, {
          video: {
            url: _0x549542
          },
          caption: stylize(_0x4e58a0),
          gifPlayback: true
        }, {
          quoted: _0x264f18
        });
      } else if (_0x549542) {
        await _0x1ffe32.sendMessage(_0x1f1cac, {
          image: {
            url: _0x549542
          },
          caption: stylize(_0x4e58a0)
        }, {
          quoted: _0x264f18
        });
      } else {
        throw new Error();
      }
    } catch {
      await _0x1ffe32.sendMessage(_0x1f1cac, {
        text: stylize(_0x4e58a0)
      }, {
        quoted: _0x264f18
      });
    }
  } catch {
    await _0x1ffe32.sendMessage(_0x1f1cac, {
      text: "Une erreur est survenue lors de la génération du menu."
    }, {
      quoted: _0x264f18
    });
  }
});
registerCommand({
  nom_cmd: "allmenu",
  classe: "Outils",
  react: "📜",
  desc: "Affiche toutes les commandes du bot"
}, async (_0x545a1b, _0x1751ce, _0x5af2a9) => {
  const {
    ms: _0x4e09ec
  } = _0x5af2a9;
  try {
    const _0x344b84 = process.uptime();
    const _0x22ee95 = Math.floor(_0x344b84 / 86400);
    const _0x5bb9f7 = Math.floor(_0x344b84 / 3600 % 24);
    const _0x439c92 = Math.floor(_0x344b84 % 3600 / 60);
    const _0x35f500 = Math.floor(_0x344b84 % 60);
    let _0x16b22b = "";
    if (_0x22ee95 > 0) {
      _0x16b22b += _0x22ee95 + "J ";
    }
    if (_0x5bb9f7 > 0) {
      _0x16b22b += _0x5bb9f7 + "H ";
    }
    if (_0x439c92 > 0) {
      _0x16b22b += _0x439c92 + "M ";
    }
    if (_0x35f500 > 0) {
      _0x16b22b += _0x35f500 + "S";
    }
    const _0x3910ba = new Date();
    const _0x31bb24 = _0x3910ba.toLocaleDateString("fr-FR");
    const _0x44fae4 = _0x3910ba.toLocaleTimeString("fr-FR");
    const _0x4a56a8 = process.platform;
    const _0x14f569 = cmd;
    const _0x532608 = {};
    _0x14f569.forEach(_0x4b4895 => {
      if (!_0x532608[_0x4b4895.classe]) {
        _0x532608[_0x4b4895.classe] = [];
      }
      _0x532608[_0x4b4895.classe].push(_0x4b4895);
    });
    const _0x238eb9 = Object.keys(_0x532608).sort((_0x54964d, _0x4fa666) => _0x54964d.localeCompare(_0x4fa666));
    for (const _0x54b312 of _0x238eb9) {
      _0x532608[_0x54b312].sort((_0x14f66b, _0x497040) => _0x14f66b.nom_cmd.localeCompare(_0x497040.nom_cmd, undefined, {
        numeric: true
      }));
    }
    let _0x147a08 = "╭──⟪ " + config.NOM_BOT + " ⟫──╮\n├ ߷ Préfixe       : " + config.PREFIXE + "\n├ ߷ Owner         : " + config.NOM_OWNER + "\n├ ߷ Commandes  : " + _0x14f569.length + "\n├ ߷ Uptime        : " + _0x16b22b.trim() + "\n├ ߷ Date    : " + _0x31bb24 + "\n├ ߷ Heure   : " + _0x44fae4 + "\n├ ߷ Plateforme  : " + _0x4a56a8 + "\n├ ߷ Développeur : " + config.NOM_OWNER + "\n├ ߷ Version        : " + pkg.version + "\n╰──────────────────╯\n\n";
    for (const _0x3301f1 of _0x238eb9) {
      _0x147a08 += "╭──⟪ " + _0x3301f1.toUpperCase() + " ⟫──╮\n";
      _0x532608[_0x3301f1].forEach(_0x3eeeeb => {
        _0x147a08 += "├ ߷ " + _0x3eeeeb.nom_cmd + "\n";
      });
      _0x147a08 += "╰──────────────────╯\n\n";
    }
    _0x147a08 += "> ©2025 Manewbot by *Manewbie*";
    const [_0x45701e] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        mention: "1"
      }
    });
    const _0x5124ba = _0x45701e.mention;
    const _0x253a99 = "./lib/theme.json";
    const _0x1e8a2c = fs.readFileSync(_0x253a99, "utf8");
    const _0x1183d3 = JSON.parse(_0x1e8a2c);
    let _0x4b6871;
    if (_0x45701e.mention.startsWith("[")) {
      const _0x4de0f2 = JSON.parse(_0x45701e.mention);
      _0x4b6871 = _0x4de0f2[Math.floor(Math.random() * _0x4de0f2.length)];
    } else if (_0x45701e.mention.startsWith("http://") || _0x45701e.mention.startsWith("https://")) {
      const _0x1a8fb9 = JSON.parse(_0x45701e.mention);
      _0x4b6871 = _0x1a8fb9[Math.floor(Math.random() * _0x1a8fb9.length)];
    } else {
      const _0x325570 = _0x1183d3.find(_0xd5e647 => _0xd5e647.id === _0x45701e.mention);
      if (!_0x325570) {
        throw new Error("Thème introuvable");
      }
      _0x4b6871 = _0x325570.theme[Math.floor(Math.random() * _0x325570.theme.length)];
    }
    try {
      if (_0x4b6871 && _0x4b6871.endsWith(".mp4")) {
        await _0x1751ce.sendMessage(_0x545a1b, {
          video: {
            url: _0x4b6871
          },
          caption: stylize(_0x147a08),
          gifPlayback: true
        }, {
          quoted: _0x4e09ec
        });
      } else if (_0x4b6871) {
        await _0x1751ce.sendMessage(_0x545a1b, {
          image: {
            url: _0x4b6871
          },
          caption: stylize(_0x147a08)
        }, {
          quoted: _0x4e09ec
        });
      } else {
        throw new Error("Aucun thème trouvé");
      }
    } catch (_0x207194) {
      await _0x1751ce.sendMessage(_0x545a1b, {
        text: stylize(_0x147a08)
      }, {
        quoted: _0x4e09ec
      });
    }
  } catch (_0x4078ab) {
    await _0x1751ce.sendMessage(_0x545a1b, {
      text: "Une erreur est survenue lors de l'affichage du menu complet."
    }, {
      quoted: _0x4e09ec
    });
  }
});
registerCommand({
  nom_cmd: "vv",
  classe: "Outils",
  react: "👀",
  desc: "Affiche un message envoyé en vue unique dans la discussion"
}, async (_0x7e18a2, _0x5bacb3, _0x5014a8) => {
  const {
    ms: _0x534fa5,
    msg_Repondu: _0x287c5f,
    repondre: _0x394a23
  } = _0x5014a8;
  if (!_0x287c5f) {
    return _0x394a23("Veuillez mentionner un message en vue unique.");
  }
  let _0x1f2b85 = Object.keys(_0x287c5f).find(_0x4c92c9 => _0x4c92c9.startsWith("viewOnceMessage"));
  let _0x2e7196 = _0x287c5f;
  if (_0x1f2b85) {
    _0x2e7196 = _0x287c5f[_0x1f2b85].message;
  }
  if (_0x2e7196) {
    if (_0x2e7196.imageMessage && _0x2e7196.imageMessage.viewOnce !== true || _0x2e7196.videoMessage && _0x2e7196.videoMessage.viewOnce !== true || _0x2e7196.audioMessage && _0x2e7196.audioMessage.viewOnce !== true) {
      return _0x394a23("Ce message n'est pas un message en vue unique.");
    }
  }
  try {
    let _0x48a70c;
    let _0x4551ed = {
      quoted: _0x534fa5
    };
    if (_0x2e7196.imageMessage) {
      _0x48a70c = await _0x5bacb3.dl_save_media_ms(_0x2e7196.imageMessage);
      await _0x5bacb3.sendMessage(_0x7e18a2, {
        image: {
          url: _0x48a70c
        },
        caption: _0x2e7196.imageMessage.caption || ""
      }, _0x4551ed);
    } else if (_0x2e7196.videoMessage) {
      _0x48a70c = await _0x5bacb3.dl_save_media_ms(_0x2e7196.videoMessage);
      await _0x5bacb3.sendMessage(_0x7e18a2, {
        video: {
          url: _0x48a70c
        },
        caption: _0x2e7196.videoMessage.caption || ""
      }, _0x4551ed);
    } else if (_0x2e7196.audioMessage) {
      _0x48a70c = await _0x5bacb3.dl_save_media_ms(_0x2e7196.audioMessage);
      await _0x5bacb3.sendMessage(_0x7e18a2, {
        audio: {
          url: _0x48a70c
        },
        mimetype: "audio/mp4",
        ptt: false
      }, _0x4551ed);
    } else {
      return _0x394a23("Ce type de message en vue unique n'est pas pris en charge.");
    }
  } catch (_0x2ba795) {
    console.error("❌ Erreur lors de l'envoi du message en vue unique :", _0x2ba795.message || _0x2ba795);
    return _0x394a23("Une erreur est survenue lors du traitement du message.");
  }
});
registerCommand({
  nom_cmd: "vv2",
  classe: "Outils",
  react: "👀",
  desc: "Affiche un message envoyé en vue unique en inbox"
}, async (_0x3554a5, _0x24a425, _0x2577d6) => {
  const {
    ms: _0x195502,
    id_Bot: _0x4aafdc,
    msg_Repondu: _0x17f91b,
    repondre: _0x4de8a1
  } = _0x2577d6;
  if (!_0x17f91b) {
    return _0x4de8a1("Veuillez mentionner un message en vue unique.");
  }
  let _0x50a22c = Object.keys(_0x17f91b).find(_0x23bba8 => _0x23bba8.startsWith("viewOnceMessage"));
  let _0x1932ae = _0x17f91b;
  if (_0x50a22c) {
    _0x1932ae = _0x17f91b[_0x50a22c].message;
  }
  if (_0x1932ae) {
    if (_0x1932ae.imageMessage && _0x1932ae.imageMessage.viewOnce !== true || _0x1932ae.videoMessage && _0x1932ae.videoMessage.viewOnce !== true || _0x1932ae.audioMessage && _0x1932ae.audioMessage.viewOnce !== true) {
      return _0x4de8a1("Ce message n'est pas un message en vue unique.");
    }
  }
  try {
    let _0x2584e9;
    let _0x28fe4a = {
      quoted: _0x195502
    };
    if (_0x1932ae.imageMessage) {
      _0x2584e9 = await _0x24a425.dl_save_media_ms(_0x1932ae.imageMessage);
      await _0x24a425.sendMessage(_0x4aafdc, {
        image: {
          url: _0x2584e9
        },
        caption: _0x1932ae.imageMessage.caption || ""
      }, _0x28fe4a);
    } else if (_0x1932ae.videoMessage) {
      _0x2584e9 = await _0x24a425.dl_save_media_ms(_0x1932ae.videoMessage);
      await _0x24a425.sendMessage(_0x4aafdc, {
        video: {
          url: _0x2584e9
        },
        caption: _0x1932ae.videoMessage.caption || ""
      }, _0x28fe4a);
    } else if (_0x1932ae.audioMessage) {
      _0x2584e9 = await _0x24a425.dl_save_media_ms(_0x1932ae.audioMessage);
      await _0x24a425.sendMessage(_0x4aafdc, {
        audio: {
          url: _0x2584e9
        },
        mimetype: "audio/mp4",
        ptt: false
      }, _0x28fe4a);
    } else {
      return _0x4de8a1("Ce type de message en vue unique n'est pas pris en charge.");
    }
  } catch (_0x4850c1) {
    console.error("❌ Erreur lors de l'envoi du message en vue unique :", _0x4850c1.message || _0x4850c1);
    return _0x4de8a1("Une erreur est survenue lors du traitement du message.");
  }
});
registerCommand({
  nom_cmd: "ping",
  classe: "Outils",
  react: "🏓",
  desc: "Mesure la latence du bot."
}, async (_0x548fc6, _0x55d944, _0x5df7df) => {
  const _0x1bd461 = Date.now();
  const _0x4f2059 = await _0x55d944.sendMessage(_0x548fc6, {
    text: "*Manewbot Ping...*"
  }, {
    quoted: _0x5df7df.ms
  });
  const _0xb1a08d = Date.now();
  const _0x59039b = _0xb1a08d - _0x1bd461;
  await _0x55d944.sendMessage(_0x548fc6, {
    edit: _0x4f2059.key,
    text: "*🏓 Pong ! Latence : " + _0x59039b + "ms*"
  });
});
registerCommand({
  nom_cmd: "uptime",
  classe: "Outils",
  react: "⏱️",
  desc: "Affiche le temps de fonctionnement du bot.",
  alias: ["upt"]
}, async (_0x1d4d60, _0x1b003d, _0x45d63e) => {
  const _0x2e34e7 = process.uptime();
  const _0x41d798 = Math.floor(_0x2e34e7 / 86400);
  const _0x59df61 = Math.floor(_0x2e34e7 / 3600 % 24);
  const _0x256368 = Math.floor(_0x2e34e7 % 3600 / 60);
  const _0x867089 = Math.floor(_0x2e34e7 % 60);
  let _0x31bc84 = "";
  if (_0x41d798 > 0) {
    _0x31bc84 += _0x41d798 + "J ";
  }
  if (_0x59df61 > 0) {
    _0x31bc84 += _0x59df61 + "H ";
  }
  if (_0x256368 > 0) {
    _0x31bc84 += _0x256368 + "M ";
  }
  if (_0x867089 > 0) {
    _0x31bc84 += _0x867089 + "S";
  }
  await _0x1b003d.sendMessage(_0x1d4d60, {
    text: "⏳ Temps de fonctionnement : " + _0x31bc84
  }, {
    quoted: _0x45d63e.ms
  });
});
registerCommand({
  nom_cmd: "translate",
  classe: "Outils",
  react: "🌍",
  desc: "Traduit un texte dans la langue spécifiée.",
  alias: ["trt"]
}, async (_0x2d658c, _0x22de37, _0x54ebc) => {
  const {
    arg: _0x26a7a1,
    ms: _0x806016,
    msg_Repondu: _0x4ad6db
  } = _0x54ebc;
  let _0x42757c;
  let _0x583fd0;
  if (_0x4ad6db && _0x26a7a1.length === 1) {
    _0x42757c = _0x26a7a1[0];
    _0x583fd0 = _0x4ad6db.conversation || _0x4ad6db.extendedTextMessage?.text;
  } else if (_0x26a7a1.length >= 2) {
    _0x42757c = _0x26a7a1[0];
    _0x583fd0 = _0x26a7a1.slice(1).join(" ");
  } else {
    return await _0x22de37.sendMessage(_0x2d658c, {
      text: "Utilisation : " + prefixe + "translate <langue> <texte> ou répondre à un message avec : " + prefixe + "translate <langue>"
    }, {
      quoted: _0x806016
    });
  }
  try {
    const _0x525d93 = await translate(_0x583fd0, {
      to: _0x42757c
    });
    await _0x22de37.sendMessage(_0x2d658c, {
      text: "🌐Traduction (" + _0x42757c + ") :\n" + _0x525d93.text
    }, {
      quoted: _0x806016
    });
  } catch (_0x4256cf) {
    console.error("Erreur lors de la traduction:", _0x4256cf);
    await _0x22de37.sendMessage(_0x2d658c, {
      text: "Erreur lors de la traduction. Vérifiez la langue et le texte fournis."
    }, {
      quoted: _0x806016
    });
  }
});
registerCommand({
  nom_cmd: "capture",
  classe: "Outils",
  react: "📸",
  desc: "Prend une capture d'écran d'un site web."
}, async (_0x3737d8, _0x3d43db, {
  arg: _0x6c88d4,
  ms: _0x14ec31
}) => {
  if (!_0x6c88d4[0]) {
    return _0x3d43db.sendMessage(_0x3737d8, {
      text: "Entrez un lien"
    }, {
      quoted: _0x14ec31
    });
  }
  const _0x428390 = _0x6c88d4[0];
  try {
    const _0x34184a = await axios.get("https://eliteprotech-apis.zone.id/ssweb?url=" + encodeURIComponent(_0x428390), {
      responseType: "arraybuffer"
    });
    await _0x3d43db.sendMessage(_0x3737d8, {
      image: _0x34184a.data,
      caption: "Voici la capture d'écran de: " + _0x428390
    }, {
      quoted: _0x14ec31
    });
  } catch (_0x14bc54) {
    console.error("Erreur lors de la capture de l'écran:", _0x14bc54.message);
    await _0x3d43db.sendMessage(_0x3737d8, {
      text: "Une erreur est survenue lors de la capture du site. Veuillez réessayer plus tard."
    }, {
      quoted: _0x14ec31
    });
  }
});
registerCommand({
  nom_cmd: "system_status",
  classe: "Outils",
  react: "🖥️",
  desc: "Affiche les informations du système en temps réel"
}, async (_0x22c8b0, _0x1e8e98, _0xf6869) => {
  const _0x3bbea3 = os.platform();
  const _0x1dd2e3 = os.arch();
  const _0x24d268 = os.cpus();
  const _0x218147 = (os.totalmem() / 1073741824).toFixed(2);
  const _0x1676a9 = (os.freemem() / 1073741824).toFixed(2);
  const _0x2317ec = os.hostname();
  const _0x3e4d50 = os.loadavg();
  const _0x26adf7 = os.uptime();
  const _0x2c772d = Math.floor(_0x26adf7 / 86400);
  const _0x28c8ad = Math.floor(_0x26adf7 / 3600 % 24);
  const _0x31cafc = Math.floor(_0x26adf7 % 3600 / 60);
  const _0x133234 = Math.floor(_0x26adf7 % 60);
  let _0x1b5ca9 = "";
  if (_0x2c772d > 0) {
    _0x1b5ca9 += _0x2c772d + "J ";
  }
  if (_0x28c8ad > 0) {
    _0x1b5ca9 += _0x28c8ad + "H ";
  }
  if (_0x31cafc > 0) {
    _0x1b5ca9 += _0x31cafc + "M ";
  }
  if (_0x133234 > 0) {
    _0x1b5ca9 += _0x133234 + "S";
  }
  const _0x22f987 = _0x24d268.map(_0x3324f7 => {
    let _0x2dec98 = 0;
    for (type in _0x3324f7.times) {
      _0x2dec98 += _0x3324f7.times[type];
    }
    const _0x583d87 = (100 - _0x3324f7.times.idle / _0x2dec98 * 100).toFixed(2);
    return _0x583d87 + "%";
  }).join(", ");
  const _0x12e614 = (100 - _0x3e4d50[0] * 100 / _0x24d268.length).toFixed(2);
  await _0x1e8e98.sendMessage(_0x22c8b0, {
    text: "🖥️ *ÉTAT DU SYSTÈME*\n\n" + ("⚡ *Vitesse du serveur*: " + _0x12e614 + " %\n") + ("🖧 *Charge Moyenne*: " + _0x3e4d50.map(_0x37eba0 => _0x37eba0.toFixed(2)).join(", ") + "\n") + ("⏳ *Uptime*: " + _0x1b5ca9.trim() + "\n") + ("💻 *Plateforme*: " + _0x3bbea3 + "\n") + ("🔧 *Architecture*: " + _0x1dd2e3 + "\n") + ("🖧 *Processeur*: " + _0x24d268.length + " Cœur(s) (" + _0x22f987 + ")\n") + ("💾 *Mémoire Totale*: " + _0x218147 + " GB\n") + ("🆓 *Mémoire Libre*: " + _0x1676a9 + " GB\n") + ("🌐 *Nom de l'Hôte*: " + _0x2317ec + "\n") + ("🎉 *Version: Manewbot " + pkg.version)
  }, {
    quoted: _0xf6869.ms
  });
});
registerCommand({
  nom_cmd: "tempmail",
  classe: "Outils",
  react: "📧",
  desc: "Crée un email temporaire."
}, async (_0x5dad70, _0xc7d8a8, _0x12ef0a) => {
  const {
    ms: _0x5e9972
  } = _0x12ef0a;
  try {
    const _0x1ba558 = new TempMail();
    const _0x558f2c = await _0x1ba558.createInbox();
    const _0x10ce96 = "Voici votre adresse email temporaire : " + _0x558f2c.address + "\n\nVotre token est : " + _0x558f2c.token + "\n\nPour récupérer vos messages, utilisez <tempinbox votre-token>.";
    await _0xc7d8a8.sendMessage(_0x5dad70, {
      text: _0x10ce96
    }, {
      quoted: _0x5e9972
    });
  } catch (_0x2a5677) {
    console.error(_0x2a5677);
    return _0xc7d8a8.sendMessage(_0x5dad70, {
      text: "Une erreur s'est produite lors de la création de l'email temporaire."
    }, {
      quoted: _0x5e9972
    });
  }
});
registerCommand({
  nom_cmd: "tempinbox",
  classe: "Outils",
  react: "📩",
  desc: "Récupère les messages d'un email temporaire."
}, async (_0x3779ec, _0x1fe870, _0x274ede) => {
  const {
    arg: _0x195223,
    ms: _0x4152a1
  } = _0x274ede;
  if (!_0x195223[0]) {
    return _0x1fe870.sendMessage(_0x3779ec, {
      text: "Pour récupérer les messages de votre email temporaire, fournissez le token qui a été émis."
    });
  }
  try {
    const _0x5579bc = new TempMail();
    const _0x318f7d = await _0x5579bc.checkInbox(_0x195223[0]);
    if (!_0x318f7d || _0x318f7d.length === 0) {
      return _0x1fe870.sendMessage(_0x3779ec, {
        text: "Aucun message trouvé pour ce token."
      }, {
        quoted: _0x4152a1
      });
    }
    for (let _0x14e7a4 = 0; _0x14e7a4 < _0x318f7d.length; _0x14e7a4++) {
      const _0x18f65d = _0x318f7d[_0x14e7a4];
      const _0x20029e = _0x18f65d.sender;
      const _0x249ce1 = _0x18f65d.subject;
      const _0x4a5d27 = new Date(_0x18f65d.date).toLocaleString();
      const _0x5ce2c2 = _0x18f65d.body;
      const _0x3701af = "👥 Expéditeur : " + _0x20029e + "\n📝 Sujet : " + _0x249ce1 + "\n🕜 Date : " + _0x4a5d27 + "\n📩 Message : " + _0x5ce2c2;
      await _0x1fe870.sendMessage(_0x3779ec, {
        text: _0x3701af
      }, {
        quoted: _0x4152a1
      });
    }
  } catch (_0x5ccd44) {
    console.error(_0x5ccd44);
    return _0x1fe870.sendMessage(_0x3779ec, {
      text: "Une erreur est survenue lors de la récupération des messages de l'email temporaire."
    }, {
      quoted: _0x4152a1
    });
  }
});
registerCommand({
  nom_cmd: "obfuscate",
  classe: "Outils",
  react: "📥",
  desc: "Obfusque du code JavaScript",
  alias: ["obf"]
}, async (_0x40d138, _0x1dab5a, _0x5a7c45) => {
  const {
    arg: _0x4052f7,
    repondre: _0x504b37,
    ms: _0x57d36c
  } = _0x5a7c45;
  if (!_0x4052f7 || _0x4052f7.length === 0) {
    return _0x504b37("Veuillez fournir le code JavaScript à obfusquer.");
  }
  const _0x2a0894 = _0x4052f7.join(" ");
  try {
    _0x504b37("🔄obfucation en cours...");
    const _0xdf2bdb = JavaScriptObfuscator.obfuscate(_0x2a0894, {
      compact: true,
      controlFlowFlattening: true
    }).getObfuscatedCode();
    const _0x306951 = path.join(__dirname, "obfuscate.js");
    fs.writeFileSync(_0x306951, _0xdf2bdb);
    await _0x1dab5a.sendMessage(_0x40d138, {
      document: {
        url: _0x306951
      },
      mimetype: "application/javascript",
      fileName: "obfuscate.js"
    }, {
      quoted: _0x57d36c
    });
    fs.unlinkSync(_0x306951);
  } catch (_0x225b3e) {
    console.error(_0x225b3e);
    _0x504b37("Une erreur est survenue lors de l'obfuscation du code.");
  }
});
registerCommand({
  nom_cmd: "gitclone",
  classe: "Outils",
  react: "📥",
  desc: "clone un repo Git",
  alias: ["gcl"]
}, async (_0x1eda85, _0x427833, _0xb4a790) => {
  const {
    arg: _0x509e8c,
    repondre: _0x39fd89,
    ms: _0x3b909a
  } = _0xb4a790;
  if (!_0x509e8c || _0x509e8c.length < 1) {
    return _0x39fd89("Veuillez fournir l'URL du dépôt Git à cloner.");
  }
  const _0x165029 = _0x509e8c[0];
  const _0x3272b6 = _0x165029 + ".git";
  const _0x2965df = _0x509e8c[1] ? _0x509e8c[1] : path.basename(_0x3272b6, ".git");
  const _0xd7f305 = _0x2965df + ".zip";
  const _0xe9e8b = /^(https?:\/\/|git@)([\w.@:\/-]+)(\.git)(\/?)$/;
  if (!_0xe9e8b.test(_0x3272b6)) {
    return _0x39fd89("URL de dépôt Git invalide.");
  }
  try {
    _0x39fd89("🔄Clonage du dépôt en cours...");
    exec("git clone " + _0x3272b6 + " " + _0x2965df, (_0x3824e6, _0x424707, _0xddce34) => {
      if (_0x3824e6) {
        return _0x39fd89("Erreur lors du clonage du dépôt : " + _0x3824e6.message);
      }
      try {
        const _0x5a21e2 = new AdmZip();
        _0x5a21e2.addLocalFolder(_0x2965df);
        _0x5a21e2.writeZip(_0xd7f305);
        const _0x2a5e24 = {
          document: fs.readFileSync(_0xd7f305),
          mimetype: "application/zip",
          fileName: _0x2965df + ".zip"
        };
        _0x427833.sendMessage(_0x1eda85, _0x2a5e24, {
          quoted: _0x3b909a
        });
        fs.rmSync(_0x2965df, {
          recursive: true,
          force: true
        });
        fs.unlinkSync(_0xd7f305);
      } catch (_0x1f7994) {
        _0x39fd89("Erreur lors de la compression en zip : " + _0x1f7994.message);
      }
    });
  } catch (_0x52683d) {
    console.error(_0x52683d);
    _0x39fd89("Une erreur est survenue lors du clonage du dépôt.");
  }
});
registerCommand({
  nom_cmd: "owner",
  classe: "Outils",
  react: "🔅",
  desc: "Numero du propriétaire du bot"
}, async (_0x1023d1, _0x3d3431, _0x1db913) => {
  const _0x59ddaf = "BEGIN:VCARD\nVERSION:3.0\nFN:" + config.NOM_OWNER + "\nORG:undefined;\nTEL;type=CELL;type=VOICE;waid=" + config.NUMERO_OWNER + ":+" + config.NUMERO_OWNER + "\nEND:VCARD";
  _0x3d3431.sendMessage(_0x1023d1, {
    contacts: {
      displayName: config.NOM_OWNER,
      contacts: [{
        vcard: _0x59ddaf
      }]
    }
  }, {
    quoted: _0x1db913.ms
  });
});
registerCommand({
  nom_cmd: "developpeur",
  classe: "Outils",
  react: "🔅",
  desc: "Numero du créateur du bot",
  alias: ["dev"]
}, async (_0x3b9d8d, _0x202993, _0x353702) => {
  const _0x1d7b39 = "22651463203";
  const _0x38c742 = "Manewbie";
  const _0x4a6d6b = "BEGIN:VCARD\nVERSION:3.0\nFN:" + _0x38c742 + "\nORG:undefined;\nTEL;type=CELL;type=VOICE;waid=" + _0x1d7b39 + ":+" + _0x1d7b39 + "\nEND:VCARD";
  _0x202993.sendMessage(_0x3b9d8d, {
    contacts: {
      displayName: _0x38c742,
      contacts: [{
        vcard: _0x4a6d6b
      }]
    }
  }, {
    quoted: _0x353702.ms
  });
});
registerCommand({
  nom_cmd: "support",
  classe: "Outils",
  react: "📩",
  desc: "Lien vers les groupes de support du bot"
}, async (_0x304772, _0x460198, _0x2a200e) => {
  const {
    verif_Groupe: _0xd0826c,
    repondre: _0x298fed,
    auteur_Message: _0x3d0bd0,
    ms: _0x3d9dae
  } = _0x2a200e;
  const _0x13eafb = ["https://chat.whatsapp.com/HzhikAmOuYhFXGLmcyMo62", "https://chat.whatsapp.com/BP1oOMh0QvR7H3vvO9bRYK"];
  const _0x2ce08e = "📩 *Manewbot SUPPORT*\nVoici les liens pour rejoindre les groupes de support:\n\n" + _0x13eafb.map(_0x5d5df7 => "🔗 " + _0x5d5df7).join("\n\n");
  if (_0xd0826c) {
    await _0x298fed("📩 Les liens d'invitation ont été envoyés en message privé.");
    await _0x460198.sendMessage(_0x3d0bd0, {
      text: _0x2ce08e
    }, {
      quoted: _0x3d9dae
    });
  } else {
    await _0x460198.sendMessage(_0x304772, {
      text: _0x2ce08e
    }, {
      quoted: _0x3d9dae
    });
  }
});
registerCommand({
  nom_cmd: "repo",
  alias: ["sc", "script", "code_source", "repository"],
  classe: "Outils",
  react: "📦",
  desc: "Affiche les informations et le lien du repository du bot"
}, async (_0x11853e, _0x1ba3d4, {
  ms: _0x108a39,
  repondre: _0x51018f
}) => {
  const _0x4d4142 = "https://github.com/manuelebeh/manewbot";
  let _0x56a3f9;
  try {
    const {
      data: _0x3f9927
    } = await axios.get("https://api.github.com/repos/manuelebeh/manewbot");
    _0x56a3f9 = "\n╭───⟪ 📦 Manewbot ⟫───╮\n│ ⇨ ⭐ Stars       : " + _0x3f9927.stargazers_count + "\n│ ⇨ 🍴 Forks       : " + _0x3f9927.forks_count + "\n│ ⇨ 🔄 Dernière MAJ : " + new Date(_0x3f9927.pushed_at).toLocaleDateString("fr-FR") + "\n│ ⇨ 🔗 Repo        : " + _0x3f9927.html_url + "\n╰───────────────────╯\n> ©2025 Manewbot by *Manewbie*";
  } catch (_0x52514d) {
    console.error("Erreur récupération API :", _0x52514d);
    _0x56a3f9 = "\n╭───⟪ 📦 Manewbot ⟫───╮\n│ 🔗 Repo : " + _0x4d4142 + "\n╰───────────────────╯\n> ©2025 Manewbot by *Manewbie*";
  }
  try {
    await _0x1ba3d4.sendMessage(_0x11853e, {
      image: {
        url: "https://files.catbox.moe/lojrxz.jpg"
      },
      caption: _0x56a3f9,
      contextInfo: contextInfo
    }, {
      quoted: _0x108a39
    });
  } catch (_0x6472d5) {
    console.error("Erreur envoi avec image :", _0x6472d5);
    await _0x1ba3d4.sendMessage(_0x11853e, {
      text: _0x56a3f9,
      contextInfo: contextInfo
    }, {
      quoted: _0x108a39
    });
  }
});