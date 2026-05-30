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

  async getBySlug(req, res, next) {
    try {
      const collection = await collectionService.getCollectionBySlug(req.params.slug);
      return success(res, collection, 'Collection fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getTrending(req, res, next) {
    try {
      const limit = parseInt(req.query.limit || '6', 10);
      const collections = await collectionService.getTrendingCollections(limit);
      return success(res, collections, 'Trending collections fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getRelated(req, res, next) {
    try {
      const { id } = req.params;
      const { category } = req.query;
      const limit = parseInt(req.query.limit || '3', 10);
      const collections = await collectionService.getRelatedCollections(id, category, limit);
      return success(res, collections, 'Related collections fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async incrementCopy(req, res, next) {
    try {
      const { id } = req.params;
      const count = await collectionService.incrementCopyCount(id);
      return success(res, { copy_count: count }, 'Copy count incremented successfully');
    } catch (err) {
      next(err);
    }
  }

  async incrementView(req, res, next) {
    try {
      const { id } = req.params;
      const count = await collectionService.incrementViewCount(id);
      return success(res, { view_count: count }, 'View count incremented successfully');
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
