// PayPal donation functionality for Grace Community Church Website

document.addEventListener('DOMContentLoaded', function() {
    initializePayPalDonations();
});

function initializePayPalDonations() {
    const donationButtons = document.querySelectorAll('.donation-amount-btn');
    const customAmountInput = document.getElementById('custom-amount-input');
    const customAmountField = document.getElementById('custom-amount');
    const paypalContainer = document.getElementById('paypal-button-container');
    
    if (!paypalContainer) return;
    
    let selectedAmount = 0;
    
    // Handle preset amount buttons
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
                selectedAmount = 0;
                clearPayPalButton();
            } else {
                customAmountInput.classList.add('hidden');
                customAmountField.value = '';
                selectedAmount = parseFloat(amount);
                renderPayPalButton(selectedAmount);
            }
        });
    });
    
    // Handle custom amount input
    if (customAmountField) {
        customAmountField.addEventListener('input', function() {
            const amount = parseFloat(this.value);
            if (amount && amount > 0) {
                selectedAmount = amount;
                renderPayPalButton(amount);
            } else {
                clearPayPalButton();
            }
        });
    }
    
    // Initialize with demo button
    renderDemoButton();
}

function renderPayPalButton(amount) {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    // Check if PayPal SDK is available and configured
    if (typeof paypal !== 'undefined') {
        // Real PayPal integration
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toFixed(2)
                        },
                        description: `Donation to Grace Community Church - $${amount}`
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    showDonationSuccess(details, amount);
                });
            },
            onError: function(err) {
                showDonationError('PayPal transaction failed. Please try again.');
            },
            onCancel: function(data) {
                showDonationMessage('Donation cancelled. You can try again anytime.', 'info');
            },
            style: {
                color: 'blue',
                shape: 'rect',
                label: 'donate',
                height: 50
            }
        }).render(container);
    } else {
        // Demo/placeholder button
        renderDemoButton(amount);
    }
}

function renderDemoButton(amount = 0) {
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    const demoButton = document.createElement('div');
    demoButton.className = 'bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-4 px-6 rounded-lg text-center cursor-pointer transition-all duration-300 transform hover:scale-105 flex items-center justify-center';
    
    if (amount > 0) {
        demoButton.innerHTML = `
            <i class="fab fa-paypal mr-3 text-xl"></i>
            <span>Donate $${amount.toFixed(2)} with PayPal</span>
        `;
    } else {
        demoButton.innerHTML = `
            <i class="fab fa-paypal mr-3 text-xl"></i>
            <span>Select Amount to Continue</span>
        `;
        demoButton.classList.add('opacity-50', 'cursor-not-allowed');
        demoButton.style.pointerEvents = 'none';
    }
    
    if (amount > 0) {
        demoButton.addEventListener('click', function() {
            showDemoMessage(amount);
        });
    }
    
    container.appendChild(demoButton);
}

function clearPayPalButton() {
    const container = document.getElementById('paypal-button-container');
    if (container) {
        container.innerHTML = '';
        renderDemoButton();
    }
}

function showDonationSuccess(details, amount) {
    const message = `
        <div class="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-300 px-6 py-4 rounded-lg mb-6">
            <div class="flex items-center">
                <i class="fas fa-check-circle text-2xl mr-3"></i>
                <div>
                    <h3 class="font-semibold text-lg">Thank You for Your Generous Donation!</h3>
                    <p class="mt-1">Your donation of $${amount.toFixed(2)} has been processed successfully.</p>
                    <p class="text-sm mt-2">Transaction ID: ${details.id}</p>
                </div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('paypal-button-container');
    container.innerHTML = message;
    
    // Reset form after a delay
    setTimeout(() => {
        resetDonationForm();
    }, 5000);
}

function showDonationError(errorMessage) {
    const message = `
        <div class="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg mb-6">
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle text-2xl mr-3"></i>
                <div>
                    <h3 class="font-semibold text-lg">Donation Failed</h3>
                    <p class="mt-1">${errorMessage}</p>
                </div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('paypal-button-container');
    container.innerHTML = message;
    
    setTimeout(() => {
        renderDemoButton();
    }, 3000);
}

function showDonationMessage(message, type = 'info') {
    const colors = {
        info: 'bg-blue-100 dark:bg-blue-900/30 border-blue-400 text-blue-700 dark:text-blue-300',
        warning: 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-400 text-yellow-700 dark:text-yellow-300'
    };
    
    const messageHtml = `
        <div class="${colors[type]} px-6 py-4 rounded-lg mb-6">
            <div class="flex items-center">
                <i class="fas fa-info-circle text-xl mr-3"></i>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    const container = document.getElementById('paypal-button-container');
    container.innerHTML = messageHtml;
    
    setTimeout(() => {
        renderDemoButton();
    }, 3000);
}

function showDemoMessage(amount) {
    const message = `
        <div class="bg-blue-100 dark:bg-blue-900/30 border border-blue-400 text-blue-700 dark:text-blue-300 px-6 py-4 rounded-lg mb-6">
            <div class="flex items-center">
                <i class="fas fa-info-circle text-2xl mr-3"></i>
                <div>
                    <h3 class="font-semibold text-lg">Demo Mode</h3>
                    <p class="mt-1">This would process a $${amount.toFixed(2)} donation through PayPal.</p>
                    <p class="text-sm mt-2">To enable real payments, please configure your PayPal credentials.</p>
                </div>
            </div>
        </div>
    `;
    
    const container = document.getElementById('paypal-button-container');
    container.innerHTML = message;
    
    setTimeout(() => {
        renderDemoButton();
    }, 4000);
}

function resetDonationForm() {
    // Clear selected amounts
    const donationButtons = document.querySelectorAll('.donation-amount-btn');
    donationButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Hide custom amount input
    const customAmountInput = document.getElementById('custom-amount-input');
    const customAmountField = document.getElementById('custom-amount');
    
    if (customAmountInput) {
        customAmountInput.classList.add('hidden');
    }
    
    if (customAmountField) {
        customAmountField.value = '';
    }
    
    // Reset PayPal button
    renderDemoButton();
}

// Export for external use
window.PayPalDonations = {
    renderPayPalButton,
    resetDonationForm,
    showDonationSuccess,
    showDonationError
};