'use strict';

const { registerCommand } = require('../register');
const { fs, path, os, spawn, fusionCache } = require('../media');
const { probeMediaDuration } = require('../../../lib/ffmpeg');

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
