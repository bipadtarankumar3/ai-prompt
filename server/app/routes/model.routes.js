const express = require('express');
const router = express.Router();
const modelController = require('../controllers/model.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public route to get active models for client generator
router.get('/', modelController.getActive);

// Admin-only CRUD routes
router.get('/admin', authMiddleware, modelController.getAll);
router.post('/admin', authMiddleware, modelController.create);
router.get('/admin/:id', authMiddleware, modelController.getById);
router.put('/admin/:id', authMiddleware, modelController.update);
router.delete('/admin/:id', authMiddleware, modelController.delete);

module.exports = router;
