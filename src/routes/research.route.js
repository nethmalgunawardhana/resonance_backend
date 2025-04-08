const express = require('express');
const router = express.Router();
const { getResearchProjects, getResearchProjectById, getTrendingResearchProject } = require('../controllers/research.controller');

router.get('/projects/trending', getTrendingResearchProject);

router.get('/projects/category/:category', getResearchProjects);

router.get('/projects/:id', getResearchProjectById);



module.exports = router;
