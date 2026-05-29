'use strict';

const { registerCommand } = require('./register');
const { config, ytdl, fs, acr } = require('./deps');

registerCommand({
  nom_cmd: "shazam",
  classe: "Search",
  react: "🎵",
  desc: "Identifier une musique depuis un audio/vidéo",
  alias: []
}, async (jid, bot, {
  msg_Repondu,
  ms,
  repondre
}) => {
  let mediaMessage = null;
  if (msg_Repondu?.audioMessage) {
    mediaMessage = msg_Repondu.audioMessage;
  } else if (msg_Repondu?.videoMessage) {
    mediaMessage = msg_Repondu.videoMessage;
  } else if (ms.message?.videoMessage) {
    mediaMessage = ms.message.videoMessage;
  }
  if (!mediaMessage) {
    return repondre("Répondez à un audio ou une courte vidéo");
  }
  if (!acr) {
    return repondre("Shazam non configuré (ACRCLOUD_ACCESS_KEY / ACRCLOUD_ACCESS_SECRET).");
  }
  try {
    const filePath = await bot.dl_save_media_ms(mediaMessage);
    let audioBuffer = fs.readFileSync(filePath);
    const maxSize = 1048576;
    if (audioBuffer.length > maxSize) {
      audioBuffer = audioBuffer.slice(0, maxSize);
    }
    const identifyResult = await acr.identify(audioBuffer);
    if (identifyResult.status.code !== 0 || !identifyResult.metadata?.music?.length) {
      return repondre("Impossible d’identifier la musique.");
    }
    const track = identifyResult.metadata.music[0];
    const title = track.title || "Inconnu";
    const artists = track.artists?.map(artist => artist.name).join(", ") || "Inconnu";
    const album = track.album?.name || "Inconnu";
    const genres = track.genres?.map(genre => genre.name).join(", ") || "N/A";
    const releaseDate = track.release_date || "N/A";
    const ytResult = await ytdl(title + " " + artists, "audio");
    const youtubeUrl = ytResult.yts[0].url || "Aucun lien trouvé";
    const message = "╭━━〔 🎧 *Manewbot • SHAZAM* 〕━━╮\n\n🎵 *Titre* : " + title + "\n👤 *Artiste* : " + artists + "\n💿 *Album* : " + album + "\n🎼 *Genre* : " + genres + "\n📅 *Sortie* : " + releaseDate + "\n\n🌐 *YouTube* :\n" + youtubeUrl + "\n\n╰━━━━━━━━━━━━━━━━━━╯";
    await bot.sendMessage(jid, {
      text: message
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur Shazam :", err);
    repondre("Échec de la reconnaissance.");
  }
});

