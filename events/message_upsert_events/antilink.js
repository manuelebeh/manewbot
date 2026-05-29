const {
  Antilink,
  Antilink_warnings
} = require("../../database/antilink");
function containsLink(text) {
  const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/i;
  return linkRegex.test(text);
}
async function antilink(sock, chatJid, msg, messageText, isGroup, isAdmin, isBotAdmin, senderJid) {
  try {
    if (containsLink(messageText)) {
      const antilinkConfig = await Antilink.findOne({
        where: {
          id: chatJid
        }
      });
      if (isGroup && antilinkConfig && antilinkConfig.mode === "oui") {
        if (!isAdmin && isBotAdmin) {
          const senderNumber = senderJid.split("@")[0];
          const deleteKey = {
            remoteJid: chatJid,
            fromMe: false,
            id: msg.key.id,
            participant: senderJid
          };
          switch (antilinkConfig.type) {
            case "supp":
              await sock.sendMessage(chatJid, {
                text: "@" + senderNumber + ", les liens ne sont pas autorisés ici.",
                mentions: [senderJid]
              });
              await sock.sendMessage(chatJid, {
                delete: deleteKey
              });
              break;
            case "kick":
              await sock.sendMessage(chatJid, {
                text: "@" + senderNumber + " a été retiré pour avoir envoyé un lien.",
                mentions: [senderJid]
              });
              await sock.sendMessage(chatJid, {
                delete: deleteKey
              });
              await sock.groupParticipantsUpdate(chatJid, [senderJid], "remove");
              break;
            case "warn":
              let warningRecord = await Antilink_warnings.findOne({
                where: {
                  groupId: chatJid,
                  userId: senderJid
                }
              });
              if (!warningRecord) {
                await Antilink_warnings.create({
                  groupId: chatJid,
                  userId: senderJid
                });
                await sock.sendMessage(chatJid, {
                  delete: deleteKey
                });
                await sock.sendMessage(chatJid, {
                  text: "@" + senderNumber + ", avertissement 1/3 pour avoir envoyé un lien.",
                  mentions: [senderJid]
                });
              } else {
                warningRecord.count += 1;
                await warningRecord.save();
                if (warningRecord.count >= 3) {
                  await sock.sendMessage(chatJid, {
                    text: "@" + senderNumber + " a été retiré après 3 avertissements.",
                    mentions: [senderJid]
                  });
                  await sock.sendMessage(chatJid, {
                    delete: deleteKey
                  });
                  await sock.groupParticipantsUpdate(chatJid, [senderJid], "remove");
                  await warningRecord.destroy();
                } else {
                  await sock.sendMessage(chatJid, {
                    delete: deleteKey
                  });
                  await sock.sendMessage(chatJid, {
                    text: "@" + senderNumber + ", avertissement " + warningRecord.count + "/3 pour avoir envoyé un lien.",
                    mentions: [senderJid]
                  });
                }
              }
              break;
            default:
              console.error("⚠️ Action inconnue : " + antilinkConfig.type);
          }
        }
      }
    }
  } catch (err) {
    console.error("❌ Erreur dans le système Antilink :", err);
  }
}
module.exports = antilink;
