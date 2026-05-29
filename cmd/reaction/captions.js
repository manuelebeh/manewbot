'use strict';

function generateCaption(commandName, authorTag, targetTag) {
  const captions = {
    embeter: {
      withTarget: '@' + authorTag + ' embête @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' embête tout le monde !',
    },
    caliner: {
      withTarget: '@' + authorTag + ' câline @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' veut câliner tout le monde !',
    },
    pleurer: {
      withTarget: '@' + authorTag + " pleure sur l'épaule de @" + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' pleure tout seul...',
    },
    enlacer: {
      withTarget: '@' + authorTag + ' enlace @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' veut un câlin !',
    },
    awoo: {
      withTarget: '@' + authorTag + ' fait awoo à @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' fait awoo !',
    },
    embrasser: {
      withTarget: '@' + authorTag + ' embrasse @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + " cherche quelqu'un à embrasser !",
    },
    lecher: {
      withTarget: '@' + authorTag + ' lèche @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + " lèche l'air !",
    },
    tapoter: {
      withTarget: '@' + authorTag + ' tapote @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' tapote tout le monde !',
    },
    sourire_fier: {
      withTarget: '@' + authorTag + ' sourit fièrement à @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' sourit fièrement !',
    },
    assommer: {
      withTarget: '@' + authorTag + ' assomme @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' assomme tout le monde !',
    },
    lancer: {
      withTarget: '@' + authorTag + ' lance @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' lance quelque chose !',
    },
    rougir: {
      withTarget: '@' + authorTag + ' rougit devant @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' rougit !',
    },
    sourire: {
      withTarget: '@' + authorTag + ' sourit à @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' sourit !',
    },
    saluer: {
      withTarget: '@' + authorTag + ' salue @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' salue tout le monde !',
    },
    highfive: {
      withTarget: '@' + authorTag + ' fait un high-five avec @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' cherche un high-five !',
    },
    tenir_main: {
      withTarget: '@' + authorTag + ' tient la main de @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' cherche une main à tenir !',
    },
    croquer: {
      withTarget: '@' + authorTag + ' croque @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + " croque l'air !",
    },
    mordre: {
      withTarget: '@' + authorTag + ' mord @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' mord tout le monde !',
    },
    sauter: {
      withTarget: '@' + authorTag + ' saute sur @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' saute partout !',
    },
    gifler: {
      withTarget: '@' + authorTag + ' gifle @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' gifle tout le monde !',
    },
    tuer: {
      withTarget: '@' + authorTag + ' tue @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' est en mode tueur !',
    },
    coup_de_pied: {
      withTarget: '@' + authorTag + ' donne un coup de pied à @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' donne des coups de pied !',
    },
    heureux: {
      withTarget: '@' + authorTag + ' est heureux avec @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' est heureux !',
    },
    clin_doeil: {
      withTarget: '@' + authorTag + " fait un clin d'œil à @" + targetTag + ' !',
      withoutTarget: '@' + authorTag + " fait un clin d'œil !",
    },
    pousser: {
      withTarget: '@' + authorTag + ' pousse @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' pousse tout le monde !',
    },
    danser: {
      withTarget: '@' + authorTag + ' danse avec @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' danse !',
    },
    gene: {
      withTarget: '@' + authorTag + ' est gêné avec @' + targetTag + ' !',
      withoutTarget: '@' + authorTag + ' est gêné !',
    },
  };
  const entry = captions[commandName];
  if (!entry) {
    return '@' + authorTag + ' a exécuté ' + commandName + ' !';
  }
  if (targetTag) return entry.withTarget;
  return entry.withoutTarget;
}

module.exports = { generateCaption };
