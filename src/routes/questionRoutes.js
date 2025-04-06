const { Router } = require('express');
const { questionController } = require('../controllers/questionController');

const router = Router();

// GET /api/questions
router.get('/', questionController.getQuestions);

// GET /api/questions/:questionId
router.get('/:questionId', questionController.getQuestionById);

// POST /api/questions
router.post('/', questionController.createQuestion);

// POST /api/questions/:questionId/vote
router.post('/:questionId/vote', questionController.voteQuestion);

module.exports = router;