const {
  registerCommand
} = require("../lib/commands");
const textmaker = require("../lib/textmaker");
function addTextproCommand(_0x2a29ac, _0x4fbc9f, _0x543789) {
  registerCommand({
    nom_cmd: _0x2a29ac,
    classe: "Logo",
    react: "✨",
    desc: "Effet de texte avec Ephoto360"
  }, async (_0x23d15e, _0x4c11da, _0x38a36b) => {
    const {
      arg: _0x599244,
      ms: _0x5e00ea
    } = _0x38a36b;
    const _0x4ea2ec = _0x599244.join(" ");
    if (!_0x4ea2ec) {
      return await _0x4c11da.sendMessage(_0x23d15e, {
        text: "Vous devez fournir un texte."
      }, {
        quoted: _0x5e00ea
      });
    }
    try {
      let _0x2cc4e1;
      switch (_0x543789) {
        case 1:
          if (_0x4ea2ec.includes(";")) {
            return await _0x4c11da.sendMessage(_0x23d15e, {
              text: "Veuillez fournir du texte sans point-virgule (;) pour cette commande."
            }, {
              quoted: _0x5e00ea
            });
          }
          _0x2cc4e1 = await textmaker(_0x4fbc9f, _0x4ea2ec);
          break;
        case 2:
          const _0x59fe06 = _0x4ea2ec.split(";");
          if (_0x59fe06.length < 2) {
            return await _0x4c11da.sendMessage(_0x23d15e, {
              text: "Veuillez fournir exactement deux textes séparés par un point-virgule (;), par exemple : Manew;Bot."
            }, {
              quoted: _0x5e00ea
            });
          }
          _0x2cc4e1 = await textmaker(_0x4fbc9f, _0x4ea2ec);
          break;
        default:
          throw new Error("Type " + _0x543789 + " non supporté.");
      }
      await _0x4c11da.sendMessage(_0x23d15e, {
        image: {
          url: _0x2cc4e1.url
        },
        caption: "```Powered by Manewbot```"
      }, {
        quoted: _0x5e00ea
      });
    } catch (_0x503024) {
      console.error("Erreur avec la commande " + _0x2a29ac + ":", _0x503024.message || _0x503024);
      await _0x4c11da.sendMessage(_0x23d15e, {
        text: "Une erreur est survenue lors de la génération du logo : " + _0x503024.message
      }, {
        quoted: _0x5e00ea
      });
    }
  });
}
addTextproCommand("dragonball", "https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html", 1);
addTextproCommand("deadpool", "https://en.ephoto360.com/create-text-effects-in-the-style-of-the-deadpool-logo-818.html", 2);
addTextproCommand("blackpink", "https://en.ephoto360.com/create-a-blackpink-style-logo-with-members-signatures-810.html", 1);
addTextproCommand("neon1", "https://en.ephoto360.com/blue-neon-text-effect-117.html", 1);
addTextproCommand("football", "https://en.ephoto360.com/paul-scholes-shirt-foot-ball-335.html", 2);
addTextproCommand("steel", "https://en.ephoto360.com/heated-steel-lettering-effect-65.html", 2);
addTextproCommand("paint", "https://en.ephoto360.com/paint-splatter-text-effect-72.html", 1);
addTextproCommand("thunder", "https://en.ephoto360.com/thunder-text-effect-online-97.html", 1);
addTextproCommand("thor", "https://en.ephoto360.com/create-thor-logo-style-text-effects-online-for-free-796.html", 1);
addTextproCommand("graffiti1", "https://en.ephoto360.com/cute-girl-painting-graffiti-text-effect-667.html", 2);
addTextproCommand("gold2", "https://en.ephoto360.com/modern-gold-5-215.html", 1);
addTextproCommand("neon2", "https://en.ephoto360.com/create-light-effects-green-neon-online-429.html", 1);
addTextproCommand("effacer", "https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html", 1);
addTextproCommand("galaxy", "https://en.ephoto360.com/text-light-galaxy-effectt-345.html", 1);
addTextproCommand("vintage", "https://en.ephoto360.com/write-text-on-vintage-television-online-670.html", 1);
addTextproCommand("gold1", "https://en.ephoto360.com/gold-text-effect-158.html", 1);
addTextproCommand("graffiti2", "https://en.ephoto360.com/graffiti-text-5-180.html", 1);
addTextproCommand("hacker", "https://en.ephoto360.com/create-anonymous-hacker-avatars-cyan-neon-677.html", 1);
addTextproCommand("rain", "https://en.ephoto360.com/foggy-rainy-text-effect-75.html", 1);
addTextproCommand("typography", "https://en.ephoto360.com/create-online-typography-art-effects-with-multiple-layers-811.html", 1);
addTextproCommand("gold3", "https://en.ephoto360.com/glossy-chrome-text-effect-online-424.html", 1);
addTextproCommand("wood", "https://en.ephoto360.com/create-3d-wood-text-effects-online-free-705.html", 2);
addTextproCommand("captain_america", "https://en.ephoto360.com/create-a-cinematic-captain-america-text-effect-online-715.html", 2);
addTextproCommand("cubic", "https://en.ephoto360.com/3d-cubic-text-effect-online-88.html", 1);
addTextproCommand("green_effect", "https://en.ephoto360.com/create-unique-word-green-light-63.html", 1);
addTextproCommand("naruto", "https://en.ephoto360.com/naruto-shippuden-logo-style-text-effect-online-808.html", 1);
addTextproCommand("sand", "https://en.ephoto360.com/realistic-3d-sand-text-effect-online-580.html", 1);
addTextproCommand("plasma", "https://en.ephoto360.com/plasma-text-effects-online-71.html", 1);
addTextproCommand("avengers", "https://en.ephoto360.com/create-logo-3d-style-avengers-online-427.html", 2);
addTextproCommand("underwater", "https://en.ephoto360.com/3d-underwater-text-effect-online-682.html", 1);
addTextproCommand("glass", "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html", 1);
addTextproCommand("graffiti3", "https://en.ephoto360.com/cover-graffiti-181.html", 1);
addTextproCommand("summery", "https://en.ephoto360.com/create-a-summery-sand-writing-text-effect-577.html", 1);
addTextproCommand("gold4", "https://en.ephoto360.com/modern-gold-silver-210.html", 1);
addTextproCommand("cloud", "https://en.ephoto360.com/cloud-text-effect-139.html", 1);
addTextproCommand("metal", "https://en.ephoto360.com/metal-text-effect-online-110.html", 1);
addTextproCommand("watercolor", "https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html", 1);
addTextproCommand("sci_fi", "https://en.ephoto360.com/create-a-awesome-logo-sci-fi-effects-492.html", 2);
addTextproCommand("gold5", "https://en.ephoto360.com/free-glitter-text-effect-maker-online-656.html", 2);
addTextproCommand("blackpink2", "https://en.ephoto360.com/create-blackpink-s-born-pink-album-logo-online-779.html", 2);
addTextproCommand("cloud2", "https://en.ephoto360.com/create-a-cloud-text-effect-in-the-sky-618.html", 1);
addTextproCommand("neon3", "https://en.ephoto360.com/neon-text-effect-171.html", 1);
addTextproCommand("space", "https://en.ephoto360.com/latest-space-3d-text-effect-online-559.html", 2);
addTextproCommand("boobs", "https://en.ephoto360.com/music-equalizer-text-effect-259.html", 1);
addTextproCommand("blackpink3", "https://en.ephoto360.com/create-a-blackpink-neon-logo-text-effect-online-710.html", 1);
addTextproCommand("onepiece", "https://en.ephoto360.com/create-one-piece-facebook-cover-online-553.html", 1);
addTextproCommand("dragonball2", "https://en.ephoto360.com/free-online-dragon-ball-facebook-cover-photos-maker-443.html", 1);
addTextproCommand("football2", "https://en.ephoto360.com/text-on-shirt-club-real-madrid-267.html", 2);
addTextproCommand("football3", "https://en.ephoto360.com/create-football-shirt-messi-barca-online-268.html");
addTextproCommand("futuris", "https://en.ephoto360.com/light-text-effect-futuristic-technology-style-648.html", 1);