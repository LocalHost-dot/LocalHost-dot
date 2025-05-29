// Contact form functionality for Grace Community Church Website

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeMap();
});

// Contact form handling
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form elements
        const submitButton = this.querySelector('button[type="submit"]');
        const submitText = submitButton.querySelector('.submit-text');
        const loadingText = submitButton.querySelector('.loading-text');
        const successMessage = document.getElementById('form-success');
        const errorMessage = document.getElementById('form-error');
        
        // Validate form
        if (!validateForm(this)) {
            return;
        }
        
        // Show loading state
        submitText.classList.add('hidden');
        loadingText.classList.remove('hidden');
        submitButton.disabled = true;
        
        // Hide previous messages
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        
        // Get form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Submit to Formspree (replace with actual endpoint)
        fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                successMessage.classList.remove('hidden');
                contactForm.reset();
                successMessage.scrollIntoView({ behavior: 'smooth' });
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            // Show error message
            errorMessage.classList.remove('hidden');
            document.getElementById('error-message').textContent = 
                'There was an error sending your message. Please try again or contact us directly.';
        })
        .finally(() => {
            // Reset button state
            submitText.classList.remove('hidden');
            loadingText.classList.add('hidden');
            submitButton.disabled = false;
        });
    });
    
    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            // Remove error styling on input
            this.classList.remove('form-error');
        });
    });
}

// Form validation
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Individual field validation
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    
    // Remove previous styling
    field.classList.remove('form-error', 'form-success');
    
    // Check required fields
    if (field.hasAttribute('required') && !value) {
        field.classList.add('form-error');
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('form-error');
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            field.classList.add('form-error');
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Name validation
    if (field.name.includes('name') && value) {
        if (value.length < 2) {
            field.classList.add('form-error');
            showFieldError(field, 'Name must be at least 2 characters');
            return false;
        }
    }
    
    // Message length validation
    if (field.name === 'message' && value) {
        if (value.length < 10) {
            field.classList.add('form-error');
            showFieldError(field, 'Message must be at least 10 characters');
            return false;
        }
    }
    
    field.classList.add('form-success');
    hideFieldError(field);
    return true;
}

// Show field error
function showFieldError(field, message) {
    // Remove existing error message
    hideFieldError(field);
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error text-red-600 dark:text-red-400 text-sm mt-1';
    errorElement.textContent = message;
    
    // Insert after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

// Hide field error
function hideFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Initialize Google Map
function initializeMap() {
    const mapContainer = document.getElementById('google-map');
    if (!mapContainer) return;
    
    // Create placeholder map with church location
    const mapContent = `
        <div class="bg-gray-200 dark:bg-gray-700 rounded-lg h-full flex items-center justify-center">
            <div class="text-center p-8">
                <i class="fas fa-map-marker-alt text-4xl text-primary-600 dark:text-primary-400 mb-4"></i>
                <h3 class="font-semibold text-lg text-gray-900 dark:text-white mb-2">Church Location</h3>
                <p class="text-gray-600 dark:text-gray-300 mb-4">123 Faith Street<br>Hope City, HC 12345</p>
                <a href="https://maps.google.com/?q=123+Faith+Street+Hope+City+HC+12345" 
                   target="_blank" 
                   class="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <i class="fas fa-external-link-alt mr-2"></i>
                    Open in Google Maps
                </a>
            </div>
        </div>
    `;
    
    mapContainer.innerHTML = mapContent;
}

// Character counter for textarea
function initializeCharacterCounter() {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    const maxLength = 1000;
    const counter = document.createElement('div');
    counter.className = 'text-sm text-gray-500 dark:text-gray-400 text-right mt-1';
    counter.id = 'message-counter';
    
    messageField.parentNode.appendChild(counter);
    
    function updateCounter() {
        const remaining = maxLength - messageField.value.length;
        counter.textContent = `${remaining} characters remaining`;
        
        if (remaining < 100) {
            counter.className = 'text-sm text-orange-500 dark:text-orange-400 text-right mt-1';
        } else if (remaining < 50) {
            counter.className = 'text-sm text-red-500 dark:text-red-400 text-right mt-1';
        } else {
            counter.className = 'text-sm text-gray-500 dark:text-gray-400 text-right mt-1';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    messageField.setAttribute('maxlength', maxLength);
    updateCounter();
}