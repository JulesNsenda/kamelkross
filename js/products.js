/**
 * Product Management Module
 * Handles fetching products from Google Sheets and product utilities
 */

const Products = {
    items: [],
    categories: [],
    loaded: false,

    /**
     * Fetch products from Google Sheets CSV
     * @returns {Promise<Array>} Array of product objects
     */
    async fetch() {
        if (this.loaded && this.items.length > 0) {
            return this.items;
        }

        try {
            const response = await fetch(CONFIG.googleSheetCSV);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }

            const csvText = await response.text();
            this.items = this.parseCSV(csvText);
            this.categories = this.extractCategories();
            this.loaded = true;

            return this.items;
        } catch (error) {
            console.error('Error fetching products:', error);
            // Return demo products if fetch fails
            this.items = this.getDemoProducts();
            this.categories = this.extractCategories();
            return this.items;
        }
    },

    /**
     * Parse CSV text into product objects
     * @param {string} csv - CSV text
     * @returns {Array} Array of product objects
     */
    parseCSV(csv) {
        const lines = csv.split('\n').filter(line => line.trim());
        if (lines.length < 2) return [];

        const headers = this.parseCSVLine(lines[0]).map(h => h.toLowerCase().trim().replace(/\s+/g, '_'));
        const products = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const product = {};

            headers.forEach((header, index) => {
                let value = values[index] || '';

                // Parse specific fields
                if (header === 'price' || header === 'shipping') {
                    value = parseFloat(value) || 0;
                } else if (header === 'sizes' || header === 'colors' || header === 'images') {
                    value = value.split(',').map(v => v.trim()).filter(v => v);
                } else if (header === 'in_stock' || header === 'featured') {
                    value = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true' || value === '1';
                }

                product[header] = value;
            });

            // Ensure required fields
            if (product.id && product.name && product.price) {
                products.push(product);
            }
        }

        return products;
    },

    /**
     * Parse a single CSV line handling quoted values
     * @param {string} line - CSV line
     * @returns {Array} Array of values
     */
    parseCSVLine(line) {
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        values.push(current.trim());
        return values;
    },

    /**
     * Extract unique categories from products
     * @returns {Array} Array of category names
     */
    extractCategories() {
        const cats = new Set();
        this.items.forEach(product => {
            if (product.category) {
                cats.add(product.category);
            }
        });
        return Array.from(cats);
    },

    /**
     * Get product by ID
     * @param {string} id - Product ID
     * @returns {Object|null} Product object or null
     */
    getById(id) {
        return this.items.find(p => p.id === id) || null;
    },

    /**
     * Get products by category
     * @param {string} category - Category name
     * @returns {Array} Filtered products
     */
    getByCategory(category) {
        if (!category || category === 'all') return this.items;
        return this.items.filter(p =>
            p.category && p.category.toLowerCase() === category.toLowerCase()
        );
    },

    /**
     * Get featured products
     * @param {number} limit - Maximum number of products
     * @returns {Array} Featured products
     */
    getFeatured(limit = 8) {
        const featured = this.items.filter(p => p.featured);
        return featured.length > 0 ? featured.slice(0, limit) : this.items.slice(0, limit);
    },

    /**
     * Search products by name or description
     * @param {string} query - Search query
     * @returns {Array} Matching products
     */
    search(query) {
        if (!query) return this.items;
        const q = query.toLowerCase();
        return this.items.filter(p =>
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.category && p.category.toLowerCase().includes(q))
        );
    },

    /**
     * Sort products
     * @param {Array} products - Products to sort
     * @param {string} sortBy - Sort method
     * @returns {Array} Sorted products
     */
    sort(products, sortBy) {
        const sorted = [...products];
        switch (sortBy) {
            case 'price-low':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'newest':
            default:
                // Keep original order (assumes newest first in sheet)
                break;
        }
        return sorted;
    },

    /**
     * Format price with currency
     * @param {number} price - Price value
     * @returns {string} Formatted price
     */
    formatPrice(price) {
        return `${CONFIG.store.currencySymbol}${price.toLocaleString()}`;
    },

    /**
     * Convert Google Drive link to direct image URL
     * @param {string} url - Google Drive share link
     * @returns {string} Direct image URL
     */
    convertGoogleDriveUrl(url) {
        if (!url) return '';

        // Already a direct link or not Google Drive
        if (!url.includes('drive.google.com')) {
            return url;
        }

        // Extract file ID from various Google Drive URL formats
        let fileId = null;

        // Format: https://drive.google.com/file/d/FILE_ID/view
        const fileMatch = url.match(/\/file\/d\/([^\/]+)/);
        if (fileMatch) {
            fileId = fileMatch[1];
        }

        // Format: https://drive.google.com/open?id=FILE_ID
        const openMatch = url.match(/[?&]id=([^&]+)/);
        if (openMatch) {
            fileId = openMatch[1];
        }

        // Format: https://drive.google.com/uc?id=FILE_ID
        const ucMatch = url.match(/\/uc\?.*id=([^&]+)/);
        if (ucMatch) {
            fileId = ucMatch[1];
        }

        if (fileId) {
            return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`;
        }

        return url;
    },

    /**
     * Get demo products for testing/development
     * @returns {Array} Demo product data
     */
    getDemoProducts() {
        return [
            {
                id: 'tshirt-001',
                name: 'Classic Logo Tee',
                description: 'Premium cotton t-shirt featuring the iconic Kamel Kross logo. Comfortable fit with high-quality screen printing.',
                price: 450,
                shipping: 75,
                category: 'T-Shirts',
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: ['Black', 'White', 'Navy'],
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
                images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'],
                in_stock: true,
                featured: true
            },
            {
                id: 'tshirt-002',
                name: 'Urban Streetwear Tee',
                description: 'Bold streetwear design on soft-touch fabric. Stand out with this statement piece.',
                price: 550,
                shipping: 75,
                category: 'T-Shirts',
                sizes: ['S', 'M', 'L', 'XL'],
                colors: ['Black', 'Grey'],
                image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600',
                images: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600'],
                in_stock: true,
                featured: true
            },
            {
                id: 'tshirt-003',
                name: 'Limited Edition Graphic Tee',
                description: 'Exclusive limited edition design. Premium heavyweight cotton.',
                price: 650,
                shipping: 75,
                category: 'T-Shirts',
                sizes: ['M', 'L', 'XL'],
                colors: ['Black'],
                image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600',
                images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'],
                in_stock: true,
                featured: true
            },
            {
                id: 'cap-001',
                name: 'Signature Snapback',
                description: 'Adjustable snapback cap with embroidered Kamel Kross logo. One size fits most.',
                price: 350,
                shipping: 50,
                category: 'Caps',
                sizes: ['One Size'],
                colors: ['Black', 'Navy', 'Khaki'],
                image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600',
                images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600'],
                in_stock: true,
                featured: true
            },
            {
                id: 'cap-002',
                name: 'Dad Cap - Minimal',
                description: 'Relaxed fit dad cap with subtle branding. Curved brim, adjustable strap.',
                price: 299,
                shipping: 50,
                category: 'Caps',
                sizes: ['One Size'],
                colors: ['Black', 'White', 'Olive'],
                image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600',
                images: ['https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600'],
                in_stock: true,
                featured: true
            },
            {
                id: 'cap-003',
                name: 'Trucker Cap',
                description: 'Classic trucker style with mesh back. Perfect for sunny days.',
                price: 320,
                shipping: 50,
                category: 'Caps',
                sizes: ['One Size'],
                colors: ['Black/White', 'Navy/White'],
                image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600',
                images: ['https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600'],
                in_stock: true,
                featured: false
            }
        ];
    },

    /**
     * Generate product card HTML
     * @param {Object} product - Product object
     * @returns {string} HTML string
     */
    renderCard(product) {
        const imageUrl = this.convertGoogleDriveUrl(product.image);

        return `
            <article class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${imageUrl}" alt="${product.name}" loading="lazy">
                    ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
                    <div class="product-actions">
                        <a href="product.html?id=${product.id}" class="btn btn-sm">View Details</a>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category || ''}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${this.formatPrice(product.price)}</p>
                </div>
            </article>
        `;
    }
};
