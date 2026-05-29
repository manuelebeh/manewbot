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
