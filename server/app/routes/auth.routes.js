const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validateLogin } = require('../validations/auth.validation');

router.post('/login', validateLogin, authController.login);
router.get('/status', authMiddleware, authController.verify);

module.exports = router;
