const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const Plugin = sequelize.define("Plugin", {
  name: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "plugin",
  timestamps: false
});
module.exports = {
  Plugin: Plugin
};