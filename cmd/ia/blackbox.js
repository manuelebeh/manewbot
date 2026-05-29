'use strict';

const { registerCommand } = require('./register');
const { config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt } = require('./deps');

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
