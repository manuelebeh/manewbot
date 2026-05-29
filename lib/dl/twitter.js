'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../set');

async function twitterdl(tweetUrl, maxRetries = 5) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      attempt++;
      const response = await axios.get(
        config.TWITSAVE_BASE_URL + '/info?url=' + tweetUrl,
        {
          headers: {
            accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'accept-language': 'en-US,en;q=0.9,id;q=0.8',
            'user-agent': 'GoogleBot',
          },
        }
      );
      const $ = cheerio.load(response.data);
      const videoUrl = $('video').attr('src');
      if (videoUrl) {
        return {
          status: response.status,
          result: { video: videoUrl },
        };
      }
      throw new Error('Lien vidéo introuvable.');
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

module.exports = { twitterdl };
