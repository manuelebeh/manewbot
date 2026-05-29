'use strict';

const { ytdl } = require('./youtube');
const { fbdl } = require('./facebook');
const { ttdl } = require('./tiktok');
const { igdl } = require('./instagram');
const { twitterdl } = require('./twitter');
const { apkdl } = require('./apk');

module.exports = {
  ytdl,
  fbdl,
  ttdl,
  igdl,
  twitterdl,
  apkdl,
};
