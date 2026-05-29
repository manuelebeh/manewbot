const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const Bans = sequelize.define("Bans", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM("user", "group"),
    allowNull: false
  }
}, {
  tableName: "bans",
  timestamps: false
});
const OnlyAdmins = sequelize.define("OnlyAdmins", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  }
}, {
  tableName: "onlyadmins",
  timestamps: false
});
module.exports = {
  Bans: Bans,
  OnlyAdmins: OnlyAdmins
};