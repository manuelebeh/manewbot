'use strict';

const {
  registerCommand,
  cmd,
  fs,
  path,
  os,
  axios,
  config,
  translate,
  prefixe,
  WA_CONF,
  TempMail,
  JavaScriptObfuscator,
  spawn,
  AdmZip,
  pkg,
  stylize,
  contextInfo,
} = require('./_shared');
const {
  groupCommandsByClass,
  buildStatusHeader,
  sendThemedCaption,
} = require('../../lib/menu-helpers');

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
  const { ms, arg } = ctx;
  try {
    const { options, keys } = groupCommandsByClass(cmd);
    let body = buildStatusHeader(config, pkg, cmd.length);

    if (arg.length === 0) {
      body += '╭───⟪ Catégories ⟫───╮\n';
      keys.forEach((key, index) => {
        body += `├ ߷ ${index + 1} • ${key}\n`;
      });
      body += '╰───────────────────╯\n';
      body +=
        `\n💡 Tape *${config.PREFIXE}menu <numéro>* ou *${config.PREFIXE}menu <nom>* pour voir les commandes d'une catégorie.\n` +
        `💡 Tape *${config.PREFIXE}allmenu* pour voir la liste de toutes les commandes disponibles.\n` +
        `📌 Exemples :\n• *${config.PREFIXE}menu 1*\n• *${config.PREFIXE}menu outils*\n\n` +
        '> ©2025 Manewbot by *Manewbie*';
    } else if (arg[0].toLowerCase() === 'allmenu') {
      body += '╭──⟪ Toutes les commandes ⟫──╮\n';
      cmd.forEach((entry) => {
        body += `├ ߷ [${entry.classe}] ${entry.nom_cmd}\n`;
      });
      body += '╰───────────────────────────╯\n';
    } else {
      const text = arg.join(' ').toLowerCase();
      let category = null;
      const amount = parseInt(text, 10);
      if (!isNaN(amount)) {
        if (amount < 1 || amount > keys.length) {
          return sock.sendMessage(
            chatJid,
            { text: `Catégorie introuvable : ${arg[0]}` },
            { quoted: ms }
          );
        }
        category = keys[amount - 1];
      } else {
        category = keys.find((key) => key.toLowerCase() === text);
        if (!category) {
          return sock.sendMessage(
            chatJid,
            { text: `Catégorie introuvable : ${arg.join(' ')}` },
            { quoted: ms }
          );
        }
      }
      body += `╭────⟪ ${category.toUpperCase()} ⟫────╮\n`;
      options[category].forEach((entry) => {
        body += `├ ߷ ${entry.nom_cmd}\n`;
      });
      body += `╰──────────────────╯\n\nTape *${config.PREFIXE}menu* pour revenir au menu principal.`;
    }

    await sendThemedCaption(sock, chatJid, ms, body, stylize, WA_CONF);
  } catch (err) {
    console.error('Erreur menu:', err);
    await sock.sendMessage(
      chatJid,
      { text: 'Une erreur est survenue lors de la génération du menu.' },
      { quoted: ms }
    );
  }
});
registerCommand({
  nom_cmd: "allmenu",
  classe: "Outils",
  react: "📜",
  desc: "Affiche toutes les commandes du bot"
}, async (chatJid, sock, ctx) => {
  const { ms } = ctx;
  try {
    const { options, keys } = groupCommandsByClass(cmd);
    let body = buildStatusHeader(config, pkg, cmd.length);

    for (const key of keys) {
      body += `╭──⟪ ${key.toUpperCase()} ⟫──╮\n`;
      options[key].forEach((entry) => {
        body += `├ ߷ ${entry.nom_cmd}\n`;
      });
      body += '╰──────────────────╯\n\n';
    }
    body += '> ©2025 Manewbot by *Manewbie*';

    await sendThemedCaption(sock, chatJid, ms, body, stylize, WA_CONF);
  } catch (err) {
    console.error('Erreur allmenu:', err);
    await sock.sendMessage(
      chatJid,
      { text: 'Une erreur est survenue lors de l\'affichage du menu complet.' },
      { quoted: ms }
    );
  }
});
