const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Public routes
router.get('/', collectionController.getAll);
router.get('/trending', collectionController.getTrending);
router.get('/slug/:slug', collectionController.getBySlug);
router.get('/related/:id', collectionController.getRelated);
router.post('/:id/copy', collectionController.incrementCopy);
router.post('/:id/view', collectionController.incrementView);

// Admin-only CRUD routes
router.post('/admin', authMiddleware, collectionController.create);
router.get('/admin/:id', authMiddleware, collectionController.getById);
router.put('/admin/:id', authMiddleware, collectionController.update);
router.delete('/admin/:id', authMiddleware, collectionController.delete);

module.exports = router;
