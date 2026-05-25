const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generate.controller');

router.post('/', generateController.generate);

module.exports = router;
