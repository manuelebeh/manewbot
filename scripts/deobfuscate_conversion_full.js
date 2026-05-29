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
  'await', 'null', 'true', 'false', 'arguments', 'undefined',
]);

const CONTEXT_KEYS = new Set([
  'arg', 'ms', 'repondre', 'msg_Repondu', 'auteur_Msg_Repondu', 'auteur_Message',
  'nom_Auteur_Message', 'prefixe',
]);

const GLOBAL_NAMES = new Set([
  'chatJid', 'sock', 'ctx', 'config', 'fs', 'path', 'os', 'axios', 'FormData',
  'Sticker', 'StickerTypes', 'sharp', 'gTTS', 'Ranks', 'fusionCache',
  'uploadToCatbox', 'alea', 'isSupportedFile', 'remini', 'convertWebpToMp4',
  'readFileSync', 'execSync', 'spawn', 'registerCommand', 'Buffer', 'Math',
  'encodeURIComponent', 'console', 'Error', 'Promise', 'URLSearchParams',
]);

function isObf(name) {
  return /^_0x[a-f0-9]+$/i.test(name);
}

function safeName(base, used) {
  let name = base;
  let i = 2;
  while (used.has(name) || RESERVED.has(name)) name = base + i++;
  used.add(name);
  return name;
}

function inferFromInit(init, used) {
  if (!init) return safeName('value', used);
  if (init.type === 'AwaitExpression' && init.argument?.type === 'CallExpression') {
    const c = init.argument.callee;
    const prop = c?.property?.name;
    const obj = c?.object?.name;
    if (prop === 'dl_save_media_ms') return safeName('mediaPath', used);
    if (prop === 'sendMessage') return safeName('sentMessage', used);
    if (prop === 'profilePictureUrl') return safeName('profilePicUrl', used);
    if (prop === 'get' && obj === 'axios') return safeName('response', used);
    if (prop === 'post' && obj === 'axios') return safeName('response', used);
    if (prop === 'findOne') return safeName('rankRecord', used);
    if (c?.name === 'uploadToCatbox') return safeName('uploadUrl', used);
    if (c?.name === 'remini') return safeName('enhancedImage', used);
    if (c?.name === 'convertWebpToMp4') return safeName('mp4Url', used);
    if (prop === 'metadata') return safeName('metadata', used);
    if (prop === 'toBuffer') return safeName('outputBuffer', used);
    if (prop === 'join') return safeName('text', used);
    if (prop === 'split') return safeName('parts', used);
    if (prop === 'find') return safeName('viewOnceKey', used);
    if (prop === 'map') return safeName('svgLines', used);
    if (obj === 'fs' && prop === 'readFileSync') return safeName('fileBuffer', used);
    if (obj === 'fs' && prop === 'createReadStream') return safeName('fileStream', used);
    if (obj === 'path' && prop === 'join') return safeName('outputPath', used);
    if (obj === 'path' && prop === 'basename') return safeName('baseName', used);
    if (obj === 'path' && prop === 'dirname') return safeName('dirName', used);
    if (obj === 'Math' && prop === 'floor') return safeName('webpPath', used);
    if (c?.name === 'Object' && prop === 'keys') return safeName('messageKeys', used);
    if (c?.name === 'spawn') return safeName('ffmpegProcess', used);
    if (c?.name === 'parseFloat') return safeName('duration', used);
    if (c?.name === 'Buffer' && prop === 'from') return safeName('buffer', used);
  }
  if (init.type === 'CallExpression') {
    const prop = init.callee?.property?.name;
    const obj = init.callee?.object?.name;
    if (obj === 'fs' && prop === 'readFileSync') return safeName('fileBuffer', used);
    if (prop === 'join') return safeName('text', used);
    if (prop === 'split') return safeName('parts', used);
    if (prop === 'find') return safeName('urlToken', used);
    if (prop === 'map') return safeName('svgLines', used);
    if (prop === 'some') return safeName('matches', used);
    if (init.callee?.name === 'sharp') return safeName('image', used);
    if (init.callee?.name === 'Object' && prop === 'keys') return safeName('messageKeys', used);
  }
  if (init.type === 'MemberExpression') {
    if (init.property?.name === 'message') return safeName('sourceMessage', used);
    if (init.property?.name === 'data') return safeName('data', used);
  }
  if (init.type === 'LogicalExpression' || init.type === 'BinaryExpression') {
    return safeName('sourceMessage', used);
  }
  if (init.type === 'Identifier') {
    if (init.name === 'msg_Repondu') return safeName('sourceMessage', used);
    if (init.name === 'arg') return safeName('commandArgs', used);
    if (init.name === 'auteur_Message') return safeName('senderKey', used);
  }
  if (init.type === 'ArrayExpression') return safeName('modes', used);
  if (init.type === 'ObjectExpression') return safeName('payload', used);
  if (init.type === 'NewExpression') {
    if (init.callee?.name === 'FormData') return safeName('formData', used);
    if (init.callee?.name === 'Sticker') return safeName('sticker', used);
    if (init.callee?.name === 'gTTS') return safeName('tts', used);
    if (init.callee?.name === 'Promise') return safeName('promise', used);
  }
  if (init.type === 'UnaryExpression') return safeName('flag', used);
  return safeName('value', used);
}

function collectBindings(node, isHandler) {
  const bindings = new Map();
  const used = new Set(GLOBAL_NAMES);

  function bind(old, neu) {
    if (!isObf(old) || bindings.has(old)) return;
    if (used.has(neu)) neu = safeName(neu, used);
    else used.add(neu);
    bindings.set(old, neu);
  }

  if (node.params) {
    node.params.forEach((param, idx) => {
      if (param.type === 'Identifier' && isObf(param.name)) {
        if (isHandler && idx < 3) {
          const forced = ['chatJid', 'sock', 'ctx'][idx];
          bindings.set(param.name, forced);
          used.add(forced);
          return;
        }
        bind(param.name, safeName('param', used));
      }
      if (param.type === 'ObjectPattern') {
        param.properties.forEach((prop) => {
          if (prop.value?.type === 'Identifier' && isObf(prop.value.name)) {
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
        n.id.properties.forEach((prop) => {
          if (prop.value?.type === 'Identifier' && isObf(prop.value.name)) {
            bind(prop.value.name, prop.key.name);
          }
        });
      }
    },
    CatchClause(n) {
      if (n.param?.type === 'Identifier' && isObf(n.param.name)) bind(n.param.name, 'err');
    },
    Function() {},
  });

  walk.simple(node.body || node, {
    Function() {},
    Identifier(n) {
      if (isObf(n.name) && !bindings.has(n.name)) bind(n.name, safeName('tmp', used));
    },
  });

  return bindings;
}

function applyBindings(code, bindings) {
  let result = code;
  const sorted = [...bindings.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of sorted) {
    result = result.replace(new RegExp('\\b' + from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g'), to);
  }
  return result;
}

function preprocess(source) {
  let result = source;
  result = result.replace(
    /async \(_0x[a-f0-9]+, _0x[a-f0-9]+, \{([^}]+)\}\) => \{/g,
    'async (chatJid, sock, ctx) => {\n  const {$1} = ctx;'
  );
  result = result.replace(/\} = _0x[a-f0-9]+;/g, '} = ctx;');
  return result;
}

function deobfuscate(source) {
  source = preprocess(source);
  const ast = acorn.parse(source, { ecmaVersion: 'latest', sourceType: 'script' });
  const nodes = [];

  function isCommandHandler(node) {
    return node.params?.length === 3
      && node.params.every((p) => p.type === 'Identifier')
      && (isObf(node.params[0].name) || node.params[0].name === 'chatJid');
  }

  walk.simple(ast, {
    FunctionDeclaration(node) {
      nodes.push({ node, isHandler: false });
    },
    FunctionExpression(node) {
      nodes.push({ node, isHandler: isCommandHandler(node) });
    },
    ArrowFunctionExpression(node) {
      nodes.push({ node, isHandler: isCommandHandler(node) });
    },
  });

  nodes.sort((a, b) => b.node.start - a.node.start);
  let result = source;
  for (const { node, isHandler } of nodes) {
    const slice = result.slice(node.start, node.end);
    const bindings = collectBindings(node, isHandler);
    const newSlice = applyBindings(slice, bindings);
    result = result.slice(0, node.start) + newSlice + result.slice(node.end);
  }

  for (const key of CONTEXT_KEYS) {
    result = result.replace(new RegExp(key + ': ' + key, 'g'), key);
  }

  result = result.replace(/\bchatJid2\b/g, 'chatJid');
  result = result.replace(/\bsocket2\b/g, 'sock');
  result = result.replace(/\bctx2\b/g, 'ctx');
  result = result.replace(/\btmp2\.sendMessage\(tmp32/g, 'sock.sendMessage(chatJid');
  result = result.replace(/\btmp42\.profilePictureUrl\(tmp52/g, 'sock.profilePictureUrl(auteur_Msg_Repondu');
  result = result.replace(/\bquoted: tmp72\b/g, 'quoted: ms');

  return result;
}

const input = process.argv[2] || '/tmp/conversion_obf.js';
const output = process.argv[3] || 'cmd/conversion.js';
const source = fs.readFileSync(input, 'utf8');
const result = deobfuscate(source);
fs.writeFileSync(output, result, 'utf8');
const remaining = (result.match(/_0x[a-f0-9]+/gi) || []).length;
console.log(JSON.stringify({ output, remaining }));
