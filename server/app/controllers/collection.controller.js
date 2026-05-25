const collectionService = require('../services/collection.service');
const { success, error } = require('../helpers/response.helper');

class CollectionController {
  async getAll(req, res, next) {
    try {
      const collections = await collectionService.getAllCollections();
      return success(res, collections, 'Collections fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const collection = await collectionService.getCollectionById(req.params.id);
      return success(res, collection, 'Collection fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const collection = await collectionService.createCollection(req.body);
      return success(res, collection, 'Collection created successfully', 201);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const collection = await collectionService.updateCollection(req.params.id, req.body);
      return success(res, collection, 'Collection updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await collectionService.deleteCollection(req.params.id);
      return success(res, { id: req.params.id }, 'Collection deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CollectionController();
