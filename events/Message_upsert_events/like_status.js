const {
  WA_CONF
} = require("../../DataBase/wa_conf");
async function like_status(_0x3e1fe5, _0x2548f9, _0x4edabd, _0x4e162f, _0x489c1e) {
  try {
    const _0x1824d4 = await WA_CONF.findOne({
      where: {
        id: "1"
      }
    });
    if (!_0x1824d4) {
      return;
    }
    const _0x3629a5 = _0x1824d4.like_status;
    const _0x53455d = _0x3629a5 && _0x3629a5 !== "non";
    if (_0x2548f9.key.remoteJid === "status@broadcast" && _0x53455d) {
      await _0x3e1fe5.sendMessage(_0x2548f9.key.remoteJid, {
        react: {
          key: _0x2548f9.key,
          text: _0x3629a5
        }
      }, {
        statusJidList: [_0x489c1e, _0x4e162f],
        broadcast: true
      });
    }
  } catch (_0x4cbc50) {
    console.error("Erreur dans like_status :", _0x4cbc50);
  }
}
module.exports = like_status;