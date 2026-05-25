const db = require('../config/database');

class BlogRepository {
  mapRow(row) {
    if (!row) return null;
    return {
      id: row.bp_id,
      title: row.bp_title,
      content: row.bp_content,
      excerpt: row.bp_excerpt,
      category: row.bp_category,
      author: row.bp_author,
      read_time: row.bp_read_time,
      slug: row.bp_slug,
      image_url: row.bp_image_url,
      published_at: row.bp_published_at,
      created_at: row.bp_created_at
    };
  }

  async findAll() {
    const result = await db.query('SELECT * FROM blog_posts ORDER BY bp_published_at DESC, bp_id DESC');
    return result.rows.map(this.mapRow);
  }

  async findById(id) {
    const result = await db.query('SELECT * FROM blog_posts WHERE bp_id = $1', [id]);
    return this.mapRow(result.rows[0]);
  }

  async findBySlug(slug) {
    const result = await db.query('SELECT * FROM blog_posts WHERE bp_slug = $1', [slug]);
    return this.mapRow(result.rows[0]);
  }

  async create({ title, content, excerpt, category, author, read_time, slug, image_url }) {
    const result = await db.query(
      'INSERT INTO blog_posts (bp_title, bp_content, bp_excerpt, bp_category, bp_author, bp_read_time, bp_slug, bp_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, content, excerpt, category, author, read_time, slug, image_url || null]
    );
    return this.mapRow(result.rows[0]);
  }

  async update(id, { title, content, excerpt, category, author, read_time, slug, image_url }) {
    const result = await db.query(
      'UPDATE blog_posts SET bp_title = $1, bp_content = $2, bp_excerpt = $3, bp_category = $4, bp_author = $5, bp_read_time = $6, bp_slug = $7, bp_image_url = COALESCE($8, bp_image_url) WHERE bp_id = $9 RETURNING *',
      [title, content, excerpt, category, author, read_time, slug, image_url || null, id]
    );
    return this.mapRow(result.rows[0]);
  }

  async delete(id) {
    const result = await db.query('DELETE FROM blog_posts WHERE bp_id = $1 RETURNING bp_id', [id]);
    return { id: result.rows[0]?.bp_id };
  }
}

module.exports = new BlogRepository();
