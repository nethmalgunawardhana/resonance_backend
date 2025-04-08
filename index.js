const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const { errorHandler } = require('./src/middleware/errorHandler');

const routes = require('./src/routes/index');
const researcherRoutes = require('./src/routes/researcher');
const arxivRoutes = require('./src/routes/arxiv.route');
const projectRoutes = require('./src/routes/research.route');


// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);
app.use('/api/alex/researchers', researcherRoutes);
app.use('/api/research', projectRoutes);
app.use('/api', arxivRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;