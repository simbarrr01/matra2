// Crypto Website Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initSmoothScrolling();
    initCryptoSelection();
    initFloatingAnimations();
    initChartAnimations();
    initScrollAnimations();
    initButtonInteractions();
    initMobileMenu();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Crypto selection functionality
function initCryptoSelection() {
    const cryptoOptions = document.querySelectorAll('.crypto-option');
    const selectedCryptos = new Set();
    
    cryptoOptions.forEach(option => {
        option.addEventListener('click', function() {
            const crypto = this.dataset.crypto;
            
            if (selectedCryptos.has(crypto)) {
                selectedCryptos.delete(crypto);
                this.classList.remove('selected');
                this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                this.style.transform = 'translateY(0)';
            } else {
                selectedCryptos.add(crypto);
                this.classList.add('selected');
                this.style.borderColor = '#00ff88';
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 5px 15px rgba(0, 255, 136, 0.3)';
            }
            
            // Add visual feedback
            this.style.transition = 'all 0.3s ease';
            
            // Update portfolio summary (if needed)
            updatePortfolioSummary(selectedCryptos);
        });
    });
}

// Update portfolio summary
function updatePortfolioSummary(selectedCryptos) {
    console.log('Selected cryptocurrencies:', Array.from(selectedCryptos));
    
    // You can add logic here to update a portfolio summary section
    // For example, showing total value, selected count, etc.
}

// Enhanced floating animations
function initFloatingAnimations() {
    const floatingIcons = document.querySelectorAll('.crypto-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = (Math.random() - 0.5) * 20;
            const randomY = (Math.random() - 0.5) * 20;
            
            icon.style.transform = `translate(${randomX}px, ${randomY}px)`;
        }, 3000 + index * 500);
        
        // Add hover effects
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.zIndex = '10';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
    });
}

// Chart animations
function initChartAnimations() {
    // Animate candlestick chart
    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle, index) => {
        candle.style.opacity = '0';
        candle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            candle.style.transition = 'all 0.5s ease';
            candle.style.opacity = '1';
            candle.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animate market chart line
    const chartLine = document.querySelector('.chart-line');
    if (chartLine) {
        setTimeout(() => {
            chartLine.style.background = 'linear-gradient(90deg, transparent 0%, #00ff88 20%, #00ff88 80%, transparent 100%)';
            chartLine.style.transition = 'background 2s ease';
        }, 1000);
    }
    
    // Animate price indicator
    const priceIndicator = document.querySelector('.price-indicator');
    if (priceIndicator) {
        setTimeout(() => {
            priceIndicator.style.opacity = '0';
            priceIndicator.style.transform = 'translateX(20px)';
            priceIndicator.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                priceIndicator.style.opacity = '1';
                priceIndicator.style.transform = 'translateX(0)';
            }, 500);
        }, 2000);
    }
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .partner-logo, .crypto-option, .contact-box');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
    
    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// Button interactions
function initButtonInteractions() {
    const buttons = document.querySelectorAll('.btn-get-started, .btn-demo');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Handle button actions
            if (this.classList.contains('btn-demo')) {
                showDemoModal();
            } else if (this.classList.contains('btn-get-started')) {
                showGetStartedModal();
            }
        });
    });
    
    // Add ripple effect CSS
    const style = document.createElement('style');
    style.textContent = `
        .btn-get-started, .btn-demo {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Modal functions
function showDemoModal() {
    const modal = createModal('Request a Demo', `
        <form class="demo-form">
            <div class="form-group">
                <label for="name">Full Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone">
            </div>
            <div class="form-group">
                <label for="experience">Trading Experience</label>
                <select id="experience" name="experience">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>
            <button type="submit" class="submit-btn">Request Demo</button>
        </form>
    `);
    
    document.body.appendChild(modal);
}

function showGetStartedModal() {
    const modal = createModal('Get Started', `
        <div class="get-started-content">
            <h3>Choose Your Plan</h3>
            <div class="plans">
                <div class="plan">
                    <h4>Basic</h4>
                    <div class="price">Free</div>
                    <ul>
                        <li>Basic trading features</li>
                        <li>Limited crypto selection</li>
                        <li>Community support</li>
                    </ul>
                    <button class="select-plan" data-plan="basic">Select Plan</button>
                </div>
                <div class="plan featured">
                    <h4>Pro</h4>
                    <div class="price">$29/month</div>
                    <ul>
                        <li>Advanced trading tools</li>
                        <li>All cryptocurrencies</li>
                        <li>Priority support</li>
                        <li>Market analysis</li>
                    </ul>
                    <button class="select-plan" data-plan="pro">Select Plan</button>
                </div>
                <div class="plan">
                    <h4>Enterprise</h4>
                    <div class="price">Custom</div>
                    <ul>
                        <li>Custom solutions</li>
                        <li>Dedicated support</li>
                        <li>API access</li>
                        <li>White-label options</li>
                    </ul>
                    <button class="select-plan" data-plan="enterprise">Contact Sales</button>
                </div>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-content">
                ${content}
            </div>
        </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        }
        
        .modal {
            background: #1a1a1a;
            border-radius: 12px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .modal-header h2 {
            color: #ffffff;
            margin: 0;
        }
        
        .close-modal {
            background: none;
            border: none;
            color: #ffffff;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            padding: 20px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            color: #ffffff;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 12px;
            background: #0d0d0d;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            color: #ffffff;
            font-size: 14px;
        }
        
        .form-group input:focus,
        .form-group select:focus {
            outline: none;
            border-color: #00ff88;
        }
        
        .submit-btn {
            width: 100%;
            background: #00ff88;
            color: #000000;
            border: none;
            padding: 12px;
            border-radius: 6px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .submit-btn:hover {
            background: #00cc6a;
        }
        
        .plans {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .plan {
            background: #0d0d0d;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 20px;
            text-align: center;
        }
        
        .plan.featured {
            border-color: #00ff88;
            transform: scale(1.05);
        }
        
        .plan h4 {
            color: #ffffff;
            margin-bottom: 10px;
        }
        
        .plan .price {
            color: #00ff88;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .plan ul {
            list-style: none;
            padding: 0;
            margin-bottom: 20px;
        }
        
        .plan li {
            color: #cccccc;
            margin-bottom: 5px;
            font-size: 14px;
        }
        
        .select-plan {
            width: 100%;
            background: #333333;
            color: #ffffff;
            border: none;
            padding: 10px;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        
        .select-plan:hover {
            background: #00ff88;
            color: #000000;
        }
        
        @keyframes fadeIn {
            to {
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Close modal functionality
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('close-modal')) {
            modal.remove();
        }
    });
    
    // Handle form submissions
    const form = modal.querySelector('.demo-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Demo request submitted! We\'ll contact you soon.');
            modal.remove();
        });
    }
    
    // Handle plan selection
    const planButtons = modal.querySelectorAll('.select-plan');
    planButtons.forEach(button => {
        button.addEventListener('click', function() {
            const plan = this.dataset.plan;
            alert(`Selected ${plan} plan! Redirecting to signup...`);
            modal.remove();
        });
    });
    
    return modal;
}

// Mobile menu functionality
function initMobileMenu() {
    // Create mobile menu button
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    
    if (window.innerWidth <= 768) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.cssText = `
            background: none;
            border: none;
            color: #ffffff;
            font-size: 24px;
            cursor: pointer;
            display: block;
        `;
        
        header.querySelector('.container').appendChild(mobileMenuBtn);
        
        // Add mobile menu styles
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .nav {
                    position: fixed;
                    top: 70px;
                    left: -100%;
                    width: 100%;
                    height: calc(100vh - 70px);
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(10px);
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: center;
                    padding-top: 50px;
                    transition: left 0.3s ease;
                    z-index: 999;
                }
                
                .nav.active {
                    left: 0;
                }
                
                .nav-link {
                    font-size: 18px;
                    margin: 20px 0;
                }
                
                .mobile-menu-btn {
                    display: block !important;
                }
            }
            
            @media (min-width: 769px) {
                .mobile-menu-btn {
                    display: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        nav.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                nav.classList.remove('active');
            }
        });
    }
}

// Real-time price updates (simulated)
function initPriceUpdates() {
    const priceElement = document.querySelector('.price');
    if (priceElement) {
        setInterval(() => {
            const currentPrice = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));
            const change = (Math.random() - 0.5) * 1000;
            const newPrice = currentPrice + change;
            
            priceElement.textContent = `Price: $${newPrice.toFixed(2)}`;
            
            // Add color animation
            if (change > 0) {
                priceElement.style.color = '#00ff88';
            } else {
                priceElement.style.color = '#ff4444';
            }
            
            setTimeout(() => {
                priceElement.style.color = '#00ff88';
            }, 1000);
        }, 5000);
    }
}

// Initialize price updates
initPriceUpdates();

// Add loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    const style = document.createElement('style');
    style.textContent = `
        body {
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
});

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const floatingIcons = document.querySelectorAll('.crypto-icon');
    
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    floatingIcons.forEach((icon, index) => {
        const speed = 0.3 + (index * 0.1);
        icon.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Swipe left/right to navigate crypto options
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        const cryptoOptions = document.querySelectorAll('.crypto-option');
        const activeIndex = Array.from(cryptoOptions).findIndex(option => 
            option.classList.contains('selected')
        );
        
        if (diffX > 0 && activeIndex < cryptoOptions.length - 1) {
            // Swipe left - next crypto
            cryptoOptions[activeIndex + 1].click();
        } else if (diffX < 0 && activeIndex > 0) {
            // Swipe right - previous crypto
            cryptoOptions[activeIndex - 1].click();
        }
    }
});

console.log('Crypto website loaded successfully! 🚀');