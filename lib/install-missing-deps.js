'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MAX_AUTO_INSTALL = 8;
const LINKED_SPEC_RE = /^(file:|git\+|git:|link:|workspace:|http:|https:)/i;

function isLinkedSpec(version) {
  return typeof version === 'string' && LINKED_SPEC_RE.test(version.trim());
}

/** Runtime dependencies from package.json that cannot be require.resolve'd. */
function listMissingRuntimeDeps(pkg) {
  const manifest = pkg || require(path.join(ROOT, 'package.json'));
  const missing = [];

  for (const [name, version] of Object.entries(manifest.dependencies || {})) {
    try {
      require.resolve(name, { paths: [ROOT] });
    } catch {
      missing.push({ name, version: String(version || '') });
    }
  }

  return missing;
}

function toNpmPackageArgs(entries) {
  return entries.map(({ name, version }) => {
    if (isLinkedSpec(version)) {
      return name;
    }
    const spec = version.trim();
    return spec ? name + '@' + spec : name;
  });
}

function shouldAutoInstall() {
  if (process.env.AUTO_INSTALL_MISSING_DEPS === 'false') {
    return false;
  }
  if (process.env.AUTO_INSTALL_MISSING_DEPS === 'true') {
    return true;
  }
  return process.env.NODE_ENV !== 'production';
}

/**
 * Install missing runtime deps (self-host dev only by default).
 * Uses spawn argv (no shell), --no-save, batch limit, dependencies only.
 */
async function installMissingDependencies(options = {}) {
  const maxInstall = options.maxInstall ?? MAX_AUTO_INSTALL;
  const missing = listMissingRuntimeDeps(options.packageJson);

  if (!missing.length) {
    return { installed: [], skipped: [], warned: false, failed: false };
  }

  const names = missing.map((entry) => entry.name);

  if (!shouldAutoInstall()) {
    console.warn(
      '⚠️ Dépendances runtime manquantes (installation auto désactivée) : ' +
        names.join(', ') +
        '\n   → exécutez : npm ci'
    );
    return { installed: [], skipped: names, warned: true, failed: false };
  }

  const batch = missing.slice(0, maxInstall);
  const deferred = missing.slice(maxInstall);
  const npmPackages = toNpmPackageArgs(batch);

  console.log(
    '⚙️ Installation des dépendances manquantes (' +
      batch.length +
      ') : ' +
      npmPackages.join(', ')
  );

  if (deferred.length) {
    console.warn(
      '⚠️ ' +
        deferred.length +
        ' paquet(s) non installés (limite ' +
        maxInstall +
        ') : ' +
        deferred.map((entry) => entry.name).join(', ') +
        '\n   → exécutez : npm ci'
    );
  }

  const result = spawnSync(
    'npm',
    ['install', '--no-save', '--prefer-offline', ...npmPackages],
    { cwd: ROOT, stdio: 'inherit', env: process.env }
  );

  if (result.status !== 0) {
    console.error(
      '❌ Erreur installation npm (code ' +
        result.status +
        '). Lancez : npm ci'
    );
    return {
      installed: [],
      skipped: names,
      warned: true,
      failed: true,
    };
  }

  console.log('✅ Dépendances installées.');
  return {
    installed: batch.map((entry) => entry.name),
    skipped: deferred.map((entry) => entry.name),
    warned: deferred.length > 0,
    failed: false,
  };
}

module.exports = {
  ROOT,
  MAX_AUTO_INSTALL,
  isLinkedSpec,
  listMissingRuntimeDeps,
  shouldAutoInstall,
  toNpmPackageArgs,
  installMissingDependencies,
};
