/**
 * Kamel Kross E-Commerce Configuration
 * Edit this file to customize your store
 */

const CONFIG = {
    // Store Information
    store: {
        name: 'Kamel Kross',
        tagline: 'No Easy Path',
        currency: 'ZAR',
        currencySymbol: 'R'
    },

    // Google Sheets Configuration
    // To get your sheet URL:
    // 1. Create a Google Sheet with the required columns
    // 2. Go to File → Share → Publish to web
    // 3. Select the sheet and choose CSV
    // 4. Copy the URL and paste it below
    googleSheetCSV: 'YOUR_GOOGLE_SHEET_CSV_URL_HERE',

    // Paystack Configuration
    // Get your public key from: https://dashboard.paystack.com/#/settings/developer
    paystack: {
        publicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx'
    },

    // Contact Information
    contact: {
        email: 'hello@kamelkross.co.za',
        phone: '+27 XX XXX XXXX',
        instagram: '@kamelkross',
        twitter: '@kamelkross'
    },

    // Theme Colors (CSS Custom Properties)
    // Change these to customize the entire site's look
    theme: {
        // Primary accent color (buttons, highlights)
        primary: '#D4A853',
        primaryHover: '#C49643',

        // Background colors
        bgDark: '#0A0A0A',
        bgCard: '#141414',
        bgLight: '#1A1A1A',

        // Text colors
        textPrimary: '#FFFFFF',
        textSecondary: '#A0A0A0',
        textMuted: '#666666',

        // Status colors
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B'
    }
};

// Apply theme colors to CSS custom properties
function applyTheme() {
    const root = document.documentElement;
    Object.entries(CONFIG.theme).forEach(([key, value]) => {
        // Convert camelCase to kebab-case
        const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        root.style.setProperty(`--${cssVar}`, value);
    });
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', applyTheme);
