const settingsService = require('../services/settings.service');
const { success, error } = require('../helpers/response.helper');

class SettingsController {
  async get(req, res, next) {
    try {
      const settings = await settingsService.getSettings();
      return success(res, settings, 'Settings fetched successfully');
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const results = await settingsService.setSettings(req.body);
      return success(res, results, 'Settings updated successfully');
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new SettingsController();
