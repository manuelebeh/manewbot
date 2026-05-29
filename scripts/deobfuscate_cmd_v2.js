#!/usr/bin/env node
'use strict';

const fs = require('fs');
const acorn = require('acorn');
const walk = require('acorn-walk');

const RESERVED = new Set([
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
  'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
  'if', 'import', 'in', 'instanceof', 'let', 'new', 'return', 'super', 'switch',
  'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
  'await', 'enum', 'implements', 'interface', 'package', 'private', 'protected',
  'public', 'static', 'null', 'true', 'false', 'arguments', 'undefined',
]);

const HANDLER_PARAMS = ['chatJid', 'sock', 'ctx'];
const CONTEXT_KEYS = new Set([
  'arg', 'ms', 'repondre', 'msg_Repondu', 'auteur_Msg_Repondu', 'auteur_Message',
  'nom_Auteur_Message', 'getJid', 'quote', 'id_Bot', 'mtype', 'groupe_Admin',
  'isSudo', 'dev_id', 'verif_Admin', 'verif_Sudo', 'verif_Owner', 'isGroup',
  'isAdmin', 'isBotAdmin', 'prefixe', 'body', 'pushName', 'mention',
  'verif_Groupe', 'mbre_membre', 'infos_Groupe', 'verif_Admin',
]);

function isObf(name) {
  return /^_0x[a-f0-9]+$/i.test(name);
}

function safeName(base, used) {
  let name = base.replace(/[^a-zA-Z0-9_$]/g, '') || 'value';
  if (/^\d/.test(name)) name = 'v' + name;
  let i = 2;
  while (used.has(name) || RESERVED.has(name)) {
    name = base.replace(/[^a-zA-Z0-9_$]/g, '') + i++;
  }
  used.add(name);
  return name;
}

function inferFromInit(init, used) {
  if (!init) return safeName('value', used);
  if (init.type === 'AwaitExpression') {
    const arg = init.argument;
    if (arg?.type === 'CallExpression') {
      const prop = arg.callee?.property?.name;
      const obj = arg.callee?.object?.name;
      const name = arg.callee?.name;
      if (prop === 'get') return safeName('response', used);
      if (prop === 'findAll') return safeName('records', used);
      if (prop === 'findOne') return safeName('record', used);
      if (prop === 'findOrCreate') return safeName('dbRow', used);
      if (prop === 'sendMessage') return safeName('sent', used);
      if (prop === 'dl_save_media_ms') return safeName('mediaPath', used);
      if (prop === 'profilePictureUrl') return safeName('profilePic', used);
      if (prop === 'recup_msg') return safeName('replyMsg', used);
      if (prop === 'groupMetadata') return safeName('groupMeta', used);
      if (prop === 'groupInviteCode') return safeName('inviteCode', used);
      if (name === 'getJid' || prop === 'getJid') return safeName('resolvedJid', used);
      if (obj === 'sock' && prop === 'groupMetadata') return safeName('groupMeta', used);
    }
  }
  if (init.type === 'CallExpression') {
    const prop = init.callee?.property?.name;
    const name = init.callee?.name;
    const obj = init.callee?.object?.name;
    if (prop === 'join') return safeName('text', used);
    if (prop === 'split') return safeName('parts', used);
    if (prop === 'filter') return safeName('filtered', used);
    if (prop === 'map') return safeName('mapped', used);
    if (name === 'parseInt') return safeName('amount', used);
    if (obj === 'JSON' && prop === 'parse') return safeName('parsed', used);
    if (obj === 'fs' && prop === 'readFileSync') return safeName('fileContent', used);
    if (name === 'Date' && prop === 'now') return safeName('now', used);
    if (obj === 'Math' && prop === 'floor') return safeName('rounded', used);
    if (obj === 'Math' && prop === 'random') return safeName('randomValue', used);
    if (name === 'encodeURIComponent') return safeName('encoded', used);
    if (name === 'setInterval') return safeName('intervalId', used);
    if (name === 'setTimeout') return safeName('timeoutId', used);
    if (obj === 'Sticker' || name === 'Sticker') return safeName('sticker', used);
    if (prop === 'toBuffer') return safeName('stickerBuffer', used);
    if (prop === 'match') return safeName('match', used);
    if (prop === 'includes') return safeName('hasFlag', used);
    if (prop === 'replace') return safeName('formattedText', used);
    if (prop === 'sort') return safeName('shuffled', used);
    if (prop === 'slice') return safeName('subset', used);
    if (prop === 'findOne') return safeName('rankRecord', used);
  }
  if (init.type === 'BinaryExpression' || init.type === 'LogicalExpression' || init.type === 'ConditionalExpression') {
    return safeName('targetJid', used);
  }
  if (init.type === 'MemberExpression') {
    const prop = init.property?.name;
    if (prop === 'participants') return safeName('participants', used);
    if (prop === 'conversation') return safeName('quotedText', used);
    if (prop === 'data') return safeName('data', used);
    if (prop === 'length') return safeName('count', used);
    if (prop === 'subject') return safeName('groupName', used);
    if (prop === 'desc') return safeName('groupDesc', used);
    if (init.object?.name === 'arg') return safeName('firstArg', used);
    if (init.object?.name === 'ctx') return safeName('ctxValue', used);
  }
  if (init.type === 'TemplateLiteral' || (init.type === 'Literal' && typeof init.value === 'string')) {
    return safeName('messageText', used);
  }
  if (init.type === 'ObjectExpression') return safeName('payload', used);
  if (init.type === 'ArrayExpression') return safeName('list', used);
  if (init.type === 'NewExpression') {
    if (init.callee?.name === 'Map') return safeName('players', used);
    if (init.callee?.name === 'Set') return safeName('usedWords', used);
    if (init.callee?.name === 'Sticker') return safeName('sticker', used);
    return safeName('instance', used);
  }
  if (init.type === 'UnaryExpression') return safeName('flag', used);
  if (init.type === 'Identifier') {
    const n = init.name;
    if (n === 'infos_Groupe') return safeName('groupMeta', used);
    if (n === 'arg') return safeName('firstArg', used);
    if (n === 'ctx') return safeName('ctx', used);
    return safeName(n, used);
  }
  if (init.type === 'FunctionExpression' || init.type === 'ArrowFunctionExpression') {
    return safeName('callback', used);
  }
  return safeName('value', used);
}

function collectScopeRenames(node, isHandlerScope) {
  const bindings = new Map();
  const used = new Set();

  function bind(name, newName) {
    if (!isObf(name) || bindings.has(name)) return;
    if (RESERVED.has(newName)) newName = safeName(newName + 'Val', used);
    if (used.has(newName)) newName = safeName(newName, used);
    else used.add(newName);
    bindings.set(name, newName);
  }

  if (node.params) {
    node.params.forEach((param, idx) => {
      if (param.type === 'Identifier' && isObf(param.name)) {
        bind(param.name, isHandlerScope && idx < 3 ? HANDLER_PARAMS[idx] : inferFromInit(null, used));
      } else if (param.type === 'ObjectPattern') {
        param.properties.forEach(prop => {
          if (prop.type === 'Property' && prop.value?.type === 'Identifier' && isObf(prop.value.name)) {
            bind(prop.value.name, prop.key.name);
          }
        });
      }
    });
  }

  walk.simple(node.body || node, {
    VariableDeclarator(n) {
      if (n.id.type === 'Identifier' && isObf(n.id.name)) {
        bind(n.id.name, inferFromInit(n.init, used));
      }
      if (n.id.type === 'ObjectPattern') {
        n.id.properties.forEach(prop => {
          if (prop.type === 'Property' && prop.value?.type === 'Identifier' && isObf(prop.value.name)) {
            bind(prop.value.name, prop.key.name);
          }
        });
      }
    },
    CatchClause(n) {
      if (n.param?.type === 'Identifier' && isObf(n.param.name)) {
        bind(n.param.name, 'err');
      }
    },
    Function() {},
  });

  walk.simple(node.body || node, {
    Function() {},
    Identifier(n) {
      if (isObf(n.name) && !bindings.has(n.name)) {
        bind(n.name, safeName('item', used));
      }
    },
  });

  return bindings;
}

function applyBindingsInRange(source, start, end, bindings) {
  let chunk = source.slice(start, end);
  const sorted = [...bindings.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of sorted) {
    chunk = chunk.replace(new RegExp('\\b' + from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g'), to);
  }
  return source.slice(0, start) + chunk + source.slice(end);
}

function collectFunctions(ast) {
  const fns = [];
  walk.simple(ast, {
    FunctionDeclaration(n) {
      fns.push(n);
    },
  });
  walk.simple(ast, {
    FunctionExpression(n) {
      fns.push(n);
    },
    ArrowFunctionExpression(n) {
      fns.push(n);
    },
  });
  return fns.sort((a, b) => b.start - a.start);
}

function deobfuscateSource(source) {
  const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script' });
  let result = source;

  const registerCalls = [];
  walk.simple(ast, {
    CallExpression(node) {
      if (node.callee?.name === 'registerCommand' && node.arguments[1]?.type?.includes('Function')) {
        registerCalls.push(node.arguments[1]);
      }
    },
  });

  const allFns = collectFunctions(ast);
  const handlerSet = new Set(registerCalls);

  for (const fn of allFns) {
    if (fn.start == null || fn.end == null) continue;
    const isHandler = handlerSet.has(fn);
    const bindings = collectScopeRenames(fn, isHandler);
    if (bindings.size) {
      result = applyBindingsInRange(result, fn.start, fn.end, bindings);
    }
  }

  return result;
}

function polishSource(source) {
  let result = source;

  result = result.replace(
    /}, async \(chatJid, sock, \{([^}]+)\}\) => \{/g,
    (match, inner) => {
      const props = inner.split(',').map(s => {
        const t = s.trim();
        const m = t.match(/^(\w+):\s*\1\s*$/);
        return m ? m[1] : t.replace(/^(\w+):\s*(\w+)\s*$/, (_, k, v) => (k === v ? k : `${k}: ${v}`));
      });
      return `}, async (chatJid, sock, ctx) => {\n  const {\n    ${props.join(',\n    ')}\n  } = ctx;`;
    }
  );

  result = result.replace(/const \{\s*([^}]+)\s*\} = ctx;/g, (match, inner) => {
    const fixed = inner.split(',').map(part => {
      const t = part.trim();
      const m = t.match(/^([\w]+):\s*\1\s*$/);
      return m ? m[1] : t;
    }).join(',\n    ');
    return `const {\n    ${fixed}\n  } = ctx;`;
  });

  return result;
}

function convertHandlerParams(source) {
  const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script' });
  let result = source;
  const patches = [];

  walk.simple(ast, {
    CallExpression(node) {
      if (node.callee?.name !== 'registerCommand') return;
      const handler = node.arguments[1];
      if (!handler?.params?.[2] || handler.params[2].type !== 'ObjectPattern') return;
      const props = handler.params[2].properties.map(p => {
        if (p.type === 'Property' && p.key.type === 'Identifier') {
          const key = p.key.name;
          const val = p.value.type === 'Identifier' ? p.value.name : key;
          return key === val ? key : `${key}: ${val}`;
        }
        return null;
      }).filter(Boolean);
      if (!props.length) return;
      const body = handler.body;
      const destructure = `const {\n    ${props.join(',\n    ')}\n  } = ctx;`;
      const already = source.slice(body.start, body.start + 80).includes('= ctx');
      if (already) return;
      patches.push({
        paramStart: handler.params[2].start,
        paramEnd: handler.params[2].end,
        bodyStart: body.start + 1,
        newParam: 'ctx',
        destructure,
      });
    },
  });

  patches.sort((a, b) => b.paramStart - a.paramStart);
  for (const p of patches) {
    result = result.slice(0, p.paramStart) + p.newParam + result.slice(p.paramEnd);
    result = result.slice(0, p.bodyStart) + '\n  ' + p.destructure + '\n' + result.slice(p.bodyStart);
  }
  return result;
}

const files = process.argv.slice(2);
for (const file of files) {
  let source = fs.readFileSync(file, 'utf8');
  const hadObf = /_0x[a-f0-9]+/i.test(source);
  if (hadObf) {
    source = deobfuscateSource(source);
  }
  source = convertHandlerParams(source);
  source = polishSource(source);
  const after = (source.match(/_0x[a-f0-9]+/gi) || []).length;
  fs.writeFileSync(file, source, 'utf8');
  console.log(JSON.stringify({ file: require('path').basename(file), _0x_remaining: after }));
}
