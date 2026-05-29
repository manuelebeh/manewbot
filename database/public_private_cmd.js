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
const BotCmd = sequelize.define("BotCmd", {
  nom_cmd: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "public_private_cmds",
  timestamps: false
});
(async () => {
  await BotCmd.sync();
})();
async function set_cmd(_0x540231, _0xa51e94 = "public") {
  if (!_0x540231 || !_0xa51e94) {
    throw new Error("Données manquantes");
  }
  await BotCmd.upsert({
    nom_cmd: _0x540231,
    type: _0xa51e94
  });
}
async function del_cmd(_0x57ac19, _0x4ba1f5) {
  return await BotCmd.destroy({
    where: {
      nom_cmd: _0x57ac19,
      type: _0x4ba1f5
    }
  });
}
async function list_cmd(_0x1b28a5) {
  return await BotCmd.findAll({
    where: {
      type: _0x1b28a5
    }
  });
}
async function get_cmd(_0x1705cd, _0x1d8c3b) {
  return await BotCmd.findOne({
    where: {
      nom_cmd: _0x1705cd,
      type: _0x1d8c3b
    }
  });
}
module.exports = {
  set_cmd: set_cmd,
  del_cmd: del_cmd,
  list_cmd: list_cmd,
  get_cmd: get_cmd
};