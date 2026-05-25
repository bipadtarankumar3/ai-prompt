const { error } = require('../helpers/response.helper');

module.exports = {
  validateLogin: (req, res, next) => {
    const { username, password } = req.body;
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return error(res, 'Username is required and must be a valid string', 400);
    }
    if (!password || typeof password !== 'string' || password.trim() === '') {
      return error(res, 'Password is required and must be a valid string', 400);
    }
    next();
  }
};
