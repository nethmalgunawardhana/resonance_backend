const { db } = require('../config/firebase');

exports.getResearchProjectByIdService = async (id) => {
    try {
      const docRef = db.collection('research').doc(id);
      const doc = await docRef.get();
  
      if (!doc.exists) return null;
        
      return { id: doc.id, ...doc.data() };
    } catch (error) {
      console.error('Service Error (getResearchProjectByIdService):', error);
      throw error;
    }
  };
  