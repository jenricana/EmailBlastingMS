const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');
const templatesFile = path.join(dataDir, 'templates.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const loadTemplates = () => {
  if (fs.existsSync(templatesFile)) {
    return JSON.parse(fs.readFileSync(templatesFile, 'utf8'));
  }
  return [];
};

const saveTemplates = (templates) => {
  fs.writeFileSync(templatesFile, JSON.stringify(templates, null, 2));
};

router.get('/', (req, res) => {
  const templates = loadTemplates();
  res.json(templates);
});

router.post('/', (req, res) => {
  const templates = loadTemplates();
  const newTemplate = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };
  templates.push(newTemplate);
  saveTemplates(templates);
  res.json(newTemplate);
});

router.put('/:id', (req, res) => {
  const templates = loadTemplates();
  const index = templates.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    templates[index] = { ...templates[index], ...req.body, updatedAt: new Date().toISOString() };
    saveTemplates(templates);
    res.json(templates[index]);
  } else {
    res.status(404).json({ error: 'Template not found' });
  }
});

router.delete('/:id', (req, res) => {
  const templates = loadTemplates();
  const filtered = templates.filter(t => t.id !== req.params.id);
  saveTemplates(filtered);
  res.json({ message: 'Template deleted' });
});

module.exports = router;
