// Withdrawal Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Auth guard: require login
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'signin.html';
        return;
    }

    // Initialize withdrawal page
    initWithdrawalPage();
    initCoinSelector();
    initFormValidation();
    initRecentWithdrawals();
    initInteractions();
});

// Initialize withdrawal page
function initWithdrawalPage() {
    console.log('💰 Withdrawal page loaded successfully!');
    
    // Add loading animation
    document.body.classList.add('loading');
    
    // Load saved balances from localStorage
    loadSavedBalances();
    
    // Set initial coin data
    updateCoinData('BTC');
    
    // Initialize form
    initFormSteps();
}

// Load saved balances from localStorage
function loadSavedBalances() {
    const savedBalances = localStorage.getItem('coinBalances');
    if (savedBalances) {
        const parsedBalances = JSON.parse(savedBalances);
        // Update coinData with saved balances
        Object.keys(parsedBalances).forEach(coin => {
            if (coinData[coin]) {
                coinData[coin].balance = parsedBalances[coin].balance;
            }
        });
    }
}

// Coin data configuration
const coinData = {
    BTC: {
        symbol: 'BTC',
        name: 'Bitcoin',
        logo: '₿',
        color: '#f7931a',
        balance: 3.00000000,
        fee: 0.00050000,
        networks: ['Bitcoin Network'],
        minWithdraw: 0.001
    },
    USDT: {
        symbol: 'USDT',
        name: 'Tether',
        logo: 'T',
        color: '#26a17b',
        balance: 35000.00000000,
        fee: 1.00000000,
        networks: ['BSC', 'Ethereum'],
        minWithdraw: 10
    },
    USDC: {
        symbol: 'USDC',
        name: 'USD Coin',
        logo: '$',
        color: '#2775ca',
        balance: 0.00000000,
        fee: 1.00000000,
        networks: ['BSC', 'Ethereum'],
        minWithdraw: 10
    },
    LTC: {
        symbol: 'LTC',
        name: 'Litecoin',
        logo: 'Ł',
        color: '#bfbbbb',
        balance: 88000.00000000,
        fee: 0.00100000,
        networks: ['Litecoin Network'],
        minWithdraw: 0.01
    }
};

// Current selected coin
let selectedCoin = 'BTC';

// Initialize coin selector
function initCoinSelector() {
    const selectedCoinElement = document.getElementById('selectedCoin');
    const coinDropdown = document.getElementById('coinDropdown');
    const coinOptions = document.querySelectorAll('.coin-option');
    
    // Toggle dropdown
    selectedCoinElement.addEventListener('click', function() {
        coinDropdown.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!selectedCoinElement.contains(e.target) && !coinDropdown.contains(e.target)) {
            coinDropdown.classList.remove('show');
        }
    });
    
    // Handle coin selection
    coinOptions.forEach(option => {
        option.addEventListener('click', function() {
            const coin = this.dataset.coin;
            selectCoin(coin);
            coinDropdown.classList.remove('show');
        });
    });
}

// Select coin
function selectCoin(coin) {
    selectedCoin = coin;
    const coinInfo = coinData[coin];
    
    // Update selected coin display
    const selectedCoinElement = document.getElementById('selectedCoin');
    selectedCoinElement.innerHTML = `
        <div class="coin-logo ${coin.toLowerCase()}">${coinInfo.logo}</div>
        <div class="coin-info">
            <span class="coin-symbol">${coinInfo.symbol}</span>
            <span class="coin-name">${coinInfo.name}</span>
        </div>
        <i class="fas fa-chevron-down"></i>
    `;
    
    // Update coin data
    updateCoinData(coin);
    
    // Update network options
    updateNetworkOptions(coin);
    
    // Reset form
    resetWithdrawalForm();
}

// Update coin data
function updateCoinData(coin) {
    const coinInfo = coinData[coin];
    
    // Update available balance
    document.getElementById('availableBalance').textContent = `${coinInfo.balance.toFixed(8)} ${coin}`;
    
    // Update fee
    document.getElementById('withdrawFee').textContent = `${coinInfo.fee.toFixed(8)} ${coin}`;
    
    // Update confirmation details
    document.getElementById('confirmCoin').textContent = coin;
    document.getElementById('confirmFee').textContent = `${coinInfo.fee.toFixed(8)} ${coin}`;
}

// Update network options
function updateNetworkOptions(coin) {
    const networkSelect = document.getElementById('networkSelect');
    const coinInfo = coinData[coin];
    
    // Clear existing options
    networkSelect.innerHTML = '';
    
    // Add network options
    coinInfo.networks.forEach(network => {
        const option = document.createElement('option');
        option.value = network;
        option.textContent = network;
        networkSelect.appendChild(option);
    });
}

// Initialize form steps
function initFormSteps() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach((step, index) => {
        if (index === 0) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Initialize form validation
function initFormValidation() {
    const amountInput = document.getElementById('withdrawAmount');
    const addressInput = document.getElementById('withdrawAddress');
    const maxBtn = document.querySelector('.max-btn');
    const securityCheck = document.getElementById('securityCheck');
    const withdrawBtn = document.getElementById('withdrawBtn');
    
    // Max button functionality
    maxBtn.addEventListener('click', function() {
        const coinInfo = coinData[selectedCoin];
        const maxAmount = coinInfo.balance - coinInfo.fee;
        amountInput.value = Math.max(0, maxAmount).toFixed(8);
        updateReceiveAmount();
    });
    
    // Amount input validation
    amountInput.addEventListener('input', function() {
        updateReceiveAmount();
        validateForm();
    });
    
    // Address input validation
    addressInput.addEventListener('input', function() {
        validateForm();
    });
    
    // Security check
    securityCheck.addEventListener('change', function() {
        validateForm();
    });
    
    // Withdraw button
    withdrawBtn.addEventListener('click', function() {
        processWithdrawal();
    });
}

// Update receive amount
function updateReceiveAmount() {
    const amountInput = document.getElementById('withdrawAmount');
    const amount = parseFloat(amountInput.value) || 0;
    const coinInfo = coinData[selectedCoin];
    const fee = coinInfo.fee;
    const receiveAmount = Math.max(0, amount - fee);
    
    document.getElementById('receiveAmount').textContent = `${receiveAmount.toFixed(8)} ${selectedCoin}`;
    
    // Update confirmation details
    document.getElementById('confirmAmount').textContent = `${amount.toFixed(8)} ${selectedCoin}`;
}

// Validate form
function validateForm() {
    const amountInput = document.getElementById('withdrawAmount');
    const addressInput = document.getElementById('withdrawAddress');
    const securityCheck = document.getElementById('securityCheck');
    const withdrawBtn = document.getElementById('withdrawBtn');
    
    const amount = parseFloat(amountInput.value) || 0;
    const address = addressInput.value.trim();
    const coinInfo = coinData[selectedCoin];
    
    let isValid = true;
    
    // Validate amount
    if (amount <= 0) {
        isValid = false;
    } else if (amount < coinInfo.minWithdraw) {
        isValid = false;
    } else if (amount > coinInfo.balance) {
        isValid = false;
    }
    
    // Validate address
    if (address.length < 10) {
        isValid = false;
    }
    
    // Validate security check
    if (!securityCheck.checked) {
        isValid = false;
    }
    
    // Update button state
    withdrawBtn.disabled = !isValid;
}

// Process withdrawal
function processWithdrawal() {
    const amountInput = document.getElementById('withdrawAmount');
    const addressInput = document.getElementById('withdrawAddress');
    const networkSelect = document.getElementById('networkSelect');
    
    const amount = parseFloat(amountInput.value);
    const address = addressInput.value.trim();
    const network = networkSelect.value;
    const coinInfo = coinData[selectedCoin];
    
    // Validate sufficient balance
    if (amount > coinInfo.balance) {
        showNotification('Insufficient balance for withdrawal', 'error');
        return;
    }
    
    // Show email verification modal
    showEmailVerificationModal(amount, address, network);
}

// Email verification functions
function showEmailVerificationModal(amount, address, network) {
    const modal = document.createElement('div');
    modal.className = 'verification-modal-overlay';
    modal.innerHTML = `
        <div class="verification-modal">
            <div class="modal-header">
                <h3>Email Verification Required</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-content">
                <div class="verification-info">
                    <div class="email-icon">
                        <i class="fas fa-envelope"></i>
                    </div>
                    <p>Please enter the verification code sent to your email address:</p>
                    <p class="email-address">jamieshawld@gmail.com</p>
                </div>
                
                <div class="verification-form">
                    <div class="input-group">
                        <input type="text" id="verificationCode" placeholder="Enter 6-digit code" maxlength="6" class="verification-input">
                    </div>
                    
                    <div class="verification-actions">
                        <button class="resend-btn" onclick="resendVerificationCode()">
                            <i class="fas fa-redo"></i>
                            Resend Code
                        </button>
                        <button class="verify-btn" data-amount="${amount}" data-address="${address}" data-network="${network}">
                            <i class="fas fa-check"></i>
                            Verify & Withdraw
                        </button>
                    </div>
                </div>
                
                <div class="withdrawal-summary">
                    <h4>Withdrawal Summary</h4>
                    <div class="summary-item">
                        <span>Amount:</span>
                        <span>${amount.toFixed(8)} ${selectedCoin}</span>
                    </div>
                    <div class="summary-item">
                        <span>Network:</span>
                        <span>${network}</span>
                    </div>
                    <div class="summary-item">
                        <span>Address:</span>
                        <span class="address-preview">${address.slice(0, 6)}...${address.slice(-6)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .verification-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        }
        
        .verification-modal {
            background: #1e2329;
            border: 1px solid #2b3139;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid #2b3139;
        }
        
        .modal-header h3 {
            color: #ffffff;
            margin: 0;
            font-size: 18px;
            font-weight: 600;
        }
        
        .close-modal {
            background: none;
            border: none;
            color: #848e9c;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s ease;
        }
        
        .close-modal:hover {
            background: #2b3139;
            color: #ffffff;
        }
        
        .modal-content {
            padding: 24px;
        }
        
        .verification-info {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .email-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #02c076, #00a86b);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            font-size: 24px;
            color: #ffffff;
        }
        
        .verification-info p {
            color: #848e9c;
            margin: 8px 0;
            font-size: 14px;
        }
        
        .email-address {
            color: #02c076 !important;
            font-weight: 600;
            font-size: 16px !important;
        }
        
        .verification-form {
            margin-bottom: 24px;
        }
        
        .input-group {
            margin-bottom: 20px;
        }
        
        .verification-input {
            width: 100%;
            padding: 16px;
            background: #0b0e11;
            border: 1px solid #2b3139;
            border-radius: 8px;
            color: #ffffff;
            font-size: 18px;
            text-align: center;
            letter-spacing: 4px;
            font-weight: 600;
            transition: all 0.2s ease;
        }
        
        .verification-input:focus {
            outline: none;
            border-color: #02c076;
            box-shadow: 0 0 0 3px rgba(2, 192, 118, 0.1);
        }
        
        .verification-actions {
            display: flex;
            gap: 12px;
        }
        
        .resend-btn, .verify-btn {
            flex: 1;
            padding: 12px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .resend-btn {
            background: #2b3139;
            color: #848e9c;
            border: 1px solid #2b3139;
        }
        
        .resend-btn:hover {
            background: #3c4043;
            color: #ffffff;
        }
        
        .verify-btn {
            background: linear-gradient(135deg, #02c076, #00a86b);
            color: #ffffff;
        }
        
        .verify-btn:hover {
            background: linear-gradient(135deg, #00a86b, #02c076);
            transform: translateY(-1px);
        }
        
        .verify-btn:disabled {
            background: #2b3139;
            color: #848e9c;
            cursor: not-allowed;
            transform: none;
        }
        
        .withdrawal-summary {
            background: #0b0e11;
            border: 1px solid #2b3139;
            border-radius: 8px;
            padding: 16px;
        }
        
        .withdrawal-summary h4 {
            color: #ffffff;
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .summary-item:last-child {
            margin-bottom: 0;
        }
        
        .summary-item span:first-child {
            color: #848e9c;
            font-size: 14px;
        }
        
        .summary-item span:last-child {
            color: #ffffff;
            font-size: 14px;
            font-weight: 600;
        }
        
        .address-preview {
            font-family: 'Courier New', monospace;
            background: #1e2329;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
    `;
    document.head.appendChild(modalStyle);
    
    // Close modal functionality
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            modal.remove();
            modalStyle.remove();
        }
    });
    
    // Auto-focus on verification code input
    setTimeout(() => {
        const codeInput = modal.querySelector('#verificationCode');
        if (codeInput) {
            codeInput.focus();
        }
    }, 100);
    
    document.body.appendChild(modal);
    
    // Add event listener for verify button after modal is added
    setTimeout(() => {
        const verifyBtn = modal.querySelector('.verify-btn');
        if (verifyBtn) {
            verifyBtn.addEventListener('click', function() {
                const amount = this.getAttribute('data-amount');
                const address = this.getAttribute('data-address');
                const network = this.getAttribute('data-network');
                verifyWithdrawalCode(amount, address, network);
            });
        }
    }, 50);
}

function verifyWithdrawalCode(amount, address, network) {
    const codeInput = document.getElementById('verificationCode');
    const enteredCode = codeInput.value.trim();
    const correctCode = '309021';
    
    if (enteredCode === correctCode) {
        processWithdrawalWithCode(parseFloat(amount), address, network);
    } else {
        showNotification('Invalid verification code. Please try again.', 'error');
        codeInput.style.borderColor = '#f84960';
        codeInput.style.boxShadow = '0 0 0 3px rgba(248, 73, 96, 0.1)';
        
        setTimeout(() => {
            codeInput.style.borderColor = '#3c4043';
            codeInput.style.boxShadow = 'none';
        }, 2000);
    }
}

function processWithdrawalWithCode(amount, address, network) {
    const verifyBtn = document.querySelector('.verify-btn');
    
    verifyBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    verifyBtn.disabled = true;
    
    // Simulate processing
    setTimeout(() => {
        // Create withdrawal record
        const withdrawal = {
            id: generateTxId(),
            coin: selectedCoin,
            amount: amount,
            network: network,
            address: address,
            status: 'Completed',
            date: new Date().toISOString()
        };
        
        // Add to recent withdrawals
        addRecentWithdrawal(withdrawal);
        
        // Update balances
        updateCoinBalance(selectedCoin, amount);
        updateMainBalance();
        
        // Close modal
        const modal = document.querySelector('.verification-modal-overlay');
        if (modal) {
            modal.remove();
        }
        
        // Show success message
        showNotification('Withdrawal processed successfully!', 'success');
        
        // Reset form
        resetWithdrawalForm();

        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
    }, 3000);
}

function resendVerificationCode() {
    const resendBtn = document.querySelector('.resend-btn');
    
    resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    resendBtn.disabled = true;
    
    setTimeout(() => {
        resendBtn.innerHTML = '<i class="fas fa-redo"></i> Resend Code';
        resendBtn.disabled = false;
        showNotification('Verification code resent to your email', 'success');
    }, 2000);
}

// Update coin balance and persist to localStorage
function updateCoinBalance(coin, amount) {
    coinData[coin].balance -= amount;
    updateCoinData(coin);
    
    // Save to localStorage
    const coinBalances = {};
    Object.entries(coinData).forEach(([key, data]) => {
        coinBalances[data.symbol] = {
            balance: data.balance,
            symbol: data.symbol,
            name: data.name,
            logo: data.logo,
            color: data.color
        };
    });
    localStorage.setItem('coinBalances', JSON.stringify(coinBalances));
}

// Update main balance and notify dashboard
function updateMainBalance() {
    const currentPrices = {
        BTC: 43250,
        USDT: 1,
        USDC: 1,
        LTC: 65
    };
    
    let totalValue = 0;
    let totalBTC = 0;
    
    Object.entries(coinData).forEach(([coin, data]) => {
        const price = currentPrices[coin] || 1;
        const value = data.balance * price;
        totalValue += value;
        
        if (coin === 'BTC') {
            totalBTC += data.balance;
        } else {
            totalBTC += value / (currentPrices.BTC || 43250);
        }
    });
    
    const mainBalanceData = {
        totalBTC: totalBTC,
        totalValue: totalValue,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('mainBalance', JSON.stringify(mainBalanceData));
    
    // Notify dashboard if it's open
    if (window.opener && window.opener.updateDashboardBalance) {
        window.opener.updateDashboardBalance(mainBalanceData);
    }
}

// Reset withdrawal form
function resetWithdrawalForm() {
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('withdrawAddress').value = '';
    document.getElementById('securityCheck').checked = false;
    document.getElementById('receiveAmount').textContent = `0.00000000 ${selectedCoin}`;
    document.getElementById('confirmAmount').textContent = `0.00000000 ${selectedCoin}`;
    document.getElementById('confirmAddress').textContent = '-';
    
    const withdrawBtn = document.getElementById('withdrawBtn');
    withdrawBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Withdraw';
    withdrawBtn.disabled = true;
}

// Generate transaction ID
function generateTxId() {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 64; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

// Recent withdrawals data
const recentWithdrawals = [
    {
        id: '0x29b8f7a2c3d4e5f67890123456789012345678901234567890123456789077d8f',
        coin: 'USDT',
        amount: 30.98,
        network: 'BSC',
        address: '0xb34a5c6d7e8f901234567890123456789012345678901234567890123456789052a82',
        status: 'Completed',
        date: '2025-09-05T20:51:00Z'
    },
    {
        id: '0x6c2a3b4c5d6e7f890123456789012345678901234567890123456789012345670e',
        coin: 'USDT',
        amount: 17.98,
        network: 'BSC',
        address: '0xdca1b2c3d4e5f6789012345678901234567890123456789012345678901234567892aed',
        status: 'Completed',
        date: '2025-08-10T12:31:00Z'
    },
    {
        id: '0x39e4f5a6b7c8d901234567890123456789012345678901234567890123456789069ab0',
        coin: 'USDT',
        amount: 300.764853,
        network: 'BSC',
        address: '0xb34a5c6d7e8f901234567890123456789012345678901234567890123456789052a82',
        status: 'Completed',
        date: '2025-08-10T05:50:00Z'
    },
    {
        id: '0x047a8b9c0d1e2f3456789012345678901234567890123456789012345678901234ec4df',
        coin: 'USDT',
        amount: 59.98,
        network: 'BSC',
        address: '0xb34a5c6d7e8f901234567890123456789012345678901234567890123456789052a82',
        status: 'Completed',
        date: '2025-08-08T07:44:00Z'
    },
    {
        id: '0x008c9d0e1f2a3b4567890123456789012345678901234567890123456789012345c3f3f',
        coin: 'USDT',
        amount: 18.802316,
        network: 'BASE',
        address: '0x10E5f6a7b8c9d0123456789012345678901234567890123456789012345678901234bC5DA',
        status: 'Completed',
        date: '2025-08-07T21:15:00Z'
    },
    {
        id: '0xc3c4d5e6f7a8b901234567890123456789012345678901234567890123456789012373fce',
        coin: 'USDT',
        amount: 19.812831,
        network: 'BASE',
        address: '0x8E3f4a5b6c7d890123456789012345678901234567890123456789012345678901234c5D44',
        status: 'Completed',
        date: '2025-08-07T17:04:00Z'
    },
    {
        id: '0xa1b2c3d4e5f6789012345678901234567890123456789012345678901234567890123456',
        coin: 'BTC',
        amount: 0.5,
        network: 'Bitcoin Network',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        status: 'Completed',
        date: '2025-08-05T14:30:00Z'
    },
    {
        id: '0xb2c3d4e5f6a7890123456789012345678901234567890123456789012345678901234567',
        coin: 'LTC',
        amount: 100.0,
        network: 'Litecoin Network',
        address: 'LTC1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        status: 'Completed',
        date: '2025-08-03T09:15:00Z'
    },
    {
        id: '0xc3d4e5f6a7b8901234567890123456789012345678901234567890123456789012345678',
        coin: 'BTC',
        amount: 1.25,
        network: 'Bitcoin Network',
        address: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
        status: 'Completed',
        date: '2025-08-01T16:45:00Z'
    },
    {
        id: '0xd4e5f6a7b8c9012345678901234567890123456789012345678901234567890123456789',
        coin: 'LTC',
        amount: 250.75,
        network: 'Litecoin Network',
        address: 'ltc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sL5k7',
        status: 'Completed',
        date: '2025-07-30T11:20:00Z'
    }
];

// Initialize recent withdrawals
function initRecentWithdrawals() {
    const tableBody = document.getElementById('withdrawalsTableBody');
    tableBody.innerHTML = '';
    
    recentWithdrawals.forEach(withdrawal => {
        const row = createWithdrawalRow(withdrawal);
        tableBody.appendChild(row);
    });
}

// Create withdrawal row
function createWithdrawalRow(withdrawal) {
    const row = document.createElement('div');
    row.className = 'withdrawal-row';
    
    const date = new Date(withdrawal.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    
    const shortAddress = `${withdrawal.address.slice(0, 6)}...${withdrawal.address.slice(-6)}`;
    const shortTxId = `${withdrawal.id.slice(0, 6)}...${withdrawal.id.slice(-6)}`;
    
    row.innerHTML = `
        <div class="asset-date">
            <div class="coin-logo ${withdrawal.coin.toLowerCase()}">${coinData[withdrawal.coin]?.logo || '?'}</div>
            <div class="asset-date-info">
                <h4>${withdrawal.coin}</h4>
                <span>${formattedDate} ${formattedTime}</span>
            </div>
        </div>
        <div class="amount">${withdrawal.amount.toFixed(8)}</div>
        <div class="network">${withdrawal.network}</div>
        <div class="address-info">
            <span class="address">${shortAddress}</span>
            <div class="address-actions">
                <button class="address-action" onclick="viewOnExplorer('${withdrawal.address}')" title="View on Explorer">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="address-action" onclick="copyToClipboard('${withdrawal.address}')" title="Copy Address">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        </div>
        <div class="txid-info">
            <span class="txid">${shortTxId}</span>
            <div class="address-actions">
                <button class="address-action" onclick="viewOnExplorer('${withdrawal.id}')" title="View on Explorer">
                    <i class="fas fa-external-link-alt"></i>
                </button>
                <button class="address-action" onclick="copyToClipboard('${withdrawal.id}')" title="Copy TxID">
                    <i class="fas fa-copy"></i>
                </button>
            </div>
        </div>
        <div class="status ${withdrawal.status.toLowerCase()}">${withdrawal.status}</div>
    `;
    
    return row;
}

// Add recent withdrawal
function addRecentWithdrawal(withdrawal) {
    recentWithdrawals.unshift(withdrawal);
    
    // Keep only last 10
    if (recentWithdrawals.length > 10) {
        recentWithdrawals.pop();
    }
    
    // Refresh table
    initRecentWithdrawals();
}

// Initialize interactions
function initInteractions() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parent = this.closest('.withdrawals-tabs, .withdraw-tabs');
            const buttons = parent.querySelectorAll('.tab-btn');
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Hide error notices checkbox
    const hideErrorsCheckbox = document.getElementById('hideErrors');
    if (hideErrorsCheckbox) {
        hideErrorsCheckbox.addEventListener('change', function() {
            // This would filter out error withdrawals in a real app
            console.log('Hide error notices:', this.checked);
        });
    }
}

// Utility functions
function viewOnExplorer(value) {
    // In a real app, this would open the blockchain explorer
    showNotification('Opening blockchain explorer...');
    console.log('View on explorer:', value);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    }).catch(() => {
        showNotification('Failed to copy to clipboard');
    });
}

// Logout function
function logout() {
    // Clear all stored data
    localStorage.removeItem('coinBalances');
    localStorage.removeItem('mainBalance');
    localStorage.removeItem('userLoggedIn');
    
    // Show logout confirmation
    if (confirm('Are you sure you want to logout?')) {
        // Redirect to index page
        window.location.href = 'index.html';
    }
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
`;
document.head.appendChild(style);

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit withdrawal
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const withdrawBtn = document.getElementById('withdrawBtn');
        if (!withdrawBtn.disabled) {
            withdrawBtn.click();
        }
    }
    
    // Escape to close dropdowns
    if (e.key === 'Escape') {
        const dropdowns = document.querySelectorAll('.coin-dropdown.show');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// Add click effects to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('withdraw-btn') || e.target.classList.contains('max-btn')) {
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

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

console.log('🚀 Withdrawal page fully loaded and ready!');