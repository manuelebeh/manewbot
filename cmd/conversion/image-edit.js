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
const { validateRemoteMediaUrl } = require('../../lib/url-safety');
const {
  getServiceUrls,
  serviceNotConfiguredMessage
} = require('../../lib/service-urls');

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
    const services = getServiceUrls(config);
    if (!services.remini && !services.vyro) {
      return sock.sendMessage(chatJid, {
        text: serviceNotConfiguredMessage("REMINI_API_BASE ou VYRO_API_BASE")
      }, {
        quoted: ms
      });
    }
    if (services.remini) {
      try {
        const uploadUrl2 = await uploadToCatbox(mediaPath2);
        const response2 = await axios.get(services.remini + "/api/remini?url=" + encodeURIComponent(uploadUrl2));
        const mediaCheck = validateRemoteMediaUrl(response2.data?.result);
        if (!mediaCheck.ok) {
          throw new Error(mediaCheck.reason);
        }
        await sock.sendMessage(chatJid, {
          image: {
            url: mediaCheck.href
          },
          caption: "```Powered by Manewbot```"
        }, {
          quoted: ms
        });
        return;
      } catch {}
    }
    if (services.vyro) {
      try {
        const enhancedImage2 = await remini(mediaPath2, "enhance");
        await sock.sendMessage(chatJid, {
          image: enhancedImage2,
          caption: "```Powered by Manewbot```"
        }, {
          quoted: ms
        });
        return;
      } catch {}
    }
    await sock.sendMessage(chatJid, {
      text: "Une erreur est survenue pendant le traitement de l'image."
    }, {
      quoted: ms
    });
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
