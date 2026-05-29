'use strict';

function parseCommaList(value) {
  if (value == null || value === '') return [];
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parsePhoneList(value) {
  return parseCommaList(value)
    .map((s) => s.replace(/\D/g, ''))
    .filter(Boolean);
}

function toWhatsAppJid(entry) {
  const trimmed = String(entry).trim();
  if (trimmed.includes('@')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  return digits ? `${digits}@s.whatsapp.net` : '';
}

function phonesToJids(phones) {
  return phones
    .map((n) => toWhatsAppJid(n))
    .filter(Boolean);
}

function entriesToJids(value) {
  return parseCommaList(value).map(toWhatsAppJid).filter(Boolean);
}

function getDevNumbers(config) {
  return parsePhoneList(config.DEV_NUMBERS);
}

function getDevJids(config) {
  return phonesToJids(getDevNumbers(config));
}

function getRestrictedGroups(config) {
  return parseCommaList(config.RESTRICTED_GROUPS);
}

function getRestrictedGroupAllowJids(config) {
  return entriesToJids(config.RESTRICTED_GROUP_ALLOWLIST);
}

function getBlockedAutoreactGroups(config) {
  return parseCommaList(config.BLOCKED_AUTOREACT_GROUPS);
}

function isRestrictedGroup(chatJid, config) {
  return getRestrictedGroups(config).includes(chatJid);
}

function canUseRestrictedGroup(senderJid, isDev, config) {
  if (isDev) return true;
  return getRestrictedGroupAllowJids(config).includes(senderJid);
}

function shouldRunHandlersInRestrictedGroup(chatJid, senderJid, botJid, isDev, devJids, config) {
  if (!isRestrictedGroup(chatJid, config)) return true;
  return (
    isDev ||
    getRestrictedGroupAllowJids(config).includes(senderJid) ||
    devJids.includes(botJid)
  );
}

module.exports = {
  parseCommaList,
  parsePhoneList,
  phonesToJids,
  entriesToJids,
  getDevNumbers,
  getDevJids,
  getRestrictedGroups,
  getRestrictedGroupAllowJids,
  getBlockedAutoreactGroups,
  isRestrictedGroup,
  canUseRestrictedGroup,
  shouldRunHandlersInRestrictedGroup,
};
