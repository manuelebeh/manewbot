'use strict';

const BLOCKED_HOSTS = new Set([
  'localhost',
  'metadata.google.internal',
  'metadata.google',
]);

function isPrivateIpv4(host) {
  const m = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function isBlockedHostname(host) {
  const h = host.toLowerCase().replace(/\.$/, '');
  if (BLOCKED_HOSTS.has(h)) return true;
  if (h.endsWith('.local')) return true;
  if (h === '::1' || h.startsWith('fe80:') || h.startsWith('fc') || h.startsWith('fd')) {
    return true;
  }
  return isPrivateIpv4(h);
}

/**
 * Validates a user URL for outbound fetch (capture, etc.).
 * @returns {{ ok: true, href: string } | { ok: false, reason: string }}
 */
function validatePublicHttpUrl(input) {
  if (!input || typeof input !== 'string') {
    return { ok: false, reason: 'URL invalide.' };
  }
  let href = input.trim();
  if (!/^https?:\/\//i.test(href)) {
    href = 'https://' + href;
  }
  let parsed;
  try {
    parsed = new URL(href);
  } catch {
    return { ok: false, reason: 'URL invalide.' };
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, reason: 'Seuls http et https sont autorisés.' };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, reason: 'URL avec identifiants interdite.' };
  }
  if (isBlockedHostname(parsed.hostname)) {
    return { ok: false, reason: 'Hôte non autorisé (réseau privé ou local).' };
  }
  return { ok: true, href: parsed.href };
}

/** HTTPS URL from an external API before sendMessage({ url }). */
function validateRemoteMediaUrl(input) {
  const check = validatePublicHttpUrl(input);
  if (!check.ok) {
    return check;
  }
  if (!check.href.startsWith('https://')) {
    return { ok: false, reason: 'URL média non HTTPS.' };
  }
  return check;
}

function resolveAndValidateUrl(baseHref, relativeOrAbsolute) {
  if (!relativeOrAbsolute || typeof relativeOrAbsolute !== 'string') {
    return { ok: false, reason: 'URL invalide.' };
  }
  let resolved;
  try {
    resolved = new URL(relativeOrAbsolute.trim(), baseHref).href;
  } catch {
    return { ok: false, reason: 'URL invalide.' };
  }
  return validatePublicHttpUrl(resolved);
}

module.exports = {
  validatePublicHttpUrl,
  validateRemoteMediaUrl,
  resolveAndValidateUrl,
  isBlockedHostname,
};
