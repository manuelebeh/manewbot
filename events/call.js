const {
  WA_CONF2
} = require("../DataBase/wa_conf");
async function call(_0x29273a, _0x593469) {
  try {
    const _0x3982f2 = _0x593469[0];
    const _0x4fcb2b = _0x3982f2?.from;
    const _0x1d232a = _0x3982f2?.id;
    if (!_0x4fcb2b || !_0x1d232a) {
      return;
    }
    const _0x4cc847 = await WA_CONF2.findOne({
      where: {
        id: "1"
      }
    });
    if (!_0x4cc847 || _0x4cc847.anticall !== "oui") {
      return;
    }
    await _0x29273a.sendMessage(_0x4fcb2b, {
      text: "❌ Les appels ne sont pas autorisés sur ce numéro !"
    });
    await _0x29273a.rejectCall(_0x1d232a, _0x4fcb2b);
  } catch (_0xaf6dc6) {
    console.error("Erreur lors du traitement de l’appel :", _0xaf6dc6);
  }
}
module.exports = call;