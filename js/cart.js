/**
 * Cart Management Module
 * Handles shopping cart with localStorage persistence
 */

const Cart = {
    STORAGE_KEY: 'kamelkross_cart',
    items: [],

    /**
     * Initialize cart from localStorage
     */
    init() {
        this.load();
        this.updateCartCount();
    },

    /**
     * Load cart from localStorage
     */
    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            this.items = saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            this.items = [];
        }
    },

    /**
     * Save cart to localStorage
     */
    save() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
            this.updateCartCount();
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    },

    /**
     * Add item to cart
     * @param {Object} product - Product object
     * @param {string} size - Selected size
     * @param {string} color - Selected color
     * @param {number} quantity - Quantity to add
     * @returns {Object} Cart item
     */
    add(product, size, color, quantity = 1) {
        // Check if item with same options exists
        const existingIndex = this.items.findIndex(item =>
            item.id === product.id &&
            item.size === size &&
            item.color === color
        );

        if (existingIndex >= 0) {
            // Update quantity
            this.items[existingIndex].quantity += quantity;
        } else {
            // Add new item
            const cartItem = {
                id: product.id,
                name: product.name,
                price: product.price,
                shipping: product.shipping || 0,
                image: product.image,
                size: size,
                color: color,
                quantity: quantity,
                category: product.category
            };
            this.items.push(cartItem);
        }

        this.save();
        UI.toast(`${product.name} added to cart`, 'success');

        return this.items[existingIndex >= 0 ? existingIndex : this.items.length - 1];
    },

    /**
     * Remove item from cart
     * @param {number} index - Item index in cart
     */
    remove(index) {
        if (index >= 0 && index < this.items.length) {
            const item = this.items[index];
            this.items.splice(index, 1);
            this.save();
            UI.toast(`${item.name} removed from cart`, 'success');
        }
    },

    /**
     * Update item quantity
     * @param {number} index - Item index
     * @param {number} quantity - New quantity
     */
    updateQuantity(index, quantity) {
        if (index >= 0 && index < this.items.length) {
            if (quantity <= 0) {
                this.remove(index);
            } else {
                this.items[index].quantity = quantity;
                this.save();
            }
        }
    },

    /**
     * Clear all items from cart
     */
    clear() {
        this.items = [];
        this.save();
    },

    /**
     * Get total number of items
     * @returns {number} Total item count
     */
    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    },

    /**
     * Calculate subtotal (products only)
     * @returns {number} Subtotal amount
     */
    getSubtotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    /**
     * Calculate shipping total
     * @returns {number} Shipping amount
     */
    getShipping() {
        return this.items.reduce((total, item) => total + (item.shipping * item.quantity), 0);
    },

    /**
     * Calculate grand total
     * @returns {number} Total amount
     */
    getTotal() {
        return this.getSubtotal() + this.getShipping();
    },

    /**
     * Check if cart is empty
     * @returns {boolean}
     */
    isEmpty() {
        return this.items.length === 0;
    },

    /**
     * Update cart count badge in header
     */
    updateCartCount() {
        const badges = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        badges.forEach(badge => {
            badge.textContent = count;
            badge.setAttribute('data-count', count);
        });
    },

    /**
     * Prepare order data for Paystack
     * @param {Object} customerInfo - Customer details
     * @returns {Object} Order metadata
     */
    prepareOrderData(customerInfo) {
        return {
            customer: customerInfo,
            items: this.items.map(item => ({
                id: item.id,
                name: item.name,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal: this.getSubtotal(),
            shipping: this.getShipping(),
            total: this.getTotal(),
            currency: CONFIG.store.currency,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Render cart item HTML
     * @param {Object} item - Cart item
     * @param {number} index - Item index
     * @returns {string} HTML string
     */
    renderItem(item, index) {
        const imageUrl = Products.convertGoogleDriveUrl(item.image);

        return `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${imageUrl}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="cart-item-variant">${item.size} / ${item.color}</p>
                    <p class="cart-item-price">${Products.formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="cart-item-remove" onclick="CartPage.removeItem(${index})">Remove</button>
                    <div class="quantity-selector">
                        <button class="quantity-btn" onclick="CartPage.updateQuantity(${index}, ${item.quantity - 1})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="CartPage.updateQuantity(${index}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render order item for checkout summary
     * @param {Object} item - Cart item
     * @returns {string} HTML string
     */
    renderOrderItem(item) {
        const imageUrl = Products.convertGoogleDriveUrl(item.image);

        return `
            <div class="order-item">
                <div class="order-item-image">
                    <img src="${imageUrl}" alt="${item.name}">
                    <span class="order-item-qty">${item.quantity}</span>
                </div>
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.size} / ${item.color}</p>
                </div>
                <span class="order-item-price">${Products.formatPrice(item.price * item.quantity)}</span>
            </div>
        `;
    }
};

// Initialize cart on load
document.addEventListener('DOMContentLoaded', () => Cart.init());
