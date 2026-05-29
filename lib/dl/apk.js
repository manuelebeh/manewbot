'use strict';

const axios = require('axios');
const config = require('../../set');

function formatSize(bytes) {
  if (!bytes) return '0 MB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

async function apkdl(query, limit = 1) {
  const { data: searchData } = await axios.get(config.APTOIDE_SEARCH_URL, {
    params: { query, limit },
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
      'User-Agent': 'GoogleBot',
    },
  });
  const apps = searchData?.datalist?.list || [];
  return apps.map((app) => ({
    name: app.name,
    icon: app.icon,
    size: formatSize(app.file?.filesize),
    dllink: app.file?.path,
    package: app.package,
    lastup: app.updated || 'N/A',
  }));
}

module.exports = { apkdl, formatSize };
