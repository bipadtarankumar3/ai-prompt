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
      tags: typeof row.pc_tags === 'string' ? JSON.parse(row.pc_tags) : (row.pc_tags || []),
      variations: typeof row.pc_variations === 'string' ? JSON.parse(row.pc_variations) : (row.pc_variations || []),
      copy_count: row.pc_copy_count,
      view_count: row.pc_view_count,
      is_featured: row.pc_is_featured,
      is_premium: row.pc_is_premium,
      type: row.pc_type || 'prompt',
      ai_model_target: row.pc_ai_model_target,
      difficulty: row.pc_difficulty || 'beginner',
      meta_title: row.pc_meta_title,
      meta_description: row.pc_meta_description,
      created_at: row.pc_created_at,
      updated_at: row.pc_updated_at || row.pc_created_at,
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

  /**
   * Find similar prompts by shared tags (JSONB overlap).
   * Falls back to category-based if no tags overlap.
   */
  async findSimilar(id, tags = [], limit = 4) {
    if (tags && tags.length > 0) {
      const result = await db.query(
        `SELECT *, (
           SELECT count(*) FROM jsonb_array_elements_text(pc_tags) t WHERE t = ANY($1::text[])
         ) AS tag_overlap
         FROM prompt_collections
         WHERE pc_id != $2
         ORDER BY tag_overlap DESC, pc_copy_count DESC
         LIMIT $3`,
        [tags, id, limit]
      );
      if (result.rows.length > 0) return result.rows.map(this.mapRow);
    }
    // Fallback to category
    const result = await db.query(
      'SELECT * FROM prompt_collections WHERE pc_id != $1 ORDER BY pc_copy_count DESC LIMIT $2',
      [id, limit]
    );
    return result.rows.map(this.mapRow);
  }

  /**
   * Find prompts by category with server-side pagination + sort + filter.
   * Supports: sort = 'popular' | 'newest' | 'alphabetical'
   *           filter = 'all' | 'featured' | 'premium'
   */
  async findByCategory(category, { page = 1, limit = 12, sort = 'popular', filter = 'all' } = {}) {
    const offset = (page - 1) * limit;
    const params = [category, limit, offset];
    let filterClause = '';

    if (filter === 'featured') {
      filterClause = ' AND pc_is_featured = true';
    } else if (filter === 'premium') {
      filterClause = ' AND pc_is_premium = true';
    }

    const orderMap = {
      popular: 'pc_copy_count DESC, pc_view_count DESC',
      newest: 'pc_created_at DESC',
      alphabetical: 'pc_title ASC',
    };
    const orderClause = orderMap[sort] || orderMap.popular;

    const [dataRes, countRes] = await Promise.all([
      db.query(
        `SELECT * FROM prompt_collections WHERE LOWER(pc_category) = LOWER($1)${filterClause} ORDER BY ${orderClause} LIMIT $2 OFFSET $3`,
        params
      ),
      db.query(
        `SELECT COUNT(*) FROM prompt_collections WHERE LOWER(pc_category) = LOWER($1)${filterClause}`,
        [category]
      ),
    ]);

    return {
      data: dataRes.rows.map(this.mapRow),
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countRes.rows[0].count, 10) / limit),
    };
  }

  /**
   * Find featured prompts by category.
   */
  async findFeaturedByCategory(category, limit = 4) {
    const result = await db.query(
      'SELECT * FROM prompt_collections WHERE LOWER(pc_category) = LOWER($1) AND pc_is_featured = true ORDER BY pc_copy_count DESC LIMIT $2',
      [category, limit]
    );
    return result.rows.map(this.mapRow);
  }

  /**
   * Find recently added prompts by category.
   */
  async findRecentByCategory(category, limit = 4) {
    const result = await db.query(
      'SELECT * FROM prompt_collections WHERE LOWER(pc_category) = LOWER($1) ORDER BY pc_created_at DESC LIMIT $2',
      [category, limit]
    );
    return result.rows.map(this.mapRow);
  }

  /**
   * Find prompts by type (prompt | template | example).
   */
  async findByType(type, { page = 1, limit = 12 } = {}) {
    const offset = (page - 1) * limit;
    const [dataRes, countRes] = await Promise.all([
      db.query(
        'SELECT * FROM prompt_collections WHERE pc_type = $1 ORDER BY pc_copy_count DESC LIMIT $2 OFFSET $3',
        [type, limit, offset]
      ),
      db.query('SELECT COUNT(*) FROM prompt_collections WHERE pc_type = $1', [type]),
    ]);
    return {
      data: dataRes.rows.map(this.mapRow),
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countRes.rows[0].count, 10) / limit),
    };
  }

  /**
   * Find prompts by tag (JSONB containment query).
   */
  async findByTag(tagSlug, { page = 1, limit = 12 } = {}) {
    const offset = (page - 1) * limit;
    const [dataRes, countRes] = await Promise.all([
      db.query(
        `SELECT * FROM prompt_collections WHERE pc_tags @> $1::jsonb ORDER BY pc_copy_count DESC LIMIT $2 OFFSET $3`,
        [JSON.stringify([tagSlug]), limit, offset]
      ),
      db.query(
        `SELECT COUNT(*) FROM prompt_collections WHERE pc_tags @> $1::jsonb`,
        [JSON.stringify([tagSlug])]
      ),
    ]);
    return {
      data: dataRes.rows.map(this.mapRow),
      total: parseInt(countRes.rows[0].count, 10),
      page,
      limit,
      totalPages: Math.ceil(parseInt(countRes.rows[0].count, 10) / limit),
    };
  }

  /**
   * Paginated list for sitemap generation (minimal fields, fast).
   */
  async findForSitemap(page = 1, limit = 1000) {
    const offset = (page - 1) * limit;
    const result = await db.query(
      'SELECT pc_slug, pc_updated_at, pc_created_at FROM prompt_collections ORDER BY pc_id ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows.map(row => ({
      slug: row.pc_slug,
      updated_at: row.pc_updated_at || row.pc_created_at,
    }));
  }

  async getTotalCount() {
    const result = await db.query('SELECT COUNT(*) FROM prompt_collections');
    return parseInt(result.rows[0].count, 10);
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
      tags, variations, is_featured, is_premium,
      type, ai_model_target, difficulty, meta_title, meta_description
    } = data;

    const result = await db.query(
      `INSERT INTO prompt_collections (
        pc_slug, pc_title, pc_prompt_text, pc_category,
        pc_description, pc_example_inputs, pc_example_outputs,
        pc_use_cases, pc_faqs, pc_tags, pc_variations,
        pc_is_featured, pc_is_premium, pc_type, pc_ai_model_target,
        pc_difficulty, pc_meta_title, pc_meta_description, pc_updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
      RETURNING *`,
      [
        slug, title, prompt_text, category, description,
        example_inputs, example_outputs,
        JSON.stringify(use_cases || []), JSON.stringify(faqs || []),
        JSON.stringify(tags || []), JSON.stringify(variations || []),
        is_featured || false, is_premium || false,
        type || 'prompt', ai_model_target || null,
        difficulty || 'beginner', meta_title || null, meta_description || null
      ]
    );
    return this.mapRow(result.rows[0]);
  }

  async update(id, data) {
    const {
      slug, title, prompt_text, category, description,
      example_inputs, example_outputs, use_cases, faqs,
      tags, variations, is_featured, is_premium,
      type, ai_model_target, difficulty, meta_title, meta_description
    } = data;

    const result = await db.query(
      `UPDATE prompt_collections SET
        pc_slug = $1, pc_title = $2, pc_prompt_text = $3, pc_category = $4,
        pc_description = $5, pc_example_inputs = $6, pc_example_outputs = $7,
        pc_use_cases = $8, pc_faqs = $9, pc_tags = $10, pc_variations = $11,
        pc_is_featured = $12, pc_is_premium = $13, pc_type = $14,
        pc_ai_model_target = $15, pc_difficulty = $16, pc_meta_title = $17,
        pc_meta_description = $18, pc_updated_at = NOW()
      WHERE pc_id = $19 RETURNING *`,
      [
        slug, title, prompt_text, category, description,
        example_inputs, example_outputs,
        JSON.stringify(use_cases || []), JSON.stringify(faqs || []),
        JSON.stringify(tags || []), JSON.stringify(variations || []),
        is_featured || false, is_premium || false,
        type || 'prompt', ai_model_target || null,
        difficulty || 'beginner', meta_title || null, meta_description || null,
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
