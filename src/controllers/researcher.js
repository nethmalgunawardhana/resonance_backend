const { fetchResearcherInfo, fetchResearchWorks } = require('../services/openalex');

exports.getResearcher = async (req, res) => {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Name parameter is required' });

    try {
        const researcherInfo = await fetchResearcherInfo(name);
        if (!researcherInfo) return res.status(404).json({ error: 'Researcher not found' });


        const works = await fetchResearchWorks(researcherInfo.works_api_url);
        console.log('Research Works:', works);
        res.status(200).json(researcherInfo);
    }
    catch (error) {
        console.error('Error fetching researcher info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};