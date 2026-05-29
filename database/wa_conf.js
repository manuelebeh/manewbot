const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const WA_CONF = sequelize.define("WA_CONF", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  presence: {
    type: DataTypes.STRING,
    defaultValue: "rien"
  },
  lecture_status: {
    type: DataTypes.STRING,
    defaultValue: "non"
  },
  like_status: {
    type: DataTypes.STRING,
    defaultValue: "non"
  },
  dl_status: {
    type: DataTypes.STRING,
    defaultValue: "non"
  },
  antivv: {
    type: DataTypes.STRING,
    defaultValue: "non"
  },
  antidelete: {
    type: DataTypes.STRING,
    defaultValue: "non"
  },
  mention: {
    type: DataTypes.STRING,
    defaultValue: "1"
  }
}, {
  tableName: "wa_conf",
  timestamps: false
});
const WA_CONF2 = sequelize.define("WA_CONF2", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  autoreact_msg: {
    type: DataTypes.STRING,
    defaultValue: "non"
  },
  anticall: {
    type: DataTypes.STRING,
    defaultValue: "non"
  },
  autoread_msg: {
    type: DataTypes.STRING,
    defaultValue: "non"
  }
}, {
  tableName: "wa_conf2",
  timestamps: false
});
module.exports = {
  WA_CONF: WA_CONF,
  WA_CONF2: WA_CONF2
};
