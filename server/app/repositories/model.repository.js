const { AiModel } = require('../models');

class ModelRepository {
  mapRow(instance) {
    if (!instance) return null;
    const row = instance.dataValues || instance;
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
    const instances = await AiModel.findAll({ order: [['am_id', 'ASC']] });
    return instances.map(i => this.mapRow(i));
  }

  async findActive() {
    const instances = await AiModel.findAll({ 
      where: { am_is_active: true },
      order: [['am_id', 'ASC']]
    });
    return instances.map(i => this.mapRow(i));
  }

  async findById(id) {
    const instance = await AiModel.findByPk(id);
    return this.mapRow(instance);
  }

  async create({ name, provider, api_model_code, is_active }) {
    const instance = await AiModel.create({
      am_name: name,
      am_provider: provider,
      am_api_model_code: api_model_code,
      am_is_active: is_active !== false
    });
    return this.mapRow(instance);
  }

  async update(id, { name, provider, api_model_code, is_active }) {
    await AiModel.update({
      am_name: name,
      am_provider: provider,
      am_api_model_code: api_model_code,
      am_is_active: is_active
    }, { where: { am_id: id } });
    const instance = await AiModel.findByPk(id);
    return this.mapRow(instance);
  }

  async delete(id) {
    await AiModel.destroy({ where: { am_id: id } });
    return { id };
  }
}

module.exports = new ModelRepository();
