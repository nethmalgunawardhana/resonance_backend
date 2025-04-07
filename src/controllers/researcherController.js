const { db } = require('../config/firebase');
const { validationResult } = require('express-validator');

// Collection reference
const researchersCollection = db.collection('researches');

// Get all researchers
exports.getResearchers = async (req, res) => {
  try {
    const researchersSnapshot = await researchersCollection.get();
    
    if (researchersSnapshot.empty) {
      return res.status(200).json([]);
    }
    
    const researchers = [];
    researchersSnapshot.forEach(doc => {
      researchers.push({
        _id: doc.id,
        ...doc.data()
      });
    });
    
    return res.status(200).json(researchers);
  } catch (error) {
    console.error('Error fetching researchers:', error);
    return res.status(500).json({ message: 'Server error while fetching researchers', error: error.message });
  }
};

// Get researcher by ID
exports.getResearcherById = async (req, res) => {
  try {
    const researcherId = req.params.id;
    const researcherDoc = await researchersCollection.doc(researcherId).get();
    
    if (!researcherDoc.exists) {
      return res.status(404).json({ message: 'Researcher not found' });
    }
    
    return res.status(200).json({
      _id: researcherDoc.id,
      ...researcherDoc.data()
    });
  } catch (error) {
    console.error('Error fetching researcher:', error);
    return res.status(500).json({ message: 'Server error while fetching researcher', error: error.message });
  }
};

// Create new researcher
exports.createResearcher = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { name, email, specialization, institution } = req.body;
    
    // Check if researcher with email already exists
    const emailCheck = await researchersCollection.where('email', '==', email).get();
    if (!emailCheck.empty) {
      return res.status(400).json({ message: 'Researcher with this email already exists' });
    }
    
    // Create new researcher document
    const newResearcher = {
      name,
      email,
      specialization: specialization || '',
      institution: institution || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await researchersCollection.add(newResearcher);
    
    return res.status(201).json({
      _id: docRef.id,
      ...newResearcher
    });
  } catch (error) {
    console.error('Error creating researcher:', error);
    return res.status(500).json({ message: 'Server error while creating researcher', error: error.message });
  }
};

// Update researcher
exports.updateResearcher = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const researcherId = req.params.id;
    const { name, email, specialization, institution } = req.body;
    
    // Check if researcher exists
    const researcherDoc = await researchersCollection.doc(researcherId).get();
    if (!researcherDoc.exists) {
      return res.status(404).json({ message: 'Researcher not found' });
    }
    
    // If email is changing, check if new email already exists
    if (email !== researcherDoc.data().email) {
      const emailCheck = await researchersCollection.where('email', '==', email).get();
      if (!emailCheck.empty) {
        return res.status(400).json({ message: 'Researcher with this email already exists' });
      }
    }
    
    // Update researcher
    const updatedResearcher = {
      name,
      email,
      specialization: specialization || '',
      institution: institution || '',
      updatedAt: new Date().toISOString()
    };
    
    await researchersCollection.doc(researcherId).update(updatedResearcher);
    
    return res.status(200).json({
      _id: researcherId,
      ...updatedResearcher,
      createdAt: researcherDoc.data().createdAt
    });
  } catch (error) {
    console.error('Error updating researcher:', error);
    return res.status(500).json({ message: 'Server error while updating researcher', error: error.message });
  }
};

// Delete researcher
exports.deleteResearcher = async (req, res) => {
  try {
    const researcherId = req.params.id;
    
    // Check if researcher exists
    const researcherDoc = await researchersCollection.doc(researcherId).get();
    if (!researcherDoc.exists) {
      return res.status(404).json({ message: 'Researcher not found' });
    }
    
    // Delete researcher
    await researchersCollection.doc(researcherId).delete();
    
    return res.status(200).json({ message: 'Researcher deleted successfully' });
  } catch (error) {
    console.error('Error deleting researcher:', error);
    return res.status(500).json({ message: 'Server error while deleting researcher', error: error.message });
  }
};

// Search researchers
exports.searchResearchers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    // Convert query to lowercase for case-insensitive search
    const searchQuery = query.toLowerCase();
    
    // Get all researchers (Firestore doesn't support direct text search)
    const researchersSnapshot = await researchersCollection.get();
    
    if (researchersSnapshot.empty) {
      return res.status(200).json([]);
    }
    
    // Filter researchers based on search query
    const researchers = [];
    researchersSnapshot.forEach(doc => {
      const researcher = doc.data();
      
      // Check if name, email, specialization, or institution contains the search query
      if (
        researcher.name.toLowerCase().includes(searchQuery) ||
        researcher.email.toLowerCase().includes(searchQuery) ||
        (researcher.specialization && researcher.specialization.toLowerCase().includes(searchQuery)) ||
        (researcher.institution && researcher.institution.toLowerCase().includes(searchQuery))
      ) {
        researchers.push({
          _id: doc.id,
          ...researcher
        });
      }
    });
    
    return res.status(200).json(researchers);
  } catch (error) {
    console.error('Error searching researchers:', error);
    return res.status(500).json({ message: 'Server error while searching researchers', error: error.message });
  }
};