const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

const dataDir = path.join(__dirname, '../data');
const clientsFile = path.join(dataDir, 'clients.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const loadClients = () => {
  if (fs.existsSync(clientsFile)) {
    return JSON.parse(fs.readFileSync(clientsFile, 'utf8'));
  }
  return [];
};

const saveClients = (clients) => {
  fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
};

router.get('/', (req, res) => {
  const clients = loadClients();
  res.json(clients);
});

router.post('/', (req, res) => {
  const clients = loadClients();
  const newClient = {
    id: Date.now().toString(),
    ...req.body,
    status: req.body.status || 'Pending',
    createdAt: new Date().toISOString(),
  };
  clients.push(newClient);
  saveClients(clients);
  res.json(newClient);
});

router.put('/:id', (req, res) => {
  const clients = loadClients();
  const index = clients.findIndex(c => c.id === req.params.id);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...req.body };
    saveClients(clients);
    res.json(clients[index]);
  } else {
    res.status(404).json({ error: 'Client not found' });
  }
});

router.delete('/:id', (req, res) => {
  const clients = loadClients();
  const filtered = clients.filter(c => c.id !== req.params.id);
  saveClients(filtered);
  res.json({ message: 'Client deleted' });
});

// Unsubscribe endpoint - handles unsubscribe requests
router.get('/unsubscribe/:token', (req, res) => {
  try {
    const { token } = req.params;
    // Token is base64 encoded email
    const email = Buffer.from(token, 'base64').toString('utf8');
    
    const clients = loadClients();
    const clientIndex = clients.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (clientIndex !== -1) {
      clients[clientIndex].subscribed = false;
      clients[clientIndex].unsubscribedAt = new Date().toISOString();
      saveClients(clients);
      
      // Return a simple HTML page confirming unsubscribe
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Unsubscribed</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
            .container { text-align: center; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            p { color: #666; }
            .checkmark { font-size: 48px; color: #4CAF50; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="checkmark">✓</div>
            <h1>Successfully Unsubscribed</h1>
            <p>You have been removed from our mailing list.</p>
            <p>You will no longer receive emails from us.</p>
          </div>
        </body>
        </html>
      `);
    } else {
      res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Not Found</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
            .container { text-align: center; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            p { color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Email Not Found</h1>
            <p>This email address was not found in our system.</p>
          </div>
        </body>
        </html>
      `);
    }
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

// Resubscribe endpoint
router.get('/resubscribe/:token', (req, res) => {
  try {
    const { token } = req.params;
    const email = Buffer.from(token, 'base64').toString('utf8');
    
    const clients = loadClients();
    const clientIndex = clients.findIndex(c => c.email.toLowerCase() === email.toLowerCase());
    
    if (clientIndex !== -1) {
      clients[clientIndex].subscribed = true;
      clients[clientIndex].resubscribedAt = new Date().toISOString();
      saveClients(clients);
      
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resubscribed</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f5f5f5; }
            .container { text-align: center; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            p { color: #666; }
            .checkmark { font-size: 48px; color: #4CAF50; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="checkmark">✓</div>
            <h1>Successfully Resubscribed</h1>
            <p>You have been added back to our mailing list.</p>
          </div>
        </body>
        </html>
      `);
    } else {
      res.status(404).send('Email not found');
    }
  } catch (error) {
    res.status(500).send('An error occurred');
  }
});

router.post('/import', upload.single('file'), (req, res) => {
  const results = [];
  
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      results.push({
        id: Date.now().toString() + Math.random(),
        name: data.name || data.Name || '',
        email: data.email || data.Email || data['Email Address'] || '',
        company: data.company || data.Company || '',
        position: data.position || data.Position || '',
        day: data.day || data.Day || '',
        scheduleTime: data.scheduleTime || data['Schedule Time'] || '',
        arrivalTime: data.arrivalTime || data.Time || data['Arrival Time'] || '',
        status: data.status || data.Status || 'Pending',
        createdAt: new Date().toISOString(),
      });
    })
    .on('end', () => {
      const clients = loadClients();
      const updated = [...clients, ...results];
      saveClients(updated);
      
      fs.unlinkSync(req.file.path);
      
      res.json({ 
        message: `Imported ${results.length} clients`,
        clients: results 
      });
    })
    .on('error', (error) => {
      res.status(500).json({ error: error.message });
    });
});

module.exports = router;
