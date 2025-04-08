const express = require('express');
const router = express.Router();
const { getResearchProjects, getResearchProjectById, getTrendingResearchProject } = require('../controllers/research.controller');
const { getFundingTransactions } = require('../controllers/fundingStatController');

router.get('/projects/trending', getTrendingResearchProject);

router.get('/projects/category/:category', getResearchProjects);

router.get('/projects/:id', getResearchProjectById);

router.get('/projects/:id/fundingtransactions', getFundingTransactions);


module.exports = router;
