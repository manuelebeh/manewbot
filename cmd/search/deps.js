'use strict';

const axios = require('axios');
const wiki = require('wikipedia');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const config = require('../../set');
const { translate } = require('@vitalets/google-translate-api');
const FormData = require('form-data');
const { ytdl } = require('../../lib/dl');
const acrcloud = require('acrcloud');
const fs = require('fs');

async function searchImages(query) {
  try {
    const ddgBase = (config.DUCKDUCKGO_BASE || 'https://duckduckgo.com').replace(/\/$/, '');
    const homePage = await axios.get(ddgBase + '/', {
      params: { q: query },
      headers: { 'user-agent': 'Mozilla/5.0' },
    });
    const html = homePage.data;
    let vqdToken;
    const vqdPatterns = [/vqd="(.*?)"/, /vqd='(.*?)'/, /"vqd":"(.*?)"/, /vqd=([\d-]+)\&/];
    for (const pattern of vqdPatterns) {
      const match = html.match(pattern);
      if (match) {
        vqdToken = match[1];
        break;
      }
    }
    if (!vqdToken) throw new Error('Impossible de récupérer le token');
    const imageResponse = await axios.get(ddgBase + '/i.js', {
      params: { q: query, vqd: vqdToken, o: 'json', l: 'fr-fr', p: '1' },
      headers: {
        referer: ddgBase + '/',
        'user-agent': 'Mozilla/5.0',
        'x-requested-with': 'XMLHttpRequest',
      },
    });
    return imageResponse.data.results || [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

const acr =
  config.ACRCLOUD_ACCESS_KEY && config.ACRCLOUD_ACCESS_SECRET
    ? new acrcloud({
        host: config.ACRCLOUD_HOST,
        access_key: config.ACRCLOUD_ACCESS_KEY,
        access_secret: config.ACRCLOUD_ACCESS_SECRET,
      })
    : null;

module.exports = {
  axios,
  wiki,
  Sticker,
  StickerTypes,
  config,
  translate,
  FormData,
  ytdl,
  fs,
  searchImages,
  acr,
};
