'use strict';

const fancy = require('../../lib/style');
const config = require('../../set');
const fs = require('fs');
const axios = require('axios');
const { levels } = require('../../database/levels');
const { Ranks } = require('../../database/rank');

module.exports = { fancy, config, fs, axios, levels, Ranks };
