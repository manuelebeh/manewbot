'use strict';

const cmd = [];

function registerCommand(meta, handler) {
  const entry = { ...meta };

  if (!entry.classe) entry.classe = 'Autres';
  if (!entry.react) entry.react = '🎐';
  if (!entry.desc) entry.desc = 'Aucune description';
  if (!entry.alias) entry.alias = [];

  entry.fonction = handler;
  cmd.push(entry);

  return entry;
}

module.exports = {
  registerCommand,
  cmd,
};
