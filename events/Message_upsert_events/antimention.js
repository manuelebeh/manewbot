const {
  Antimention,
  Antimention_warnings
} = require("../../database/antimention");
async function antimention(_0x15af5c, _0x47e6e7, _0x5ba24a, _0x3b1d8b, _0x57ec70, _0x22f61d, _0x281ae9) {
  try {
    const _0x1ab0fc = _0x5ba24a.message?.groupStatusMentionMessage;
    if (_0x1ab0fc) {
      const _0x5514fe = await Antimention.findOne({
        where: {
          id: _0x47e6e7
        }
      });
      if (_0x3b1d8b) {
        if (_0x5514fe && _0x5514fe.mode === "oui") {
          if (!_0x57ec70 && _0x22f61d) {
            const _0x20e36c = _0x281ae9.split("@")[0];
            const _0x4423e7 = {
              remoteJid: _0x47e6e7,
              fromMe: false,
              id: _0x5ba24a.key.id,
              participant: _0x281ae9
            };
            if (_0x5514fe.type === "supp") {
              await _0x15af5c.sendMessage(_0x47e6e7, {
                text: "@" + _0x20e36c + ", la mention du groupe est interdite.",
                mentions: [_0x281ae9]
              }, {
                quoted: _0x5ba24a
              });
              await _0x15af5c.sendMessage(_0x47e6e7, {
                delete: _0x4423e7
              });
            }
            if (_0x5514fe.type === "kick") {
              await _0x15af5c.sendMessage(_0x47e6e7, {
                text: "@" + _0x20e36c + " a été retiré pour avoir mentionné tout le groupe.",
                mentions: [_0x281ae9]
              }, {
                quoted: _0x5ba24a
              });
              await _0x15af5c.sendMessage(_0x47e6e7, {
                delete: _0x4423e7
              });
              await _0x15af5c.groupParticipantsUpdate(_0x47e6e7, [_0x281ae9], "remove");
            }
            if (_0x5514fe.type === "warn") {
              let _0x1a2126 = await Antimention_warnings.findOne({
                where: {
                  groupId: _0x47e6e7,
                  userId: _0x281ae9
                }
              });
              if (!_0x1a2126) {
                await Antimention_warnings.create({
                  groupId: _0x47e6e7,
                  userId: _0x281ae9
                });
                await _0x15af5c.sendMessage(_0x47e6e7, {
                  delete: _0x4423e7
                });
                await _0x15af5c.sendMessage(_0x47e6e7, {
                  text: "@" + _0x20e36c + ", avertissement 1/3 pour mention abusive.",
                  mentions: [_0x281ae9]
                }, {
                  quoted: _0x5ba24a
                });
              } else {
                _0x1a2126.count += 1;
                await _0x1a2126.save();
                if (_0x1a2126.count >= 3) {
                  await _0x15af5c.sendMessage(_0x47e6e7, {
                    text: "@" + _0x20e36c + " a été retiré après 3 avertissements.",
                    mentions: [_0x281ae9]
                  }, {
                    quoted: _0x5ba24a
                  });
                  await _0x15af5c.sendMessage(_0x47e6e7, {
                    delete: _0x4423e7
                  });
                  await _0x15af5c.groupParticipantsUpdate(_0x47e6e7, [_0x281ae9], "remove");
                  await _0x1a2126.destroy();
                } else {
                  await _0x15af5c.sendMessage(_0x47e6e7, {
                    delete: _0x4423e7
                  });
                  await _0x15af5c.sendMessage(_0x47e6e7, {
                    text: "@" + _0x20e36c + ", avertissement " + _0x1a2126.count + "/3 pour mention abusive.",
                    mentions: [_0x281ae9]
                  }, {
                    quoted: _0x5ba24a
                  });
                }
              }
            }
          }
        }
      }
    }
  } catch (_0x6bd2da) {
    console.error("Erreur dans le système Antimention :", _0x6bd2da);
  }
}
module.exports = antimention;