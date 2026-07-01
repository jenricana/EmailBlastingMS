# Marketing Campaign Email Guide 📧

## Sending Email Campaigns with Attachments

Your email blasting app now supports **attachments** for marketing campaigns like flyers, menus, photos, and PDFs.

## How to Send Marketing Emails with Attachments

### Step 1: Prepare Your Materials
- **Flyers** - PNG, JPG, or PDF format
- **Menus** - PDF or image files
- **Photos** - JPG, PNG (service photos, before/after, etc.)
- **Documents** - PDF, DOCX

### Step 2: Import Your Client List
1. Go to **Client List** tab
2. Click **Import CSV** to bulk import all clients
3. Or add clients manually one by one

### Step 3: Compose Your Campaign Email
1. Go to **Compose & Send** tab
2. Write your subject line (e.g., "New Cleaning Services Menu!")
3. Compose your email body (supports HTML)
4. **Click "Add Attachments"** button
5. Select your flyer/menu/photos (can select multiple files)
6. Files will appear below with size information

### Step 4: Select Recipients
- Click **Select All** to send to all clients
- Or click individual clients to select specific recipients
- You can filter by status (Pending/Sent/Failed)

### Step 5: Preview & Send
1. Click **Preview** to see how the email looks
2. Click **Send Test** to send yourself a test first (recommended!)
3. Click **Send to X Client(s)** to blast to all selected recipients
4. Watch real-time results (Sent/Failed)

## Supported File Types

✅ **Images:** .jpg, .jpeg, .png, .gif, .webp  
✅ **Documents:** .pdf, .doc, .docx  
✅ **Maximum file size:** 10 MB per file  
✅ **Multiple attachments:** Up to 10 files per email  

## Sample Marketing Email Template

**Subject:** 🌟 Our New Cleaning Services Menu is Here!

**Body:**
```html
<h2>Hi {{name}},</h2>

<p>We're excited to share our updated cleaning services menu with you!</p>

<p>Check out the attached flyer to see:</p>
<ul>
  <li>New service packages</li>
  <li>Special promotions</li>
  <li>Updated pricing</li>
</ul>

<p><strong>🎁 Special Offer:</strong> Book now and get 15% off your first service!</p>

<p>Questions? Just reply to this email or call us.</p>

<p>Best regards,<br>
Your Cleaning Team</p>

<p style="font-size: 11px; color: #888;">
Love our service? Leave a <a href="https://g.page/r/CdJ0DLlOznlAEBM/review">5-star review</a> 
and get $15 off your next clean!
</p>
```

**Attachments:**
- Cleaning Services Menu.pdf
- Before-After-Photos.jpg
- Special-Promo-Flyer.png

## Tips for Effective Marketing Campaigns

### 📸 Images
- Use high-quality photos (but compress to < 1 MB)
- Show before/after results
- Display your team and equipment

### 📄 PDFs
- Keep PDFs under 2-3 MB
- Make text readable on mobile devices
- Include your logo and contact info

### ✉️ Email Body
- Keep it concise and scannable
- Use bullet points
- Include clear call-to-action
- Personalize with {{name}} variable

### 🎯 Best Practices
- **Always send a test first** - Check how attachments look
- **Check spam filters** - Too many/large attachments may trigger spam
- **Mobile-friendly** - Most people read emails on phones
- **Track results** - Note which campaigns get best response
- **Timing** - Send Tuesday-Thursday, 9 AM - 11 AM for best open rates

## Attachment Size Recommendations

| File Type | Recommended Size | Maximum |
|-----------|-----------------|---------|
| Flyer PDF | 500 KB - 1 MB | 3 MB |
| Photo JPG | 200 KB - 500 KB | 2 MB |
| Menu PDF | 500 KB - 1.5 MB | 3 MB |
| Multiple files | Total < 5 MB | 10 MB |

## Troubleshooting

**"Upload failed"**
- Check file is < 10 MB
- Ensure file type is supported
- Try again with fewer files

**"Some emails failed to send"**
- Large attachments may cause failures
- Check internet connection
- Verify email settings in .env
- Review failed emails in results panel

**"Emails going to spam"**
- Avoid too many attachments (max 2-3)
- Keep total size under 5 MB
- Don't use spam trigger words
- Ensure email is properly configured with DKIM/SPF

## Example Campaigns

### Campaign 1: New Service Launch
- **Attachments:** Service-Menu.pdf, Team-Photo.jpg
- **Subject:** Introducing Our New Deep Cleaning Service!
- **Recipients:** All active clients

### Campaign 2: Seasonal Promotion
- **Attachments:** Spring-Promo-Flyer.png
- **Subject:** 🌸 Spring Cleaning Special - 20% Off!
- **Recipients:** Clients who haven't booked in 3 months

### Campaign 3: Customer Appreciation
- **Attachments:** Before-After-Gallery.pdf, Thank-You-Card.jpg
- **Subject:** Thank You for Being an Amazing Client!
- **Recipients:** Top 50 loyal clients

---

**Ready to blast your marketing campaign?** Open the app and start uploading your materials! 🚀
