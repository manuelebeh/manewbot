const {
  rankAndLevelUp,
  lecture_status,
  like_status,
  presence,
  dl_status,
  antidelete,
  antitag,
  antilink,
  antibot,
  autoread_msg,
  getJid,
  mention,
  antimention,
  chatbot,
  antispam,
  autoreact_msg
} = require("./message_upsert_events");
const {
  Bans,
  OnlyAdmins
} = require("../database/ban");
const {
  Sudo
} = require("../database/sudo");
const {
  getMessage,
  addMessage
} = require("../lib/store");
const {
  jidDecode,
  getContentType
} = require("@whiskeysockets/baileys");
const evt = require("../lib/commands");
const config = require("../set");
const {
  get_stick_cmd
} = require("../database/stick_cmd");
const {
  list_cmd
} = require("../database/public_private_cmd");
const decodeJid = jid => {
  if (!jid) {
    return jid;
  }
  if (/:\d+@/gi.test(jid)) {
    const decoded = jidDecode(jid) || {};
    return decoded.user && decoded.server && decoded.user + "@" + decoded.server || jid;
  }
  return jid;
};
async function getSudoUsers() {
  try {
    const sudoRecords = await Sudo.findAll({
      attributes: ["id"]
    });
    return sudoRecords.map(record => record.id.replace(/@s\.whatsapp\.net$/, ""));
  } catch {
    return [];
  }
}
async function isBanned(type, id) {
  const ban = await Bans.findOne({
    where: {
      id,
      type
    }
  });
  return !!ban;
}
async function message_upsert(upsert, sock) {
  try {
    if (upsert.type !== "notify") {
      return;
    }
    const msg = upsert.messages?.[0];
    if (!msg?.message) {
      return;
    }
    addMessage(msg.key.id, msg);
    let contentType = getContentType(msg.message);
    let viewOnce = false;
    if (contentType?.startsWith("viewOnce")) {
      viewOnce = true;
      const viewOnceInner = msg.message[contentType]?.message;
      if (viewOnceInner) {
        contentType = getContentType(viewOnceInner);
        msg.message = { ...msg.message, ...viewOnceInner };
      }
    } else if (
      msg.message.imageMessage?.viewOnce === true ||
      msg.message.videoMessage?.viewOnce === true ||
      msg.message.audioMessage?.viewOnce === true
    ) {
      viewOnce = true;
    }
    const messageText = {
      conversation: msg.message.conversation,
      imageMessage: msg.message.imageMessage?.caption,
      videoMessage: msg.message.videoMessage?.caption,
      extendedTextMessage: msg.message.extendedTextMessage?.text,
      buttonsResponseMessage: msg.message.buttonsResponseMessage?.selectedButtonId,
      listResponseMessage: msg.message.listResponseMessage?.singleSelectReply?.selectedRowId,
      messageContextInfo: msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply?.selectedRowId || msg.text
    }[contentType] || "";
    const botJid = decodeJid(sock.user.id);
    const botNumber = botJid.split("@")[0];
    const chatJid = (msg.key.remoteJidAlt || msg.key.remoteJid) === decodeJid(sock.user.lid) ? botJid : msg.key.remoteJidAlt || msg.key.remoteJid;
    const isGroup = chatJid.endsWith("@g.us");
    const groupMeta = isGroup ? await sock.groupMetadata(chatJid) : {};
    groupMeta.participants &&= groupMeta.participants.map(participant => ({
      ...participant,
      jid: participant.phoneNumber
    }));
    const groupName = groupMeta.subject || "";
    const participants = isGroup ? groupMeta.participants : [];
    const groupAdminJids = participants.filter(member => member.admin).map(member => member.jid);
    const isBotAdmin = isGroup && groupAdminJids.includes(botJid);
    const senderJid = isGroup ? await getJid(decodeJid(msg.key.participantAlt || msg.key.participant), chatJid, sock) : msg.key.fromMe ? botJid : decodeJid(msg.key.remoteJidAlt || msg.key.participantAlt || msg.key.participant || msg.key.senderPn || msg.key.remoteJid);
    const quotedMessage = msg.message?.[contentType]?.contextInfo?.quotedMessage;
    const quoteContext = msg.message?.[contentType]?.contextInfo;
    const quotedParticipant = msg.message?.[contentType]?.contextInfo?.participant;
    const quotedAuthorJid = quotedParticipant == decodeJid(sock.user.lid) ? botJid : await getJid(decodeJid(quotedParticipant), chatJid, sock);
    const mentionedJids = msg.message?.[contentType]?.contextInfo?.mentionedJid || [];
    const resolvedMentions = await Promise.all(mentionedJids.map(jid => getJid(jid, chatJid, sock)));
    const pushName = msg.pushName;
    const isCommand = messageText.trimStart().startsWith(config.PREFIXE);
    const args = isCommand ? messageText.trimStart().slice(config.PREFIXE.length).trimStart().split(/ +/).slice(1) : [];
    const commandName = isCommand ? messageText.slice(config.PREFIXE.length).trim().split(/ +/)[0].toLowerCase() : "";
    const devNumber1 = "22651463203";
    const devNumber2 = "22605463559";
    const devNumbers = [devNumber1, devNumber2];
    const sudoUsers = await getSudoUsers();
    const sudoJids = [devNumber1, devNumber2, botNumber, config.NUMERO_OWNER, ...sudoUsers].map(num => num + "@s.whatsapp.net");
    const isSudo = sudoJids.includes(senderJid);
    const devJids = devNumbers.map(num => num + "@s.whatsapp.net");
    const isDev = devJids.includes(senderJid);
    const isAdmin = isGroup && (groupAdminJids.includes(senderJid) || isSudo);
    const repondre = (text, targetJid) => {
      const jid = targetJid || chatJid;
      return sock.sendMessage(jid, {
        text
      }, {
        quoted: msg
      });
    };
    const sourceLabel = isGroup ? "👥 " + groupName : "💬 Privé";
    console.log("\n━━━━━━━[ BOT-LOG ]━━━━━━\n" + ("👤 Auteur  : " + pushName + " (" + senderJid + ")\n") + ("🏷️ Source  : " + sourceLabel + "\n") + ("📩 Type    : " + contentType + (viewOnce ? " 👁️ (vue unique)" : "") + "\n") + (viewOnce ? "👁️ Info    : Vue unique reçue\n" : "") + (messageText && messageText.trim() !== "" ? "📝 Texte   : " + messageText + "\n" : "") + "━━━━━━━━━━━━━━━━━━━━━━━\n");
    const owerlap = {
      verif_Groupe: isGroup,
      mbre_membre: participants,
      membre_Groupe: senderJid,
      verif_Admin: isAdmin,
      infos_Groupe: groupMeta,
      nom_Groupe: groupName,
      auteur_Message: senderJid,
      nom_Auteur_Message: pushName,
      mtype: contentType,
      id_Bot: botJid,
      isSudo,
      dev_id: isDev,
      dev_num: devJids,
      id_Bot_N: botNumber,
      verif_Bot_Admin: isBotAdmin,
      prefixe: config.PREFIXE,
      arg: args,
      repondre,
      groupe_Admin: () => groupAdminJids,
      msg_Repondu: quotedMessage,
      auteur_Msg_Repondu: quotedAuthorJid,
      ms: msg,
      ms_org: chatJid,
      texte: messageText,
      getJid,
      quote: quoteContext
    };
    const runCommand = async (cmd, skipReact = false) => {
      const privateCmds = await list_cmd("private");
      const publicCmds = await list_cmd("public");
      const isPrivateCmd = privateCmds.some(entry => entry.nom_cmd === cmd.nom_cmd || cmd.alias?.includes(entry.nom_cmd));
      const isPublicCmd = publicCmds.some(entry => entry.nom_cmd === cmd.nom_cmd || cmd.alias?.includes(entry.nom_cmd));
      if (!chatJid.endsWith("@newsletter")) {
        if (config.MODE !== "public" && !isSudo && !isPublicCmd) {
          return;
        }
        if (config.MODE === "public" && !isSudo && isPrivateCmd) {
          return;
        }
        const restrictedGroups = ["120363314687943170@g.us", "120363404635307998@g.us"];
        if (restrictedGroups.includes(chatJid) && senderJid !== "221772430620@s.whatsapp.net" && senderJid !== isDev) {
          return;
        }
        if (!isSudo && (await isBanned("user", senderJid))) {
          return;
        }
        if (!isSudo && isGroup && (await isBanned("group", chatJid))) {
          return;
        }
        if (!isAdmin && isGroup && (await OnlyAdmins.findOne({
          where: {
            id: chatJid
          }
        }))) {
          return;
        }
      }
      if (!skipReact) {
        await sock.sendMessage(chatJid, {
          react: {
            text: cmd.react || "🪄",
            key: msg.key
          }
        });
      }
      await cmd.fonction(chatJid, sock, owerlap);
    };
    if (isCommand) {
      const matchedCmd = evt.cmd.find(entry => entry.nom_cmd === commandName || entry.alias?.includes(commandName));
      if (matchedCmd) {
        await runCommand(matchedCmd);
      }
    }
    if (msg?.message?.stickerMessage) {
      try {
        const stickCmds = await get_stick_cmd();
        const stickMatch = stickCmds.find(entry => entry.stick_hash === msg.message.stickerMessage.fileSha256?.toString("base64"));
        if (stickMatch) {
          const stickCmd = evt.cmd.find(entry => entry.nom_cmd === stickMatch.no_cmd || entry.alias?.includes(stickMatch.no_cmd));
          if (stickCmd) {
            await runCommand(stickCmd, true);
          }
        }
      } catch (err) {
        console.error("Erreur sticker command:", err);
      }
    }
    const restrictedGroups = ["120363314687943170@g.us", "120363404635307998@g.us"];
    if (!isDev && senderJid !== "221772430620@s.whatsapp.net" && !devJids.includes(botJid) && restrictedGroups.includes(chatJid)) {
      return;
    }
    rankAndLevelUp(sock, chatJid, messageText, senderJid, pushName, config, msg);
    presence(sock, chatJid);
    lecture_status(sock, msg, chatJid);
    like_status(sock, msg, chatJid, botJid, senderJid);
    dl_status(sock, chatJid, msg, botJid);
    chatbot(chatJid, isGroup, messageText, repondre, resolvedMentions, botJid, quotedAuthorJid, senderJid);
    antidelete(sock, msg, senderJid, contentType, getMessage, chatJid, botJid);
    antimention(sock, chatJid, msg, isGroup, isAdmin, isBotAdmin, senderJid);
    antitag(sock, msg, chatJid, contentType, isGroup, isBotAdmin, isAdmin, senderJid);
    mention(sock, chatJid, msg, contentType, isGroup, botJid, repondre, resolvedMentions);
    antilink(sock, chatJid, msg, messageText, isGroup, isAdmin, isBotAdmin, senderJid);
    antibot(sock, chatJid, msg, isGroup, isAdmin, isBotAdmin, senderJid);
    antispam(sock, chatJid, msg, senderJid, isGroup, isAdmin, isBotAdmin);
    autoread_msg(sock, msg.key);
    autoreact_msg(sock, msg, chatJid);
    for (const func of evt.func) {
      try {
        await func.fonction(chatJid, sock, owerlap);
      } catch (err) {
        console.error("Erreur dans la fonction isfunc '" + func.nom_cmd + "':", err);
      }
    }
  } catch (err) {
    console.error("❌ Erreur(message.upsert):", err);
  }
}
module.exports = message_upsert;
