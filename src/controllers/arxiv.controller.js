const { fetchArxivPapers } = require('../services/arxiv.service');
const { db } = require('../config/firebase');

const getPublishedPapers = async (req, res) => {
  try {
    const category = req.query.category || 'Artificial Intelligence';
    const maxResults = req.query.maxResults || 10;

    const papers = await fetchArxivPapers(category, maxResults);
    res.json(papers);
  } catch (error) {
    console.error('Error in getPublishedPapers:', error);
    res.status(500).json({ error: 'Failed to fetch published papers' });
  }
};

const getLocalPapersResearcher = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching local papers for researcher ID:', id);

    const snapshot = await db.collection('research').where('createdBy', '==', id).get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'No local papers found for this researcher' });
    }

    const papers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(papers);
  } catch (error) {
    console.error('Error fetching local papers:', error);
    res.status(500).json({ error: 'Failed to fetch local papers' });
  }
}


module.exports = { getPublishedPapers, getLocalPapersResearcher };