const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const Sudo = sequelize.define("Sudo", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  }
}, {
  tableName: "sudo",
  timestamps: false
});
module.exports = {
  Sudo: Sudo
};