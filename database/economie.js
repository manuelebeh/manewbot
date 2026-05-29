const {
  Sequelize,
  DataTypes
} = require("sequelize");
const config = require("../set");
const db = config.DATABASE;
let sequelize;
if (!db) {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.db",
    logging: false
  });
} else {
  sequelize = new Sequelize(db, {
    dialect: "postgres",
    ssl: true,
    protocol: "postgres",
    dialectOptions: {
      native: true,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  });
}
const ECONOMIE = sequelize.define("ECONOMIE", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  pseudo: {
    type: DataTypes.STRING,
    defaultValue: "Utilisateur"
  },
  portefeuille: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  banque: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  capacite_banque: {
    type: DataTypes.BIGINT,
    defaultValue: 10000
  },
  last_bonus: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  }
}, {
  tableName: "economie",
  timestamps: false
});
(async () => {
  await ECONOMIE.sync();
})();
async function ajouterUtilisateur(_0x442cba, _0x13302d = "Utilisateur") {
  return await ECONOMIE.findOrCreate({
    where: {
      id: _0x442cba
    },
    defaults: {
      pseudo: _0x13302d,
      portefeuille: 0,
      banque: 0,
      capacite_banque: 1000,
      last_bonus: 0
    }
  });
}
async function supprimerUtilisateur(_0x71cb1c) {
  return await ECONOMIE.destroy({
    where: {
      id: _0x71cb1c
    }
  });
}
async function getInfosUtilisateur(_0x46cb77) {
  const _0x3b6e06 = await ECONOMIE.findOne({
    where: {
      id: _0x46cb77
    }
  });
  if (!_0x3b6e06) {
    return null;
  }
  return _0x3b6e06.dataValues;
}
async function modifierSolde(_0x23e799, _0x22587a = "portefeuille", _0x3fed61 = 0) {
  const _0x11ef06 = await ECONOMIE.findOne({
    where: {
      id: _0x23e799
    }
  });
  if (!_0x11ef06) {
    return null;
  }
  if (!["portefeuille", "banque"].includes(_0x22587a)) {
    throw new Error("Type de solde invalide. Utilise 'portefeuille' ou 'banque'.");
  }
  const _0x3744e8 = Number(_0x11ef06[_0x22587a]);
  const _0x33f246 = Math.abs(Number(_0x3fed61));
  const _0x223589 = _0x3fed61 < 0 ? Math.max(_0x3744e8 - _0x33f246, 0) : _0x3744e8 + _0x33f246;
  _0x11ef06[_0x22587a] = _0x223589;
  await _0x11ef06.save();
  return {
    nouveauSolde: _0x223589
  };
}
async function mettreAJourCapaciteBanque(_0x359b76, _0x453960) {
  const _0x57c8b5 = await ECONOMIE.findOne({
    where: {
      id: _0x359b76
    }
  });
  if (!_0x57c8b5) {
    return null;
  }
  _0x57c8b5.capacite_banque = _0x453960;
  await _0x57c8b5.save();
  return _0x57c8b5.capacite_banque;
}
async function changerPseudo(_0x3532be, _0x442634) {
  const _0x226590 = await ECONOMIE.findOne({
    where: {
      id: _0x3532be
    }
  });
  if (!_0x226590) {
    return null;
  }
  _0x226590.pseudo = _0x442634;
  await _0x226590.save();
  return _0x226590.pseudo;
}
async function resetEconomie(_0x22a7c3, _0x1eb511 = {
  wallet: false,
  banque: false,
  capacite: false
}) {
  const _0x1d08dd = await ECONOMIE.findOne({
    where: {
      id: _0x22a7c3
    }
  });
  if (!_0x1d08dd) {
    return null;
  }
  if (_0x1eb511.wallet) {
    _0x1d08dd.portefeuille = 0;
  }
  if (_0x1eb511.banque) {
    _0x1d08dd.banque = 0;
  }
  if (_0x1eb511.capacite) {
    _0x1d08dd.capacite_banque = 10000;
  }
  await _0x1d08dd.save();
  return _0x1d08dd.dataValues;
}
async function TopBanque() {
  try {
    const _0x451d01 = await ECONOMIE.findAll({
      order: [["banque", "DESC"]],
      limit: 10,
      attributes: ["id", "portefeuille", "banque", "capacite"]
    });
    return _0x451d01.map(_0x5a5be4 => ({
      id: _0x5a5be4.id,
      portefeuille: _0x5a5be4.portefeuille,
      banque: _0x5a5be4.banque,
      capacite: _0x5a5be4.capacite
    }));
  } catch (_0x4b2a3a) {
    console.error("Erreur lors de la récupération du top banque :", _0x4b2a3a);
    return [];
  }
}
module.exports = {
  TopBanque: TopBanque,
  ECONOMIE: ECONOMIE,
  ajouterUtilisateur: ajouterUtilisateur,
  supprimerUtilisateur: supprimerUtilisateur,
  getInfosUtilisateur: getInfosUtilisateur,
  modifierSolde: modifierSolde,
  mettreAJourCapaciteBanque: mettreAJourCapaciteBanque,
  changerPseudo: changerPseudo,
  resetEconomie: resetEconomie
};