const logger = require('../utils/logger');
const { error } = require('../helpers/response.helper');

module.exports = (err, req, res, next) => {
  logger.error(`Express error handler caught: ${err.message}`, err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  return error(res, message, status, process.env.NODE_ENV === 'development' ? err.stack : null);
};
