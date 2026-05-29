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

function resolveArgsWithLink(arg, msg_Repondu) {
  let commandArgs = arg;
  if (!commandArgs.length && msg_Repondu) {
    const repliedText = msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text || "";
    if (typeof repliedText === "string") {
      const words = repliedText.split(/ +/);
      const urlToken = words.find(word => word.startsWith("https"));
      if (urlToken) {
        commandArgs = [urlToken];
      }
    }
  }
  return commandArgs;
}

async function extractLink(arg, msg_Repondu) {
  const commandArgs = resolveArgsWithLink(arg, msg_Repondu);
  return commandArgs.join(" ");
}

registerCommand({
  nom_cmd: "song",
  classe: "Telechargement",
  react: "🎵",
  desc: "Télécharge une chanson depuis YouTube avec un terme de recherche",
  alias: ["play"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre,
    msg_Repondu
  } = ctx;
  const commandArgs = resolveArgsWithLink(arg, msg_Repondu);
  if (!commandArgs.length) {
    return repondre("Veuillez spécifier un titre ou un lien YouTube.");
  }
  try {
    const query = commandArgs.join(" ");
    const downloadResult = await ytdl(query, "audio");
    const trackInfo = downloadResult.yts[0];
    const infoCaption = "*AUDIO* Manewbot\n\n🎼 *Titre* : " + trackInfo.title + "\n🕐 *Durée* : " + trackInfo.duration + "\n👁️ *Vues* : " + trackInfo.views + "\n🔗 *Lien* : " + trackInfo.url + "\n\n🔊 *Powered by Manewbot*";
    await sock.sendMessage(chatJid, {
      image: {
        url: trackInfo.thumbnail
      },
      caption: infoCaption
    }, {
      quoted: ms
    });
    const audioResponse = await axios.get("https://you-tube-dl-psi.vercel.app/youtube/download?url=" + encodeURIComponent(downloadResult.ytdl.download), {
      responseType: "arraybuffer"
    });
    const audioBuffer = Buffer.from(audioResponse.data);
    await sock.sendMessage(chatJid, {
      audio: audioBuffer,
      mimetype: "audio/mpeg",
      caption: "```Powered by Manewbot```"
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error(err);
    repondre("❌ Erreur lors du téléchargement de la chanson.");
  }
});
registerCommand({
  nom_cmd: "video",
  classe: "Telechargement",
  react: "🎥",
  desc: "Télécharge une vidéo depuis YouTube avec un terme de recherche"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre,
    msg_Repondu
  } = ctx;
  const commandArgs = resolveArgsWithLink(arg, msg_Repondu);
  if (!commandArgs.length) {
    return repondre("Veuillez spécifier un titre ou un lien YouTube.");
  }
  try {
    const query = commandArgs.join(" ");
    const downloadResult = await ytdl(query, "video");
    const trackInfo = downloadResult.yts[0];
    const infoCaption = "*VIDÉO* Manewbot\n\n🎼 *Titre* : " + trackInfo.title + "\n🕐 *Durée* : " + trackInfo.duration + "\n👁️ *Vues* : " + trackInfo.views + "\n🔗 *Lien* : " + trackInfo.url + "\n\n🎬 *Powered by Manewbot*";
    await sock.sendMessage(chatJid, {
      image: {
        url: trackInfo.thumbnail
      },
      caption: infoCaption
    }, {
      quoted: ms
    });
    const videoResponse = await axios.get("https://you-tube-dl-psi.vercel.app/youtube/download?url=" + encodeURIComponent(downloadResult.ytdl.download), {
      responseType: "arraybuffer"
    });
    const videoBuffer = Buffer.from(videoResponse.data);
    await sock.sendMessage(chatJid, {
      video: videoBuffer,
      mimetype: "video/mp4",
      caption: "```Powered by Manewbot```"
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error(err);
    repondre("❌ Erreur lors du téléchargement de la vidéo.");
  }
});
registerCommand({
  nom_cmd: "yta",
  classe: "Telechargement",
  react: "🎧",
  desc: "Télécharge l'audio d'une vidéo YouTube à l'aide d'un lien",
  alias: ["ytmp3"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre,
    msg_Repondu
  } = ctx;
  const commandArgs = resolveArgsWithLink(arg, msg_Repondu);
  const youtubeUrl = commandArgs.join(" ");
  if (!youtubeUrl.startsWith("https://")) {
    return repondre("Exemple : *yta https://youtube.com/watch?v=xyz*");
  }
  try {
    const downloadResult = await ytdl(youtubeUrl, "audio");
    const audioResponse = await axios.get("https://you-tube-dl-psi.vercel.app/youtube/download?url=" + encodeURIComponent(downloadResult.ytdl.download), {
      responseType: "arraybuffer"
    });
    const audioBuffer = Buffer.from(audioResponse.data);
    await sock.sendMessage(chatJid, {
      audio: audioBuffer,
      mimetype: "audio/mpeg",
      caption: "```Powered by Manewbot```"
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error(err);
    repondre("Impossible de télécharger l'audio.");
  }
});
registerCommand({
  nom_cmd: "ytv",
  classe: "Telechargement",
  react: "🎬",
  desc: "Télécharge une vidéo YouTube à l'aide d'un lien",
  alias: ["ytmp4"]
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre,
    msg_Repondu
  } = ctx;
  const commandArgs = resolveArgsWithLink(arg, msg_Repondu);
  const youtubeUrl = commandArgs.join(" ");
  if (!youtubeUrl.startsWith("https://")) {
    return repondre("Exemple : *ytv https://youtube.com/watch?v=xyz*");
  }
  try {
    const downloadResult = await ytdl(youtubeUrl, "video");
    const videoResponse = await axios.get("https://you-tube-dl-psi.vercel.app/youtube/download?url=" + encodeURIComponent(downloadResult.ytdl.download), {
      responseType: "arraybuffer"
    });
    const videoBuffer = Buffer.from(videoResponse.data);
    await sock.sendMessage(chatJid, {
      video: videoBuffer,
      mimetype: "video/mp4",
      caption: "```Powered by Manewbot```"
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error(err);
    repondre("Impossible de télécharger la vidéo.");
  }
});
registerCommand({
  nom_cmd: "fbdl",
  classe: "Telechargement",
  react: "📥",
  alias: ["facebook", "facebockdl"],
  desc: "Télécharger ou envoyer directement une vidéo depuis Facebook"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    msg_Repondu
  } = ctx;
  const commandArgs = resolveArgsWithLink(arg, msg_Repondu);
  const facebookUrl = commandArgs.join(" ");
  if (!facebookUrl) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez fournir un lien vidéo, par exemple : fbdl https://www.facebook.com/video-link"
    }, {
      quoted: ms
    });
  }
  try {
    const downloadUrl = await fbdl(facebookUrl);
    const videoResponse = await axios.get(downloadUrl, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/octet-stream",
        "Content-Type": "application/octet-stream",
        "User-Agent": "GoogleBot"
      }
    });
    const videoBuffer = Buffer.from(videoResponse.data);
    return sock.sendMessage(chatJid, {
      video: videoBuffer,
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
    console.error("Error:", err);
    return sock.sendMessage(chatJid, {
      text: "Erreur: " + err.message
    }, {
      quoted: ms
    });
  }
});
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
registerCommand({
  nom_cmd: "igdl",
  classe: "Telechargement",
  react: "📥",
  alias: ["insta", "instadl", "instagram", "instagramdl"],
  desc: "Télécharger ou envoyer directement une vidéo depuis Instagram"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    msg_Repondu
  } = ctx;
  const commandArgs = resolveArgsWithLink(arg, msg_Repondu);
  const instagramUrl = commandArgs.join(" ");
  if (!instagramUrl) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez fournir un lien vidéo Instagram, par exemple : igdl https://www.instagram.com/reel/..."
    }, {
      quoted: ms
    });
  }
  try {
    const downloadResult = await igdl(instagramUrl);
    const videoResponse = await axios.get(downloadResult.result.video, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/octet-stream",
        "Content-Type": "application/octet-stream",
        "User-Agent": "GoogleBot"
      }
    });
    return sock.sendMessage(chatJid, {
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
    console.error("Error:", err);
  }
});
registerCommand({
  nom_cmd: "twitterdl",
  classe: "Telechargement",
  react: "📥",
  alias: ["twitter", "twitdl"],
  desc: "Télécharger ou envoyer directement une vidéo depuis Twitter"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    msg_Repondu
  } = ctx;
  const commandArgs = resolveArgsWithLink(arg, msg_Repondu);
  const twitterUrl = commandArgs.join(" ");
  if (!twitterUrl) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez fournir un lien vidéo Twitter, par exemple : twitterdl https://twitter.com/..."
    }, {
      quoted: ms
    });
  }
  try {
    const downloadResult = await twitterdl(twitterUrl);
    const videoResponse = await axios.get(downloadResult.result.video, {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/octet-stream",
        "Content-Type": "application/octet-stream",
        "User-Agent": "GoogleBot"
      }
    });
    return sock.sendMessage(chatJid, {
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
    console.error("Error:", err);
  }
});
registerCommand({
  nom_cmd: "app",
  classe: "Telechargement",
  react: "📥",
  desc: "Télécharger une application depuis Aptoide"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    ms
  } = ctx;
  try {
    const appQuery = arg.join(" ");
    if (!appQuery) {
      return repondre("*Entrer le nom de l'application à rechercher*");
    }
    const searchResults = await apkdl(appQuery, 1);
    if (searchResults.length === 0) {
      return repondre("*Application non existante, veuillez entrer un autre nom*");
    }
    const appInfo = searchResults[0];
    const fileSizeMb = parseFloat(appInfo.size);
    if (isNaN(fileSizeMb)) {
      return repondre("*Erreur dans la taille du fichier*");
    }
    if (fileSizeMb > 300) {
      return repondre("Le fichier dépasse 300 Mo, impossible de le télécharger.");
    }
    const downloadUrl = appInfo.dllink;
    const infoCaption = "『 *ᴏᴠʟ-ᴍᴅ-ᴠ𝟸 ᴀᴘᴋ-ᴅʟ* 』\n\n*📱ɴᴏᴍ :* " + appInfo.name + "\n*🆔ɪᴅ :* " + appInfo.package + "\n*📅ᴍɪsᴇ ᴀ̀ ᴊᴏᴜʀ:* " + appInfo.lastup + "\n*📦ᴛᴀɪʟʟᴇ :* " + appInfo.size + " MB\n";
    const apkFileName = (appInfo?.name || "Downloader") + ".apk";
    const apkFilePath = apkFileName;
    const downloadResponse = await axios.get(downloadUrl, {
      responseType: "stream"
    });
    const writeStream = fs.createWriteStream(apkFilePath);
    downloadResponse.data.pipe(writeStream);
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    const documentMessage = {
      document: fs.readFileSync(apkFilePath),
      mimetype: "application/vnd.android.package-archive",
      fileName: apkFileName
    };
    await sock.sendMessage(chatJid, {
      image: {
        url: appInfo.icon
      },
      caption: infoCaption
    }, {
      quoted: ms
    });
    await sock.sendMessage(chatJid, documentMessage, {
      quoted: ms
    });
    fs.unlinkSync(apkFilePath);
  } catch (err) {
    console.error("Erreur lors du traitement de la commande apk:", err);
    repondre("*Erreur lors du traitement de la commande apk*");
  }
});
