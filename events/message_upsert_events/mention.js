const {
  getMention
} = require("../../database/mention");
const getJid = require("./cache_jid");
async function mention(sock, chatJid, msg, contentType, isGroup, botJid, repondre, resolvedMentions) {
  try {
    if (resolvedMentions && resolvedMentions.includes(botJid)) {
      if (isGroup) {
        const mentionConfig = await getMention();
        if (mentionConfig && mentionConfig.mode === "oui") {
          const {
            url: mediaUrl,
            text: captionText,
            type: mediaType
          } = mentionConfig;
          if ((!mediaUrl || mediaUrl === "") && (!captionText || captionText === "")) {
            repondre("Mention activée mais aucun contenu défini.");
            return;
          }
          switch (mediaType) {
            case "audio":
              if (!mediaUrl) {
                return repondre(captionText || "Aucun contenu audio défini.");
              }
              sock.sendMessage(chatJid, {
                audio: {
                  url: mediaUrl
                },
                mimetype: "audio/mpeg"
              }, {
                quoted: msg
              });
              break;
            case "image":
              if (!mediaUrl) {
                return repondre(captionText || "Aucun contenu image défini.");
              }
              sock.sendMessage(chatJid, {
                image: {
                  url: mediaUrl
                },
                caption: captionText || undefined
              }, {
                quoted: msg
              });
              break;
            case "video":
              if (!mediaUrl) {
                return repondre(captionText || "Aucun contenu vidéo défini.");
              }
              sock.sendMessage(chatJid, {
                video: {
                  url: mediaUrl
                },
                caption: captionText || undefined
              }, {
                quoted: msg
              });
              break;
            case "texte":
              return repondre(captionText || "Aucun message texte défini.");
            default:
              repondre("Le type de média est inconnu ou non pris en charge.");
          }
        }
      }
    }
  } catch (err) {
    console.error("Erreur dans mention:", err);
  }
}
module.exports = mention;
