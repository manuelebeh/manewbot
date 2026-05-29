const {
  levels,
  calculateLevel
} = require("../../database/levels");
const {
  Ranks,
  Levelup
} = require("../../database/rank");
const {
  changerPseudo,
  ajouterUtilisateur,
  getInfosUtilisateur
} = require("../../database/economie");
async function rankAndLevelUp(_0x24475e, _0x3fa81b, _0x2a3b31, _0x24cc9d, _0x255bfc) {
  if (!_0x2a3b31 || !_0x24cc9d) {
    return;
  }
  try {
    const _0x51870b = _0x24cc9d;
    const _0x9e794e = await getInfosUtilisateur(_0x51870b);
    if (!_0x9e794e) {
      await ajouterUtilisateur(_0x51870b, _0x255bfc || "utilisateur");
    }
    await changerPseudo(_0x51870b, _0x255bfc || "utilisateur");
    let _0x5f5c32 = await Ranks.findOne({
      where: {
        id: _0x51870b
      }
    });
    if (!_0x5f5c32) {
      _0x5f5c32 = await Ranks.create({
        id: _0x51870b,
        name: _0x255bfc || "utilisateur",
        level: 0,
        exp: 10,
        messages: 1
      });
    } else {
      _0x5f5c32.name = _0x255bfc || "utilisateur";
      _0x5f5c32.messages += 1;
      _0x5f5c32.exp += 10;
    }
    const _0x2f91f2 = calculateLevel(_0x5f5c32.exp);
    const _0xc3376e = await Levelup.findOne({
      where: {
        id: 1
      }
    });
    const _0x212632 = _0xc3376e && _0xc3376e.levelup === "oui";
    if (_0x2f91f2 > _0x5f5c32.level && _0x212632) {
      await _0x24475e.sendMessage(_0x3fa81b, {
        text: "Félicitations @" + (_0x51870b || "").split("@")[0] + "! Vous avez atteint le niveau " + _0x2f91f2 + "! 🎉",
        mentions: [_0x51870b]
      });
    }
    _0x5f5c32.level = _0x2f91f2;
    await _0x5f5c32.save();
  } catch (_0xf0a0a8) {
    console.error("Erreur dans rankAndLevelUp:", _0xf0a0a8);
  }
}
module.exports = rankAndLevelUp;