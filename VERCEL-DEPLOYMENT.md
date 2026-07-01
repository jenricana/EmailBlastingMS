# Vercel Deployment Guide - Email Blasting Pro

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be in a GitHub repository
2. **Vercel Account** - Sign up at https://vercel.com (free tier available)
3. **Gmail App Password** - Already created (for SMTP)

---

## 🚀 Step-by-Step Deployment

### Step 1: Push Code to GitHub

1. **Initialize Git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Email Blasting Pro"
   ```

2. **Create GitHub Repository**:
   - Go to https://github.com/new
   - Name: `email-blasting-pro`
   - Make it **Private** (contains sensitive email app)
   - Don't initialize with README (you already have files)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/email-blasting-pro.git
   git branch -M main
   git push -u origin main
   ```

---

### Step 2: Deploy to Vercel

1. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/dashboard
   - Click **"Add New..."** → **"Project"**

2. **Import GitHub Repository**:
   - Click **"Import Git Repository"**
   - Select `email-blasting-pro`
   - Click **"Import"**

3. **Configure Project**:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

4. **Click "Deploy"** (don't worry about environment variables yet)

---

### Step 3: Configure Environment Variables

After initial deployment, go to your project settings:

1. **In Vercel Dashboard**:
   - Go to your project
   - Click **"Settings"** tab
   - Click **"Environment Variables"** in sidebar

2. **Add these variables** (one by one):

   | Variable Name | Value | Description |
   |--------------|-------|-------------|
   | `PORT` | `3001` | Backend server port |
   | `EMAIL_HOST` | `smtp.gmail.com` | Gmail SMTP server |
   | `EMAIL_PORT` | `587` | SMTP port |
   | `EMAIL_SECURE` | `false` | TLS setting |
   | `EMAIL_USER` | `mastersparklescleaning@gmail.com` | Your Gmail address |
   | `EMAIL_PASSWORD` | `scdaywbtgmexnzby` | Your Gmail App Password |

3. **For each variable**:
   - Click **"Add New"**
   - Enter **Key** (e.g., `EMAIL_HOST`)
   - Enter **Value** (e.g., `smtp.gmail.com`)
   - Select **Production, Preview, Development** (all environments)
   - Click **"Save"**

---

### Step 4: Redeploy with Environment Variables

1. **Go to "Deployments" tab**
2. Click **"..." menu** on latest deployment
3. Click **"Redeploy"**
4. Check **"Use existing Build Cache"** = OFF
5. Click **"Redeploy"**

---

## 🔧 Important Notes

### File Upload Limitations

**⚠️ Vercel Serverless Functions have limitations:**
- Max request size: **4.5 MB** (body + files)
- Execution timeout: **10 seconds** (Hobby plan)
- No persistent file storage

**Workaround for Email Attachments:**
- The signature images (logo.png, logo2.png, image_signature.png) are embedded via CID
- These are read from the repository and sent with emails
- ✅ This works on Vercel!

**For user-uploaded attachments:**
- Current implementation stores files in `uploads/` folder
- ❌ This won't persist on Vercel (serverless environment)
- **Solution**: Use cloud storage like:
  - AWS S3
  - Cloudinary
  - Vercel Blob Storage

---

## 🌐 Access Your Deployed App

After deployment completes:

1. **Vercel will provide a URL**: `https://your-app-name.vercel.app`
2. **Visit the URL** to access your Email Blasting Pro app
3. **Test the functionality**:
   - Add clients
   - Create templates
   - Insert signature (should work!)
   - Send test email

---

## 🐛 Troubleshooting

### Issue: "500 Internal Server Error"

**Check Vercel Logs**:
1. Go to Vercel Dashboard → Your Project
2. Click **"Deployments"** tab
3. Click on latest deployment
4. Click **"Functions"** tab
5. Look for error messages

**Common fixes**:
- Verify all environment variables are set correctly
- Check EMAIL_PASSWORD has no spaces: `scdaywbtgmexnzby`
- Ensure Gmail App Password is still valid

### Issue: "Client data not persisting"

**Expected behavior on Vercel**:
- `server/data/clients.json` and `server/data/templates.json` won't persist between deployments
- Changes are stored in memory only during that session
- **Solution**: Add database integration:
  - MongoDB Atlas (free tier)
  - PostgreSQL on Vercel
  - Supabase (free tier)

### Issue: "Images not displaying in emails"

**Check**:
- `logo2.png` and `image_signature.png` are committed to Git
- Files are in root directory `d:\MS\EmailBlasting\`
- Vercel has access to these files in repository

---

## 🔐 Security Best Practices

### After Deployment:

1. **Keep repository Private**
   - Never make it public (contains email credentials path)

2. **Use Environment Variables**
   - ✅ Email credentials are in Vercel env vars (secure)
   - ❌ Never commit `.env` file to Git

3. **Rotate Gmail App Password**
   - If repository is ever exposed, generate new App Password
   - Update `EMAIL_PASSWORD` in Vercel settings

---

## 🎯 Next Steps (Optional Improvements)

### 1. Add Database for Persistence
```bash
# Install MongoDB
npm install mongodb mongoose
```

### 2. Add User Authentication
```bash
# Install auth libraries
npm install bcryptjs jsonwebtoken
```

### 3. Custom Domain
- In Vercel Dashboard → Settings → Domains
- Add your custom domain (e.g., `emails.mastersparkles.com`)

---

## 📞 Support

If deployment fails:

1. **Check Vercel Build Logs** (detailed errors)
2. **Verify all environment variables** are set
3. **Test locally first**: `npm run dev`
4. **Check this guide** for common issues

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub (private repository)
- [ ] Vercel project created and linked to GitHub repo
- [ ] All 6 environment variables added in Vercel
- [ ] Redeployed with new environment variables
- [ ] Tested deployed app at Vercel URL
- [ ] Verified emails send successfully
- [ ] Signature images display in sent emails

**Your Email Blasting Pro is now live! 🚀**
