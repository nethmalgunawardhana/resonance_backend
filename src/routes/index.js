const { Router } = require('express');
const questionRoutes = require('./questionRoutes');
const answerRoutes = require('./answerRoutes');
const blockchainRoutes = require('./blockchainRoutes');
const chatRoutes = require('./chatRoutes');
const researchRoutes = require('./researchRoutes');
const researcherRoutes = require('./researcherRoutes');

const router = Router();

// API routes
router.use('/questions', questionRoutes);
router.use('/blockchain', blockchainRoutes);

// Nested routes for answers
router.use('/questions/:questionId/answers', answerRoutes);

// Chat routes
router.use('/chat', chatRoutes);


// Research routes
router.use('/research', researchRoutes);

// Researcher routes
router.use('/researchers', researcherRoutes);

module.exports = router;