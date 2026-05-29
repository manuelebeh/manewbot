'use strict';

const {
  registerCommand,
  config,
  buildYoutubeDownloadUrl,
  serviceNotConfiguredMessage,
  ytdl,
  axios,
  resolveArgsWithLink,
} = require('./_shared');

async function fetchYoutubeMedia(repondre, downloadPath) {
  const mediaUrl = buildYoutubeDownloadUrl(config, downloadPath);
  if (!mediaUrl) {
    await repondre(serviceNotConfiguredMessage('YOUTUBE_DL_API_BASE'));
    return null;
  }
  const response = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
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
    const audioBuffer = await fetchYoutubeMedia(repondre, downloadResult.ytdl.download);
    if (!audioBuffer) return;
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
    const videoBuffer = await fetchYoutubeMedia(repondre, downloadResult.ytdl.download);
    if (!videoBuffer) return;
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
    const audioBuffer = await fetchYoutubeMedia(repondre, downloadResult.ytdl.download);
    if (!audioBuffer) return;
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
    const videoBuffer = await fetchYoutubeMedia(repondre, downloadResult.ytdl.download);
    if (!videoBuffer) return;
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
