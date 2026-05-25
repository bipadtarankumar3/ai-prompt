const db = require('../config/database');

class SettingsRepository {
  async get(key) {
    const result = await db.query('SELECT set_value FROM settings WHERE set_key = $1', [key]);
    return result.rows[0]?.set_value || null;
  }

  async set(key, value) {
    const result = await db.query(
      'INSERT INTO settings (set_key, set_value) VALUES ($1, $2) ON CONFLICT (set_key) DO UPDATE SET set_value = EXCLUDED.set_value RETURNING *',
      [key, String(value)]
    );
    return result.rows[0];
  }

  async getAll() {
    const result = await db.query('SELECT set_key, set_value FROM settings');
    return result.rows.reduce((acc, row) => {
      acc[row.set_key] = row.set_value;
      return acc;
    }, {});
  }
}

module.exports = new SettingsRepository();
