const collectionRepository = require('../repositories/collection.repository');

class CollectionService {
  async getAllCollections() {
    return collectionRepository.findAll();
  }

  async getCollectionById(id) {
    const collection = await collectionRepository.findById(id);
    if (!collection) throw new Error('Prompt Collection not found');
    return collection;
  }

  async getCollectionBySlug(slug) {
    const collection = await collectionRepository.findBySlug(slug);
    if (!collection) throw new Error(`Prompt Collection with slug '${slug}' not found`);
    return collection;
  }

  async getTrendingCollections(limit) {
    return collectionRepository.findTrending(limit);
  }

  async getRelatedCollections(id, category, limit) {
    return collectionRepository.findRelated(id, category, limit);
  }

  async incrementCopyCount(id) {
    return collectionRepository.incrementCopy(id);
  }

  async incrementViewCount(id) {
    return collectionRepository.incrementView(id);
  }

  async createCollection(data) {
    if (!data.title || !data.prompt_text || !data.category || !data.slug) {
      throw new Error('Title, prompt_text, category, and slug are required');
    }
    return collectionRepository.create(data);
  }

  async updateCollection(id, data) {
    await this.getCollectionById(id);
    if (!data.title || !data.prompt_text || !data.category || !data.slug) {
      throw new Error('Title, prompt_text, category, and slug are required');
    }
    return collectionRepository.update(id, data);
  }

  async deleteCollection(id) {
    await this.getCollectionById(id);
    return collectionRepository.delete(id);
  }
}

module.exports = new CollectionService();
