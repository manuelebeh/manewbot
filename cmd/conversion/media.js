'use strict';

const fs = require('fs');
const { readFileSync } = require('fs');
const path = require('path');
const os = require('os');
const axios = require('axios');
const FormData = require('form-data');
const { spawn } = require('child_process');
const { saveSpeechToFile } = require('../../lib/google-tts');
const sharp = require('sharp');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const config = require('../../set');
const { Ranks } = require('../../database/rank');
const { getServiceUrls } = require('../../lib/service-urls');

const fusionCache = {};

async function uploadToCatbox(filePath) {
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', fs.createReadStream(filePath));
    const response = await axios.post(config.CATBOX_UPLOAD_URL, formData, {
      headers: formData.getHeaders(),
    });
    return response.data;
  } catch (err) {
    console.error('Erreur lors de l\'upload sur Catbox:', err);
    throw new Error('Une erreur est survenue lors de l\'upload du fichier.');
  }
}

const alea = (suffix) => '' + Math.floor(Math.random() * 10000) + suffix;

const isSupportedFile = (filename) => {
  const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.gif'];
  return extensions.some((ext) => filename.endsWith(ext));
};

const remini = async (imageInput, mode) => {
  const modes = ['enhance', 'recolor', 'dehaze'];
  const selectedMode = modes.includes(mode) ? mode : modes[0];
  const { vyro } = getServiceUrls(config);
  if (!vyro) {
    throw new Error('VYRO_API_BASE not configured');
  }
  const apiUrl = vyro + '/' + selectedMode;
  const formData = new FormData();
  formData.append('model_version', 1);
  const imageBuffer = Buffer.isBuffer(imageInput)
    ? imageInput
    : readFileSync(imageInput);
  formData.append('image', imageBuffer, {
    filename: 'enhance_image_body.jpg',
    contentType: 'image/jpeg',
  });
  const response = await axios.post(apiUrl, formData, {
    headers: {
      ...formData.getHeaders(),
      'User-Agent': 'okhttp/4.9.3',
      Connection: 'Keep-Alive',
      'Accept-Encoding': 'gzip',
    },
    responseType: 'arraybuffer',
  });
  return Buffer.from(response.data);
};

async function convertWebpToMp4({ file, filename, url }) {
  try {
    if (!file && !url) {
      throw new Error('Un fichier ou une URL est requis.');
    }
    if (file && !filename) {
      throw new Error('Le nom du fichier est requis pour les fichiers envoyés.');
    }
    const formData2 = new FormData();
    if (file) {
      formData2.append('new-image', file, { filename });
    }
    if (url) {
      formData2.append('new-image-url', url);
    }
    const { ezgif } = getServiceUrls(config);
    const response2 = await axios.post(ezgif + '/webp-to-mp4', formData2, {
      headers: formData2.getHeaders(),
    });
    const value2 = response2?.request?.res?.responseUrl;
    if (!value2) {
      throw new Error('Redirection introuvable.');
    }
    const value32 = value2.replace(/\.html$/, '');
    const value42 = value32.split('/').pop();
    const response32 = await axios.post(
      value32 + '?ajax=true',
      new URLSearchParams({
        file: value42,
        background: '#ffffff',
        backgroundc: '#ffffff',
        repeat: '1',
        ajax: 'true',
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );
    const value52 = response32.data.toString();
    const value62 = '" controls><source src="';
    const value72 = '" type="video/mp4">Your browser';
    const value82 = value52.split(value62)?.[1]?.split(value72)?.[0];
    if (!value82) {
      throw new Error('Conversion échouée.');
    }
    return 'https:' + value82.replace('https:', '');
  } catch (err) {
    throw new Error('Erreur conversion WebP → MP4 : ' + err);
  }
}

module.exports = {
  fs,
  path,
  os,
  axios,
  FormData,
  readFileSync,
  config,
  Sticker,
  StickerTypes,
  spawn,
  saveSpeechToFile,
  sharp,
  Ranks,
  uploadToCatbox,
  alea,
  isSupportedFile,
  fusionCache,
  remini,
  convertWebpToMp4,
};
