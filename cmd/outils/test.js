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
