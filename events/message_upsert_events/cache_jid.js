const fs = require("fs");
const path = require("path");
const filePath = path.join(__dirname, "../../lib/cache_jid.json");
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
}
function readCache() {
  const _0x16f5a6 = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(_0x16f5a6);
}
function writeCache(_0x66d24c) {
  fs.writeFileSync(filePath, JSON.stringify(_0x66d24c, null, 2));
}
async function getJid(_0x3f628a, _0x14740f, _0x5c840e, _0x1acb0f = 0) {
  try {
    if (!_0x3f628a || typeof _0x3f628a !== "string") {
      return null;
    }
    if (_0x3f628a.endsWith("@s.whatsapp.net")) {
      return _0x3f628a;
    }
    const _0xacf478 = readCache();
    if (_0xacf478[_0x3f628a]) {
      return _0xacf478[_0x3f628a];
    }
    if (!_0x14740f || !_0x14740f.endsWith("@g.us")) {
      return null;
    }
    const _0x1613c1 = await _0x5c840e.groupMetadata(_0x14740f);
    if (!_0x1613c1 || !Array.isArray(_0x1613c1.participants)) {
      return null;
    }
    const _0x2fa4cb = _0x1613c1.participants.find(_0x4e44e9 => _0x4e44e9.id == _0x3f628a);
    if (!_0x2fa4cb) {
      return null;
    }
    const _0x5110e9 = _0x2fa4cb.jid || _0x2fa4cb.phoneNumber;
    _0xacf478[_0x3f628a] = _0x5110e9;
    writeCache(_0xacf478);
    return _0x5110e9;
  } catch (_0x1074c4) {
    if (_0x1acb0f < 2) {
      return getJid(_0x3f628a, _0x14740f, _0x5c840e, _0x1acb0f + 1);
    }
    console.error("❌ Erreur dans getJid après 3 tentatives:", _0x1074c4.message);
    return null;
  }
}
module.exports = getJid;