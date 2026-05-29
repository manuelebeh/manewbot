'use strict';

const ON_VALUES = new Set(['oui', 'yes', 'true', '1', 'on']);
const OFF_VALUES = new Set(['non', 'no', 'false', '0', 'off']);

/** @returns {true|false|null} null = non défini dans l'env */
function parseEnvToggle(value) {
  if (value == null || String(value).trim() === '') return null;
  const normalized = String(value).trim().toLowerCase();
  if (ON_VALUES.has(normalized)) return true;
  if (OFF_VALUES.has(normalized)) return false;
  return null;
}

function formatFeatureState(enabled, envOverride) {
  const state = enabled ? 'activé' : 'désactivé';
  if (envOverride === true) return state + ' (forcé par .env)';
  if (envOverride === false) return state + ' (bloqué par .env)';
  return state + ' (base de données)';
}

/** Réaction emoji sur le message lors de l'exécution d'une commande (défaut : activé). */
function resolveCommandReactEnabled(envConfig) {
  const fromEnv = parseEnvToggle(envConfig.COMMAND_REACT);
  if (fromEnv !== null) return fromEnv;
  const fromLegacy = parseEnvToggle(process.env.AUTOREACT_MSG);
  if (fromLegacy !== null) return fromLegacy;
  return true;
}

function getCommandReactEnvOverride(envConfig) {
  return parseEnvToggle(envConfig.COMMAND_REACT);
}

module.exports = {
  parseEnvToggle,
  formatFeatureState,
  resolveCommandReactEnabled,
  getCommandReactEnvOverride,
};
