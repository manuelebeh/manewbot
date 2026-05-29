const fs = require("fs");
const path = require("path");
const {
  downloadContentFromMessage
} = require("@whiskeysockets/baileys");
const {
  decodeJid
} = require("../lib/jid");
const FileType = require("file-type");
const {
  getJid
} = require("./message_upsert_events");
async function dl_save_media_ms(content, message) {
  const msg = message.msg || message;
  const mimetype = msg.mimetype || "";
  const mediaType = msg.mtype ? msg.mtype.replace(/Message/gi, "") : mimetype.split("/")[0];
  if (!mimetype) {
    throw new Error("MIME type manquant");
  }
  const stream = await downloadContentFromMessage(msg, mediaType);
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  const fileType = await FileType.fromBuffer(buffer);
  if (!fileType) {
    throw new Error("Type de fichier inconnu");
  }
  const downloadsDir = "./downloads";
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, {
      recursive: true
    });
  }
  const filePath = path.join(downloadsDir, "media_" + Date.now() + "." + fileType.ext);
  await fs.promises.writeFile(filePath, buffer);
  setTimeout(() => {
    fs.unlink(filePath, () => {});
  }, 300000);
  return filePath;
}
async function recup_msg({
  bot,
  auteur,
  ms_org,
  temps = 30000
} = {}) {
  return new Promise(async (resolve, reject) => {
    if (auteur !== undefined && typeof auteur !== "string") {
      return reject(new Error("L'auteur doit être une chaîne si défini."));
    }
    if (ms_org !== undefined && typeof ms_org !== "string") {
      return reject(new Error("Le ms_org doit être une chaîne si défini."));
    }
    if (typeof temps !== "number") {
      return reject(new Error("Le temps doit être un nombre."));
    }
    const resolvedAuthor = auteur && ms_org ? await getJid(auteur, ms_org, bot) : auteur;
    let timeoutId;
    const onMessagesUpsert = async ({
      type,
      messages
    }) => {
      if (type !== "notify") {
        return;
      }
      for (const message of messages) {
        const remoteJid = (message.key.remoteJidAlt || message.key.remoteJid) === decodeJid(bot.user.lid) ? decodeJid(bot.user.id) : message.key.remoteJidAlt || message.key.remoteJid;
        let participantJid = message.key.fromMe ? decodeJid(bot.user.id) : message.key.participantAlt || message.key.participant || message.key.senderPn ? await getJid(message.key.participantAlt || message.key.participant || message.key.senderPn || message.key.remoteJid, remoteJid, bot) : remoteJid;
        const matchesFilter = resolvedAuthor && ms_org && participantJid == resolvedAuthor && remoteJid == ms_org || resolvedAuthor && !ms_org && participantJid == resolvedAuthor || !resolvedAuthor && ms_org && remoteJid == ms_org || !resolvedAuthor && !ms_org;
        if (matchesFilter) {
          bot.ev.off("messages.upsert", onMessagesUpsert);
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          message.key.participant = participantJid;
          message.key.remoteJid = remoteJid;
          return resolve(message);
        }
      }
    };
    bot.ev.on("messages.upsert", onMessagesUpsert);
    if (temps > 0) {
      timeoutId = setTimeout(() => {
        bot.ev.off("messages.upsert", onMessagesUpsert);
        reject(new Error("Timeout"));
      }, temps);
    }
  });
}
module.exports = {
  dl_save_media_ms: dl_save_media_ms,
  recup_msg: recup_msg
};
