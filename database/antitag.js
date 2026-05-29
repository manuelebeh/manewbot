const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const Antitag = sequelize.define("Antitag", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  mode: {
    type: DataTypes.STRING,
    defaultValue: "non"
  },
  type: {
    type: DataTypes.ENUM("supp", "warn", "kick"),
    defaultValue: "supp"
  }
}, {
  tableName: "antitag",
  timestamps: false
});
const Antitag_warnings = sequelize.define("Antitag_warnings", {
  groupId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
}, {
  tableName: "antitag_warnings",
  timestamps: false
});
module.exports = {
  Antitag: Antitag,
  Antitag_warnings: Antitag_warnings
};