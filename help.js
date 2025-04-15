document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuth();

    // Handle support form submission
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        supportForm.addEventListener('submit', handleSupportSubmit);
    }

    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Check if user is authenticated
function checkAuth() {
    fetch('/api/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('Error checking authentication:', error);
        window.location.href = '/';
    });
}

// Handle support form submission
function handleSupportSubmit(event) {
    event.preventDefault();

    const subject = document.getElementById('supportSubject').value;
    const message = document.getElementById('supportMessage').value;

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Reset form
        event.target.reset();
        
        // Show success message
        showAlert('Your message has been sent successfully. We will get back to you soon.', 'success');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('supportModal'));
        modal.hide();
    }, 1500);
}

// Handle logout
function handleLogout(event) {
    event.preventDefault();
    
    fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/';
        }
    })
    .catch(error => {
        console.error('Error logging out:', error);
        showAlert('Error logging out. Please try again.', 'danger');
    });
}

// Show alert message
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
} 