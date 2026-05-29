'use strict';

const { registerCommand } = require('../../lib/commands');
const { ChatbotConf } = require('../../database/chatbot');
const { requireOwner } = require('../../lib/require-owner');

registerCommand(
  {
    nom_cmd: 'chatbot',
    classe: 'Owner',
    react: '🤖',
    desc: 'Active ou désactive le chatbot ici ou globalement.',
  },
  async (chatJid, sock, ctx) => {
    const { repondre, arg } = ctx;
    const mode = arg[0]?.toLowerCase();

    if (!requireOwner(ctx, () => repondre('❌ Pas autorisé.'))) return;

    try {
      const [row] = await ChatbotConf.findOrCreate({
        where: { id: '1' },
        defaults: {
          chatbot_pm: 'non',
          chatbot_gc: 'non',
          enabled_ids: JSON.stringify([]),
        },
      });

      let enabledIds = [];
      try {
        enabledIds = JSON.parse(row.enabled_ids || '[]');
      } catch {
        enabledIds = [];
      }

      if (mode === 'on') {
        if (enabledIds.includes(chatJid)) {
          return repondre('🔁 Le chatbot est *déjà activé ici*.');
        }
        enabledIds.push(chatJid);
        row.enabled_ids = JSON.stringify([...new Set(enabledIds)]);
        row.chatbot_pm = 'non';
        row.chatbot_gc = 'non';
        await row.save();
        return repondre('✅ Le chatbot est maintenant activé *dans cette discussion*.');
      }

      if (mode === 'off') {
        row.chatbot_pm = 'non';
        row.chatbot_gc = 'non';
        row.enabled_ids = JSON.stringify([]);
        await row.save();
        return repondre('⛔️ Le chatbot est maintenant désactivé *partout*.');
      }

      if (['pm', 'gc', 'all'].includes(mode)) {
        row.chatbot_pm = mode === 'pm' || mode === 'all' ? 'oui' : 'non';
        row.chatbot_gc = mode === 'gc' || mode === 'all' ? 'oui' : 'non';
        row.enabled_ids = JSON.stringify([]);
        await row.save();
        const messages = {
          pm: '✅ Le chatbot est maintenant activé *dans tous les chats privés*.',
          gc: '✅ Le chatbot est maintenant activé *dans tous les groupes*.',
          all: '✅ Le chatbot est maintenant activé *partout*.',
        };
        return repondre(messages[mode]);
      }

      return repondre(
        '🤖 *Gestion du Chatbot*\n\n`chatbot on` - Active ici uniquement\n`chatbot off` - Désactive *partout*\n`chatbot pm` - Active dans *tous les chats privés*\n`chatbot gc` - Active dans *tous les groupes*\n`chatbot all` - Active *partout*'
      );
    } catch (err) {
      console.error('❌ Erreur dans la commande chatbot :', err);
      repondre('Une erreur est survenue.');
    }
  }
);
