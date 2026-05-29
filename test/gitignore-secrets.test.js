'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const GITIGNORE = path.join(ROOT, '.gitignore');

function git(cmd) {
  return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8' }).trim();
}

describe('gitignore secrets', () => {
  it('.gitignore lists .env, auth/, and config_env.json', () => {
    const rules = fs.readFileSync(GITIGNORE, 'utf8');
    assert.match(rules, /^\.env$/m);
    assert.match(rules, /^auth\/$/m);
    assert.match(rules, /^config_env\.json$/m);
    assert.match(rules, /^backups\/$/m);
  });

  it('git check-ignore matches sensitive paths', () => {
    const ignored = git('check-ignore -v .env auth/principale/creds.json config_env.json backups/foo.tar.gz.gpg');
    assert.match(ignored, /\.env/);
    assert.match(ignored, /auth\//);
    assert.match(ignored, /config_env\.json/);
    assert.match(ignored, /backups\//);
  });

  it('no sensitive paths are tracked by git', () => {
    const tracked = git('ls-files');
    const lines = tracked ? tracked.split('\n') : [];
    const sensitive = lines.filter(
      (f) =>
        f === '.env' ||
        f.startsWith('auth/') ||
        f === 'config_env.json' ||
        f.startsWith('backups/')
    );
    assert.deepEqual(sensitive, [], `fichiers sensibles trackés : ${sensitive.join(', ')}`);
  });
});
