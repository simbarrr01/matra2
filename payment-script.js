// Payment Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment page
    initPaymentPage();
    initFileUpload();
    initInteractions();
});

// Initialize payment page
function initPaymentPage() {
    console.log('💳 Payment page loaded successfully!');
    
    // Add loading animation
    document.body.classList.add('loading');
    
    // Load deposit data
    loadDepositData();
    
    // Generate QR code
    generateQRCode();
    
    // Remove loading animation
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 1000);
}

// Load deposit data from localStorage
function loadDepositData() {
    const depositData = localStorage.getItem('depositData');
    if (depositData) {
        const data = JSON.parse(depositData);
        updatePaymentAmount(data.amount);
        updateWalletAddress(data.method);
    } else {
        // Redirect back to deposit page if no data
        window.location.href = 'deposit.html';
    }
}

// Update payment amount display
function updatePaymentAmount(amount) {
    document.getElementById('paymentAmount').textContent = `$${amount}`;
}

// Update wallet address based on payment method
function updateWalletAddress(method) {
    const addresses = {
        'BTC': '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        'USDT': 'TMoMmsrs4oKME7KLrxhd3oP14sPDFsgkk',
        'USDC': '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        'LTC': 'LTC1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        'ETH': '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
        'BUSD': '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
    };
    
    const address = addresses[method] || addresses['BTC'];
    document.getElementById('walletAddress').value = address;
}

// Generate QR code (placeholder)
function generateQRCode() {
    const qrContainer = document.getElementById('qrCode');
    
    // Create a simple QR code placeholder
    const qrCode = document.createElement('div');
    qrCode.className = 'qr-placeholder';
    qrCode.innerHTML = `
        <div class="qr-pattern">
            <div class="qr-row">
                <div class="qr-square"></div>
                <div class="qr-square"></div>
                <div class="qr-square"></div>
                <div class="qr-square"></div>
            </div>
            <div class="qr-row">
                <div class="qr-square"></div>
                <div class="qr-square empty"></div>
                <div class="qr-square empty"></div>
                <div class="qr-square"></div>
            </div>
            <div class="qr-row">
                <div class="qr-square"></div>
                <div class="qr-square empty"></div>
                <div class="qr-square empty"></div>
                <div class="qr-square"></div>
            </div>
            <div class="qr-row">
                <div class="qr-square"></div>
                <div class="qr-square"></div>
                <div class="qr-square"></div>
                <div class="qr-square"></div>
            </div>
        </div>
    `;
    
    // Add QR code styles
    const qrStyles = document.createElement('style');
    qrStyles.textContent = `
        .qr-pattern {
            display: grid;
            grid-template-rows: repeat(4, 1fr);
            gap: 2px;
            width: 100%;
            height: 100%;
        }
        
        .qr-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2px;
        }
        
        .qr-square {
            background: #000000;
            border-radius: 1px;
        }
        
        .qr-square.empty {
            background: #ffffff;
        }
    `;
    document.head.appendChild(qrStyles);
    
    qrContainer.innerHTML = '';
    qrContainer.appendChild(qrCode);
}

// Initialize file upload
function initFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });
}

// Handle file upload
function handleFileUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showNotification('Please select an image file', 'error');
        return;
    }
    
    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showNotification('File size must be less than 10MB', 'error');
        return;
    }
    
    // Show file preview
    const filePreview = document.getElementById('filePreview');
    const fileName = filePreview.querySelector('.file-name');
    
    fileName.textContent = file.name;
    filePreview.style.display = 'block';
    
    // Enable submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = false;
    
    showNotification('File uploaded successfully', 'success');
}

// Remove file
function removeFile() {
    const fileInput = document.getElementById('fileInput');
    const filePreview = document.getElementById('filePreview');
    const submitBtn = document.getElementById('submitBtn');
    
    fileInput.value = '';
    filePreview.style.display = 'none';
    submitBtn.disabled = true;
}

// Copy wallet address
function copyWalletAddress() {
    const walletAddress = document.getElementById('walletAddress');
    const copyBtn = document.querySelector('.copy-btn');
    
    walletAddress.select();
    walletAddress.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#02c076';
        
        setTimeout(() => {
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyBtn.style.background = '#f0b90b';
        }, 2000);
        
        showNotification('Wallet address copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy address', 'error');
    }
}

// Submit payment
function submitPayment() {
    const submitBtn = document.getElementById('submitBtn');
    const fileInput = document.getElementById('fileInput');
    
    // Check if file is uploaded
    if (!fileInput.files.length) {
        showNotification('Please upload payment proof first', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate submission
    setTimeout(() => {
        // Show success notification
        showNotification('Payment proof submitted successfully! Your deposit will be processed within 24 hours.', 'success');
        
        // Clear deposit data
        localStorage.removeItem('depositData');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 3000);
    }, 2000);
}

// Initialize interactions
function initInteractions() {
    // Add ripple effect to buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('submit-btn') || 
            e.target.classList.contains('copy-btn') ||
            e.target.classList.contains('remove-file')) {
            
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

console.log('🚀 Payment page fully loaded and ready!');