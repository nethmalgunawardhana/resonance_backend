const { Router } = require('express');
const { answerController } = require('../controllers/answerController');

const router = Router();



router.get('/', answerController.getAnswers);


router.post('/', answerController.createAnswer);

// Additional route for voting on answers
router.post('/vote/:answerId', answerController.voteAnswer);

module.exports = router;