'use strict';

const {
  registerCommand,
  ttdl,
  axios,
  extractLink,
} = require('./_shared');

registerCommand({
  nom_cmd: "tiktok",
  classe: "Telechargement",
  react: "📥",
  alias: ["ttdl", "tiktokdl", "ttvideo", "tiktokvideo"],
  desc: "Télécharger une vidéo TikTok sans filigrane"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    msg_Repondu
  } = ctx;
  const tiktokUrl = await extractLink(arg, msg_Repondu);
  if (!tiktokUrl) {
    return sock.sendMessage(chatJid, {
      text: "Lien TikTok requis."
    }, {
      quoted: ms
    });
  }
  try {
    const downloadResult = await ttdl(tiktokUrl);
    if (!downloadResult.noWatermark) {
      return sock.sendMessage(chatJid, {
        text: "Vidéo non disponible."
      }, {
        quoted: ms
      });
    }
    const videoResponse = await axios.get(downloadResult.noWatermark, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "GoogleBot"
      }
    });
    await sock.sendMessage(chatJid, {
      video: Buffer.from(videoResponse.data),
      caption: "```Powered by Manewbot```"
    }, {
      quoted: ms
    });
  } catch (err) {
    sock.sendMessage(chatJid, {
      text: "Erreur: " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "tiktokaudio",
  classe: "Telechargement",
  react: "🎵",
  alias: ["ttaudio", "ttmp3"],
  desc: "Télécharger l'audio TikTok en MP3"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    msg_Repondu
  } = ctx;
  const tiktokUrl = await extractLink(arg, msg_Repondu);
  if (!tiktokUrl) {
    return sock.sendMessage(chatJid, {
      text: "Lien TikTok requis."
    }, {
      quoted: ms
    });
  }
  try {
    const downloadResult = await ttdl(tiktokUrl);
    if (!downloadResult.mp3) {
      return sock.sendMessage(chatJid, {
        text: "Audio non disponible."
      }, {
        quoted: ms
      });
    }
    const audioResponse = await axios.get(downloadResult.mp3, {
      responseType: "arraybuffer",
      headers: {
        "User-Agent": "GoogleBot"
      }
    });
    await sock.sendMessage(chatJid, {
      audio: Buffer.from(audioResponse.data),
      mimetype: "audio/mp4"
    }, {
      quoted: ms
    });
  } catch (err) {
    sock.sendMessage(chatJid, {
      text: "Erreur: " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "tiktokimage",
  classe: "Telechargement",
  react: "🖼️",
  alias: ["ttimg", "ttslides"],
  desc: "Télécharger les images (slides) TikTok"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    msg_Repondu
  } = ctx;
  const tiktokUrl = await extractLink(arg, msg_Repondu);
  if (!tiktokUrl) {
    return sock.sendMessage(chatJid, {
      text: "Lien TikTok requis."
    }, {
      quoted: ms
    });
  }
  try {
    const downloadResult = await ttdl(tiktokUrl);
    if (!downloadResult.slides || downloadResult.slides.length === 0) {
      return sock.sendMessage(chatJid, {
        text: "Aucune image trouvée."
      }, {
        quoted: ms
      });
    }
    for (const slideUrl of downloadResult.slides) {
      const imageResponse = await axios.get(slideUrl, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent": "GoogleBot"
        }
      });
      await sock.sendMessage(chatJid, {
        image: Buffer.from(imageResponse.data)
      }, {
        quoted: ms
      });
    }
  } catch (err) {
    sock.sendMessage(chatJid, {
      text: "Erreur: " + err.message
    }, {
      quoted: ms
    });
  }
});
