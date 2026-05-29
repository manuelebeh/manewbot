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
  execSync,
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

registerCommand({
  nom_cmd: "tts",
  classe: "Conversion",
  react: "🔊",
  desc: "Convertit un texte en parole et renvoie l'audio."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    prefixe,
    ms
  } = ctx;
  if (!arg[0]) {
    return sock.sendMessage(chatJid, {
      text: "Entrez un texte à lire."
    }, {
      quoted: ms
    });
  }
  let lang = "fr";
  let speechText = arg.join(" ");
  if (arg[0].length === 2) {
    lang = arg[0];
    speechText = arg.slice(1).join(" ");
  }
  try {
    const tts = new gTTS(speechText, lang);
    const outputPath = path.join(__dirname, "output.mp3");
    tts.save(outputPath, function (err) {
      if (err) {
        return sock.sendMessage(chatJid, {
          text: "Une erreur est survenue lors de la conversion en audio. Veuillez réessayer plus tard."
        }, {
          quoted: ms
        });
      }
      const audioBuffer = fs.readFileSync(outputPath);
      const audioMessage = {
        audio: audioBuffer,
        mimetype: "audio/mpeg",
        caption: "```Powered by Manewbot```"
      };
      sock.sendMessage(chatJid, audioMessage, {
        quoted: ms
      }).then(() => {
        fs.unlinkSync(outputPath);
      });
    });
  } catch (err) {
    return sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de la conversion en audio. Veuillez réessayer plus tard."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "attp",
  classe: "Conversion",
  react: "📥",
  desc: "Transforme du texte en sticker animé"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    nom_Auteur_Message,
    ms
  } = ctx;
  if (!arg[0]) {
    return repondre("Veuillez fournir du texte");
  }
  const text2 = arg.join(" ");
  try {
    const response2 = await axios.get("https://api-ovl.koyeb.app/attp?texte=" + encodeURIComponent(text2), {
      responseType: "arraybuffer"
    });
    const outputBuffer2 = await new Sticker(response2.data, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: 90,
      background: "transparent"
    }).toBuffer();
    await sock.sendMessage(chatJid, {
      sticker: outputBuffer2
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error(err);
    repondre("❌ Une erreur est survenue lors de la génération du sticker animé.");
  }
});
registerCommand({
  nom_cmd: "ttp",
  classe: "Conversion",
  react: "📥",
  desc: "Transforme du texte en sticker"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre,
    nom_Auteur_Message,
    ms
  } = ctx;
  if (!arg[0]) {
    return repondre("Veuillez fournir du texte");
  }
  const text2 = arg.join(" ");
  try {
    const response2 = await axios.get("https://api-ovl.koyeb.app/ttp?texte=" + encodeURIComponent(text2), {
      responseType: "arraybuffer"
    });
    const outputBuffer2 = await new Sticker(response2.data, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: 70,
      background: "transparent"
    }).toBuffer();
    await sock.sendMessage(chatJid, {
      sticker: outputBuffer2
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error(err);
    repondre("❌ Une erreur est survenue lors de la génération du sticker.");
  }
});
