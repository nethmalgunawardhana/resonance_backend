const { fetchArxivPapers } = require('../services/arxiv.service');

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

module.exports = { getPublishedPapers };