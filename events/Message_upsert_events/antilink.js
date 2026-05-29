const {
  Antilink,
  Antilink_warnings
} = require("../../database/antilink");
function containsLink(_0x33c67f) {
  const _0x32eb67 = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/i;
  return _0x32eb67.test(_0x33c67f);
}
async function antilink(_0x1c738c, _0x4e815b, _0x11a0a4, _0x4840a8, _0x1028a6, _0x52f439, _0x407abe, _0x4bdbee) {
  try {
    if (containsLink(_0x4840a8)) {
      const _0x16f31c = await Antilink.findOne({
        where: {
          id: _0x4e815b
        }
      });
      if (_0x1028a6 && _0x16f31c && _0x16f31c.mode === "oui") {
        if (!_0x52f439 && _0x407abe) {
          const _0x283895 = _0x4bdbee.split("@")[0];
          const _0x38d413 = {
            remoteJid: _0x4e815b,
            fromMe: false,
            id: _0x11a0a4.key.id,
            participant: _0x4bdbee
          };
          switch (_0x16f31c.type) {
            case "supp":
              await _0x1c738c.sendMessage(_0x4e815b, {
                text: "@" + _0x283895 + ", les liens ne sont pas autorisés ici.",
                mentions: [_0x4bdbee]
              });
              await _0x1c738c.sendMessage(_0x4e815b, {
                delete: _0x38d413
              });
              break;
            case "kick":
              await _0x1c738c.sendMessage(_0x4e815b, {
                text: "@" + _0x283895 + " a été retiré pour avoir envoyé un lien.",
                mentions: [_0x4bdbee]
              });
              await _0x1c738c.sendMessage(_0x4e815b, {
                delete: _0x38d413
              });
              await _0x1c738c.groupParticipantsUpdate(_0x4e815b, [_0x4bdbee], "remove");
              break;
            case "warn":
              let _0x134464 = await Antilink_warnings.findOne({
                where: {
                  groupId: _0x4e815b,
                  userId: _0x4bdbee
                }
              });
              if (!_0x134464) {
                await Antilink_warnings.create({
                  groupId: _0x4e815b,
                  userId: _0x4bdbee
                });
                await _0x1c738c.sendMessage(_0x4e815b, {
                  delete: _0x38d413
                });
                await _0x1c738c.sendMessage(_0x4e815b, {
                  text: "@" + _0x283895 + ", avertissement 1/3 pour avoir envoyé un lien.",
                  mentions: [_0x4bdbee]
                });
              } else {
                _0x134464.count += 1;
                await _0x134464.save();
                if (_0x134464.count >= 3) {
                  await _0x1c738c.sendMessage(_0x4e815b, {
                    text: "@" + _0x283895 + " a été retiré après 3 avertissements.",
                    mentions: [_0x4bdbee]
                  });
                  await _0x1c738c.sendMessage(_0x4e815b, {
                    delete: _0x38d413
                  });
                  await _0x1c738c.groupParticipantsUpdate(_0x4e815b, [_0x4bdbee], "remove");
                  await _0x134464.destroy();
                } else {
                  await _0x1c738c.sendMessage(_0x4e815b, {
                    delete: _0x38d413
                  });
                  await _0x1c738c.sendMessage(_0x4e815b, {
                    text: "@" + _0x283895 + ", avertissement " + _0x134464.count + "/3 pour avoir envoyé un lien.",
                    mentions: [_0x4bdbee]
                  });
                }
              }
              break;
            default:
              console.error("⚠️ Action inconnue : " + _0x16f31c.type);
          }
        }
      }
    }
  } catch (_0x33d794) {
    console.error("❌ Erreur dans le système Antilink :", _0x33d794);
  }
}
module.exports = antilink;