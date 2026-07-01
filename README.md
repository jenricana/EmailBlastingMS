# Email Blasting Pro 📧

A professional, modern email campaign manager with template support and client management.

## Features

✅ **One-Click Email Blasting** - Send personalized emails to all or selected clients instantly  
✅ **Template Management** - Create, save, and reuse email templates  
✅ **Client Management** - Add clients manually or import from CSV  
✅ **Variable Substitution** - Personalize emails with `{{name}}`, `{{company}}`, `{{position}}`, `{{email}}`  
✅ **Real-time Preview** - See how emails will look before sending  
✅ **Send Results Tracking** - Monitor successful and failed sends  
✅ **CSV Import/Export** - Bulk manage your client list  
✅ **Modern UI** - Beautiful, responsive interface built with React & TailwindCSS  

## Tech Stack

**Backend:**
- Node.js & Express
- Nodemailer (email sending)
- CSV parsing & file uploads

**Frontend:**
- React 18
- Vite (build tool)
- TailwindCSS (styling)
- Lucide React (icons)
- Axios (API calls)

## Installation

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Email Settings

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your email credentials:

```env
PORT=3001

# For Gmail (recommended - use App Password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Gmail Setup:**
1. Enable 2-Factor Authentication in your Google Account
2. Generate App Password at: https://myaccount.google.com/apppasswords
3. Use the generated password in `EMAIL_PASSWORD`

**Other Email Providers:**
- **Outlook:** `smtp-mail.outlook.com`, port 587
- **Yahoo:** `smtp.mail.yahoo.com`, port 587
- **Custom SMTP:** Use your provider's settings

### 3. Run the Application

**Development Mode (both frontend & backend):**
```bash
npm run dev
```

**Or run separately:**
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Usage Guide

### 1. Add Clients

**Manually:**
1. Go to "Client List" tab
2. Click "Add Client"
3. Fill in client details (name, email, company, position)
4. Click "Add Client"

**Bulk Import (CSV):**
1. Prepare a CSV file with columns: `name`, `email`, `company`, `position`
2. Click "Import CSV"
3. Select your file

**Example CSV format:**
```csv
name,email,company,position
John Doe,john@example.com,Acme Corp,CEO
Jane Smith,jane@example.com,TechStart,CTO
```

### 2. Create Email Templates

1. Go to "Templates" tab
2. Click "Create Template"
3. Enter template name, subject, and body
4. Use variables: `{{name}}`, `{{email}}`, `{{company}}`, `{{position}}`
5. Save template

**Example Template:**
```
Subject: Partnership Opportunity with {{company}}

Body:
<h2>Hello {{name}},</h2>
<p>I hope this email finds you well. I wanted to reach out regarding a potential partnership opportunity with {{company}}.</p>
<p>Best regards</p>
```

### 3. Send Email Campaign

1. Go to "Compose & Send" tab
2. Load a template (optional) or compose new email
3. Select recipients from the list (or click "Select All")
4. Preview your email
5. Send a test email to yourself first (recommended)
6. Click "Send to X Client(s)"

### 4. Track Results

After sending, view results showing:
- Total emails sent
- Successful sends
- Failed sends (with error details)

## Email Variables

Personalize your emails with these variables:

- `{{name}}` - Client's name
- `{{email}}` - Client's email
- `{{company}}` - Client's company
- `{{position}}` - Client's position

## API Endpoints

### Email Routes
- `POST /api/email/send` - Send bulk emails
- `POST /api/email/test` - Send test email
- `GET /api/email/config` - Get email configuration

### Client Routes
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Add new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `POST /api/clients/import` - Import clients from CSV

### Template Routes
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create template
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

## Troubleshooting

**Emails not sending:**
- Check `.env` configuration
- Verify email credentials are correct
- For Gmail, ensure you're using App Password, not regular password
- Check if "Less secure app access" is enabled (if not using App Password)

**Port already in use:**
- Change `PORT` in `.env` file
- Update proxy in `client/vite.config.js` to match

**CSV import not working:**
- Ensure CSV headers match: `name`, `email`, `company`, `position`
- Check file encoding is UTF-8
- Remove any special characters or formatting

## Project Structure

```
EmailBlasting/
├── server/
│   ├── index.js              # Express server
│   ├── routes/
│   │   ├── email.js          # Email sending routes
│   │   ├── clients.js        # Client management routes
│   │   └── templates.js      # Template routes
│   └── data/                 # JSON storage (auto-created)
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── App.jsx          # Main app component
│   │   └── index.css        # Global styles
│   └── package.json
├── .env                      # Environment configuration
├── package.json              # Root package.json
└── README.md
```

## Security Notes

⚠️ **Important:**
- Never commit `.env` file to version control
- Use App Passwords for Gmail (not main account password)
- Keep email credentials secure
- This app stores data in local JSON files - consider database for production
- Implement rate limiting for production use

## License

MIT License - Free to use and modify

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify your email configuration
3. Test with a single client first
4. Review server logs for errors

---

Built with ❤️ for efficient email campaigns
