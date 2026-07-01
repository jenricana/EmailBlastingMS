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
