document.addEventListener('DOMContentLoaded', function() {
    // Load initial transactions
    loadTransactions();

    // Set up event listeners
    document.getElementById('filterForm').addEventListener('submit', handleFilterSubmit);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

// Load transactions from server
function loadTransactions() {
    // In a real application, this would fetch from the server
    const sampleTransactions = [
        {
            id: 'TXN001',
            date: '2024-04-15',
            type: 'deposit',
            description: 'Salary Deposit',
            amount: 5000.00,
            status: 'completed'
        },
        {
            id: 'TXN002',
            date: '2024-04-14',
            type: 'withdrawal',
            description: 'ATM Withdrawal',
            amount: 200.00,
            status: 'completed'
        },
        {
            id: 'TXN003',
            date: '2024-04-13',
            type: 'transfer',
            description: 'Transfer to John Doe',
            amount: 1000.00,
            status: 'pending'
        }
    ];

    updateTransactionTable(sampleTransactions);
    updateTransactionStats(sampleTransactions);
}

// Update transaction table
function updateTransactionTable(transactions) {
    const tbody = document.getElementById('transactionsTable');
    tbody.innerHTML = '';

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${capitalizeFirst(transaction.type)}</td>
            <td>${transaction.description}</td>
            <td>${formatCurrency(transaction.amount)}</td>
            <td><span class="badge bg-${getStatusColor(transaction.status)}">${capitalizeFirst(transaction.status)}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="showTransactionDetails('${transaction.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update transaction statistics
function updateTransactionStats(transactions) {
    const stats = {
        deposits: 0,
        withdrawals: 0,
        transfers: 0,
        pending: 0
    };

    transactions.forEach(transaction => {
        switch(transaction.type) {
            case 'deposit':
                stats.deposits += transaction.amount;
                break;
            case 'withdrawal':
                stats.withdrawals += transaction.amount;
                break;
            case 'transfer':
                stats.transfers += transaction.amount;
                break;
        }
        if (transaction.status === 'pending') {
            stats.pending++;
        }
    });

    document.getElementById('totalDeposits').textContent = formatCurrency(stats.deposits);
    document.getElementById('totalWithdrawals').textContent = formatCurrency(stats.withdrawals);
    document.getElementById('totalTransfers').textContent = formatCurrency(stats.transfers);
    document.getElementById('pendingTransactions').textContent = stats.pending;
}

// Handle filter form submission
function handleFilterSubmit(event) {
    event.preventDefault();
    
    const filters = {
        dateFrom: document.getElementById('dateFrom').value,
        dateTo: document.getElementById('dateTo').value,
        type: document.getElementById('transactionType').value,
        status: document.getElementById('transactionStatus').value
    };

    // In a real application, this would send to the server
    console.log('Applying filters:', filters);
    loadTransactions(); // Reload with filters
}

// Reset filters
function resetFilters() {
    document.getElementById('filterForm').reset();
    loadTransactions();
}

// Show transaction details in modal
function showTransactionDetails(transactionId) {
    // In a real application, this would fetch from the server
    const transaction = {
        id: transactionId,
        date: '2024-04-15',
        type: 'deposit',
        amount: 5000.00,
        description: 'Salary Deposit',
        status: 'completed'
    };

    document.getElementById('modalTransactionId').textContent = transaction.id;
    document.getElementById('modalDateTime').textContent = formatDate(transaction.date);
    document.getElementById('modalType').textContent = capitalizeFirst(transaction.type);
    document.getElementById('modalAmount').textContent = formatCurrency(transaction.amount);
    document.getElementById('modalDescription').textContent = transaction.description;
    document.getElementById('modalStatus').textContent = capitalizeFirst(transaction.status);

    const modal = new bootstrap.Modal(document.getElementById('transactionModal'));
    modal.show();
}

// Export to CSV
function exportToCSV() {
    // In a real application, this would generate and download CSV
    console.log('Exporting to CSV...');
    showAlert('CSV export started', 'success');
}

// Export to PDF
function exportToPDF() {
    // In a real application, this would generate and download PDF
    console.log('Exporting to PDF...');
    showAlert('PDF export started', 'success');
}

// Handle logout
function handleLogout(event) {
    event.preventDefault();
    window.location.href = 'index.html';
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getStatusColor(status) {
    switch(status) {
        case 'completed':
            return 'success';
        case 'pending':
            return 'warning';
        case 'failed':
            return 'danger';
        default:
            return 'secondary';
    }
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
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
} 