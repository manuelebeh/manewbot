'use strict';

const {
  registerCommand, config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt,
} = require('./_shared');

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
