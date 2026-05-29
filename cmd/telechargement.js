const {
  registerCommand
} = require("../lib/commands");
const {
  fbdl,
  ttdl,
  igdl,
  twitterdl,
  ytdl,
  apkdl
} = require("../lib/dl");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
registerCommand({
  nom_cmd: "song",
  classe: "Telechargement",
  react: "🎵",
  desc: "Télécharge une chanson depuis YouTube avec un terme de recherche",
  alias: ["play"]
}, async (_0x14b2f6, _0x5b9498, {
  arg: _0x332d6f,
  ms: _0x1afb89,
  repondre: _0xf8ca04,
  msg_Repondu: _0x41b193
}) => {
  let _0x43c9c7 = _0x332d6f;
  if (!_0x43c9c7.length && _0x41b193) {
    const _0x32e297 = _0x41b193.conversation || _0x41b193.extendedTextMessage?.text || "";
    if (typeof _0x32e297 === "string") {
      const _0x1961ee = _0x32e297.split(/ +/);
      const _0x5df515 = _0x1961ee.find(_0x1ade7d => _0x1ade7d.startsWith("https"));
      if (_0x5df515) {
        _0x43c9c7 = [_0x5df515];
      }
    }
  }
  if (!_0x43c9c7.length) {
    return _0xf8ca04("Veuillez spécifier un titre ou un lien YouTube.");
  }
  try {
    const _0x44f142 = _0x43c9c7.join(" ");
    const _0x546223 = await ytdl(_0x44f142, "audio");
    const _0x362c52 = _0x546223.yts[0];
    const _0x4845fe = "*AUDIO* Manewbot\n\n🎼 *Titre* : " + _0x362c52.title + "\n🕐 *Durée* : " + _0x362c52.duration + "\n👁️ *Vues* : " + _0x362c52.views + "\n🔗 *Lien* : " + _0x362c52.url + "\n\n🔊 *Powered by Manewbot*";
    await _0x5b9498.sendMessage(_0x14b2f6, {
      image: {
        url: _0x362c52.thumbnail
      },
      caption: _0x4845fe
    }, {
      quoted: _0x1afb89
    });
    const _0x24b9ea = await axios.get("https://you-tube-dl-psi.vercel.app/youtube/download?url=" + encodeURIComponent(_0x546223.ytdl.download), {
      responseType: "arraybuffer"
    });
    const _0xffff67 = Buffer.from(_0x24b9ea.data);
    await _0x5b9498.sendMessage(_0x14b2f6, {
      audio: _0xffff67,
      mimetype: "audio/mpeg",
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x1afb89
    });
  } catch (_0x4595e2) {
    console.error(_0x4595e2);
    _0xf8ca04("❌ Erreur lors du téléchargement de la chanson.");
  }
});
registerCommand({
  nom_cmd: "video",
  classe: "Telechargement",
  react: "🎥",
  desc: "Télécharge une vidéo depuis YouTube avec un terme de recherche"
}, async (_0x54510e, _0x3cde84, {
  arg: _0x3fbee6,
  ms: _0x34be6c,
  repondre: _0xb5934b,
  msg_Repondu: _0x57dcf1
}) => {
  let _0x1bf504 = _0x3fbee6;
  if (!_0x1bf504.length && _0x57dcf1) {
    const _0x3dfc75 = _0x57dcf1.conversation || _0x57dcf1.extendedTextMessage?.text || "";
    if (typeof _0x3dfc75 === "string") {
      const _0x21c73f = _0x3dfc75.split(/ +/);
      const _0x42b30b = _0x21c73f.find(_0x2db7fd => _0x2db7fd.startsWith("https"));
      if (_0x42b30b) {
        _0x1bf504 = [_0x42b30b];
      }
    }
  }
  if (!_0x1bf504.length) {
    return _0xb5934b("Veuillez spécifier un titre ou un lien YouTube.");
  }
  try {
    const _0x1310cb = _0x1bf504.join(" ");
    const _0x1a11ef = await ytdl(_0x1310cb, "video");
    const _0x3f10ad = _0x1a11ef.yts[0];
    const _0xe2a55e = "*VIDÉO* Manewbot\n\n🎼 *Titre* : " + _0x3f10ad.title + "\n🕐 *Durée* : " + _0x3f10ad.duration + "\n👁️ *Vues* : " + _0x3f10ad.views + "\n🔗 *Lien* : " + _0x3f10ad.url + "\n\n🎬 *Powered by Manewbot*";
    await _0x3cde84.sendMessage(_0x54510e, {
      image: {
        url: _0x3f10ad.thumbnail
      },
      caption: _0xe2a55e
    }, {
      quoted: _0x34be6c
    });
    const _0x3f4f7c = await axios.get("https://you-tube-dl-psi.vercel.app/youtube/download?url=" + encodeURIComponent(_0x1a11ef.ytdl.download), {
      responseType: "arraybuffer"
    });
    const _0x3f1952 = Buffer.from(_0x3f4f7c.data);
    await _0x3cde84.sendMessage(_0x54510e, {
      video: _0x3f1952,
      mimetype: "video/mp4",
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x34be6c
    });
  } catch (_0x9b7045) {
    console.error(_0x9b7045);
    _0xb5934b("❌ Erreur lors du téléchargement de la vidéo.");
  }
});
registerCommand({
  nom_cmd: "yta",
  classe: "Telechargement",
  react: "🎧",
  desc: "Télécharge l'audio d'une vidéo YouTube à l'aide d'un lien",
  alias: ["ytmp3"]
}, async (_0x541a5d, _0x505d4e, {
  arg: _0x19b6e1,
  ms: _0x1db133,
  repondre: _0x21393c,
  msg_Repondu: _0x4e1c2a
}) => {
  let _0x9b20ef = _0x19b6e1;
  if (!_0x9b20ef.length && _0x4e1c2a) {
    const _0x34db27 = _0x4e1c2a.conversation || _0x4e1c2a.extendedTextMessage?.text || "";
    if (typeof _0x34db27 === "string") {
      const _0x51f720 = _0x34db27.split(/ +/);
      const _0x4b8a74 = _0x51f720.find(_0x18e8ae => _0x18e8ae.startsWith("https"));
      if (_0x4b8a74) {
        _0x9b20ef = [_0x4b8a74];
      }
    }
  }
  const _0x30b475 = _0x9b20ef.join(" ");
  if (!_0x30b475.startsWith("https://")) {
    return _0x21393c("Exemple : *yta https://youtube.com/watch?v=xyz*");
  }
  try {
    const _0xa45b54 = await ytdl(_0x30b475, "audio");
    const _0x3b5ef7 = await axios.get("https://you-tube-dl-psi.vercel.app/youtube/download?url=" + encodeURIComponent(_0xa45b54.ytdl.download), {
      responseType: "arraybuffer"
    });
    const _0x5d37c7 = Buffer.from(_0x3b5ef7.data);
    await _0x505d4e.sendMessage(_0x541a5d, {
      audio: _0x5d37c7,
      mimetype: "audio/mpeg",
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x1db133
    });
  } catch (_0x3df734) {
    console.error(_0x3df734);
    _0x21393c("Impossible de télécharger l'audio.");
  }
});
registerCommand({
  nom_cmd: "ytv",
  classe: "Telechargement",
  react: "🎬",
  desc: "Télécharge une vidéo YouTube à l'aide d'un lien",
  alias: ["ytmp4"]
}, async (_0x234b4d, _0x2df313, {
  arg: _0x57ce64,
  ms: _0x12e5c6,
  repondre: _0x427d4e,
  msg_Repondu: _0x5563fd
}) => {
  let _0x39cdcc = _0x57ce64;
  if (!_0x39cdcc.length && _0x5563fd) {
    const _0x12a4b1 = _0x5563fd.conversation || _0x5563fd.extendedTextMessage?.text || "";
    if (typeof _0x12a4b1 === "string") {
      const _0xa3217d = _0x12a4b1.split(/ +/);
      const _0x5a759f = _0xa3217d.find(_0x3d0dd1 => _0x3d0dd1.startsWith("https"));
      if (_0x5a759f) {
        _0x39cdcc = [_0x5a759f];
      }
    }
  }
  const _0x684366 = _0x39cdcc.join(" ");
  if (!_0x684366.startsWith("https://")) {
    return _0x427d4e("Exemple : *ytv https://youtube.com/watch?v=xyz*");
  }
  try {
    const _0x2a8b60 = await ytdl(_0x684366, "video");
    const _0x23d561 = await axios.get("https://you-tube-dl-psi.vercel.app/youtube/download?url=" + encodeURIComponent(_0x2a8b60.ytdl.download), {
      responseType: "arraybuffer"
    });
    const _0x1408e1 = Buffer.from(_0x23d561.data);
    await _0x2df313.sendMessage(_0x234b4d, {
      video: _0x1408e1,
      mimetype: "video/mp4",
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x12e5c6
    });
  } catch (_0x1faf4b) {
    console.error(_0x1faf4b);
    _0x427d4e("Impossible de télécharger la vidéo.");
  }
});
registerCommand({
  nom_cmd: "fbdl",
  classe: "Telechargement",
  react: "📥",
  alias: ["facebook", "facebockdl"],
  desc: "Télécharger ou envoyer directement une vidéo depuis Facebook"
}, async (_0x374754, _0x23df16, _0x412b46) => {
  let {
    arg: _0x1142ba,
    ms: _0x3e9a10,
    msg_Repondu: _0x940cc0
  } = _0x412b46;
  let _0x52b570 = _0x1142ba;
  if (!_0x52b570.length && _0x940cc0) {
    const _0x55c617 = _0x940cc0.conversation || _0x940cc0.extendedTextMessage?.text || "";
    if (typeof _0x55c617 === "string") {
      const _0x41de29 = _0x55c617.split(/ +/);
      const _0x504b56 = _0x41de29.find(_0x2b4213 => _0x2b4213.startsWith("https"));
      if (_0x504b56) {
        _0x52b570 = [_0x504b56];
      }
    }
  }
  const _0x1bdbe7 = _0x52b570.join(" ");
  if (!_0x1bdbe7) {
    return _0x23df16.sendMessage(_0x374754, {
      text: "Veuillez fournir un lien vidéo, par exemple : fbdl https://www.facebook.com/video-link"
    }, {
      quoted: _0x3e9a10
    });
  }
  try {
    const _0xd9c720 = await fbdl(_0x1bdbe7);
    const _0x1b4299 = await axios.get(_0xd9c720, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/octet-stream",
        "Content-Type": "application/octet-stream",
        "User-Agent": "GoogleBot"
      }
    });
    const _0x1fba89 = Buffer.from(_0x1b4299.data);
    return _0x23df16.sendMessage(_0x374754, {
      video: _0x1fba89,
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x3e9a10
    });
  } catch (_0x34eca2) {
    _0x23df16.sendMessage(_0x374754, {
      text: "Erreur: " + _0x34eca2.message
    }, {
      quoted: _0x3e9a10
    });
    console.error("Error:", _0x34eca2);
    return _0x23df16.sendMessage(_0x374754, {
      text: "Erreur: " + _0x34eca2.message
    }, {
      quoted: _0x3e9a10
    });
  }
});
async function extractLink(_0xeef1b5, _0x1f2b41) {
  let _0x4777e5 = _0xeef1b5;
  if (!_0x4777e5.length && _0x1f2b41) {
    const _0x3af6cc = _0x1f2b41.conversation || _0x1f2b41.extendedTextMessage?.text || "";
    if (typeof _0x3af6cc === "string") {
      const _0x10dd72 = _0x3af6cc.split(/ +/);
      const _0x18463a = _0x10dd72.find(_0x1384c7 => _0x1384c7.startsWith("https"));
      if (_0x18463a) {
        _0x4777e5 = [_0x18463a];
      }
    }
  }
  return _0x4777e5.join(" ");
}
registerCommand({
  nom_cmd: "tiktok",
  classe: "Telechargement",
  react: "📥",
  alias: ["ttdl", "tiktokdl", "ttvideo", "tiktokvideo"],
  desc: "Télécharger une vidéo TikTok sans filigrane"
}, async (_0x1d4fc9, _0x25e179, _0x4ad143) => {
  let {
    arg: _0x468e36,
    ms: _0x3ab8ee,
    msg_Repondu: _0x21d2ea
  } = _0x4ad143;
  const _0x314cfe = await extractLink(_0x468e36, _0x21d2ea);
  if (!_0x314cfe) {
    return _0x25e179.sendMessage(_0x1d4fc9, {
      text: "Lien TikTok requis."
    }, {
      quoted: _0x3ab8ee
    });
  }
  try {
    const _0x384b49 = await ttdl(_0x314cfe);
    if (!_0x384b49.noWatermark) {
      return _0x25e179.sendMessage(_0x1d4fc9, {
        text: "Vidéo non disponible."
      }, {
        quoted: _0x3ab8ee
      });
    }
    const _0x170fe1 = await axios.get(_0x384b49.noWatermark, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "GoogleBot"
      }
    });
    await _0x25e179.sendMessage(_0x1d4fc9, {
      video: Buffer.from(_0x170fe1.data),
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x3ab8ee
    });
  } catch (_0x3ac9c9) {
    _0x25e179.sendMessage(_0x1d4fc9, {
      text: "Erreur: " + _0x3ac9c9.message
    }, {
      quoted: _0x3ab8ee
    });
  }
});
registerCommand({
  nom_cmd: "tiktokaudio",
  classe: "Telechargement",
  react: "🎵",
  alias: ["ttaudio", "ttmp3"],
  desc: "Télécharger l'audio TikTok en MP3"
}, async (_0x39d19a, _0x1550ab, _0x33ed06) => {
  let {
    arg: _0x2b1cbf,
    ms: _0x13d6a1,
    msg_Repondu: _0x1882c1
  } = _0x33ed06;
  const _0x1b3888 = await extractLink(_0x2b1cbf, _0x1882c1);
  if (!_0x1b3888) {
    return _0x1550ab.sendMessage(_0x39d19a, {
      text: "Lien TikTok requis."
    }, {
      quoted: _0x13d6a1
    });
  }
  try {
    const _0x24c3a7 = await ttdl(_0x1b3888);
    if (!_0x24c3a7.mp3) {
      return _0x1550ab.sendMessage(_0x39d19a, {
        text: "Audio non disponible."
      }, {
        quoted: _0x13d6a1
      });
    }
    const _0x25d2e3 = await axios.get(_0x24c3a7.mp3, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "GoogleBot"
      }
    });
    await _0x1550ab.sendMessage(_0x39d19a, {
      audio: Buffer.from(_0x25d2e3.data),
      mimetype: "audio/mp4"
    }, {
      quoted: _0x13d6a1
    });
  } catch (_0x396cb4) {
    _0x1550ab.sendMessage(_0x39d19a, {
      text: "Erreur: " + _0x396cb4.message
    }, {
      quoted: _0x13d6a1
    });
  }
});
registerCommand({
  nom_cmd: "tiktokimage",
  classe: "Telechargement",
  react: "🖼️",
  alias: ["ttimg", "ttslides"],
  desc: "Télécharger les images (slides) TikTok"
}, async (_0x507048, _0x48d4cd, _0x8aa55c) => {
  let {
    arg: _0x5b8723,
    ms: _0x39cb03,
    msg_Repondu: _0x5b712f
  } = _0x8aa55c;
  const _0x14aff6 = await extractLink(_0x5b8723, _0x5b712f);
  if (!_0x14aff6) {
    return _0x48d4cd.sendMessage(_0x507048, {
      text: "Lien TikTok requis."
    }, {
      quoted: _0x39cb03
    });
  }
  try {
    const _0x57bd30 = await ttdl(_0x14aff6);
    if (!_0x57bd30.slides || _0x57bd30.slides.length === 0) {
      return _0x48d4cd.sendMessage(_0x507048, {
        text: "Aucune image trouvée."
      }, {
        quoted: _0x39cb03
      });
    }
    for (const _0xef4c7d of _0x57bd30.slides) {
      const _0x1dad08 = await axios.get(_0xef4c7d, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "GoogleBot"
        }
      });
      await _0x48d4cd.sendMessage(_0x507048, {
        image: Buffer.from(_0x1dad08.data)
      }, {
        quoted: _0x39cb03
      });
    }
  } catch (_0x595bc5) {
    _0x48d4cd.sendMessage(_0x507048, {
      text: "Erreur: " + _0x595bc5.message
    }, {
      quoted: _0x39cb03
    });
  }
});
registerCommand({
  nom_cmd: "igdl",
  classe: "Telechargement",
  react: "📥",
  alias: ["insta", "instadl", "instagram", "instagramdl"],
  desc: "Télécharger ou envoyer directement une vidéo depuis Instagram"
}, async (_0x41f91f, _0x2cc787, _0x4553f3) => {
  let {
    arg: _0x3c16c7,
    ms: _0x473f86,
    msg_Repondu: _0x4881e4
  } = _0x4553f3;
  let _0x26445b = _0x3c16c7;
  if (!_0x26445b.length && _0x4881e4) {
    const _0x25355a = _0x4881e4.conversation || _0x4881e4.extendedTextMessage?.text || "";
    if (typeof _0x25355a === "string") {
      const _0x43ae30 = _0x25355a.split(/ +/);
      const _0x44193e = _0x43ae30.find(_0x48d901 => _0x48d901.startsWith("https"));
      if (_0x44193e) {
        _0x26445b = [_0x44193e];
      }
    }
  }
  const _0x19cbcf = _0x26445b.join(" ");
  if (!_0x19cbcf) {
    return _0x2cc787.sendMessage(_0x41f91f, {
      text: "Veuillez fournir un lien vidéo Instagram, par exemple : igdl https://www.instagram.com/reel/..."
    }, {
      quoted: _0x473f86
    });
  }
  try {
    const _0x1d63f2 = await igdl(_0x19cbcf);
    const _0x34fdb7 = await axios.get(_0x1d63f2.result.video, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/octet-stream",
        "Content-Type": "application/octet-stream",
        "User-Agent": "GoogleBot"
      }
    });
    return _0x2cc787.sendMessage(_0x41f91f, {
      video: Buffer.from(_0x34fdb7.data),
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x473f86
    });
  } catch (_0x52a5ce) {
    _0x2cc787.sendMessage(_0x41f91f, {
      text: "Erreur: " + _0x52a5ce.message
    }, {
      quoted: _0x473f86
    });
    console.error("Error:", _0x52a5ce);
  }
});
registerCommand({
  nom_cmd: "twitterdl",
  classe: "Telechargement",
  react: "📥",
  alias: ["twitter", "twitdl"],
  desc: "Télécharger ou envoyer directement une vidéo depuis Twitter"
}, async (_0xe2f446, _0x3e377b, _0x1f388f) => {
  let {
    arg: _0x2d3fb9,
    ms: _0x4cf33c,
    msg_Repondu: _0x522907
  } = _0x1f388f;
  let _0x5ae1c2 = _0x2d3fb9;
  if (!_0x5ae1c2.length && _0x522907) {
    const _0x46b712 = _0x522907.conversation || _0x522907.extendedTextMessage?.text || "";
    if (typeof _0x46b712 === "string") {
      const _0x3331b6 = _0x46b712.split(/ +/);
      const _0x59271c = _0x3331b6.find(_0x1fd14b => _0x1fd14b.startsWith("https"));
      if (_0x59271c) {
        _0x5ae1c2 = [_0x59271c];
      }
    }
  }
  const _0x39a004 = _0x5ae1c2.join(" ");
  if (!_0x39a004) {
    return _0x3e377b.sendMessage(_0xe2f446, {
      text: "Veuillez fournir un lien vidéo Twitter, par exemple : twitterdl https://twitter.com/..."
    }, {
      quoted: _0x4cf33c
    });
  }
  try {
    const _0x59aa2c = await twitterdl(_0x39a004);
    const _0xad9a14 = await axios.get(_0x59aa2c.result.video, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/octet-stream",
        "Content-Type": "application/octet-stream",
        "User-Agent": "GoogleBot"
      }
    });
    return _0x3e377b.sendMessage(_0xe2f446, {
      video: Buffer.from(_0xad9a14.data),
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x4cf33c
    });
  } catch (_0x380ec0) {
    _0x3e377b.sendMessage(_0xe2f446, {
      text: "Erreur: " + _0x380ec0.message
    }, {
      quoted: _0x4cf33c
    });
    console.error("Error:", _0x380ec0);
  }
});
registerCommand({
  nom_cmd: "app",
  classe: "Telechargement",
  react: "📥",
  desc: "Télécharger une application depuis Aptoide"
}, async (_0x48eca3, _0x286b6e, _0x1eba9f) => {
  const {
    repondre: _0x4ac53d,
    arg: _0x8a66ee,
    ms: _0x210ca7
  } = _0x1eba9f;
  try {
    const _0x1c8b81 = _0x8a66ee.join(" ");
    if (!_0x1c8b81) {
      return _0x4ac53d("*Entrer le nom de l'application à rechercher*");
    }
    const _0x50de37 = await apkdl(_0x1c8b81, 1);
    if (_0x50de37.length === 0) {
      return _0x4ac53d("*Application non existante, veuillez entrer un autre nom*");
    }
    const _0x8689e3 = _0x50de37[0];
    const _0x1bc8b3 = parseFloat(_0x8689e3.size);
    if (isNaN(_0x1bc8b3)) {
      return _0x4ac53d("*Erreur dans la taille du fichier*");
    }
    if (_0x1bc8b3 > 300) {
      return _0x4ac53d("Le fichier dépasse 300 Mo, impossible de le télécharger.");
    }
    const _0x22426b = _0x8689e3.dllink;
    const _0x5bb405 = "『 *ᴏᴠʟ-ᴍᴅ-ᴠ𝟸 ᴀᴘᴋ-ᴅʟ* 』\n\n*📱ɴᴏᴍ :* " + _0x8689e3.name + "\n*🆔ɪᴅ :* " + _0x8689e3.package + "\n*📅ᴍɪsᴇ ᴀ̀ ᴊᴏᴜʀ:* " + _0x8689e3.lastup + "\n*📦ᴛᴀɪʟʟᴇ :* " + _0x8689e3.size + " MB\n";
    const _0xcce1c4 = (_0x8689e3?.name || "Downloader") + ".apk";
    const _0x3a46c3 = _0xcce1c4;
    const _0x2f4d1e = await axios.get(_0x22426b, {
      responseType: "stream"
    });
    const _0x28955b = fs.createWriteStream(_0x3a46c3);
    _0x2f4d1e.data.pipe(_0x28955b);
    await new Promise((_0x35ef63, _0x4ac09d) => {
      _0x28955b.on("finish", _0x35ef63);
      _0x28955b.on("error", _0x4ac09d);
    });
    const _0x2d3f7d = {
      document: fs.readFileSync(_0x3a46c3),
      mimetype: "application/vnd.android.package-archive",
      fileName: _0xcce1c4
    };
    await _0x286b6e.sendMessage(_0x48eca3, {
      image: {
        url: _0x8689e3.icon
      },
      caption: _0x5bb405
    }, {
      quoted: _0x210ca7
    });
    await _0x286b6e.sendMessage(_0x48eca3, _0x2d3f7d, {
      quoted: _0x210ca7
    });
    fs.unlinkSync(_0x3a46c3);
  } catch (_0x1c02b4) {
    console.error("Erreur lors du traitement de la commande apk:", _0x1c02b4);
    _0x4ac53d("*Erreur lors du traitement de la commande apk*");
  }
});