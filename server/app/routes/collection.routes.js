const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public route to list collections
router.get('/', collectionController.getAll);

// Admin-only CRUD routes
router.post('/admin', authMiddleware, collectionController.create);
router.get('/admin/:id', authMiddleware, collectionController.getById);
router.put('/admin/:id', authMiddleware, collectionController.update);
router.delete('/admin/:id', authMiddleware, collectionController.delete);

module.exports = router;
