'use strict';

function trimBase(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}

function getAiBases(config) {
  const elite = trimBase(config.AI_API_BASE);
  const toxxic = trimBase(config.AI_TOXXIC_API_BASE);
  const llama = trimBase(config.AI_LLAMA_API_BASE);
  const sswweb = trimBase(config.SSWEB_API_BASE) || elite;
  return { elite, toxxic, llama, sswweb };
}

function aiNotConfiguredMessage(envKey) {
  return `❗ Service non configuré — définissez ${envKey} dans .env`;
}

function buildEliteUrl(base, pathAndQuery) {
  return `${base}${pathAndQuery.startsWith('/') ? '' : '/'}${pathAndQuery}`;
}

module.exports = {
  getAiBases,
  aiNotConfiguredMessage,
  buildEliteUrl,
};
