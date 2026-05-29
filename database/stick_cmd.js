const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
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
async function set_stick_cmd(cmdName, stickHash) {
  if (!cmdName || !stickHash) {
    throw new Error("Commande ou URL manquante");
  }
  await StickCmds.upsert({
    no_cmd: cmdName,
    stick_hash: stickHash
  });
  return true;
}
async function del_stick_cmd(cmdName) {
  if (!cmdName) {
    throw new Error("Commande manquante");
  }
  const deletedCount = await StickCmds.destroy({
    where: {
      no_cmd: cmdName
    }
  });
  return deletedCount > 0;
}
async function get_stick_cmd() {
  const rows = await StickCmds.findAll();
  return rows.map(({
    no_cmd,
    stick_hash
  }) => ({
    no_cmd: no_cmd,
    stick_hash: stick_hash
  }));
}
module.exports = {
  StickCmds,
  set_stick_cmd: set_stick_cmd,
  del_stick_cmd: del_stick_cmd,
  get_stick_cmd: get_stick_cmd
};
