'use strict';

const { registerCommand, cmd } = require('../register');
const { fs, config, pkg, stylize, WA_CONF } = require('../deps');
const {
  groupCommandsByClass,
  buildStatusHeader,
  sendThemedCaption,
} = require('../../../lib/menu-helpers');

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
          url: config.THEME_LIST_IMAGE_URL
        },
        caption: url2
      }, {
        quoted: ms
      });
    }
    if (text.startsWith("http://") || text.startsWith("https://")) {
      const { validatePublicHttpUrl } = require('../../lib/url-safety');
      const text2 = arg.join(" ").split(";").map(tmp5 => tmp5.trim()).filter(tmp6 => tmp6.length > 0);
      const safeUrls = [];
      for (const tmp7 of text2) {
        const check = validatePublicHttpUrl(tmp7);
        if (!check.ok) {
          return repondre("❌ " + check.reason + " (" + tmp7 + ")");
        }
        safeUrls.push(check.href);
      }
      tmp.mention = JSON.stringify(safeUrls);
      await tmp.save();
      return sock.sendMessage(chatJid, {
        text: "✅ " + safeUrls.length + " thème(s) personnalisé(s) défini(s)."
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
