'use strict';

const {
  registerCommand,
  fs,
  path,
  os,
  axios,
  FormData,
  readFileSync,
  config,
  Sticker,
  StickerTypes,
  spawn,
  gTTS,
  sharp,
  Ranks,
  uploadToCatbox,
  alea,
  isSupportedFile,
  fusionCache,
  remini,
  convertWebpToMp4,
} = require('./_shared');
const {
  probeMediaDuration
} = require('../../lib/ffmpeg');

registerCommand({
  nom_cmd: "toaudio",
  classe: "Conversion",
  react: "🎧",
  desc: "Convertit une vidéo en audio"
}, async (chatJid, sock, ctx) => {
  const {
  msg_Repondu,
  ms
} = ctx;
  if (!msg_Repondu || !msg_Repondu.videoMessage) {
    return sock.sendMessage(chatJid, {
      text: "❌ Répondez à une *vidéo*."
    }, {
      quoted: ms
    });
  }
  try {
    const mediaPath = await sock.dl_save_media_ms(msg_Repondu.videoMessage);
    const outputPath = path.join(os.tmpdir(), "aud_" + Date.now() + ".mp3");
    await new Promise((resolve, reject) => {
      const ffmpegProcess = spawn("ffmpeg", ["-i", mediaPath, "-vn", "-acodec", "libmp3lame", "-q:a", "4", outputPath]);
      ffmpegProcess.stderr.on("data", () => {});
      ffmpegProcess.on("close", code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error("ffmpeg exited with code " + code));
        }
      });
    });
    await sock.sendMessage(chatJid, {
      audio: fs.readFileSync(outputPath),
      mimetype: "audio/mpeg"
    }, {
      quoted: ms
    });
    fs.unlinkSync(mediaPath);
    fs.unlinkSync(outputPath);
  } catch (err) {
    await sock.sendMessage(chatJid, {
      text: "❌ Erreur de conversion : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "tovideo",
  classe: "Conversion",
  react: "🎬",
  desc: "Convertit un audio en vidéo animée"
}, async (chatJid, sock, ctx) => {
  const {
  msg_Repondu,
  ms
} = ctx;
  if (!msg_Repondu || !msg_Repondu.audioMessage) {
    return sock.sendMessage(chatJid, {
      text: "❌ Répondez à un *audio*."
    }, {
      quoted: ms
    });
  }
  try {
    const mediaPath = await sock.dl_save_media_ms(msg_Repondu.audioMessage);
    const duration = await probeMediaDuration(mediaPath);
    const baseName = path.basename(mediaPath, path.extname(mediaPath));
    const dirName = path.dirname(mediaPath);
    const outputPath = path.join(dirName, baseName + ".mp4");
    await new Promise((resolve, reject) => {
      const ffmpegProcess = spawn("ffmpeg", ["-y", "-i", mediaPath, "-f", "lavfi", "-i", "color=c=black:s=640x360:d=" + duration, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", outputPath]);
      ffmpegProcess.stderr.on("data", () => {});
      ffmpegProcess.on("close", code => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error("ffmpeg exited with code " + code));
        }
      });
    });
    await sock.sendMessage(chatJid, {
      video: fs.readFileSync(outputPath)
    }, {
      quoted: ms
    });
    fs.unlinkSync(mediaPath);
    fs.unlinkSync(outputPath);
  } catch (err) {
    await sock.sendMessage(chatJid, {
      text: "❌ Erreur de conversion en vidéo : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "fusion",
  classe: "Conversion",
  react: "🎬",
  desc: "Fusionne un audio et une vidéo"
}, async (chatJid, sock, ctx) => {
  const {
  msg_Repondu,
  ms,
  auteur_Message,
  arg
} = ctx;
  const senderKey = auteur_Message;
  fusionCache[senderKey] = fusionCache[senderKey] || {};
  if (arg[0]?.toLowerCase() === "result") {
    if (!fusionCache[senderKey].audioPath || !fusionCache[senderKey].videoPath) {
      return sock.sendMessage(chatJid, {
        text: "❌ Audio ou vidéo manquant."
      }, {
        quoted: ms
      });
    }
    const {
      audioPath: audioPath,
      videoPath: videoPath
    } = fusionCache[senderKey];
    const outputPath = path.join(path.dirname(videoPath), "fusion_" + Date.now() + ".mp4");
    try {
      await new Promise((resolve, reject) => {
        const ffmpegProcess = spawn("ffmpeg", ["-y", "-i", videoPath, "-i", audioPath, "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", outputPath]);
        ffmpegProcess.on("close", code => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error("ffmpeg " + code));
          }
        });
      });
      await sock.sendMessage(chatJid, {
        video: fs.readFileSync(outputPath)
      }, {
        quoted: ms
      });
      fs.unlinkSync(audioPath);
      fs.unlinkSync(videoPath);
      fs.unlinkSync(outputPath);
      delete fusionCache[senderKey];
      return;
    } catch (err) {
      return sock.sendMessage(chatJid, {
        text: "❌ Erreur lors de la fusion."
      }, {
        quoted: ms
      });
    }
  }
  if (msg_Repondu?.audioMessage) {
    if (fusionCache[senderKey].audioPath) {
      return sock.sendMessage(chatJid, {
        text: "⚠️ Audio déjà enregistré. Envoyez une vidéo ou tapez *fusion result*."
      }, {
        quoted: ms
      });
    }
    const audioPath = await sock.dl_save_media_ms(msg_Repondu.audioMessage);
    fusionCache[senderKey].audioPath = audioPath;
    if (fusionCache[senderKey].videoPath) {
      return sock.sendMessage(chatJid, {
        text: "✅ Audio ajouté. Tapez *fusion result* pour obtenir la vidéo."
      }, {
        quoted: ms
      });
    }
    return sock.sendMessage(chatJid, {
      text: "✅ Audio enregistré. Répondez maintenant à une vidéo."
    }, {
      quoted: ms
    });
  }
  if (msg_Repondu?.videoMessage) {
    if (fusionCache[senderKey].videoPath) {
      return sock.sendMessage(chatJid, {
        text: "⚠️ Vidéo déjà enregistrée. Envoyez un audio ou tapez *fusion result*."
      }, {
        quoted: ms
      });
    }
    const videoPath = await sock.dl_save_media_ms(msg_Repondu.videoMessage);
    fusionCache[senderKey].videoPath = videoPath;
    if (fusionCache[senderKey].audioPath) {
      return sock.sendMessage(chatJid, {
        text: "✅ Vidéo ajoutée. Tapez *fusion result* pour obtenir le résultat."
      }, {
        quoted: ms
      });
    }
    return sock.sendMessage(chatJid, {
      text: "✅ Vidéo enregistrée. Répondez maintenant à un audio."
    }, {
      quoted: ms
    });
  }
  return sock.sendMessage(chatJid, {
    text: "❌ Répondez à un *audio* ou une *vidéo*."
  }, {
    quoted: ms
  });
});
