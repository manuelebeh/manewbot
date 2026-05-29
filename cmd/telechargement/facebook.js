'use strict';

const {
  registerCommand,
  fbdl,
  axios,
  resolveArgsWithLink,
} = require('./_shared');

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
