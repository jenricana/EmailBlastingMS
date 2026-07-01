// Vercel catch-all serverless function
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Import routes
const emailRoutes = require('../server/routes/email');
const clientRoutes = require('../server/routes/clients');
const templateRoutes = require('../server/routes/templates');

// Mount routes
app.use('/email', emailRoutes);
app.use('/clients', clientRoutes);
app.use('/templates', templateRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Export handler for Vercel
module.exports = app;
