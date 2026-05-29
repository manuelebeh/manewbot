'use strict';

const { registerCommand } = require('./register');
const { axios, config, contextInfo } = require('./deps');

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
  const url = config.GITHUB_REPO_URL;
  let item;
  try {
    const {
      data: tmp
    } = await axios.get((config.GITHUB_API_BASE || 'https://api.github.com').replace(/\/$/, '') + "/repos/manuelebeh/manewbot");
    item = "\n╭───⟪ 📦 Manewbot ⟫───╮\n│ ⇨ ⭐ Stars       : " + tmp.stargazers_count + "\n│ ⇨ 🍴 Forks       : " + tmp.forks_count + "\n│ ⇨ 🔄 Dernière MAJ : " + new Date(tmp.pushed_at).toLocaleDateString("fr-FR") + "\n│ ⇨ 🔗 Repo        : " + tmp.html_url + "\n╰───────────────────╯\n> ©2025 Manewbot by *Manewbie*";
  } catch (err) {
    console.error("Erreur récupération API :", err);
    item = "\n╭───⟪ 📦 Manewbot ⟫───╮\n│ 🔗 Repo : " + url + "\n╰───────────────────╯\n> ©2025 Manewbot by *Manewbie*";
  }
  try {
    await sock.sendMessage(chatJid, {
      image: {
        url: config.BOT_INFO_IMAGE_URL
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
