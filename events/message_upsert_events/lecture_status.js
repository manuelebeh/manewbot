const {
  WA_CONF
} = require("../../database/wa_conf");
async function lecture_status(sock, msg, chatJid) {
  const config = await WA_CONF.findOne({
    where: {
      id: "1"
    }
  });
  if (config) {
    if (msg.key.remoteJid === "status@broadcast" && config.lecture_status === "oui") {
      await sock.readMessages([msg.key]);
    }
  }
}
module.exports = lecture_status;
