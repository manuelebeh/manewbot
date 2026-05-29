'use strict';

const { apply, list } = require('./style-apply');
const maps = require('./style-maps');

module.exports = { ...maps, apply, list };
