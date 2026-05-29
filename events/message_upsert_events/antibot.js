const {
  Antibot,
  AntibotWarnings
} = require("../../database/antibot");
async function antibot(sock, chatJid, msg, isGroup, isAdmin, isBotAdmin, senderJid) {
  try {
    const isBotMessage = msg.key.id.startsWith("BAES") || msg.key.id.startsWith("BAE5") || msg.key.id.startsWith("EVO") || msg.key.id.startsWith("3EB0");
    if (isBotMessage) {
      const antibotConfig = await Antibot.findOne({
        where: {
          id: chatJid
        }
      });
      if (isGroup && antibotConfig && antibotConfig.mode === "oui") {
        if (!isAdmin && isBotAdmin) {
          const deleteKey = {
            remoteJid: chatJid,
            fromMe: false,
            id: msg.key.id,
            participant: senderJid
          };
          const senderNumber = senderJid.split("@")[0];
          switch (antibotConfig.type) {
            case "supp":
              await sock.sendMessage(chatJid, {
                text: "@" + senderNumber + ", les bots ne sont pas autorisés ici.",
                mentions: [senderJid]
              }, {
                quoted: msg
              });
              await sock.sendMessage(chatJid, {
                delete: deleteKey
              });
              break;
            case "kick":
              await sock.sendMessage(chatJid, {
                text: "@" + senderNumber + " a été retiré pour avoir utilisé un bot.",
                mentions: [senderJid]
              }, {
                quoted: msg
              });
              await sock.sendMessage(chatJid, {
                delete: deleteKey
              });
              await sock.groupParticipantsUpdate(chatJid, [senderJid], "remove");
              break;
            case "warn":
              let warningRecord = await AntibotWarnings.findOne({
                where: {
                  groupId: chatJid,
                  userId: senderJid
                }
              });
              if (!warningRecord) {
                await AntibotWarnings.create({
                  groupId: chatJid,
                  userId: senderJid
                });
                await sock.sendMessage(chatJid, {
                  delete: deleteKey
                });
                await sock.sendMessage(chatJid, {
                  text: "@" + senderNumber + ", avertissement 1/3 pour utilisation de bot.",
                  mentions: [senderJid]
                }, {
                  quoted: msg
                });
              } else {
                warningRecord.count += 1;
                await warningRecord.save();
                if (warningRecord.count >= 3) {
                  await sock.sendMessage(chatJid, {
                    text: "@" + senderNumber + " a été retiré après 3 avertissements.",
                    mentions: [senderJid]
                  }, {
                    quoted: msg
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
                    text: "@" + senderNumber + ", avertissement " + warningRecord.count + "/3 pour utilisation de bot.",
                    mentions: [senderJid]
                  }, {
                    quoted: msg
                  });
                }
              }
              break;
            default:
              console.error("Action inconnue : " + antibotConfig.type);
          }
        }
      }
    }
  } catch (err) {
    console.error("Erreur dans le système Anti-Bot :", err);
  }
}
module.exports = { antibot };