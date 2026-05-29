const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const Ranks = sequelize.define("Ranks", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  exp: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  messages: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: "ranks",
  timestamps: false
});
const Levelup = sequelize.define("Levelup", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  levelup: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "non"
  }
}, {
  tableName: "levelup",
  timestamps: false
});
module.exports = {
  Ranks: Ranks,
  Levelup: Levelup
};