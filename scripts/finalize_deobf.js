#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function fixDestructuring(source) {
  return source.replace(/const \{\s*([^}]+)\s*\} = ctx;/g, (match, inner) => {
    const props = inner.split(',').map(part => {
      const t = part.trim();
      const m = t.match(/^([\w]+):\s*\1\s*$/);
      return m ? m[1] : t;
    });
    return `const {\n    ${props.join(',\n    ')}\n  } = ctx;`;
  });
}

function fixInlineHandlerParams(source) {
  return source.replace(
    /}, async \(chatJid, sock, \{([^}]+)\}\) => \{/g,
    (match, inner) => {
      const props = inner.split(',').map(s => {
        const t = s.trim();
        const m = t.match(/^([\w]+):\s*\1\s*$/);
        return m ? m[1] : t;
      });
      return `}, async (chatJid, sock, ctx) => {\n  const {\n    ${props.join(',\n    ')}\n  } = ctx;`;
    }
  );
}

// jeux.js
const jeuxPath = path.join(root, 'cmd/jeux.js');
let jeux = fs.readFileSync(jeuxPath, 'utf8');
const tttStart = jeux.indexOf('registerCommand({\n  nom_cmd: "tictactoe"');
const tttEnd = jeux.indexOf('registerCommand({\n  nom_cmd: "anime-quizz"');
if (tttStart >= 0 && tttEnd > tttStart) {
  const ttt = fs.readFileSync(path.join(__dirname, 'tictactoe_handler.js'), 'utf8');
  jeux = jeux.slice(0, tttStart) + ttt + '\n' + jeux.slice(tttEnd);
}
jeux = fixDestructuring(fixInlineHandlerParams(jeux));
fs.writeFileSync(jeuxPath, jeux);

// groupe.js — welcome + commands blocks
const groupePath = path.join(root, 'cmd/groupe.js');
let groupe = fs.readFileSync(groupePath, 'utf8');
const welcomeStart = groupe.indexOf('const welcomeGoodbyeCmd');
const welcomeEnd = groupe.indexOf('welcomeGoodbyeCmd("welcome")');
if (welcomeStart >= 0 && welcomeEnd > welcomeStart) {
  const welcomeSnippet = fs.readFileSync(path.join(__dirname, 'welcome_goodbye_snippet.js'), 'utf8');
  groupe = groupe.slice(0, welcomeStart) + welcomeSnippet + '\n' + groupe.slice(welcomeEnd);
}
const cmdStart = groupe.indexOf('commands.forEach');
if (cmdStart >= 0) {
  const cmdSnippet = fs.readFileSync(path.join(__dirname, 'commands_forEach_snippet.js'), 'utf8');
  groupe = groupe.slice(0, cmdStart) + cmdSnippet;
}
groupe = fixDestructuring(fixInlineHandlerParams(groupe));
fs.writeFileSync(groupePath, groupe);

// economie.js
const econPath = path.join(root, 'cmd/economie.js');
let econ = fs.readFileSync(econPath, 'utf8');
econ = fixDestructuring(fixInlineHandlerParams(econ));
fs.writeFileSync(econPath, econ);

console.log('finalize done');
