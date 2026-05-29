'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'cmd');

const SPLITS = {
  jeux: {
    src: 'jeux.js',
    files: [
      { out: 'tictactoe.js', start: 11, end: 186 },
      { out: 'anime-quizz.js', start: 188, end: 312 },
      { out: 'dmots.js', start: 313, end: 564 },
      { out: 'wcg.js', start: 565, end: 912 },
    ],
    index: ['tictactoe', 'anime-quizz', 'dmots', 'wcg'],
  },
  search: {
    src: 'search.js',
    files: [
      { out: 'img.js', start: 64, end: 127 },
      { out: 'web.js', start: 128, end: 268 },
      { out: 'entertainment.js', start: 269, end: 549 },
      { out: 'shazam.js', start: 557, end: 612 },
    ],
    index: ['img', 'web', 'entertainment', 'shazam'],
  },
  telechargement: {
    src: 'telechargement.js',
    files: [
      { out: 'youtube.js', start: 36, end: 198 },
      { out: 'facebook.js', start: 199, end: 250 },
      { out: 'tiktok.js', start: 251, end: 398 },
      { out: 'instagram-twitter.js', start: 399, end: 490 },
      { out: 'apk.js', start: 491, end: 553 },
    ],
    index: ['youtube', 'facebook', 'tiktok', 'instagram-twitter', 'apk'],
  },
  economie: {
    src: 'economie.js',
    files: [
      { out: 'wallet.js', start: 20, end: 153 },
      { out: 'banking.js', start: 176, end: 272 },
      { out: 'games.js', start: 273, end: 461 },
      { out: 'admin.js', start: 462, end: 514 },
    ],
    index: ['wallet', 'banking', 'games', 'admin'],
  },
  fun: {
    src: 'fun.js',
    files: [
      { out: 'text.js', start: 14, end: 181 },
      { out: 'quotes.js', start: 182, end: 249 },
      { out: 'ranks.js', start: 250, end: 381 },
      { out: 'fake.js', start: 382, end: 423 },
    ],
    index: ['text', 'quotes', 'ranks', 'fake'],
  },
};

function linesSlice(lines, start, end) {
  return lines.slice(start - 1, end).join('\n');
}

function buildShared(moduleName) {
  switch (moduleName) {
    case 'jeux':
      return `'use strict';

const { registerCommand } = require('../../lib/commands');
const axios = require('axios');
const { delay } = require('@whiskeysockets/baileys');
const config = require('../../set');
const fs = require('fs');

const activeGames = {};

module.exports = {
  registerCommand,
  axios,
  delay,
  config,
  fs,
  activeGames,
};
`;
    case 'search':
      return `'use strict';

const { registerCommand } = require('../../lib/commands');
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
    const homePage = await axios.get('https://duckduckgo.com/', {
      params: { q: query },
      headers: { 'user-agent': 'Mozilla/5.0' },
    });
    const html = homePage.data;
    let vqdToken;
    const vqdPatterns = [/vqd="(.*?)"/, /vqd='(.*?)'/, /"vqd":"(.*?)"/, /vqd=([\\d-]+)\\&/];
    for (const pattern of vqdPatterns) {
      const match = html.match(pattern);
      if (match) {
        vqdToken = match[1];
        break;
      }
    }
    if (!vqdToken) throw new Error('Impossible de récupérer le token');
    const imageResponse = await axios.get('https://duckduckgo.com/i.js', {
      params: { q: query, vqd: vqdToken, o: 'json', l: 'fr-fr', p: '1' },
      headers: {
        referer: 'https://duckduckgo.com/',
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
  registerCommand,
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
`;
    case 'telechargement':
      return `'use strict';

const { registerCommand } = require('../../lib/commands');
const { fbdl, ttdl, igdl, twitterdl, ytdl, apkdl } = require('../../lib/dl');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

function resolveArgsWithLink(arg, msg_Repondu) {
  let commandArgs = arg;
  if (!commandArgs.length && msg_Repondu) {
    const repliedText =
      msg_Repondu.conversation || msg_Repondu.extendedTextMessage?.text || '';
    if (typeof repliedText === 'string') {
      const words = repliedText.split(/ +/);
      const urlToken = words.find((word) => word.startsWith('https'));
      if (urlToken) commandArgs = [urlToken];
    }
  }
  return commandArgs;
}

async function extractLink(arg, msg_Repondu) {
  const commandArgs = resolveArgsWithLink(arg, msg_Repondu);
  return commandArgs.join(' ');
}

module.exports = {
  registerCommand,
  fbdl,
  ttdl,
  igdl,
  twitterdl,
  ytdl,
  apkdl,
  axios,
  fs,
  path,
  resolveArgsWithLink,
  extractLink,
};
`;
    case 'economie':
      return `'use strict';

const { registerCommand } = require('../../lib/commands');
const {
  modifierSolde,
  getInfosUtilisateur,
  resetEconomie,
  mettreAJourCapaciteBanque,
  ECONOMIE,
  TopBanque,
} = require('../../database/economie');
const crypto = require('crypto');

function generateUserId(jid) {
  const hash = crypto.createHash('md5').update(jid).digest('hex');
  return 'User-' + hash.slice(0, 6);
}

function generateTransactionId() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

const prixCapacite = {
  1: { montant: 10000, capacite: 100000 },
  2: { montant: 100000, capacite: 1000000 },
  3: { montant: 1000000, capacite: 10000000 },
  4: { montant: 10000000, capacite: 100000000 },
  5: { montant: 100000000, capacite: 1000000000 },
};

module.exports = {
  registerCommand,
  modifierSolde,
  getInfosUtilisateur,
  resetEconomie,
  mettreAJourCapaciteBanque,
  ECONOMIE,
  TopBanque,
  generateUserId,
  generateTransactionId,
  prixCapacite,
};
`;
    case 'fun':
      return `'use strict';

const { registerCommand } = require('../../lib/commands');
const fancy = require('../../lib/style');
const config = require('../../set');
const fs = require('fs');
const axios = require('axios');
const { levels } = require('../../database/levels');
const { Ranks } = require('../../database/rank');

module.exports = {
  registerCommand,
  fancy,
  config,
  fs,
  axios,
  levels,
  Ranks,
};
`;
    default:
      throw new Error('unknown module ' + moduleName);
  }
}

function getFileHeader(moduleName, outFile) {
  const map = {
    jeux: {
      'tictactoe.js': 'registerCommand, axios, config, fs, activeGames',
      'anime-quizz.js': 'registerCommand, delay, fs',
      'dmots.js': 'registerCommand, fs',
      'wcg.js': 'registerCommand',
    },
    search: {
      'img.js': 'registerCommand, axios, config, searchImages',
      'web.js': 'registerCommand, axios, config, wiki, translate',
      'entertainment.js':
        'registerCommand, axios, config, translate, Sticker, StickerTypes',
      'shazam.js': 'registerCommand, config, ytdl, fs, acr',
    },
    telechargement: {
      'youtube.js': 'registerCommand, ytdl, axios, resolveArgsWithLink',
      'facebook.js': 'registerCommand, fbdl, axios, resolveArgsWithLink',
      'tiktok.js': 'registerCommand, ttdl, axios, extractLink',
      'instagram-twitter.js':
        'registerCommand, igdl, twitterdl, axios, resolveArgsWithLink',
      'apk.js': 'registerCommand, apkdl, axios, fs',
    },
    economie: {
      'wallet.js':
        'registerCommand, getInfosUtilisateur, modifierSolde, resetEconomie, generateUserId, generateTransactionId, TopBanque',
      'banking.js':
        'registerCommand, getInfosUtilisateur, modifierSolde, mettreAJourCapaciteBanque, prixCapacite',
      'games.js': 'registerCommand, getInfosUtilisateur, modifierSolde, ECONOMIE',
      'admin.js':
        'registerCommand, getInfosUtilisateur, modifierSolde, ECONOMIE, generateUserId',
    },
    fun: {
      'text.js': 'registerCommand, config, fancy, axios',
      'quotes.js': 'registerCommand, axios',
      'ranks.js': 'registerCommand, levels, Ranks',
      'fake.js': 'registerCommand',
    },
  };
  const keys = map[moduleName][outFile];
  return `const {\n  ${keys.split(', ').join(',\n  ')},\n} = require('./_shared');\n\n`;
}

for (const [moduleName, spec] of Object.entries(SPLITS)) {
  const srcPath = path.join(ROOT, spec.src);
  const outDir = path.join(ROOT, moduleName);
  const lines = fs.readFileSync(srcPath, 'utf8').split('\n');

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, '_shared.js'), buildShared(moduleName));

  for (const file of spec.files) {
    const content =
      "'use strict';\n\n" +
      getFileHeader(moduleName, file.out) +
      linesSlice(lines, file.start, file.end) +
      '\n';
    fs.writeFileSync(path.join(outDir, file.out), content);
  }

  const indexLines = ["'use strict';", ''];
  for (const stem of spec.index) {
    indexLines.push(`require('./${moduleName}/${stem}');`);
  }
  fs.writeFileSync(path.join(ROOT, `${moduleName}.js`), indexLines.join('\n') + '\n');
  console.log(`✓ ${moduleName}/`);
}

console.log('Done.');
