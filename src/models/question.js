/**

 * 
 * @typedef {Object} Question
 * @property {string} id - Unique identifier
 * @property {string} title - Question title
 * @property {string} category - ID of the parent question
 * @property {string} content - Question content
 * @property {number} votes - Number of votes
 * @property {number} answers - Number of answers
 * @property {string} userName - User who posted the question
 * @property {string} userAvatar - URL to user avatar
 * @property {string} createdAt - ISO date string
 */

/**
 
 * 
 * @typedef {Object} CreateQuestionDTO
 * @property {string} title - Question title
 * @property {string} category - Category ID
 * @property {string} content - Question content
 * @property {string} userName - User who posted the question
 * @property {string} [userAvatar] - URL to user avatar
 */

module.exports = {
   
  };