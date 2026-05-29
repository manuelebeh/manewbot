const {
  getMention
} = require("../../DataBase/mention");
const getJid = require("./cache_jid");
async function mention(_0xc7f4a9, _0x5f4418, _0x2c860a, _0x33ce4f, _0x39432b, _0x3a8ae1, _0x1a48da, _0x3dce86) {
  try {
    if (_0x3dce86 && _0x3dce86.includes(_0x3a8ae1)) {
      if (_0x39432b) {
        const _0xece1fa = await getMention();
        if (_0xece1fa && _0xece1fa.mode === "oui") {
          const {
            url: _0xa1ff44,
            text: _0x990499,
            type: _0x468287
          } = _0xece1fa;
          if ((!_0xa1ff44 || _0xa1ff44 === "") && (!_0x990499 || _0x990499 === "")) {
            _0x1a48da("Mention activée mais aucun contenu défini.");
            return;
          }
          switch (_0x468287) {
            case "audio":
              if (!_0xa1ff44) {
                return _0x1a48da(_0x990499 || "Aucun contenu audio défini.");
              }
              _0xc7f4a9.sendMessage(_0x5f4418, {
                audio: {
                  url: _0xa1ff44
                },
                mimetype: "audio/mpeg"
              }, {
                quoted: _0x2c860a
              });
              break;
            case "image":
              if (!_0xa1ff44) {
                return _0x1a48da(_0x990499 || "Aucun contenu image défini.");
              }
              _0xc7f4a9.sendMessage(_0x5f4418, {
                image: {
                  url: _0xa1ff44
                },
                caption: _0x990499 || undefined
              }, {
                quoted: _0x2c860a
              });
              break;
            case "video":
              if (!_0xa1ff44) {
                return _0x1a48da(_0x990499 || "Aucun contenu vidéo défini.");
              }
              _0xc7f4a9.sendMessage(_0x5f4418, {
                video: {
                  url: _0xa1ff44
                },
                caption: _0x990499 || undefined
              }, {
                quoted: _0x2c860a
              });
              break;
            case "texte":
              return _0x1a48da(_0x990499 || "Aucun message texte défini.");
            default:
              _0x1a48da("Le type de média est inconnu ou non pris en charge.");
          }
        }
      }
    }
  } catch (_0x4db77b) {
    console.error("Erreur dans mention:", _0x4db77b);
  }
}
module.exports = mention;