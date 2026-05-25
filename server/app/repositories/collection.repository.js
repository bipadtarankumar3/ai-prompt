const db = require('../config/database');

class CollectionRepository {
  mapRow(row) {
    if (!row) return null;
    return {
      id: row.pc_id,
      title: row.pc_title,
      prompt_text: row.pc_prompt_text,
      category: row.pc_category,
      created_at: row.pc_created_at
    };
  }

  async findAll() {
    const result = await db.query('SELECT * FROM prompt_collections ORDER BY pc_id DESC');
    return result.rows.map(this.mapRow);
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM prompt_collections WHERE pc_id = $1', [id]);
    return this.mapRow(result.rows[0]);
  }

  async create({ title, prompt_text, category }) {
    const result = await db.query(
      'INSERT INTO prompt_collections (pc_title, pc_prompt_text, pc_category) VALUES ($1, $2, $3) RETURNING *',
      [title, prompt_text, category]
    );
    return this.mapRow(result.rows[0]);
  }

  async update(id, { title, prompt_text, category }) {
    const result = await db.query(
      'UPDATE prompt_collections SET pc_title = $1, pc_prompt_text = $2, pc_category = $3 WHERE pc_id = $4 RETURNING *',
      [title, prompt_text, category, id]
    );
    return this.mapRow(result.rows[0]);
  }

  async delete(id) {
    const result = await db.query('DELETE FROM prompt_collections WHERE pc_id = $1 RETURNING pc_id', [id]);
    return { id: result.rows[0]?.pc_id };
  }
}

module.exports = new CollectionRepository();
