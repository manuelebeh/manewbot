'use strict';

const { registerCommand } = require('../../../lib/commands');

const { getGroupMetadata } = require('../../../lib/groupe_cache');

registerCommand({
  nom_cmd: "ginfo",
  classe: "Groupe",
  react: "🔎",
  desc: "Affiche les informations du groupe"
}, async (chatJid, sock, ctx) => {
  const groupMeta = await getGroupMetadata(sock, chatJid);
  await sock.sendMessage(chatJid, {
    text: "ID: " + groupMeta.id + "\nNom: " + groupMeta.subject + "\nDescription: " + groupMeta.desc
  }, {
    quoted: ctx.ms
  });
});
