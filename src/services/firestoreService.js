const { db } = require('../config/firebase');

exports.getRelevantResearchData = async (query) => {
  try {
    // Get all documents from researchProjects collection
    const projectsSnapshot = await db.collection('research').get();
    
    if (projectsSnapshot.empty) {
      console.log('No research projects found');
      return [];
    }
    
    // Convert to array of data
    const projects = [];
    projectsSnapshot.forEach(doc => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
   
    return projects;
  } catch (error) {
    console.error('Error fetching research data:', error);
    throw error;
  }
};