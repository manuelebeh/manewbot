'use strict';

const config = require('../../set');
const { translate } = require('@vitalets/google-translate-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { WA_CONF } = require('../../database/wa_conf');
const { TempMail } = require('tempmail.lol');
const { spawn } = require('child_process');
const AdmZip = require('adm-zip');
const os = require('os');
const pkg = require('../../package');
const { buildForwardContextInfo } = require('../../lib/forward-context');

const prefixe = config.PREFIXE;
const contextInfo = buildForwardContextInfo();

function stylize(text) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const digits = '0123456789';
  return text
    .split('')
    .map((char) => {
      const index = alphabet.indexOf(char);
      if (index !== -1) return digits[index];
      return char;
    })
    .join('');
}

module.exports = {
  config,
  translate,
  prefixe,
  axios,
  fs,
  path,
  os,
  WA_CONF,
  TempMail,
  spawn,
  AdmZip,
  pkg,
  stylize,
  contextInfo,
};
