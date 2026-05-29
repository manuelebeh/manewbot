const {
  WA_CONF
} = require("../../DataBase/wa_conf");
async function presence(_0x51f30c, _0x4e7c8a) {
  const _0x4cb6bd = await WA_CONF.findOne({
    where: {
      id: "1"
    }
  });
  if (_0x4cb6bd) {
    if (_0x4cb6bd.presence === "enligne") {
      await _0x51f30c.sendPresenceUpdate("available", _0x4e7c8a);
    } else if (_0x4cb6bd.presence === "ecrit") {
      await _0x51f30c.sendPresenceUpdate("composing", _0x4e7c8a);
    } else if (_0x4cb6bd.presence === "enregistre") {
      await _0x51f30c.sendPresenceUpdate("recording", _0x4e7c8a);
    }
  }
}
module.exports = presence;