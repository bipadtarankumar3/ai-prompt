const express = require('express');
const router = express.Router();
const modelController = require('../controllers/model.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Public route to list active models
router.get('/', modelController.getActive);

// Admin-only routes
router.get('/admin', authMiddleware, adminMiddleware, modelController.getAll);
router.post('/admin', authMiddleware, adminMiddleware, modelController.create);
router.get('/admin/:id', authMiddleware, adminMiddleware, modelController.getById);
router.put('/admin/:id', authMiddleware, adminMiddleware, modelController.update);
router.delete('/admin/:id', authMiddleware, adminMiddleware, modelController.delete);

module.exports = router;
