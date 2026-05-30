const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AiModel = sequelize.define('AiModel', {
  am_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  am_name: { type: DataTypes.STRING(100), allowNull: false },
  am_provider: { type: DataTypes.STRING(50), allowNull: false },
  am_api_model_code: { type: DataTypes.STRING(100), allowNull: false },
  am_is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'ai_models',
  timestamps: true,
  createdAt: 'am_created_at',
  updatedAt: false
});

module.exports = AiModel;