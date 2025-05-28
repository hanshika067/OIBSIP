// DOM Elements
const loginCard = document.getElementById('login-card');
const registerCard = document.getElementById('register-card');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const notification = document.getElementById('notification');
const togglePasswordIcons = document.querySelectorAll('.toggle-password');

// Toggle between login and register forms
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginCard.classList.add('hidden');
    registerCard.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
});

// Toggle password visibility
togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', () => {
        const input = icon.parentElement.querySelector('input');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Show notification
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = 'notification show';
    notification.style.background = `var(--${type})`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Mock user database
let users = JSON.parse(localStorage.getItem('users')) || [];

// Register form submission
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    // Validate inputs
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'danger');
        return;
    }
    
    if (users.some(user => user.email === email)) {
        showNotification('Email already registered', 'danger');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password // In a real app, you would hash this password
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showNotification('Registration successful! Please login');
    registerForm.reset();
    registerCard.classList.add('hidden');
    loginCard.classList.remove('hidden');
});

// Login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Find user
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        showNotification('Login successful!');
        loginForm.reset();
        
        // In a real app, you would redirect to a dashboard
        // For now, we'll just show an alert
        setTimeout(() => {
            alert(`Welcome ${user.name}! This would redirect to your dashboard in a real app.`);
        }, 1000);
    } else {
        showNotification('Invalid email or password', 'danger');
    }
});