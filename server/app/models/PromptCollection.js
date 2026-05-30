const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PromptCollection = sequelize.define('PromptCollection', {
  pc_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pc_slug: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  pc_title: { type: DataTypes.STRING(255), allowNull: false },
  pc_prompt_text: { type: DataTypes.TEXT, allowNull: false },
  pc_category: { type: DataTypes.STRING(100), allowNull: false },
  pc_description: { type: DataTypes.TEXT },
  pc_example_inputs: { type: DataTypes.TEXT },
  pc_example_outputs: { type: DataTypes.TEXT },
  pc_use_cases: { type: DataTypes.JSONB, defaultValue: [] },
  pc_faqs: { type: DataTypes.JSONB, defaultValue: [] },
  pc_tags: { type: DataTypes.JSONB, defaultValue: [] },
  pc_variations: { type: DataTypes.JSONB, defaultValue: [] },
  pc_copy_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  pc_view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  pc_is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  pc_is_premium: { type: DataTypes.BOOLEAN, defaultValue: false },
  pc_type: { type: DataTypes.STRING(20), defaultValue: 'prompt' },
  pc_ai_model_target: { type: DataTypes.STRING(50) },
  pc_difficulty: { type: DataTypes.STRING(20), defaultValue: 'beginner' },
  pc_meta_title: { type: DataTypes.STRING(70) },
  pc_meta_description: { type: DataTypes.STRING(165) },
  pc_created_at: { type: DataTypes.DATE, allowNull: true },
  pc_updated_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'prompt_collections',
  timestamps: true,
  createdAt: 'pc_created_at',
  updatedAt: 'pc_updated_at'
});

module.exports = PromptCollection;