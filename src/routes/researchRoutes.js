const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { 
    createResearch, 
    saveResearchDraft, 
    getCategoriesList,
    getLanguagesList 
  } = require('../controllers/researchController');
  
  // Configure multer for multiple file fields using Cloudinary storage
  const multiUpload = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'trailerVideo', maxCount: 1 }
  ]);
  
  // Create a new research project (requires authentication)
  router.post('/',multiUpload, createResearch);
  
  // Save research as draft (no authentication required)
  router.post('/draft', multiUpload, saveResearchDraft);
  
  // Get categories
  router.get('/categories', getCategoriesList);
  
  // Get languages
  router.get('/languages', getLanguagesList);
  
  module.exports = router;