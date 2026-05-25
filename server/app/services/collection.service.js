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

  async createCollection(data) {
    if (!data.title || !data.prompt_text || !data.category) {
      throw new Error('Title, prompt_text, and category are required');
    }
    return collectionRepository.create(data);
  }

  async updateCollection(id, data) {
    await this.getCollectionById(id);
    return collectionRepository.update(id, data);
  }

  async deleteCollection(id) {
    await this.getCollectionById(id);
    return collectionRepository.delete(id);
  }
}

module.exports = new CollectionService();
