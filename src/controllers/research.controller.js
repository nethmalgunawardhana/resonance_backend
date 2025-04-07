const { db, admin } = require('../config/firebase');
const { getResearchProjectByIdService } = require('../services/research.service');


exports.getResearchProjects = async (req, res) => {
  try {
    const snapshot = await db.collection('research').get();
    const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.getResearchProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const projectRef = db.collection('research').doc(id);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Increment the view count
    await projectRef.update({
      views: admin.firestore.FieldValue.increment(1),
    });

    const project = { id: projectDoc.id, ...projectDoc.data() };
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};
