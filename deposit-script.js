// Deposit Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Auth guard: require login
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'signin.html';
        return;
    }

    // Initialize deposit page
    initDepositPage();
    initPaymentMethodSelector();
    initQuickAmounts();
    initDepositForm();
    initInteractions();
});

// Initialize deposit page
function initDepositPage() {
    console.log('💰 Deposit page loaded successfully!');
    
    // Add loading animation
    document.body.classList.add('loading');
    
    // Set initial payment method
    updateSelectedMethod('BTC');
}

// Payment method data
const paymentMethods = {
    BTC: {
        symbol: 'Bitcoin',
        name: 'BTC',
        logo: '₿',
        color: '#f7931a'
    },
    USDT: {
        symbol: 'Tether',
        name: 'USDT',
        logo: 'T',
        color: '#26a17b'
    },
    USDC: {
        symbol: 'USD Coin',
        name: 'USDC',
        logo: '$',
        color: '#2775ca'
    },
    LTC: {
        symbol: 'Litecoin',
        name: 'LTC',
        logo: 'Ł',
        color: '#bfbbbb'
    },
    ETH: {
        symbol: 'Ethereum',
        name: 'ETH',
        logo: 'Ξ',
        color: '#627eea'
    },
    BUSD: {
        symbol: 'Binance USD',
        name: 'BUSD',
        logo: 'B',
        color: '#f0b90b'
    }
};

// Current selected payment method
let selectedMethod = 'BTC';

// Initialize payment method selector
function initPaymentMethodSelector() {
    const methodSelector = document.getElementById('methodSelector');
    const methodDropdown = document.getElementById('methodDropdown');
    const methodOptions = document.querySelectorAll('.method-option');
    
    // Toggle dropdown
    methodSelector.addEventListener('click', function() {
        methodDropdown.classList.toggle('show');
        methodSelector.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!methodSelector.contains(e.target) && !methodDropdown.contains(e.target)) {
            methodDropdown.classList.remove('show');
            methodSelector.classList.remove('active');
        }
    });
    
    // Handle method selection
    methodOptions.forEach(option => {
        option.addEventListener('click', function() {
            const method = this.dataset.coin;
            selectPaymentMethod(method);
            methodDropdown.classList.remove('show');
            methodSelector.classList.remove('active');
        });
    });
}

// Select payment method
function selectPaymentMethod(method) {
    selectedMethod = method;
    updateSelectedMethod(method);
}

// Update selected method display
function updateSelectedMethod(method) {
    const methodInfo = paymentMethods[method];
    
    // Update selected method display
    document.getElementById('selectedCoinLogo').textContent = methodInfo.logo;
    document.getElementById('selectedCoinLogo').className = `coin-logo ${method.toLowerCase()}`;
    document.getElementById('selectedCoinSymbol').textContent = methodInfo.symbol;
    document.getElementById('selectedCoinName').textContent = methodInfo.name;
}

// Initialize quick amount buttons
function initQuickAmounts() {
    const amountBtns = document.querySelectorAll('.amount-btn');
    const amountInput = document.getElementById('depositAmount');
    
    amountBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            amountBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Set amount in input
            const amount = this.dataset.amount;
            amountInput.value = amount;
            
            // Validate form
            validateForm();
        });
    });
}

// Initialize deposit form
function initDepositForm() {
    const form = document.getElementById('depositForm');
    const amountInput = document.getElementById('depositAmount');
    const submitBtn = document.getElementById('depositSubmitBtn');
    
    // Amount input validation
    amountInput.addEventListener('input', function() {
        // Remove active class from quick amount buttons
        const amountBtns = document.querySelectorAll('.amount-btn');
        amountBtns.forEach(btn => btn.classList.remove('active'));
        
        validateForm();
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processDeposit();
    });
}

// Validate form
function validateForm() {
    const amountInput = document.getElementById('depositAmount');
    const submitBtn = document.getElementById('depositSubmitBtn');
    
    const amount = parseFloat(amountInput.value) || 0;
    
    // Validate amount
    if (amount > 0 && amount >= 10) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Process deposit
function processDeposit() {
    const amountInput = document.getElementById('depositAmount');
    const amount = parseFloat(amountInput.value);
    
    // Validate amount
    if (amount < 10) {
        showNotification('Minimum deposit amount is $10', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('depositSubmitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitBtn.disabled = true;
    
    // Simulate processing
    setTimeout(() => {
        // Store deposit data for payment page
        const depositData = {
            method: selectedMethod,
            amount: amount,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('depositData', JSON.stringify(depositData));
        
        // Redirect to payment page
        window.location.href = 'payment.html';
    }, 2000);
}

// Initialize interactions
function initInteractions() {
    // Add ripple effect to buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('amount-btn') || 
            e.target.classList.contains('deposit-submit-btn') ||
            e.target.classList.contains('method-option')) {
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = e.target.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            e.target.style.position = 'relative';
            e.target.style.overflow = 'hidden';
            e.target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#02c076' : type === 'error' ? '#f84960' : '#1e2329'};
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 6px;
        border: 1px solid ${type === 'success' ? '#02c076' : type === 'error' ? '#f84960' : '#2b3139'};
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Hide notification
function hideNotification() {
    const notification = document.getElementById('successNotification');
    if (notification) {
        notification.style.display = 'none';
    }
}

// Logout function
function logout() {
    // Clear all stored data
    localStorage.removeItem('coinBalances');
    localStorage.removeItem('mainBalance');
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('depositData');
    
    // Show logout confirmation
    if (confirm('Are you sure you want to logout?')) {
        // Redirect to index page
        window.location.href = 'index.html';
    }
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('🚀 Deposit page fully loaded and ready!');