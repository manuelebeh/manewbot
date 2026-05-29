'use strict';

const { registerCommand } = require('../../lib/commands');
const config = require('../../set');
const axios = require('axios');
const fs = require('fs');
const { runFfmpeg } = require('../../lib/ffmpeg');
const { validateRemoteMediaUrl } = require('../../lib/url-safety');

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

function generateCaption(commandName, authorTag, targetTag) {
  const captions = {
    embeter: {
      withTarget: "@" + authorTag + " embête @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " embête tout le monde !"
    },
    caliner: {
      withTarget: "@" + authorTag + " câline @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut câliner tout le monde !"
    },
    pleurer: {
      withTarget: "@" + authorTag + " pleure sur l'épaule de @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " pleure tout seul..."
    },
    enlacer: {
      withTarget: "@" + authorTag + " enlace @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut un câlin !"
    },
    awoo: {
      withTarget: "@" + authorTag + " fait awoo à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " fait awoo !"
    },
    embrasser: {
      withTarget: "@" + authorTag + " embrasse @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " cherche quelqu'un à embrasser !"
    },
    lecher: {
      withTarget: "@" + authorTag + " lèche @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " lèche l'air !"
    },
    tapoter: {
      withTarget: "@" + authorTag + " tapote @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " tapote tout le monde !"
    },
    sourire_fier: {
      withTarget: "@" + authorTag + " sourit fièrement à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " sourit fièrement !"
    },
    assommer: {
      withTarget: "@" + authorTag + " assomme @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " assomme tout le monde !"
    },
    lancer: {
      withTarget: "@" + authorTag + " lance @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " lance quelque chose !"
    },
    rougir: {
      withTarget: "@" + authorTag + " rougit devant @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " rougit !"
    },
    sourire: {
      withTarget: "@" + authorTag + " sourit à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " sourit !"
    },
    saluer: {
      withTarget: "@" + authorTag + " salue @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " salue tout le monde !"
    },
    highfive: {
      withTarget: "@" + authorTag + " fait un high-five avec @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " cherche un high-five !"
    },
    tenir_main: {
      withTarget: "@" + authorTag + " tient la main de @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " cherche une main à tenir !"
    },
    croquer: {
      withTarget: "@" + authorTag + " croque @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " croque l'air !"
    },
    mordre: {
      withTarget: "@" + authorTag + " mord @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " mord tout le monde !"
    },
    sauter: {
      withTarget: "@" + authorTag + " saute sur @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " saute partout !"
    },
    gifler: {
      withTarget: "@" + authorTag + " gifle @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " gifle tout le monde !"
    },
    tuer: {
      withTarget: "@" + authorTag + " tue @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " est en mode tueur !"
    },
    coup_de_pied: {
      withTarget: "@" + authorTag + " donne un coup de pied à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " donne des coups de pied !"
    },
    heureux: {
      withTarget: "@" + authorTag + " est heureux avec @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " est heureux !"
    },
    clin_doeil: {
      withTarget: "@" + authorTag + " fait un clin d'œil à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " fait un clin d'œil !"
    },
    pousser: {
      withTarget: "@" + authorTag + " pousse @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " pousse tout le monde !"
    },
    danser: {
      withTarget: "@" + authorTag + " danse avec @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " danse !"
    },
    gene: {
      withTarget: "@" + authorTag + " est gêné avec @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " est gêné !"
    }
  };
  const entry = captions[commandName];
  if (!entry) {
    return "@" + authorTag + " a exécuté " + commandName + " !";
  }
  if (targetTag) {
    return entry.withTarget;
  }
  return entry.withoutTarget;
}

async function giftovidbuff(gifBuffer) {
  const tempGifPath = "temp_" + Date.now() + ".gif";
  const tempMp4Path = "temp_" + Date.now() + ".mp4";
  fs.writeFileSync(tempGifPath, gifBuffer);
  await runFfmpeg(tempGifPath, "-movflags faststart -pix_fmt yuv420p -vf \"scale=trunc(iw/2)*2:trunc(ih/2)*2\"", tempMp4Path);
  const videoBuffer = fs.readFileSync(tempMp4Path);
  fs.unlinkSync(tempGifPath);
  fs.unlinkSync(tempMp4Path);
  return videoBuffer;
}

function addReactionCommand(commandName, action) {
  const apiUrl = buildWaifuApiUrl(action);
  registerCommand({
    nom_cmd: commandName,
    classe: "Réaction",
    react: "💬",
    desc: "Réaction de type " + commandName
  }, async (chatJid, sock, ctx) => {
    const {
      arg,
      auteur_Message,
      getJid,
      auteur_Msg_Repondu,
      repondre,
      ms
    } = ctx;
    const targetJid = auteur_Msg_Repondu || arg[0]?.includes("@") && arg[0].replace("@", "") + "@lid";
    const resolvedTarget = await getJid(targetJid, chatJid, sock);
    try {
      const apiResponse = await axios.get(apiUrl);
      const gifUrl = apiResponse.data?.url;
      const mediaCheck = validateRemoteMediaUrl(gifUrl);
      if (!mediaCheck.ok) {
        return repondre({ text: "Réponse média invalide." });
      }
      const gifBuffer = (await axios.get(mediaCheck.href, {
        responseType: "arraybuffer"
      })).data;
      const videoBuffer = await giftovidbuff(gifBuffer);
      const caption = generateCaption(commandName, auteur_Message?.split("@")[0], resolvedTarget?.split("@")[0]);
      await sock.sendMessage(chatJid, {
        video: videoBuffer,
        gifPlayback: true,
        caption,
        mentions: resolvedTarget ? [auteur_Message, resolvedTarget] : [auteur_Message]
      }, {
        quoted: ms
      });
    } catch (err) {
      console.error("Erreur avec la commande " + commandName + ":", err);
      await repondre({
        text: "Désolé, une erreur est survenue lors du traitement de la commande."
      });
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
