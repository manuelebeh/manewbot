'use strict';

const cmd = [];
const func = [];

function registerCommand(meta, handler) {
  const entry = { ...meta };

  if (!entry.classe) entry.classe = 'Autres';
  if (!entry.react) entry.react = '🎐';
  if (!entry.desc) entry.desc = 'Aucune description';
  if (!entry.alias) entry.alias = [];
  if (typeof entry.isfunc === 'undefined') entry.isfunc = false;

  entry.fonction = handler;

  if (entry.isfunc === true) {
    func.push(entry);
  } else {
    cmd.push(entry);
  }

  return entry;
}

module.exports = {
  registerCommand,
  cmd,
  func,
};
