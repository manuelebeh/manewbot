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
