const db = require('../config/database');

class ModelRepository {
  mapRow(row) {
    if (!row) return null;
    return {
      id: row.am_id,
      name: row.am_name,
      provider: row.am_provider,
      api_model_code: row.am_api_model_code,
      is_active: row.am_is_active,
      created_at: row.am_created_at
    };
  }

  async findAll() {
    const result = await db.query('SELECT * FROM ai_models ORDER BY am_id ASC');
    return result.rows.map(this.mapRow);
  }

  async findActive() {
    const result = await db.query('SELECT * FROM ai_models WHERE am_is_active = true ORDER BY am_id ASC');
    return result.rows.map(this.mapRow);
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM ai_models WHERE am_id = $1', [id]);
    return this.mapRow(result.rows[0]);
  }

  async create({ name, provider, api_model_code, is_active }) {
    const result = await db.query(
      'INSERT INTO ai_models (am_name, am_provider, am_api_model_code, am_is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, provider, api_model_code, is_active !== false]
    );
    return this.mapRow(result.rows[0]);
  }

  async update(id, { name, provider, api_model_code, is_active }) {
    const result = await db.query(
      'UPDATE ai_models SET am_name = $1, am_provider = $2, am_api_model_code = $3, am_is_active = $4 WHERE am_id = $5 RETURNING *',
      [name, provider, api_model_code, is_active, id]
    );
    return this.mapRow(result.rows[0]);
  }

  async delete(id) {
    const result = await db.query('DELETE FROM ai_models WHERE am_id = $1 RETURNING am_id', [id]);
    return { id: result.rows[0]?.am_id };
  }
}

module.exports = new ModelRepository();
