const {
  registerCommand
} = require("../lib/commands");
const axios = require("axios");
const fs = require("fs");
const {
  runFfmpeg
} = require("../lib/ffmpeg");
const reactions = {
  embeter: "https://api.waifu.pics/sfw/bully",
  caliner: "https://api.waifu.pics/sfw/cuddle",
  pleurer: "https://api.waifu.pics/sfw/cry",
  enlacer: "https://api.waifu.pics/sfw/hug",
  awoo: "https://api.waifu.pics/sfw/awoo",
  embrasser: "https://api.waifu.pics/sfw/kiss",
  lecher: "https://api.waifu.pics/sfw/lick",
  tapoter: "https://api.waifu.pics/sfw/pat",
  sourire_fier: "https://api.waifu.pics/sfw/smug",
  assommer: "https://api.waifu.pics/sfw/bonk",
  lancer: "https://api.waifu.pics/sfw/yeet",
  rougir: "https://api.waifu.pics/sfw/blush",
  sourire: "https://api.waifu.pics/sfw/smile",
  saluer: "https://api.waifu.pics/sfw/wave",
  highfive: "https://api.waifu.pics/sfw/highfive",
  tenir_main: "https://api.waifu.pics/sfw/handhold",
  croquer: "https://api.waifu.pics/sfw/nom",
  mordre: "https://api.waifu.pics/sfw/bite",
  sauter: "https://api.waifu.pics/sfw/glomp",
  gifler: "https://api.waifu.pics/sfw/slap",
  tuer: "https://api.waifu.pics/sfw/kill",
  coup_de_pied: "https://api.waifu.pics/sfw/kick",
  heureux: "https://api.waifu.pics/sfw/happy",
  clin_doeil: "https://api.waifu.pics/sfw/wink",
  pousser: "https://api.waifu.pics/sfw/poke",
  danser: "https://api.waifu.pics/sfw/dance",
  gene: "https://api.waifu.pics/sfw/cringe"
};
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
      withTarget: "@" + authorTag + " enlace chaleureusement @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut enlacer tout le monde !"
    },
    awoo: {
      withTarget: "@" + authorTag + " fait \"Awoo\" à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " hurle \"Awoo\" pour tout le monde !"
    },
    embrasser: {
      withTarget: "@" + authorTag + " embrasse tendrement @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut embrasser tout le monde !"
    },
    lecher: {
      withTarget: "@" + authorTag + " lèche @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut lécher tout le monde !"
    },
    tapoter: {
      withTarget: "@" + authorTag + " tapote la tête de @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut tapoter la tête de tout le monde !"
    },
    sourire_fier: {
      withTarget: "@" + authorTag + " adresse un sourire fier à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " affiche un sourire fier devant tout le monde !"
    },
    assommer: {
      withTarget: "@" + authorTag + " assomme @" + targetTag + " avec une massue !",
      withoutTarget: "@" + authorTag + " est prêt à assommer tout le monde !"
    },
    lancer: {
      withTarget: "@" + authorTag + " lance @" + targetTag + " loin dans les airs !",
      withoutTarget: "@" + authorTag + " veut lancer quelqu'un dans les airs !"
    },
    rougir: {
      withTarget: "@" + authorTag + " rougit en regardant @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " rougit devant tout le monde !"
    },
    sourire: {
      withTarget: "@" + authorTag + " sourit joyeusement à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " sourit joyeusement à tout le monde !"
    },
    saluer: {
      withTarget: "@" + authorTag + " salue chaleureusement @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " salue tout le monde !"
    },
    highfive: {
      withTarget: "@" + authorTag + " donne un high-five à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut donner un high-five à tout le monde !"
    },
    tenir_main: {
      withTarget: "@" + authorTag + " tient la main de @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut tenir la main de tout le monde !"
    },
    croquer: {
      withTarget: "@" + authorTag + " croque un morceau de @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut croquer tout le monde !"
    },
    mordre: {
      withTarget: "@" + authorTag + " mord @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut mordre tout le monde !"
    },
    sauter: {
      withTarget: "@" + authorTag + " saute sur @" + targetTag + " avec enthousiasme !",
      withoutTarget: "@" + authorTag + " veut sauter sur tout le monde !"
    },
    gifler: {
      withTarget: "@" + authorTag + " gifle @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut gifler tout le monde !"
    },
    tuer: {
      withTarget: "@" + authorTag + " tue @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " est prêt à tuer tout le monde !"
    },
    coup_de_pied: {
      withTarget: "@" + authorTag + " donne un coup de pied à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut donner un coup de pied à tout le monde !"
    },
    heureux: {
      withTarget: "@" + authorTag + " est heureux en voyant @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " est heureux avec tout le monde !"
    },
    clin_doeil: {
      withTarget: "@" + authorTag + " fait un clin d'œil à @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " fait un clin d'œil à tout le monde !"
    },
    pousser: {
      withTarget: "@" + authorTag + " pousse doucement @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " veut pousser tout le monde !"
    },
    danser: {
      withTarget: "@" + authorTag + " danse joyeusement avec @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " danse pour tout le monde !"
    },
    gene: {
      withTarget: "@" + authorTag + " est gêné en regardant @" + targetTag + " !",
      withoutTarget: "@" + authorTag + " est gêné devant tout le monde !"
    }
  };
  if (captions[commandName]) {
    if (targetTag) {
      return captions[commandName].withTarget;
    } else {
      return captions[commandName].withoutTarget;
    }
  } else {
    return "@" + authorTag + " a exécuté " + commandName + " !";
  }
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
function addReactionCommand(commandName, apiUrl) {
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
      const gifUrl = apiResponse.data.url;
      const gifBuffer = (await axios.get(gifUrl, {
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
for (const [nom_cmd, url] of Object.entries(reactions)) {
  addReactionCommand(nom_cmd, url);
}
