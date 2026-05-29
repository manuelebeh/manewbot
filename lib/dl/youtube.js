'use strict';

const axios = require('axios');
const config = require('../../set');
const { trimBase } = require('../service-urls');

const ytdl = async (url, format = 'video') => {
  try {
    const base = trimBase(config.YOUTUBE_DL_API_BASE);
    if (!base) {
      console.error('YOUTUBE_DL_API_BASE non configuré');
      return null;
    }
    const response = await axios.get(base + '/youtube', {
      params: { url, format },
    });
    if (!response.data || !response.data.status) {
      return null;
    }
    return response.data.data;
  } catch (err) {
    console.error('Erreur lors de la récupération via Vercel:', err.message);
    return null;
  }
};

module.exports = { ytdl };
