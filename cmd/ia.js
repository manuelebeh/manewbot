const {
  registerCommand
} = require("../lib/commands");
const axios = require("axios");
registerCommand({
  nom_cmd: "gpt",
  classe: "IA",
  react: "🤖",
  desc: "Utilise l'API gpt pour générer des réponses."
}, async (_0x21ccbc, _0x35a73d, _0x2af707) => {
  const {
    arg: _0x1212ed,
    ms: _0x469ba6,
    repondre: _0x477b77
  } = _0x2af707;
  if (!_0x1212ed.length) {
    return _0x477b77("Veuillez entrer un prompt pour générer une réponse.");
  }
  const _0x5242bd = _0x1212ed.join(" ");
  const _0x2aa34c = "https://eliteprotech-apis.zone.id/chatgpt?prompt=" + encodeURIComponent(_0x5242bd);
  try {
    const _0x475496 = await axios.get(_0x2aa34c);
    const _0x237dc3 = _0x475496.data?.response || "Erreur de réponse de l'API.";
    return _0x477b77(_0x237dc3);
  } catch (_0x269693) {
    console.error("Erreur GPT :", _0x269693);
    return _0x477b77("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "dalle",
  classe: "IA",
  react: "🎨",
  desc: "Génère des images avec DALLE-E."
}, async (_0x5bbe5b, _0x1afe09, _0x4f6c4e) => {
  const {
    arg: _0x231bde,
    ms: _0x307483,
    repondre: _0x2162f1
  } = _0x4f6c4e;
  if (!_0x231bde.length) {
    return _0x2162f1("Veuillez entrer une description pour générer une image.");
  }
  try {
    const _0x56684a = _0x231bde.join(" ");
    const _0x35b07b = "https://eliteprotech-apis.zone.id/imagine?prompt=" + encodeURIComponent(_0x56684a);
    const _0x54ea9c = await axios.get(_0x35b07b, {
      responseType: "arraybuffer"
    });
    return _0x1afe09.sendMessage(_0x5bbe5b, {
      image: _0x54ea9c.data,
      caption: "```Powered by Manewbot```"
    }, {
      quoted: _0x307483
    });
  } catch (_0x545eef) {
    console.error("Erreur DALLE :", _0x545eef);
    return _0x2162f1("Erreur lors de la génération de l'image. Réessayez plus tard.");
  }
});
registerCommand({
  nom_cmd: "blackbox",
  classe: "IA",
  react: "🖤",
  desc: "Utilise l'API blackbox pour générer des réponses."
}, async (_0xb28c7, _0x181950, _0x2522e7) => {
  const {
    arg: _0x18faeb,
    ms: _0x2570c1,
    repondre: _0x53f17f
  } = _0x2522e7;
  if (!_0x18faeb.length) {
    return _0x53f17f("Veuillez entrer un prompt pour générer une réponse.");
  }
  const _0x2bc353 = _0x18faeb.join(" ");
  const _0x42f2ef = "https://api-toxxic.zone.id/api/ai/blackbox?prompt=" + encodeURIComponent(_0x2bc353);
  try {
    const _0x6b61ef = await axios.get(_0x42f2ef);
    const _0x144f69 = _0x6b61ef.data?.data || "Erreur de réponse de l'API.";
    return _0x53f17f(_0x144f69);
  } catch (_0x211c3a) {
    console.error("Erreur GPT :", _0x211c3a);
    return _0x53f17f("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "copilot",
  classe: "IA",
  react: "🤖",
  desc: "Utilise l'API Copilot pour générer des réponses."
}, async (_0x5e1a9a, _0x505067, _0x106004) => {
  const {
    arg: _0x2367bb,
    ms: _0x3739d4,
    repondre: _0x5361ee
  } = _0x106004;
  if (!_0x2367bb.length) {
    return _0x5361ee("Veuillez entrer un prompt pour générer une réponse.");
  }
  const _0x4f1b84 = _0x2367bb.join(" ");
  const _0x362767 = "https://eliteprotech-apis.zone.id/copilot?q=" + encodeURIComponent(_0x4f1b84);
  try {
    const _0x4bd703 = await axios.get(_0x362767);
    const _0x2965ad = _0x4bd703.data?.text || "Erreur de réponse de l'API.";
    return _0x5361ee(_0x2965ad);
  } catch (_0x59dd33) {
    console.error("Erreur Copilot :", _0x59dd33);
    return _0x5361ee("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "gemini",
  classe: "IA",
  react: "🤖",
  desc: "Utilise l'API Gemini-Pro pour générer des réponses."
}, async (_0x53bb4c, _0x9dd3b1, _0x35e601) => {
  const {
    arg: _0x26920e,
    ms: _0x40972f,
    repondre: _0x5a9744,
    auteur_Message: _0x31969d
  } = _0x35e601;
  if (!_0x26920e.length) {
    return _0x5a9744("Veuillez entrer un prompt pour générer une réponse.");
  }
  const _0x53a33a = _0x26920e.join(" ");
  const _0x24386f = "https://eliteprotech-apis.zone.id/gemini?prompt=" + encodeURIComponent(_0x53a33a);
  try {
    const _0x328a57 = await axios.get(_0x24386f);
    const _0x1be56a = _0x328a57.data?.text || "Erreur de réponse de l'API Gemini-Pro.";
    return _0x5a9744(_0x1be56a);
  } catch (_0x4991e7) {
    console.error("Erreur Gemini-Pro :", _0x4991e7);
    return _0x5a9744("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "llama",
  classe: "IA",
  react: "🤖",
  desc: "Utilise l'API Llama pour générer des réponses."
}, async (_0x16501d, _0x17afa4, _0x3df433) => {
  const {
    arg: _0x474262,
    repondre: _0x3242f9
  } = _0x3df433;
  if (!_0x474262.length) {
    return _0x3242f9("Veuillez entrer un prompt pour générer une réponse.");
  }
  const _0x34bd2b = _0x474262.join(" ");
  const _0x35d9d8 = "https://api.gurusensei.workers.dev/llama?prompt=" + encodeURIComponent(_0x34bd2b);
  try {
    const _0x406ae5 = await axios.get(_0x35d9d8);
    const _0x1b502a = _0x406ae5.data?.response?.response || "Erreur de réponse de l'API Llama.";
    return _0x3242f9(_0x1b502a);
  } catch (_0x9290a2) {
    console.error("Erreur Llama :", _0x9290a2);
    return _0x3242f9("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "claude",
  classe: "IA",
  react: "🖤",
  desc: "Utilise l'API Claude pour générer des réponses."
}, async (_0x4914ca, _0x54efa8, _0x2b54c9) => {
  const {
    arg: _0x3452dd,
    ms: _0x1c21f1,
    repondre: _0x76524f
  } = _0x2b54c9;
  if (!_0x3452dd.length) {
    return _0x76524f("Veuillez entrer un prompt pour générer une réponse.");
  }
  const _0x33abb9 = _0x3452dd.join(" ");
  const _0x1a8813 = "https://api-toxxic.zone.id/api/ai/claude?prompt=" + encodeURIComponent(_0x33abb9);
  try {
    const _0x5a90c5 = await axios.get(_0x1a8813);
    const _0x2c99ee = _0x5a90c5.data?.data || "Erreur de réponse de l'API.";
    return _0x76524f(_0x2c99ee);
  } catch (_0x305d2b) {
    console.error("Erreur Claude :", _0x305d2b);
    return _0x76524f("Une erreur est survenue lors de l'appel à l'API.");
  }
});