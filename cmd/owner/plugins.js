'use strict';

const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { registerCommand } = require('../../lib/commands');
const { Plugin } = require('../../database/plugin');
const { reloadCommands } = require('../../lib/plugin');

const DISABLED_MSG = '⛔ Les plugins distants sont désactivés sur cette instance.';

registerCommand(
  {
    nom_cmd: 'pglist',
    classe: 'Owner',
    react: '🧩',
    desc: "Affiche la liste des plugins disponibles avec statut d'installation.",
    alias: ['pgl', 'plist'],
  },
  async (chatJid, sock, ctx) => {
    const { repondre } = ctx;
    return repondre(DISABLED_MSG);
    try {
      const { data: remoteList } = await axios.get('https://127.0.0.1/plugins-disabled');
      const records = await Plugin.findAll();
      const installed = records.map((row) => row.name.toLowerCase());
      let list = [];
      if (Array.isArray(remoteList)) {
        list = remoteList.map((plugin, index) => {
          const isInstalled = installed.includes(plugin.name.toLowerCase());
          const icon = isInstalled ? '✅' : '❌';
          return (
            `*${icon} Plugin #${index + 1}*\n🧩 *Nom:* ${plugin.name}\n👤 *Auteur:* ${plugin.author}\n📦 *Installé:* ${isInstalled ? 'Oui ✅' : 'Non ❌'}\n🔗 *Lien:* ${plugin.url}\n📝 *Description:* ${plugin.description || 'Aucune description'}`
          );
        });
      }
      const customOnly = records.filter(
        (row) => !remoteList?.some((plugin) => plugin.name.toLowerCase() === row.name.toLowerCase())
      );
      customOnly.forEach((row) => {
        list.push(`*✅ Plugin personnalisé*\n🧩 *Nom:* ${row.name}\n`);
      });
      const text =
        list.length > 0
          ? '📦 *Plugins disponibles :*\n\n' + list.join('\n\n')
          : '❌ Aucun plugin disponible.';
      await repondre(text);
    } catch (err) {
      console.error('Erreur pluginlist :', err);
      await repondre('❌ Une erreur est survenue lors du chargement des plugins.');
    }
  }
);

registerCommand(
  {
    nom_cmd: 'pgremove',
    classe: 'Owner',
    react: '🗑️',
    desc: 'Supprime un plugin installé par nom ou tape `remove all` pour tous.',
    alias: ['pgr'],
  },
  async (chatJid, sock, ctx) => {
    const { arg, repondre } = ctx;
    return repondre(DISABLED_MSG);
    const name = arg[0];
    if (!name) {
      return repondre('❌ Utilise `remove nom_plugin` ou `remove all`.');
    }
    if (name === 'all') {
      const records = await Plugin.findAll();
      for (const row of records) {
        const filePath = path.join(__dirname, '../../plugins', row.name + '.js');
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        await Plugin.destroy({ where: { name: row.name } });
      }
      await reloadCommands();
      return repondre('🗑️ Tous les plugins ont été supprimés.');
    }
    const record = await Plugin.findOne({ where: { name } });
    if (!record) {
      return repondre('❌ Plugin non trouvé dans la base.');
    }
    const filePath = path.join(__dirname, '../../plugins', record.name + '.js');
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await Plugin.destroy({ where: { name } });
    await reloadCommands();
    return repondre(`🗑️ Plugin *${name}* supprimé.`);
  }
);

registerCommand(
  {
    nom_cmd: 'pginstall',
    classe: 'Owner',
    react: '📥',
    desc: 'Installe un plugin.',
    alias: ['pgi'],
  },
  async (chatJid, sock, ctx) => {
    const { arg, repondre } = ctx;
    return repondre(DISABLED_MSG);
    const target = arg[0];
    if (!target) {
      return repondre(
        '❌ Donne un lien direct vers un plugin ou tape `pginstall all` pour tout installer.'
      );
    }
    const installOne = async (url, name) => {
      try {
        const existing = await Plugin.findOne({ where: { name } });
        if (existing) {
          return repondre(`⚠️ Le plugin *${name}* est déjà installé.`);
        }
        const { data } = await axios.get(url);
        const pluginsDir = path.join(__dirname, '../../plugins');
        if (!fs.existsSync(pluginsDir)) {
          fs.mkdirSync(pluginsDir, { recursive: true });
        }
        fs.writeFileSync(path.join(pluginsDir, name + '.js'), data, 'utf8');
        await Plugin.create({ name });
        await reloadCommands();
        repondre(`✅ Plugin *${name}* installé avec succès.`);
      } catch (err) {
        console.error('Erreur installation plugin :', err);
        repondre(`❌ Échec installation *${name}* : ${err.message}`);
      }
    };
    if (target === 'all') {
      return repondre('❌ Installation globale désactivée.');
    }
    await installOne(target, path.basename(target, '.js'));
  }
);
