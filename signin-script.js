// Sign In Page JavaScript - Fixed for cross-device compatibility

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSignInForm();
    initFloatingAnimations();
    initFormValidation();
    initPasswordToggle();
    initRippleEffect();
    initLoadingAnimation();
});

// Sign In Form Handler - FIXED for cross-device compatibility
function initSignInForm() {
    const signinForm = document.getElementById('signinForm');
    const signinBtn = document.querySelector('.signin-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoader = document.querySelector('.btn-loader');
    
    // Valid credentials
    const validCredentials = {
        username: 'jamieshawld@gmail.com',
        password: 'AltCtrl22'
    };
    
    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        // Show loading state
        showLoadingState();
        
        // Use a shorter timeout for better mobile experience
        setTimeout(() => {
            // Case-insensitive email comparison
            if (username.toLowerCase() === validCredentials.username.toLowerCase() && password === validCredentials.password) {
                showSuccessMessage('Login successful! Redirecting...');
                
                setTimeout(() => {
                    // FIXED: Better localStorage handling with try-catch
                    try {
                        localStorage.setItem('userLoggedIn', 'true');
                        // Also store user data for session management
                        localStorage.setItem('userEmail', username.toLowerCase());
                    } catch (err) {
                        console.error('LocalStorage error:', err);
                        // Fallback to sessionStorage if localStorage is blocked
                        try {
                            sessionStorage.setItem('userLoggedIn', 'true');
                            sessionStorage.setItem('userEmail', username.toLowerCase());
                        } catch (err2) {
                            console.error('SessionStorage also blocked');
                        }
                    }
                    
                    // FIXED: More reliable redirect
                    window.location.href = 'dashboard.html';
                }, 1500);
            } else {
                showErrorMessage('Invalid username or password. Please try again.');
                hideLoadingState();
            }
        }, 1000); // Reduced timeout for better mobile UX
    });
    
    function showLoadingState() {
        signinBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
    }
    
    function hideLoadingState() {
        signinBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
}

// Form Validation - FIXED for mobile compatibility
function initFormValidation() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    // Real-time validation with better mobile support
    usernameInput.addEventListener('input', function() {
        validateEmail(this);
    });
    
    passwordInput.addEventListener('input', function() {
        validatePassword(this);
    });
    
    // Add touch event listeners for mobile
    usernameInput.addEventListener('touchstart', function() {
        this.focus({preventScroll: true});
    }, {passive: true});
    
    passwordInput.addEventListener('touchstart', function() {
        this.focus({preventScroll: true});
    }, {passive: true});
    
    function validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(input.value);
        
        if (input.value.length > 0) {
            if (isValid) {
                input.classList.remove('error');
                input.classList.add('success');
            } else {
                input.classList.remove('success');
                input.classList.add('error');
            }
        } else {
            input.classList.remove('error', 'success');
        }
    }
    
    function validatePassword(input) {
        const isValid = input.value.length >= 6;
        
        if (input.value.length > 0) {
            if (isValid) {
                input.classList.remove('error');
                input.classList.add('success');
            } else {
                input.classList.remove('success');
                input.classList.add('error');
            }
        } else {
            input.classList.remove('error', 'success');
        }
    }
}

// Password Toggle - FIXED for touch devices
function initPasswordToggle() {
    const toggleBtn = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (toggleBtn) {
        // Use both click and touch events for better mobile support
        toggleBtn.addEventListener('click', handlePasswordToggle);
        toggleBtn.addEventListener('touchend', handlePasswordToggle);
        
        function handlePasswordToggle(e) {
            e.preventDefault();
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            this.textContent = type === 'password' ? '👁' : '🙈';
        }
    }
}

// Global password toggle function (for onclick attribute) - FIXED
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password');
    
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    if (toggleBtn) {
        toggleBtn.textContent = type === 'password' ? '👁' : '🙈';
    }
}

// Floating Animations - FIXED for performance
function initFloatingAnimations() {
    const floatingIcons = document.querySelectorAll('.crypto-icon');
    
    floatingIcons.forEach((icon, index) => {
        // Use CSS animations instead of JS for better performance
        icon.style.animation = `float 6s ease-in-out ${index * 0.5}s infinite`;
        
        // Add hover effects with touch device support
        icon.addEventListener('mouseenter', handleIconHover);
        icon.addEventListener('mouseleave', handleIconLeave);
        
        // Add touch events for mobile
        icon.addEventListener('touchstart', handleIconHover, {passive: true});
        icon.addEventListener('touchend', handleIconLeave, {passive: true});
        
        function handleIconHover() {
            this.style.transform = 'scale(1.2) rotate(10deg)';
            this.style.zIndex = '10';
            this.style.background = 'rgba(0, 255, 136, 0.3)';
            this.style.borderColor = '#00ff88';
        }
        
        function handleIconLeave() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.zIndex = '1';
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
}

// Ripple Effect - FIXED for touch devices
function initRippleEffect() {
    const signinBtn = document.querySelector('.signin-btn');
    
    // Add both click and touch events
    signinBtn.addEventListener('click', createRipple);
    signinBtn.addEventListener('touchend', createRipple);
    
    function createRipple(e) {
        // Handle both mouse and touch events
        const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
        const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = clientX - rect.left - size / 2;
        const y = clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Loading Animation - FIXED for better mobile performance
function initLoadingAnimation() {
    // Add entrance animation to form elements
    const formElements = document.querySelectorAll('.form-group, .signin-btn, .form-options');
    
    formElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 + index * 100);
    });
}

// Message Display Functions - FIXED for better visibility
function showErrorMessage(message) {
    hideMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'display: block; color: #ff6b6b; background: rgba(255, 107, 107, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(255, 107, 107, 0.3);';
    
    const form = document.getElementById('signinForm');
    form.insertBefore(errorDiv, form.firstChild);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.opacity = '0';
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 300);
    }, 5000);
}

function showSuccessMessage(message) {
    hideMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = 'display: block; color: #00ff88; background: rgba(0, 255, 136, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(0, 255, 136, 0.3);';
    
    const form = document.getElementById('signinForm');
    form.insertBefore(successDiv, form.firstChild);
}

function hideMessages() {
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => {
        if (msg.parentNode) {
            msg.remove();
        }
    });
}

// Keyboard Navigation - FIXED for mobile virtual keyboards
document.addEventListener('keydown', function(e) {
    // Enter key on form
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
        const form = document.getElementById('signinForm');
        const submitBtn = form.querySelector('.signin-btn');
        if (!submitBtn.disabled) {
            submitBtn.click();
        }
    }
    
    // Escape key to clear form
    if (e.key === 'Escape') {
        clearForm();
    }
});

// Clear Form Function
function clearForm() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('remember').checked = false;
    
    // Remove validation classes
    document.querySelectorAll('.form-group input').forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    hideMessages();
}

// Auto-fill for demo purposes (remove in production)
function autoFillDemo() {
    document.getElementById('username').value = 'jamieshawld@gmail.com';
    document.getElementById('password').value = 'AltCtrl22';
    
    // Trigger validation
    document.getElementById('username').dispatchEvent(new Event('input'));
    document.getElementById('password').dispatchEvent(new Event('input'));
}

// Initialize demo button (for testing)
function addDemoButton() {
    const demoBtn = document.createElement('button');
    demoBtn.textContent = 'Auto-fill Demo';
    demoBtn.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 10px 15px; background: rgba(0, 255, 136, 0.2); color: white; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 8px; cursor: pointer; z-index: 1000;';
    demoBtn.addEventListener('click', autoFillDemo);
    document.body.appendChild(demoBtn);
}

// Parallax Effect - FIXED for mobile performance
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const floatingIcons = document.querySelectorAll('.crypto-icon');
    
    floatingIcons.forEach((icon, index) => {
        const speed = 0.2 + (index * 0.05);
        const yPos = -(scrolled * speed);
        icon.style.transform = `translateY(${yPos}px) ${icon.style.transform}`;
    });
});

// Form Auto-save (localStorage) - FIXED with better error handling
function initAutoSave() {
    const usernameInput = document.getElementById('username');
    const rememberCheckbox = document.getElementById('remember');
    
    // Load saved data with error handling
    try {
        const savedUsername = localStorage.getItem('savedUsername');
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        
        if (savedUsername && rememberMe) {
            usernameInput.value = savedUsername;
            rememberCheckbox.checked = true;
        }
    } catch (err) {
        console.error('Failed to load saved data:', err);
    }
    
    // Save on change with error handling
    usernameInput.addEventListener('input', function() {
        try {
            if (rememberCheckbox.checked) {
                localStorage.setItem('savedUsername', this.value);
            }
        } catch (err) {
            console.error('Failed to save username:', err);
        }
    });
    
    rememberCheckbox.addEventListener('change', function() {
        try {
            if (this.checked) {
                localStorage.setItem('savedUsername', usernameInput.value);
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('savedUsername');
                localStorage.removeItem('rememberMe');
            }
        } catch (err) {
            console.error('Failed to update remember me setting:', err);
        }
    });
}

// Initialize auto-save
initAutoSave();

// Add smooth transitions to all interactive elements
document.addEventListener('DOMContentLoaded', function() {
    const interactiveElements = document.querySelectorAll('input, button, a, .crypto-icon');
    
    interactiveElements.forEach(element => {
        element.style.transition = 'all 0.3s ease';
    });
});

// Enhanced localStorage check function
function checkLocalStorage() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

// Session management for cross-device compatibility
function initSessionManagement() {
    if (!checkLocalStorage()) {
        console.warn('LocalStorage is not available, using sessionStorage');
        window.useSessionStorage = true;
    } else {
        window.useSessionStorage = false;
    }
}

// Initialize session management
initSessionManagement();

// Console welcome message
console.log('🔐 Sign In page loaded successfully!');
console.log('📧 Demo credentials: jamieshawld@gmail.com / AltCtrl22');
console.log('💡 Use the "Auto-fill Demo" button for quick testing');