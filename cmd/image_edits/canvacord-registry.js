'use strict';

const { registerCommand } = require('../../lib/commands');
const config = require('../../set');
const { getServiceUrls, serviceNotConfiguredMessage } = require('../../lib/service-urls');
const axios = require('axios');
const FormData = require('form-data');
const { validatePublicHttpUrl, validateRemoteMediaUrl } = require('../../lib/url-safety');

function genererCommandeCanvacord(effectName) {
  registerCommand({
    nom_cmd: effectName,
    classe: "Image_Edits",
    react: "🎨",
    desc: "Applique l'effet " + effectName + " via l'API"
  }, async (jid, bot, ctx) => {
    const {
      arg,
      ms,
      getJid,
      auteur_Msg_Repondu,
      msg_Repondu,
      auteur_Message
    } = ctx;
    try {
      const sourceMessage = msg_Repondu || ms.message;
      let imageSource;
      let isLocalFile = false;
      if (sourceMessage?.imageMessage) {
        const localPath = await bot.dl_save_media_ms(sourceMessage.imageMessage);
        imageSource = localPath;
        isLocalFile = true;
      } else if (arg[0]?.startsWith("http")) {
        const urlCheck = validatePublicHttpUrl(arg[0]);
        if (!urlCheck.ok) {
          return bot.sendMessage(jid, { text: urlCheck.reason }, { quoted: ms });
        }
        imageSource = urlCheck.href;
      } else {
        const targetUser = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid" || auteur_Message;
        const resolvedJid = await getJid(targetUser, jid, bot);
        try {
          imageSource = await bot.profilePictureUrl(resolvedJid, "image");
        } catch {
          imageSource = config.DEFAULT_AVATAR_URL;
        }
      }
      const {
        ovl
      } = getServiceUrls(config);
      if (!ovl) {
        return bot.sendMessage(jid, {
          text: serviceNotConfiguredMessage("OVL_API_BASE")
        }, {
          quoted: ms
        });
      }
      let response;
      if (isLocalFile) {
        const form = new FormData();
        form.append("file", require("fs").createReadStream(imageSource));
        response = await axios.post(ovl + "/img-effect/" + effectName, form, {
          headers: form.getHeaders(),
          responseType: "arraybuffer"
        });
      } else {
        response = await axios.get(ovl + "/img-effect/" + effectName + "?url=" + encodeURIComponent(imageSource), {
          responseType: "arraybuffer"
        });
      }
      await bot.sendMessage(jid, {
        image: Buffer.from(response.data)
      }, {
        quoted: ms
      });
    } catch (err) {
      console.error("Erreur avec la commande \"" + effectName + "\":", err);
    }
  });
}

module.exports = {
  registerCommand,
  config,
  getServiceUrls,
  serviceNotConfiguredMessage,
  axios,
  FormData,
  genererCommandeCanvacord,
};
