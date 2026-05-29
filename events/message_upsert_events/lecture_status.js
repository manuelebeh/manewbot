const {
  WA_CONF
} = require("../../database/wa_conf");
async function lecture_status(_0x587aef, _0x2dc232, _0x33e14f) {
  const _0x1ddd84 = await WA_CONF.findOne({
    where: {
      id: "1"
    }
  });
  if (_0x1ddd84) {
    if (_0x2dc232.key.remoteJid === "status@broadcast" && _0x1ddd84.lecture_status === "oui") {
      await _0x587aef.readMessages([_0x2dc232.key]);
    }
  }
}
module.exports = lecture_status;