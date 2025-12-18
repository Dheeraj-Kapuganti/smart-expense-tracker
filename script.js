// ============================================
// SMART EXPENSE TRACKER - MAIN SCRIPT
// ============================================

// Application state and configuration
const App = {
    expenses: [],
    categories: ['Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Others'],
    categoryColors: {
        'Food': '#ff6b6b',
        'Travel': '#1dd1a1',
        'Shopping': '#54a0ff',
        'Bills': '#5f27cd',
        'Entertainment': '#feca57',
        'Others': '#c8d6e5'
    },
    categoryIcons: {
        'Food': 'fas fa-utensils',
        'Travel': 'fas fa-car',
        'Shopping': 'fas fa-shopping-bag',
        'Bills': 'fas fa-file-invoice-dollar',
        'Entertainment': 'fas fa-film',
        'Others': 'fas fa-ellipsis-h'
    },
    // Keywords for auto-categorization
    categoryKeywords: {
        'Food': ['pizza', 'burger', 'restaurant', 'coffee', 'lunch', 'dinner', 'breakfast', 'groceries', 'food', 'eat', 'meal', 'cafe'],
        'Travel': ['uber', 'lyft', 'taxi', 'fuel', 'gas', 'flight', 'train', 'bus', 'metro', 'hotel', 'travel', 'trip', 'parking'],
        'Shopping': ['amazon', 'flipkart', 'walmart', 'target', 'mall', 'store', 'shop', 'purchase', 'buy', 'clothes', 'shoes'],
        'Bills': ['electric', 'water', 'internet', 'phone', 'rent', 'mortgage', 'insurance', 'bill', 'subscription'],
        'Entertainment': ['netflix', 'spotify', 'movie', 'concert', 'game', 'theater', 'music', 'sports', 'gym']
    },
    
    // Chart instance
    chart: null,
    
    // Initialize the application
    init: function() {
        this.loadExpenses();
        this.setupEventListeners();
        this.setDefaultDate();
        this.renderExpenses();
        this.updateSummary();
        this.renderChart();
        this.renderCategoryList();
    },
    
    // Load expenses from localStorage
    loadExpenses: function() {
        const savedExpenses = localStorage.getItem('smartExpenseTracker');
        if (savedExpenses) {
            this.expenses = JSON.parse(savedExpenses);
        }
    },
    
    // Save expenses to localStorage
    saveExpenses: function() {
        localStorage.setItem('smartExpenseTracker', JSON.stringify(this.expenses));
    },
    
    // Set today's date as default in date input
    setDefaultDate: function() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expenseDate').value = today;
        document.getElementById('editExpenseDate').value = today;
    },
    
    // Auto-categorize expense based on description
    autoCategorize: function(description) {
        const desc = description.toLowerCase();
        
        // Check each category for keywords
        for (const [category, keywords] of Object.entries(this.categoryKeywords)) {
            for (const keyword of keywords) {
                if (desc.includes(keyword)) {
                    return category;
                }
            }
        }
        
        // Default category if no keyword matches
        return 'Others';
    },
    
    // Add a new expense
    addExpense: function(expenseData) {
        // Generate a unique ID for the expense
        const expense = {
            id: Date.now().toString(),
            date: expenseData.date,
            description: expenseData.description,
            amount: parseFloat(expenseData.amount),
            category: expenseData.category || this.autoCategorize(expenseData.description)
        };
        
        this.expenses.unshift(expense); // Add to beginning of array
        this.saveExpenses();
        this.renderExpenses();
        this.updateSummary();
        this.renderChart();
        this.renderCategoryList();
        
        // Show success feedback
        this.showNotification('Expense added successfully!', 'success');
    },
    
    // Update an existing expense
    updateExpense: function(id, updatedData) {
        const index = this.expenses.findIndex(expense => expense.id === id);
        
        if (index !== -1) {
            this.expenses[index] = {
                ...this.expenses[index],
                ...updatedData,
                amount: parseFloat(updatedData.amount)
            };
            
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.renderChart();
            this.renderCategoryList();
            
            // Show success feedback
            this.showNotification('Expense updated successfully!', 'success');
        }
    },
    
    // Delete an expense
    deleteExpense: function(id) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenses = this.expenses.filter(expense => expense.id !== id);
            this.saveExpenses();
            this.renderExpenses();
            this.updateSummary();
            this.renderChart();
            this.renderCategoryList();
            
            // Show success feedback
            this.showNotification('Expense deleted successfully!', 'success');
        }
    },
    
    // Get filtered expenses based on current filters
    getFilteredExpenses: function() {
        const categoryFilter = document.getElementById('categoryFilter').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        return this.expenses.filter(expense => {
            // Category filter
            if (categoryFilter !== 'all' && expense.category !== categoryFilter) {
                return false;
            }
            
            // Date range filter
            if (startDate && expense.date < startDate) {
                return false;
            }
            
            if (endDate && expense.date > endDate) {
                return false;
            }
            
            return true;
        });
    },
    
    // Render expenses table
    renderExpenses: function() {
        const tableBody = document.getElementById('expensesTableBody');
        const noExpensesMessage = document.getElementById('noExpensesMessage');
        const filteredExpenses = this.getFilteredExpenses();
        
        // Show/hide no expenses message
        if (filteredExpenses.length === 0) {
            tableBody.innerHTML = '';
            noExpensesMessage.style.display = 'block';
            return;
        }
        
        noExpensesMessage.style.display = 'none';
        
        // Generate table rows
        let tableHTML = '';
        
        filteredExpenses.forEach(expense => {
            const formattedDate = new Date(expense.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
            
            tableHTML += `
                <tr>
                    <td>${formattedDate}</td>
                    <td>${expense.description}</td>
                    <td>
                        <span class="category-badge" style="background-color: ${this.categoryColors[expense.category]}20; color: ${this.categoryColors[expense.category]}">
                            <i class="${this.categoryIcons[expense.category]}"></i>
                            ${expense.category}
                        </span>
                    </td>
                    <td class="text-danger">$${expense.amount.toFixed(2)}</td>
                    <td class="actions">
                        <button class="btn btn-secondary btn-sm edit-expense" data-id="${expense.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm delete-expense" data-id="${expense.id}">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = tableHTML;
        
        // Attach event listeners to edit and delete buttons
        this.attachExpenseActionListeners();
    },
    
    // Update summary information
    updateSummary: function() {
        const totalAmount = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        document.getElementById('totalAmount').textContent = `$${totalAmount.toFixed(2)}`;
        
        // Calculate category totals
        const categoryTotals = {};
        this.categories.forEach(category => {
            categoryTotals[category] = 0;
        });
        
        this.expenses.forEach(expense => {
            if (categoryTotals.hasOwnProperty(expense.category)) {
                categoryTotals[expense.category] += expense.amount;
            }
        });
        
        // Find highest spending category
        let highestCategory = '-';
        let highestAmount = 0;
        
        for (const [category, total] of Object.entries(categoryTotals)) {
            if (total > highestAmount) {
                highestAmount = total;
                highestCategory = category;
            }
        }
        
        document.getElementById('highestCategory').textContent = highestCategory !== '-' ? 
            `${highestCategory} ($${highestAmount.toFixed(2)})` : '-';
    },
    
    // Render category list in summary
    renderCategoryList: function() {
        const categoryList = document.getElementById('categoryList');
        
        // Calculate category totals
        const categoryTotals = {};
        this.categories.forEach(category => {
            categoryTotals[category] = 0;
        });
        
        this.expenses.forEach(expense => {
            if (categoryTotals.hasOwnProperty(expense.category)) {
                categoryTotals[expense.category] += expense.amount;
            }
        });
        
        // Generate category items
        let categoryHTML = '';
        
        for (const [category, total] of Object.entries(categoryTotals)) {
            if (total > 0) {
                categoryHTML += `
                    <div class="category-item ${category}">
                        <div class="category-name">
                            <div class="category-icon">
                                <i class="${this.categoryIcons[category]}"></i>
                            </div>
                            <span>${category}</span>
                        </div>
                        <div class="category-amount">$${total.toFixed(2)}</div>
                    </div>
                `;
            }
        }
        
        // If no expenses yet, show a message
        if (categoryHTML === '') {
            categoryHTML = '<p class="no-data">No expenses added yet</p>';
        }
        
        categoryList.innerHTML = categoryHTML;
    },
    
    // Render pie chart using Chart.js
    renderChart: function() {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        
        // Calculate category totals for chart
        const categoryTotals = {};
        const categoryLabels = [];
        const categoryData = [];
        const categoryColors = [];
        
        this.categories.forEach(category => {
            const total = this.expenses
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + expense.amount, 0);
            
            if (total > 0) {
                categoryLabels.push(category);
                categoryData.push(total);
                categoryColors.push(this.categoryColors[category]);
            }
        });
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Create new chart if there's data
        if (categoryData.length > 0) {
            this.chart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: categoryLabels,
                    datasets: [{
                        data: categoryData,
                        backgroundColor: categoryColors,
                        borderWidth: 2,
                        borderColor: '#fff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = Math.round((value / total) * 100);
                                    return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
            
            // Update chart legend
            this.renderChartLegend(categoryLabels, categoryColors);
        } else {
            // Clear chart area if no data
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            
            // Display "no data" message
            ctx.font = '16px Poppins';
            ctx.fillStyle = '#999';
            ctx.textAlign = 'center';
            ctx.fillText('No expenses to display', ctx.canvas.width / 2, ctx.canvas.height / 2);
            
            // Clear legend
            document.getElementById('chartLegend').innerHTML = '<p class="no-data">No expenses to display</p>';
        }
    },
    
    // Render chart legend
    renderChartLegend: function(labels, colors) {
        const legendContainer = document.getElementById('chartLegend');
        let legendHTML = '';
        
        labels.forEach((label, index) => {
            legendHTML += `
                <div class="legend-item">
                    <div class="legend-color" style="background-color: ${colors[index]}"></div>
                    <span>${label}</span>
                </div>
            `;
        });
        
        legendContainer.innerHTML = legendHTML;
    },
    
    // Setup all event listeners
    setupEventListeners: function() {
        // Add expense form submission
        document.getElementById('expenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddExpense();
        });
        
        // Edit expense form submission
        document.getElementById('editExpenseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleEditExpense();
        });
        
        // Filter change events
        document.getElementById('categoryFilter').addEventListener('change', () => {
            this.renderExpenses();
        });
        
        document.getElementById('startDate').addEventListener('change', () => {
            this.renderExpenses();
        });
        
        document.getElementById('endDate').addEventListener('change', () => {
            this.renderExpenses();
        });
        
        // Clear filters button
        document.getElementById('clearFilters').addEventListener('click', () => {
            document.getElementById('categoryFilter').value = 'all';
            document.getElementById('startDate').value = '';
            document.getElementById('endDate').value = '';
            this.renderExpenses();
        });
        
        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(button => {
            button.addEventListener('click', () => {
                document.getElementById('editModal').style.display = 'none';
            });
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('editModal');
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Auto-categorize hint when typing description
        document.getElementById('expenseDescription').addEventListener('input', (e) => {
            const description = e.target.value.toLowerCase();
            const categorySelect = document.getElementById('expenseCategory');
            
            // Only auto-suggest if category is set to auto-detect
            if (categorySelect.value === '') {
                const detectedCategory = this.autoCategorize(description);
                
                // Update the option text to show detected category
                if (detectedCategory !== 'Others' || description.length > 2) {
                    categorySelect.options[0].text = `Auto-detect: ${detectedCategory}`;
                } else {
                    categorySelect.options[0].text = 'Auto-detect from description';
                }
            }
        });
    },
    
    // Attach event listeners to edit and delete buttons in the table
    attachExpenseActionListeners: function() {
        // Edit buttons
        document.querySelectorAll('.edit-expense').forEach(button => {
            button.addEventListener('click', (e) => {
                const expenseId = e.currentTarget.getAttribute('data-id');
                this.openEditModal(expenseId);
            });
        });
        
        // Delete buttons
        document.querySelectorAll('.delete-expense').forEach(button => {
            button.addEventListener('click', (e) => {
                const expenseId = e.currentTarget.getAttribute('data-id');
                this.deleteExpense(expenseId);
            });
        });
    },
    
    // Handle adding a new expense
    handleAddExpense: function() {
        const date = document.getElementById('expenseDate').value;
        const description = document.getElementById('expenseDescription').value.trim();
        const amount = document.getElementById('expenseAmount').value;
        const category = document.getElementById('expenseCategory').value;
        
        // Basic validation
        if (!date || !description || !amount || amount <= 0) {
            this.showNotification('Please fill in all required fields with valid values.', 'error');
            return;
        }
        
        // Add the expense
        this.addExpense({ date, description, amount, category });
        
        // Reset the form
        document.getElementById('expenseForm').reset();
        this.setDefaultDate();
        
        // Reset auto-detect option text
        document.getElementById('expenseCategory').options[0].text = 'Auto-detect from description';
    },
    
    // Open edit modal with expense data
    openEditModal: function(expenseId) {
        const expense = this.expenses.find(exp => exp.id === expenseId);
        
        if (expense) {
            // Populate form fields
            document.getElementById('editExpenseId').value = expense.id;
            document.getElementById('editExpenseDate').value = expense.date;
            document.getElementById('editExpenseDescription').value = expense.description;
            document.getElementById('editExpenseAmount').value = expense.amount;
            document.getElementById('editExpenseCategory').value = expense.category;
            
            // Show the modal
            document.getElementById('editModal').style.display = 'flex';
        }
    },
    
    // Handle editing an expense
    handleEditExpense: function() {
        const id = document.getElementById('editExpenseId').value;
        const date = document.getElementById('editExpenseDate').value;
        const description = document.getElementById('editExpenseDescription').value.trim();
        const amount = document.getElementById('editExpenseAmount').value;
        const category = document.getElementById('editExpenseCategory').value;
        
        // Basic validation
        if (!date || !description || !amount || amount <= 0) {
            this.showNotification('Please fill in all required fields with valid values.', 'error');
            return;
        }
        
        // Update the expense
        this.updateExpense(id, { date, description, amount, category });
        
        // Close the modal
        document.getElementById('editModal').style.display = 'none';
    },
    
    // Show notification message
    showNotification: function(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles for notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#4CAF50' : '#F44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        // Add keyframes for animation
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});