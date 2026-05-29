'use strict';

const { registerCommand } = require('../register');
const { fs, path, os, spawn, fusionCache } = require('../media');
const { probeMediaDuration } = require('../../../lib/ffmpeg');

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
