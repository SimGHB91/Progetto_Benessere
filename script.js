/**
 * GALENICA ONLINE - JAVASCRIPT FUNCTIONALITY
 * ==========================================
 * Main JavaScript file for Galenica Online website
 * Handles mobile menu, scroll effects, FAQ functionality, and animations
 */

'use strict';

/**
 * DOM Content Loaded Event Listener
 * Initializes all functionality when the DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    MobileMenu.init();
    ScrollToTop.init();
    SmoothScrolling.init();
    FAQ.init();
    ScrollAnimations.init();
    HeaderScroll.init();
});

/**
 * MOBILE MENU MODULE
 * Handles mobile navigation menu functionality
 */
const MobileMenu = {
    /**
     * Initialize mobile menu functionality
     */
    init() {
        this.mobileMenuButton = document.querySelector('.mobile-menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
        
        if (this.mobileMenuButton && this.mobileMenu) {
            this.bindEvents();
        }
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Toggle mobile menu
        this.mobileMenuButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        // Close mobile menu when clicking on links
        this.mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.mobileMenuButton.contains(e.target) && !this.mobileMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                this.closeMenu();
            }
        });
    },

    /**
     * Toggle mobile menu state
     */
    toggleMenu() {
        const isExpanded = this.mobileMenuButton.getAttribute('aria-expanded') === 'true';
        this.mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        this.mobileMenu.classList.toggle('active');
        
        // Toggle icon
        const icon = this.mobileMenuButton.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    },

    /**
     * Close mobile menu
     */
    closeMenu() {
        this.mobileMenuButton.setAttribute('aria-expanded', 'false');
        this.mobileMenu.classList.remove('active');
        
        // Reset icon
        const icon = this.mobileMenuButton.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
        
        // Re-enable body scroll
        document.body.style.overflow = '';
    }
};

/**
 * SCROLL TO TOP MODULE
 * Handles scroll to top button functionality
 */
const ScrollToTop = {
    /**
     * Initialize scroll to top functionality
     */
    init() {
        this.scrollTopBtn = document.getElementById('scrollTop');
        
        if (this.scrollTopBtn) {
            this.bindEvents();
        }
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        // Show/hide button on scroll
        window.addEventListener('scroll', this.throttle(() => {
            this.toggleVisibility();
        }, 100));

        // Scroll to top on click
        this.scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.scrollToTop();
        });
    },

    /**
     * Toggle button visibility based on scroll position
     */
    toggleVisibility() {
        if (window.pageYOffset > 300) {
            this.scrollTopBtn.classList.add('visible');
            this.scrollTopBtn.setAttribute('aria-hidden', 'false');
        } else {
            this.scrollTopBtn.classList.remove('visible');
            this.scrollTopBtn.setAttribute('aria-hidden', 'true');
        }
    },

    /**
     * Smooth scroll to top of page
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus on skip link for accessibility
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.focus();
        }
    },

    /**
     * Throttle function to limit function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/**
 * SMOOTH SCROLLING MODULE
 * Handles smooth scrolling for anchor links
 */
const SmoothScrolling = {
    /**
     * Initialize smooth scrolling functionality
     */
    init() {
        this.anchorLinks = document.querySelectorAll('a[href^="#"]');
        this.bindEvents();
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                this.handleAnchorClick(e, anchor);
            });
        });
    },

    /**
     * Handle anchor link clicks
     * @param {Event} e - Click event
     * @param {Element} anchor - Anchor element
     */
    handleAnchorClick(e, anchor) {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Close mobile menu if open
            MobileMenu.closeMenu();
            
            // Calculate scroll position with header offset
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update focus for accessibility
            this.updateFocus(target);
            
            // Update URL hash
            if (targetId !== '#') {
                history.pushState(null, null, targetId);
            }
        }
    },

    /**
     * Update focus for accessibility
     * @param {Element} target - Target element to focus
     */
    updateFocus(target) {
        // Make target focusable if it isn't already
        if (!target.hasAttribute('tabindex')) {
            target.setAttribute('tabindex', '-1');
        }
        
        // Focus the target element
        target.focus();
        
        // Remove tabindex after focus to maintain natural tab order
        setTimeout(() => {
            if (target.getAttribute('tabindex') === '-1') {
                target.removeAttribute('tabindex');
            }
        }, 1000);
    }
};

/**
 * FAQ MODULE
 * Handles FAQ accordion functionality
 */
const FAQ = {
    /**
     * Initialize FAQ functionality
     */
    init() {
        this.faqQuestions = document.querySelectorAll('.faq-item__question');
        this.bindEvents();
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        this.faqQuestions.forEach(question => {
            question.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleFAQ(question);
            });

            // Handle keyboard navigation
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleFAQ(question);
                }
            });
        });
    },

    /**
     * Toggle FAQ item
     * @param {Element} question - FAQ question element
     */
    toggleFAQ(question) {
        const answer = question.nextElementSibling;
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        
        // Close all other FAQ items
        this.closeAllFAQs();
        
        // Toggle current FAQ item if it wasn't expanded
        if (!isExpanded) {
            question.setAttribute('aria-expanded', 'true');
            question.classList.add('active');
            answer.classList.add('active');
            
            // Smooth height animation
            this.animateHeight(answer, true);
        }
    },

    /**
     * Close all FAQ items
     */
    closeAllFAQs() {
        this.faqQuestions.forEach(question => {
            const answer = question.nextElementSibling;
            question.setAttribute('aria-expanded', 'false');
            question.classList.remove('active');
            answer.classList.remove('active');
            
            // Reset height
            this.animateHeight(answer, false);
        });
    },

    /**
     * Animate height of FAQ answer
     * @param {Element} element - Answer element
     * @param {boolean} expand - Whether to expand or collapse
     */
    animateHeight(element, expand) {
        if (expand) {
            element.style.maxHeight = element.scrollHeight + 'px';
        } else {
            element.style.maxHeight = '0px';
        }
    }
};

/**
 * SCROLL ANIMATIONS MODULE
 * Handles scroll-triggered animations using Intersection Observer
 */
const ScrollAnimations = {
    /**
     * Initialize scroll animations
     */
    init() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        this.observer = new IntersectionObserver((entries) => {
            this.handleIntersection(entries);
        }, this.observerOptions);
        
        this.observeElements();
    },

    /**
     * Observe elements for animations
     */
    observeElements() {
        // Observe sections
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            this.observer.observe(section);
        });

        // Observe cards
        const cards = document.querySelectorAll('.card, .patology-card, .benefit-card, .testimonial-card, .doctor-card, .news-card');
        cards.forEach(card => {
            this.observer.observe(card);
        });
    },

    /**
     * Handle intersection observer entries
     * @param {Array} entries - Intersection observer entries
     */
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                
                // Add staggered animation for cards in grid
                this.addStaggeredAnimation(entry.target);
                
                // Stop observing the element
                this.observer.unobserve(entry.target);
            }
        });
    },

    /**
     * Add staggered animation to grid items
     * @param {Element} target - Target element
     */
    addStaggeredAnimation(target) {
        const gridItems = target.querySelectorAll('.patology-card, .benefit-card, .testimonial-card, .doctor-card, .news-card');
        
        gridItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-fade-in');
            }, index * 100);
        });
    }
};

/**
 * HEADER SCROLL MODULE
 * Handles header behavior on scroll
 */
const HeaderScroll = {
    /**
     * Initialize header scroll functionality
     */
    init() {
        this.header = document.querySelector('.header');
        this.lastScrollTop = 0;
        this.scrollThreshold = 100;
        
        if (this.header) {
            this.bindEvents();
        }
    },

    /**
     * Bind event listeners
     */
    bindEvents() {
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 10));
    },

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 10) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        this.lastScrollTop = scrollTop;
    },

    /**
     * Throttle function to limit function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

/**
 * UTILITY FUNCTIONS
 * Common utility functions used throughout the application
 */
const Utils = {
    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Whether to call immediately
     * @returns {Function} Debounced function
     */
    debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    },

    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @returns {boolean} Whether element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    /**
     * Get element's offset from top of document
     * @param {Element} element - Element to measure
     * @returns {number} Offset from top
     */
    getOffsetTop(element) {
        let offsetTop = 0;
        while(element) {
            offsetTop += element.offsetTop;
            element = element.offsetParent;
        }
        return offsetTop;
    },

    /**
     * Animate element using CSS transitions
     * @param {Element} element - Element to animate
     * @param {Object} properties - CSS properties to animate
     * @param {number} duration - Animation duration in milliseconds
     * @param {Function} callback - Callback function when animation completes
     */
    animate(element, properties, duration = 300, callback) {
        const startTime = performance.now();
        const startProperties = {};
        
        // Get starting values
        Object.keys(properties).forEach(prop => {
            startProperties[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
        });
        
        function animateStep(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Apply easing function (ease-out)
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            // Update properties
            Object.keys(properties).forEach(prop => {
                const startValue = startProperties[prop];
                const endValue = properties[prop];
                const currentValue = startValue + (endValue - startValue) * easedProgress;
                element.style[prop] = currentValue + (prop.includes('opacity') ? '' : 'px');
            });
            
            if (progress < 1) {
                requestAnimationFrame(animateStep);
            } else if (callback) {
                callback();
            }
        }
        
        requestAnimationFrame(animateStep);
    }
};

/**
 * PERFORMANCE MONITORING
 * Basic performance monitoring and optimization
 */
const Performance = {
    /**
     * Initialize performance monitoring
     */
    init() {
        this.logLoadTime();
        this.setupLazyLoading();
        this.preloadCriticalResources();
    },

    /**
     * Log page load time
     */
    logLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
            
            // Send to analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    value: Math.round(loadTime)
                });
            }
        });
    },

    /**
     * Setup lazy loading for images
     */
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    },

    /**
     * Preload critical resources
     */
    preloadCriticalResources() {
        // Preload critical CSS
        const criticalCSS = document.querySelector('link[rel="stylesheet"]');
        if (criticalCSS) {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'style';
            preloadLink.href = criticalCSS.href;
            document.head.appendChild(preloadLink);
        }
    }
};

/**
 * ERROR HANDLING
 * Global error handling and reporting
 */
const ErrorHandler = {
    /**
     * Initialize error handling
     */
    init() {
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    },

    /**
     * Handle JavaScript errors
     * @param {ErrorEvent} event - Error event
     */
    handleError(event) {
        console.error('JavaScript Error:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
        
        // Send to error tracking service if available
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(event.error);
        }
    },

    /**
     * Handle unhandled promise rejections
     * @param {PromiseRejectionEvent} event - Promise rejection event
     */
    handlePromiseRejection(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        
        // Send to error tracking service if available
        if (typeof Sentry !== 'undefined') {
            Sentry.captureException(event.reason);
        }
    }
};

// Initialize performance monitoring and error handling immediately
Performance.init();
ErrorHandler.init();