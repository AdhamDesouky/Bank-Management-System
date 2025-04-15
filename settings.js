document.addEventListener('DOMContentLoaded', function() {
    // Load user settings
    loadUserSettings();

    // Handle form submissions
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    document.getElementById('securityForm').addEventListener('submit', handleSecurityUpdate);
    document.getElementById('notificationForm').addEventListener('submit', handleNotificationUpdate);
    document.getElementById('preferencesForm').addEventListener('submit', handlePreferencesUpdate);

    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

// Load user settings from server
function loadUserSettings() {
    // In a real application, this would fetch from the server
    const userSettings = {
        profile: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 234 567 8900',
            address: '123 Main St, City, Country'
        },
        security: {
            twoFactorAuth: false
        },
        notifications: {
            email: true,
            transactions: true,
            security: true,
            marketing: false
        },
        preferences: {
            language: 'en',
            timezone: 'UTC',
            dateFormat: 'MM/DD/YYYY',
            currency: 'USD'
        }
    };

    // Populate profile form
    document.getElementById('profileName').value = userSettings.profile.name;
    document.getElementById('profileEmail').value = userSettings.profile.email;
    document.getElementById('profilePhone').value = userSettings.profile.phone;
    document.getElementById('profileAddress').value = userSettings.profile.address;

    // Populate security settings
    document.getElementById('twoFactorAuth').checked = userSettings.security.twoFactorAuth;

    // Populate notification settings
    document.getElementById('emailNotifications').checked = userSettings.notifications.email;
    document.getElementById('transactionAlerts').checked = userSettings.notifications.transactions;
    document.getElementById('securityAlerts').checked = userSettings.notifications.security;
    document.getElementById('marketingEmails').checked = userSettings.notifications.marketing;

    // Populate preferences
    document.getElementById('language').value = userSettings.preferences.language;
    document.getElementById('timezone').value = userSettings.preferences.timezone;
    document.getElementById('dateFormat').value = userSettings.preferences.dateFormat;
    document.getElementById('currency').value = userSettings.preferences.currency;
}

// Handle profile update
function handleProfileUpdate(event) {
    event.preventDefault();
    
    const profileData = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        address: document.getElementById('profileAddress').value
    };

    // In a real application, this would send to the server
    console.log('Updating profile:', profileData);
    showAlert('Profile updated successfully!', 'success');
}

// Handle security update
function handleSecurityUpdate(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const twoFactorAuth = document.getElementById('twoFactorAuth').checked;

    if (newPassword !== confirmPassword) {
        showAlert('New passwords do not match!', 'danger');
        return;
    }

    const securityData = {
        currentPassword,
        newPassword,
        twoFactorAuth
    };

    // In a real application, this would send to the server
    console.log('Updating security settings:', securityData);
    showAlert('Security settings updated successfully!', 'success');
    
    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Handle notification update
function handleNotificationUpdate(event) {
    event.preventDefault();
    
    const notificationData = {
        email: document.getElementById('emailNotifications').checked,
        transactions: document.getElementById('transactionAlerts').checked,
        security: document.getElementById('securityAlerts').checked,
        marketing: document.getElementById('marketingEmails').checked
    };

    // In a real application, this would send to the server
    console.log('Updating notification settings:', notificationData);
    showAlert('Notification settings updated successfully!', 'success');
}

// Handle preferences update
function handlePreferencesUpdate(event) {
    event.preventDefault();
    
    const preferencesData = {
        language: document.getElementById('language').value,
        timezone: document.getElementById('timezone').value,
        dateFormat: document.getElementById('dateFormat').value,
        currency: document.getElementById('currency').value
    };

    // In a real application, this would send to the server
    console.log('Updating preferences:', preferencesData);
    showAlert('Preferences updated successfully!', 'success');
}

// Handle logout
function handleLogout(event) {
    event.preventDefault();
    
    // In a real application, this would clear session data
    console.log('Logging out...');
    window.location.href = 'index.html';
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
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
} 