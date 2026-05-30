const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Setting = sequelize.define('Setting', {
  set_key: { type: DataTypes.STRING(50), primaryKey: true },
  set_value: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'settings',
  timestamps: false
});

module.exports = Setting;