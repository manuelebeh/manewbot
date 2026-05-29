const {
  registerCommand
} = require("../lib/commands");
const fs = require("fs");
const {
  Sticker,
  StickerTypes
} = require("wa-sticker-formatter");
const {
  execSync,
  exec,
  spawn
} = require("child_process");
const path = require("path");
const config = require("../set");
const gTTS = require("gtts");
const axios = require("axios");
const FormData = require("form-data");
const {
  readFileSync
} = require("fs");
const sharp = require("sharp");
const {
  Ranks
} = require("../database/rank");
const os = require("os");
let fusionCache = {};
async function uploadToCatbox(filePath) {
  try {
    const formData = new FormData();
    formData.append("reqtype", "fileupload");
    formData.append("fileToUpload", fs.createReadStream(filePath));
    const response = await axios.post("https://catbox.moe/user/api.php", formData, {
      headers: formData.getHeaders()
    });
    return response.data;
  } catch (err) {
    console.error("Erreur lors de l'upload sur Catbox:", err);
    throw new Error("Une erreur est survenue lors de l'upload du fichier.");
  }
}
const alea = suffix => "" + Math.floor(Math.random() * 10000) + suffix;
const isSupportedFile = filename => {
  const extensions = [".jpg", ".jpeg", ".png", ".webp", ".mp4", ".gif"];
  return extensions.some(ext => filename.endsWith(ext));
};
registerCommand({
  nom_cmd: "url",
  classe: "Conversion",
  react: "📤",
  desc: "Upload un fichier (image, vidéo, audio) sur Catbox et renvoie le lien"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez mentionner un fichier (image, vidéo, audio ou document)."
    }, {
      quoted: ms
    });
  }
  const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage || sourceMessage2.documentMessage || sourceMessage2.audioMessage;
  if (!sourceMessage32) {
    return sock.sendMessage(chatJid, {
      text: "Type de fichier non supporté. Veuillez mentionner une image, vidéo ou audio."
    }, {
      quoted: ms
    });
  }
  try {
    const mediaPath2 = await sock.dl_save_media_ms(sourceMessage32);
    const uploadUrl2 = await uploadToCatbox(mediaPath2);
    await sock.sendMessage(chatJid, {
      text: uploadUrl2
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur lors de l'upload sur Catbox:", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du lien Catbox."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "sticker",
  classe: "Conversion",
  react: "✍️",
  desc: "Crée un sticker à partir d'une image, vidéo ou GIF",
  alias: ["s", "stick"]
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    arg,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à une image, vidéo ou GIF pour créer un sticker."
    }, {
      quoted: ms
    });
  }
  let value2;
  try {
    const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage;
    if (!sourceMessage32) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez répondre à une image, vidéo ou GIF valide."
      }, {
        quoted: ms
      });
    }
    value2 = await sock.dl_save_media_ms(sourceMessage32);
    if (!value2) {
      throw new Error("Impossible de télécharger le fichier.");
    }
    const fileBuffer2 = fs.readFileSync(value2);
    const sticker2 = new Sticker(fileBuffer2, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: sourceMessage2.imageMessage ? 100 : 30
    });
    const sourceMessage42 = Math.floor(Math.random() * 10000) + ".webp";
    await sticker2.toFile(sourceMessage42);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage42)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
    fs.unlinkSync(sourceMessage42);
  } catch (err) {
    console.error("Erreur lors de la création du sticker:", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "crop",
  classe: "Conversion",
  react: "✂️",
  desc: "Crée un sticker croppé à partir d'une image ou vidéo"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à une image ou vidéo."
    }, {
      quoted: ms
    });
  }
  let value2;
  try {
    const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage;
    if (!sourceMessage32) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez répondre à une image ou vidéo valide."
      }, {
        quoted: ms
      });
    }
    value2 = await sock.dl_save_media_ms(sourceMessage32);
    const fileBuffer2 = fs.readFileSync(value2);
    const sticker2 = new Sticker(fileBuffer2, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.CROPPED,
      quality: sourceMessage2.imageMessage ? 100 : 30
    });
    const sourceMessage42 = Math.floor(Math.random() * 10000) + ".webp";
    await sticker2.toFile(sourceMessage42);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage42)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
    fs.unlinkSync(sourceMessage42);
  } catch (err) {
    console.error("Erreur lors de la création du sticker :", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "circle",
  classe: "Conversion",
  react: "🔵",
  desc: "Crée un sticker circulaire à partir d'une image ou vidéo"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à une image ou vidéo."
    }, {
      quoted: ms
    });
  }
  let value2;
  try {
    const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage;
    if (!sourceMessage32) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez répondre à une image ou vidéo valide."
      }, {
        quoted: ms
      });
    }
    value2 = await sock.dl_save_media_ms(sourceMessage32);
    const fileBuffer2 = fs.readFileSync(value2);
    const sticker2 = new Sticker(fileBuffer2, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.CIRCLE,
      quality: sourceMessage2.imageMessage ? 100 : 30
    });
    const sourceMessage42 = Math.floor(Math.random() * 10000) + ".webp";
    await sticker2.toFile(sourceMessage42);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage42)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
    fs.unlinkSync(sourceMessage42);
  } catch (err) {
    console.error("Erreur lors de la création du sticker :", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "round",
  classe: "Conversion",
  react: "🔲",
  desc: "Crée un sticker avec des coins arrondis à partir d'une image ou vidéo"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à une image ou vidéo."
    }, {
      quoted: ms
    });
  }
  let value2;
  try {
    const sourceMessage32 = sourceMessage2.imageMessage || sourceMessage2.videoMessage;
    if (!sourceMessage32) {
      return sock.sendMessage(chatJid, {
        text: "Veuillez répondre à une image ou vidéo valide."
      }, {
        quoted: ms
      });
    }
    value2 = await sock.dl_save_media_ms(sourceMessage32);
    const fileBuffer2 = fs.readFileSync(value2);
    const sticker2 = new Sticker(fileBuffer2, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.ROUNDED,
      quality: sourceMessage2.imageMessage ? 100 : 30
    });
    const sourceMessage42 = Math.floor(Math.random() * 10000) + ".webp";
    await sticker2.toFile(sourceMessage42);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage42)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
    fs.unlinkSync(sourceMessage42);
  } catch (err) {
    console.error("Erreur lors de la création du sticker :", err);
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la création du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "take",
  classe: "Conversion",
  react: "✍️",
  desc: "Modifie le nom d'un sticker"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    arg,
    nom_Auteur_Message,
    ms
  } = ctx;
  if (!msg_Repondu || !msg_Repondu.stickerMessage) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à un sticker."
    }, {
      quoted: ms
    });
  }
  try {
    const mediaPath2 = await sock.dl_save_media_ms(msg_Repondu.stickerMessage);
    const sourceMessage2 = msg_Repondu.stickerMessage.quality || 40;
    const sticker2 = new Sticker(mediaPath2, {
      pack: arg.join(" ") ? arg.join(" ") : nom_Auteur_Message,
      author: "",
      type: StickerTypes.FULL,
      quality: sourceMessage2
    });
    const value2 = alea(".webp");
    await sticker2.toFile(value2);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(value2)
    }, {
      quoted: ms
    });
    fs.unlinkSync(value2);
  } catch (err) {
    await sock.sendMessage(chatJid, {
      text: "Erreur lors du renommage du sticker : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "toimage",
  classe: "Conversion",
  react: "✍️",
  desc: "Convertit un sticker en image",
  alias: ["toimg", "photo"]
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  if (!msg_Repondu || !msg_Repondu.stickerMessage) {
    return sock.sendMessage(chatJid, {
      text: "Répondez à un sticker."
    }, {
      quoted: ms
    });
  }
  try {
    const mediaPath2 = await sock.dl_save_media_ms(msg_Repondu.stickerMessage);
    const outputBuffer2 = await sharp(mediaPath2).png().toBuffer();
    await sock.sendMessage(chatJid, {
      image: outputBuffer2
    }, {
      quoted: ms
    });
  } catch (err) {
    await sock.sendMessage(chatJid, {
      text: "Erreur lors de la conversion en image : " + err.message
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "write",
  classe: "Conversion",
  react: "✍️",
  desc: "Ajoute du texte à une image, vidéo ou sticker"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    arg,
    ms
  } = ctx;
  if (!msg_Repondu || !arg[0]) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez répondre à un fichier et fournir du texte."
    }, {
      quoted: ms
    });
  }
  const sourceMessage2 = msg_Repondu.imageMessage || msg_Repondu.videoMessage || msg_Repondu.stickerMessage;
  if (!sourceMessage2) {
    return sock.sendMessage(chatJid, {
      text: "Type de fichier non supporté. Veuillez mentionner une image, vidéo ou sticker."
    }, {
      quoted: ms
    });
  }
  try {
    const mediaPath2 = await sock.dl_save_media_ms(sourceMessage2);
    const image2 = sharp(mediaPath2);
    const {
      width: width,
      height: height
    } = await image2.metadata();
    const overlayText = arg.join(" ").toUpperCase();
    let fontSize = Math.floor(width / 10);
    if (fontSize < 20) {
      fontSize = 20;
    }
    const lineHeight = fontSize * 1.2;
    const maxLineWidth = width * 0.8;
    function wrapText(text, maxWidth) {
      const words = text.split(" ");
      let lines = [];
      let currentLine = "";
      words.forEach(word => {
        let testLine = currentLine + word + " ";
        let testWidth = testLine.length * (fontSize * 0.6);
        if (testWidth > maxWidth && currentLine !== "") {
          lines.push(currentLine.trim());
          currentLine = word + " ";
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine.trim());
      return lines;
    }
    const textLines = wrapText(overlayText, maxLineWidth);
    const svgLines = textLines.map((line, lineIndex) => "<text x=\"50%\" y=\"" + (height - (textLines.length - lineIndex) * lineHeight) + "\" font-size=\"" + fontSize + "\" font-family=\"Arial\" fill=\"white\" text-anchor=\"middle\" stroke=\"black\" stroke-width=\"" + fontSize / 15 + "\">" + line + "</text>").join("");
    const svgOverlay = "<svg width=\"" + width + "\" height=\"" + height + "\">" + svgLines + "</svg>";
    const outputBuffer = await image2.composite([{
      input: Buffer.from(svgOverlay),
      top: 0,
      left: 0
    }]).toBuffer();
    const webpPath = Math.floor(Math.random() * 10000) + ".webp";
    await sharp(outputBuffer).webp().toFile(webpPath);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(webpPath)
    }, {
      quoted: ms
    });
    fs.unlinkSync(webpPath);
    fs.unlinkSync(mediaPath2);
  } catch (err) {
    await sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de l'ajout du texte : " + err.message
    }, {
      quoted: ms
    });
  }
});
const remini = async (imageInput, mode) => {
  const modes = ["enhance", "recolor", "dehaze"];
  const selectedMode = modes.includes(mode) ? mode : modes[0];
  const apiUrl = "https://inferenceengine.vyro.ai/" + selectedMode;
  const formData = new FormData();
  formData.append("model_version", 1);
  const imageBuffer = Buffer.isBuffer(imageInput) ? imageInput : readFileSync(imageInput);
  formData.append("image", imageBuffer, {
    filename: "enhance_image_body.jpg",
    contentType: "image/jpeg"
  });
  const response = await axios.post(apiUrl, formData, {
    headers: {
      ...formData.getHeaders(),
      "User-Agent": "okhttp/4.9.3",
      Connection: "Keep-Alive",
      "Accept-Encoding": "gzip"
    },
    responseType: "arraybuffer"
  });
  return Buffer.from(response.data);
};
registerCommand({
  nom_cmd: "remini",
  classe: "Conversion",
  react: "🖼️",
  desc: "Amélioration de la qualité des images"
}, async (chatJid, sock, ctx) => {
  const {
    msg_Repondu,
    ms
  } = ctx;
  const sourceMessage2 = msg_Repondu || ms.message;
  if (!sourceMessage2?.imageMessage) {
    return sock.sendMessage(chatJid, {
      text: "Veuillez répondre à une image pour améliorer sa qualité."
    }, {
      quoted: ms
    });
  }
  try {
    const mediaPath2 = await sock.dl_save_media_ms(sourceMessage2.imageMessage);
    if (!mediaPath2) {
      return sock.sendMessage(chatJid, {
        text: "Impossible de télécharger l'image. Réessayez."
      }, {
        quoted: ms
      });
    }
    try {
      const uploadUrl2 = await uploadToCatbox(mediaPath2);
      const response2 = await axios.get("https://www.itzky.xyz/api/remini?url=" + uploadUrl2);
      await sock.sendMessage(chatJid, {
        image: {
          url: response2.data.result
        },
        caption: "```Powered by Manewbot```"
      }, {
        quoted: ms
      });
      return;
    } catch {}
    try {
      const enhancedImage2 = await remini(mediaPath2, "enhance");
      await sock.sendMessage(chatJid, {
        image: enhancedImage2,
        caption: "```Powered by Manewbot```"
      }, {
        quoted: ms
      });
    } catch {
      await sock.sendMessage(chatJid, {
        text: "Une erreur est survenue pendant le traitement de l'image avec les deux services."
      }, {
        quoted: ms
      });
    }
  } catch {
    return sock.sendMessage(chatJid, {
      text: "Une erreur est survenue pendant le traitement de l'image."
    }, {
      quoted: ms
    });
  }
});
registerCommand({
  nom_cmd: "emix",
  classe: "Conversion",
  react: "🌟",
  desc: "Mixes deux emojis pour créer un sticker"
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    prefixe,
    ms
  } = ctx;
  if (!arg || arg.length < 1) {
    return sock.sendMessage(chatJid, {
      text: "Example: " + prefixe + "emix 😅;🤔"
    }, {
      quoted: ms
    });
  }
  let [emoji1, emoji2] = arg[0].split(";");
  if (!config.TENOR_EMOJI_API_KEY) {
    return sock.sendMessage(chatJid, {
      text: "Emoji mix non configuré (TENOR_EMOJI_API_KEY)."
    }, {
      quoted: ms
    });
  }
  try {
    let response2 = await axios.get("https://tenor.googleapis.com/v2/featured?key=" + config.TENOR_EMOJI_API_KEY + "&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=" + encodeURIComponent(emoji1) + "_" + encodeURIComponent(emoji2));
    let data2 = response2.data;
    if (!data2.results || data2.results.length === 0) {
      return sock.sendMessage(chatJid, {
        text: "Aucun résultat trouvé pour ces emojis."
      }, {
        quoted: ms
      });
    }
    for (let value2 of data2.results) {
      const value32 = await axios.get(value2.url, {
        responseType: "arraybuffer"
      }).then(param2 => param2.data);
      const sticker2 = new Sticker(value32, {
        pack: config.STICKER_PACK_NAME,
        author: config.STICKER_AUTHOR_NAME,
        type: StickerTypes.FULL,
        quality: 100
      });
      const sourceMessage2 = Math.floor(Math.random() * 10000) + ".webp";
      await sticker2.toFile(sourceMessage2);
      await sock.sendMessage(chatJid, {
        sticker: fs.readFileSync(sourceMessage2)
      }, {
        quoted: ms
      });
      fs.unlinkSync(sourceMessage2);
    }
  } catch (err) {
    console.error("Erreur:", err);
    return sock.sendMessage(chatJid, {
      text: "Une erreur est survenue lors de la recherche de l'image."
    }, {
      quoted: ms
    });
  }
});
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
async function convertWebpToMp4({
  file: file,
  filename: filename,
  url: url
}) {
  try {
    if (!file && !url) {
      throw new Error("Un fichier ou une URL est requis.");
    }
    if (file && !filename) {
      throw new Error("Le nom du fichier est requis pour les fichiers envoyés.");
    }
    const formData2 = new FormData();
    if (file) {
      formData2.append("new-image", file, {
        filename: filename
      });
    }
    if (url) {
      formData2.append("new-image-url", url);
    }
    const response2 = await axios.post("https://ezgif.com/webp-to-mp4", formData2, {
      headers: formData2.getHeaders()
    });
    const value2 = response2?.request?.res?.responseUrl;
    if (!value2) {
      throw new Error("Redirection introuvable.");
    }
    const value32 = value2.replace(/\.html$/, "");
    const value42 = value32.split("/").pop();
    const response32 = await axios.post(value32 + "?ajax=true", new URLSearchParams({
      file: value42,
      background: "#ffffff",
      backgroundc: "#ffffff",
      repeat: "1",
      ajax: "true"
    }), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    const value52 = response32.data.toString();
    const value62 = "\" controls><source src=\"";
    const value72 = "\" type=\"video/mp4\">Your browser";
    const value82 = value52.split(value62)?.[1]?.split(value72)?.[0];
    if (!value82) {
      throw new Error("Conversion échouée.");
    }
    return "https:" + value82.replace("https:", "");
  } catch (err) {
    throw new Error("Erreur conversion WebP → MP4 : " + err);
  }
}
registerCommand({
  nom_cmd: "stickertovideo",
  classe: "Conversion",
  react: "🎞️",
  desc: "Convertit un sticker en vidéo MP4",
  alias: ["stovid"]
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    repondre,
    msg_Repondu
  } = ctx;
  try {
    if (!msg_Repondu || !msg_Repondu.stickerMessage) {
      return sock.sendMessage(chatJid, {
        text: "Répondez à un sticker."
      }, {
        quoted: ms
      });
    }
    const mediaPath2 = await sock.dl_save_media_ms(msg_Repondu.stickerMessage);
    const value2 = fs.createReadStream(mediaPath2);
    const mp4Url2 = await convertWebpToMp4({
      file: value2,
      filename: "fichier.webp"
    });
    await sock.sendMessage(chatJid, {
      video: {
        url: mp4Url2
      },
      caption: "```Powered by Manewbot```"
    }, {
      quoted: ms
    });
    fs.unlinkSync(mediaPath2);
  } catch (err) {
    console.error(err);
    repondre("❌ Une erreur est survenue pendant la conversion.");
  }
});
registerCommand({
  nom_cmd: "quotely",
  classe: "Conversion",
  react: "🖼️",
  desc: "Transforme un message cité en sticker stylisé.",
  alias: ["q"]
}, async (chatJid, sock, ctx) => {
  const {
  ms,
  msg_Repondu,
  repondre,
  auteur_Msg_Repondu
} = ctx;
  const sourceMessage2 = msg_Repondu?.conversation || msg_Repondu?.extendedTextMessage?.text;
  if (!sourceMessage2) {
    return repondre("Veuillez répondre à un message texte.");
  }
  let value2;
  try {
    value2 = await sock.profilePictureUrl(auteur_Msg_Repondu, "image");
  } catch (err) {
    value2 = "https://files.catbox.moe/8kvevz.jpg";
  }
  let value32;
  const rankRecord2 = await Ranks.findOne({
    where: {
      id: auteur_Msg_Repondu
    }
  });
  if (rankRecord2.name) {
    value32 = rankRecord2.name;
  } else {
    value32 = "Manewbot-USER";
  }
  const modes2 = ["#FFFFFF", "#000000", "#1f1f1f", "#e3e3e3"];
  const value42 = modes2[Math.floor(Math.random() * modes2.length)];
  const payload2 = {
    type: "quote",
    format: "png",
    backgroundColor: value42,
    width: 512,
    height: 512,
    scale: 3,
    messages: [{
      avatar: true,
      from: {
        first_name: value32,
        language_code: "fr",
        name: value32,
        photo: {
          url: value2
        }
      },
      text: sourceMessage2,
      replyMessage: {}
    }]
  };
  try {
    const response2 = await axios.post("https://bot.lyo.su/quote/generate", payload2);
    const value52 = Buffer.from(response2.data.result.image, "base64");
    const sticker2 = new Sticker(value52, {
      pack: config.STICKER_PACK_NAME,
      author: config.STICKER_AUTHOR_NAME,
      type: StickerTypes.FULL,
      quality: 100
    });
    const sourceMessage32 = "/tmp/quotely_" + Date.now() + ".webp";
    await sticker2.toFile(sourceMessage32);
    await sock.sendMessage(chatJid, {
      sticker: fs.readFileSync(sourceMessage32)
    }, {
      quoted: ms
    });
    fs.unlinkSync(sourceMessage32);
  } catch (err2) {
    console.error("Erreur Quotely :", err2.message || err2);
    return repondre("Une erreur est survenue lors de la génération du sticker.");
  }
});
registerCommand({
  nom_cmd: "tovv",
  classe: "Outils",
  react: "👀",
  desc: "envoie un message en vue unique dans la discussion"
}, async (chatJid, sock, ctx) => {
  const {
    ms,
    msg_Repondu,
    repondre
  } = ctx;
  if (!msg_Repondu) {
    return repondre("Veuillez mentionner un message qui n'est pas en vue unique.");
  }
  let urlToken2 = Object.keys(msg_Repondu).find(param2 => param2.startsWith("viewOnceMessage"));
  let value2 = msg_Repondu;
  if (urlToken2) {
    value2 = msg_Repondu[urlToken2].message;
  }
  if (value2) {
    if (value2.imageMessage && value2.imageMessage.viewOnce == true || value2.videoMessage && value2.videoMessage.viewOnce == true || value2.audioMessage && value2.audioMessage.viewOnce == true) {
      return repondre("Ce message est un message en vue unique.");
    }
  }
  try {
    let value32;
    let payload2 = {
      quoted: ms
    };
    if (value2.imageMessage) {
      value32 = await sock.dl_save_media_ms(value2.imageMessage);
      await sock.sendMessage(chatJid, {
        image: {
          url: value32
        },
        viewOnce: true,
        caption: value2.imageMessage.caption || ""
      }, payload2);
    } else if (value2.videoMessage) {
      value32 = await sock.dl_save_media_ms(value2.videoMessage);
      await sock.sendMessage(chatJid, {
        video: {
          url: value32
        },
        viewOnce: true,
        caption: value2.videoMessage.caption || ""
      }, payload2);
    } else if (value2.audioMessage) {
      value32 = await sock.dl_save_media_ms(value2.audioMessage);
      await sock.sendMessage(chatJid, {
        audio: {
          url: value32
        },
        viewOnce: true,
        mimetype: "audio/mp4",
        ptt: false
      }, payload2);
    } else {
      return repondre("Ce type de message en vue unique n'est pas pris en charge.");
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi du message en vue unique :", err.message || err);
    return repondre("Une erreur est survenue lors du traitement du message.");
  }
});
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
    const duration = parseFloat(execSync("ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 \"" + mediaPath + "\"").toString().trim());
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