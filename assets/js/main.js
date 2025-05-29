// Main JavaScript for Grace Community Church Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initializeNavigation();
    initializeDarkMode();
    initializeAnimations();
    initializeScrollToTop();
    initializeForms();
    initializeDonations();
    initializeEventFilters();
    initializeSermonFilters();
    
    console.log('Grace Community Church website initialized successfully');
});

// Navigation functionality
function initializeNavigation() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Update button icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.className = 'fas fa-bars';
                } else {
                    icon.className = 'fas fa-times';
                }
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });
    }
}

// Dark mode functionality
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark');
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            html.classList.toggle('dark');
            
            // Save preference
            if (html.classList.contains('dark')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

// Scroll animations using Intersection Observer
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.id = 'scroll-to-top';
    scrollToTopButton.className = 'fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 scale-0 z-50';
    scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.classList.add('visible');
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.transform = 'scale(1)';
        } else {
            scrollToTopButton.classList.remove('visible');
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.transform = 'scale(0)';
        }
    });
    
    // Scroll to top when clicked
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Form handling
function initializeForms() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const submitText = submitButton.querySelector('.submit-text');
            const loadingText = submitButton.querySelector('.loading-text');
            const successMessage = document.getElementById('form-success');
            const errorMessage = document.getElementById('form-error');
            
            // Show loading state
            submitText.classList.add('hidden');
            loadingText.classList.remove('hidden');
            submitButton.disabled = true;
            
            // Hide previous messages
            successMessage.classList.add('hidden');
            errorMessage.classList.add('hidden');
            
            // For demo purposes - in real implementation, this would submit to Formspree
            setTimeout(() => {
                // Reset button state
                submitText.classList.remove('hidden');
                loadingText.classList.add('hidden');
                submitButton.disabled = false;
                
                // Show success message
                successMessage.classList.remove('hidden');
                contactForm.reset();
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth' });
            }, 2000);
        });
        
        // Form validation
        const requiredFields = contactForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', function() {
                validateField(field);
            });
        });
    }
}

// Field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    
    // Remove previous error styling
    field.classList.remove('form-error');
    
    // Validate based on field type
    if (field.hasAttribute('required') && !value) {
        field.classList.add('form-error');
        return false;
    }
    
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('form-error');
            return false;
        }
    }
    
    field.classList.add('form-success');
    return true;
}

// Donation functionality
function initializeDonations() {
    const donationButtons = document.querySelectorAll('.donation-amount-btn');
    const customAmountInput = document.getElementById('custom-amount-input');
    const customAmountField = document.getElementById('custom-amount');
    
    donationButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove selected class from all buttons
            donationButtons.forEach(btn => btn.classList.remove('selected'));
            
            // Add selected class to clicked button
            this.classList.add('selected');
            
            const amount = this.dataset.amount;
            
            if (amount === 'other') {
                customAmountInput.classList.remove('hidden');
                customAmountField.focus();
            } else {
                customAmountInput.classList.add('hidden');
                customAmountField.value = '';
                
                // Initialize PayPal button with selected amount
                initializePayPalButton(amount);
            }
        });
    });
    
    if (customAmountField) {
        customAmountField.addEventListener('input', function() {
            const amount = this.value;
            if (amount && parseFloat(amount) > 0) {
                initializePayPalButton(amount);
            }
        });
    }
}

// PayPal button initialization (demo version)
function initializePayPalButton(amount) {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    
    // Clear existing button
    container.innerHTML = '';
    
    // Create demo PayPal button
    const demoButton = document.createElement('div');
    demoButton.className = 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-lg text-center cursor-pointer transition-colors';
    demoButton.innerHTML = `
        <i class="fab fa-paypal mr-2"></i>
        Donate $${amount} with PayPal
    `;
    
    demoButton.addEventListener('click', function() {
        alert(`Demo: Would process $${amount} donation through PayPal. Please configure PayPal credentials to enable real payments.`);
    });
    
    container.appendChild(demoButton);
}

// Event filters
function initializeEventFilters() {
    const filterButtons = document.querySelectorAll('.event-filter-btn');
    const eventCards = document.querySelectorAll('.event-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active', 'bg-primary-600', 'text-white'));
            filterButtons.forEach(btn => btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300'));
            
            this.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            this.classList.add('active', 'bg-primary-600', 'text-white');
            
            // Filter events
            eventCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Sermon filters
function initializeSermonFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sermonCards = document.querySelectorAll('.sermon-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active', 'bg-primary-600', 'text-white'));
            filterButtons.forEach(btn => btn.classList.add('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300'));
            
            this.classList.remove('bg-gray-200', 'dark:bg-gray-700', 'text-gray-700', 'dark:text-gray-300');
            this.classList.add('active', 'bg-primary-600', 'text-white');
            
            // Filter sermons (basic implementation)
            sermonCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'block';
                }
            });
        });
    });
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Close mobile menu on Escape
    if (e.key === 'Escape') {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            if (mobileMenuButton) {
                const icon = mobileMenuButton.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        }
    }
});