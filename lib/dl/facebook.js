'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../set');

async function fbdl(videoId) {
  try {
    const response = await axios.post(
      config.GETMYFB_PROCESS_URL,
      new URLSearchParams({ id: videoId, locale: 'en' }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'user-agent': 'GoogleBot',
        },
      }
    );
    const $ = cheerio.load(response.data);
    const downloadUrl = $('.results-list-item a').first().attr('href');
    return downloadUrl || 'Aucun lien de téléchargement trouvé.';
  } catch (err) {
    return 'Erreur : ' + err.message;
  }
}

module.exports = { fbdl };
