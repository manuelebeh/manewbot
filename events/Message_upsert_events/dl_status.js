const {
  WA_CONF
} = require("../../DataBase/wa_conf");
async function dl_status(_0x410d39, _0x91d9de, _0x41a1e9, _0x105e33) {
  const _0x2f37bc = await WA_CONF.findOne({
    where: {
      id: "1"
    }
  });
  if (_0x2f37bc) {
    if (_0x41a1e9.key.remoteJid === "status@broadcast" && _0x2f37bc.dl_status === "oui") {
      try {
        if (_0x41a1e9.message.extendedTextMessage) {
          await _0x410d39.sendMessage(_0x105e33, {
            text: _0x41a1e9.message.extendedTextMessage.text
          }, {
            quoted: _0x41a1e9
          });
        } else if (_0x41a1e9.message.imageMessage) {
          let _0x1a5846 = await _0x410d39.dl_save_media_ms(_0x41a1e9.message.imageMessage);
          await _0x410d39.sendMessage(_0x105e33, {
            image: {
              url: _0x1a5846
            },
            caption: _0x41a1e9.message.imageMessage.caption
          }, {
            quoted: _0x41a1e9
          });
        } else if (_0x41a1e9.message.videoMessage) {
          let _0x23928f = await _0x410d39.dl_save_media_ms(_0x41a1e9.message.videoMessage);
          await _0x410d39.sendMessage(_0x105e33, {
            video: {
              url: _0x23928f
            },
            caption: _0x41a1e9.message.videoMessage.caption
          }, {
            quoted: _0x41a1e9
          });
        }
      } catch (_0x54cd0b) {
        console.error("Erreur lors du traitement du message status:", _0x54cd0b);
      }
    }
  }
}
module.exports = dl_status;