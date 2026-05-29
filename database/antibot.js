const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const Antibot = sequelize.define("Antibot", {
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
  tableName: "antibot",
  timestamps: false
});
const AntibotWarnings = sequelize.define("AntibotWarnings", {
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
  tableName: "antibot_warnings",
  timestamps: false
});
module.exports = {
  Antibot: Antibot,
  AntibotWarnings: AntibotWarnings
};