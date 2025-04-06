const { Router } = require('express');
const questionRoutes = require('./questionRoutes');
const answerRoutes = require('./answerRoutes');

const router = Router();

// API routes
router.use('/questions', questionRoutes);

// Nested routes for answers
router.use('/questions/:questionId/answers', answerRoutes);

module.exports = router;