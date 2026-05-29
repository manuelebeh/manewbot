const {
  Antibot,
  AntibotWarnings
} = require("../../DataBase/antibot");
async function antibot(_0x3e17a7, _0x23563b, _0x3db788, _0x3696a5, _0x430b17, _0x37546f, _0x2d9bba) {
  try {
    const _0x44f4ba = _0x3db788.key.id.startsWith("BAES") || _0x3db788.key.id.startsWith("BAE5") || _0x3db788.key.id.startsWith("EVO") || _0x3db788.key.id.startsWith("3EB0");
    if (_0x44f4ba) {
      const _0x21c711 = await Antibot.findOne({
        where: {
          id: _0x23563b
        }
      });
      if (_0x3696a5 && _0x21c711 && _0x21c711.mode === "oui") {
        if (!_0x430b17 && _0x37546f) {
          const _0x4896c1 = {
            remoteJid: _0x23563b,
            fromMe: false,
            id: _0x3db788.key.id,
            participant: _0x2d9bba
          };
          const _0x2e9d12 = _0x2d9bba.split("@")[0];
          switch (_0x21c711.type) {
            case "supp":
              await _0x3e17a7.sendMessage(_0x23563b, {
                text: "@" + _0x2e9d12 + ", les bots ne sont pas autorisés ici.",
                mentions: [_0x2d9bba]
              }, {
                quoted: _0x3db788
              });
              await _0x3e17a7.sendMessage(_0x23563b, {
                delete: _0x4896c1
              });
              break;
            case "kick":
              await _0x3e17a7.sendMessage(_0x23563b, {
                text: "@" + _0x2e9d12 + " a été retiré pour avoir utilisé un bot.",
                mentions: [_0x2d9bba]
              }, {
                quoted: _0x3db788
              });
              await _0x3e17a7.sendMessage(_0x23563b, {
                delete: _0x4896c1
              });
              await _0x3e17a7.groupParticipantsUpdate(_0x23563b, [_0x2d9bba], "remove");
              break;
            case "warn":
              let _0x2f6fb2 = await AntibotWarnings.findOne({
                where: {
                  groupId: _0x23563b,
                  userId: _0x2d9bba
                }
              });
              if (!_0x2f6fb2) {
                await AntibotWarnings.create({
                  groupId: _0x23563b,
                  userId: _0x2d9bba
                });
                await _0x3e17a7.sendMessage(_0x23563b, {
                  delete: _0x4896c1
                });
                await _0x3e17a7.sendMessage(_0x23563b, {
                  text: "@" + _0x2e9d12 + ", avertissement 1/3 pour utilisation de bot.",
                  mentions: [_0x2d9bba]
                }, {
                  quoted: _0x3db788
                });
              } else {
                _0x2f6fb2.count += 1;
                await _0x2f6fb2.save();
                if (_0x2f6fb2.count >= 3) {
                  await _0x3e17a7.sendMessage(_0x23563b, {
                    text: "@" + _0x2e9d12 + " a été retiré après 3 avertissements.",
                    mentions: [_0x2d9bba]
                  }, {
                    quoted: _0x3db788
                  });
                  await _0x3e17a7.sendMessage(_0x23563b, {
                    delete: _0x4896c1
                  });
                  await _0x3e17a7.groupParticipantsUpdate(_0x23563b, [_0x2d9bba], "remove");
                  await _0x2f6fb2.destroy();
                } else {
                  await _0x3e17a7.sendMessage(_0x23563b, {
                    delete: _0x4896c1
                  });
                  await _0x3e17a7.sendMessage(_0x23563b, {
                    text: "@" + _0x2e9d12 + ", avertissement " + _0x2f6fb2.count + "/3 pour utilisation de bot.",
                    mentions: [_0x2d9bba]
                  }, {
                    quoted: _0x3db788
                  });
                }
              }
              break;
            default:
              console.error("Action inconnue : " + _0x21c711.type);
          }
        }
      }
    }
  } catch (_0x37215b) {
    console.error("Erreur dans le système Anti-Bot :", _0x37215b);
  }
}
module.exports = antibot;