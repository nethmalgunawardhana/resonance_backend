const express = require('express');
const router = express.Router();
const { getResearcher } = require('../controllers/researcher');

router.get('/', getResearcher);

module.exports = router;