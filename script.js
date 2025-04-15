// Bank Management System - Frontend JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Form submission handlers
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Login handler
    async function handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                // Store the token in localStorage
                localStorage.setItem('token', data.token);
                // Redirect to dashboard
                window.location.href = '/dashboard.html';
            } else {
                showAlert('Invalid credentials. Please try again.', 'danger');
            }
        } catch (error) {
            showAlert('An error occurred. Please try again later.', 'danger');
        }
    }

    // Register handler
    async function handleRegister(event) {
        event.preventDefault();
        
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        // Validate password match
        if (password !== confirmPassword) {
            showAlert('Passwords do not match!', 'danger');
            return;
        }

        const formData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('registerPhone').value,
            address: document.getElementById('registerAddress').value,
            password: password
        };

        // Validate required fields
        for (const [key, value] of Object.entries(formData)) {
            if (!value.trim()) {
                showAlert(`Please fill in the ${key} field.`, 'danger');
                return;
            }
        }

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showAlert('Registration successful! Please login.', 'success');
                // Close the register modal
                const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                registerModal.hide();
                // Clear the form
                document.getElementById('registerForm').reset();
            } else {
                const error = await response.json();
                showAlert(error.error || 'Registration failed. Please try again.', 'danger');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('An error occurred. Please try again later.', 'danger');
        }
    }

    // Alert function
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        // Add alert to the page
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
        
        // Remove alert after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    // Check if user is already logged in
    function checkAuth() {
        const token = localStorage.getItem('token');
        if (token && window.location.pathname === '/') {
            window.location.href = '/dashboard.html';
        }
    }

    // Initialize auth check
    checkAuth();
}); 