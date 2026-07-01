// Vercel serverless function for API routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Import routes
const emailRoutes = require('../server/routes/email');
const clientRoutes = require('../server/routes/clients');
const templateRoutes = require('../server/routes/templates');

// Use routes (without /api prefix since Vercel handles that)
app.use('/email', emailRoutes);
app.use('/clients', clientRoutes);
app.use('/templates', templateRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email Blasting API is running' });
});

// Export for Vercel serverless
module.exports = app;
