const { Router } = require('express');
const questionRoutes = require('./questionRoutes');
const answerRoutes = require('./answerRoutes');
const blockchainRoutes = require('./blockchainRoutes');
const chatRoutes = require('./chatRoutes');

const router = Router();

// API routes
router.use('/questions', questionRoutes);
router.use('/blockchain', blockchainRoutes);

// Nested routes for answers
router.use('/questions/:questionId/answers', answerRoutes);

// Chat routes
router.use('/chat', chatRoutes);

module.exports = router;