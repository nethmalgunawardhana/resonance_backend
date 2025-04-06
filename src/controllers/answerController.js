const { db, admin } = require('../config/firebase');
const { v4: uuidv4 } = require('uuid');
const { ApiResponse } = require('../utils/responseFormatter');
const { AppError } = require('../middleware/errorHandler');

const answerController = {
  /**
   * Get answers for a question
   */
  async getAnswers(req, res, next) {
    try {
      const { questionId } = req.params;
      
      // Check if question exists
      const questionDoc = await db.collection('questions').doc(questionId).get();
      
      if (!questionDoc.exists) {
        throw new AppError('Question not found', 404);
      }
      
      const answersSnapshot = await db.collection('answers')
        .where('questionId', '==', questionId)
        .orderBy('createdAt', 'desc')
        .get();
      
      const answers = [];
      answersSnapshot.forEach(doc => {
        answers.push({ id: doc.id, ...doc.data() });
      });
      
      res.status(200).json(ApiResponse.success(answers));
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Create a new answer
   */
  async createAnswer(req, res, next) {
    try {
      const { questionId } = req.params;
      const answerData = req.body;
      
      // Validate required fields
      if (!answerData.content || !answerData.userName) {
        throw new AppError('Missing required fields', 400);
      }
      
      // Check if question exists
      const questionRef = db.collection('questions').doc(questionId);
      const questionDoc = await questionRef.get();
      
      if (!questionDoc.exists) {
        throw new AppError('Question not found', 404);
      }
      
      const newAnswer = {
        id: uuidv4(),
        questionId,
        content: answerData.content,
        userName: answerData.userName,
        userAvatar: answerData.userAvatar || '',
        votes: 0,
        createdAt: new Date().toISOString()
      };
      
      // Use a transaction to create the answer and update the question's answer count
      await db.runTransaction(async (transaction) => {
        // Add the answer
        transaction.set(db.collection('answers').doc(newAnswer.id), newAnswer);
        
        // Increment the question's answer count
        transaction.update(questionRef, {
          answers: admin.firestore.FieldValue.increment(1)
        });
      });
      
      res.status(201).json(ApiResponse.success(newAnswer));
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Vote on an answer
   */
  async voteAnswer(req, res, next) {
    try {
      const { answerId } = req.params;
      const { value } = req.body;
      
      if (value !== 1 && value !== -1) {
        throw new AppError('Invalid vote value. Must be 1 or -1', 400);
      }
      
      const answerRef = db.collection('answers').doc(answerId);
      const answerDoc = await answerRef.get();
      
      if (!answerDoc.exists) {
        throw new AppError('Answer not found', 404);
      }
      
      // Update votes using atomic operations
      await answerRef.update({
        votes: admin.firestore.FieldValue.increment(value)
      });
      
      // Get the updated document
      const updatedAnswerDoc = await answerRef.get();
      const updatedAnswer = { id: updatedAnswerDoc.id, ...updatedAnswerDoc.data() };
      
      res.status(200).json(ApiResponse.success(updatedAnswer));
    } catch (error) {
      next(error);
    }
  }
};

module.exports = { answerController };