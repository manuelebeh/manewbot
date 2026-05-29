'use strict';

const { registerCommand } = require('./register');
const { igdl, twitterdl, axios, resolveArgsWithLink } = require('./deps');

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
