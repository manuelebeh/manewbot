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
const StickCmds = sequelize.define("StickCmds", {
  no_cmd: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  stick_hash: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: "stickcmds",
  timestamps: false
});
(async () => {
  await StickCmds.sync();
})();
async function set_stick_cmd(_0x294c76, _0x178d92) {
  if (!_0x294c76 || !_0x178d92) {
    throw new Error("Commande ou URL manquante");
  }
  await StickCmds.upsert({
    no_cmd: _0x294c76,
    stick_hash: _0x178d92
  });
  return true;
}
async function del_stick_cmd(_0x2e32d4) {
  if (!_0x2e32d4) {
    throw new Error("Commande manquante");
  }
  const _0x2412b8 = await StickCmds.destroy({
    where: {
      no_cmd: _0x2e32d4
    }
  });
  return _0x2412b8 > 0;
}
async function get_stick_cmd() {
  const _0x50c1df = await StickCmds.findAll();
  return _0x50c1df.map(({
    no_cmd: _0x432a96,
    stick_hash: _0x5cc4fc
  }) => ({
    no_cmd: _0x432a96,
    stick_hash: _0x5cc4fc
  }));
}
module.exports = {
  set_stick_cmd: set_stick_cmd,
  del_stick_cmd: del_stick_cmd,
  get_stick_cmd: get_stick_cmd
};