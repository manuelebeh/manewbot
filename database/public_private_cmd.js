const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
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
async function set_cmd(cmdName, cmdType = "public") {
  if (!cmdName || !cmdType) {
    throw new Error("Données manquantes");
  }
  await BotCmd.upsert({
    nom_cmd: cmdName,
    type: cmdType
  });
}
async function del_cmd(cmdName, cmdType) {
  return await BotCmd.destroy({
    where: {
      nom_cmd: cmdName,
      type: cmdType
    }
  });
}
async function list_cmd(cmdType) {
  return await BotCmd.findAll({
    where: {
      type: cmdType
    }
  });
}
async function get_cmd(cmdName, cmdType) {
  return await BotCmd.findOne({
    where: {
      nom_cmd: cmdName,
      type: cmdType
    }
  });
}
module.exports = {
  BotCmd,
  set_cmd: set_cmd,
  del_cmd: del_cmd,
  list_cmd: list_cmd,
  get_cmd: get_cmd
};
