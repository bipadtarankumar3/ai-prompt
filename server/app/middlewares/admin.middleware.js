const { error } = require('../helpers/response.helper');

module.exports = (req, res, next) => {
  // authMiddleware sets req.user
  if (!req.user || req.user.role !== 'admin') {
    return error(res, 'Access denied. Administrator privileges required.', 403);
  }
  next();
};
