const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

// All content generation routes require admin authentication
router.use(authMiddleware, adminMiddleware);

// GET /api/content/gaps — returns prompts missing enrichment
router.get('/gaps', contentController.getGaps);

// POST /api/content/generate-batch — enrich all gap prompts
router.post('/generate-batch', contentController.generateBatch);

// POST /api/content/generate-prompt — create + auto-enrich new prompt
router.post('/generate-prompt', contentController.generatePrompt);

// POST /api/content/enrich/:id — enrich single prompt by ID
router.post('/enrich/:id', contentController.enrichSingle);

module.exports = router;
