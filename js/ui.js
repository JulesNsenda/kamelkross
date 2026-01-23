/**
 * UI Utilities Module
 * Handles common UI components and interactions
 */

const UI = {
    /**
     * Initialize all UI components
     */
    init() {
        this.initMobileMenu();
        this.initToastContainer();
        this.initScrollHeader();
        this.initScrollReveal();
    },

    /**
     * Initialize mobile menu toggle
     */
    initMobileMenu() {
        const toggle = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (toggle && navLinks) {
            // Create backdrop element
            let backdrop = document.querySelector('.menu-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.className = 'menu-backdrop';
                document.body.appendChild(backdrop);
            }

            const closeMenu = () => {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
                backdrop.classList.remove('active');
                document.body.style.overflow = '';
            };

            const openMenu = () => {
                navLinks.classList.add('active');
                toggle.classList.add('active');
                backdrop.classList.add('active');
                document.body.style.overflow = 'hidden';
            };

            toggle.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    closeMenu();
                } else {
                    openMenu();
                }
            });

            // Close menu when clicking backdrop
            backdrop.addEventListener('click', closeMenu);

            // Close menu when clicking any link (including dropdown items)
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                    closeMenu();
                }
            });
        }
    },

    /**
     * Initialize toast notification container
     */
    initToastContainer() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    },

    /**
     * Initialize header scroll effect
     */
    initScrollHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    },

    /**
     * Initialize scroll reveal animations
     */
    initScrollReveal() {
        const reveals = document.querySelectorAll('.reveal');
        if (reveals.length === 0) return;

        const revealOnScroll = () => {
            reveals.forEach(el => {
                const elementTop = el.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;

                if (elementTop < windowHeight - 100) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', this.debounce(revealOnScroll, 10));
        revealOnScroll(); // Check on load
    },

    /**
     * Show toast notification
     * @param {string} message - Toast message
     * @param {string} type - Toast type (success, error, warning)
     * @param {number} duration - Auto-dismiss duration in ms
     */
    toast(message, type = 'success', duration = 3000) {
        const container = document.querySelector('.toast-container');
        if (!container) {
            this.initToastContainer();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        document.querySelector('.toast-container').appendChild(toast);

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                toast.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => toast.remove(), 300);
            }, duration);
        }

        return toast;
    },

    /**
     * Show loading spinner
     * @param {HTMLElement} container - Container element
     */
    showLoading(container) {
        container.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
            </div>
        `;
    },

    /**
     * Render skeleton loading cards
     * @param {HTMLElement} container - Container element
     * @param {number} count - Number of skeletons
     */
    showSkeletons(container, count = 4) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="product-card">
                    <div class="skeleton" style="aspect-ratio: 1;"></div>
                    <div style="padding: var(--space-lg);">
                        <div class="skeleton" style="height: 12px; width: 60px; margin-bottom: var(--space-sm);"></div>
                        <div class="skeleton" style="height: 20px; width: 80%; margin-bottom: var(--space-sm);"></div>
                        <div class="skeleton" style="height: 20px; width: 40%;"></div>
                    </div>
                </div>
            `;
        }
        container.innerHTML = html;
    },

    /**
     * Get URL parameters
     * @returns {URLSearchParams}
     */
    getUrlParams() {
        return new URLSearchParams(window.location.search);
    },

    /**
     * Format date
     * @param {string|Date} date - Date to format
     * @returns {string} Formatted date
     */
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    /**
     * Generate unique ID
     * @param {string} prefix - ID prefix
     * @returns {string} Unique ID
     */
    generateId(prefix = 'kk') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    /**
     * Validate phone number (South African format)
     * @param {string} phone - Phone to validate
     * @returns {boolean}
     */
    isValidPhone(phone) {
        // Remove spaces and dashes
        const cleaned = phone.replace(/[\s-]/g, '');
        // South African phone: starts with 0 or +27, followed by 9 digits
        return /^(\+27|0)[0-9]{9}$/.test(cleaned);
    },

    /**
     * Set active navigation link based on current page
     */
    setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    },

    /**
     * Scroll to element smoothly
     * @param {string|HTMLElement} target - Selector or element
     */
    scrollTo(target) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>}
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.toast('Copied to clipboard', 'success');
            return true;
        } catch (error) {
            console.error('Failed to copy:', error);
            return false;
        }
    }
};

// Initialize UI on load
document.addEventListener('DOMContentLoaded', () => {
    UI.init();
    UI.setActiveNavLink();
});
