const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const Antimention = sequelize.define("Antimention", {
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
  tableName: "antimention",
  timestamps: false
});
const Antimention_warnings = sequelize.define("Antimention_warnings", {
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
  tableName: "antimention_warnings",
  timestamps: false
});
module.exports = {
  Antimention: Antimention,
  Antimention_warnings: Antimention_warnings
};