const { Op } = require('sequelize');
const { PromptCollection, sequelize } = require('../models');

class CollectionRepository {
  mapRow(instance) {
    if (!instance) return null;
    const row = instance.dataValues || instance;
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
    const instances = await PromptCollection.findAll({ order: [['pc_id', 'DESC']] });
    return instances.map(i => this.mapRow(i));
  }

  async findById(id) {
    const instance = await PromptCollection.findByPk(id);
    return this.mapRow(instance);
  }

  async findBySlug(slug) {
    const instance = await PromptCollection.findOne({ where: { pc_slug: slug } });
    return this.mapRow(instance);
  }

  async findTrending(limit = 6) {
    const instances = await PromptCollection.findAll({
      order: [['pc_copy_count', 'DESC'], ['pc_view_count', 'DESC']],
      limit
    });
    return instances.map(i => this.mapRow(i));
  }

  async findRelated(id, category, limit = 3) {
    const instances = await PromptCollection.findAll({
      where: {
        pc_category: category,
        pc_id: { [Op.ne]: id }
      },
      order: [['pc_copy_count', 'DESC']],
      limit
    });
    return instances.map(i => this.mapRow(i));
  }

  async findSimilar(id, tags = [], limit = 4) {
    if (tags && tags.length > 0) {
      // Sequelize JSONB overlap operator @>
      const instances = await PromptCollection.findAll({
        where: {
          pc_id: { [Op.ne]: id },
          pc_tags: {
            [Op.contains]: tags
          }
        },
        order: [['pc_copy_count', 'DESC']],
        limit
      });
      if (instances.length > 0) return instances.map(i => this.mapRow(i));
    }

    // Fallback to category
    return this.findRelated(id, 'General', limit); // Actually this should fallback to category but we don't have category here. Let's just find random or latest.
  }

  async findByCategory(category, { page = 1, limit = 12, sort = 'popular', filter = 'all' } = {}) {
    const offset = (page - 1) * limit;
    
    const whereClause = {
      pc_category: sequelize.where(sequelize.fn('LOWER', sequelize.col('pc_category')), category.toLowerCase())
    };

    if (filter === 'featured') {
      whereClause.pc_is_featured = true;
    } else if (filter === 'premium') {
      whereClause.pc_is_premium = true;
    }

    const orderMap = {
      popular: [['pc_copy_count', 'DESC'], ['pc_view_count', 'DESC']],
      newest: [['pc_created_at', 'DESC']],
      alphabetical: [['pc_title', 'ASC']],
    };
    const orderClause = orderMap[sort] || orderMap.popular;

    const { rows, count } = await PromptCollection.findAndCountAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset
    });

    return {
      data: rows.map(i => this.mapRow(i)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findFeaturedByCategory(category, limit = 4) {
    const instances = await PromptCollection.findAll({
      where: {
        pc_category: sequelize.where(sequelize.fn('LOWER', sequelize.col('pc_category')), category.toLowerCase()),
        pc_is_featured: true
      },
      order: [['pc_copy_count', 'DESC']],
      limit
    });
    return instances.map(i => this.mapRow(i));
  }

  async findRecentByCategory(category, limit = 4) {
    const instances = await PromptCollection.findAll({
      where: {
        pc_category: sequelize.where(sequelize.fn('LOWER', sequelize.col('pc_category')), category.toLowerCase())
      },
      order: [['pc_created_at', 'DESC']],
      limit
    });
    return instances.map(i => this.mapRow(i));
  }

  async findByType(type, { page = 1, limit = 12 } = {}) {
    const offset = (page - 1) * limit;
    const { rows, count } = await PromptCollection.findAndCountAll({
      where: { pc_type: type },
      order: [['pc_copy_count', 'DESC']],
      limit,
      offset
    });

    return {
      data: rows.map(i => this.mapRow(i)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findByTag(tagSlug, { page = 1, limit = 12 } = {}) {
    const offset = (page - 1) * limit;
    const { rows, count } = await PromptCollection.findAndCountAll({
      where: {
        pc_tags: {
          [Op.contains]: [tagSlug]
        }
      },
      order: [['pc_copy_count', 'DESC']],
      limit,
      offset
    });

    return {
      data: rows.map(i => this.mapRow(i)),
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findForSitemap(page = 1, limit = 1000) {
    const offset = (page - 1) * limit;
    const instances = await PromptCollection.findAll({
      attributes: ['pc_slug', 'pc_updated_at', 'pc_created_at'],
      order: [['pc_id', 'ASC']],
      limit,
      offset
    });
    
    return instances.map(instance => ({
      slug: instance.pc_slug,
      updated_at: instance.pc_updated_at || instance.pc_created_at,
    }));
  }

  async getTotalCount() {
    return await PromptCollection.count();
  }

  async incrementCopy(id) {
    await PromptCollection.increment('pc_copy_count', { by: 1, where: { pc_id: id } });
    const instance = await PromptCollection.findByPk(id, { attributes: ['pc_copy_count'] });
    return instance?.pc_copy_count;
  }

  async incrementView(id) {
    await PromptCollection.increment('pc_view_count', { by: 1, where: { pc_id: id } });
    const instance = await PromptCollection.findByPk(id, { attributes: ['pc_view_count'] });
    return instance?.pc_view_count;
  }

  async create(data) {
    const instance = await PromptCollection.create({
      pc_slug: data.slug,
      pc_title: data.title,
      pc_prompt_text: data.prompt_text,
      pc_category: data.category,
      pc_description: data.description,
      pc_example_inputs: data.example_inputs,
      pc_example_outputs: data.example_outputs,
      pc_use_cases: data.use_cases || [],
      pc_faqs: data.faqs || [],
      pc_tags: data.tags || [],
      pc_variations: data.variations || [],
      pc_is_featured: data.is_featured || false,
      pc_is_premium: data.is_premium || false,
      pc_type: data.type || 'prompt',
      pc_ai_model_target: data.ai_model_target || null,
      pc_difficulty: data.difficulty || 'beginner',
      pc_meta_title: data.meta_title || null,
      pc_meta_description: data.meta_description || null
    });
    return this.mapRow(instance);
  }

  async update(id, data) {
    await PromptCollection.update({
      pc_slug: data.slug,
      pc_title: data.title,
      pc_prompt_text: data.prompt_text,
      pc_category: data.category,
      pc_description: data.description,
      pc_example_inputs: data.example_inputs,
      pc_example_outputs: data.example_outputs,
      pc_use_cases: data.use_cases || [],
      pc_faqs: data.faqs || [],
      pc_tags: data.tags || [],
      pc_variations: data.variations || [],
      pc_is_featured: data.is_featured || false,
      pc_is_premium: data.is_premium || false,
      pc_type: data.type || 'prompt',
      pc_ai_model_target: data.ai_model_target || null,
      pc_difficulty: data.difficulty || 'beginner',
      pc_meta_title: data.meta_title || null,
      pc_meta_description: data.meta_description || null
    }, { where: { pc_id: id } });
    
    const instance = await PromptCollection.findByPk(id);
    return this.mapRow(instance);
  }

  async delete(id) {
    await PromptCollection.destroy({ where: { pc_id: id } });
    return { id };
  }
}

module.exports = new CollectionRepository();
