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
  getOwnerJid,
  getSudoOnlyJids,
  getPrivilegedJids,
  isRestrictedGroup,
  canUseRestrictedGroup,
  shouldRunHandlersInRestrictedGroup
} = require("../lib/parse-env-lists");
const {
  resolveCommandReactEnabled
} = require("../lib/env-toggle");
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
const VIEW_ONCE_MEDIA_KEYS = ["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"];
function hasViewOnceFlag(messageContent) {
  if (!messageContent) {
    return false;
  }
  return VIEW_ONCE_MEDIA_KEYS.some(key => messageContent[key]?.viewOnce === true);
}
function resolveMessageContent(message) {
  let contentType = getContentType(message);
  let viewOnce = contentType?.startsWith("viewOnce") || hasViewOnceFlag(message);
  if (contentType?.startsWith("viewOnce")) {
    const viewOnceInner = message[contentType]?.message;
    if (viewOnceInner) {
      contentType = getContentType(viewOnceInner);
      return {
        contentType,
        viewOnce: true,
        message: {
          ...message,
          ...viewOnceInner
        }
      };
    }
  }
  return {
    contentType,
    viewOnce,
    message
  };
}
function getQuotedMessageInfo(quotedMessage) {
  if (!quotedMessage) {
    return null;
  }
  const viewOnceKey = Object.keys(quotedMessage).find(key => key.startsWith("viewOnceMessage"));
  const innerMessage = viewOnceKey ? quotedMessage[viewOnceKey]?.message : quotedMessage;
  if (!innerMessage) {
    return null;
  }
  const quotedType = getContentType(innerMessage) || "message";
  const quotedViewOnce = !!viewOnceKey || hasViewOnceFlag(innerMessage);
  return {
    type: quotedType,
    viewOnce: quotedViewOnce
  };
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
    const resolvedMessage = resolveMessageContent(msg.message);
    let contentType = resolvedMessage.contentType;
    const viewOnce = resolvedMessage.viewOnce;
    msg.message = resolvedMessage.message;
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
    const sudoUsers = await getSudoUsers();
    const ownerJid = getOwnerJid(config);
    const sudoJids = getSudoOnlyJids(sudoUsers);
    const privilegedJids = getPrivilegedJids(config, botNumber, sudoUsers);
    const isOwner = !!ownerJid && senderJid === ownerJid;
    const isSudo = sudoJids.includes(senderJid);
    const isStaff = isOwner || isSudo;
    const isAdmin = isGroup && (groupAdminJids.includes(senderJid) || isStaff);
    const repondre = (text, targetJid) => {
      const jid = targetJid || chatJid;
      return sock.sendMessage(jid, {
        text
      }, {
        quoted: msg
      });
    };
    const sourceLabel = isGroup ? "👥 " + groupName : "💬 Privé";
    const quotedInfo = getQuotedMessageInfo(quotedMessage);
    const logLines = [
      "",
      "━━━━━━━[ BOT-LOG ]━━━━━━",
      "👤 Auteur  : " + pushName + " (" + senderJid + ")",
      "🏷️ Source  : " + sourceLabel,
      "📩 Type    : " + contentType + (viewOnce ? " 👁️ (vue unique)" : "")
    ];
    if (viewOnce) {
      logLines.push("👁️ Info    : Vue unique reçue");
    }
    if (messageText && messageText.trim() !== "") {
      logLines.push("📝 Texte   : " + messageText);
    } else if (viewOnce) {
      logLines.push("📎 Média   : contenu vue unique (" + contentType + ")");
    }
    if (quotedInfo) {
      const quotedAuthor = quotedAuthorJid ? "@" + quotedAuthorJid.split("@")[0] : "inconnu";
      logLines.push("↩️ Réponse  : à " + quotedInfo.type + (quotedInfo.viewOnce ? " 👁️ (vue unique)" : "") + " de " + quotedAuthor);
    }
    logLines.push("━━━━━━━━━━━━━━━━━━━━━━━", "");
    console.log(logLines.join("\n"));
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
      isOwner,
      isSudo,
      isStaff,
      ownerJid,
      sudoJids,
      privilegedJids,
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
        if (config.MODE !== "public" && !isStaff && !isPublicCmd) {
          return;
        }
        if (config.MODE === "public" && !isStaff && isPrivateCmd) {
          return;
        }
        if (isRestrictedGroup(chatJid, config) && !canUseRestrictedGroup(senderJid, isStaff, config)) {
          return;
        }
        if (!isStaff && (await isBanned("user", senderJid))) {
          return;
        }
        if (!isStaff && isGroup && (await isBanned("group", chatJid))) {
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
      if (!skipReact && resolveCommandReactEnabled(config)) {
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
    if (!shouldRunHandlersInRestrictedGroup(chatJid, senderJid, isStaff, config)) {
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
