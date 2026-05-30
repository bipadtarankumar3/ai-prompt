const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.post('/event', analyticsController.trackEvent);

module.exports = router;
