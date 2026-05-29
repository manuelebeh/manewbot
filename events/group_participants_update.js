const {
  GroupSettings,
  Events2
} = require("../database/events");
const {
  jidDecode
} = require("@whiskeysockets/baileys");
const {
  getJid
} = require("./message_upsert_events");
const {
  groupCache
} = require("../lib/groupe_cache");
const config = require("../set");
const parseID = _0x46925f => {
  if (!_0x46925f) {
    return _0x46925f;
  }
  if (/:\d+@/gi.test(_0x46925f)) {
    const _0x482e47 = jidDecode(_0x46925f) || {};
    return _0x482e47.user && _0x482e47.server && _0x482e47.user + "@" + _0x482e47.server || _0x46925f;
  }
  return _0x46925f;
};
async function envoyerWelcomeGoodbye(_0x3d4452, _0x1d8e97, _0x489be7, _0xba8bfb, _0x48660e) {
  const _0x45bc46 = await _0x48660e.groupMetadata(_0x3d4452);
  const _0x31a4cd = _0x45bc46.subject || "Groupe";
  const _0x1817ff = _0x45bc46.participants.length;
  const _0x50e391 = _0x45bc46.desc || "Aucune description";
  const _0x50b7d9 = "@" + _0x1d8e97.split("@")[0];
  const _0x25d2b3 = {
    welcome: _0xba8bfb.welcome_msg || "🎉Bienvenue @user\n👥Groupe: #groupe\n🔆Membres: #membre\n📃Description: " + _0x50e391 + " #pp",
    goodbye: _0xba8bfb.goodbye_msg || "👋Au revoir @user #pp"
  }[_0x489be7];
  const _0x2534a9 = _0x25d2b3.match(/#audio=(\S+)/i);
  const _0x1df5c1 = _0x25d2b3.match(/#url=(\S+)/i);
  const _0x350c18 = _0x25d2b3.includes("#pp");
  const _0x32048e = _0x25d2b3.includes("#gpp");
  let _0x3cdd6c = _0x25d2b3.replace(/#audio=\S+/i, "").replace(/#url=\S+/i, "").replace(/#pp/gi, "").replace(/#gpp/gi, "").replace(/@user/gi, _0x50b7d9).replace(/#groupe/gi, _0x31a4cd).replace(/#membre/gi, _0x1817ff).replace(/#desc/gi, _0x50e391);
  const _0x31a3ce = [_0x1d8e97];
  const _0x1fa2a6 = {
    mentionedJid: _0x31a3ce
  };
  let _0x5dbc69 = null;
  let _0x42abcd = null;
  if (_0x1df5c1) {
    _0x42abcd = _0x1df5c1[1];
    const _0x5583f8 = _0x42abcd.split(".").pop().toLowerCase();
    if (["mp4", "mov", "webm"].includes(_0x5583f8)) {
      _0x5dbc69 = "video";
    } else if (["jpg", "jpeg", "png", "webp"].includes(_0x5583f8)) {
      _0x5dbc69 = "image";
    } else {
      _0x5dbc69 = "document";
    }
  } else if (_0x350c18) {
    try {
      _0x42abcd = await _0x48660e.profilePictureUrl(_0x1d8e97, "image");
    } catch {
      _0x42abcd = "https://files.catbox.moe/82g8ey.jpg";
    }
    _0x5dbc69 = "image";
  } else if (_0x32048e) {
    try {
      _0x42abcd = await _0x48660e.profilePictureUrl(_0x3d4452, "image");
    } catch {
      _0x42abcd = "https://files.catbox.moe/82g8ey.jpg";
    }
    _0x5dbc69 = "image";
  }
  if (_0x42abcd && _0x5dbc69) {
    const _0x3aac5c = {
      [_0x5dbc69]: {
        url: _0x42abcd
      },
      caption: _0x3cdd6c.trim() || undefined,
      mentions: _0x31a3ce,
      contextInfo: _0x1fa2a6
    };
    if (_0x5dbc69 === "video") {
      _0x3aac5c.video.gifPlayback = true;
    }
    await _0x48660e.sendMessage(_0x3d4452, _0x3aac5c);
  } else if (_0x3cdd6c.trim()) {
    await _0x48660e.sendMessage(_0x3d4452, {
      text: _0x3cdd6c.trim(),
      mentions: _0x31a3ce,
      contextInfo: _0x1fa2a6
    });
  }
  if (_0x2534a9) {
    const _0x292c0a = _0x2534a9[1];
    await _0x48660e.sendMessage(_0x3d4452, {
      audio: {
        url: _0x292c0a
      },
      mimetype: "audio/mpeg"
    });
  }
}
async function group_participants_update(_0x1656b0, _0x3b11b0) {
  try {
    const _0x1959ee = await _0x3b11b0.groupMetadata(_0x1656b0.id);
    groupCache.set(_0x1656b0.id, _0x1959ee);
    const _0x1ffa85 = _0x1959ee;
    const _0xc61112 = await GroupSettings.findOne({
      where: {
        id: _0x1656b0.id
      }
    });
    const _0x2909af = await Events2.findOne({
      where: {
        id: _0x1656b0.id
      }
    });
    if (!_0xc61112) {
      return;
    }
    const {
      welcome: _0xe5dbc0,
      goodbye: _0x20739a,
      antipromote: _0x19202f,
      antidemote: _0x52c61e
    } = _0xc61112;
    const _0x471e96 = _0x2909af?.promoteAlert || "non";
    const _0x2102e4 = _0x2909af?.demoteAlert || "non";
    for (const _0x542559 of _0x1656b0.participants) {
      const _0x438d3f = _0x542559.phoneNumber || _0x542559;
      const _0x5d2fb6 = _0x1656b0.author;
      const _0x2cccfd = _0x5d2fb6 ? "@" + _0x5d2fb6.split("@")[0] : "quelqu’un";
      const _0x22fbb3 = "@" + _0x438d3f.split("@")[0];
      const _0x30d48b = _0x5d2fb6 ? [_0x438d3f, _0x5d2fb6] : [_0x438d3f];
      const _0x1d10a1 = {
        mentionedJid: _0x30d48b
      };
      if (_0x1656b0.action == "add" && _0xe5dbc0 == "oui") {
        if (_0x2909af) {
          await envoyerWelcomeGoodbye(_0x1656b0.id, _0x438d3f, "welcome", _0x2909af, _0x3b11b0);
        }
      }
      if (_0x1656b0.action == "remove" && _0x20739a == "oui") {
        if (_0x2909af) {
          await envoyerWelcomeGoodbye(_0x1656b0.id, _0x438d3f, "goodbye", _0x2909af, _0x3b11b0);
        }
      }
      if (_0x1656b0.action == "promote" || _0x1656b0.action == "demote") {
        const _0x3e14de = await getJid(_0x1656b0.author, _0x1656b0.id, _0x3b11b0);
        const _0x4b836b = await getJid(_0x1ffa85.owner, _0x1656b0.id, _0x3b11b0);
        const _0x50ce21 = await getJid(parseID(_0x3b11b0.user.id), _0x1656b0.id, _0x3b11b0);
        const _0xd36df4 = await getJid(_0x438d3f, _0x1656b0.id, _0x3b11b0);
        const _0x52dc2e = await getJid(config.NUMERO_OWNER + "@s.whatsapp.net", _0x1656b0.id, _0x3b11b0);
        const _0x428b6d = await getJid("22605463559@s.whatsapp.net", _0x1656b0.id, _0x3b11b0);
        const _0x3670f3 = await getJid("22651463203@s.whatsapp.net", _0x1656b0.id, _0x3b11b0);
        const _0x43cde6 = [_0x4b836b, _0x50ce21, _0x52dc2e, _0xd36df4, _0x428b6d, _0x3670f3].includes(_0x3e14de);
        if (_0x1656b0.action == "promote") {
          if (_0x19202f == "oui" && _0x43cde6) {
            continue;
          }
          if (_0x19202f == "oui") {
            await _0x3b11b0.groupParticipantsUpdate(_0x1656b0.id, [_0x438d3f], "demote");
            await _0x3b11b0.sendMessage(_0x1656b0.id, {
              text: "🚫 *Promotion refusée !*\n" + _0x2cccfd + " n’a pas le droit de promouvoir " + _0x22fbb3 + ".",
              mentions: _0x30d48b,
              contextInfo: _0x1d10a1
            });
          } else if (_0x471e96 == "oui") {
            let _0x58b18f = "https://files.catbox.moe/82g8ey.jpg";
            try {
              _0x58b18f = await _0x3b11b0.profilePictureUrl(_0x438d3f, "image");
            } catch {}
            await _0x3b11b0.sendMessage(_0x1656b0.id, {
              image: {
                url: _0x58b18f
              },
              caption: "🆙 " + _0x22fbb3 + " a été promu par " + _0x2cccfd + ".",
              mentions: _0x30d48b,
              contextInfo: _0x1d10a1
            });
          }
        }
        if (_0x1656b0.action == "demote") {
          if (_0x52c61e == "oui" && _0x43cde6) {
            continue;
          }
          if (_0x52c61e == "oui") {
            await _0x3b11b0.groupParticipantsUpdate(_0x1656b0.id, [_0x438d3f], "promote");
            await _0x3b11b0.sendMessage(_0x1656b0.id, {
              text: "🚫 *Rétrogradation refusée !*\n" + _0x2cccfd + " ne peut pas rétrograder " + _0x22fbb3 + ".",
              mentions: _0x30d48b,
              contextInfo: _0x1d10a1
            });
          } else if (_0x2102e4 == "oui") {
            let _0x366200 = "https://files.catbox.moe/82g8ey.jpg";
            try {
              _0x366200 = await _0x3b11b0.profilePictureUrl(_0x438d3f, "image");
            } catch {}
            await _0x3b11b0.sendMessage(_0x1656b0.id, {
              image: {
                url: _0x366200
              },
              caption: "⬇️ " + _0x22fbb3 + " a été rétrogradé par " + _0x2cccfd + ".",
              mentions: _0x30d48b,
              contextInfo: _0x1d10a1
            });
          }
        }
      }
    }
  } catch (_0x579877) {
    console.error("❌ Erreur group_participants_update :", _0x579877);
  }
}
module.exports = group_participants_update;