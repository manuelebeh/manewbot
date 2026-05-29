const {
  registerCommand
} = require("../lib/commands");
const axios = require("axios");
registerCommand({
  nom_cmd: "gpt",
  classe: "IA",
  react: "🤖",
  desc: "Utilise l'API gpt pour générer des réponses."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre
  } = ctx;
  if (!arg.length) {
    return repondre("Veuillez entrer un prompt pour générer une réponse.");
  }
  const prompt = arg.join(" ");
  const apiUrl = "https://eliteprotech-apis.zone.id/chatgpt?prompt=" + encodeURIComponent(prompt);
  try {
    const response = await axios.get(apiUrl);
    const reply = response.data?.response || "Erreur de réponse de l'API.";
    return repondre(reply);
  } catch (err) {
    console.error("Erreur GPT :", err);
    return repondre("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "dalle",
  classe: "IA",
  react: "🎨",
  desc: "Génère des images avec DALLE-E."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre
  } = ctx;
  if (!arg.length) {
    return repondre("Veuillez entrer une description pour générer une image.");
  }
  try {
    const prompt = arg.join(" ");
    const apiUrl = "https://eliteprotech-apis.zone.id/imagine?prompt=" + encodeURIComponent(prompt);
    const response = await axios.get(apiUrl, {
      responseType: "arraybuffer"
    });
    return sock.sendMessage(chatJid, {
      image: response.data,
      caption: "```Powered by Manewbot```"
    }, {
      quoted: ms
    });
  } catch (err) {
    console.error("Erreur DALLE :", err);
    return repondre("Erreur lors de la génération de l'image. Réessayez plus tard.");
  }
});
registerCommand({
  nom_cmd: "blackbox",
  classe: "IA",
  react: "🖤",
  desc: "Utilise l'API blackbox pour générer des réponses."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre
  } = ctx;
  if (!arg.length) {
    return repondre("Veuillez entrer un prompt pour générer une réponse.");
  }
  const prompt = arg.join(" ");
  const apiUrl = "https://api-toxxic.zone.id/api/ai/blackbox?prompt=" + encodeURIComponent(prompt);
  try {
    const response = await axios.get(apiUrl);
    const reply = response.data?.data || "Erreur de réponse de l'API.";
    return repondre(reply);
  } catch (err) {
    console.error("Erreur GPT :", err);
    return repondre("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "copilot",
  classe: "IA",
  react: "🤖",
  desc: "Utilise l'API Copilot pour générer des réponses."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre
  } = ctx;
  if (!arg.length) {
    return repondre("Veuillez entrer un prompt pour générer une réponse.");
  }
  const prompt = arg.join(" ");
  const apiUrl = "https://eliteprotech-apis.zone.id/copilot?q=" + encodeURIComponent(prompt);
  try {
    const response = await axios.get(apiUrl);
    const reply = response.data?.text || "Erreur de réponse de l'API.";
    return repondre(reply);
  } catch (err) {
    console.error("Erreur Copilot :", err);
    return repondre("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "gemini",
  classe: "IA",
  react: "🤖",
  desc: "Utilise l'API Gemini-Pro pour générer des réponses."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre,
    auteur_Message
  } = ctx;
  if (!arg.length) {
    return repondre("Veuillez entrer un prompt pour générer une réponse.");
  }
  const prompt = arg.join(" ");
  const apiUrl = "https://eliteprotech-apis.zone.id/gemini?prompt=" + encodeURIComponent(prompt);
  try {
    const response = await axios.get(apiUrl);
    const reply = response.data?.text || "Erreur de réponse de l'API Gemini-Pro.";
    return repondre(reply);
  } catch (err) {
    console.error("Erreur Gemini-Pro :", err);
    return repondre("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "llama",
  classe: "IA",
  react: "🤖",
  desc: "Utilise l'API Llama pour générer des réponses."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    repondre
  } = ctx;
  if (!arg.length) {
    return repondre("Veuillez entrer un prompt pour générer une réponse.");
  }
  const prompt = arg.join(" ");
  const apiUrl = "https://api.gurusensei.workers.dev/llama?prompt=" + encodeURIComponent(prompt);
  try {
    const response = await axios.get(apiUrl);
    const reply = response.data?.response?.response || "Erreur de réponse de l'API Llama.";
    return repondre(reply);
  } catch (err) {
    console.error("Erreur Llama :", err);
    return repondre("Une erreur est survenue lors de l'appel à l'API.");
  }
});
registerCommand({
  nom_cmd: "claude",
  classe: "IA",
  react: "🖤",
  desc: "Utilise l'API Claude pour générer des réponses."
}, async (chatJid, sock, ctx) => {
  const {
    arg,
    ms,
    repondre
  } = ctx;
  if (!arg.length) {
    return repondre("Veuillez entrer un prompt pour générer une réponse.");
  }
  const prompt = arg.join(" ");
  const apiUrl = "https://api-toxxic.zone.id/api/ai/claude?prompt=" + encodeURIComponent(prompt);
  try {
    const response = await axios.get(apiUrl);
    const reply = response.data?.data || "Erreur de réponse de l'API.";
    return repondre(reply);
  } catch (err) {
    console.error("Erreur Claude :", err);
    return repondre("Une erreur est survenue lors de l'appel à l'API.");
  }
});
