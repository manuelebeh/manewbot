'use strict';

const { spawn } = require('child_process');

/** Découpe une chaîne d'arguments ffmpeg (guillemets simples/doubles). */
function tokenizeFfmpegArgs(argString) {
  const tokens = argString.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  return tokens.map((t) => t.replace(/^["']|["']$/g, ''));
}

function runProcess(command, args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    proc.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error((stderr || stdout).trim() || `${command} exit ${code}`));
      }
    });
  });
}

/**
 * Lance ffmpeg avec chemins contrôlés et filtres prédéfinis (pas d'entrée utilisateur).
 * @returns {Promise<void>}
 */
function runFfmpeg(inputPath, ffmpegArgString, outputPath) {
  const args = ['-y', '-i', inputPath, ...tokenizeFfmpegArgs(ffmpegArgString), outputPath];
  return runProcess('ffmpeg', args).then(() => undefined);
}

/** Durée média en secondes via ffprobe (sans shell). */
async function probeMediaDuration(mediaPath) {
  const { stdout } = await runProcess('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=nk=1:nw=1',
    mediaPath,
  ]);
  const duration = parseFloat(String(stdout).trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error('Durée média invalide');
  }
  return duration;
}

module.exports = {
  runFfmpeg,
  tokenizeFfmpegArgs,
  probeMediaDuration,
};
