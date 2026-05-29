'use strict';

const MIME_TO_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'video/mp4': 'mp4',
  'video/3gpp': '3gp',
  'audio/ogg': 'ogg',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'application/pdf': 'pdf',
  'application/octet-stream': 'bin',
};

function extensionFromMime(mimetype) {
  const base = String(mimetype || '')
    .split(';')[0]
    .trim()
    .toLowerCase();
  if (!base) return 'bin';
  if (MIME_TO_EXT[base]) return MIME_TO_EXT[base];
  const sub = base.split('/')[1];
  if (!sub) return 'bin';
  return sub.replace(/[^a-z0-9+.-]/gi, '') || 'bin';
}

module.exports = { extensionFromMime, MIME_TO_EXT };
