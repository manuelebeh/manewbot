const fs = require("fs");
const path = require("path");
const {
  downloadContentFromMessage,
  jidDecode
} = require("@whiskeysockets/baileys");
const FileType = require("file-type");
const {
  getJid
} = require("./message_upsert_events");
async function dl_save_media_ms(_0x15b63b, _0x2c8b79) {
  const _0x43e944 = _0x2c8b79.msg || _0x2c8b79;
  const _0x21115c = _0x43e944.mimetype || "";
  const _0x54ed14 = _0x43e944.mtype ? _0x43e944.mtype.replace(/Message/gi, "") : _0x21115c.split("/")[0];
  if (!_0x21115c) {
    throw new Error("MIME type manquant");
  }
  const _0x10aea3 = await downloadContentFromMessage(_0x43e944, _0x54ed14);
  const _0x1ebccc = [];
  for await (const _0x4293bf of _0x10aea3) {
    _0x1ebccc.push(_0x4293bf);
  }
  const _0x3cece7 = Buffer.concat(_0x1ebccc);
  const _0x363cfc = await FileType.fromBuffer(_0x3cece7);
  if (!_0x363cfc) {
    throw new Error("Type de fichier inconnu");
  }
  const _0x495843 = "./downloads";
  if (!fs.existsSync(_0x495843)) {
    fs.mkdirSync(_0x495843, {
      recursive: true
    });
  }
  const _0x29059d = path.join(_0x495843, "media_" + Date.now() + "." + _0x363cfc.ext);
  await fs.promises.writeFile(_0x29059d, _0x3cece7);
  setTimeout(() => {
    fs.unlink(_0x29059d, () => {});
  }, 300000);
  return _0x29059d;
}
const decodeJid = _0x28915b => {
  if (!_0x28915b) {
    return _0x28915b;
  }
  if (/:\d+@/gi.test(_0x28915b)) {
    const _0x3483f5 = jidDecode(_0x28915b) || {};
    return _0x3483f5.user && _0x3483f5.server && _0x3483f5.user + "@" + _0x3483f5.server || _0x28915b;
  }
  return _0x28915b;
};
async function recup_msg({
  bot: _0x1ffb32,
  auteur: _0x47b751,
  ms_org: _0x400a08,
  temps = 30000
} = {}) {
  return new Promise(async (_0x4f63ea, _0x2ec9cb) => {
    if (_0x47b751 !== undefined && typeof _0x47b751 !== "string") {
      return _0x2ec9cb(new Error("L'auteur doit être une chaîne si défini."));
    }
    if (_0x400a08 !== undefined && typeof _0x400a08 !== "string") {
      return _0x2ec9cb(new Error("Le ms_org doit être une chaîne si défini."));
    }
    if (typeof temps !== "number") {
      return _0x2ec9cb(new Error("Le temps doit être un nombre."));
    }
    const _0x24b940 = _0x47b751 && _0x400a08 ? await getJid(_0x47b751, _0x400a08, _0x1ffb32) : _0x47b751;
    let _0xf05f3f;
    const _0x550303 = async ({
      type: _0x3cd217,
      messages: _0x46a4e3
    }) => {
      if (_0x3cd217 !== "notify") {
        return;
      }
      for (const _0x16abb2 of _0x46a4e3) {
        const _0x31458d = (_0x16abb2.key.remoteJidAlt || _0x16abb2.key.remoteJid) === decodeJid(_0x1ffb32.user.lid) ? decodeJid(_0x1ffb32.user.id) : _0x16abb2.key.remoteJidAlt || _0x16abb2.key.remoteJid;
        let _0x279390 = _0x16abb2.key.fromMe ? decodeJid(_0x1ffb32.user.id) : _0x16abb2.key.participantAlt || _0x16abb2.key.participant || _0x16abb2.key.senderPn ? await getJid(_0x16abb2.key.participantAlt || _0x16abb2.key.participant || _0x16abb2.key.senderPn || _0x16abb2.key.remoteJid, _0x31458d, _0x1ffb32) : _0x31458d;
        const _0x1a581b = _0x24b940 && _0x400a08 && _0x279390 == _0x24b940 && _0x31458d == _0x400a08 || _0x24b940 && !_0x400a08 && _0x279390 == _0x24b940 || !_0x24b940 && _0x400a08 && _0x31458d == _0x400a08 || !_0x24b940 && !_0x400a08;
        if (_0x1a581b) {
          _0x1ffb32.ev.off("messages.upsert", _0x550303);
          if (_0xf05f3f) {
            clearTimeout(_0xf05f3f);
          }
          _0x16abb2.key.participant = _0x279390;
          _0x16abb2.key.remoteJid = _0x31458d;
          return _0x4f63ea(_0x16abb2);
        }
      }
    };
    _0x1ffb32.ev.on("messages.upsert", _0x550303);
    if (temps > 0) {
      _0xf05f3f = setTimeout(() => {
        _0x1ffb32.ev.off("messages.upsert", _0x550303);
        _0x2ec9cb(new Error("Timeout"));
      }, temps);
    }
  });
}
module.exports = {
  dl_save_media_ms: dl_save_media_ms,
  recup_msg: recup_msg
};