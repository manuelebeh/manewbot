'use strict';

const { spawn } = require('child_process');

/** Découpe une chaîne d'arguments ffmpeg (guillemets simples/doubles). */
function tokenizeFfmpegArgs(argString) {
  const tokens = argString.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  return tokens.map((t) => t.replace(/^["']|["']$/g, ''));
}

/**
 * Lance ffmpeg avec chemins contrôlés et filtres prédéfinis (pas d'entrée utilisateur).
 * @returns {Promise<void>}
 */
function runFfmpeg(inputPath, ffmpegArgString, outputPath) {
  const args = ['-y', '-i', inputPath, ...tokenizeFfmpegArgs(ffmpegArgString), outputPath];
  return new Promise((resolve, reject) => {
    const proc = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    proc.stderr.on('data', (chunk) => {
      stderr += chunk;
    });
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.trim() || `ffmpeg exit ${code}`));
    });
  });
}

module.exports = { runFfmpeg, tokenizeFfmpegArgs };
