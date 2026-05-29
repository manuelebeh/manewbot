'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SKIP = new Set(['node_modules', 'packages', '.git', 'downloads', 'sessions']);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (name.endsWith('.js')) out.push(full);
  }
  return out;
}

const files = walk(ROOT);
const failures = [];

for (const file of files) {
  const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (r.status !== 0) {
    failures.push(`${path.relative(ROOT, file)}: ${(r.stderr || r.stdout || '').trim()}`);
  }
}

if (failures.length) {
  console.error('Syntax check failed:\n' + failures.join('\n'));
  process.exit(1);
}

console.log(`OK ${files.length} files`);
