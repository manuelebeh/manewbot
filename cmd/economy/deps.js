'use strict';

const crypto = require('crypto');
const config = require('../../set');
const {
  modifierSolde,
  getInfosUtilisateur,
  resetEconomie,
  mettreAJourCapaciteBanque,
  ECONOMIE,
  TopBanque,
} = require('../../database/economie');

function generateUserId(jid) {
  const hash = crypto.createHash('md5').update(jid).digest('hex');
  return 'User-' + hash.slice(0, 6);
}

function generateTransactionId() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

const prixCapacite = {
  1: { montant: 10000, capacite: 100000 },
  2: { montant: 100000, capacite: 1000000 },
  3: { montant: 1000000, capacite: 10000000 },
  4: { montant: 10000000, capacite: 100000000 },
  5: { montant: 100000000, capacite: 1000000000 },
};

module.exports = {
  config,
  modifierSolde,
  getInfosUtilisateur,
  resetEconomie,
  mettreAJourCapaciteBanque,
  ECONOMIE,
  TopBanque,
  generateUserId,
  generateTransactionId,
  prixCapacite,
};
