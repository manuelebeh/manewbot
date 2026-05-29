'use strict';

const { registerCommand, cmd } = require('../register');
const { fs, config, pkg, stylize, WA_CONF } = require('../deps');
const {
  groupCommandsByClass,
  buildStatusHeader,
  sendThemedCaption,
} = require('../../../lib/menu-helpers');

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
