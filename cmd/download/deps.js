'use strict';

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../../set');
const { fbdl, ttdl, igdl, twitterdl, ytdl, apkdl } = require('../../lib/dl');
const {
  buildYoutubeDownloadUrl,
  serviceNotConfiguredMessage,
} = require('../../lib/service-urls');

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
  config,
  buildYoutubeDownloadUrl,
  serviceNotConfiguredMessage,
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
