'use strict';

const fs = require('fs');
const path = require('path');

const CMD = path.join(__dirname, '..', 'cmd');

function sliceFile(srcPath, start, end) {
  const lines = fs.readFileSync(srcPath, 'utf8').split('\n');
  return lines.slice(start - 1, end).join('\n');
}

function writeModule(dir, files, indexStems) {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of files) {
    const content =
      "'use strict';\n\n" + f.header + sliceFile(f.src, f.start, f.end) + '\n';
    fs.writeFileSync(path.join(dir, f.out), content);
  }
  const index = ["'use strict';", ''];
  for (const stem of indexStems) {
    const folder = path.basename(dir);
    index.push(`require('./${folder}/${stem}');`);
  }
  const indexName = path.join(CMD, path.basename(dir) + '.js');
  fs.writeFileSync(index, index.join('\n') + '\n');
}

function header(exports) {
  return `const {\n  ${exports},\n} = require('./_shared');\n\n`;
}

// --- config-display fix done separately ---

const splits = [
  {
    dir: path.join(CMD, 'confidentialite'),
    index: ['presence', 'account', 'privacy'],
    shared: `'use strict';

const { registerCommand } = require('../../lib/commands');

const privacyValues = ${sliceFile(path.join(CMD, 'confidentialite.js'), 125, 192)};

async function handlePrivacyCommand({
  type,
  bot,
  repondre,
  arg,
  isSudo,
  updateFunction,
  label,
}) {
${sliceFile(path.join(CMD, 'confidentialite.js'), 193, 232).split('\n').slice(1).join('\n')}
}

module.exports = {
  registerCommand,
  privacyValues,
  handlePrivacyCommand,
};
`,
    files: [
      {
        src: path.join(CMD, 'confidentialite.js'),
        out: 'presence.js',
        start: 7,
        end: 56,
        header: header('registerCommand'),
      },
      {
        src: path.join(CMD, 'confidentialite.js'),
        out: 'account.js',
        start: 57,
        end: 124,
        header: header('registerCommand'),
      },
      {
        src: path.join(CMD, 'confidentialite.js'),
        out: 'privacy.js',
        start: 233,
        end: 329,
        header: header('registerCommand, handlePrivacyCommand'),
      },
    ],
  },
];

// Run confidentialite with custom shared first
const confDir = path.join(CMD, 'confidentialite');
const confSrc = path.join(CMD, 'confidentialite.js');
if (fs.existsSync(confSrc)) {
  fs.mkdirSync(confDir, { recursive: true });
  // Build _shared from lines 125-232
  const lines = fs.readFileSync(confSrc, 'utf8').split('\n');
  const sharedBody = lines.slice(124, 232).join('\n');
  fs.writeFileSync(
    path.join(confDir, '_shared.js'),
    `'use strict';

const { registerCommand } = require('../../lib/commands');

${sharedBody}

module.exports = {
  registerCommand,
  privacyValues,
  handlePrivacyCommand,
};
`
  );
  for (const f of splits[0].files) {
    fs.writeFileSync(
      path.join(confDir, f.out),
      "'use strict';\n\n" + f.header + sliceFile(f.src, f.start, f.end) + '\n'
    );
  }
  fs.writeFileSync(
    path.join(CMD, 'confidentialite.js'),
    ["'use strict';", '', "require('./confidentialite/presence');", "require('./confidentialite/account');", "require('./confidentialite/privacy');", ''].join('\n')
  );
  console.log('✓ confidentialite/');
}

function splitSimple(name, indexStems, sharedContent, fileDefs) {
  const dir = path.join(CMD, name);
  const src = path.join(CMD, name + '.js');
  if (!fs.existsSync(src)) return;
  const srcLines = fs.readFileSync(src, 'utf8');
  if (srcLines.split('\n').length < 15 && srcLines.includes("require('./" + name + '/')) {
    console.log('⊘', name, 'already split');
    return;
  }
  fs.mkdirSync(dir, { recursive: true });
  if (sharedContent) {
    fs.writeFileSync(path.join(dir, '_shared.js'), sharedContent);
  }
  for (const f of fileDefs) {
    fs.writeFileSync(
      path.join(dir, f.out),
      "'use strict';\n\n" + (f.header || '') + sliceFile(src, f.start, f.end) + '\n'
    );
  }
  const idx = ["'use strict';", ''];
  for (const stem of indexStems) {
    idx.push(`require('./${name}/${stem}');`);
  }
  fs.writeFileSync(path.join(CMD, name + '.js'), idx.join('\n') + '\n');
  console.log('✓', name + '/');
}

// status
splitSimple(
  'status',
  ['media', 'toggles'],
  `'use strict';

const { registerCommand } = require('../../lib/commands');
const { WA_CONF } = require('../../database/wa_conf');
const config = require('../../set');

module.exports = { registerCommand, WA_CONF, config };
`,
  [
    { out: 'media.js', start: 8, end: 122, header: header('registerCommand') },
    { out: 'toggles.js', start: 123, end: 255, header: header('registerCommand, WA_CONF, config') },
  ]
);

// systeme
splitSimple(
  'systeme',
  ['env-vars', 'git-update'],
  `'use strict';

const { registerCommand } = require('../../lib/commands');
const config = require('../../set');
const { updateEnvFile } = require('../../lib/manage_env');
const fs = require('fs');
const path = require('path');
const simpleGit = require('simple-git');
const git = simpleGit();
const ENV_FILE = path.join(process.cwd(), '.env');
const CONFIG_ENV_FILE = path.join(process.cwd(), 'config_env.json');
const { formatConfigValue } = require('../../lib/config-display');

function formatDateGMTFr(dateInput) {
  const date = new Date(dateInput);
  return (
    date.toLocaleString('fr-FR', {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) + ' GMT'
  );
}

module.exports = {
  registerCommand,
  config,
  updateEnvFile,
  fs,
  path,
  git,
  ENV_FILE,
  CONFIG_ENV_FILE,
  formatConfigValue,
  formatDateGMTFr,
};
`,
  [
    {
      out: 'env-vars.js',
      start: 20,
      end: 120,
      header: header(
        'registerCommand, config, updateEnvFile, fs, path, ENV_FILE, CONFIG_ENV_FILE, formatConfigValue'
      ),
    },
    {
      out: 'git-update.js',
      start: 135,
      end: 223,
      header: header('registerCommand, config, git, formatDateGMTFr'),
    },
  ]
);

// ia
splitSimple(
  'ia',
  ['gpt', 'dalle', 'blackbox', 'copilot', 'gemini', 'llama', 'claude'],
  `'use strict';

const { registerCommand } = require('../../lib/commands');
const config = require('../../set');
const { getAiBases, aiNotConfiguredMessage } = require('../../lib/ai-api');
const axios = require('axios');

function requirePrompt(arg, repondre) {
  if (!arg.length) {
    repondre('Veuillez entrer un prompt.');
    return null;
  }
  return arg.join(' ');
}

module.exports = {
  registerCommand,
  config,
  getAiBases,
  aiNotConfiguredMessage,
  axios,
  requirePrompt,
};
`,
  [
    { out: 'gpt.js', start: 16, end: 39, header: header('registerCommand, config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt') },
    { out: 'dalle.js', start: 41, end: 69, header: header('registerCommand, config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt') },
    { out: 'blackbox.js', start: 71, end: 94, header: header('registerCommand, config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt') },
    { out: 'copilot.js', start: 96, end: 119, header: header('registerCommand, config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt') },
    { out: 'gemini.js', start: 121, end: 144, header: header('registerCommand, config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt') },
    { out: 'llama.js', start: 146, end: 171, header: header('registerCommand, config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt') },
    { out: 'claude.js', start: 173, end: 196, header: header('registerCommand, config, getAiBases, aiNotConfiguredMessage, axios, requirePrompt') },
  ]
);

// logo
const logoSrc = path.join(CMD, 'logo.js');
if (fs.existsSync(logoSrc)) {
  const logoDir = path.join(CMD, 'logo');
  fs.mkdirSync(logoDir, { recursive: true });
  fs.writeFileSync(
    path.join(logoDir, '_shared.js'),
    `'use strict';

const { registerCommand } = require('../../lib/commands');
const textmaker = require('../../lib/textmaker');

${sliceFile(logoSrc, 5, 68)}

module.exports = { registerCommand, textmaker, addTextproCommand };
`
  );
  fs.writeFileSync(
    path.join(logoDir, 'effects.js'),
    `'use strict';

const { addTextproCommand } = require('./_shared');

${sliceFile(logoSrc, 69, 118)}
`
  );
  fs.writeFileSync(
    path.join(CMD, 'logo.js'),
    "'use strict';\n\nrequire('./logo/_shared');\nrequire('./logo/effects');\n"
  );
  console.log('✓ logo/');
}

// reaction
const reactionSrc = path.join(CMD, 'reaction.js');
if (fs.existsSync(reactionSrc)) {
  const reactionDir = path.join(CMD, 'reaction');
  fs.mkdirSync(reactionDir, { recursive: true });
  fs.writeFileSync(
    path.join(reactionDir, '_shared.js'),
    `'use strict';

const { registerCommand } = require('../../lib/commands');
const axios = require('axios');
const fs = require('fs');
const { runFfmpeg } = require('../../lib/ffmpeg');

${sliceFile(reactionSrc, 9, 168)}

module.exports = {
  registerCommand,
  axios,
  fs,
  runFfmpeg,
  reactions,
  generateCaption,
  giftovidbuff,
  addReactionCommand,
};
`
  );
  fs.writeFileSync(
    path.join(reactionDir, 'register.js'),
    `'use strict';

const { reactions, addReactionCommand } = require('./_shared');

${sliceFile(reactionSrc, 210, 212)}
`
  );
  fs.writeFileSync(
    path.join(CMD, 'reaction.js'),
    "'use strict';\n\nrequire('./reaction/_shared');\nrequire('./reaction/register');\n"
  );
  console.log('✓ reaction/');
}

// image_edits
const ieSrc = path.join(CMD, 'image_edits.js');
if (fs.existsSync(ieSrc)) {
  const ieDir = path.join(CMD, 'image_edits');
  fs.mkdirSync(ieDir, { recursive: true });
  fs.writeFileSync(
    path.join(ieDir, '_shared.js'),
    `'use strict';

const { registerCommand } = require('../../lib/commands');
const config = require('../../set');
const { getServiceUrls, serviceNotConfiguredMessage } = require('../../lib/service-urls');
const axios = require('axios');
const FormData = require('form-data');

${sliceFile(ieSrc, 12, 78)}

module.exports = {
  registerCommand,
  config,
  getServiceUrls,
  serviceNotConfiguredMessage,
  axios,
  FormData,
  genererCommandeCanvacord,
};
`
  );
  fs.writeFileSync(
    path.join(ieDir, 'canvacord.js'),
    `'use strict';

const { genererCommandeCanvacord } = require('./_shared');

const effetsCanvacord = ${JSON.stringify(
      [
        'shit', 'wasted', 'wanted', 'trigger', 'trash', 'rip', 'sepia', 'rainbow',
        'hitler', 'invert1', 'jail', 'affect', 'beautiful', 'blur', 'circle1',
        'facepalm', 'greyscale', 'jokeoverhead', 'delete_image', 'darkness',
        'colorfy', 'threshold', 'pixelate',
      ],
      null,
      2
    )};

effetsCanvacord.forEach((effect) => genererCommandeCanvacord(effect));
`
  );
  fs.writeFileSync(
    path.join(CMD, 'image_edits.js'),
    "'use strict';\n\nrequire('./image_edits/_shared');\nrequire('./image_edits/canvacord');\n"
  );
  console.log('✓ image_edits/');
}

// fx_audio
const fxSrc = path.join(CMD, 'fx_audio.js');
if (fs.existsSync(fxSrc)) {
  const fxDir = path.join(CMD, 'fx_audio');
  fs.mkdirSync(fxDir, { recursive: true });
  fs.writeFileSync(
    path.join(fxDir, '_shared.js'),
    `'use strict';

const fs = require('fs');
const { registerCommand } = require('../../lib/commands');
const { runFfmpeg } = require('../../lib/ffmpeg');

${sliceFile(fxSrc, 8, 45)}

module.exports = { registerCommand, fs, runFfmpeg, addAudioEffectCommand };
`
  );
  fs.writeFileSync(
    path.join(fxDir, 'effects.js'),
    `'use strict';

const { addAudioEffectCommand } = require('./_shared');

${sliceFile(fxSrc, 46, 86)}
`
  );
  fs.writeFileSync(
    path.join(CMD, 'fx_audio.js'),
    "'use strict';\n\nrequire('./fx_audio/_shared');\nrequire('./fx_audio/effects');\n"
  );
  console.log('✓ fx_audio/');
}

// groupe/moderation
const modSrc = path.join(CMD, 'groupe/moderation.js');
if (fs.existsSync(modSrc) && !fs.readFileSync(modSrc, 'utf8').includes('moderation/kick')) {
  const modDir = path.join(CMD, 'groupe/moderation');
  fs.mkdirSync(modDir, { recursive: true });
  const modShared = `'use strict';

${sliceFile(modSrc, 1, 18)}

module.exports = {
  registerCommand,
  GroupSettings,
  setWarn,
  delWarn,
  getLimit,
  setLimit,
  canModerateTarget,
  groupReply,
  resolveModerationTarget,
  getAdminJids,
  filterKickableMembers,
  moderationDeniedText,
  requireGroup,
  requireGroupAdmin,
  requireBotAdmin,
  prepareKickall,
  canRunKickall,
};
`;
  fs.writeFileSync(path.join(modDir, '_shared.js'), modShared);
  const modFiles = [
    { out: 'kick.js', start: 20, end: 65 },
    { out: 'kickall.js', start: 66, end: 126 },
    { out: 'kickall2.js', start: 127, end: 161 },
    { out: 'ckick.js', start: 162, end: 214 },
    { out: 'roles.js', start: 215, end: 304 },
    { out: 'warn.js', start: 305, end: 417 },
  ];
  const h = header(
    'registerCommand, groupReply, resolveModerationTarget, getAdminJids, filterKickableMembers, moderationDeniedText, requireGroup, requireGroupAdmin, requireBotAdmin, prepareKickall, canRunKickall, setWarn, delWarn, getLimit, setLimit, canModerateTarget'
  );
  for (const f of modFiles) {
    fs.writeFileSync(path.join(modDir, f.out), "'use strict';\n\n" + h + sliceFile(modSrc, f.start, f.end) + '\n');
  }
  fs.writeFileSync(
    path.join(CMD, 'groupe/moderation.js'),
    "'use strict';\n\nrequire('./moderation/kick');\nrequire('./moderation/kickall');\nrequire('./moderation/kickall2');\nrequire('./moderation/ckick');\nrequire('./moderation/roles');\nrequire('./moderation/warn');\n"
  );
  console.log('✓ groupe/moderation/');
}

// groupe/settings
const setSrc = path.join(CMD, 'groupe/settings.js');
if (fs.existsSync(setSrc) && setSrc.includes('registerCommand({')) {
  const setDir = path.join(CMD, 'groupe/settings');
  fs.mkdirSync(setDir, { recursive: true });
  fs.writeFileSync(
    path.join(setDir, '_shared.js'),
    `'use strict';

const { registerCommand } = require('../../lib/commands');

module.exports = { registerCommand };
`
  );
  const setFiles = [
    { out: 'create.js', start: 5, end: 89 },
    { out: 'meta.js', start: 90, end: 165 },
    { out: 'access.js', start: 166, end: 264 },
    { out: 'invite.js', start: 265, end: 343 },
    { out: 'ginfo.js', start: 344, end: 356 },
  ];
  const sh = header('registerCommand');
  for (const f of setFiles) {
    fs.writeFileSync(path.join(setDir, f.out), "'use strict';\n\n" + sh + sliceFile(setSrc, f.start, f.end) + '\n');
  }
  fs.writeFileSync(
    path.join(CMD, 'groupe/settings.js'),
    "'use strict';\n\nrequire('./settings/create');\nrequire('./settings/meta');\nrequire('./settings/access');\nrequire('./settings/invite');\nrequire('./settings/ginfo');\n"
  );
  console.log('✓ groupe/settings/');
}

console.log('Done.');
