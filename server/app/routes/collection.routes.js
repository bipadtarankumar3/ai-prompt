const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// Public routes
router.get('/', collectionController.getAll);
router.get('/trending', collectionController.getTrending);
router.get('/slug/:slug', collectionController.getBySlug);
router.get('/related/:id', collectionController.getRelated);
router.post('/:id/copy', collectionController.incrementCopy);
router.post('/:id/view', collectionController.incrementView);

// Admin-only CRUD routes
router.post('/admin', authMiddleware, adminMiddleware, collectionController.create);
router.get('/admin/:id', authMiddleware, adminMiddleware, collectionController.getById);
router.put('/admin/:id', authMiddleware, adminMiddleware, collectionController.update);
router.delete('/admin/:id', authMiddleware, adminMiddleware, collectionController.delete);

module.exports = router;
