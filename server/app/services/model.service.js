const modelRepository = require('../repositories/model.repository');

class ModelService {
  async getAllModels() {
    return modelRepository.findAll();
  }

  async getActiveModels() {
    return modelRepository.findActive();
  }

  async getModelById(id) {
    const model = await modelRepository.findById(id);
    if (!model) throw new Error('AI Model not found');
    return model;
  }

  async createModel(data) {
    if (!data.name || !data.provider || !data.api_model_code) {
      throw new Error('Name, provider, and api_model_code are required');
    }
    return modelRepository.create(data);
  }

  async updateModel(id, data) {
    await this.getModelById(id); // will throw error if not found
    return modelRepository.update(id, data);
  }

  async deleteModel(id) {
    await this.getModelById(id); // will throw error if not found
    return modelRepository.delete(id);
  }
}

module.exports = new ModelService();
