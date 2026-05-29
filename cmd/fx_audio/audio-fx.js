'use strict';

const fs = require('fs');
const { registerCommand } = require('../../lib/commands');
const { runFfmpeg } = require('../../lib/ffmpeg');

function addAudioEffectCommand(commandName, ffmpegArgs) {
  registerCommand({
    nom_cmd: commandName,
    classe: "FX_Audio",
    react: "🎶",
    desc: "Applique l'effet \"" + commandName + "\" à un audio."
  }, async (jid, bot, {
    ms,
    msg_Repondu,
    repondre
  }) => {
    if (!msg_Repondu?.audioMessage) {
      return repondre("Réponds à un message audio*");
    }
    const inputPath = await bot.dl_save_media_ms(msg_Repondu.audioMessage);
    const outputPath = "output_" + Date.now() + ".mp3";
    try {
      await runFfmpeg(inputPath, ffmpegArgs, outputPath);
      const audioBuffer = fs.readFileSync(outputPath);
      await bot.sendMessage(jid, {
        audio: audioBuffer,
        mimetype: "audio/mpeg"
      }, {
        quoted: ms
      });
    } catch (err) {
      console.error("Erreur AudioFX :", err);
      repondre("Erreur FFmpeg : " + err.message);
    } finally {
      try {
        fs.unlinkSync(inputPath);
      } catch (_) {}
      try {
        fs.unlinkSync(outputPath);
      } catch (_) {}
    }
  });
}

module.exports = { registerCommand, fs, runFfmpeg, addAudioEffectCommand };
