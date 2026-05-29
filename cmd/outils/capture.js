'use strict';

const {
  registerCommand,
  config,
  axios,
} = require('./_shared');
const { getAiBases, aiNotConfiguredMessage } = require('../../lib/ai-api');
const { validatePublicHttpUrl } = require('../../lib/url-safety');

registerCommand({
  nom_cmd: "capture",
  classe: "Outils",
  react: "📸",
  desc: "Prend une capture d'écran d'un site web."
}, async (chatJid, sock, ctx) => {
  const { arg, ms, isStaff } = ctx;
  if (!isStaff) {
    return sock.sendMessage(chatJid, {
      text: "🔒 Commande réservée au propriétaire et aux sudo."
    }, { quoted: ms });
  }
  if (!arg[0]) {
    return sock.sendMessage(chatJid, {
      text: "Entrez un lien"
    }, { quoted: ms });
  }
  const urlCheck = validatePublicHttpUrl(arg[0]);
  if (!urlCheck.ok) {
    return sock.sendMessage(chatJid, {
      text: urlCheck.reason
    }, { quoted: ms });
  }
  const { sswweb } = getAiBases(config);
  if (!sswweb) {
    return sock.sendMessage(chatJid, {
      text: aiNotConfiguredMessage("SSWEB_API_BASE ou AI_API_BASE")
    }, { quoted: ms });
  }
  try {
    const response = await axios.get(sswweb + "/ssweb?url=" + encodeURIComponent(urlCheck.href), {
      responseType: "arraybuffer"
    });
    await sock.sendMessage(chatJid, {
      image: response.data,
      caption: "Voici la capture d'écran de: " + urlCheck.href
    }, { quoted: ms });
  } catch (err) {
    console.error("Erreur lors de la capture de l'écran:", err.message);
    await sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de la capture du site. Veuillez réessayer plus tard."
    }, { quoted: ms });
  }
});
