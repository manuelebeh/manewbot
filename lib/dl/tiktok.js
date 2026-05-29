'use strict';

const axios = require('axios');
const cheerio = require('cheerio');
const cookie = require('cookie');
const config = require('../../set');

async function ttdl(tiktokUrl) {
  let attempt = 0;
  let lastError;
  while (attempt < 5) {
    try {
      const pageResponse = await axios.get(config.SSSTIK_BASE_URL + '/fr', {
        headers: {
          accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
          'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
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
      const { data: postHtml } = await axios.post(
        config.SSSTIK_BASE_URL + '/abc?url=dl',
        new URLSearchParams({ id: tiktokUrl, locale: 'fr', tt: csrfToken }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept-language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            cookie: cookieHeader,
            'User-Agent': 'GoogleBot',
          },
        }
      );
      const $result = cheerio.load(postHtml);
      const noWatermark =
        $result('a.download_link.without_watermark').attr('href') ||
        $result('a.slides_video').attr('href') ||
        null;
      const mp3 = $result('a.download_link.music').attr('href') || null;
      const slides = [];
      $result('a.download_link.slide').each((_, el) => {
        const slideUrl = $result(el).attr('href');
        if (slideUrl) slides.push(slideUrl);
      });
      return { noWatermark, mp3, slides };
    } catch (err) {
      lastError = err;
      attempt++;
      if (attempt < 5) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }
  throw new Error('Échec après 5 tentatives : ' + lastError);
}

module.exports = { ttdl };
