const { ApiResponse } = require('../utils/responseFormatter');

/**
 * Custom application error
 */
class AppError extends Error {
  /**
   * Create a new application error
   * 
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);
  
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      ApiResponse.error(err.message)
    );
  }

  return res.status(500).json(
    ApiResponse.error('Internal Server Error', err.message)
  );
};

module.exports = { AppError, errorHandler };