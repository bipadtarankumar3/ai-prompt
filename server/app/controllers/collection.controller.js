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

  async getSimilar(req, res, next) {
    try {
      const { id } = req.params;
      const tags = req.query.tags ? req.query.tags.split(',') : [];
      const limit = parseInt(req.query.limit || '4', 10);
      const collections = await collectionService.getSimilarCollections(id, tags, limit);
      return success(res, collections, 'Similar collections fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '12', 10);
      const sort = req.query.sort || 'popular';
      const filter = req.query.filter || 'all';
      const result = await collectionService.getCollectionsByCategory(category, { page, limit, sort, filter });
      return success(res, result, 'Category collections fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getFeaturedByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit || '4', 10);
      const collections = await collectionService.getFeaturedByCategory(category, limit);
      return success(res, collections, 'Featured collections fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getRecentByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const limit = parseInt(req.query.limit || '4', 10);
      const collections = await collectionService.getRecentByCategory(category, limit);
      return success(res, collections, 'Recent collections fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getByType(req, res, next) {
    try {
      const { type } = req.params;
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '12', 10);
      const result = await collectionService.getCollectionsByType(type, { page, limit });
      return success(res, result, 'Collections by type fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getByTag(req, res, next) {
    try {
      const { tag } = req.params;
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '12', 10);
      const result = await collectionService.getCollectionsByTag(tag, { page, limit });
      return success(res, result, 'Collections by tag fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async getForSitemap(req, res, next) {
    try {
      const page = parseInt(req.query.page || '1', 10);
      const limit = parseInt(req.query.limit || '1000', 10);
      const [slugs, total] = await Promise.all([
        collectionService.getCollectionsForSitemap(page, limit),
        collectionService.getTotalCount(),
      ]);
      return success(res, { slugs, total, page, limit }, 'Sitemap data fetched');
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
