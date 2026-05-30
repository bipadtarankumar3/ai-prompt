const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SavedPrompt = sequelize.define('SavedPrompt', {
  sp_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sp_user_id: { type: DataTypes.BIGINT, allowNull: false },
  sp_prompt_id: { type: DataTypes.INTEGER, allowNull: false },
}, {
  tableName: 'saved_prompts',
  timestamps: true,
  createdAt: 'sp_created_at',
  updatedAt: false,
  indexes: [{ unique: true, fields: ['sp_user_id', 'sp_prompt_id'] }]
});

module.exports = SavedPrompt;