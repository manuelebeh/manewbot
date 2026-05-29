'use strict';

function parseCommaList(value) {
  if (value == null || value === '') return [];
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function toWhatsAppJid(entry) {
  const trimmed = String(entry).trim();
  if (trimmed.includes('@')) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  return digits ? `${digits}@s.whatsapp.net` : '';
}

function entriesToJids(value) {
  return parseCommaList(value).map(toWhatsAppJid).filter(Boolean);
}

function getOwnerJid(config) {
  return config.NUMERO_OWNER ? toWhatsAppJid(config.NUMERO_OWNER) : '';
}

/** Sudo utilisateurs enregistrés via setsudo (sans owner ni bot). */
function getSudoOnlyJids(sudoUsers = []) {
  return sudoUsers.map(toWhatsAppJid).filter(Boolean);
}

/** Owner + bot + sudo — immunités modération vis-à-vis des membres normaux. */
function getPrivilegedJids(config, botNumber, sudoUsers = []) {
  return [botNumber, config.NUMERO_OWNER, ...sudoUsers]
    .filter(Boolean)
    .map(toWhatsAppJid)
    .filter(Boolean);
}

/** Kick / ban / warn / demote : seul l'owner peut cibler un sudo ; personne ne cible l'owner. */
function canModerateTarget(actorIsOwner, targetJid, ownerJid, sudoOnlyJids) {
  if (ownerJid && targetJid === ownerJid) return false;
  if (sudoOnlyJids.includes(targetJid)) return actorIsOwner;
  return true;
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

function canUseRestrictedGroup(senderJid, isPrivileged, config) {
  if (isPrivileged) return true;
  return getRestrictedGroupAllowJids(config).includes(senderJid);
}

function shouldRunHandlersInRestrictedGroup(chatJid, senderJid, isPrivileged, config) {
  if (!isRestrictedGroup(chatJid, config)) return true;
  return canUseRestrictedGroup(senderJid, isPrivileged, config);
}

module.exports = {
  parseCommaList,
  entriesToJids,
  getOwnerJid,
  getSudoOnlyJids,
  getPrivilegedJids,
  canModerateTarget,
  getRestrictedGroups,
  getRestrictedGroupAllowJids,
  getBlockedAutoreactGroups,
  isRestrictedGroup,
  canUseRestrictedGroup,
  shouldRunHandlersInRestrictedGroup,
};
