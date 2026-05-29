'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../set');

const NOM_BOT = config.NOM_BOT || 'Manewbot';
const NOM_OWNER = config.NOM_OWNER || 'Manewbie';

const REPLACEMENTS = [
  ['OVL-GAMES', 'Jeux'],
  ['OVL-ECON--y', 'Economie'],
  ['OVL-ECON--Y', 'ECONOMIE'],
  ['OVL-RANK', 'Classement'],
  ['OVL-GOD-LEVEL', 'Niveau Divin'],
  ['OVL-LOG-MSG', 'BOT-LOG'],
  ['ovl-user', 'utilisateur'],
  ['verif_Ovl_Admin', 'verif_Bot_Admin'],
  ['𝙊𝙑𝙇-𝙈𝘿', NOM_BOT],
  ['𝙊𝙑𝙇 𝘽𝙊𝙏', NOM_BOT],
  ['OVL BOT ONLINE', NOM_BOT.toUpperCase() + ' ONLINE'],
  ['Powered By OVL-MD-v2', 'Powered by ' + NOM_BOT],
  ['Powered By OVL-MD-V2', 'Powered by ' + NOM_BOT],
  ['Powered by OVL-MD-V2', 'Powered by ' + NOM_BOT],
  ['Powered By Manewbot', 'Powered by ' + NOM_BOT],
  ['Powered by Manewbot', 'Powered by ' + NOM_BOT],
  ['©2025 OVL-MD-V2 By *AINZ*', '©2025 ' + NOM_BOT + ' by *' + NOM_OWNER + '*'],
  ['©2025 ᴏᴠʟ-ᴍᴅ-ᴠ2 ʙʏ *ᴀɪɴᴢ*', '©2025 ' + NOM_BOT + ' by *' + NOM_OWNER + '*'],
  ['*OVL-MD-V2*', '*' + NOM_BOT + '*'],
  ['OVL-MD-V2', NOM_BOT],
  ['OVL-MD-LYRICS', NOM_BOT + '-LYRICS'],
  ['OVL-MD-USER', NOM_BOT + '-USER'],
  ['OVL-MD Hidtag', NOM_BOT + ' Hidtag'],
  ['OVL-MD ANTI-DELETE', NOM_BOT + ' ANTI-DELETE'],
  ['OVL-MD SUPPORT', NOM_BOT + ' SUPPORT'],
  ['OVL-MD Ping', NOM_BOT + ' Ping'],
  ['📦 OVL-MD-V2', '📦 ' + NOM_BOT],
  ['🎵 OVL-MD-LYRICS', '🎵 ' + NOM_BOT + '-LYRICS'],
  ['Version*: OVL-MD ', 'Version: ' + NOM_BOT + ' '],
  ['*AINZ*', '*' + NOM_OWNER + '*'],
  ['*ᴀɪɴᴢ*', '*' + NOM_OWNER.toLowerCase() + '*'],
  ['"Ainz"', '"' + NOM_OWNER + '"'],
  ["'Ainz'", "'" + NOM_OWNER + "'"],
];

const SKIP_DIRS = new Set(['node_modules', 'auth', '.git', 'packages', 'scripts']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith('.js')) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(path.join(__dirname, '..'))) {
  let content = fs.readFileSync(file, 'utf8');
  const before = content;

  for (const [from, to] of REPLACEMENTS) {
    content = content.split(from).join(to);
  }

  if (content !== before) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('updated', path.relative(process.cwd(), file));
    changed++;
  }
}

console.log('Done:', changed, 'files');
