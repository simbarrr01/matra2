// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Auth guard: require login before loading dashboard
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'signin.html';
        return;
    }

    // Initialize dashboard
    initDashboard();
    initBalanceChart();
    initAssetTable();
    initRealTimeUpdates();
    initInteractions();
});

// Dashboard initialization
function initDashboard() {
    console.log('📊 Dashboard loaded successfully!');
    
    // Add loading animation
    document.body.classList.add('loading');
    
    // Initialize user data
    updateUserInfo();
    
    // Calculate and display total balance
    calculateTotalBalance();
}

// User assets data
const userAssets = {
    bitcoin: {
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 3,
        logo: '₿',
        color: '#f7931a'
    },
    usdt: {
        symbol: 'USDT',
        name: 'Tether',
        amount: 35000,
        logo: 'T',
        color: '#26a17b'
    },
    litecoin: {
        symbol: 'LTC',
        name: 'Litecoin',
        amount: 88000,
        logo: 'Ł',
        color: '#bfbbbb'
    }
};

// Mock current prices (in real app, these would come from API)
const currentPrices = {
    BTC: 43250.00,
    USDT: 1.00,
    LTC: 98.50
};

// Mock 24h changes (in real app, these would come from API)
const priceChanges = {
    BTC: 2.45,
    USDT: 0.01,
    LTC: -1.23
};

// Initialize asset table
function initAssetTable() {
    const tableBody = document.getElementById('assetsTableBody');
    tableBody.innerHTML = '';
    
    Object.entries(userAssets).forEach(([key, asset]) => {
        const price = currentPrices[asset.symbol];
        const change = priceChanges[asset.symbol];
        const value = asset.amount * price;
        
        const row = createAssetRow(asset, price, change, value);
        tableBody.appendChild(row);
    });
}

// Create asset row
function createAssetRow(asset, price, change, value) {
    const row = document.createElement('div');
    row.className = 'asset-row';
    
    const changeClass = change >= 0 ? 'positive' : 'negative';
    const changeSymbol = change >= 0 ? '+' : '';
    
    row.innerHTML = `
        <div class="asset-info">
            <div class="asset-logo ${asset.symbol.toLowerCase()}">${asset.logo}</div>
            <div class="asset-details">
                <h4>${asset.symbol}</h4>
                <span>${asset.name}</span>
            </div>
        </div>
        <div class="asset-amount">${formatNumber(asset.amount)}</div>
        <div class="asset-price">$${formatPrice(price)}</div>
        <div class="asset-value">$${formatValue(value)}</div>
        <div class="asset-change ${changeClass}">${changeSymbol}${change.toFixed(2)}%</div>
        <div class="asset-action">
            <button class="trade-btn" onclick="tradeAsset('${asset.symbol}')">Trade</button>
        </div>
    `;
    
    return row;
}

// Calculate total balance
function calculateTotalBalance() {
    let totalValue = 0;
    let totalBTC = 0;
    
    Object.entries(userAssets).forEach(([key, asset]) => {
        const price = currentPrices[asset.symbol];
        const value = asset.amount * price;
        totalValue += value;
        
        // Convert to BTC equivalent
        if (asset.symbol === 'BTC') {
            totalBTC += asset.amount;
        } else {
            totalBTC += value / currentPrices.BTC;
        }
    });
    
    // Update balance display
    document.getElementById('totalBalance').textContent = `${totalBTC.toFixed(8)} BTC`;
    document.getElementById('totalFiat').textContent = `≈ $${formatValue(totalValue)}`;
    
    // Update today's PnL (mock data)
    const pnl = (totalValue * 0.02); // 2% gain for demo
    const pnlElement = document.getElementById('todayPnl');
    pnlElement.textContent = `+ $${formatValue(pnl)} (2.00%)`;
    pnlElement.style.color = '#02c076';
}

// Initialize balance chart
function initBalanceChart() {
    const canvas = document.getElementById('balanceChart');
    const ctx = canvas.getContext('2d');
    
    // Mock chart data
    const data = [100, 95, 98, 102, 105, 108, 110, 115, 112, 118, 120, 125];
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up chart
    ctx.strokeStyle = '#f0b90b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Draw line chart
    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (value / Math.max(...data)) * height;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Add gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(240, 185, 11, 0.3)');
    gradient.addColorStop(1, 'rgba(240, 185, 11, 0.05)');
    
    ctx.fillStyle = gradient;
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
}

// Real-time updates (simulated)
function initRealTimeUpdates() {
    // Update prices every 5 seconds
    setInterval(() => {
        updatePrices();
        initAssetTable();
        calculateTotalBalance();
    }, 5000);
    
    // Update chart every 10 seconds
    setInterval(() => {
        initBalanceChart();
    }, 10000);
}

// Update prices (simulated)
function updatePrices() {
    Object.keys(currentPrices).forEach(symbol => {
        // Simulate price changes
        const change = (Math.random() - 0.5) * 0.02; // ±1% change
        currentPrices[symbol] *= (1 + change);
        
        // Update 24h changes
        priceChanges[symbol] = (Math.random() - 0.5) * 10; // ±5% change
    });
}

// Initialize interactions
function initInteractions() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter assets based on tab
            filterAssets(this.textContent.trim());
        });
    });
    
    // Copy UID functionality
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', function() {
            const uid = '571561862';
            navigator.clipboard.writeText(uid).then(() => {
                showNotification('UID copied to clipboard!');
            });
        });
    }
    
    // Eye button for balance visibility
    const eyeBtn = document.querySelector('.eye-btn');
    if (eyeBtn) {
        eyeBtn.addEventListener('click', function() {
            toggleBalanceVisibility();
        });
    }
    
    // Currency selector
    const currencySelector = document.querySelector('.currency-selector');
    if (currencySelector) {
        currencySelector.addEventListener('click', function() {
            showCurrencySelector();
        });
    }
}

// Filter assets based on tab
function filterAssets(tab) {
    const tableBody = document.getElementById('assetsTableBody');
    const rows = tableBody.querySelectorAll('.asset-row');
    
    rows.forEach(row => {
        row.style.display = 'grid';
        
        // Simple filtering logic
        if (tab === 'Hot') {
            // Show only assets with positive change
            const changeElement = row.querySelector('.asset-change');
            const change = parseFloat(changeElement.textContent);
            if (change < 0) {
                row.style.display = 'none';
            }
        } else if (tab === 'Top Gainers') {
            // Show only assets with >2% gain
            const changeElement = row.querySelector('.asset-change');
            const change = parseFloat(changeElement.textContent);
            if (change < 2) {
                row.style.display = 'none';
            }
        }
    });
}

// Toggle balance visibility
function toggleBalanceVisibility() {
    const balanceAmount = document.getElementById('totalBalance');
    const balanceFiat = document.getElementById('totalFiat');
    const eyeBtn = document.querySelector('.eye-btn i');
    
    if (balanceAmount.textContent === '•••••••• BTC') {
        // Show balance
        calculateTotalBalance();
        eyeBtn.className = 'fas fa-eye';
    } else {
        // Hide balance
        balanceAmount.textContent = '•••••••• BTC';
        balanceFiat.textContent = '≈ $••••••';
        eyeBtn.className = 'fas fa-eye-slash';
    }
}

// Show currency selector
function showCurrencySelector() {
    const currencies = ['BTC', 'ETH', 'USDT', 'USD'];
    const currentCurrency = 'BTC';
    
    // Simple alert for demo (in real app, use a proper dropdown)
    const selectedCurrency = prompt(`Select currency:\n${currencies.map((c, i) => `${i + 1}. ${c}`).join('\n')}`);
    
    if (selectedCurrency && currencies[parseInt(selectedCurrency) - 1]) {
        const currency = currencies[parseInt(selectedCurrency) - 1];
        updateCurrencyDisplay(currency);
    }
}

// Update currency display
function updateCurrencyDisplay(currency) {
    // This would update the balance display based on selected currency
    console.log(`Currency changed to: ${currency}`);
    showNotification(`Currency changed to ${currency}`);
}

// Trade asset function
function tradeAsset(symbol) {
    const asset = Object.values(userAssets).find(a => a.symbol === symbol);
    if (asset) {
        showNotification(`Opening trade interface for ${asset.name}...`);
        // In real app, this would open a trading interface
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #1e2329;
        color: #eaecef;
        padding: 12px 20px;
        border-radius: 6px;
        border: 1px solid #2b3139;
        z-index: 10000;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
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

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    } else {
        return num.toFixed(2);
    }
}

function formatPrice(price) {
    if (price >= 1000) {
        return price.toFixed(2);
    } else if (price >= 1) {
        return price.toFixed(4);
    } else {
        return price.toFixed(6);
    }
}

function formatValue(value) {
    if (value >= 1000000) {
        return (value / 1000000).toFixed(2) + 'M';
    } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
    } else {
        return value.toFixed(2);
    }
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

// Update user info
function updateUserInfo() {
    // This would typically fetch user data from an API
    console.log('User info updated');
}

// Handle window resize
window.addEventListener('resize', function() {
    // Redraw chart on resize
    setTimeout(() => {
        initBalanceChart();
    }, 100);
});

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + D for deposit
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        showNotification('Opening deposit interface...');
    }
    
    // Ctrl/Cmd + W for withdraw
    if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        showNotification('Opening withdraw interface...');
    }
    
    // Escape to clear notifications
    if (e.key === 'Escape') {
        const notifications = document.querySelectorAll('[style*="position: fixed"]');
        notifications.forEach(notification => {
            if (notification.textContent.includes('copied') || notification.textContent.includes('changed')) {
                notification.remove();
            }
        });
    }
});

// Add click effects to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('action-btn') || e.target.classList.contains('trade-btn')) {
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

// Initialize tooltips
function initTooltips() {
    const elements = document.querySelectorAll('[title]');
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            showTooltip(this);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });
}

function showTooltip(element) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = element.getAttribute('title');
    tooltip.style.cssText = `
        position: absolute;
        background: #1e2329;
        color: #eaecef;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        pointer-events: none;
        border: 1px solid #2b3139;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.remove();
    }
}

// Initialize tooltips
initTooltips();

console.log('🚀 Dashboard fully loaded and ready!');