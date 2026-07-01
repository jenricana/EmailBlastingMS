const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/attachments';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const replaceVariables = (text, client) => {
  return text
    .replace(/\{\{name\}\}/g, client.name || '')
    .replace(/\{\{email\}\}/g, client.email || '')
    .replace(/\{\{company\}\}/g, client.company || '')
    .replace(/\{\{position\}\}/g, client.position || '')
    .replace(/\{\{day\}\}/g, client.day || '')
    .replace(/\{\{arrivalTime\}\}/g, client.arrivalTime || '')
    .replace(/\{\{scheduleTime\}\}/g, client.scheduleTime || '');
};

const formatEmailBody = (body) => {
  // Convert all newlines to <br> tags, even in HTML content
  // This ensures plain text portions get proper line breaks
  let formatted = body.replace(/\n/g, '<br>');
  
  // Wrap in proper HTML structure for better email client compatibility
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
  <div style="max-width: 600px;">
    ${formatted}
  </div>
</body>
</html>`;
};

router.post('/send', async (req, res) => {
  try {
    const { clients, subject, body, from, updateStatus, attachments } = req.body;

    if (!clients || clients.length === 0) {
      return res.status(400).json({ error: 'No clients selected' });
    }

    const transporter = createTransporter();
    
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError.message);
      return res.status(500).json({ 
        error: 'Email server connection failed. Check your .env file settings.',
        details: verifyError.message 
      });
    }
    
    const results = [];

    const emailAttachments = attachments ? JSON.parse(attachments).map(att => ({
      filename: att.filename,
      path: att.path
    })) : [];

    for (const client of clients) {
      try {
        const personalizedSubject = replaceVariables(subject, client);
        let personalizedBody = replaceVariables(body, client);
        personalizedBody = formatEmailBody(personalizedBody);

        const mailOptions = {
          from: from || process.env.EMAIL_USER,
          to: client.email,
          subject: personalizedSubject,
          html: personalizedBody,
          attachments: []
        };

        // Add signature images as CID attachments if signature is present
        const logoPath = path.join(__dirname, '../../logo2.png');
        const signaturePath = path.join(__dirname, '../../image_signature.png');
        
        console.log('Logo path:', logoPath, 'Exists:', fs.existsSync(logoPath));
        console.log('Signature path:', signaturePath, 'Exists:', fs.existsSync(signaturePath));
        console.log('Body includes cid:logo:', personalizedBody.includes('cid:logo'));
        console.log('Body includes cid:signature:', personalizedBody.includes('cid:signature'));
        
        if (personalizedBody.includes('cid:logo') && fs.existsSync(logoPath)) {
          mailOptions.attachments.push({
            filename: 'logo.png',
            path: logoPath,
            cid: 'logo'
          });
          console.log('Added logo as CID attachment');
        }
        
        if (personalizedBody.includes('cid:signature') && fs.existsSync(signaturePath)) {
          mailOptions.attachments.push({
            filename: 'signature.png',
            path: signaturePath,
            cid: 'signature'
          });
          console.log('Added signature image as CID attachment');
        }

        // Add regular file attachments
        if (emailAttachments.length > 0) {
          mailOptions.attachments = mailOptions.attachments.concat(emailAttachments);
        }

        await transporter.sendMail(mailOptions);

        const sentTime = new Date().toISOString();
        results.push({
          clientId: client.id,
          email: client.email,
          status: 'sent',
          name: client.name,
          sentTime: sentTime,
        });
      } catch (error) {
        console.error(`Failed to send to ${client.email}:`, error.message);
        console.error('Error details:', error);
        results.push({
          clientId: client.id,
          email: client.email,
          status: 'failed',
          error: error.message,
          name: client.name,
        });
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length;
    const failCount = results.filter(r => r.status === 'failed').length;

    res.json({
      message: `Sent ${successCount} emails, ${failCount} failed`,
      results,
      summary: { total: clients.length, success: successCount, failed: failCount },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/test', async (req, res) => {
  try {
    const { to, subject, body, from } = req.body;
    const transporter = createTransporter();

    await transporter.sendMail({
      from: from || process.env.EMAIL_USER,
      to,
      subject,
      html: body,
    });

    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/upload-attachments', upload.array('attachments', 10), (req, res) => {
  try {
    const files = req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    }));
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/upload-inline-image', upload.single('image'), (req, res) => {
  try {
    const file = req.file;
    const imageBuffer = fs.readFileSync(file.path);
    const base64Image = imageBuffer.toString('base64');
    const dataUri = `data:${file.mimetype};base64,${base64Image}`;
    
    fs.unlinkSync(file.path);
    
    res.json({
      filename: file.originalname,
      dataUri: dataUri,
      size: file.size,
      mimetype: file.mimetype
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/delete-attachment', (req, res) => {
  try {
    const { filePath } = req.body;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Attachment deleted' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/signature', (req, res) => {
  try {
    const logoPath = path.join(__dirname, '../../logo2.png');
    const signaturePath = path.join(__dirname, '../../image_signature.png');
    
    let logoBase64 = '';
    let signatureBase64 = '';
    
    if (fs.existsSync(logoPath)) {
      const logoBuffer = fs.readFileSync(logoPath);
      logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    }
    
    if (fs.existsSync(signaturePath)) {
      const signatureBuffer = fs.readFileSync(signaturePath);
      signatureBase64 = `data:image/png;base64,${signatureBuffer.toString('base64')}`;
    }
    
    const signatureHtml = `<br><br>Thank you for your continued support. We look forward to helping you with all your cleaning needs.<br><br><strong>Kind Regards,</strong><br><br><strong>Master Sparkle's Cleaning Service</strong><br>📞 0424 262 152<br>📱 0483 969 620<br>✉️ <a href="mailto:mastersparklescleaning@gmail.com" style="color: #1155cc;">mastersparklescleaning@gmail.com</a><br><br><em>One Company. Every Cleaning Solution.</em><br><br><img src="cid:logo" alt="Master Sparkle's Logo" style="max-width: 150px; height: auto;" /><br><br><img src="cid:signature" alt="Master Sparkle's Services" style="max-width: 300px; width: 100%; height: auto;" />`;
    
    res.json({ 
      html: signatureHtml,
      logoBase64,
      signatureBase64
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-status', async (req, res) => {
  try {
    const { results } = req.body;
    const clientsFile = path.join(__dirname, '../data/clients.json');
    
    if (fs.existsSync(clientsFile)) {
      const clients = JSON.parse(fs.readFileSync(clientsFile, 'utf8'));
      
      results.forEach(result => {
        const clientIndex = clients.findIndex(c => c.id === result.clientId);
        if (clientIndex !== -1) {
          clients[clientIndex].status = result.status === 'sent' ? 'Sent' : 'Failed';
          clients[clientIndex].sentTime = result.sentTime || new Date().toISOString();
        }
      });
      
      fs.writeFileSync(clientsFile, JSON.stringify(clients, null, 2));
      res.json({ message: 'Status updated successfully' });
    } else {
      res.status(404).json({ error: 'Clients file not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/config', (req, res) => {
  res.json({
    configured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
    from: process.env.EMAIL_USER,
  });
});

module.exports = router;
