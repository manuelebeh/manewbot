'use strict';

const { registerCommand } = require('./register');
const { config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt } = require('./deps');

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
