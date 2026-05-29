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
  const config = require("../set");
  const {
    getAiBases,
    aiNotConfiguredMessage
  } = require("../lib/ai-api");
  const {
    sswweb
  } = getAiBases(config);
  if (!sswweb) {
    return sock.sendMessage(chatJid, {
      text: aiNotConfiguredMessage("SSWEB_API_BASE ou AI_API_BASE")
    }, {
      quoted: ms
    });
  }
  try {
    const response = await axios.get(sswweb + "/ssweb?url=" + encodeURIComponent(value), {
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
