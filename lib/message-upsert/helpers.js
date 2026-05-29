'use strict';

const { getContentType } = require('@whiskeysockets/baileys');
const { Bans } = require('../../database/ban');
const { Sudo } = require('../../database/sudo');

const VIEW_ONCE_MEDIA_KEYS = [
  'imageMessage',
  'videoMessage',
  'audioMessage',
  'stickerMessage',
  'documentMessage',
];

function hasViewOnceFlag(messageContent) {
  if (!messageContent) return false;
  return VIEW_ONCE_MEDIA_KEYS.some((key) => messageContent[key]?.viewOnce === true);
}

function resolveMessageContent(message) {
  let contentType = getContentType(message);
  let viewOnce = contentType?.startsWith('viewOnce') || hasViewOnceFlag(message);
  if (contentType?.startsWith('viewOnce')) {
    const viewOnceInner = message[contentType]?.message;
    if (viewOnceInner) {
      contentType = getContentType(viewOnceInner);
      return {
        contentType,
        viewOnce: true,
        message: { ...message, ...viewOnceInner },
      };
    }
  }
  return { contentType, viewOnce, message };
}

function getQuotedMessageInfo(quotedMessage) {
  if (!quotedMessage) return null;
  const viewOnceKey = Object.keys(quotedMessage).find((key) =>
    key.startsWith('viewOnceMessage')
  );
  const innerMessage = viewOnceKey
    ? quotedMessage[viewOnceKey]?.message
    : quotedMessage;
  if (!innerMessage) return null;
  const quotedType = getContentType(innerMessage) || 'message';
  const quotedViewOnce = !!viewOnceKey || hasViewOnceFlag(innerMessage);
  return { type: quotedType, viewOnce: quotedViewOnce };
}

async function getSudoUsers() {
  try {
    const sudoRecords = await Sudo.findAll({ attributes: ['id'] });
    return sudoRecords.map((record) =>
      record.id.replace(/@s\.whatsapp\.net$/, '')
    );
  } catch {
    return [];
  }
}

async function isBanned(type, id) {
  const ban = await Bans.findOne({ where: { id, type } });
  return !!ban;
}

module.exports = {
  VIEW_ONCE_MEDIA_KEYS,
  hasViewOnceFlag,
  resolveMessageContent,
  getQuotedMessageInfo,
  getSudoUsers,
  isBanned,
};
