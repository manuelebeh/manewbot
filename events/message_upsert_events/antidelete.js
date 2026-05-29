const {
  WA_CONF
} = require("../../database/wa_conf");
async function antidelete(sock, msg, senderJid, contentType, getMessage, chatJid, botJid) {
  const config = await WA_CONF.findOne({
    where: {
      id: "1"
    }
  });
  if (!config) {
    return;
  }
  try {
    const antideleteMode = config.antidelete;
    const validModes = ["pm", "gc", "status", "all", "pm/gc", "pm/status", "gc/status"];
    const isValidMode = validModes.some(mode => antideleteMode.startsWith(mode));
    if (!isValidMode) {
      return;
    }
    if (contentType === "protocolMessage") {
      const protocolMessage = msg.message.protocolMessage;
      if (!protocolMessage?.key?.id) {
        return;
      }
      const deletedMessage = getMessage(protocolMessage.key.id);
      if (!deletedMessage) {
        return;
      }
      const remoteJid = deletedMessage.key.remoteJid;
      const remoteJidAlt = deletedMessage.key.remoteJidAlt || "";
      const chatId = remoteJidAlt || remoteJid;
      const isStatus = remoteJid === "status@broadcast";
      const isGroup = remoteJid.endsWith("@g.us");
      const isPrivate = !isStatus && remoteJidAlt.endsWith("@s.whatsapp.net");
      const isGroupChat = isGroup;
      const authorJid = isGroupChat ? deletedMessage.key.participant || deletedMessage.participant : chatId;
      const deleteTime = new Date().toISOString().substr(11, 8);
      if (!deletedMessage.key.fromMe) {
        function modeIncludes(mode) {
          return antideleteMode.includes(mode);
        }
        const shouldNotify = modeIncludes("gc") && isGroup || modeIncludes("pm") && isPrivate || modeIncludes("status") && isStatus || modeIncludes("all") || modeIncludes("pm/gc") && (isGroup || isPrivate) || modeIncludes("pm/status") && (isStatus || isPrivate) || modeIncludes("gc/status") && (isGroup || isStatus);
        if (!shouldNotify) {
          return;
        }
        const sourceLabel = isGroupChat ? "👥 Groupe : " + (await sock.groupMetadata(remoteJid)).subject : isStatus ? "📢 Status WhatsApp" : "📩 Chat : @" + chatId.split("@")[0];
        const alertText = ("\n✨ Manewbot ANTI-DELETE MSG ✨\n👤 Envoyé par : @" + authorJid.split("@")[0] + "\n❌ Supprimé par : @" + senderJid.split("@")[0] + "\n⏰ Heure de suppression : " + deleteTime + "\n" + sourceLabel + "\n        ").trim();
        if (antideleteMode.includes("-org")) {
          if (!botJid) {
            return;
          }
          await sock.sendMessage(botJid, {
            text: alertText,
            mentions: [authorJid, senderJid]
          }, {
            quoted: deletedMessage
          });
          const messageContent = deletedMessage.message;
          const messageType = Object.keys(messageContent || {})[0];
          if (messageType === "conversation" || messageType === "extendedTextMessage") {
            const textContent = messageContent?.conversation || messageContent?.extendedTextMessage?.text || "📝 Message supprimé (vide)";
            await sock.sendMessage(botJid, {
              text: textContent
            }, {
              quoted: deletedMessage
            });
          } else {
            await sock.sendMessage(botJid, {
              forward: deletedMessage
            }, {
              quoted: deletedMessage
            });
          }
        } else {
          await sock.sendMessage(chatJid, {
            text: alertText,
            mentions: [authorJid, senderJid]
          }, {
            quoted: deletedMessage
          });
          await sock.sendMessage(chatJid, {
            forward: deletedMessage
          }, {
            quoted: deletedMessage
          });
        }
      }
    }
  } catch (err) {
    console.error("❌ Une erreur est survenue dans antidelete :", err);
  }
}
module.exports = { antidelete };