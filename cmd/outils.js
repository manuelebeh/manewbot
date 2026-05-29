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
  spawn
} = require("child_process");
const AdmZip = require("adm-zip");
const os = require("os");
const pkg = require("../package");
function stylize(text) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const digits = "0123456789";
  return text.split("").map(char => {
    const index = alphabet.indexOf(char);
    if (index !== -1) {
      return digits[index];
    }
    return char;
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
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre,
    arg
  } = ctx;
  try {
    const url = "./lib/theme.json";
    const fileData = fs.readFileSync(url, "utf8");
    const parsed = JSON.parse(fileData);
    const [tmp] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        mention: "1"
      }
    });
    const prefix = "🌐 Bienvenue sur *Manewbot*, votre bot WhatsApp multi-device.\n🔍 Tapez *" + config.PREFIXE + "allmenu* pour voir toutes les commandes disponibles.\n> ©2025 Manewbot by *Manewbie*";
    let item;
    if (tmp.mention.startsWith("[")) {
      const parsed2 = JSON.parse(tmp.mention);
      item = parsed2[Math.floor(Math.random() * parsed2.length)];
    } else if (tmp.mention.startsWith("http://") || tmp.mention.startsWith("https://")) {
      const parsed3 = JSON.parse(tmp.mention);
      item = parsed3[Math.floor(Math.random() * parsed3.length)];
    } else {
      const value = parsed.find(tmp2 => tmp2.id === tmp.mention);
      if (!value) {
        throw new Error("Thème introuvable");
      }
      item = value.theme[Math.floor(Math.random() * value.theme.length)];
    }
    if (item.endsWith(".mp4")) {
      await sock.sendMessage(chatJid, {
        video: {
          url: item
        },
        caption: stylize(prefix),
        gifPlayback: true
      }, {
        quoted: ms
      });
    } else {
      await sock.sendMessage(chatJid, {
        image: {
          url: item
        },
        caption: stylize(prefix)
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    console.error("Erreur dans test:", err);
    const prefix2 = "🌐 Bienvenue sur *Manewbot*, votre bot WhatsApp multi-device.\n🔍 Tapez *" + config.PREFIXE + "menu* pour voir toutes les commandes disponibles.\n> ©2025 Manewbot by *Manewbie*";
    await sock.sendMessage(chatJid, {
      text: stylize(prefix2)
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "description",
  classe: "Outils",
  desc: "Menu des commandes : toutes, par catégorie ou détail d’une commande.",
  alias: ["desc", "help"]
}, async (chatJid, sock, ctx) => {
  try {
    const {
      arg,
      ms
    } = ctx;
    const cmd = cmd;
    if (arg.length) {
      const value = arg[0].toLowerCase();
      if (value === "all") {
        let url = "📚 *Toutes les commandes disponibles :*\n\n";
        cmd.forEach(tmp => {
          url += "🔹 *" + tmp.nom_cmd + "* — _" + tmp.desc + "_\nAlias : [" + tmp.alias.join(", ") + "]\nClasse : " + tmp.classe + "\n\n";
        });
        return await sock.sendMessage(chatJid, {
          text: url
        }, {
          quoted: ms
        });
      }
      if (value === "cat") {
        const list = [...new Set(cmd.map(tmp2 => tmp2.classe))];
        let url2 = "📂 *Catégories disponibles :*\n\n";
        list.forEach(tmp3 => {
          const value2 = cmd.filter(tmp4 => tmp4.classe === tmp3);
          url2 += "📁 *" + tmp3 + "* (" + value2.length + ")\n";
          value2.forEach(tmp5 => {
            url2 += " ┗ 🧩 *" + tmp5.nom_cmd + "* — _" + tmp5.desc + "_\n";
          });
          url2 += "\n";
        });
        return await sock.sendMessage(chatJid, {
          text: url2
        }, {
          quoted: ms
        });
      }
      if (value.startsWith("cat=")) {
        const value3 = value.split("cat=")[1].toLowerCase();
        const list2 = [...new Set(cmd.map(tmp6 => tmp6.classe.toLowerCase()))];
        if (!list2.includes(value3)) {
          return await sock.sendMessage(chatJid, {
            text: "❌ Catégorie *\"" + value3 + "\"* introuvable.\nUtilise *desc cat* pour voir les catégories disponibles."
          }, {
            quoted: ms
          });
        }
        const value4 = cmd.filter(tmp7 => tmp7.classe.toLowerCase() === value3);
        let url3 = "📁 *Commandes de la catégorie \"" + value3 + "\"* (" + value4.length + ") :\n\n";
        value4.forEach(tmp8 => {
          url3 += "🧩 *" + tmp8.nom_cmd + "* — _" + tmp8.desc + "_\nAlias : [" + tmp8.alias.join(", ") + "]\n\n";
        });
        return await sock.sendMessage(chatJid, {
          text: url3
        }, {
          quoted: ms
        });
      }
      const value5 = cmd.find(tmp9 => tmp9.nom_cmd.toLowerCase() === value || tmp9.alias.map(tmp10 => tmp10.toLowerCase()).includes(value));
      if (value5) {
        const text = "🧩 *Détails de la commande :*\n\n" + ("🔹 *Nom* : " + value5.nom_cmd + "\n") + ("📚 *Alias* : [" + value5.alias.join(", ") + "]\n") + ("🗂️ *Classe* : " + value5.classe + "\n") + ("📝 *Description* : " + value5.desc);
        return await sock.sendMessage(chatJid, {
          text: text
        }, {
          quoted: ms
        });
      } else {
        return await sock.sendMessage(chatJid, {
          text: "❌ Commande ou alias *\"" + value + "\"* introuvable."
        }, {
          quoted: ms
        });
      }
    }
    const url4 = "📖 *Menu d'aide des commandes :*\n\n📌 *desc all* → Toutes les commandes\n📌 *desc cat=[catégorie]* → Commandes d’une seule catégorie\n📌 *desc [commande]* → Détail d'une commande spécifique\n\nExemples :\n• desc all\n• desc cat=groupe\n• desc tagall";
    await sock.sendMessage(chatJid, {
      text: url4
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur dans description :", err);
    await sock.sendMessage(chatJid, {
      text: "❌ Une erreur s’est produite dans le menu description."
    }, {
      quoted: ctx.ms
    });
  }
});
registerCommand({
  nom_cmd: "theme",
  classe: "Outils",
  react: "🎨",
  desc: "Gérer les thèmes disponibles"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre,
    isSudo
  } = ctx;
  try {
    if (!isSudo) {
      return repondre("Vous n'avez pas le droit d'exécuter cette commande.");
    }
    const url = "./lib/theme.json";
    const fileData = fs.readFileSync(url, "utf8");
    const parsed = JSON.parse(fileData);
    const [tmp] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        mention: "1"
      }
    });
    const prefix = () => {
      const tmp2 = config.PREFIXE + "theme 2";
      const prefix2 = config.PREFIXE + "theme https://exemple.com/theme1.jpg;https://exemple.com/theme2.png";
      return sock.sendMessage(chatJid, {
        text: "🎨 *Utilisation de la commande thème :*\n\n" + ("• *" + config.PREFIXE + "theme list* : Affiche la liste des thèmes disponibles\n") + ("• *" + config.PREFIXE + "theme <numéro>* : Applique un thème par son numéro\n") + ("• *" + config.PREFIXE + "theme <url>* : Utilise une ou plusieurs images personnalisées (séparées par ; )\n\n") + "📌 *Exemples :*\n" + ("- " + tmp2 + "\n") + ("- " + prefix2)
      }, {
        quoted: ms
      });
    };
    if (arg.length === 0) {
      return prefix();
    }
    const text = arg.join(" ").toLowerCase();
    if (text === "list") {
      let url2 = "*🎨 Liste des thèmes disponibles :*\n";
      parsed.forEach((tmp3, tmp4) => {
        url2 += tmp4 + 1 + ". " + tmp3.nom + "\n";
      });
      return sock.sendMessage(chatJid, {
        image: {
          url: "https://files.catbox.moe/6xlk10.jpg"
        },
        caption: url2
      }, {
        quoted: ms
      });
    }
    if (text.startsWith("http://") || text.startsWith("https://")) {
      const text2 = arg.join(" ").split(";").map(tmp5 => tmp5.trim()).filter(tmp6 => tmp6.length > 0);
      const value = /^https?:\/\/.+/i;
      for (const tmp7 of text2) {
        if (!value.test(tmp7)) {
          return repondre("❌ URL invalide : " + tmp7);
        }
      }
      tmp.mention = JSON.stringify(text2);
      await tmp.save();
      return sock.sendMessage(chatJid, {
        text: "✅ " + text2.length + " thème(s) personnalisé(s) défini(s)."
      }, {
        quoted: ms
      });
    }
    const amount = parseInt(text, 10);
    if (isNaN(amount) || amount < 1 || amount > parsed.length) {
      return sock.sendMessage(chatJid, {
        text: "❌ Numéro invalide.\n📌 Utilise *" + config.PREFIXE + "theme list* pour voir les numéros disponibles."
      }, {
        quoted: ms
      });
    }
    const value2 = parsed[amount - 1];
    const value3 = value2.id;
    tmp.mention = value3;
    await tmp.save();
    return sock.sendMessage(chatJid, {
      text: "✅ Thème *" + value2.nom + "* sélectionné avec succès !"
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur dans la commande theme :", err);
    return sock.sendMessage(chatJid, {
      text: "❌ Une erreur est survenue lors du traitement de la commande."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "menu",
  classe: "Outils",
  react: "🔅",
  desc: "Affiche le menu du bot"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    arg
  } = ctx;
  try {
    const value = process.uptime();
    const value2 = Math.floor(value / 86400);
    const value3 = Math.floor(value / 3600 % 24);
    const value4 = Math.floor(value % 3600 / 60);
    const value5 = Math.floor(value % 60);
    let url = "";
    if (value2 > 0) {
      url += value2 + "J ";
    }
    if (value3 > 0) {
      url += value3 + "H ";
    }
    if (value4 > 0) {
      url += value4 + "M ";
    }
    if (value5 > 0) {
      url += value5 + "S";
    }
    const value6 = new Date();
    const value7 = value6.toLocaleDateString("fr-FR");
    const value8 = value6.toLocaleTimeString("fr-FR");
    const value9 = process.platform;
    const cmd = cmd;
    const options = {};
    cmd.forEach(tmp => {
      if (!options[tmp.classe]) {
        options[tmp.classe] = [];
      }
      options[tmp.classe].push(tmp);
    });
    const keys = Object.keys(options).sort((tmp2, tmp3) => tmp2.localeCompare(tmp3, undefined, {
      sensitivity: "base"
    }));
    keys.forEach(tmp4 => {
      options[tmp4].sort((tmp5, tmp6) => tmp5.nom_cmd.localeCompare(tmp6.nom_cmd, undefined, {
        numeric: true
      }));
    });
    let url2 = "";
    if (arg.length === 0) {
      url2 += "╭──⟪ " + config.NOM_BOT + " ⟫──╮\n├ ߷ Préfixe       : " + config.PREFIXE + "\n├ ߷ Owner         : " + config.NOM_OWNER + "\n├ ߷ Commandes     : " + cmd.length + "\n├ ߷ Uptime        : " + url.trim() + "\n├ ߷ Date          : " + value7 + "\n├ ߷ Heure         : " + value8 + "\n├ ߷ Plateforme    : " + value9 + "\n├ ߷ Développeur   : " + config.NOM_OWNER + "\n├ ߷ Version       : " + pkg.version + "\n╰──────────────────╯\n\n";
      url2 += "╭───⟪ Catégories ⟫───╮\n";
      keys.forEach((tmp7, tmp8) => {
        url2 += "├ ߷ " + (tmp8 + 1) + " • " + tmp7 + "\n";
      });
      url2 += "╰───────────────────╯\n";
      url2 += "\n💡 Tape *" + config.PREFIXE + "menu <numéro>* ou *" + config.PREFIXE + "menu <nom>* pour voir les commandes d'une catégorie.\n💡 Tape *" + config.PREFIXE + "allmenu* pour voir la liste de toutes les commandes disponibles.\n📌 Exemples :\n• *" + config.PREFIXE + "menu 1*\n• *" + config.PREFIXE + "menu outils*\n\n> ©2025 Manewbot by *Manewbie*";
    } else if (arg[0].toLowerCase() === "allmenu") {
      url2 += "╭──⟪ Toutes les commandes ⟫──╮\n";
      cmd.forEach(tmp9 => {
        url2 += "├ ߷ [" + tmp9.classe + "] " + tmp9.nom_cmd + "\n";
      });
      url2 += "╰───────────────────────────╯\n";
    } else {
      const text = arg.join(" ").toLowerCase();
      let null2 = null;
      const amount = parseInt(text, 10);
      if (!isNaN(amount)) {
        if (amount < 1 || amount > keys.length) {
          return sock.sendMessage(chatJid, {
            text: "Catégorie introuvable : " + arg[0]
          }, {
            quoted: ms
          });
        }
        null2 = keys[amount - 1];
      } else {
        null2 = keys.find(tmp10 => tmp10.toLowerCase() === text);
        if (!null2) {
          return sock.sendMessage(chatJid, {
            text: "Catégorie introuvable : " + arg.join(" ")
          }, {
            quoted: ms
          });
        }
      }
      url2 += "╭────⟪ " + null2.toUpperCase() + " ⟫────╮\n";
      options[null2].forEach(tmp11 => {
        url2 += "├ ߷ " + tmp11.nom_cmd + "\n";
      });
      url2 += "╰──────────────────╯\n\nTape *" + config.PREFIXE + "menu* pour revenir au menu principal.";
    }
    const [tmp12] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        mention: "1"
      }
    });
    const url3 = "./lib/theme.json";
    const fileData = fs.readFileSync(url3, "utf8");
    const parsed = JSON.parse(fileData);
    let item;
    if (tmp12.mention.startsWith("[")) {
      const parsed2 = JSON.parse(tmp12.mention);
      item = parsed2[Math.floor(Math.random() * parsed2.length)];
    } else if (tmp12.mention.startsWith("http")) {
      const parsed3 = JSON.parse(tmp12.mention);
      item = parsed3[Math.floor(Math.random() * parsed3.length)];
    } else {
      const value10 = parsed.find(tmp13 => tmp13.id === tmp12.mention);
      if (!value10) {
        throw new Error();
      }
      item = value10.theme[Math.floor(Math.random() * value10.theme.length)];
    }
    try {
      if (item && item.endsWith(".mp4")) {
        await sock.sendMessage(chatJid, {
          video: {
            url: item
          },
          caption: stylize(url2),
          gifPlayback: true
        }, {
          quoted: ms
        });
      } else if (item) {
        await sock.sendMessage(chatJid, {
          image: {
            url: item
          },
          caption: stylize(url2)
        }, {
          quoted: ms
        });
      } else {
        throw new Error();
      }
    } catch {
      await sock.sendMessage(chatJid, {
        text: stylize(url2)
      }, {
        quoted: ms
      });
    }
  } catch {
    await sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de la génération du menu."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "allmenu",
  classe: "Outils",
  react: "📜",
  desc: "Affiche toutes les commandes du bot"
}, async (chatJid, sock, ctx) => {
  const {
    ms
  } = ctx;
  try {
    const value = process.uptime();
    const value2 = Math.floor(value / 86400);
    const value3 = Math.floor(value / 3600 % 24);
    const value4 = Math.floor(value % 3600 / 60);
    const value5 = Math.floor(value % 60);
    let url = "";
    if (value2 > 0) {
      url += value2 + "J ";
    }
    if (value3 > 0) {
      url += value3 + "H ";
    }
    if (value4 > 0) {
      url += value4 + "M ";
    }
    if (value5 > 0) {
      url += value5 + "S";
    }
    const value6 = new Date();
    const value7 = value6.toLocaleDateString("fr-FR");
    const value8 = value6.toLocaleTimeString("fr-FR");
    const value9 = process.platform;
    const cmd = cmd;
    const options = {};
    cmd.forEach(tmp => {
      if (!options[tmp.classe]) {
        options[tmp.classe] = [];
      }
      options[tmp.classe].push(tmp);
    });
    const keys = Object.keys(options).sort((tmp2, tmp3) => tmp2.localeCompare(tmp3));
    for (const tmp4 of keys) {
      options[tmp4].sort((tmp5, tmp6) => tmp5.nom_cmd.localeCompare(tmp6.nom_cmd, undefined, {
        numeric: true
      }));
    }
    let prefix = "╭──⟪ " + config.NOM_BOT + " ⟫──╮\n├ ߷ Préfixe       : " + config.PREFIXE + "\n├ ߷ Owner         : " + config.NOM_OWNER + "\n├ ߷ Commandes  : " + cmd.length + "\n├ ߷ Uptime        : " + url.trim() + "\n├ ߷ Date    : " + value7 + "\n├ ߷ Heure   : " + value8 + "\n├ ߷ Plateforme  : " + value9 + "\n├ ߷ Développeur : " + config.NOM_OWNER + "\n├ ߷ Version        : " + pkg.version + "\n╰──────────────────╯\n\n";
    for (const tmp7 of keys) {
      prefix += "╭──⟪ " + tmp7.toUpperCase() + " ⟫──╮\n";
      options[tmp7].forEach(tmp8 => {
        prefix += "├ ߷ " + tmp8.nom_cmd + "\n";
      });
      prefix += "╰──────────────────╯\n\n";
    }
    prefix += "> ©2025 Manewbot by *Manewbie*";
    const [tmp9] = await WA_CONF.findOrCreate({
      where: {
        id: "1"
      },
      defaults: {
        id: "1",
        mention: "1"
      }
    });
    const value10 = tmp9.mention;
    const url2 = "./lib/theme.json";
    const fileData = fs.readFileSync(url2, "utf8");
    const parsed = JSON.parse(fileData);
    let item;
    if (tmp9.mention.startsWith("[")) {
      const parsed2 = JSON.parse(tmp9.mention);
      item = parsed2[Math.floor(Math.random() * parsed2.length)];
    } else if (tmp9.mention.startsWith("http://") || tmp9.mention.startsWith("https://")) {
      const parsed3 = JSON.parse(tmp9.mention);
      item = parsed3[Math.floor(Math.random() * parsed3.length)];
    } else {
      const value11 = parsed.find(tmp10 => tmp10.id === tmp9.mention);
      if (!value11) {
        throw new Error("Thème introuvable");
      }
      item = value11.theme[Math.floor(Math.random() * value11.theme.length)];
    }
    try {
      if (item && item.endsWith(".mp4")) {
        await sock.sendMessage(chatJid, {
          video: {
            url: item
          },
          caption: stylize(prefix),
          gifPlayback: true
        }, {
          quoted: ms
        });
      } else if (item) {
        await sock.sendMessage(chatJid, {
          image: {
            url: item
          },
          caption: stylize(prefix)
        }, {
          quoted: ms
        });
      } else {
        throw new Error("Aucun thème trouvé");
      }
    } catch (err) {
      await sock.sendMessage(chatJid, {
        text: stylize(prefix)
      }, {
        quoted: ms
      });
    }
  } catch (tmp11) {
    await sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de l'affichage du menu complet."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "vv",
  classe: "Outils",
  react: "👀",
  desc: "Affiche un message envoyé en vue unique dans la discussion"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    msg_Repondu,
    repondre
  } = ctx;
  if (!msg_Repondu) {
    return repondre("Veuillez mentionner un message en vue unique.");
  }
  let viewOnceKey = Object.keys(msg_Repondu).find(tmp => tmp.startsWith("viewOnceMessage"));
  let quotedMessage = msg_Repondu;
  if (viewOnceKey) {
    quotedMessage = msg_Repondu[viewOnceKey].message;
  }
  if (quotedMessage) {
    if (quotedMessage.imageMessage && quotedMessage.imageMessage.viewOnce !== true || quotedMessage.videoMessage && quotedMessage.videoMessage.viewOnce !== true || quotedMessage.audioMessage && quotedMessage.audioMessage.viewOnce !== true) {
      return repondre("Ce message n'est pas un message en vue unique.");
    }
  }
  try {
    let item;
    let options = {
      quoted: ms
    };
    if (quotedMessage.imageMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.imageMessage);
      await sock.sendMessage(chatJid, {
        image: {
          url: item
        },
        caption: quotedMessage.imageMessage.caption || ""
      }, options);
    } else if (quotedMessage.videoMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.videoMessage);
      await sock.sendMessage(chatJid, {
        video: {
          url: item
        },
        caption: quotedMessage.videoMessage.caption || ""
      }, options);
    } else if (quotedMessage.audioMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.audioMessage);
      await sock.sendMessage(chatJid, {
        audio: {
          url: item
        },
        mimetype: "audio/mp4",
        ptt: false
      }, options);
    } else {
      return repondre("Ce type de message en vue unique n'est pas pris en charge.");
    }
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi du message en vue unique :", err.message || err);
    return repondre("Une erreur est survenue lors du traitement du message.");
  }
});
registerCommand({
  nom_cmd: "vv2",
  classe: "Outils",
  react: "👀",
  desc: "Affiche un message envoyé en vue unique en inbox"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    id_Bot,
    msg_Repondu,
    repondre
  } = ctx;
  if (!msg_Repondu) {
    return repondre("Veuillez mentionner un message en vue unique.");
  }
  let viewOnceKey = Object.keys(msg_Repondu).find(tmp => tmp.startsWith("viewOnceMessage"));
  let quotedMessage = msg_Repondu;
  if (viewOnceKey) {
    quotedMessage = msg_Repondu[viewOnceKey].message;
  }
  if (quotedMessage) {
    if (quotedMessage.imageMessage && quotedMessage.imageMessage.viewOnce !== true || quotedMessage.videoMessage && quotedMessage.videoMessage.viewOnce !== true || quotedMessage.audioMessage && quotedMessage.audioMessage.viewOnce !== true) {
      return repondre("Ce message n'est pas un message en vue unique.");
    }
  }
  try {
    let item;
    let options = {
      quoted: ms
    };
    if (quotedMessage.imageMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.imageMessage);
      await sock.sendMessage(id_Bot, {
        image: {
          url: item
        },
        caption: quotedMessage.imageMessage.caption || ""
      }, options);
    } else if (quotedMessage.videoMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.videoMessage);
      await sock.sendMessage(id_Bot, {
        video: {
          url: item
        },
        caption: quotedMessage.videoMessage.caption || ""
      }, options);
    } else if (quotedMessage.audioMessage) {
      item = await sock.dl_save_media_ms(quotedMessage.audioMessage);
      await sock.sendMessage(id_Bot, {
        audio: {
          url: item
        },
        mimetype: "audio/mp4",
        ptt: false
      }, options);
    } else {
      return repondre("Ce type de message en vue unique n'est pas pris en charge.");
    }
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi du message en vue unique :", err.message || err);
    return repondre("Une erreur est survenue lors du traitement du message.");
  }
});
registerCommand({
  nom_cmd: "ping",
  classe: "Outils",
  react: "🏓",
  desc: "Mesure la latence du bot."
}, async (chatJid, sock, ctx) => {
  const timestamp = Date.now();
  const value = await sock.sendMessage(chatJid, {
    text: "*Manewbot Ping...*"
  }, {
    quoted: ctx.ms
  });
  const timestamp2 = Date.now();
  const value2 = timestamp2 - timestamp;
  await sock.sendMessage(chatJid, {
    edit: value.key,
    text: "*🏓 Pong ! Latence : " + value2 + "ms*"
  });
});
registerCommand({
  nom_cmd: "uptime",
  classe: "Outils",
  react: "⏱️",
  desc: "Affiche le temps de fonctionnement du bot.",
  alias: ["upt"]
}, async (chatJid, sock, ctx) => {
  const value = process.uptime();
  const value2 = Math.floor(value / 86400);
  const value3 = Math.floor(value / 3600 % 24);
  const value4 = Math.floor(value % 3600 / 60);
  const value5 = Math.floor(value % 60);
  let url = "";
  if (value2 > 0) {
    url += value2 + "J ";
  }
  if (value3 > 0) {
    url += value3 + "H ";
  }
  if (value4 > 0) {
    url += value4 + "M ";
  }
  if (value5 > 0) {
    url += value5 + "S";
  }
  await sock.sendMessage(chatJid, {
    text: "⏳ Temps de fonctionnement : " + url
  }, {
    quoted: ctx.ms
  });
});
registerCommand({
  nom_cmd: "translate",
  classe: "Outils",
  react: "🌍",
  desc: "Traduit un texte dans la langue spécifiée.",
  alias: ["trt"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    msg_Repondu
  } = ctx;
  let item;
  let item2;
  if (msg_Repondu && arg.length === 1) {
    item = arg[0];
    item2 = msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text;
  } else if (arg.length >= 2) {
    item = arg[0];
    item2 = arg.slice(1).join(" ");
  } else {
    return await sock.sendMessage(chatJid, {
      text: "Utilisation : " + prefixe + "translate <langue> <texte> ou répondre à un message avec : " + prefixe + "translate <langue>"
    }, {
      quoted: ms
    });
  }
  try {
    const value = await translate(item2, {
      to: item
    });
    await sock.sendMessage(chatJid, {
      text: "🌐Traduction (" + item + ") :\n" + value.text
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de la traduction:", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la traduction. Vérifiez la langue et le texte fournis."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "capture",
  classe: "Outils",
  react: "📸",
  desc: "Prend une capture d'écran d'un site web."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  if (!arg[0]) {
    return sock.sendMessage(chatJid, {
      text: "Entrez un lien"
    }, {
      quoted: ms
    });
  }
  const value = arg[0];
  try {
    const response = await axios.get("https://eliteprotech-apis.zone.id/ssweb?url=" + encodeURIComponent(value), {
      responseType: "arraybuffer"
    });
    await sock.sendMessage(chatJid, {
      image: response.data,
      caption: "Voici la capture d'écran de: " + value
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de la capture de l'écran:", err.message);
    await sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de la capture du site. Veuillez réessayer plus tard."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "system_status",
  classe: "Outils",
  react: "🖥️",
  desc: "Affiche les informations du système en temps réel"
}, async (chatJid, sock, ctx) => {
  const value = os.platform();
  const value2 = os.arch();
  const value3 = os.cpus();
  const value4 = (os.totalmem() / 1073741824).toFixed(2);
  const value5 = (os.freemem() / 1073741824).toFixed(2);
  const value6 = os.hostname();
  const value7 = os.loadavg();
  const value8 = os.uptime();
  const value9 = Math.floor(value8 / 86400);
  const value10 = Math.floor(value8 / 3600 % 24);
  const value11 = Math.floor(value8 % 3600 / 60);
  const value12 = Math.floor(value8 % 60);
  let url = "";
  if (value9 > 0) {
    url += value9 + "J ";
  }
  if (value10 > 0) {
    url += value10 + "H ";
  }
  if (value11 > 0) {
    url += value11 + "M ";
  }
  if (value12 > 0) {
    url += value12 + "S";
  }
  const value13 = value3.map(tmp => {
    let tmp2 = 0;
    for (type in tmp.times) {
      tmp2 += tmp.times[type];
    }
    const value14 = (100 - tmp.times.idle / tmp2 * 100).toFixed(2);
    return value14 + "%";
  }).join(", ");
  const value15 = (100 - value7[0] * 100 / value3.length).toFixed(2);
  await sock.sendMessage(chatJid, {
    text: "🖥️ *ÉTAT DU SYSTÈME*\n\n" + ("⚡ *Vitesse du serveur*: " + value15 + " %\n") + ("🖧 *Charge Moyenne*: " + value7.map(tmp3 => tmp3.toFixed(2)).join(", ") + "\n") + ("⏳ *Uptime*: " + url.trim() + "\n") + ("💻 *Plateforme*: " + value + "\n") + ("🔧 *Architecture*: " + value2 + "\n") + ("🖧 *Processeur*: " + value3.length + " Cœur(s) (" + value13 + ")\n") + ("💾 *Mémoire Totale*: " + value4 + " GB\n") + ("🆓 *Mémoire Libre*: " + value5 + " GB\n") + ("🌐 *Nom de l'Hôte*: " + value6 + "\n") + ("🎉 *Version: Manewbot " + pkg.version)
  }, {
    quoted: ctx.ms
  });
});
registerCommand({
  nom_cmd: "tempmail",
  classe: "Outils",
  react: "📧",
  desc: "Crée un email temporaire."
}, async (chatJid, sock, ctx) => {
  const {
    ms
  } = ctx;
  try {
    const tempMail = new TempMail();
    const value = await tempMail.createInbox();
    const url = "Voici votre adresse email temporaire : " + value.address + "\n\nVotre token est : " + value.token + "\n\nPour récupérer vos messages, utilisez <tempinbox votre-token>.";
    await sock.sendMessage(chatJid, {
      text: url
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error(err);
    return sock.sendMessage(chatJid, {
      text: "Une erreur s'est produite lors de la création de l'email temporaire."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "tempinbox",
  classe: "Outils",
  react: "📩",
  desc: "Récupère les messages d'un email temporaire."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms
  } = ctx;
  if (!arg[0]) {
    return sock.sendMessage(chatJid, {
      text: "Pour récupérer les messages de votre email temporaire, fournissez le token qui a été émis."
    });
  }
  try {
    const tempMail = new TempMail();
    const inbox = await tempMail.checkInbox(arg[0]);
    if (!inbox || inbox.length === 0) {
      return sock.sendMessage(chatJid, {
        text: "Aucun message trouvé pour ce token."
      }, {
        quoted: ms
      });
    }
    for (let index = 0; index < inbox.length; index++) {
      const value = inbox[index];
      const value2 = value.sender;
      const value3 = value.subject;
      const value4 = new Date(value.date).toLocaleString();
      const value5 = value.body;
      const url = "👥 Expéditeur : " + value2 + "\n📝 Sujet : " + value3 + "\n🕜 Date : " + value4 + "\n📩 Message : " + value5;
      await sock.sendMessage(chatJid, {
        text: url
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    console.error(err);
    return sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de la récupération des messages de l'email temporaire."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "obfuscate",
  classe: "Outils",
  react: "📥",
  desc: "Obfusque du code JavaScript",
  alias: ["obf"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    ms
  } = ctx;
  if (!arg || arg.length === 0) {
    return repondre("Veuillez fournir le code JavaScript à obfusquer.");
  }
  const text = arg.join(" ");
  try {
    repondre("🔄obfucation en cours...");
    const value = JavaScriptObfuscator.obfuscate(text, {
      compact: true,
      controlFlowFlattening: true
    }).getObfuscatedCode();
    const text2 = path.join(__dirname, "obfuscate.js");
    fs.writeFileSync(text2, value);
    await sock.sendMessage(chatJid, {
      document: {
        url: text2
      },
      mimetype: "application/javascript",
      fileName: "obfuscate.js"
    }, {
      quoted: ms
    });
    fs.unlinkSync(text2);
  } catch (err) {
    console.error(err);
    repondre("Une erreur est survenue lors de l'obfuscation du code.");
  }
});
registerCommand({
  nom_cmd: "gitclone",
  classe: "Outils",
  react: "📥",
  desc: "clone un repo Git",
  alias: ["gcl"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    ms
  } = ctx;
  if (!arg || arg.length < 1) {
    return repondre("Veuillez fournir l'URL du dépôt Git à cloner.");
  }
  const value = arg[0];
  const value2 = value + ".git";
  const pluginName = arg[1] ? arg[1] : path.basename(value2, ".git");
  if (/[/\\]|\.\./.test(pluginName)) {
    return repondre("Nom de dossier invalide.");
  }
  const value3 = pluginName + ".zip";
  const value4 = /^(https?:\/\/|git@)([\w.@:\/-]+)(\.git)(\/?)$/;
  if (!value4.test(value2)) {
    return repondre("URL de dépôt Git invalide.");
  }
  try {
    repondre("🔄Clonage du dépôt en cours...");
    const cloneProcess = spawn("git", ["clone", value2, pluginName], {
      cwd: process.cwd()
    });
    let stderr = "";
    cloneProcess.stderr.on("data", chunk => {
      stderr += chunk.toString();
    });
    cloneProcess.on("close", code => {
      if (code !== 0) {
        return repondre("Erreur lors du clonage du dépôt : " + (stderr.trim() || "code " + code));
      }
      try {
        const value5 = new AdmZip();
        value5.addLocalFolder(pluginName);
        value5.writeZip(value3);
        const fileData = {
          document: fs.readFileSync(value3),
          mimetype: "application/zip",
          fileName: pluginName + ".zip"
        };
        sock.sendMessage(chatJid, fileData, {
          quoted: ms
        });
        fs.rmSync(pluginName, {
          recursive: true,
          force: true
        });
        fs.unlinkSync(value3);
      } catch (err) {
        repondre("Erreur lors de la compression en zip : " + err.message);
      }
    });
  } catch (tmp4) {
    console.error(tmp4);
    repondre("Une erreur est survenue lors du clonage du dépôt.");
  }
});
registerCommand({
  nom_cmd: "owner",
  classe: "Outils",
  react: "🔅",
  desc: "Numero du propriétaire du bot"
}, async (chatJid, sock, ctx) => {
  const url = "BEGIN:VCARD\nVERSION:3.0\nFN:" + config.NOM_OWNER + "\nORG:undefined;\nTEL;type=CELL;type=VOICE;waid=" + config.NUMERO_OWNER + ":+" + config.NUMERO_OWNER + "\nEND:VCARD";
  sock.sendMessage(chatJid, {
    contacts: {
      displayName: config.NOM_OWNER,
      contacts: [{
        vcard: url
      }]
    }
  }, {
    quoted: ctx.ms
  });
});
registerCommand({
  nom_cmd: "developpeur",
  classe: "Outils",
  react: "🔅",
  desc: "Numero du créateur du bot",
  alias: ["dev"]
}, async (chatJid, sock, ctx) => {
  const url = config.NUMERO_OWNER;
  if (!url) {
    return sock.sendMessage(chatJid, {
      text: "Aucun numéro propriétaire configuré (NUMERO_OWNER)."
    }, {
      quoted: ctx.ms
    });
  }
  const url2 = config.NOM_OWNER || config.NOM_BOT || "Développeur";
  const url3 = "BEGIN:VCARD\nVERSION:3.0\nFN:" + url2 + "\nORG:undefined;\nTEL;type=CELL;type=VOICE;waid=" + url + ":+" + url + "\nEND:VCARD";
  sock.sendMessage(chatJid, {
    contacts: {
      displayName: url2,
      contacts: [{
        vcard: url3
      }]
    }
  }, {
    quoted: ctx.ms
  });
});
registerCommand({
  nom_cmd: "support",
  classe: "Outils",
  react: "📩",
  desc: "Lien vers les groupes de support du bot"
}, async (chatJid, sock, ctx) => {
  const {
    verif_Groupe,
    repondre,
    auteur_Message,
    ms
  } = ctx;
  const list = ["https://chat.whatsapp.com/HzhikAmOuYhFXGLmcyMo62", "https://chat.whatsapp.com/BP1oOMh0QvR7H3vvO9bRYK"];
  const text = "📩 *Manewbot SUPPORT*\nVoici les liens pour rejoindre les groupes de support:\n\n" + list.map(tmp => "🔗 " + tmp).join("\n\n");
  if (verif_Groupe) {
    await repondre("📩 Les liens d'invitation ont été envoyés en message privé.");
    await sock.sendMessage(auteur_Message, {
      text: text
    }, {
      quoted: ms
    });
  } else {
    await sock.sendMessage(chatJid, {
      text: text
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "repo",
  alias: ["sc", "script", "code_source", "repository"],
  classe: "Outils",
  react: "📦",
  desc: "Affiche les informations et le lien du repository du bot"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre
  } = ctx;
  const url = "https://github.com/manuelebeh/manewbot";
  let item;
  try {
    const {
      data: tmp
    } = await axios.get("https://api.github.com/repos/manuelebeh/manewbot");
    item = "\n╭───⟪ 📦 Manewbot ⟫───╮\n│ ⇨ ⭐ Stars       : " + tmp.stargazers_count + "\n│ ⇨ 🍴 Forks       : " + tmp.forks_count + "\n│ ⇨ 🔄 Dernière MAJ : " + new Date(tmp.pushed_at).toLocaleDateString("fr-FR") + "\n│ ⇨ 🔗 Repo        : " + tmp.html_url + "\n╰───────────────────╯\n> ©2025 Manewbot by *Manewbie*";
  } catch (err) {
    console.error("Erreur récupération API :", err);
    item = "\n╭───⟪ 📦 Manewbot ⟫───╮\n│ 🔗 Repo : " + url + "\n╰───────────────────╯\n> ©2025 Manewbot by *Manewbie*";
  }
  try {
    await sock.sendMessage(chatJid, {
      image: {
        url: "https://files.catbox.moe/lojrxz.jpg"
      },
      caption: item,
      contextInfo: contextInfo
    }, {
      quoted: ms
    });
  } catch (tmp2) {
    console.error("Erreur envoi avec image :", tmp2);
    await sock.sendMessage(chatJid, {
      text: item,
      contextInfo: contextInfo
    }, {
      quoted: ms
    });
  }
});