const axios = require('axios');

exports.fetchResearcherInfo = async (name) => {
    const url = `https://api.openalex.org/authors?search=${encodeURIComponent(name)}`;
    const response = await axios.get(url);
    const results = response.data.results;

    if (!results.length) return nulll;

    const author = results[0];

    return {
        name: author.display_name,
        affiliation: author.last_known_institutions[0].display_name,
        works_count: author.works_count,
        citation_count: author.cited_by_count,
        orchid: author.orcid,
        openalex_id: author.id,
        summary: author.summary_stats,
        topics: author.topics.map(topic => topic.display_name),
    };
};