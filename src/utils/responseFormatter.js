/**
 
 */
class ApiResponse {
    /**
     * Create a formatted API response
     * 
     * @param {boolean} success - Whether the request was successful
     * @param {*} [data] - The data to return
     * @param {string} [error] - Error message if applicable
     * @param {string} [message] - Additional message
     */
    constructor(success, data, error, message) {
      this.success = success;
      if (data) this.data = data;
      if (error) this.error = error;
      if (message) this.message = message;
    }
  
    /**
     * Create a success response
     * 
     * @param {*} data - The data to return
     * @param {string} [message] - Additional message
     * @returns {ApiResponse} Formatted success response
     */
    static success(data, message) {
      return new ApiResponse(true, data, undefined, message);
    }
  
    /**
     * Create an error response
     * 
     * @param {string} error - Error message
     * @param {string} [message] - Additional message
     * @returns {ApiResponse} Formatted error response
     */
    static error(error, message) {
      return new ApiResponse(false, undefined, error, message);
    }
  }
  
  module.exports = { ApiResponse };