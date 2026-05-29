'use strict';

const { registerCommand } = require('./register');
const { apkdl, axios, fs } = require('./deps');

registerCommand({
  nom_cmd: "app",
  classe: "Telechargement",
  react: "📥",
  desc: "Télécharger une application depuis Aptoide"
}, async (chatJid, sock, ctx) => {
  const {
    repondre,
    arg,
    ms
  } = ctx;
  try {
    const appQuery = arg.join(" ");
    if (!appQuery) {
      return repondre("*Entrer le nom de l'application à rechercher*");
    }
    const searchResults = await apkdl(appQuery, 1);
    if (searchResults.length === 0) {
      return repondre("*Application non existante, veuillez entrer un autre nom*");
    }
    const appInfo = searchResults[0];
    const fileSizeMb = parseFloat(appInfo.size);
    if (isNaN(fileSizeMb)) {
      return repondre("*Erreur dans la taille du fichier*");
    }
    if (fileSizeMb > 300) {
      return repondre("Le fichier dépasse 300 Mo, impossible de le télécharger.");
    }
    const downloadUrl = appInfo.dllink;
    const infoCaption = "『 *ᴏᴠʟ-ᴍᴅ-ᴠ𝟸 ᴀᴘᴋ-ᴅʟ* 』\n\n*📱ɴᴏᴍ :* " + appInfo.name + "\n*🆔ɪᴅ :* " + appInfo.package + "\n*📅ᴍɪsᴇ ᴀ̀ ᴊᴏᴜʀ:* " + appInfo.lastup + "\n*📦ᴛᴀɪʟʟᴇ :* " + appInfo.size + " MB\n";
    const apkFileName = (appInfo?.name || "Downloader") + ".apk";
    const apkFilePath = apkFileName;
    const downloadResponse = await axios.get(downloadUrl, {
      responseType: "stream"
    });
    const writeStream = fs.createWriteStream(apkFilePath);
    downloadResponse.data.pipe(writeStream);
    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });
    const documentMessage = {
      document: fs.readFileSync(apkFilePath),
      mimetype: "application/vnd.android.package-archive",
      fileName: apkFileName
    };
    await sock.sendMessage(chatJid, {
      image: {
        url: appInfo.icon
      },
      caption: infoCaption
    }, {
      quoted: ms
    });
    await sock.sendMessage(chatJid, documentMessage, {
      quoted: ms
    });
    fs.unlinkSync(apkFilePath);
  } catch (err) {
    console.error("Erreur lors du traitement de la commande apk:", err);
    repondre("*Erreur lors du traitement de la commande apk*");
  }
});
