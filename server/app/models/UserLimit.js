const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserLimit = sequelize.define('UserLimit', {
  ul_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ul_user_id: { type: DataTypes.BIGINT, unique: true, allowNull: false },
  ul_limit_count: { type: DataTypes.INTEGER, defaultValue: 20 },
  ul_used_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  ul_reset_at: { type: DataTypes.DATE, defaultValue: sequelize.literal("CURRENT_TIMESTAMP + INTERVAL '1 day'") },
}, {
  tableName: 'user_limits',
  timestamps: false
});

module.exports = UserLimit;