const {
  Antitag,
  Antitag_warnings
} = require("../../DataBase/antitag");
async function antitag(_0x1e2b60, _0x1447ff, _0x4685d2, _0x567acd, _0x6a46f9, _0x47b651, _0x1ff661, _0x12ddc6) {
  if (_0x1447ff.message?.[_0x567acd]?.contextInfo?.mentionedJid?.length > 30) {
    try {
      const _0x216e02 = await Antitag.findOne({
        where: {
          id: _0x4685d2
        }
      });
      if (_0x6a46f9 && _0x216e02 && _0x216e02.mode === "oui") {
        if (!_0x1ff661 && _0x47b651) {
          const _0x328a97 = _0x12ddc6.split("@")[0];
          const _0x5d6233 = {
            remoteJid: _0x4685d2,
            fromMe: false,
            id: _0x1447ff.key.id,
            participant: _0x12ddc6
          };
          switch (_0x216e02.type) {
            case "supp":
              await _0x1e2b60.sendMessage(_0x4685d2, {
                text: "@" + _0x328a97 + ", l'envoi de tags multiples est interdit dans ce groupe.",
                mentions: [_0x12ddc6]
              }, {
                quoted: _0x1447ff
              });
              await _0x1e2b60.sendMessage(_0x4685d2, {
                delete: _0x5d6233
              });
              break;
            case "kick":
              await _0x1e2b60.sendMessage(_0x4685d2, {
                text: "@" + _0x328a97 + " a été retiré du groupe pour avoir mentionné plus de 30 membres.",
                mentions: [_0x12ddc6]
              }, {
                quoted: _0x1447ff
              });
              await _0x1e2b60.sendMessage(_0x4685d2, {
                delete: _0x5d6233
              });
              await _0x1e2b60.groupParticipantsUpdate(_0x4685d2, [_0x12ddc6], "remove");
              break;
            case "warn":
              let _0x44bb9a = await Antitag_warnings.findOne({
                where: {
                  groupId: _0x4685d2,
                  userId: _0x12ddc6
                }
              });
              if (!_0x44bb9a) {
                await Antitag_warnings.create({
                  groupId: _0x4685d2,
                  userId: _0x12ddc6
                });
                await _0x1e2b60.sendMessage(_0x4685d2, {
                  text: "@" + _0x328a97 + ", vous avez reçu un avertissement (1/3) pour avoir mentionné plus de 30 membres.",
                  mentions: [_0x12ddc6]
                }, {
                  quoted: _0x1447ff
                });
                await _0x1e2b60.sendMessage(_0x4685d2, {
                  delete: _0x5d6233
                });
              } else {
                _0x44bb9a.count += 1;
                await _0x44bb9a.save();
                if (_0x44bb9a.count >= 3) {
                  await _0x1e2b60.sendMessage(_0x4685d2, {
                    text: "@" + _0x328a97 + " a été retiré du groupe après 3 avertissements.",
                    mentions: [_0x12ddc6]
                  }, {
                    quoted: _0x1447ff
                  });
                  await _0x1e2b60.sendMessage(_0x4685d2, {
                    delete: _0x5d6233
                  });
                  await _0x1e2b60.groupParticipantsUpdate(_0x4685d2, [_0x12ddc6], "remove");
                  await _0x44bb9a.destroy();
                } else {
                  await _0x1e2b60.sendMessage(_0x4685d2, {
                    text: "@" + _0x328a97 + ", avertissement " + _0x44bb9a.count + "/3 pour avoir mentionné plus de 30 membres.",
                    mentions: [_0x12ddc6]
                  }, {
                    quoted: _0x1447ff
                  });
                  await _0x1e2b60.sendMessage(_0x4685d2, {
                    delete: _0x5d6233
                  });
                }
              }
              break;
            default:
              console.error("Action inconnue : " + _0x216e02.type);
          }
        }
      }
    } catch (_0x38e516) {
      console.error("Erreur dans le système Antitag :", _0x38e516);
    }
  }
}
module.exports = antitag;