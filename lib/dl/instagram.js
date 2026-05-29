'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const cookie = require('cookie');
const config = require('../../set');

async function igdl(instagramUrl, maxRetries = 5) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      attempt++;
      const pageResponse = await axios.get(config.DOWNLOADGRAM_BASE_URL + '/', {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'accept-language': 'en-US,en;q=0.9,id;q=0.8',
          'user-agent': 'GoogleBot',
        },
        maxRedirects: 5,
      });
      const setCookieHeaders = pageResponse.headers['set-cookie'] || [];
      const parsedCookies = setCookieHeaders
        .map((rawCookie) => cookie.parse(rawCookie))
        .reduce((acc, parsed) => ({ ...acc, ...parsed }), {});
      const $page = cheerio.load(pageResponse.data);
      const csrfToken = $page('#token').attr('value');
      const cookieHeader = Object.entries({
        __cfduid: parsedCookies.__cfduid || '',
        PHPSESSID: parsedCookies.PHPSESSID || '',
      })
        .map(([name, value]) => cookie.serialize(name, value))
        .join('; ');
      const apiResponse = await axios.post(
        config.DOWNLOADGRAM_API_URL,
        new URLSearchParams({ url: instagramUrl, v: '3', lang: 'en' }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'GoogleBot',
            cookie: cookieHeader,
          },
        }
      );
      const $result = cheerio.load(apiResponse.data);
      let videoUrl = $result('video source').attr('src');
      if (videoUrl) {
        videoUrl = videoUrl.replace(/^\\\"|\\\"$/g, '');
        return {
          status: apiResponse.status,
          result: { video: videoUrl },
        };
      }
      throw new Error('Lien de vidéo introuvable.');
    } catch (err) {
      if (attempt >= maxRetries) throw err;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

module.exports = { igdl };
