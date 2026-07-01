// Vercel serverless function for API routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Import routes
const emailRoutes = require('../server/routes/email');
const clientRoutes = require('../server/routes/clients');
const templateRoutes = require('../server/routes/templates');

// Use routes
app.use('/api/email', emailRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/templates', templateRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email Blasting API is running' });
});

module.exports = app;
