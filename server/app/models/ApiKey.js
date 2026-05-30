const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ApiKey = sequelize.define('ApiKey', {
  ak_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ak_user_id: { type: DataTypes.BIGINT, allowNull: false },
  ak_key: { type: DataTypes.STRING(255), unique: true, allowNull: false },
  ak_is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'api_keys',
  timestamps: true,
  createdAt: 'ak_created_at',
  updatedAt: false
});

module.exports = ApiKey;