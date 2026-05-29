const {
  registerCommand
} = require("../lib/commands");
const fs = require("fs");
const {
  Sticker,
  StickerTypes
} = require("wa-sticker-formatter");
const {
  execSync,
  exec,
  spawn
} = require("child_process");
const path = require("path");
const config = require("../set");
const gTTS = require("gtts");
const axios = require("axios");
const FormData = require("form-data");
const {
  readFileSync
} = require("fs");
const sharp = require("sharp");
const {
  Ranks
} = require("../database/rank");
const os = require("os");
let fusionCache = {};
async function uploadToCatbox(_0x4e66d9) {
  try {
    const _0x378060 = new FormData();
    _0x378060.append("reqtype", "fileupload");
    _0x378060.append("fileToUpload", fs.createReadStream(_0x4e66d9));
    const _0x3af2c3 = await axios.post("https://catbox.moe/user/api.php", _0x378060, {
      headers: _0x378060.getHeaders()
    });
    return _0x3af2c3.data;
  } catch (_0x3c593b) {
    console.error("Erreur lors de l'upload sur Catbox:", _0x3c593b);
    throw new Error("Une erreur est survenue lors de l'upload du fichier.");
  }
}
const alea = _0x8ad1e2 => "" + Math.floor(Math.random() * 10000) + _0x8ad1e2;
const isSupportedFile = _0x218437 => {
  const _0x5739e1 = [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".gif"];
  return _0x5739e1.some(_0xa4056e => _0x218437.endsWith(_0xa4056e));
};
registerCommand({
  nom_cmd: "url",
  classe: "Conversion",
  react: "📤",
  desc: "Upload un fichier (image, vidéo, audio) sur Catbox et renvoie le lien"
}, async (_0x2d0d8d, _0x49fda8, _0x3c5e5b) => {
  const {
    msg_Repondu: _0x1ed775,
    ms: _0x46abfc
  } = _0x3c5e5b;
  const _0x3f62db = _0x1ed775 || _0x46abfc.message;
  if (!_0x3f62db) {
    return _0x49fda8.sendMessage(_0x2d0d8d, {
      text: "Veuillez mentionner un fichier (image, vidéo, audio ou document)."
    }, {
      quoted: _0x46abfc
    });
  }
  const _0x21aaa0 = _0x3f62db.imageMessage || _0x3f62db.videoMessage || _0x3f62db.documentMessage || _0x3f62db.audioMessage;
  if (!_0x21aaa0) {
    return _0x49fda8.sendMessage(_0x2d0d8d, {
      text: "Type de fichier non supporté. Veuillez mentionner une image, vidéo ou audio."
    }, {
      quoted: _0x46abfc
    });
  }
  try {
    const _0x357411 = await _0x49fda8.dl_save_media_ms(_0x21aaa0);
    const _0x2f3665 = await uploadToCatbox(_0x357411);
    await _0x49fda8.sendMessage(_0x2d0d8d, {
      text: _0x2f3665
    }, {
      quoted: _0x46abfc
    });
  } catch (_0x3734b2) {
    console.error("Erreur lors de l'upload sur Catbox:", _0x3734b2);
    await _0x49fda8.sendMessage(_0x2d0d8d, {
      text: "Erreur lors de la création du lien Catbox."
    }, {
      quoted: _0x46abfc
    });
  }
});
registerCommand({
  nom_cmd: "sticker",
  classe: "Conversion",
  react: "✍️",
  desc: "Crée un sticker à partir d'une image, vidéo ou GIF",
  alias: ["s", "stick"]
}, async (_0x388d9c, _0x1e3660, _0x289fab) => {
  const {
    msg_Repondu: _0x1862f5,
    arg: _0x255075,
    ms: _0x523e0f
  } = _0x289fab;
  const _0x380038 = _0x1862f5 || _0x523e0f.message;
  if (!_0x380038) {
    return _0x1e3660.sendMessage(_0x388d9c, {
      text: "Répondez à une image, vidéo ou GIF pour créer un sticker."
    }, {
      quoted: _0x523e0f
    });
  }
  let _0x29e16b;
  try {
    const _0x5e5f4b = _0x380038.imageMessage || _0x380038.videoMessage;
    if (!_0x5e5f4b) {
      return _0x1e3660.sendMessage(_0x388d9c, {
        text: "Veuillez répondre à une image, vidéo ou GIF valide."
      }, {
        quoted: _0x523e0f
      });
    }
    _0x29e16b = await _0x1e3660.dl_save_media_ms(_0x5e5f4b);
    if (!_0x29e16b) {
      throw new Error("Impossible de télécharger le fichier.");
    }
    const _0x353033 = fs.readFileSync(_0x29e16b);
    const _0x469d4c = new Sticker(_0x353033, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: _0x380038.imageMessage ? 100 : 30
    });
    const _0x365c54 = Math.floor(Math.random() * 10000) + ".webp";
    await _0x469d4c.toFile(_0x365c54);
    await _0x1e3660.sendMessage(_0x388d9c, {
      sticker: fs.readFileSync(_0x365c54)
    }, {
      quoted: _0x523e0f
    });
    fs.unlinkSync(_0x29e16b);
    fs.unlinkSync(_0x365c54);
  } catch (_0x2a54f9) {
    console.error("Erreur lors de la création du sticker:", _0x2a54f9);
    await _0x1e3660.sendMessage(_0x388d9c, {
      text: "Erreur lors de la création du sticker : " + _0x2a54f9.message
    }, {
      quoted: _0x523e0f
    });
  }
});
registerCommand({
  nom_cmd: "crop",
  classe: "Conversion",
  react: "✂️",
  desc: "Crée un sticker croppé à partir d'une image ou vidéo"
}, async (_0x3f9da7, _0x1045ee, _0x57c7c8) => {
  const {
    msg_Repondu: _0x3bc4cc,
    ms: _0x21f0a5
  } = _0x57c7c8;
  const _0xc5b04f = _0x3bc4cc || _0x21f0a5.message;
  if (!_0xc5b04f) {
    return _0x1045ee.sendMessage(_0x3f9da7, {
      text: "Répondez à une image ou vidéo."
    }, {
      quoted: _0x21f0a5
    });
  }
  let _0x40b19f;
  try {
    const _0x29429a = _0xc5b04f.imageMessage || _0xc5b04f.videoMessage;
    if (!_0x29429a) {
      return _0x1045ee.sendMessage(_0x3f9da7, {
        text: "Veuillez répondre à une image ou vidéo valide."
      }, {
        quoted: _0x21f0a5
      });
    }
    _0x40b19f = await _0x1045ee.dl_save_media_ms(_0x29429a);
    const _0x144069 = fs.readFileSync(_0x40b19f);
    const _0x2db9ff = new Sticker(_0x144069, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.CROPPED,
      quality: _0xc5b04f.imageMessage ? 100 : 30
    });
    const _0x360aad = Math.floor(Math.random() * 10000) + ".webp";
    await _0x2db9ff.toFile(_0x360aad);
    await _0x1045ee.sendMessage(_0x3f9da7, {
      sticker: fs.readFileSync(_0x360aad)
    }, {
      quoted: _0x21f0a5
    });
    fs.unlinkSync(_0x40b19f);
    fs.unlinkSync(_0x360aad);
  } catch (_0x4696a2) {
    console.error("Erreur lors de la création du sticker :", _0x4696a2);
    await _0x1045ee.sendMessage(_0x3f9da7, {
      text: "Erreur lors de la création du sticker : " + _0x4696a2.message
    }, {
      quoted: _0x21f0a5
    });
  }
});
registerCommand({
  nom_cmd: "circle",
  classe: "Conversion",
  react: "🔵",
  desc: "Crée un sticker circulaire à partir d'une image ou vidéo"
}, async (_0x55d248, _0x216ed4, _0xa6819b) => {
  const {
    msg_Repondu: _0xc2e39f,
    ms: _0x61168b
  } = _0xa6819b;
  const _0x3c1cdb = _0xc2e39f || _0x61168b.message;
  if (!_0x3c1cdb) {
    return _0x216ed4.sendMessage(_0x55d248, {
      text: "Répondez à une image ou vidéo."
    }, {
      quoted: _0x61168b
    });
  }
  let _0x580984;
  try {
    const _0xa48867 = _0x3c1cdb.imageMessage || _0x3c1cdb.videoMessage;
    if (!_0xa48867) {
      return _0x216ed4.sendMessage(_0x55d248, {
        text: "Veuillez répondre à une image ou vidéo valide."
      }, {
        quoted: _0x61168b
      });
    }
    _0x580984 = await _0x216ed4.dl_save_media_ms(_0xa48867);
    const _0x148bfc = fs.readFileSync(_0x580984);
    const _0x2b2559 = new Sticker(_0x148bfc, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.CIRCLE,
      quality: _0x3c1cdb.imageMessage ? 100 : 30
    });
    const _0x2fcb02 = Math.floor(Math.random() * 10000) + ".webp";
    await _0x2b2559.toFile(_0x2fcb02);
    await _0x216ed4.sendMessage(_0x55d248, {
      sticker: fs.readFileSync(_0x2fcb02)
    }, {
      quoted: _0x61168b
    });
    fs.unlinkSync(_0x580984);
    fs.unlinkSync(_0x2fcb02);
  } catch (_0x5bce8e) {
    console.error("Erreur lors de la création du sticker :", _0x5bce8e);
    await _0x216ed4.sendMessage(_0x55d248, {
      text: "Erreur lors de la création du sticker : " + _0x5bce8e.message
    }, {
      quoted: _0x61168b
    });
  }
});
registerCommand({
  nom_cmd: "round",
  classe: "Conversion",
  react: "🔲",
  desc: "Crée un sticker avec des coins arrondis à partir d'une image ou vidéo"
}, async (_0x18a99d, _0x1f5450, _0x163020) => {
  const {
    msg_Repondu: _0x1584a1,
    ms: _0x255769
  } = _0x163020;
  const _0x1b93a3 = _0x1584a1 || _0x255769.message;
  if (!_0x1b93a3) {
    return _0x1f5450.sendMessage(_0x18a99d, {
      text: "Répondez à une image ou vidéo."
    }, {
      quoted: _0x255769
    });
  }
  let _0x44db0c;
  try {
    const _0x42af5a = _0x1b93a3.imageMessage || _0x1b93a3.videoMessage;
    if (!_0x42af5a) {
      return _0x1f5450.sendMessage(_0x18a99d, {
        text: "Veuillez répondre à une image ou vidéo valide."
      }, {
        quoted: _0x255769
      });
    }
    _0x44db0c = await _0x1f5450.dl_save_media_ms(_0x42af5a);
    const _0x439526 = fs.readFileSync(_0x44db0c);
    const _0x59962d = new Sticker(_0x439526, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.ROUNDED,
      quality: _0x1b93a3.imageMessage ? 100 : 30
    });
    const _0x22976b = Math.floor(Math.random() * 10000) + ".webp";
    await _0x59962d.toFile(_0x22976b);
    await _0x1f5450.sendMessage(_0x18a99d, {
      sticker: fs.readFileSync(_0x22976b)
    }, {
      quoted: _0x255769
    });
    fs.unlinkSync(_0x44db0c);
    fs.unlinkSync(_0x22976b);
  } catch (_0x31d47b) {
    console.error("Erreur lors de la création du sticker :", _0x31d47b);
    await _0x1f5450.sendMessage(_0x18a99d, {
      text: "Erreur lors de la création du sticker : " + _0x31d47b.message
    }, {
      quoted: _0x255769
    });
  }
});
registerCommand({
  nom_cmd: "take",
  classe: "Conversion",
  react: "✍️",
  desc: "Modifie le nom d'un sticker"
}, async (_0x4d138b, _0x469671, _0x1f0fd2) => {
  const {
    msg_Repondu: _0x1f9deb,
    arg: _0x488e3f,
    nom_Auteur_Message: _0x10d894,
    ms: _0x168011
  } = _0x1f0fd2;
  if (!_0x1f9deb || !_0x1f9deb.stickerMessage) {
    return _0x469671.sendMessage(_0x4d138b, {
      text: "Répondez à un sticker."
    }, {
      quoted: _0x168011
    });
  }
  try {
    const _0x286772 = await _0x469671.dl_save_media_ms(_0x1f9deb.stickerMessage);
    const _0x4a9e0a = _0x1f9deb.stickerMessage.quality || 40;
    const _0x2f4bfb = new Sticker(_0x286772, {
      pack: _0x488e3f.join(" ") ? _0x488e3f.join(" ") : _0x10d894,
      author: "",
      type: StickerTypes.FULL,
      quality: _0x4a9e0a
    });
    const _0x20c956 = alea(".webp");
    await _0x2f4bfb.toFile(_0x20c956);
    await _0x469671.sendMessage(_0x4d138b, {
      sticker: fs.readFileSync(_0x20c956)
    }, {
      quoted: _0x168011
    });
    fs.unlinkSync(_0x20c956);
  } catch (_0x448ed5) {
    await _0x469671.sendMessage(_0x4d138b, {
      text: "Erreur lors du renommage du sticker : " + _0x448ed5.message
    }, {
      quoted: _0x168011
    });
  }
});
registerCommand({
  nom_cmd: "toimage",
  classe: "Conversion",
  react: "✍️",
  desc: "Convertit un sticker en image",
  alias: ["toimg", "photo"]
}, async (_0x587a33, _0x76a9d6, _0x298bea) => {
  const {
    msg_Repondu: _0x531086,
    ms: _0x247638
  } = _0x298bea;
  if (!_0x531086 || !_0x531086.stickerMessage) {
    return _0x76a9d6.sendMessage(_0x587a33, {
      text: "Répondez à un sticker."
    }, {
      quoted: _0x247638
    });
  }
  try {
    const _0x2d16b8 = await _0x76a9d6.dl_save_media_ms(_0x531086.stickerMessage);
    const _0x113904 = await sharp(_0x2d16b8).png().toBuffer();
    await _0x76a9d6.sendMessage(_0x587a33, {
      image: _0x113904
    }, {
      quoted: _0x247638
    });
  } catch (_0x1c0f6f) {
    await _0x76a9d6.sendMessage(_0x587a33, {
      text: "Erreur lors de la conversion en image : " + _0x1c0f6f.message
    }, {
      quoted: _0x247638
    });
  }
});
registerCommand({
  nom_cmd: "write",
  classe: "Conversion",
  react: "✍️",
  desc: "Ajoute du texte à une image, vidéo ou sticker"
}, async (_0x17bd63, _0x3feb24, _0x3e1592) => {
  const {
    msg_Repondu: _0x25798a,
    arg: _0x205b8e,
    ms: _0x277cdf
  } = _0x3e1592;
  if (!_0x25798a || !_0x205b8e[0]) {
    return _0x3feb24.sendMessage(_0x17bd63, {
      text: "Veuillez répondre à un fichier et fournir du texte."
    }, {
      quoted: _0x277cdf
    });
  }
  const _0x14dfe4 = _0x25798a.imageMessage || _0x25798a.videoMessage || _0x25798a.stickerMessage;
  if (!_0x14dfe4) {
    return _0x3feb24.sendMessage(_0x17bd63, {
      text: "Type de fichier non supporté. Veuillez mentionner une image, vidéo ou sticker."
    }, {
      quoted: _0x277cdf
    });
  }
  try {
    const _0x307995 = await _0x3feb24.dl_save_media_ms(_0x14dfe4);
    const _0x59e4c4 = sharp(_0x307995);
    const {
      width: _0x3ff921,
      height: _0x26e285
    } = await _0x59e4c4.metadata();
    const _0x261b25 = _0x205b8e.join(" ").toUpperCase();
    let _0x5ca4c3 = Math.floor(_0x3ff921 / 10);
    if (_0x5ca4c3 < 20) {
      _0x5ca4c3 = 20;
    }
    const _0x4fec83 = _0x5ca4c3 * 1.2;
    const _0x23f95d = _0x3ff921 * 0.8;
    function _0x2d86f8(_0x87835a, _0x27abbc) {
      const _0x3c5187 = _0x87835a.split(" ");
      let _0x34e969 = [];
      let _0x54cf0d = "";
      _0x3c5187.forEach(_0x3f5efe => {
        let _0x228511 = _0x54cf0d + _0x3f5efe + " ";
        let _0x3dcf28 = _0x228511.length * (_0x5ca4c3 * 0.6);
        if (_0x3dcf28 > _0x27abbc && _0x54cf0d !== "") {
          _0x34e969.push(_0x54cf0d.trim());
          _0x54cf0d = _0x3f5efe + " ";
        } else {
          _0x54cf0d = _0x228511;
        }
      });
      _0x34e969.push(_0x54cf0d.trim());
      return _0x34e969;
    }
    const _0x176d84 = _0x2d86f8(_0x261b25, _0x23f95d);
    const _0x4d13dc = _0x176d84.map((_0x5644c1, _0x3d650a) => "<text x=\"50%\" y=\"" + (_0x26e285 - (_0x176d84.length - _0x3d650a) * _0x4fec83) + "\" font-size=\"" + _0x5ca4c3 + "\" font-family=\"Arial\" fill=\"white\" text-anchor=\"middle\" stroke=\"black\" stroke-width=\"" + _0x5ca4c3 / 15 + "\">" + _0x5644c1 + "</text>").join("");
    const _0x431b67 = "<svg width=\"" + _0x3ff921 + "\" height=\"" + _0x26e285 + "\">" + _0x4d13dc + "</svg>";
    const _0x45c2cc = await _0x59e4c4.composite([{
      input: Buffer.from(_0x431b67),
      top: 0,
      left: 0
    }]).toBuffer();
    const _0x28ae6f = Math.floor(Math.random() * 10000) + ".webp";
    await sharp(_0x45c2cc).webp().toFile(_0x28ae6f);
    await _0x3feb24.sendMessage(_0x17bd63, {
      sticker: fs.readFileSync(_0x28ae6f)
    }, {
      quoted: _0x277cdf
    }, {
      quoted: _0x277cdf
    });
    fs.unlinkSync(_0x28ae6f);
    fs.unlinkSync(_0x307995);
  } catch (_0x530c9c) {
    await _0x3feb24.sendMessage(_0x17bd63, {
      text: "Une erreur est survenue lors de l'ajout du texte : " + _0x530c9c.message
    }, {
      quoted: _0x277cdf
    });
  }
});
const remini = async (_0x306111, _0x178fb3) => {
  const _0x2c2ea2 = ["enhance", "recolor", "dehaze"];
  const _0x5b7624 = _0x2c2ea2.includes(_0x178fb3) ? _0x178fb3 : _0x2c2ea2[0];
  const _0xd45ab2 = "https://inferenceengine.vyro.ai/" + _0x5b7624;
  const _0x2e8360 = new FormData();
  _0x2e8360.append("model_version", 1);
  const _0xc6fc4e = Buffer.isBuffer(_0x306111) ? _0x306111 : readFileSync(_0x306111);
  _0x2e8360.append("image", _0xc6fc4e, {
    filename: "enhance_image_body.jpg",
    contentType: "image/jpeg"
  });
  const _0x48e017 = await axios.post(_0xd45ab2, _0x2e8360, {
    headers: {
      ..._0x2e8360.getHeaders(),
      "User-Agent": "okhttp/4.9.3",
      Connection: "Keep-Alive",
      "Accept-Encoding": "gzip"
    },
    responseType: "arraybuffer"
  });
  return Buffer.from(_0x48e017.data);
};
registerCommand({
  nom_cmd: "remini",
  classe: "Conversion",
  react: "🖼️",
  desc: "Amélioration de la qualité des images"
}, async (_0x2d97f4, _0x528c48, _0x1211f5) => {
  const {
    msg_Repondu: _0x48c04a,
    ms: _0x201acb
  } = _0x1211f5;
  const _0x536132 = _0x48c04a || _0x201acb.message;
  if (!_0x536132?.imageMessage) {
    return _0x528c48.sendMessage(_0x2d97f4, {
      text: "Veuillez répondre à une image pour améliorer sa qualité."
    }, {
      quoted: _0x201acb
    });
  }
  try {
    const _0x5166f7 = await _0x528c48.dl_save_media_ms(_0x536132.imageMessage);
    if (!_0x5166f7) {
      return _0x528c48.sendMessage(_0x2d97f4, {
        text: "Impossible de télécharger l'image. Réessayez."
      }, {
        quoted: _0x201acb
      });
    }
    try {
      const _0x2335d6 = await uploadToCatbox(_0x5166f7);
      const _0x23941c = await axios.get("https://www.itzky.xyz/api/remini?url=" + _0x2335d6);
      await _0x528c48.sendMessage(_0x2d97f4, {
        image: {
          url: _0x23941c.data.result
        },
        caption: "```Powered by Manewbot```"
      }, {
        quoted: _0x201acb
      });
      return;
    } catch {}
    try {
      const _0x57a5a0 = await remini(_0x5166f7, "enhance");
      await _0x528c48.sendMessage(_0x2d97f4, {
        image: _0x57a5a0,
        caption: "```Powered by Manewbot```"
      }, {
        quoted: _0x201acb
      });
    } catch {
      await _0x528c48.sendMessage(_0x2d97f4, {
        text: "Une erreur est survenue pendant le traitement de l'image avec les deux services."
      }, {
        quoted: _0x201acb
      });
    }
  } catch {
    return _0x528c48.sendMessage(_0x2d97f4, {
      text: "Une erreur est survenue pendant le traitement de l'image."
    }, {
      quoted: _0x201acb
    });
  }
});
registerCommand({
  nom_cmd: "emix",
  classe: "Conversion",
  react: "🌟",
  desc: "Mixes deux emojis pour créer un sticker"
}, async (_0x42fd14, _0xc2b243, _0xb17812) => {
  const {
    arg: _0x4d9266,
    prefixe: _0x2a7e77,
    ms: _0x2d7e40
  } = _0xb17812;
  if (!_0x4d9266 || _0x4d9266.length < 1) {
    return _0xc2b243.sendMessage(_0x42fd14, {
      text: "Example: " + _0x2a7e77 + "emix 😅;🤔"
    }, {
      quoted: _0x2d7e40
    });
  }
  let [_0x5c07a2, _0x53a174] = _0x4d9266[0].split(";");
  try {
    let _0x45efbe = await axios.get("https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=" + encodeURIComponent(_0x5c07a2) + "_" + encodeURIComponent(_0x53a174));
    let _0x4de6c5 = _0x45efbe.data;
    if (!_0x4de6c5.results || _0x4de6c5.results.length === 0) {
      return _0xc2b243.sendMessage(_0x42fd14, {
        text: "Aucun résultat trouvé pour ces emojis."
      }, {
        quoted: _0x2d7e40
      });
    }
    for (let _0x3b5af2 of _0x4de6c5.results) {
      const _0x4bc74d = await axios.get(_0x3b5af2.url, {
        responseType: "arraybuffer"
      }).then(_0x648143 => _0x648143.data);
      const _0x380c75 = new Sticker(_0x4bc74d, {
        pack: config.STICKER_PACK_NAME,
        author: config.STICKER_AUTHOR_NAME,
        type: StickerTypes.FULL,
        quality: 100
      });
      const _0x39c8f5 = Math.floor(Math.random() * 10000) + ".webp";
      await _0x380c75.toFile(_0x39c8f5);
      await _0xc2b243.sendMessage(_0x42fd14, {
        sticker: fs.readFileSync(_0x39c8f5)
      }, {
        quoted: _0x2d7e40
      });
      fs.unlinkSync(_0x39c8f5);
    }
  } catch (_0x21efd0) {
    console.error("Erreur:", _0x21efd0);
    return _0xc2b243.sendMessage(_0x42fd14, {
      text: "Une erreur est survenue lors de la recherche de l'image."
    }, {
      quoted: _0x2d7e40
    });
  }
});
registerCommand({
  nom_cmd: "tts",
  classe: "Conversion",
  react: "🔊",
  desc: "Convertit un texte en parole et renvoie l'audio."
}, async (_0x8a7da5, _0x12b88b, _0x49df8f) => {
  const {
    arg: _0x449d85,
    prefixe: _0x269161,
    ms: _0x26995e
  } = _0x49df8f;
  if (!_0x449d85[0]) {
    return _0x12b88b.sendMessage(_0x8a7da5, {
      text: "Entrez un texte à lire."
    }, {
      quoted: _0x26995e
    });
  }
  let _0x12617c = "fr";
  let _0x5311b6 = _0x449d85.join(" ");
  if (_0x449d85[0].length === 2) {
    _0x12617c = _0x449d85[0];
    _0x5311b6 = _0x449d85.slice(1).join(" ");
  }
  try {
    const _0x185356 = new gTTS(_0x5311b6, _0x12617c);
    const _0x3e5ea4 = path.join(__dirname, "output.mp3");
    _0x185356.save(_0x3e5ea4, function (_0x2be9c6, _0x5264f2) {
      if (_0x2be9c6) {
        return _0x12b88b.sendMessage(_0x8a7da5, {
          text: "Une erreur est survenue lors de la conversion en audio. Veuillez réessayer plus tard."
        }, {
          quoted: _0x26995e
        });
      }
      const _0x5bbdaa = fs.readFileSync(_0x3e5ea4);
      const _0x3bd4c8 = {
        audio: _0x5bbdaa,
        mimetype: "audio/mpeg",
        caption: "```Powered by Manewbot```"
      };
      _0x12b88b.sendMessage(_0x8a7da5, _0x3bd4c8, {
        quoted: _0x26995e
      }).then(() => {
        fs.unlinkSync(_0x3e5ea4);
      });
    });
  } catch (_0x9906ad) {
    return _0x12b88b.sendMessage(_0x8a7da5, {
      text: "Une erreur est survenue lors de la conversion en audio. Veuillez réessayer plus tard."
    }, {
      quoted: _0x26995e
    });
  }
});
registerCommand({
  nom_cmd: "attp",
  classe: "Conversion",
  react: "📥",
  desc: "Transforme du texte en sticker animé"
}, async (_0x3026ec, _0x3c2588, _0x24bee9) => {
  const {
    arg: _0x51482a,
    repondre: _0x3fadb1,
    nom_Auteur_Message: _0x488716,
    ms: _0x185882
  } = _0x24bee9;
  if (!_0x51482a[0]) {
    return _0x3fadb1("Veuillez fournir du texte");
  }
  const _0x2e9460 = _0x51482a.join(" ");
  try {
    const _0x5d4b26 = await axios.get("https://api-ovl.koyeb.app/attp?texte=" + encodeURIComponent(_0x2e9460), {
      responseType: "arraybuffer"
    });
    const _0x2f0e80 = await new Sticker(_0x5d4b26.data, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: 90,
      background: "transparent"
    }).toBuffer();
    await _0x3c2588.sendMessage(_0x3026ec, {
      sticker: _0x2f0e80
    }, {
      quoted: _0x185882
    });
  } catch (_0xc603e9) {
    console.error(_0xc603e9);
    _0x3fadb1("❌ Une erreur est survenue lors de la génération du sticker animé.");
  }
});
registerCommand({
  nom_cmd: "ttp",
  classe: "Conversion",
  react: "📥",
  desc: "Transforme du texte en sticker"
}, async (_0x2c238a, _0x16d286, _0x41bd0c) => {
  const {
    arg: _0x2f3949,
    repondre: _0x204b9e,
    nom_Auteur_Message: _0x3523ea,
    ms: _0x101970
  } = _0x41bd0c;
  if (!_0x2f3949[0]) {
    return _0x204b9e("Veuillez fournir du texte");
  }
  const _0x4c417d = _0x2f3949.join(" ");
  try {
    const _0x1d1a5c = await axios.get("https://api-ovl.koyeb.app/ttp?texte=" + encodeURIComponent(_0x4c417d), {
      responseType: "arraybuffer"
    });
    const _0x17c2c0 = await new Sticker(_0x1d1a5c.data, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: 70,
      background: "transparent"
    }).toBuffer();
    await _0x16d286.sendMessage(_0x2c238a, {
      sticker: _0x17c2c0
    }, {
      quoted: _0x101970
    });
  } catch (_0x36abf3) {
    console.error(_0x36abf3);
    _0x204b9e("❌ Une erreur est survenue lors de la génération du sticker.");
  }
});
async function convertWebpToMp4({
  file: _0x3ad355,
  filename: _0x46feca,
  url: _0x28c5d8
}) {
  try {
    if (!_0x3ad355 && !_0x28c5d8) {
      throw new Error("Un fichier ou une URL est requis.");
    }
    if (_0x3ad355 && !_0x46feca) {
      throw new Error("Le nom du fichier est requis pour les fichiers envoyés.");
    }
    const _0x50819c = new FormData();
    if (_0x3ad355) {
      _0x50819c.append("new-image", _0x3ad355, {
        filename: _0x46feca
      });
    }
    if (_0x28c5d8) {
      _0x50819c.append("new-image-url", _0x28c5d8);
    }
    const _0x50cec3 = await axios.post("https://ezgif.com/webp-to-mp4", _0x50819c, {
      headers: _0x50819c.getHeaders()
    });
    const _0x525611 = _0x50cec3?.request?.res?.responseUrl;
    if (!_0x525611) {
      throw new Error("Redirection introuvable.");
    }
    const _0x2db324 = _0x525611.replace(/\.html$/, "");
    const _0x4b5e76 = _0x2db324.split("/").pop();
    const _0x110ed0 = await axios.post(_0x2db324 + "?ajax=true", new URLSearchParams({
      file: _0x4b5e76,
      background: "#ffffff",
      backgroundc: "#ffffff",
      repeat: "1",
      ajax: "true"
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    const _0x88ace8 = _0x110ed0.data.toString();
    const _0x20bea9 = "\" controls><source src=\"";
    const _0x5d2396 = "\" type=\"video/mp4\">Your browser";
    const _0x3f53a2 = _0x88ace8.split(_0x20bea9)?.[1]?.split(_0x5d2396)?.[0];
    if (!_0x3f53a2) {
      throw new Error("Conversion échouée.");
    }
    return "https:" + _0x3f53a2.replace("https:", "");
  } catch (_0x26246d) {
    throw new Error("Erreur conversion WebP → MP4 : " + _0x26246d);
  }
}
registerCommand({
  nom_cmd: "stickertovideo",
  classe: "Conversion",
  react: "🎞️",
  desc: "Convertit un sticker en vidéo MP4",
  alias: ["stovid"]
}, async (_0x27f642, _0x234632, _0x10e4c1) => {
  const {
    ms: _0x24425a,
    repondre: _0x533fdb,
    msg_Repondu: _0x4a6b79
  } = _0x10e4c1;
  try {
    if (!_0x4a6b79 || !_0x4a6b79.stickerMessage) {
      return _0x234632.sendMessage(_0x27f642, {
        text: "Répondez à un sticker."
      }, {
        quoted: _0x24425a
      });
    }
    const _0x9ac953 = await _0x234632.dl_save_media_ms(_0x4a6b79.stickerMessage);
    const _0x2f8195 = fs.createReadStream(_0x9ac953);
    const _0x42e740 = await convertWebpToMp4({
      file: _0x2f8195,
      filename: "fichier.webp"
    });
    await _0x234632.sendMessage(_0x27f642, {
      video: {
        url: _0x42e740
      },
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x24425a
    });
    fs.unlinkSync(_0x9ac953);
  } catch (_0x2eab3b) {
    console.error(_0x2eab3b);
    _0x533fdb("❌ Une erreur est survenue pendant la conversion.");
  }
});
registerCommand({
  nom_cmd: "quotely",
  classe: "Conversion",
  react: "🖼️",
  desc: "Transforme un message cité en sticker stylisé.",
  alias: ["q"]
}, async (_0x37e58f, _0x30736f, {
  ms: _0x35eac2,
  msg_Repondu: _0x492c82,
  repondre: _0x34c222,
  auteur_Msg_Repondu: _0x48023a
}) => {
  const _0xa1f017 = _0x492c82?.conversation || _0x492c82?.extendedTextMessage?.text;
  if (!_0xa1f017) {
    return _0x34c222("Veuillez répondre à un message texte.");
  }
  let _0x1ad609;
  try {
    _0x1ad609 = await _0x30736f.profilePictureUrl(_0x48023a, "image");
  } catch (_0x2ee309) {
    _0x1ad609 = "https://files.catbox.moe/8kvevz.jpg";
  }
  let _0x3276dc;
  const _0x2e7704 = await Ranks.findOne({
    where: {
      id: _0x48023a
    }
  });
  if (_0x2e7704.name) {
    _0x3276dc = _0x2e7704.name;
  } else {
    _0x3276dc = "Manewbot-USER";
  }
  const _0x5a6220 = ["#FFFFFF", "#000000", "#1f1f1f", "#e3e3e3"];
  const _0x50ca7a = _0x5a6220[Math.floor(Math.random() * _0x5a6220.length)];
  const _0x3c971a = {
    type: "quote",
    format: "png",
    backgroundColor: _0x50ca7a,
    width: 512,
    height: 512,
    scale: 3,
    messages: [{
      avatar: true,
      from: {
        first_name: _0x3276dc,
        language_code: "fr",
        name: _0x3276dc,
        photo: {
          url: _0x1ad609
        }
      },
      text: _0xa1f017,
      replyMessage: {}
    }]
  };
  try {
    const _0x470952 = await axios.post("https://bot.lyo.su/quote/generate", _0x3c971a);
    const _0x2eb23b = Buffer.from(_0x470952.data.result.image, "base64");
    const _0x430460 = new Sticker(_0x2eb23b, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: 100
    });
    const _0x15957a = "/tmp/quotely_" + Date.now() + ".webp";
    await _0x430460.toFile(_0x15957a);
    await _0x30736f.sendMessage(_0x37e58f, {
      sticker: fs.readFileSync(_0x15957a)
    }, {
      quoted: _0x35eac2
    });
    fs.unlinkSync(_0x15957a);
  } catch (_0x170e3d) {
    console.error("Erreur Quotely :", _0x170e3d.message || _0x170e3d);
    return _0x34c222("Une erreur est survenue lors de la génération du sticker.");
  }
});
registerCommand({
  nom_cmd: "tovv",
  classe: "Outils",
  react: "👀",
  desc: "envoie un message en vue unique dans la discussion"
}, async (_0x1690f0, _0x283942, _0x5db66a) => {
  const {
    ms: _0x2a7cd5,
    msg_Repondu: _0x1132f8,
    repondre: _0x1516a8
  } = _0x5db66a;
  if (!_0x1132f8) {
    return _0x1516a8("Veuillez mentionner un message qui n'est pas en vue unique.");
  }
  let _0x237c28 = Object.keys(_0x1132f8).find(_0x2559d3 => _0x2559d3.startsWith("viewOnceMessage"));
  let _0x89bc8f = _0x1132f8;
  if (_0x237c28) {
    _0x89bc8f = _0x1132f8[_0x237c28].message;
  }
  if (_0x89bc8f) {
    if (_0x89bc8f.imageMessage && _0x89bc8f.imageMessage.viewOnce == true || _0x89bc8f.videoMessage && _0x89bc8f.videoMessage.viewOnce == true || _0x89bc8f.audioMessage && _0x89bc8f.audioMessage.viewOnce == true) {
      return _0x1516a8("Ce message est un message en vue unique.");
    }
  }
  try {
    let _0x56aaa3;
    let _0x1af055 = {
      quoted: _0x2a7cd5
    };
    if (_0x89bc8f.imageMessage) {
      _0x56aaa3 = await _0x283942.dl_save_media_ms(_0x89bc8f.imageMessage);
      await _0x283942.sendMessage(_0x1690f0, {
        image: {
          url: _0x56aaa3
        },
        viewOnce: true,
        caption: _0x89bc8f.imageMessage.caption || ""
      }, _0x1af055);
    } else if (_0x89bc8f.videoMessage) {
      _0x56aaa3 = await _0x283942.dl_save_media_ms(_0x89bc8f.videoMessage);
      await _0x283942.sendMessage(_0x1690f0, {
        video: {
          url: _0x56aaa3
        },
        viewOnce: true,
        caption: _0x89bc8f.videoMessage.caption || ""
      }, _0x1af055);
    } else if (_0x89bc8f.audioMessage) {
      _0x56aaa3 = await _0x283942.dl_save_media_ms(_0x89bc8f.audioMessage);
      await _0x283942.sendMessage(_0x1690f0, {
        audio: {
          url: _0x56aaa3
        },
        viewOnce: true,
        mimetype: "audio/mp4",
        ptt: false
      }, _0x1af055);
    } else {
      return _0x1516a8("Ce type de message en vue unique n'est pas pris en charge.");
    }
  } catch (_0x12c801) {
    console.error("Erreur lors de l'envoi du message en vue unique :", _0x12c801.message || _0x12c801);
    return _0x1516a8("Une erreur est survenue lors du traitement du message.");
  }
});
registerCommand({
  nom_cmd: "toaudio",
  classe: "Conversion",
  react: "🎧",
  desc: "Convertit une vidéo en audio"
}, async (_0x13c924, _0x24cb68, {
  msg_Repondu: _0x167269,
  ms: _0x1d6aeb
}) => {
  if (!_0x167269 || !_0x167269.videoMessage) {
    return _0x24cb68.sendMessage(_0x13c924, {
      text: "❌ Répondez à une *vidéo*."
    }, {
      quoted: _0x1d6aeb
    });
  }
  try {
    const _0x152279 = await _0x24cb68.dl_save_media_ms(_0x167269.videoMessage);
    const _0xffb304 = path.join(os.tmpdir(), "aud_" + Date.now() + ".mp3");
    await new Promise((_0x504283, _0x3f4dce) => {
      const _0x4b5fe4 = spawn("ffmpeg", ["-i", _0x152279, "-vn", "-acodec", "libmp3lame", "-q:a", "4", _0xffb304]);
      _0x4b5fe4.stderr.on("data", () => {});
      _0x4b5fe4.on("close", _0x950ef => {
        if (_0x950ef === 0) {
          _0x504283();
        } else {
          _0x3f4dce(new Error("ffmpeg exited with code " + _0x950ef));
        }
      });
    });
    await _0x24cb68.sendMessage(_0x13c924, {
      audio: fs.readFileSync(_0xffb304),
      mimetype: "audio/mpeg"
    }, {
      quoted: _0x1d6aeb
    });
    fs.unlinkSync(_0x152279);
    fs.unlinkSync(_0xffb304);
  } catch (_0xf60ed0) {
    await _0x24cb68.sendMessage(_0x13c924, {
      text: "❌ Erreur de conversion : " + _0xf60ed0.message
    }, {
      quoted: _0x1d6aeb
    });
  }
});
registerCommand({
  nom_cmd: "tovideo",
  classe: "Conversion",
  react: "🎬",
  desc: "Convertit un audio en vidéo animée"
}, async (_0x26251d, _0x2a922a, {
  msg_Repondu: _0x3f71f7,
  ms: _0x27d1a2
}) => {
  if (!_0x3f71f7 || !_0x3f71f7.audioMessage) {
    return _0x2a922a.sendMessage(_0x26251d, {
      text: "❌ Répondez à un *audio*."
    }, {
      quoted: _0x27d1a2
    });
  }
  try {
    const _0x590c8d = await _0x2a922a.dl_save_media_ms(_0x3f71f7.audioMessage);
    const _0xf6b054 = parseFloat(execSync("ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 \"" + _0x590c8d + "\"").toString().trim());
    const _0x25471a = path.basename(_0x590c8d, path.extname(_0x590c8d));
    const _0x16dc26 = path.dirname(_0x590c8d);
    const _0x3507a1 = path.join(_0x16dc26, _0x25471a + ".mp4");
    await new Promise((_0x3196d9, _0x356b76) => {
      const _0x11d75a = spawn("ffmpeg", ["-y", "-i", _0x590c8d, "-f", "lavfi", "-i", "color=c=black:s=640x360:d=" + _0xf6b054, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", _0x3507a1]);
      _0x11d75a.stderr.on("data", () => {});
      _0x11d75a.on("close", _0x3969ca => {
        if (_0x3969ca === 0) {
          _0x3196d9();
        } else {
          _0x356b76(new Error("ffmpeg exited with code " + _0x3969ca));
        }
      });
    });
    await _0x2a922a.sendMessage(_0x26251d, {
      video: fs.readFileSync(_0x3507a1)
    }, {
      quoted: _0x27d1a2
    });
    fs.unlinkSync(_0x590c8d);
    fs.unlinkSync(_0x3507a1);
  } catch (_0x8b0461) {
    await _0x2a922a.sendMessage(_0x26251d, {
      text: "❌ Erreur de conversion en vidéo : " + _0x8b0461.message
    }, {
      quoted: _0x27d1a2
    });
  }
});
registerCommand({
  nom_cmd: "fusion",
  classe: "Conversion",
  react: "🎬",
  desc: "Fusionne un audio et une vidéo"
}, async (_0x186422, _0x2e9590, {
  msg_Repondu: _0x26a175,
  ms: _0x2d5dd5,
  auteur_Message: _0x399251,
  arg: _0x319745
}) => {
  const _0xc83fbe = _0x399251;
  fusionCache[_0xc83fbe] = fusionCache[_0xc83fbe] || {};
  if (_0x319745[0]?.toLowerCase() === "result") {
    if (!fusionCache[_0xc83fbe].audioPath || !fusionCache[_0xc83fbe].videoPath) {
      return _0x2e9590.sendMessage(_0x186422, {
        text: "❌ Audio ou vidéo manquant."
      }, {
        quoted: _0x2d5dd5
      });
    }
    const {
      audioPath: _0x162361,
      videoPath: _0x396cb2
    } = fusionCache[_0xc83fbe];
    const _0x2b27f3 = path.join(path.dirname(_0x396cb2), "fusion_" + Date.now() + ".mp4");
    try {
      await new Promise((_0x429ed8, _0xa9a372) => {
        const _0x5dea36 = spawn("ffmpeg", ["-y", "-i", _0x396cb2, "-i", _0x162361, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", _0x2b27f3]);
        _0x5dea36.on("close", _0x8e33d5 => {
          if (_0x8e33d5 === 0) {
            _0x429ed8();
          } else {
            _0xa9a372(new Error("ffmpeg " + _0x8e33d5));
          }
        });
      });
      await _0x2e9590.sendMessage(_0x186422, {
        video: fs.readFileSync(_0x2b27f3)
      }, {
        quoted: _0x2d5dd5
      });
      fs.unlinkSync(_0x162361);
      fs.unlinkSync(_0x396cb2);
      fs.unlinkSync(_0x2b27f3);
      delete fusionCache[_0xc83fbe];
      return;
    } catch (_0x17c6f2) {
      return _0x2e9590.sendMessage(_0x186422, {
        text: "❌ Erreur lors de la fusion."
      }, {
        quoted: _0x2d5dd5
      });
    }
  }
  if (_0x26a175?.audioMessage) {
    if (fusionCache[_0xc83fbe].audioPath) {
      return _0x2e9590.sendMessage(_0x186422, {
        text: "⚠️ Audio déjà enregistré. Envoyez une vidéo ou tapez *fusion result*."
      }, {
        quoted: _0x2d5dd5
      });
    }
    const _0x399fbe = await _0x2e9590.dl_save_media_ms(_0x26a175.audioMessage);
    fusionCache[_0xc83fbe].audioPath = _0x399fbe;
    if (fusionCache[_0xc83fbe].videoPath) {
      return _0x2e9590.sendMessage(_0x186422, {
        text: "✅ Audio ajouté. Tapez *fusion result* pour obtenir la vidéo."
      }, {
        quoted: _0x2d5dd5
      });
    }
    return _0x2e9590.sendMessage(_0x186422, {
      text: "✅ Audio enregistré. Répondez maintenant à une vidéo."
    }, {
      quoted: _0x2d5dd5
    });
  }
  if (_0x26a175?.videoMessage) {
    if (fusionCache[_0xc83fbe].videoPath) {
      return _0x2e9590.sendMessage(_0x186422, {
        text: "⚠️ Vidéo déjà enregistrée. Envoyez un audio ou tapez *fusion result*."
      }, {
        quoted: _0x2d5dd5
      });
    }
    const _0x4c59d4 = await _0x2e9590.dl_save_media_ms(_0x26a175.videoMessage);
    fusionCache[_0xc83fbe].videoPath = _0x4c59d4;
    if (fusionCache[_0xc83fbe].audioPath) {
      return _0x2e9590.sendMessage(_0x186422, {
        text: "✅ Vidéo ajoutée. Tapez *fusion result* pour obtenir le résultat."
      }, {
        quoted: _0x2d5dd5
      });
    }
    return _0x2e9590.sendMessage(_0x186422, {
      text: "✅ Vidéo enregistrée. Répondez maintenant à un audio."
    }, {
      quoted: _0x2d5dd5
    });
  }
  return _0x2e9590.sendMessage(_0x186422, {
    text: "❌ Répondez à un *audio* ou une *vidéo*."
  }, {
    quoted: _0x2d5dd5
  });
});