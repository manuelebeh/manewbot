'use strict';

const { registerCommand } = require('../register');
const { fs, axios, config, Sticker, StickerTypes, sharp, uploadToCatbox, remini } = require('../media');
const { validateRemoteMediaUrl } = require('../../../lib/url-safety');
const {
  getServiceUrls,
  serviceNotConfiguredMessage,
} = require('../../../lib/service-urls');

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
