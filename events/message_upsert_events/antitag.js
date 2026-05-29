const {
  Antitag,
  Antitag_warnings
} = require("../../database/antitag");
async function antitag(sock, msg, chatJid, contentType, isGroup, isBotAdmin, isAdmin, senderJid) {
  if (msg.message?.[contentType]?.contextInfo?.mentionedJid?.length > 30) {
    try {
      const antitagConfig = await Antitag.findOne({
        where: {
          id: chatJid
        }
      });
      if (isGroup && antitagConfig && antitagConfig.mode === "oui") {
        if (!isAdmin && isBotAdmin) {
          const senderNumber = senderJid.split("@")[0];
          const deleteKey = {
            remoteJid: chatJid,
            fromMe: false,
            id: msg.key.id,
            participant: senderJid
          };
          switch (antitagConfig.type) {
            case "supp":
              await sock.sendMessage(chatJid, {
                text: "@" + senderNumber + ", l'envoi de tags multiples est interdit dans ce groupe.",
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
                text: "@" + senderNumber + " a été retiré du groupe pour avoir mentionné plus de 30 membres.",
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
              let warningRecord = await Antitag_warnings.findOne({
                where: {
                  groupId: chatJid,
                  userId: senderJid
                }
              });
              if (!warningRecord) {
                await Antitag_warnings.create({
                  groupId: chatJid,
                  userId: senderJid
                });
                await sock.sendMessage(chatJid, {
                  text: "@" + senderNumber + ", vous avez reçu un avertissement (1/3) pour avoir mentionné plus de 30 membres.",
                  mentions: [senderJid]
                }, {
                  quoted: msg
                });
                await sock.sendMessage(chatJid, {
                  delete: deleteKey
                });
              } else {
                warningRecord.count += 1;
                await warningRecord.save();
                if (warningRecord.count >= 3) {
                  await sock.sendMessage(chatJid, {
                    text: "@" + senderNumber + " a été retiré du groupe après 3 avertissements.",
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
                    text: "@" + senderNumber + ", avertissement " + warningRecord.count + "/3 pour avoir mentionné plus de 30 membres.",
                    mentions: [senderJid]
                  }, {
                    quoted: msg
                  });
                  await sock.sendMessage(chatJid, {
                    delete: deleteKey
                  });
                }
              }
              break;
            default:
              console.error("Action inconnue : " + antitagConfig.type);
          }
        }
      }
    } catch (err) {
      console.error("Erreur dans le système Antitag :", err);
    }
  }
}
module.exports = { antitag };