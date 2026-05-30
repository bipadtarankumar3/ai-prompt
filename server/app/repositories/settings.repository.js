const { Setting } = require('../models');

class SettingsRepository {
  async get(key) {
    const instance = await Setting.findByPk(key);
    return instance?.set_value || null;
  }

  async set(key, value) {
    // Sequelize upsert handles ON CONFLICT DO UPDATE
    const [instance] = await Setting.upsert({ set_key: key, set_value: String(value) });
    return instance.dataValues;
  }

  async getAll() {
    const instances = await Setting.findAll();
    return instances.reduce((acc, instance) => {
      acc[instance.set_key] = instance.set_value;
      return acc;
    }, {});
  }
}

module.exports = new SettingsRepository();
