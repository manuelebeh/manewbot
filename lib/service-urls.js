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
  };
}

function serviceNotConfiguredMessage(envKey) {
  return `❗ Service non configuré — définissez ${envKey} dans .env`;
}

module.exports = {
  trimBase,
  getServiceUrls,
  serviceNotConfiguredMessage,
};
