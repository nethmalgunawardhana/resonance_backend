const express = require('express');
const router = express.Router();
const { getResearchProjects, getResearchProjectById } = require('../controllers/research.controller');

router.get('/projects', getResearchProjects);

router.get('/projects/:id', getResearchProjectById);

module.exports = router;
