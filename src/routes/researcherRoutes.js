const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const researcherController = require('../controllers/researcherController');


// Validation middleware
const validateResearcher = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail()
];

/**
 * @route   GET api/researchers
 * @desc    Get all researchers
 * @access  Public
 */
router.get('/', researcherController.getResearchers);

/**
 * @route   GET api/researchers/search
 * @desc    Search researchers
 * @access  Public
 */
router.get('/search', researcherController.searchResearchers);

/**
 * @route   GET api/researchers/:id
 * @desc    Get researcher by ID
 * @access  Public
 */
router.get('/:id', researcherController.getResearcherById);

/**
 * @route   POST api/researchers
 * @desc    Create a new researcher
 * @access  Private
 */
router.post('/', [validateResearcher], researcherController.createResearcher);

/**
 * @route   PUT api/researchers/:id
 * @desc    Update researcher
 * @access  Private
 */
router.put('/:id', [validateResearcher], researcherController.updateResearcher);

/**
 * @route   DELETE api/researchers/:id
 * @desc    Delete researcher
 * @access  Private
 */
router.delete('/:id',researcherController.deleteResearcher);

module.exports = router;