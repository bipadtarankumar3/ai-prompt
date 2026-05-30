const express = require('express');
const router = express.Router();
const monetizationController = require('../controllers/monetization.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Apply auth middleware to all monetization routes
router.use(authMiddleware);

// Saved Prompts
router.get('/saved', monetizationController.getSavedPrompts);
router.post('/saved/toggle', monetizationController.toggleSavePrompt);

// User Limits
router.get('/limits', monetizationController.getUserLimits);

// API Keys
router.get('/keys', monetizationController.getApiKeys);
router.post('/keys/generate', monetizationController.generateApiKey);

module.exports = router;
