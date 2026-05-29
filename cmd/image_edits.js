const {
  registerCommand
} = require("../lib/commands");
const axios = require("axios");
const FormData = require("form-data");
const effetsCanvacord = ["shit", "wasted", "wanted", "trigger", "trash", "rip", "sepia", "rainbow", "hitler", "invert1", "jail", "affect", "beautiful", "blur", "circle1", "facepalm", "greyscale", "jokeoverhead", "delete_image", "darkness", "colorfy", "threshold", "pixelate"];
function genererCommandeCanvacord(_0x3dfaf8) {
  registerCommand({
    nom_cmd: _0x3dfaf8,
    classe: "Image_Edits",
    react: "🎨",
    desc: "Applique l'effet " + _0x3dfaf8 + " via l'API"
  }, async (_0x437128, _0x1f75fd, _0x37dd3b) => {
    const {
      arg: _0x344b19,
      ms: _0x33b37e,
      getJid: _0x56e2de,
      auteur_Msg_Repondu: _0x15b6c4,
      msg_Repondu: _0x42bf92,
      auteur_Message: _0x4b3f77
    } = _0x37dd3b;
    try {
      const _0x4e6be3 = _0x42bf92 || _0x33b37e.message;
      let _0xc8f713;
      let _0x4786c7 = false;
      if (_0x4e6be3?.imageMessage) {
        const _0xc6cbab = await _0x1f75fd.dl_save_media_ms(_0x4e6be3.imageMessage);
        _0xc8f713 = _0xc6cbab;
        _0x4786c7 = true;
      } else if (_0x344b19[0]?.startsWith("http")) {
        _0xc8f713 = _0x344b19[0];
      } else {
        const _0x1265bf = _0x15b6c4 || _0x344b19[0]?.includes("@") && _0x344b19[0].replace("@", "") + "@lid" || _0x4b3f77;
        const _0x197176 = await _0x56e2de(_0x1265bf, _0x437128, _0x1f75fd);
        try {
          _0xc8f713 = await _0x1f75fd.profilePictureUrl(_0x197176, "image");
        } catch {
          _0xc8f713 = "https://files.catbox.moe/ulwqtr.jpg";
        }
      }
      let _0x16d7d4;
      if (_0x4786c7) {
        const _0x309569 = new FormData();
        _0x309569.append("file", require("fs").createReadStream(_0xc8f713));
        _0x16d7d4 = await axios.post("https://api-ovl.koyeb.app/img-effect/" + _0x3dfaf8, _0x309569, {
          headers: _0x309569.getHeaders(),
          responseType: "arraybuffer"
        });
      } else {
        _0x16d7d4 = await axios.get("https://api-ovl.koyeb.app/img-effect/" + _0x3dfaf8 + "?url=" + encodeURIComponent(_0xc8f713), {
          responseType: "arraybuffer"
        });
      }
      await _0x1f75fd.sendMessage(_0x437128, {
        image: Buffer.from(_0x16d7d4.data)
      }, {
        quoted: _0x33b37e
      });
    } catch (_0x5c6122) {
      console.error("Erreur avec la commande \"" + _0x3dfaf8 + "\":", _0x5c6122);
    }
  });
}
effetsCanvacord.forEach(_0x3477f7 => genererCommandeCanvacord(_0x3477f7));