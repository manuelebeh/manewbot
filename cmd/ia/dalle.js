'use strict';

const {
  registerCommand, config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt,
} = require('./_shared');

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
