const {
  WA_CONF
} = require("../../database/wa_conf");
async function antidelete(_0xf91dc9, _0x51ac00, _0x353d7f, _0x2365b0, _0x174fae, _0x1f12f2, _0x37be1f) {
  const _0x280bb7 = await WA_CONF.findOne({
    where: {
      id: "1"
    }
  });
  if (!_0x280bb7) {
    return;
  }
  try {
    const _0x29b3ee = _0x280bb7.antidelete;
    const _0x3277d4 = ["pm", "gc", "status", "all", "pm/gc", "pm/status", "gc/status"];
    const _0x3ca381 = _0x3277d4.some(_0x498637 => _0x29b3ee.startsWith(_0x498637));
    if (!_0x3ca381) {
      return;
    }
    if (_0x2365b0 === "protocolMessage") {
      const _0x52131d = _0x51ac00.message.protocolMessage;
      if (!_0x52131d?.key?.id) {
        return;
      }
      const _0x590d5f = _0x174fae(_0x52131d.key.id);
      if (!_0x590d5f) {
        return;
      }
      const _0xfb9cc9 = _0x590d5f.key.remoteJid;
      const _0x3ad9f0 = _0x590d5f.key.remoteJidAlt || "";
      const _0xf3aa6c = _0x3ad9f0 || _0xfb9cc9;
      const _0x1ae95f = _0xfb9cc9 === "status@broadcast";
      const _0x156e92 = _0xfb9cc9.endsWith("@g.us");
      const _0xb36daf = !_0x1ae95f && _0x3ad9f0.endsWith("@s.whatsapp.net");
      const _0x110429 = _0x156e92;
      const _0x2cfa95 = _0x110429 ? _0x590d5f.key.participant || _0x590d5f.participant : _0xf3aa6c;
      const _0x5602e3 = new Date().toISOString().substr(11, 8);
      if (!_0x590d5f.key.fromMe) {
        function _0x37453b(_0x5c57ad) {
          return _0x29b3ee.includes(_0x5c57ad);
        }
        const _0xaa4543 = _0x37453b("gc") && _0x156e92 || _0x37453b("pm") && _0xb36daf || _0x37453b("status") && _0x1ae95f || _0x37453b("all") || _0x37453b("pm/gc") && (_0x156e92 || _0xb36daf) || _0x37453b("pm/status") && (_0x1ae95f || _0xb36daf) || _0x37453b("gc/status") && (_0x156e92 || _0x1ae95f);
        if (!_0xaa4543) {
          return;
        }
        const _0x4026a6 = _0x110429 ? "👥 Groupe : " + (await _0xf91dc9.groupMetadata(_0xfb9cc9)).subject : _0x1ae95f ? "📢 Status WhatsApp" : "📩 Chat : @" + _0xf3aa6c.split("@")[0];
        const _0x1c2380 = ("\n✨ Manewbot ANTI-DELETE MSG ✨\n👤 Envoyé par : @" + _0x2cfa95.split("@")[0] + "\n❌ Supprimé par : @" + _0x353d7f.split("@")[0] + "\n⏰ Heure de suppression : " + _0x5602e3 + "\n" + _0x4026a6 + "\n        ").trim();
        if (_0x29b3ee.includes("-org")) {
          if (!_0x1f12f2) {
            return;
          }
          await _0xf91dc9.sendMessage(_0x1f12f2, {
            text: _0x1c2380,
            mentions: [_0x2cfa95, _0x353d7f]
          }, {
            quoted: _0x590d5f
          });
          const _0x257a66 = _0x590d5f.message;
          const _0xd0cb1f = Object.keys(_0x257a66 || {})[0];
          if (_0xd0cb1f === "conversation" || _0xd0cb1f === "extendedTextMessage") {
            const _0x3e0d63 = _0x257a66?.conversation || _0x257a66?.extendedTextMessage?.text || "📝 Message supprimé (vide)";
            await _0xf91dc9.sendMessage(_0x1f12f2, {
              text: _0x3e0d63
            }, {
              quoted: _0x590d5f
            });
          } else {
            await _0xf91dc9.sendMessage(_0x1f12f2, {
              forward: _0x590d5f
            }, {
              quoted: _0x590d5f
            });
          }
        } else {
          await _0xf91dc9.sendMessage(_0x37be1f, {
            text: _0x1c2380,
            mentions: [_0x2cfa95, _0x353d7f]
          }, {
            quoted: _0x590d5f
          });
          await _0xf91dc9.sendMessage(_0x37be1f, {
            forward: _0x590d5f
          }, {
            quoted: _0x590d5f
          });
        }
      }
    }
  } catch (_0xcccca1) {
    console.error("❌ Une erreur est survenue dans antidelete :", _0xcccca1);
  }
}
module.exports = antidelete;