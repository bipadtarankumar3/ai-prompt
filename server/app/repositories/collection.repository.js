const db = require('../config/database');

class CollectionRepository {
  mapRow(row) {
    if (!row) return null;
    return {
      id: row.pc_id,
      slug: row.pc_slug,
      title: row.pc_title,
      prompt_text: row.pc_prompt_text,
      category: row.pc_category,
      description: row.pc_description,
      example_inputs: row.pc_example_inputs,
      example_outputs: row.pc_example_outputs,
      use_cases: typeof row.pc_use_cases === 'string' ? JSON.parse(row.pc_use_cases) : (row.pc_use_cases || []),
      faqs: typeof row.pc_faqs === 'string' ? JSON.parse(row.pc_faqs) : (row.pc_faqs || []),
      copy_count: row.pc_copy_count,
      view_count: row.pc_view_count,
      is_featured: row.pc_is_featured,
      is_premium: row.pc_is_premium,
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

  async findBySlug(slug) {
    const result = await db.query('SELECT * FROM prompt_collections WHERE pc_slug = $1', [slug]);
    return this.mapRow(result.rows[0]);
  }

  async findTrending(limit = 6) {
    const result = await db.query(
      'SELECT * FROM prompt_collections ORDER BY pc_copy_count DESC, pc_view_count DESC LIMIT $1',
      [limit]
    );
    return result.rows.map(this.mapRow);
  }

  async findRelated(id, category, limit = 3) {
    const result = await db.query(
      'SELECT * FROM prompt_collections WHERE pc_category = $1 AND pc_id != $2 ORDER BY pc_copy_count DESC LIMIT $3',
      [category, id, limit]
    );
    return result.rows.map(this.mapRow);
  }

  async incrementCopy(id) {
    const result = await db.query(
      'UPDATE prompt_collections SET pc_copy_count = pc_copy_count + 1 WHERE pc_id = $1 RETURNING pc_copy_count',
      [id]
    );
    return result.rows[0]?.pc_copy_count;
  }

  async incrementView(id) {
    const result = await db.query(
      'UPDATE prompt_collections SET pc_view_count = pc_view_count + 1 WHERE pc_id = $1 RETURNING pc_view_count',
      [id]
    );
    return result.rows[0]?.pc_view_count;
  }

  async create(data) {
    const {
      slug, title, prompt_text, category, description,
      example_inputs, example_outputs, use_cases, faqs,
      is_featured, is_premium
    } = data;

    const result = await db.query(
      `INSERT INTO prompt_collections (
        pc_slug, pc_title, pc_prompt_text, pc_category, 
        pc_description, pc_example_inputs, pc_example_outputs, 
        pc_use_cases, pc_faqs, pc_is_featured, pc_is_premium
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        slug, title, prompt_text, category, description,
        example_inputs, example_outputs,
        JSON.stringify(use_cases || []), JSON.stringify(faqs || []),
        is_featured || false, is_premium || false
      ]
    );
    return this.mapRow(result.rows[0]);
  }

  async update(id, data) {
    const {
      slug, title, prompt_text, category, description,
      example_inputs, example_outputs, use_cases, faqs,
      is_featured, is_premium
    } = data;

    const result = await db.query(
      `UPDATE prompt_collections SET 
        pc_slug = $1, pc_title = $2, pc_prompt_text = $3, pc_category = $4, 
        pc_description = $5, pc_example_inputs = $6, pc_example_outputs = $7, 
        pc_use_cases = $8, pc_faqs = $9, pc_is_featured = $10, pc_is_premium = $11 
      WHERE pc_id = $12 RETURNING *`,
      [
        slug, title, prompt_text, category, description,
        example_inputs, example_outputs,
        JSON.stringify(use_cases || []), JSON.stringify(faqs || []),
        is_featured || false, is_premium || false,
        id
      ]
    );
    return this.mapRow(result.rows[0]);
  }

  async delete(id) {
    const result = await db.query('DELETE FROM prompt_collections WHERE pc_id = $1 RETURNING pc_id', [id]);
    return { id: result.rows[0]?.pc_id };
  }
}

module.exports = new CollectionRepository();
