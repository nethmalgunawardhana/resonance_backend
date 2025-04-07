const { Router } = require('express');
const { answerController } = require('../controllers/answerController');

const router = Router({ mergeParams: true });  // Add mergeParams: true to access parent route params

// Get answers for a question
router.get('/', answerController.getAnswers);

// Create a new answer
router.post('/', answerController.createAnswer);

// Vote on an answer
router.post('/:answerId/vote', answerController.voteAnswer);

module.exports = router;