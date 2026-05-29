'use strict';

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
