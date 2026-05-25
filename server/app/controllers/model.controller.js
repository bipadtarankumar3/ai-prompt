const modelService = require('../services/model.service');
const { success, error } = require('../helpers/response.helper');

class ModelController {
  async getActive(req, res, next) {
    try {
      const models = await modelService.getActiveModels();
      return success(res, models, 'Active models fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const models = await modelService.getAllModels();
      return success(res, models, 'All models fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const model = await modelService.getModelById(req.params.id);
      return success(res, model, 'Model fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const model = await modelService.createModel(req.body);
      return success(res, model, 'Model created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const model = await modelService.updateModel(req.params.id, req.body);
      return success(res, model, 'Model updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await modelService.deleteModel(req.params.id);
      return success(res, { id: req.params.id }, 'Model deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ModelController();
