'use strict';

const { registerCommand } = require('../register');
const { fs, path, os, spawn, fusionCache } = require('../media');
const { probeMediaDuration } = require('../../../lib/ffmpeg');

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
