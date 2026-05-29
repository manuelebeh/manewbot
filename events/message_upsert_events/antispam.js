const {
  Antispam,
  AntispamWarnings
} = require("../../database/antispam");
const messageStore = {};
const advancedSurveillance = {};
async function antispam(_0x4bc163, _0x4be075, _0x1318da, _0x56bd16, _0x5a3100, _0x5ed919, _0x113c15) {
  try {
    if (!_0x5a3100 || !_0x56bd16 || !_0x1318da.key?.id) {
      return;
    }
    if (_0x5ed919 || !_0x113c15) {
      return;
    }
    const _0x4ca8a6 = Date.now();
    if (!messageStore[_0x4be075]) {
      messageStore[_0x4be075] = {};
    }
    if (!messageStore[_0x4be075][_0x56bd16]) {
      messageStore[_0x4be075][_0x56bd16] = [];
    }
    const _0x2713be = messageStore[_0x4be075][_0x56bd16];
    const _0x20ccef = advancedSurveillance[_0x4be075]?.[_0x56bd16];
    if (_0x20ccef && _0x4ca8a6 - _0x20ccef < 2500) {
      try {
        await _0x4bc163.sendMessage(_0x4be075, {
          delete: {
            remoteJid: _0x4be075,
            fromMe: false,
            id: _0x1318da.key.id,
            participant: _0x56bd16
          }
        });
      } catch (_0x88792e) {
        console.error(_0x88792e);
      }
      return;
    }
    _0x2713be.push({
      id: _0x1318da.key.id,
      timestamp: _0x4ca8a6
    });
    if (_0x2713be.length > 10) {
      _0x2713be.shift();
    }
    const _0xaa2ec2 = await Antispam.findOne({
      where: {
        id: _0x4be075
      }
    });
    if (!_0xaa2ec2 || _0xaa2ec2.mode?.toLowerCase() !== "oui") {
      return;
    }
    for (let _0x51ec70 = 0; _0x51ec70 <= _0x2713be.length - 5; _0x51ec70++) {
      const _0x37ae69 = _0x2713be[_0x51ec70];
      const _0xb32e5e = _0x2713be[_0x51ec70 + 4];
      const _0x5deb9f = _0xb32e5e.timestamp - _0x37ae69.timestamp;
      if (_0x5deb9f < 15000) {
        advancedSurveillance[_0x4be075] ??= {};
        advancedSurveillance[_0x4be075][_0x56bd16] = _0x4ca8a6;
        for (let _0x1e67cf = _0x51ec70; _0x1e67cf <= _0x51ec70 + 4; _0x1e67cf++) {
          try {
            await _0x4bc163.sendMessage(_0x4be075, {
              delete: {
                remoteJid: _0x4be075,
                fromMe: false,
                id: _0x2713be[_0x1e67cf].id,
                participant: _0x56bd16
              }
            });
          } catch (_0x1f26f3) {
            console.error(_0x1f26f3);
          }
        }
        const _0x5c9df3 = "@" + _0x56bd16.split("@")[0];
        try {
          switch (_0xaa2ec2.type) {
            case "supp":
              await _0x4bc163.sendMessage(_0x4be075, {
                text: _0x5c9df3 + ", le spam est interdit ici.",
                mentions: [_0x56bd16]
              }, {
                quoted: _0x1318da
              });
              break;
            case "kick":
              await _0x4bc163.sendMessage(_0x4be075, {
                text: _0x5c9df3 + " a été retiré pour spam.",
                mentions: [_0x56bd16]
              }, {
                quoted: _0x1318da
              });
              await _0x4bc163.groupParticipantsUpdate(_0x4be075, [_0x56bd16], "remove");
              break;
            case "warn":
              let _0x4afda2 = await AntispamWarnings.findOne({
                where: {
                  groupId: _0x4be075,
                  userId: _0x56bd16
                }
              });
              if (!_0x4afda2) {
                await AntispamWarnings.create({
                  groupId: _0x4be075,
                  userId: _0x56bd16,
                  count: 1
                });
                await _0x4bc163.sendMessage(_0x4be075, {
                  text: _0x5c9df3 + ", avertissement 1/3 pour spam.",
                  mentions: [_0x56bd16]
                }, {
                  quoted: _0x1318da
                });
              } else {
                _0x4afda2.count += 1;
                await _0x4afda2.save();
                if (_0x4afda2.count >= 3) {
                  await _0x4bc163.sendMessage(_0x4be075, {
                    text: _0x5c9df3 + " retiré après 3 avertissements.",
                    mentions: [_0x56bd16]
                  }, {
                    quoted: _0x1318da
                  });
                  await _0x4bc163.groupParticipantsUpdate(_0x4be075, [_0x56bd16], "remove");
                  await _0x4afda2.destroy();
                } else {
                  await _0x4bc163.sendMessage(_0x4be075, {
                    text: _0x5c9df3 + ", avertissement " + _0x4afda2.count + "/3 pour spam.",
                    mentions: [_0x56bd16]
                  }, {
                    quoted: _0x1318da
                  });
                }
              }
              break;
          }
        } catch (_0x4c0a1f) {
          console.error(_0x4c0a1f);
        }
        messageStore[_0x4be075][_0x56bd16] = _0x2713be.slice(-1);
        break;
      }
    }
  } catch (_0xd2db56) {
    console.error("Erreur dans Antispam:", _0xd2db56);
  }
}
module.exports = antispam;