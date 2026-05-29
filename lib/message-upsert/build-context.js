'use strict';

const { decodeJid } = require('../jid');
const { getJid } = require('../../events/message_upsert_events/cache_jid');
const config = require('../../set');
const {
  getOwnerJid,
  getSudoOnlyJids,
  getPrivilegedJids,
} = require('../parse-env-lists');
const { logIncomingMessage } = require('../bot-log');
const {
  resolveMessageContent,
  getQuotedMessageInfo,
  getSudoUsers,
} = require('./helpers');

/**
 * Parse one incoming notify message into command context (owerlap) and metadata.
 */
async function buildMessageUpsertContext(msg, sock) {
  const resolvedMessage = resolveMessageContent(msg.message);
  const contentType = resolvedMessage.contentType;
  const viewOnce = resolvedMessage.viewOnce;
  msg.message = resolvedMessage.message;

  const messageText =
    {
      conversation: msg.message.conversation,
      imageMessage: msg.message.imageMessage?.caption,
      videoMessage: msg.message.videoMessage?.caption,
      extendedTextMessage: msg.message.extendedTextMessage?.text,
      buttonsResponseMessage:
        msg.message.buttonsResponseMessage?.selectedButtonId,
      listResponseMessage:
        msg.message.listResponseMessage?.singleSelectReply?.selectedRowId,
      messageContextInfo:
        msg.message.buttonsResponseMessage?.selectedButtonId ||
        msg.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
        msg.text,
    }[contentType] || '';

  const botJid = decodeJid(sock.user.id);
  const botNumber = botJid.split('@')[0];
  const chatJid =
    (msg.key.remoteJidAlt || msg.key.remoteJid) === decodeJid(sock.user.lid)
      ? botJid
      : msg.key.remoteJidAlt || msg.key.remoteJid;
  const isGroup = chatJid.endsWith('@g.us');
  const groupMeta = isGroup ? await sock.groupMetadata(chatJid) : {};
  groupMeta.participants &&= groupMeta.participants.map((participant) => ({
    ...participant,
    jid: participant.phoneNumber,
  }));
  const groupName = groupMeta.subject || '';
  const participants = isGroup ? groupMeta.participants : [];
  const groupAdminJids = participants
    .filter((member) => member.admin)
    .map((member) => member.jid);
  const isBotAdmin = isGroup && groupAdminJids.includes(botJid);
  const senderJid = isGroup
    ? await getJid(
        decodeJid(msg.key.participantAlt || msg.key.participant),
        chatJid,
        sock
      )
    : msg.key.fromMe
      ? botJid
      : decodeJid(
          msg.key.remoteJidAlt ||
            msg.key.participantAlt ||
            msg.key.participant ||
            msg.key.senderPn ||
            msg.key.remoteJid
        );
  const quotedMessage = msg.message?.[contentType]?.contextInfo?.quotedMessage;
  const quoteContext = msg.message?.[contentType]?.contextInfo;
  const quotedParticipant = msg.message?.[contentType]?.contextInfo?.participant;
  const quotedAuthorJid =
    quotedParticipant == decodeJid(sock.user.lid)
      ? botJid
      : await getJid(decodeJid(quotedParticipant), chatJid, sock);
  const mentionedJids =
    msg.message?.[contentType]?.contextInfo?.mentionedJid || [];
  const resolvedMentions = await Promise.all(
    mentionedJids.map((jid) => getJid(jid, chatJid, sock))
  );
  const pushName = msg.pushName;
  const isCommand = messageText.trimStart().startsWith(config.PREFIXE);
  const args = isCommand
    ? messageText
        .trimStart()
        .slice(config.PREFIXE.length)
        .trimStart()
        .split(/ +/)
        .slice(1)
    : [];
  const commandName = isCommand
    ? messageText.slice(config.PREFIXE.length).trim().split(/ +/)[0].toLowerCase()
    : '';
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
    return sock.sendMessage(jid, { text }, { quoted: msg });
  };
  const sourceLabel = isGroup ? '👥 ' + groupName : '💬 Privé';
  const quotedInfo = getQuotedMessageInfo(quotedMessage);
  logIncomingMessage({
    pushName,
    senderJid,
    sourceLabel,
    contentType,
    viewOnce,
    messageText,
    quotedInfo,
    quotedAuthorJid,
  });

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
    quote: quoteContext,
  };

  return {
    contentType,
    messageText,
    chatJid,
    botJid,
    isGroup,
    isOwner,
    isStaff,
    isAdmin,
    senderJid,
    pushName,
    repondre,
    resolvedMentions,
    commandName,
    isCommand,
    owerlap,
  };
}

module.exports = { buildMessageUpsertContext };
