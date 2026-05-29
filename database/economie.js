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
async function ajouterUtilisateur(userId, pseudo = "Utilisateur") {
  return await ECONOMIE.findOrCreate({
    where: {
      id: userId
    },
    defaults: {
      pseudo: pseudo,
      portefeuille: 0,
      banque: 0,
      capacite_banque: 1000,
      last_bonus: 0
    }
  });
}
async function supprimerUtilisateur(userId) {
  return await ECONOMIE.destroy({
    where: {
      id: userId
    }
  });
}
async function getInfosUtilisateur(userId) {
  const user = await ECONOMIE.findOne({
    where: {
      id: userId
    }
  });
  if (!user) {
    return null;
  }
  return user.dataValues;
}
async function modifierSolde(userId, balanceType = "portefeuille", amount = 0) {
  const user = await ECONOMIE.findOne({
    where: {
      id: userId
    }
  });
  if (!user) {
    return null;
  }
  if (!["portefeuille", "banque"].includes(balanceType)) {
    throw new Error("Type de solde invalide. Utilise 'portefeuille' ou 'banque'.");
  }
  const currentBalance = Number(user[balanceType]);
  const delta = Math.abs(Number(amount));
  const newBalance = amount < 0 ? Math.max(currentBalance - delta, 0) : currentBalance + delta;
  user[balanceType] = newBalance;
  await user.save();
  return {
    nouveauSolde: newBalance
  };
}
async function mettreAJourCapaciteBanque(userId, capacity) {
  const user = await ECONOMIE.findOne({
    where: {
      id: userId
    }
  });
  if (!user) {
    return null;
  }
  user.capacite_banque = capacity;
  await user.save();
  return user.capacite_banque;
}
async function changerPseudo(userId, pseudo) {
  const user = await ECONOMIE.findOne({
    where: {
      id: userId
    }
  });
  if (!user) {
    return null;
  }
  user.pseudo = pseudo;
  await user.save();
  return user.pseudo;
}
async function resetEconomie(userId, options = {
  wallet: false,
  banque: false,
  capacite: false
}) {
  const user = await ECONOMIE.findOne({
    where: {
      id: userId
    }
  });
  if (!user) {
    return null;
  }
  if (options.wallet) {
    user.portefeuille = 0;
  }
  if (options.banque) {
    user.banque = 0;
  }
  if (options.capacite) {
    user.capacite_banque = 10000;
  }
  await user.save();
  return user.dataValues;
}
async function TopBanque() {
  try {
    const topUsers = await ECONOMIE.findAll({
      order: [["banque", "DESC"]],
      limit: 10,
      attributes: ["id", "portefeuille", "banque", "capacite"]
    });
    return topUsers.map(row => ({
      id: row.id,
      portefeuille: row.portefeuille,
      banque: row.banque,
      capacite: row.capacite
    }));
  } catch (err) {
    console.error("Erreur lors de la récupération du top banque :", err);
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
