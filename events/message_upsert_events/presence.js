const {
  WA_CONF
} = require("../../database/wa_conf");
async function presence(sock, chatJid) {
  const config = await WA_CONF.findOne({
    where: {
      id: "1"
    }
  });
  if (config) {
    if (config.presence === "enligne") {
      await sock.sendPresenceUpdate("available", chatJid);
    } else if (config.presence === "ecrit") {
      await sock.sendPresenceUpdate("composing", chatJid);
    } else if (config.presence === "enregistre") {
      await sock.sendPresenceUpdate("recording", chatJid);
    }
  }
}
module.exports = presence;
