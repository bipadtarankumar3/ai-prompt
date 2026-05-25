const settingsRepository = require('../repositories/settings.repository');

class SettingsService {
  async getSettings() {
    return settingsRepository.getAll();
  }

  async getSetting(key) {
    return settingsRepository.get(key);
  }

  async setSetting(key, value) {
    return settingsRepository.set(key, value);
  }

  async setSettings(settingsObj) {
    const results = [];
    for (const [key, value] of Object.entries(settingsObj)) {
      const result = await settingsRepository.set(key, value);
      results.push(result);
    }
    return results;
  }
}

module.exports = new SettingsService();
