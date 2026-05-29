'use strict';

const { registerCommand } = require('../../lib/commands');
const { WA_CONF } = require('../../database/wa_conf');
const config = require('../../set');

module.exports = { registerCommand, WA_CONF, config };
