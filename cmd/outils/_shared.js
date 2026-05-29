'use strict';

const { registerCommand, cmd } = require('../../lib/commands');
const config = require('../../set');
const { translate } = require('@vitalets/google-translate-api');
const prefixe = config.PREFIXE;
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { WA_CONF } = require('../../database/wa_conf');
const { TempMail } = require('tempmail.lol');
const JavaScriptObfuscator = require('javascript-obfuscator');
const { spawn } = require('child_process');
const AdmZip = require('adm-zip');
const os = require('os');
const pkg = require('../../package');

function stylize(text) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const digits = '0123456789';
  return text.split('').map((char) => {
    const index = alphabet.indexOf(char);
    if (index !== -1) return digits[index];
    return char;
  }).join('');
}

const contextInfo = {
  forwardingScore: 1,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363371282577847@newsletter',
    newsletterName: 'ᴏᴠʟ-ᴍᴅ-ᴠ𝟸',
  },
};

module.exports = {
  registerCommand,
  cmd,
  fs,
  path,
  os,
  axios,
  config,
  translate,
  prefixe,
  WA_CONF,
  TempMail,
  JavaScriptObfuscator,
  spawn,
  AdmZip,
  pkg,
  stylize,
  contextInfo,
};
