# Inline Image/Flyer Embedding Guide 📸

## How to Embed Images Directly in Email Body

Your app now supports **inline image embedding** - images appear directly in the email body (like your Master Sparkle's flyer example), not as downloadable attachments.

## Quick Start

### Method 1: Using Email Composer

1. Go to **"Compose & Send"** tab
2. Write your email subject and initial text
3. Click **"📷 Insert Image/Flyer"** button (above the message body)
4. Select your flyer/image (JPG, PNG, etc.)
5. Image will be automatically embedded in the HTML
6. Continue writing text before or after the image
7. Click **Preview** to see how it looks
8. Send to your clients!

### Method 2: Using Templates

1. Go to **"Templates"** tab
2. Click **"Create Template"**
3. Enter template name and subject
4. Click **"📷 Insert Image/Flyer"** button
5. Select your image
6. Save template for reuse
7. Load template when composing emails

## How It Works

**Base64 Encoding:**
- Images are converted to base64 and embedded directly in HTML
- No external links - image is part of the email itself
- Recipients see the image immediately when opening email
- Works in all email clients (Gmail, Outlook, etc.)

**Example Output:**
```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANS..." 
     alt="flyer.png" 
     style="max-width: 100%; height: auto;" />
```

## Sample Marketing Email with Embedded Flyer

**Subject:** 🌟 Master Sparkle's - Did You Know We Also Offer?

**Body:**
```html
<p>Hi {{name}},</p>

<p>We're excited to share our complete range of cleaning services with you!</p>

[📷 INSERT FLYER IMAGE HERE]

<p>As you can see from our services menu above, we offer:</p>
<ul>
  <li>Carpet & Steam Cleaning</li>
  <li>Window Cleaning</li>
  <li>Tile & Grout Cleaning</li>
  <li>And many more professional services!</li>
</ul>

<p><strong>Bundle & Save Time!</strong> Book multiple services together for the best value.</p>

<p>Ready to book? Reply to this email or call us at 0494 265 152</p>

<p>Thank you!</p>
```

## Tips for Best Results

### Image Preparation
- ✅ **Recommended size:** 600-800px width (optimized for email)
- ✅ **File format:** JPG or PNG
- ✅ **File size:** Keep under 500 KB (faster loading)
- ✅ **Compress images:** Use tools like TinyPNG before uploading

### Design Tips
- 📱 **Mobile-friendly:** Images auto-resize to fit screen
- 🎨 **Professional:** Use high-quality branded flyers
- 📊 **Clear text:** Ensure text in image is readable
- 🔍 **Test first:** Always preview and send test email

### Email Structure
```
[Opening greeting]
Hi {{name}},

[Brief intro text]
We're excited to share...

[EMBEDDED IMAGE/FLYER]

[Supporting text]
As you can see above...

[Call to action]
Book now!

[Closing]
Thank you!
```

## Inline Images vs Attachments

| Feature | Inline Images | Attachments |
|---------|--------------|-------------|
| **Visibility** | Shows immediately in email | Must be downloaded |
| **User action** | No action needed | Click to download |
| **Marketing impact** | High - visual impact | Low - extra step |
| **Best for** | Flyers, menus, photos | Documents, PDFs |
| **Email size** | Embedded in HTML | Separate files |

## Best Practices

### ✅ DO:
- Embed promotional flyers and service menus
- Use for visual marketing materials
- Keep images under 500 KB each
- Test on mobile devices
- Preview before sending

### ❌ DON'T:
- Embed too many large images (slows email)
- Use for documents that need downloading
- Exceed 1-2 images per email
- Forget to compress images first
- Skip the preview step

## Technical Details

**Image Processing:**
1. Upload image through UI
2. Backend converts to base64
3. Generates `data:image/...;base64,...` URI
4. Inserts as `<img>` tag in HTML
5. Temporary file deleted after conversion
6. Email sent with embedded image

**Compatibility:**
- ✅ Gmail - Full support
- ✅ Outlook - Full support  
- ✅ Apple Mail - Full support
- ✅ Yahoo Mail - Full support
- ✅ Mobile clients - Auto-resize

## Example Use Cases

### 1. Service Menu Campaign
**Upload:** Master Sparkle's services flyer
**Result:** All clients see your complete service offerings immediately

### 2. Before/After Gallery
**Upload:** Before/after cleaning photos
**Result:** Visual proof of your quality work

### 3. Seasonal Promotion
**Upload:** Holiday promotion flyer
**Result:** Eye-catching promotional material

### 4. New Service Launch
**Upload:** New service announcement graphic
**Result:** Professional service introduction

## Troubleshooting

**"Image too large"**
- Compress image before uploading
- Recommended: Use TinyPNG.com or similar
- Target: 200-500 KB per image

**"Image not showing in preview"**
- Check browser console for errors
- Try different image format (PNG vs JPG)
- Refresh the page

**"Email stuck in spam"**
- Don't use too many images
- Keep total email size under 1 MB
- Include sufficient text content
- Avoid spam trigger words

**"Image looks pixelated"**
- Upload higher resolution image
- Recommended: 600-800px width
- Use PNG for graphics/text
- Use JPG for photos

## Quick Workflow

1. **Prepare** - Design flyer in Canva/Photoshop
2. **Compress** - Reduce file size (TinyPNG)
3. **Upload** - Click "📷 Insert Image/Flyer"
4. **Compose** - Add text around image
5. **Preview** - Check appearance
6. **Test** - Send to yourself first
7. **Blast** - Send to all clients!

---

**Ready to send visually stunning marketing emails?** Go to the app and click "📷 Insert Image/Flyer"! 🚀
