const {
  Antimention,
  Antimention_warnings
} = require("../../database/antimention");
async function antimention(sock, chatJid, msg, isGroup, isAdmin, isBotAdmin, senderJid) {
  try {
    const statusMention = msg.message?.groupStatusMentionMessage;
    if (statusMention) {
      const antimentionConfig = await Antimention.findOne({
        where: {
          id: chatJid
        }
      });
      if (isGroup) {
        if (antimentionConfig && antimentionConfig.mode === "oui") {
          if (!isAdmin && isBotAdmin) {
            const senderNumber = senderJid.split("@")[0];
            const deleteKey = {
              remoteJid: chatJid,
              fromMe: false,
              id: msg.key.id,
              participant: senderJid
            };
            if (antimentionConfig.type === "supp") {
              await sock.sendMessage(chatJid, {
                text: "@" + senderNumber + ", la mention du groupe est interdite.",
                mentions: [senderJid]
              }, {
                quoted: msg
              });
              await sock.sendMessage(chatJid, {
                delete: deleteKey
              });
            }
            if (antimentionConfig.type === "kick") {
              await sock.sendMessage(chatJid, {
                text: "@" + senderNumber + " a été retiré pour avoir mentionné tout le groupe.",
                mentions: [senderJid]
              }, {
                quoted: msg
              });
              await sock.sendMessage(chatJid, {
                delete: deleteKey
              });
              await sock.groupParticipantsUpdate(chatJid, [senderJid], "remove");
            }
            if (antimentionConfig.type === "warn") {
              let warningRecord = await Antimention_warnings.findOne({
                where: {
                  groupId: chatJid,
                  userId: senderJid
                }
              });
              if (!warningRecord) {
                await Antimention_warnings.create({
                  groupId: chatJid,
                  userId: senderJid
                });
                await sock.sendMessage(chatJid, {
                  delete: deleteKey
                });
                await sock.sendMessage(chatJid, {
                  text: "@" + senderNumber + ", avertissement 1/3 pour mention abusive.",
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
                    text: "@" + senderNumber + ", avertissement " + warningRecord.count + "/3 pour mention abusive.",
                    mentions: [senderJid]
                  }, {
                    quoted: msg
                  });
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Erreur dans le système Antimention :", err);
  }
}
module.exports = { antimention };