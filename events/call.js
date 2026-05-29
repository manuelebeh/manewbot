const {
  WA_CONF2
} = require("../database/wa_conf");
async function call(sock, callEvents) {
  try {
    const callEvent = callEvents[0];
    const callerJid = callEvent?.from;
    const callId = callEvent?.id;
    if (!callerJid || !callId) {
      return;
    }
    const waConfig = await WA_CONF2.findOne({
      where: {
        id: "1"
      }
    });
    if (!waConfig || waConfig.anticall !== "oui") {
      return;
    }
    await sock.sendMessage(callerJid, {
      text: "❌ Les appels ne sont pas autorisés sur ce numéro !"
    });
    await sock.rejectCall(callId, callerJid);
  } catch (err) {
    console.error("Erreur lors du traitement de l’appel :", err);
  }
}
module.exports = call;
