// Dashboard functionality for Bank Management System

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuth();

    // Initialize event listeners
    initializeEventListeners();

    // Load user data
    loadUserData();

    // Load transactions
    loadTransactions();
});

// Check if user is authenticated
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/';
        return;
    }
}

// Initialize all event listeners
function initializeEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);

    // Transaction form
    document.getElementById('transactionForm').addEventListener('submit', handleTransaction);

    // Profile form
    document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);

    // Transaction type change
    document.getElementById('transactionType').addEventListener('change', function(e) {
        const transferContainer = document.getElementById('transferEmailContainer');
        transferContainer.style.display = e.target.value === 'transfer' ? 'block' : 'none';
    });
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

// Load user data
async function loadUserData() {
    try {
        const response = await fetch('/api/user', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            updateProfileForm(userData);
            updateAccountSummary(userData);
        } else {
            showAlert('Failed to load user data', 'danger');
        }
    } catch (error) {
        showAlert('An error occurred while loading user data', 'danger');
    }
}

// Load transactions
async function loadTransactions() {
    try {
        const response = await fetch('/api/transactions', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.ok) {
            const transactions = await response.json();
            updateTransactionsTable(transactions);
        } else {
            showAlert('Failed to load transactions', 'danger');
        }
    } catch (error) {
        showAlert('An error occurred while loading transactions', 'danger');
    }
}

// Handle transaction submission
async function handleTransaction(event) {
    event.preventDefault();

    const formData = {
        type: document.getElementById('transactionType').value,
        amount: parseFloat(document.getElementById('transactionAmount').value),
        description: document.getElementById('transactionDescription').value
    };

    if (formData.type === 'transfer') {
        formData.recipientEmail = document.getElementById('transferEmail').value;
    }

    try {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showAlert('Transaction processed successfully', 'success');
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('transactionModal'));
            modal.hide();
            // Refresh data
            loadUserData();
            loadTransactions();
        } else {
            const error = await response.json();
            showAlert(error.message || 'Transaction failed', 'danger');
        }
    } catch (error) {
        showAlert('An error occurred while processing the transaction', 'danger');
    }
}

// Handle profile update
async function handleProfileUpdate(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('profileName').value,
        email: document.getElementById('profileEmail').value,
        phone: document.getElementById('profilePhone').value,
        address: document.getElementById('profileAddress').value
    };

    const newPassword = document.getElementById('profilePassword').value;
    if (newPassword) {
        formData.password = newPassword;
    }

    try {
        const response = await fetch('/api/user', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            showAlert('Profile updated successfully', 'success');
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
            modal.hide();
            // Refresh data
            loadUserData();
        } else {
            const error = await response.json();
            showAlert(error.message || 'Profile update failed', 'danger');
        }
    } catch (error) {
        showAlert('An error occurred while updating profile', 'danger');
    }
}

// Update profile form with user data
function updateProfileForm(userData) {
    document.getElementById('profileName').value = userData.name;
    document.getElementById('profileEmail').value = userData.email;
    document.getElementById('profilePhone').value = userData.phone;
    document.getElementById('profileAddress').value = userData.address;
}

// Update account summary
function updateAccountSummary(userData) {
    document.getElementById('accountBalance').textContent = `$${userData.balance.toFixed(2)}`;
    document.getElementById('totalDeposits').textContent = `$${userData.totalDeposits.toFixed(2)}`;
    document.getElementById('totalWithdrawals').textContent = `$${userData.totalWithdrawals.toFixed(2)}`;
}

// Update transactions table and chart
function updateTransactionsTable(transactions) {
    const tableBody = document.getElementById('transactionsTable');
    tableBody.innerHTML = '';

    // Sort transactions by date
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Update table
    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
            <td>${transaction.type}</td>
            <td>${transaction.description}</td>
            <td>$${transaction.amount.toFixed(2)}</td>
            <td><span class="badge bg-${transaction.status === 'completed' ? 'success' : 'warning'}">${transaction.status}</span></td>
        `;
        tableBody.appendChild(row);
    });

    // Update chart
    updateTransactionChart(transactions);
}

// Update transaction chart
function updateTransactionChart(transactions) {
    const ctx = document.getElementById('transactionChart').getContext('2d');
    
    // Group transactions by date
    const groupedTransactions = transactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = { deposits: 0, withdrawals: 0 };
        }
        if (transaction.type === 'deposit') {
            acc[date].deposits += transaction.amount;
        } else if (transaction.type === 'withdrawal') {
            acc[date].withdrawals += transaction.amount;
        }
        return acc;
    }, {});

    const dates = Object.keys(groupedTransactions);
    const deposits = dates.map(date => groupedTransactions[date].deposits);
    const withdrawals = dates.map(date => groupedTransactions[date].withdrawals);

    // Destroy existing chart if it exists
    if (window.transactionChart) {
        window.transactionChart.destroy();
    }

    // Create new chart with green theme
    window.transactionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Deposits',
                    data: deposits,
                    backgroundColor: 'rgba(76, 175, 80, 0.5)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Withdrawals',
                    data: withdrawals,
                    backgroundColor: 'rgba(129, 199, 132, 0.5)',
                    borderColor: 'rgba(129, 199, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(200, 230, 201, 0.2)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(200, 230, 201, 0.2)'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Transaction History',
                    color: '#388E3C'
                },
                legend: {
                    labels: {
                        color: '#388E3C'
                    }
                }
            }
        }
    });
}

// Show alert
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
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
} 