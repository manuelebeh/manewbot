const {
  Antispam,
  AntispamWarnings
} = require("../../database/antispam");
const messageStore = {};
const advancedSurveillance = {};
async function antispam(sock, chatJid, msg, senderJid, isGroup, isAdmin, isBotAdmin) {
  try {
    if (!isGroup || !senderJid || !msg.key?.id) {
      return;
    }
    if (isAdmin || !isBotAdmin) {
      return;
    }
    const now = Date.now();
    if (!messageStore[chatJid]) {
      messageStore[chatJid] = {};
    }
    if (!messageStore[chatJid][senderJid]) {
      messageStore[chatJid][senderJid] = [];
    }
    const userMessages = messageStore[chatJid][senderJid];
    const lastSpamTime = advancedSurveillance[chatJid]?.[senderJid];
    if (lastSpamTime && now - lastSpamTime < 2500) {
      try {
        await sock.sendMessage(chatJid, {
          delete: {
            remoteJid: chatJid,
            fromMe: false,
            id: msg.key.id,
            participant: senderJid
          }
        });
      } catch (deleteErr) {
        console.error(deleteErr);
      }
      return;
    }
    userMessages.push({
      id: msg.key.id,
      timestamp: now
    });
    if (userMessages.length > 10) {
      userMessages.shift();
    }
    const antispamConfig = await Antispam.findOne({
      where: {
        id: chatJid
      }
    });
    if (!antispamConfig || antispamConfig.mode?.toLowerCase() !== "oui") {
      return;
    }
    for (let i = 0; i <= userMessages.length - 5; i++) {
      const firstMsg = userMessages[i];
      const fifthMsg = userMessages[i + 4];
      const spanMs = fifthMsg.timestamp - firstMsg.timestamp;
      if (spanMs < 15000) {
        advancedSurveillance[chatJid] ??= {};
        advancedSurveillance[chatJid][senderJid] = now;
        for (let j = i; j <= i + 4; j++) {
          try {
            await sock.sendMessage(chatJid, {
              delete: {
                remoteJid: chatJid,
                fromMe: false,
                id: userMessages[j].id,
                participant: senderJid
              }
            });
          } catch (deleteErr) {
            console.error(deleteErr);
          }
        }
        const mentionTag = "@" + senderJid.split("@")[0];
        try {
          switch (antispamConfig.type) {
            case "supp":
              await sock.sendMessage(chatJid, {
                text: mentionTag + ", le spam est interdit ici.",
                mentions: [senderJid]
              }, {
                quoted: msg
              });
              break;
            case "kick":
              await sock.sendMessage(chatJid, {
                text: mentionTag + " a été retiré pour spam.",
                mentions: [senderJid]
              }, {
                quoted: msg
              });
              await sock.groupParticipantsUpdate(chatJid, [senderJid], "remove");
              break;
            case "warn":
              let warningRecord = await AntispamWarnings.findOne({
                where: {
                  groupId: chatJid,
                  userId: senderJid
                }
              });
              if (!warningRecord) {
                await AntispamWarnings.create({
                  groupId: chatJid,
                  userId: senderJid,
                  count: 1
                });
                await sock.sendMessage(chatJid, {
                  text: mentionTag + ", avertissement 1/3 pour spam.",
                  mentions: [senderJid]
                }, {
                  quoted: msg
                });
              } else {
                warningRecord.count += 1;
                await warningRecord.save();
                if (warningRecord.count >= 3) {
                  await sock.sendMessage(chatJid, {
                    text: mentionTag + " retiré après 3 avertissements.",
                    mentions: [senderJid]
                  }, {
                    quoted: msg
                  });
                  await sock.groupParticipantsUpdate(chatJid, [senderJid], "remove");
                  await warningRecord.destroy();
                } else {
                  await sock.sendMessage(chatJid, {
                    text: mentionTag + ", avertissement " + warningRecord.count + "/3 pour spam.",
                    mentions: [senderJid]
                  }, {
                    quoted: msg
                  });
                }
              }
              break;
          }
        } catch (actionErr) {
          console.error(actionErr);
        }
        messageStore[chatJid][senderJid] = userMessages.slice(-1);
        break;
      }
    }
  } catch (err) {
    console.error("Erreur dans Antispam:", err);
  }
}
module.exports = antispam;
