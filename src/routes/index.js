const { Router } = require('express');
const questionRoutes = require('./questionRoutes');
const answerRoutes = require('./answerRoutes');
const chatRoutes = require('./chatRoutes');
const researchRoutes = require('./researchRoutes');
const router = Router();

// API routes
router.use('/questions', questionRoutes);

// Nested routes for answers
router.use('/questions/:questionId/answers', answerRoutes);

// Chat routes
router.use('/chat', chatRoutes);


// Research routes
router.use('/research', researchRoutes);

module.exports = router;