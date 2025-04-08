const express = require('express');
const router = express.Router();
const { getPublishedPapers, getLocalPapersResearcher } = require('../controllers/arxiv.controller');

// Route to fetch published papers by category
router.get('/published-papers', getPublishedPapers);

router.get('/local-papers/:id', getLocalPapersResearcher);

module.exports = router;