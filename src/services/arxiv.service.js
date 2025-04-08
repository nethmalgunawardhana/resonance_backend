const axios = require('axios');
const xml2js = require('xml2js');

const arxivCategories = {
  'Artificial Intelligence': 'cs.AI',
  'Computer Vision': 'cs.CV',
  'Robotics': 'cs.RO',
  'Machine Learning': 'cs.LG',
  'Bioinformatics': 'q-bio.BM',
  'Econometrics': 'econ.EM',
  'Economics': 'econ.GN',
  'Game Theory': 'cs.GT',
    'Statistics': 'stat.ML',
    'Algebraic Geometry': 'math.AG',
    'Number Theory': 'math.NT',
    'Combinatorics': 'math.CO',
    'Graph Theory': 'math.GR',
    'Accelerator Physics': 'physics.acc-ph',
    'Astrophysics': 'astro-ph',
    'Condensed Matter': 'cond-mat',
    'Quantum Physics': 'quant-ph',
    'High Energy Physics': 'hep-th',
    'Nuclear Physics': 'nucl-th',
};

const fetchArxivPapers = async (category, maxResults) => {
  const arxivCategory = arxivCategories[category];
  console.log(arxivCategory);

  const url = `http://export.arxiv.org/api/query?search_query=cat:${arxivCategory}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;

  const response = await axios.get(url);
  const result = await xml2js.parseStringPromise(response.data, { explicitArray: false });
  const entries = result.feed.entry;

  if (!entries) return "No papers found";

  const papers = Array.isArray(entries) ? entries : [entries];
  return papers.map((paper) => ({
    title: paper.title.trim(),
    authors: Array.isArray(paper.author)
      ? paper.author.map((a) => a.name).join(', ')
      : paper.author.name,
    summary: paper.summary.trim(),
    published: paper.published,
    link: paper.id,
    pdfLink: paper.link.find((l) => l.$.type === 'application/pdf')?.$.href || paper.id,
  }));
};

module.exports = { fetchArxivPapers };