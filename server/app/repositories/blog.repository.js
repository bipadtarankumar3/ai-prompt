const { BlogPost } = require('../models');

class BlogRepository {
  mapRow(instance) {
    if (!instance) return null;
    const row = instance.dataValues || instance;
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
    const instances = await BlogPost.findAll({ order: [['bp_published_at', 'DESC'], ['bp_id', 'DESC']] });
    return instances.map(i => this.mapRow(i));
  }

  async findById(id) {
    const instance = await BlogPost.findByPk(id);
    return this.mapRow(instance);
  }

  async findBySlug(slug) {
    const instance = await BlogPost.findOne({ where: { bp_slug: slug } });
    return this.mapRow(instance);
  }

  async create({ title, content, excerpt, category, author, read_time, slug, image_url }) {
    const instance = await BlogPost.create({
      bp_title: title,
      bp_content: content,
      bp_excerpt: excerpt,
      bp_category: category,
      bp_author: author,
      bp_read_time: read_time,
      bp_slug: slug,
      bp_image_url: image_url || null
    });
    return this.mapRow(instance);
  }

  async update(id, { title, content, excerpt, category, author, read_time, slug, image_url }) {
    const updateData = {
      bp_title: title,
      bp_content: content,
      bp_excerpt: excerpt,
      bp_category: category,
      bp_author: author,
      bp_read_time: read_time,
      bp_slug: slug,
    };
    if (image_url !== undefined) {
      updateData.bp_image_url = image_url || null;
    }

    await BlogPost.update(updateData, { where: { bp_id: id } });
    const instance = await BlogPost.findByPk(id);
    return this.mapRow(instance);
  }

  async delete(id) {
    await BlogPost.destroy({ where: { bp_id: id } });
    return { id };
  }
}

module.exports = new BlogRepository();
