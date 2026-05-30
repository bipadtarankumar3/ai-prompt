const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Public route to get setting variables (active status, about details)
router.get('/', settingsController.get);

// Admin-only route to update setting variables
router.put('/admin', authMiddleware, adminMiddleware, settingsController.update);

module.exports = router;
