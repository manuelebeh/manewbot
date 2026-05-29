const {
  registerCommand
} = require("../lib/commands");
const axios = require("axios");
const fs = require("fs");
const child_process = require("child_process");
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
function generateCaption(_0x4a47f1, _0x154e8d, _0x2922a6) {
  const _0x54ba90 = {
    embeter: {
      withTarget: "@" + _0x154e8d + " embête @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " embête tout le monde !"
    },
    caliner: {
      withTarget: "@" + _0x154e8d + " câline @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut câliner tout le monde !"
    },
    pleurer: {
      withTarget: "@" + _0x154e8d + " pleure sur l'épaule de @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " pleure tout seul..."
    },
    enlacer: {
      withTarget: "@" + _0x154e8d + " enlace chaleureusement @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut enlacer tout le monde !"
    },
    awoo: {
      withTarget: "@" + _0x154e8d + " fait \"Awoo\" à @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " hurle \"Awoo\" pour tout le monde !"
    },
    embrasser: {
      withTarget: "@" + _0x154e8d + " embrasse tendrement @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut embrasser tout le monde !"
    },
    lecher: {
      withTarget: "@" + _0x154e8d + " lèche @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut lécher tout le monde !"
    },
    tapoter: {
      withTarget: "@" + _0x154e8d + " tapote la tête de @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut tapoter la tête de tout le monde !"
    },
    sourire_fier: {
      withTarget: "@" + _0x154e8d + " adresse un sourire fier à @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " affiche un sourire fier devant tout le monde !"
    },
    assommer: {
      withTarget: "@" + _0x154e8d + " assomme @" + _0x2922a6 + " avec une massue !",
      withoutTarget: "@" + _0x154e8d + " est prêt à assommer tout le monde !"
    },
    lancer: {
      withTarget: "@" + _0x154e8d + " lance @" + _0x2922a6 + " loin dans les airs !",
      withoutTarget: "@" + _0x154e8d + " veut lancer quelqu'un dans les airs !"
    },
    rougir: {
      withTarget: "@" + _0x154e8d + " rougit en regardant @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " rougit devant tout le monde !"
    },
    sourire: {
      withTarget: "@" + _0x154e8d + " sourit joyeusement à @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " sourit joyeusement à tout le monde !"
    },
    saluer: {
      withTarget: "@" + _0x154e8d + " salue chaleureusement @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " salue tout le monde !"
    },
    highfive: {
      withTarget: "@" + _0x154e8d + " donne un high-five à @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut donner un high-five à tout le monde !"
    },
    tenir_main: {
      withTarget: "@" + _0x154e8d + " tient la main de @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut tenir la main de tout le monde !"
    },
    croquer: {
      withTarget: "@" + _0x154e8d + " croque un morceau de @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut croquer tout le monde !"
    },
    mordre: {
      withTarget: "@" + _0x154e8d + " mord @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut mordre tout le monde !"
    },
    sauter: {
      withTarget: "@" + _0x154e8d + " saute sur @" + _0x2922a6 + " avec enthousiasme !",
      withoutTarget: "@" + _0x154e8d + " veut sauter sur tout le monde !"
    },
    gifler: {
      withTarget: "@" + _0x154e8d + " gifle @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut gifler tout le monde !"
    },
    tuer: {
      withTarget: "@" + _0x154e8d + " tue @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " est prêt à tuer tout le monde !"
    },
    coup_de_pied: {
      withTarget: "@" + _0x154e8d + " donne un coup de pied à @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut donner un coup de pied à tout le monde !"
    },
    heureux: {
      withTarget: "@" + _0x154e8d + " est heureux en voyant @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " est heureux avec tout le monde !"
    },
    clin_doeil: {
      withTarget: "@" + _0x154e8d + " fait un clin d'œil à @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " fait un clin d'œil à tout le monde !"
    },
    pousser: {
      withTarget: "@" + _0x154e8d + " pousse doucement @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " veut pousser tout le monde !"
    },
    danser: {
      withTarget: "@" + _0x154e8d + " danse joyeusement avec @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " danse pour tout le monde !"
    },
    gene: {
      withTarget: "@" + _0x154e8d + " est gêné en regardant @" + _0x2922a6 + " !",
      withoutTarget: "@" + _0x154e8d + " est gêné devant tout le monde !"
    }
  };
  if (_0x54ba90[_0x4a47f1]) {
    if (_0x2922a6) {
      return _0x54ba90[_0x4a47f1].withTarget;
    } else {
      return _0x54ba90[_0x4a47f1].withoutTarget;
    }
  } else {
    return "@" + _0x154e8d + " a exécuté " + _0x4a47f1 + " !";
  }
}
async function giftovidbuff(_0x1fda12) {
  const _0x10837b = "temp_" + Date.now() + ".gif";
  const _0x372d9d = "temp_" + Date.now() + ".mp4";
  fs.writeFileSync(_0x10837b, _0x1fda12);
  await new Promise((_0x299bde, _0x5aef3b) => {
    child_process.exec("ffmpeg -i " + _0x10837b + " -movflags faststart -pix_fmt yuv420p -vf \"scale=trunc(iw/2)*2:trunc(ih/2)*2\" " + _0x372d9d, _0x4361ed => {
      if (_0x4361ed) {
        _0x5aef3b(_0x4361ed);
      } else {
        _0x299bde();
      }
    });
  });
  const _0x5be8d8 = fs.readFileSync(_0x372d9d);
  fs.unlinkSync(_0x10837b);
  fs.unlinkSync(_0x372d9d);
  return _0x5be8d8;
}
function addReactionCommand(_0x246f36, _0x5129b1) {
  registerCommand({
    nom_cmd: _0x246f36,
    classe: "Réaction",
    react: "💬",
    desc: "Réaction de type " + _0x246f36
  }, async (_0x23d503, _0x530d79, _0x4dda35) => {
    const {
      arg: _0x582fd0,
      auteur_Message: _0x586ada,
      getJid: _0x57c0fd,
      auteur_Msg_Repondu: _0xa873d1,
      repondre: _0x40a81c,
      ms: _0x2ff639
    } = _0x4dda35;
    const _0x544c04 = _0xa873d1 || _0x582fd0[0]?.includes("@") && _0x582fd0[0].replace("@", "") + "@lid";
    const _0x248084 = await _0x57c0fd(_0x544c04, _0x23d503, _0x530d79);
    try {
      const _0x23d87f = await axios.get(_0x5129b1);
      const _0x3f9b87 = _0x23d87f.data.url;
      const _0x2cb411 = (await axios.get(_0x3f9b87, {
        responseType: "arraybuffer"
      })).data;
      const _0x4decc4 = await giftovidbuff(_0x2cb411);
      const _0x3d4450 = generateCaption(_0x246f36, _0x586ada?.split("@")[0], _0x248084?.split("@")[0]);
      await _0x530d79.sendMessage(_0x23d503, {
        video: _0x4decc4,
        gifPlayback: true,
        caption: _0x3d4450,
        mentions: _0x248084 ? [_0x586ada, _0x248084] : [_0x586ada]
      }, {
        quoted: _0x2ff639
      });
    } catch (_0x477a47) {
      console.error("Erreur avec la commande " + _0x246f36 + ":", _0x477a47);
      await _0x40a81c({
        text: "Désolé, une erreur est survenue lors du traitement de la commande."
      });
    }
  });
}
for (const [nom_cmd, url] of Object.entries(reactions)) {
  addReactionCommand(nom_cmd, url);
}