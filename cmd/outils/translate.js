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
