const {
  WA_CONF
} = require("../../database/wa_conf");
async function dl_status(sock, chatJid, msg, botJid) {
  const config = await WA_CONF.findOne({
    where: {
      id: "1"
    }
  });
  if (config) {
    if (msg.key.remoteJid === "status@broadcast" && config.dl_status === "oui") {
      try {
        if (msg.message.extendedTextMessage) {
          await sock.sendMessage(botJid, {
            text: msg.message.extendedTextMessage.text
          }, {
            quoted: msg
          });
        } else if (msg.message.imageMessage) {
          let mediaPath = await sock.dl_save_media_ms(msg.message.imageMessage);
          await sock.sendMessage(botJid, {
            image: {
              url: mediaPath
            },
            caption: msg.message.imageMessage.caption
          }, {
            quoted: msg
          });
        } else if (msg.message.videoMessage) {
          let mediaPath = await sock.dl_save_media_ms(msg.message.videoMessage);
          await sock.sendMessage(botJid, {
            video: {
              url: mediaPath
            },
            caption: msg.message.videoMessage.caption
          }, {
            quoted: msg
          });
        }
      } catch (err) {
        console.error("Erreur lors du traitement du message status:", err);
      }
    }
  }
}
module.exports = { dl_status };