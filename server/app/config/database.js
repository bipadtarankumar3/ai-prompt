const { Sequelize } = require('sequelize');
const config = require('./env');

const sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: 'postgres',
  logging: false, // Disable logging of every SQL query
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Backward compatibility wrapper for existing db.query calls during migration
const query = async (text, params) => {
  // Convert pg-style $1, $2 to Sequelize bind parameters ($1 -> $1, etc.)
  // Actually, Sequelize raw queries support bind: [val1, val2] if we use $1, $2 inside the query string.
  const [results] = await sequelize.query(text, { bind: params || [] });
  // Mock the pg response format: { rows: [...] }
  return { rows: results || [], rowCount: results?.length || 0 };
};

module.exports = {
  sequelize,
  query
};
