const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const emailRoutes = require('./routes/email');
const clientRoutes = require('./routes/clients');
const templateRoutes = require('./routes/templates');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// API routes
app.use('/api/email', emailRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/templates', templateRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email Blasting API is running' });
});

// Serve static files from React build
const clientBuildPath = path.join(__dirname, '../client/dist');
console.log('Serving static files from:', clientBuildPath);

app.use(express.static(clientBuildPath));

// Handle React routing - return index.html for all non-API routes
app.get('*', (req, res) => {
  const indexPath = path.join(clientBuildPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`Static files directory: ${clientBuildPath}`);
});
