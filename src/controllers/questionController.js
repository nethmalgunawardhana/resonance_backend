const { db, admin } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const { ApiResponse } = require('../utils/responseFormatter');
const { AppError } = require('../middleware/errorHandler');

const questionController = {
  /**
   * Get all questions
   */
  async getQuestions(req, res, next) {
    try {
      const questionsSnapshot = await db.collection('questions')
        .orderBy('createdAt', 'desc')
        .get();
      
      const questions = [];
      questionsSnapshot.forEach(doc => {
        questions.push({ id: doc.id, ...doc.data() });
      });
      
      res.status(200).json(ApiResponse.success(questions));
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get question by ID
   */
  async getQuestionById(req, res, next) {
    try {
      const { questionId } = req.params;
      
      const questionDoc = await db.collection('questions').doc(questionId).get();
      
      if (!questionDoc.exists) {
        throw new AppError('Question not found', 404);
      }
      
      const question = { id: questionDoc.id, ...questionDoc.data() };
      
      res.status(200).json(ApiResponse.success(question));
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Create a new question
   */
  async createQuestion(req, res, next) {
    try {
      const questionData = req.body;
      
      // Validate required fields
      if (!questionData.title || !questionData.content || !questionData.userName) {
        throw new AppError('Missing required fields', 400);
      }
      
      const newQuestion = {
        id: uuidv4(),
        ...questionData,
        votes: 0,
        answers: 0,
        createdAt: new Date().toISOString()
      };
      
      await db.collection('questions').doc(newQuestion.id).set(newQuestion);
      
      res.status(201).json(ApiResponse.success(newQuestion));
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Vote on a question
   */
  async voteQuestion(req, res, next) {
    try {
      const { questionId } = req.params;
      const { value } = req.body;
      
      if (value !== 1 && value !== -1) {
        throw new AppError('Invalid vote value. Must be 1 or -1', 400);
      }
      
      const questionRef = db.collection('questions').doc(questionId);
      const questionDoc = await questionRef.get();
      
      if (!questionDoc.exists) {
        throw new AppError('Question not found', 404);
      }
      
      // Update votes using atomic operations
      await questionRef.update({
        votes: admin.firestore.FieldValue.increment(value)
      });
      
      // Get the updated document
      const updatedQuestionDoc = await questionRef.get();
      const updatedQuestion = { id: updatedQuestionDoc.id, ...updatedQuestionDoc.data() };
      
      res.status(200).json(ApiResponse.success(updatedQuestion));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { questionController };