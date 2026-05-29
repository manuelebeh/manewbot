'use strict';

const axios = require('axios');
const { delay } = require('@whiskeysockets/baileys');
const config = require('../../set');
const fs = require('fs');

const activeGames = {};

module.exports = { axios, delay, config, fs, activeGames };
