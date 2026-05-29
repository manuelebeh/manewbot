const {
  DataTypes
} = require("sequelize");
const sequelize = require("./sequelize");
const ChatbotConf = sequelize.define("ChatbotConf", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true
  },
  chatbot_pm: {
    type: DataTypes.ENUM("oui", "non"),
    defaultValue: "non"
  },
  chatbot_gc: {
    type: DataTypes.ENUM("oui", "non"),
    defaultValue: "non"
  },
  enabled_ids: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "[]"
  }
}, {
  tableName: "chatbot_config",
  timestamps: false
});
module.exports = {
  ChatbotConf: ChatbotConf
};