'use strict';

const { registerCommand } = require('../../lib/commands');
const config = require('../../set');
const axios = require('axios');
const fs = require('fs');
const { runFfmpeg } = require('../../lib/ffmpeg');
const { validateRemoteMediaUrl } = require('../../lib/url-safety');
const { generateCaption } = require('./captions');

const reactionActions = {
  embeter: 'bully',
  caliner: 'cuddle',
  pleurer: 'cry',
  enlacer: 'hug',
  awoo: 'awoo',
  embrasser: 'kiss',
  lecher: 'lick',
  tapoter: 'pat',
  sourire_fier: 'smug',
  assommer: 'bonk',
  lancer: 'yeet',
  rougir: 'blush',
  sourire: 'smile',
  saluer: 'wave',
  highfive: 'highfive',
  tenir_main: 'handhold',
  croquer: 'nom',
  mordre: 'bite',
  sauter: 'glomp',
  gifler: 'slap',
  tuer: 'kill',
  coup_de_pied: 'kick',
  heureux: 'happy',
  clin_doeil: 'wink',
  pousser: 'poke',
  danser: 'dance',
  gene: 'cringe',
};

function buildWaifuApiUrl(action) {
  const base = (config.WAIFU_PICS_API_BASE || 'https://api.waifu.pics/sfw').replace(/\/$/, '');
  return base + '/' + action;
}

async function giftovidbuff(gifBuffer) {
  const tempGifPath = 'temp_' + Date.now() + '.gif';
  const tempMp4Path = 'temp_' + Date.now() + '.mp4';
  fs.writeFileSync(tempGifPath, gifBuffer);
  await runFfmpeg(tempGifPath, '-movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2"', tempMp4Path);
  const videoBuffer = fs.readFileSync(tempMp4Path);
  fs.unlinkSync(tempGifPath);
  fs.unlinkSync(tempMp4Path);
  return videoBuffer;
}

function addReactionCommand(commandName, action) {
  const apiUrl = buildWaifuApiUrl(action);
  registerCommand({
    nom_cmd: commandName,
    classe: 'Réaction',
    react: '💬',
    desc: 'Réaction de type ' + commandName,
  }, async (chatJid, sock, ctx) => {
    const { arg, auteur_Message, getJid, auteur_Msg_Repondu, repondre, ms } = ctx;
    const targetJid = auteur_Msg_Repondu || (arg[0]?.includes('@') && arg[0].replace('@', '') + '@lid');
    const resolvedTarget = await getJid(targetJid, chatJid, sock);
    try {
      const apiResponse = await axios.get(apiUrl);
      const gifUrl = apiResponse.data?.url;
      const mediaCheck = validateRemoteMediaUrl(gifUrl);
      if (!mediaCheck.ok) {
        return repondre({ text: 'Réponse média invalide.' });
      }
      const gifBuffer = (await axios.get(mediaCheck.href, { responseType: 'arraybuffer' })).data;
      const videoBuffer = await giftovidbuff(gifBuffer);
      const caption = generateCaption(commandName, auteur_Message?.split('@')[0], resolvedTarget?.split('@')[0]);
      await sock.sendMessage(chatJid, {
        video: videoBuffer,
        gifPlayback: true,
        caption,
        mentions: resolvedTarget ? [auteur_Message, resolvedTarget] : [auteur_Message],
      }, { quoted: ms });
    } catch (err) {
      console.error('Erreur avec la commande ' + commandName + ':', err);
      await repondre({ text: 'Désolé, une erreur est survenue lors du traitement de la commande.' });
    }
  });
}

module.exports = {
  registerCommand,
  axios,
  fs,
  runFfmpeg,
  reactionActions,
  generateCaption,
  giftovidbuff,
  addReactionCommand,
  buildWaifuApiUrl,
};
