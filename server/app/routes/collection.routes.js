const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// ─── Public routes ────────────────────────────────────────────────────────────

// Core listing
router.get('/', collectionController.getAll);
router.get('/trending', collectionController.getTrending);

// Sitemap support (lightweight, paginated)
router.get('/sitemap', collectionController.getForSitemap);

// SEO surfaces: by type (/templates, /examples)
router.get('/type/:type', collectionController.getByType);

// SEO surfaces: by tag (/tags/[tag-slug])
router.get('/tag/:tag', collectionController.getByTag);

// Category page: server-side paginated + sorted + filtered
router.get('/category/:category', collectionController.getByCategory);
router.get('/category/:category/featured', collectionController.getFeaturedByCategory);
router.get('/category/:category/recent', collectionController.getRecentByCategory);

// Individual prompt
router.get('/slug/:slug', collectionController.getBySlug);

// Linking graph: related (same category) + similar (tag overlap)
router.get('/related/:id', collectionController.getRelated);
router.get('/similar/:id', collectionController.getSimilar);

// Engagement counters
router.post('/:id/copy', collectionController.incrementCopy);
router.post('/:id/view', collectionController.incrementView);

// ─── Admin-only CRUD routes ───────────────────────────────────────────────────
router.post('/admin', authMiddleware, adminMiddleware, collectionController.create);
router.get('/admin/:id', authMiddleware, adminMiddleware, collectionController.getById);
router.put('/admin/:id', authMiddleware, adminMiddleware, collectionController.update);
router.delete('/admin/:id', authMiddleware, adminMiddleware, collectionController.delete);

module.exports = router;
