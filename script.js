/**
 * ==========================================================
 * PORTFOLIO WEBSITE - MAIN JAVASCRIPT
 * ==========================================================
 * Author: Ajay Jaiswar
 * Description: Interactive features including 3D cube, form validation,
 *              smooth scrolling, and animations
 *
 * TABLE OF CONTENTS:
 * 1. DOM Elements & Configuration
 * 2. Navigation
 * 3. 3D Cube Interaction
 * 4. Form Validation & Submission
 * 5. Scroll Animations
 * 6. Toast Notifications
 * 7. Utility Functions
 * 8. Initialization
 * ==========================================================
 */

// ==========================================================
// 1. DOM ELEMENTS & CONFIGURATION
// ==========================================================

const DOM = {
    navbar: document.getElementById('navbar'),
    navToggle: document.getElementById('navToggle'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    cube: document.getElementById('cube'),
    cubeContainer: document.getElementById('cubeContainer'),
    contactForm: document.getElementById('contactForm'),
    submitBtn: document.getElementById('submitBtn'),
    toastContainer: document.getElementById('toastContainer'),
    sections: document.querySelectorAll('section[id]')
};

// API Configuration
const CONFIG = {
    apiUrl: window.location.origin + '/api',
    animationDuration: 300,
    toastDuration: 5000,
    scrollOffset: 100
};

// ==========================================================
// 2. NAVIGATION
// ==========================================================

/**
 * Navigation Manager
 * Handles sticky navbar, mobile menu, and active link highlighting
 */
const Navigation = {
    init() {
        this.handleScroll();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveLinks();
    },

    /**
     * Handle navbar scroll effects
     */
    handleScroll() {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                DOM.navbar.classList.add('scrolled');
            } else {
                DOM.navbar.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    },

    /**
     * Setup mobile hamburger menu
     */
    setupMobileMenu() {
        if (!DOM.navToggle || !DOM.navMenu) return;

        DOM.navToggle.addEventListener('click', () => {
            DOM.navToggle.classList.toggle('active');
            DOM.navMenu.classList.toggle('active');
            DOM.navToggle.setAttribute(
                'aria-expanded',
                DOM.navToggle.classList.contains('active')
            );

            // Prevent body scroll when menu is open
            document.body.style.overflow =
                DOM.navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        DOM.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                DOM.navToggle.classList.remove('active');
                DOM.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && DOM.navMenu.classList.contains('active')) {
                DOM.navToggle.classList.remove('active');
                DOM.navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    },

    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const navHeight = DOM.navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    },

    /**
     * Highlight active navigation link based on scroll position
     */
    setupActiveLinks() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        DOM.navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${id}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: `-${DOM.navbar?.offsetHeight || 80}px 0px 0px 0px`
            }
        );

        DOM.sections.forEach(section => observer.observe(section));
    }
};

// ==========================================================
// 3. 3D CUBE INTERACTION
// ==========================================================

/**
 * 3D Cube Controller
 * Handles mouse tracking and interactive 3D effects with smooth movement
 *
 * HOW TO MODIFY CUBE TEXT:
 * Edit the text inside each .cube-face span in index.html
 */
const CubeController = {
    isHovering: false,
    targetRotationX: -20,
    targetRotationY: 0,
    currentRotationX: -20,
    currentRotationY: 0,
    baseRotationY: 0,
    animationId: null,
    autoRotateId: null,
    smoothness: 0.18, // Higher = faster response on hover

    init() {
        if (!DOM.cube || !DOM.cubeContainer) return;

        this.setupMouseTracking();
        this.setupTouchInteraction();
        this.startContinuousAnimation();
    },

    /**
     * Start continuous animation loop for smooth interpolation
     */
    startContinuousAnimation() {
        const animate = () => {
            if (!this.isHovering) {
                // Auto-rotate when not hovering - faster speed
                this.baseRotationY += 0.6;
                this.targetRotationY = this.baseRotationY;
                this.targetRotationX = -20;
            }

            // Smooth interpolation (easing)
            this.currentRotationX += (this.targetRotationX - this.currentRotationX) * this.smoothness;
            this.currentRotationY += (this.targetRotationY - this.currentRotationY) * this.smoothness;

            DOM.cube.style.transform = `
                rotateX(${this.currentRotationX}deg)
                rotateY(${this.currentRotationY}deg)
            `;

            this.autoRotateId = requestAnimationFrame(animate);
        };

        animate();
    },

    /**
     * Track mouse position for 3D tilt effect
     */
    setupMouseTracking() {
        // Use the hero-visual container for larger tracking area
        const trackingArea = DOM.cubeContainer.parentElement || DOM.cubeContainer;

        trackingArea.addEventListener('mouseenter', () => {
            this.isHovering = true;
            this.baseRotationY = this.currentRotationY; // Remember current position
        });

        trackingArea.addEventListener('mouseleave', () => {
            this.isHovering = false;
            // baseRotationY continues from current position for smooth transition
            this.baseRotationY = this.currentRotationY;
        });

        trackingArea.addEventListener('mousemove', (e) => {
            if (!this.isHovering) return;

            const rect = trackingArea.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // Normalized mouse position (-1 to 1)
            const normalizedX = (e.clientX - centerX) / (rect.width / 2);
            const normalizedY = (e.clientY - centerY) / (rect.height / 2);

            // Calculate target rotation with enhanced movement
            const maxRotationX = 35;
            const maxRotationY = 45;

            this.targetRotationX = -20 + (normalizedY * -maxRotationX);
            this.targetRotationY = this.baseRotationY + (normalizedX * maxRotationY);
        });

        // Also track on the cube itself for more precise control
        DOM.cubeContainer.addEventListener('mousemove', (e) => {
            if (!this.isHovering) return;

            const rect = DOM.cubeContainer.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const normalizedX = (e.clientX - centerX) / (rect.width / 2);
            const normalizedY = (e.clientY - centerY) / (rect.height / 2);

            const maxRotationX = 30;
            const maxRotationY = 40;

            this.targetRotationX = -20 + (normalizedY * -maxRotationX);
            this.targetRotationY = this.baseRotationY + (normalizedX * maxRotationY);
        });
    },

    /**
     * Touch interaction for mobile devices
     */
    setupTouchInteraction() {
        let lastTouchX = 0;
        let lastTouchY = 0;

        DOM.cubeContainer.addEventListener('touchstart', (e) => {
            this.isHovering = true;
            this.baseRotationY = this.currentRotationY;
            if (e.touches.length > 0) {
                lastTouchX = e.touches[0].clientX;
                lastTouchY = e.touches[0].clientY;
            }
        }, { passive: true });

        DOM.cubeContainer.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - lastTouchX;
                const deltaY = touch.clientY - lastTouchY;

                this.targetRotationY += deltaX * 0.5;
                this.targetRotationX += deltaY * -0.3;

                // Clamp X rotation
                this.targetRotationX = Math.max(-45, Math.min(15, this.targetRotationX));

                lastTouchX = touch.clientX;
                lastTouchY = touch.clientY;
            }
        }, { passive: true });

        DOM.cubeContainer.addEventListener('touchend', () => {
            this.isHovering = false;
            this.baseRotationY = this.currentRotationY;
        }, { passive: true });
    },

    /**
     * Cleanup animation on page hide
     */
    destroy() {
        if (this.autoRotateId) {
            cancelAnimationFrame(this.autoRotateId);
        }
    }
};

// ==========================================================
// 4. FORM VALIDATION & SUBMISSION
// ==========================================================

/**
 * Form Handler
 * Manages contact form validation and submission
 */
const FormHandler = {
    validators: {
        name: {
            validate: (value) => value.trim().length >= 2,
            message: 'Name must be at least 2 characters'
        },
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            message: 'Please enter a valid email address'
        },
        subject: {
            validate: (value) => value.trim().length >= 3,
            message: 'Subject must be at least 3 characters'
        },
        message: {
            validate: (value) => value.trim().length >= 20,
            message: 'Message must be at least 20 characters'
        }
    },

    init() {
        if (!DOM.contactForm) return;

        this.setupRealTimeValidation();
        this.setupFormSubmission();
    },

    /**
     * Setup real-time validation on input fields
     */
    setupRealTimeValidation() {
        Object.keys(this.validators).forEach(fieldName => {
            const input = DOM.contactForm.querySelector(`#${fieldName}`);
            if (!input) return;

            // Validate on blur
            input.addEventListener('blur', () => {
                this.validateField(fieldName, input.value);
            });

            // Clear error on focus
            input.addEventListener('focus', () => {
                this.clearFieldError(fieldName);
            });

            // Validate on input (debounced)
            let timeout;
            input.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    if (input.value.trim()) {
                        this.validateField(fieldName, input.value);
                    }
                }, 300);
            });
        });
    },

    /**
     * Validate a single field
     */
    validateField(fieldName, value) {
        const validator = this.validators[fieldName];
        const input = DOM.contactForm.querySelector(`#${fieldName}`);
        const errorElement = DOM.contactForm.querySelector(`#${fieldName}Error`);

        if (!validator || !input) return true;

        const isValid = validator.validate(value);

        if (isValid) {
            input.classList.remove('error');
            input.classList.add('success');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('visible');
            }
        } else {
            input.classList.remove('success');
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = validator.message;
                errorElement.classList.add('visible');
            }
        }

        return isValid;
    },

    /**
     * Clear error state from a field
     */
    clearFieldError(fieldName) {
        const input = DOM.contactForm.querySelector(`#${fieldName}`);
        const errorElement = DOM.contactForm.querySelector(`#${fieldName}Error`);

        if (input) {
            input.classList.remove('error');
        }
        if (errorElement) {
            errorElement.classList.remove('visible');
        }
    },

    /**
     * Validate all form fields
     */
    validateForm() {
        let isValid = true;

        Object.keys(this.validators).forEach(fieldName => {
            const input = DOM.contactForm.querySelector(`#${fieldName}`);
            if (input && !this.validateField(fieldName, input.value)) {
                isValid = false;
            }
        });

        return isValid;
    },

    /**
     * Setup form submission handling
     */
    setupFormSubmission() {
        DOM.contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate form
            if (!this.validateForm()) {
                Toast.show('Please fill in all fields correctly', 'error');
                return;
            }

            // Show loading state
            this.setLoadingState(true);

            try {
                const formData = new FormData(DOM.contactForm);
                const data = Object.fromEntries(formData.entries());

                const response = await fetch(`${CONFIG.apiUrl}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    Toast.show(result.message || 'Message sent successfully!', 'success');
                    DOM.contactForm.reset();

                    // Clear success states
                    DOM.contactForm.querySelectorAll('.form-input').forEach(input => {
                        input.classList.remove('success', 'error');
                    });
                } else {
                    const errorMsg = result.errors
                        ? result.errors.join(', ')
                        : result.message || 'Failed to send message';
                    Toast.show(errorMsg, 'error');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                Toast.show('Network error. Please try again later.', 'error');
            } finally {
                this.setLoadingState(false);
            }
        });
    },

    /**
     * Toggle loading state on submit button
     */
    setLoadingState(isLoading) {
        if (!DOM.submitBtn) return;

        if (isLoading) {
            DOM.submitBtn.classList.add('loading');
            DOM.submitBtn.disabled = true;
        } else {
            DOM.submitBtn.classList.remove('loading');
            DOM.submitBtn.disabled = false;
        }
    }
};

// ==========================================================
// 5. SCROLL ANIMATIONS
// ==========================================================

/**
 * Scroll Animation Controller
 * Initializes AOS library and handles scroll-based effects
 */
const ScrollAnimations = {
    init() {
        this.initAOS();
        this.setupParallax();
    },

    /**
     * Initialize AOS (Animate On Scroll) library
     */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-out-cubic',
                once: true,
                offset: 100,
                delay: 0,
                anchorPlacement: 'top-bottom'
            });
        }
    },

    /**
     * Setup parallax effects for hero section
     */
    setupParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;

            // Move background orbs with parallax effect
            hero.style.setProperty('--parallax-offset', `${rate}px`);
        });
    }
};

// ==========================================================
// 6. TOAST NOTIFICATIONS
// ==========================================================

/**
 * Toast Notification System
 */
const Toast = {
    /**
     * Show a toast notification
     * @param {string} message - The message to display
     * @param {string} type - 'success' or 'error'
     */
    show(message, type = 'success') {
        if (!DOM.toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Add icon based on type
        const icon = type === 'success'
            ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
            : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

        toast.innerHTML = `${icon}<span>${message}</span>`;
        DOM.toastContainer.appendChild(toast);

        // Auto-remove toast after duration
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, CONFIG.animationDuration);
        }, CONFIG.toastDuration);
    }
};

// ==========================================================
// 7. UTILITY FUNCTIONS
// ==========================================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll handlers
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if device is mobile
 */
function isMobile() {
    return window.innerWidth <= 768;
}

/**
 * Check if device supports touch
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// ==========================================================
// 8. INITIALIZATION
// ==========================================================

/**
 * Initialize all modules when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize core modules
    Navigation.init();
    CubeController.init();
    FormHandler.init();
    ScrollAnimations.init();

    // Log initialization
    console.log('%c Portfolio Website Loaded ',
        'background: linear-gradient(135deg, #00d4ff, #00ffcc); color: #0a0a0f; font-weight: bold; padding: 10px 20px; border-radius: 5px;'
    );

    // Check API health (optional)
    fetch(`${CONFIG.apiUrl}/health`)
        .then(res => res.json())
        .then(data => {
            if (data.status === 'ok') {
                console.log('%c API Connected ',
                    'background: #00ffcc; color: #0a0a0f; font-weight: bold; padding: 5px 10px; border-radius: 3px;'
                );
            }
        })
        .catch(() => {
            console.log('%c API Offline - Form submissions will be logged ',
                'background: #ff4757; color: white; font-weight: bold; padding: 5px 10px; border-radius: 3px;'
            );
        });
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (DOM.cube) {
        DOM.cube.style.animationPlayState =
            document.hidden ? 'paused' : 'running';
    }
});

// Reinitialize AOS on window resize (debounced)
window.addEventListener('resize', debounce(() => {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250));

// ==========================================================
// TYPEWRITER ANIMATION
// ==========================================================

const TypewriterAnimation = {
    texts: [
        { id: 'heroSubtitle', text: 'QA Analyst & Frontend Developer', isHTML: false },
        { id: 'heroDescription', text: 'I combine quality assurance and development to build reliable, user-focused digital experiences.', isHTML: false }
    ],

    typingSpeed: 50,
    delayBetweenTexts: 300,
    currentTextIndex: 0,

    init() {
        // Start typing after a short delay
        setTimeout(() => this.typeNextText(), 500);
    },

    typeNextText() {
        if (this.currentTextIndex >= this.texts.length) {
            // All texts typed
            return;
        }

        const textConfig = this.texts[this.currentTextIndex];
        const element = document.getElementById(textConfig.id);

        if (!element) {
            this.currentTextIndex++;
            this.typeNextText();
            return;
        }

        this.typeText(element, textConfig, () => {
            this.currentTextIndex++;
            setTimeout(() => this.typeNextText(), this.delayBetweenTexts);
        });
    },

    typeText(element, config, callback) {
        const text = config.text;
        let charIndex = 0;

        const type = () => {
            if (charIndex < text.length) {
                let displayText = text.substring(0, charIndex + 1);
                element.innerHTML = displayText;
                charIndex++;

                // Vary typing speed slightly for natural feel
                const speed = this.typingSpeed + Math.random() * 30 - 15;
                setTimeout(type, speed);
            } else {
                // Typing complete for this text
                if (callback) callback();
            }
        };

        type();
    }
};

// Initialize typewriter on page load
document.addEventListener('DOMContentLoaded', () => {
    TypewriterAnimation.init();
});

