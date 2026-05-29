const {
  WA_CONF
} = require("../../database/wa_conf");
async function like_status(sock, msg, chatJid, botJid, senderJid) {
  try {
    const config = await WA_CONF.findOne({
      where: {
        id: "1"
      }
    });
    if (!config) {
      return;
    }
    const likeEmoji = config.like_status;
    const likeEnabled = likeEmoji && likeEmoji !== "non";
    if (msg.key.remoteJid === "status@broadcast" && likeEnabled) {
      await sock.sendMessage(msg.key.remoteJid, {
        react: {
          key: msg.key,
          text: likeEmoji
        }
      }, {
        statusJidList: [senderJid, botJid],
        broadcast: true
      });
    }
  } catch (err) {
    console.error("Erreur dans like_status :", err);
  }
}
module.exports = { like_status };