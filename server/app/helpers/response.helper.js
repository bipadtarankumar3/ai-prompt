/**
 * Response Helper
 * Standardizes API JSON responses.
 */

const responseHelper = {
  success: (res, data, message = 'Request successful', status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data
    });
  },

  error: (res, message = 'An error occurred', status = 500, details = null) => {
    const response = {
      success: false,
      message
    };
    if (details) {
      response.details = details;
    }
    return res.status(status).json(response);
  }
};

module.exports = responseHelper;
