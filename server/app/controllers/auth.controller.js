const authService = require('../services/auth.service');
const { success, error } = require('../helpers/response.helper');

class AuthController {
  async login(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const loginIdentifier = email || username;
      if (!loginIdentifier || !password) {
        return error(res, 'Email and password are required', 400);
      }

      const data = await authService.login(loginIdentifier, password);
      return success(res, data, 'Login successful');
    } catch (err) {
      return error(res, err.message, 401);
    }
  }

  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return error(res, 'Name, email, and password are required', 400);
      }

      const data = await authService.register(name, email, password);
      return success(res, data, 'Registration successful', 201);
    } catch (err) {
      return error(res, err.message, 400);
    }
  }

  async verify(req, res, next) {
    try {
      // req.user is set by authMiddleware
      return success(res, { user: req.user }, 'Session is valid');
    } catch (err) {
      return error(res, err.message, 401);
    }
  }
}

module.exports = new AuthController();
