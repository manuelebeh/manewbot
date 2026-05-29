'use strict';

const { registerCommand } = require('../lib/commands');
const config = require('../set');
const { getAiBases, aiNotConfiguredMessage } = require('../lib/ai-api');
const axios = require('axios');

function requirePrompt(arg, repondre) {
  if (!arg.length) {
    repondre('Veuillez entrer un prompt.');
    return null;
  }
  return arg.join(' ');
}

registerCommand(
  {
    nom_cmd: 'gpt',
    classe: 'IA',
    react: '🤖',
    desc: "Utilise l'API gpt pour générer des réponses.",
  },
  async (chatJid, sock, ctx) => {
    const { arg, repondre } = ctx;
    const prompt = requirePrompt(arg, repondre);
    if (!prompt) return;
    const { elite } = getAiBases(config);
    if (!elite) return repondre(aiNotConfiguredMessage('AI_API_BASE'));
    try {
      const response = await axios.get(
        `${elite}/chatgpt?prompt=${encodeURIComponent(prompt)}`
      );
      return repondre(response.data?.response || 'Erreur de réponse de l\'API.');
    } catch (err) {
      console.error('Erreur GPT :', err);
      return repondre("Une erreur est survenue lors de l'appel à l'API.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'dalle',
    classe: 'IA',
    react: '🎨',
    desc: 'Génère des images avec DALLE-E.',
  },
  async (chatJid, sock, ctx) => {
    const { arg, ms, repondre } = ctx;
    const prompt = requirePrompt(arg, repondre);
    if (!prompt) return;
    const { elite } = getAiBases(config);
    if (!elite) return repondre(aiNotConfiguredMessage('AI_API_BASE'));
    try {
      const response = await axios.get(
        `${elite}/imagine?prompt=${encodeURIComponent(prompt)}`,
        { responseType: 'arraybuffer' }
      );
      return sock.sendMessage(
        chatJid,
        { image: response.data, caption: '```Powered by Manewbot```' },
        { quoted: ms }
      );
    } catch (err) {
      console.error('Erreur DALLE :', err);
      return repondre('Erreur lors de la génération de l\'image. Réessayez plus tard.');
    }
  }
);

registerCommand(
  {
    nom_cmd: 'blackbox',
    classe: 'IA',
    react: '🖤',
    desc: "Utilise l'API blackbox pour générer des réponses.",
  },
  async (chatJid, sock, ctx) => {
    const { arg, repondre } = ctx;
    const prompt = requirePrompt(arg, repondre);
    if (!prompt) return;
    const { toxxic } = getAiBases(config);
    if (!toxxic) return repondre(aiNotConfiguredMessage('AI_TOXXIC_API_BASE'));
    try {
      const response = await axios.get(
        `${toxxic}/api/ai/blackbox?prompt=${encodeURIComponent(prompt)}`
      );
      return repondre(response.data?.data || 'Erreur de réponse de l\'API.');
    } catch (err) {
      console.error('Erreur blackbox :', err);
      return repondre("Une erreur est survenue lors de l'appel à l'API.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'copilot',
    classe: 'IA',
    react: '🤖',
    desc: "Utilise l'API Copilot pour générer des réponses.",
  },
  async (chatJid, sock, ctx) => {
    const { arg, repondre } = ctx;
    const prompt = requirePrompt(arg, repondre);
    if (!prompt) return;
    const { elite } = getAiBases(config);
    if (!elite) return repondre(aiNotConfiguredMessage('AI_API_BASE'));
    try {
      const response = await axios.get(
        `${elite}/copilot?q=${encodeURIComponent(prompt)}`
      );
      return repondre(response.data?.text || 'Erreur de réponse de l\'API.');
    } catch (err) {
      console.error('Erreur Copilot :', err);
      return repondre("Une erreur est survenue lors de l'appel à l'API.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'gemini',
    classe: 'IA',
    react: '🤖',
    desc: "Utilise l'API Gemini-Pro pour générer des réponses.",
  },
  async (chatJid, sock, ctx) => {
    const { arg, repondre } = ctx;
    const prompt = requirePrompt(arg, repondre);
    if (!prompt) return;
    const { elite } = getAiBases(config);
    if (!elite) return repondre(aiNotConfiguredMessage('AI_API_BASE'));
    try {
      const response = await axios.get(
        `${elite}/gemini?prompt=${encodeURIComponent(prompt)}`
      );
      return repondre(response.data?.text || 'Erreur de réponse de l\'API Gemini-Pro.');
    } catch (err) {
      console.error('Erreur Gemini-Pro :', err);
      return repondre("Une erreur est survenue lors de l'appel à l'API.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'llama',
    classe: 'IA',
    react: '🤖',
    desc: "Utilise l'API Llama pour générer des réponses.",
  },
  async (chatJid, sock, ctx) => {
    const { arg, repondre } = ctx;
    const prompt = requirePrompt(arg, repondre);
    if (!prompt) return;
    const { llama } = getAiBases(config);
    if (!llama) return repondre(aiNotConfiguredMessage('AI_LLAMA_API_BASE'));
    try {
      const response = await axios.get(
        `${llama}/llama?prompt=${encodeURIComponent(prompt)}`
      );
      return repondre(
        response.data?.response?.response || 'Erreur de réponse de l\'API Llama.'
      );
    } catch (err) {
      console.error('Erreur Llama :', err);
      return repondre("Une erreur est survenue lors de l'appel à l'API.");
    }
  }
);

registerCommand(
  {
    nom_cmd: 'claude',
    classe: 'IA',
    react: '🖤',
    desc: "Utilise l'API Claude pour générer des réponses.",
  },
  async (chatJid, sock, ctx) => {
    const { arg, repondre } = ctx;
    const prompt = requirePrompt(arg, repondre);
    if (!prompt) return;
    const { toxxic } = getAiBases(config);
    if (!toxxic) return repondre(aiNotConfiguredMessage('AI_TOXXIC_API_BASE'));
    try {
      const response = await axios.get(
        `${toxxic}/api/ai/claude?prompt=${encodeURIComponent(prompt)}`
      );
      return repondre(response.data?.data || 'Erreur de réponse de l\'API.');
    } catch (err) {
      console.error('Erreur Claude :', err);
      return repondre("Une erreur est survenue lors de l'appel à l'API.");
    }
  }
);
