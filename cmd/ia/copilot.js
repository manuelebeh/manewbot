'use strict';

const { registerCommand } = require('./register');
const { config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt } = require('./deps');

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
