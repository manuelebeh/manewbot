'use strict';

const config = require('../../set');
const { getAiBases, aiNotConfiguredMessage } = require('../../lib/ai-api');
const axios = require('axios');

function requirePrompt(arg, repondre) {
  if (!arg.length) {
    repondre('Veuillez entrer un prompt.');
    return null;
  }
  return arg.join(' ');
}

module.exports = {
  config,
  getAiBases,
  aiNotConfiguredMessage,
  axios,
  requirePrompt,
};
