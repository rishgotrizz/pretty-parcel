// ========== Configuration ==========
const API_BASE_URL = 'http://localhost:5001/api';

// Sample products data
const products = [
    {
        id: 1,
        name: 'Love Parcel',
        description: 'A romantic collection of premium treats and gifts for your special someone',
        price: 899,
        emoji: '💕'
    },
    {
        id: 2,
        name: 'Birthday Gift Box',
        description: 'Celebrate with our curated birthday special featuring delightful surprises',
        price: 799,
        emoji: '🎂'
    },
    {
        id: 3,
        name: 'Memory Parcel',
        description: 'Cherish precious moments with our nostalgic collection of classics',
        price: 999,
        emoji: '📸'
    }
];

// ========== State Management ==========
let cart = [];
let currentUser = null;
let authToken = null;

// Load cart from localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
    updateCartUI();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load user data from localStorage
function loadUserData() {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser && savedToken) {
        currentUser = JSON.parse(savedUser);
        authToken = savedToken;
        updateAuthUI();
    }
}

// ========== DOM Elements & Init ==========
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    loadUserData();
    renderProducts();
    setupEventListeners();
});

function setupEventListeners() {
    // Cart button
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', closeCart);
    document.querySelector('.close-cart').addEventListener('click', closeCart);

    // Login button
    document.getElementById('loginBtn').addEventListener('click', openAuthModal);
    document.querySelector('.close-modal').addEventListener('click', closeAuthModal);

    // Auth toggle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchAuthMode(this.dataset.mode);
        });
    });

    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);

    // Checkout button
    document.querySelector('.btn-checkout').addEventListener('click', proceedToCheckout);

    // Close modal on overlay click
    document.getElementById('authModal').addEventListener('click', function(e) {
        if (e.target === this) closeAuthModal();
    });
}

// ========== Product Rendering ==========
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price}</span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== Cart Functions ==========
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            emoji: product.emoji,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    
    // Animate cart button
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.animation = 'none';
    setTimeout(() => {
        cartBtn.style.animation = 'bounce 0.5s ease-out';
    }, 10);

    // Show notification
    showNotification(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, newQuantity);
        saveCart();
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    const cartItemsContainer = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">${item.emoji}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `₹${total}`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
}

// ========== Authentication Functions ==========
function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthMode(mode) {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');

    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    
    if (mode === 'login') {
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.getElementById('signupForm').classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;

    try {
        const response = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            authToken = data.token;
            
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('authToken', authToken);
            
            closeAuthModal();
            updateAuthUI();
            e.target.reset();
            showNotification('Logged in successfully!');
        } else {
            showNotification(data.message || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Connection error. Please check if backend is running.', 'error');
    }
}

async function handleSignup(e) {
    e.preventDefault();

    const name = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelectorAll('input[type="email"]')[0].value;
    const password = e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = e.target.querySelectorAll('input[type="password"]')[1].value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    if (password.length < 6) {
        showNotification('Password must be at least 6 characters!', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            showNotification('Account created successfully! Please login.');
            e.target.reset();
            switchAuthMode('login');
        } else {
            showNotification(data.message || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showNotification('Connection error. Please check if backend is running.', 'error');
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    
    if (currentUser) {
        loginBtn.textContent = `${currentUser.name.split(' ')[0]} (Logout)`;
        loginBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = openAuthModal;
    }
}

function logout() {
    currentUser = null;
    authToken = null;
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    updateAuthUI();
    showNotification('Logged out successfully');
}

// ========== Checkout Function ==========
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    if (!currentUser) {
        showNotification('Please login to checkout', 'error');
        closeCart();
        openAuthModal();
        return;
    }

    // Store cart data and redirect to checkout
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// ========== Utility Functions ==========
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification ' + type;
    notification.textContent = message;
    
    // Add notification styles inline
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4ade80' : '#ff6b6b'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 999;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add to window for inline onclick
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
