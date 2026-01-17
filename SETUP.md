# Kamel Kross E-Commerce Setup Guide

This is a static e-commerce site that runs entirely on HTML, CSS, and JavaScript. Perfect for hosting on GitHub Pages.

## Quick Start

1. Configure your Google Sheet (products database)
2. Set up Paystack
3. Update `js/config.js` with your credentials
4. Deploy to GitHub Pages

---

## 1. Google Sheets Setup (Product Database)

### Create Your Product Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it something like "Kamel Kross Products"
3. Create the following columns in **Row 1** (exact names required):

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| `id` | Yes | Unique product ID | `tshirt-001` |
| `name` | Yes | Product name | `Classic Logo Tee` |
| `description` | No | Product description | `Premium cotton t-shirt...` |
| `price` | Yes | Price in Naira (number only) | `15000` |
| `shipping` | No | Shipping cost per item | `2000` |
| `category` | Yes | Product category | `T-Shirts` or `Caps` |
| `sizes` | No | Comma-separated sizes | `S,M,L,XL,XXL` |
| `colors` | No | Comma-separated colors | `Black,White,Navy` |
| `image` | Yes | Main product image URL | Google Drive link |
| `images` | No | Additional images (comma-separated) | More Google Drive links |
| `in_stock` | No | Is product available? | `yes` or `no` |
| `featured` | No | Show on homepage? | `yes` or `no` |

### Example Row:

```
id: tshirt-001
name: Classic Logo Tee
description: Premium cotton t-shirt featuring the iconic Kamel Kross logo.
price: 15000
shipping: 2000
category: T-Shirts
sizes: S,M,L,XL,XXL
colors: Black,White,Navy
image: https://drive.google.com/file/d/ABC123/view
images:
in_stock: yes
featured: yes
```

### Publish Your Sheet

1. Click **File** → **Share** → **Publish to web**
2. Select the sheet with your products
3. Choose **Comma-separated values (.csv)** format
4. Click **Publish**
5. Copy the URL - it will look like:
   ```
   https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv
   ```
6. Paste this URL in `js/config.js` as `googleSheetCSV`

---

## 2. Product Images (Google Drive)

### Upload Images to Google Drive

1. Create a folder in Google Drive for your product images
2. Upload your images
3. For each image:
   - Right-click → **Share**
   - Click **Change to anyone with the link**
   - Copy the link

### Image URL Format

Google Drive links look like:
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

The site automatically converts these to displayable image URLs.

### Recommended Image Specs

- **Size**: 800x800 pixels minimum (square)
- **Format**: JPG or PNG
- **Quality**: High quality but optimized for web

---

## 3. Paystack Setup

### Create a Paystack Account

1. Go to [Paystack](https://paystack.com) and sign up
2. Complete your business verification
3. Go to **Settings** → **API Keys & Webhooks**
4. Copy your **Public Key** (starts with `pk_test_` or `pk_live_`)

### Configure Paystack

In `js/config.js`, update:

```javascript
paystack: {
    publicKey: 'pk_live_your_actual_public_key_here'
}
```

**Note**: Use `pk_test_` keys for testing, `pk_live_` keys for production.

### How Orders Work

1. Customer fills checkout form
2. Paystack popup handles payment
3. Order details are stored in Paystack's transaction metadata
4. You view orders in your Paystack Dashboard → **Transactions**

Each transaction shows:
- Customer name, email, phone
- Shipping address
- Ordered items with sizes/colors
- Payment status

---

## 4. Configuration (js/config.js)

Update these values:

```javascript
const CONFIG = {
    store: {
        name: 'Kamel Kross',
        tagline: 'Wear the Culture',
        currency: 'ZAR',
        currencySymbol: 'R'
    },

    // Your published Google Sheet CSV URL
    googleSheetCSV: 'https://docs.google.com/spreadsheets/d/YOUR_ID/pub?output=csv',

    // Your Paystack public key
    paystack: {
        publicKey: 'pk_live_xxxxxxxx'
    },

    // Your contact info
    contact: {
        email: 'hello@kamelkross.co.za',
        phone: '+27 XX XXX XXXX',
        instagram: '@kamelkross',
        twitter: '@kamelkross'
    },

    // Customize colors (optional)
    theme: {
        primary: '#D4A853',        // Main accent color
        primaryHover: '#C49643',
        bgDark: '#0A0A0A',         // Background
        bgCard: '#141414',
        // ... more colors
    }
};
```

---

## 5. Deploy to GitHub Pages

### Option A: GitHub Web Interface

1. Create a new repository on GitHub
2. Upload all files
3. Go to **Settings** → **Pages**
4. Under "Source", select **main branch**
5. Click **Save**
6. Your site will be live at `https://username.github.io/repo-name`

### Option B: Git Command Line

```bash
# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit"

# Add remote
git remote add origin https://github.com/username/kamel-kross.git

# Push
git push -u origin main
```

Then enable GitHub Pages in repository settings.

### Custom Domain (Optional)

1. Go to repository **Settings** → **Pages**
2. Under "Custom domain", enter your domain (e.g., `www.kamelkross.com`)
3. Add these DNS records with your domain provider:
   - **A Record**: `185.199.108.153`
   - **A Record**: `185.199.109.153`
   - **A Record**: `185.199.110.153`
   - **A Record**: `185.199.111.153`
   - **CNAME** (for www): `username.github.io`

---

## 6. Adding Your Logo

Replace the placeholder logo:

1. Add your logo file to the project (e.g., `images/logo.png`)
2. In all HTML files, find the logo section:
   ```html
   <a href="index.html" class="logo">Kamel Kross</a>
   ```
3. Replace with:
   ```html
   <a href="index.html" class="logo">
       <img src="images/logo.png" alt="Kamel Kross">
   </a>
   ```

---

## 7. Managing Products

### Adding New Products

1. Open your Google Sheet
2. Add a new row with product details
3. Changes appear on the site automatically (may take a few minutes due to caching)

### Updating Products

1. Edit the row in Google Sheet
2. Changes reflect on the site

### Removing Products

1. Delete the row from Google Sheet
2. Or set `in_stock` to `no` to hide without deleting

---

## 8. Managing Orders

All orders are visible in your **Paystack Dashboard**:

1. Log in to [Paystack Dashboard](https://dashboard.paystack.com)
2. Go to **Transactions**
3. Click any transaction to see full details including:
   - Customer info
   - Shipping address
   - Items ordered (in metadata)

### Fulfillment Process

1. Check Paystack daily for new paid orders
2. Note the customer's shipping details
3. Package and ship the items
4. Optionally email customer with tracking info

---

## Theme Customization

Change colors by editing `theme` in `js/config.js`:

```javascript
theme: {
    // Warm Gold (Current)
    primary: '#D4A853',

    // Cool Blue
    // primary: '#3B82F6',

    // Hot Pink
    // primary: '#EC4899',

    // Neon Green
    // primary: '#22C55E',
}
```

The entire site updates automatically based on these values.

---

## Troubleshooting

### Products Not Loading

- Check if your Google Sheet is published correctly
- Verify the CSV URL works by opening it in a browser
- Check browser console for errors

### Images Not Showing

- Ensure Google Drive images are set to "Anyone with the link"
- Use the share link format, not the direct file URL

### Payments Not Working

- Verify you're using the correct Paystack public key
- Test with a test card in test mode first
- Check Paystack dashboard for error logs

### Site Not Updating

- Clear your browser cache
- Google Sheets can take 5-10 minutes to propagate changes
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Support

For issues with:
- **Paystack**: Contact Paystack support
- **GitHub Pages**: Check GitHub documentation
- **This template**: Review the code or modify as needed

---

## File Structure

```
kamel-kross/
├── index.html          # Homepage
├── products.html       # Product catalog
├── product.html        # Single product page
├── cart.html           # Shopping cart
├── checkout.html       # Checkout with Paystack
├── success.html        # Order confirmation
├── SETUP.md            # This file
├── css/
│   └── style.css       # All styles
├── js/
│   ├── config.js       # Configuration
│   ├── products.js     # Product management
│   ├── cart.js         # Cart functionality
│   └── ui.js           # UI utilities
└── images/             # Static images (logo, etc.)
```
