const { saveResearch, getCategories, getLanguages } = require('../services/firestore');
const { processFormData } = require('../utils/fileUpload');

const createResearch = async (req, res) => {
  try {
    // Process the form data
    const processedData = processFormData(req);
    console.log('Processed Data:', processedData);
    // Save to Firestore
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }
    
    // Save to Firestore
    const result = await saveResearch(processedData, userId, false);
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating research:', error);
    res.status(500).json({ message: 'Error creating research', error: error.message });
  }
};

const saveResearchDraft = async (req, res) => {
  try {
    // Process the form data
    const processedData = processFormData(req);
    
    // Get user ID from auth if available, otherwise use a guest ID
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ message: 'User ID not found' });
    }
    
    // Save to Firestore as draft
    const result = await saveResearch(processedData, userId, true);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error saving research draft:', error);
    res.status(500).json({ message: 'Error saving research draft', error: error.message });
  }
};

const getCategoriesList = async (req, res) => {
  try {
    const categories = await getCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

const getLanguagesList = async (req, res) => {
  try {
    const languages = await getLanguages();
    res.status(200).json(languages);
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({ message: 'Error fetching languages', error: error.message });
  }
};

module.exports = {
  createResearch,
  saveResearchDraft,
  getCategoriesList,
  getLanguagesList
};