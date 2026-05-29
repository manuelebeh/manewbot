'use strict';

function trimBase(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function getServiceUrls(config) {
  return {
    ovl: trimBase(config.OVL_API_BASE),
    remini: trimBase(config.REMINI_API_BASE),
    quotely: trimBase(config.QUOTELY_API_BASE),
    vyro: trimBase(config.VYRO_API_BASE),
    ezgif: trimBase(config.EZGIF_API_BASE) || 'https://ezgif.com',
    youtubeDl: trimBase(config.YOUTUBE_DL_API_BASE),
    lyrics: trimBase(config.LYRICS_API_BASE),
  };
}

/** URL de téléchargement média YouTube (proxy YOUTUBE_DL_API_BASE). */
function buildYoutubeDownloadUrl(config, downloadPath) {
  const base = trimBase(config.YOUTUBE_DL_API_BASE);
  if (!base) return null;
  return `${base}/youtube/download?url=${encodeURIComponent(downloadPath)}`;
}

function serviceNotConfiguredMessage(envKey) {
  return `❗ Service non configuré — définissez ${envKey} dans .env`;
}

module.exports = {
  trimBase,
  getServiceUrls,
  serviceNotConfiguredMessage,
  buildYoutubeDownloadUrl,
};
