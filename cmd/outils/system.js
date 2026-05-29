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
  spawn,
  AdmZip,
  pkg,
  stylize,
  contextInfo,
} = require('./_shared');

registerCommand({
  nom_cmd: "system_status",
  classe: "Outils",
  react: "🖥️",
  desc: "Affiche les informations du système en temps réel"
}, async (chatJid, sock, ctx) => {
  const { isOwner, repondre } = ctx;
  if (!isOwner) {
    return repondre("🔒 Commande réservée au propriétaire.");
  }
  const value = os.platform();
  const value2 = os.arch();
  const value3 = os.cpus();
  const value4 = (os.totalmem() / 1073741824).toFixed(2);
  const value5 = (os.freemem() / 1073741824).toFixed(2);
  const value6 = os.hostname();
  const value7 = os.loadavg();
  const value8 = os.uptime();
  const value9 = Math.floor(value8 / 86400);
  const value10 = Math.floor(value8 / 3600 % 24);
  const value11 = Math.floor(value8 % 3600 / 60);
  const value12 = Math.floor(value8 % 60);
  let url = "";
  if (value9 > 0) {
    url += value9 + "J ";
  }
  if (value10 > 0) {
    url += value10 + "H ";
  }
  if (value11 > 0) {
    url += value11 + "M ";
  }
  if (value12 > 0) {
    url += value12 + "S";
  }
  const value13 = value3.map(tmp => {
    let tmp2 = 0;
    for (type in tmp.times) {
      tmp2 += tmp.times[type];
    }
    const value14 = (100 - tmp.times.idle / tmp2 * 100).toFixed(2);
    return value14 + "%";
  }).join(", ");
  const value15 = (100 - value7[0] * 100 / value3.length).toFixed(2);
  await sock.sendMessage(chatJid, {
    text: "🖥️ *ÉTAT DU SYSTÈME*\n\n" + ("⚡ *Vitesse du serveur*: " + value15 + " %\n") + ("🖧 *Charge Moyenne*: " + value7.map(tmp3 => tmp3.toFixed(2)).join(", ") + "\n") + ("⏳ *Uptime*: " + url.trim() + "\n") + ("💻 *Plateforme*: " + value + "\n") + ("🔧 *Architecture*: " + value2 + "\n") + ("🖧 *Processeur*: " + value3.length + " Cœur(s) (" + value13 + ")\n") + ("💾 *Mémoire Totale*: " + value4 + " GB\n") + ("🆓 *Mémoire Libre*: " + value5 + " GB\n") + ("🌐 *Nom de l'Hôte*: " + value6 + "\n") + ("🎉 *Version: Manewbot " + pkg.version)
  }, {
    quoted: ctx.ms
  });
});
