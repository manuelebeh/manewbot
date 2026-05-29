const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const Antispam = sequelize.define("Antispam", {
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
  tableName: "antispam",
  timestamps: false
});
const AntispamWarnings = sequelize.define("AntispamWarnings", {
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
  tableName: "antispam_warnings",
  timestamps: false
});
module.exports = {
  Antispam: Antispam,
  AntispamWarnings: AntispamWarnings
};