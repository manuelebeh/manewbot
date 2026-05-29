'use strict';

const { registerCommand } = require('../register');
const { fs, axios, config, Sticker, StickerTypes, sharp, uploadToCatbox, remini } = require('../media');
const { validateRemoteMediaUrl } = require('../../../lib/url-safety');
const {
  getServiceUrls,
  serviceNotConfiguredMessage,
} = require('../../../lib/service-urls');

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
