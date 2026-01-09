// Currency management
var currencies = {
    'USD': { symbol: '$', name: 'US Dollar', position: 'before' },
    'INR': { symbol: '₹', name: 'Indian Rupee', position: 'before' },
    'EUR': { symbol: '€', name: 'Euro', position: 'before' },
    'GBP': { symbol: '£', name: 'British Pound', position: 'before' },
    'JPY': { symbol: '¥', name: 'Japanese Yen', position: 'before' },
    'AUD': { symbol: 'A$', name: 'Australian Dollar', position: 'before' },
    'CAD': { symbol: 'C$', name: 'Canadian Dollar', position: 'before' },
    'CNY': { symbol: '¥', name: 'Chinese Yuan', position: 'before' }
};

function getCurrency() {
    var currency = localStorage.getItem('selectedCurrency');
    if (currency === null) {
        return 'USD'; // Default to USD
    }
    return currency;
}

function setCurrency(currencyCode) {
    localStorage.setItem('selectedCurrency', currencyCode);
    // Refresh the page to update all currency displays
    if (window.location.pathname.includes('expenses.html') || 
        window.location.pathname.includes('summary.html')) {
        location.reload();
    }
}

function formatCurrency(amount) {
    var currencyCode = getCurrency();
    var currency = currencies[currencyCode];
    if (!currency) {
        currency = currencies['USD'];
    }
    
    var formattedAmount = parseFloat(amount).toFixed(2);
    
    if (currency.position === 'before') {
        return currency.symbol + formattedAmount;
    } else {
        return formattedAmount + ' ' + currency.symbol;
    }
}

// LocalStorage utility functions

function getExpenses() {
    var expensesJson = localStorage.getItem('expenses');
    if (expensesJson === null) {
        return [];
    }
    return JSON.parse(expensesJson);
}

function saveExpenses(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function getNotes() {
    var notesJson = localStorage.getItem('notes');
    if (notesJson === null) {
        return '';
    }
    return notesJson;
}

function saveNotes(notes) {
    localStorage.setItem('notes', notes);
}

function getNotesTabs() {
    var tabsJson = localStorage.getItem('notesTabs');
    if (tabsJson === null) {
        return [];
    }
    return JSON.parse(tabsJson);
}

function saveNotesTabs(tabs) {
    localStorage.setItem('notesTabs', JSON.stringify(tabs));
}

function getTodos() {
    var todosJson = localStorage.getItem('todos');
    if (todosJson === null) {
        return [];
    }
    var todos = JSON.parse(todosJson);
    // Migrate old todos that don't have date, time, or completed fields
    for (var i = 0; i < todos.length; i++) {
        if (!todos[i].hasOwnProperty('date')) {
            todos[i].date = '';
        }
        if (!todos[i].hasOwnProperty('time')) {
            todos[i].time = '';
        }
        if (!todos[i].hasOwnProperty('completed')) {
            todos[i].completed = false;
        }
    }
    return todos;
}

function saveTodos(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Home page - Add Expense
function initHomePage() {
    var addButton = document.getElementById('addExpenseBtn');
    if (addButton) {
        addButton.addEventListener('click', function() {
            var amountInput = document.getElementById('amount');
            var categoryInput = document.getElementById('category');
            var descriptionInput = document.getElementById('description');
            var dateInput = document.getElementById('date');
            var messageDiv = document.getElementById('message');
            
            var amount = amountInput.value.trim();
            var category = categoryInput.value.trim();
            var description = descriptionInput.value.trim();
            var date = dateInput.value;
            
            if (amount === '' || category === '' || date === '') {
                showMessage('Please fill in all required fields', 'error');
                return;
            }
            
            var amountNum = parseFloat(amount);
            if (isNaN(amountNum) || amountNum <= 0) {
                showMessage('Please enter a valid amount', 'error');
                return;
            }
            
            var expenses = getExpenses();
            var newExpense = {
                id: Date.now(),
                amount: amountNum,
                category: category,
                description: description,
                date: date
            };
            
            expenses.push(newExpense);
            saveExpenses(expenses);
            
            amountInput.value = '';
            categoryInput.value = '';
            descriptionInput.value = '';
            dateInput.value = '';
            
            showMessage('Expense added successfully!', 'success');
        });
    }
}

function showMessage(text, type) {
    var messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + type;
        setTimeout(function() {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 3000);
    }
}

// Expenses page - Display expenses
function initExpensesPage() {
    displayExpenses();
}

function displayExpenses() {
    var expenses = getExpenses();
    var expensesList = document.getElementById('expensesList');
    var totalDiv = document.getElementById('totalExpense');
    
    if (expensesList) {
        expensesList.innerHTML = '';
        
        if (expenses.length === 0) {
            expensesList.innerHTML = '<p class="empty-state">No expenses found. Add your first expense from the Home page.</p>';
        } else {
            for (var i = 0; i < expenses.length; i++) {
                var expense = expenses[i];
                var expenseDiv = document.createElement('div');
                expenseDiv.className = 'expense-item';
                
                var infoDiv = document.createElement('div');
                infoDiv.className = 'expense-info';
                var descriptionText = expense.description || 'No description';
                infoDiv.innerHTML = '<p><strong>Amount:</strong> ' + formatCurrency(expense.amount) + '</p>' +
                                   '<p><strong>Category:</strong> ' + expense.category + '</p>' +
                                   '<p><strong>Description:</strong> ' + descriptionText + '</p>' +
                                   '<p><strong>Date:</strong> ' + expense.date + '</p>';
                
                var buttonGroup = document.createElement('div');
                buttonGroup.className = 'button-group';
                
                var editBtn = document.createElement('button');
                editBtn.className = 'edit';
                editBtn.textContent = 'Edit';
                editBtn.setAttribute('data-id', expense.id);
                editBtn.onclick = function() {
                    var expenseId = this.getAttribute('data-id');
                    window.location.href = 'edit.html?id=' + expenseId;
                };
                
                var deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete';
                deleteBtn.textContent = 'Delete';
                deleteBtn.onclick = function(expenseId) {
                    return function() {
                        deleteExpense(expenseId);
                    };
                }(expense.id);
                
                buttonGroup.appendChild(editBtn);
                buttonGroup.appendChild(deleteBtn);
                
                expenseDiv.appendChild(infoDiv);
                expenseDiv.appendChild(buttonGroup);
                expensesList.appendChild(expenseDiv);
            }
        }
    }
    
    if (totalDiv) {
        var total = 0;
        for (var i = 0; i < expenses.length; i++) {
            total += expenses[i].amount;
        }
        totalDiv.textContent = 'Total Expenses: ' + formatCurrency(total);
    }
}

function deleteExpense(expenseId) {
    var expenses = getExpenses();
    var newExpenses = [];
    for (var i = 0; i < expenses.length; i++) {
        if (expenses[i].id !== expenseId) {
            newExpenses.push(expenses[i]);
        }
    }
    saveExpenses(newExpenses);
    displayExpenses();
}

// Notes page
var currentTabId = null;

function initNotesPage() {
    var tabs = getNotesTabs();
    
    // Migrate old notes to first tab if tabs don't exist
    if (tabs.length === 0) {
        var oldNotes = getNotes();
        if (oldNotes && oldNotes !== '') {
            var firstTab = {
                id: Date.now(),
                name: 'Notes 1',
                content: oldNotes
            };
            tabs.push(firstTab);
            saveNotesTabs(tabs);
            localStorage.removeItem('notes');
        } else {
            // Create default first tab
            var defaultTab = {
                id: Date.now(),
                name: 'Notes 1',
                content: ''
            };
            tabs.push(defaultTab);
            saveNotesTabs(tabs);
        }
    }
    
    displayTabs();
    if (tabs.length > 0) {
        switchToTab(tabs[0].id);
    }
    
    var addTabBtn = document.getElementById('addTabBtn');
    if (addTabBtn) {
        addTabBtn.addEventListener('click', function() {
            createNewTab();
        });
    }
    
    var saveButton = document.getElementById('saveNotesBtn');
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            saveCurrentTab();
        });
    }
}

function displayTabs() {
    var tabs = getNotesTabs();
    var tabsList = document.getElementById('tabsList');
    
    if (tabsList) {
        tabsList.innerHTML = '';
        
        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            var tabButton = document.createElement('div');
            tabButton.className = 'tab-button';
            if (tab.id === currentTabId) {
                tabButton.classList.add('active');
            }
            
            var tabName = document.createElement('span');
            tabName.textContent = tab.name;
            tabName.contentEditable = false;
            
            var deleteBtn = document.createElement('span');
            deleteBtn.className = 'delete-tab';
            deleteBtn.textContent = '×';
            deleteBtn.onclick = function(tabId) {
                return function(e) {
                    e.stopPropagation();
                    deleteTab(tabId);
                };
            }(tab.id);
            
            tabButton.appendChild(tabName);
            if (tabs.length > 1) {
                tabButton.appendChild(deleteBtn);
            }
            
            tabButton.onclick = function(tabId) {
                return function() {
                    switchToTab(tabId);
                };
            }(tab.id);
            
            tabsList.appendChild(tabButton);
        }
    }
}

function createNewTab() {
    var tabs = getNotesTabs();
    var tabNumber = tabs.length + 1;
    var newTab = {
        id: Date.now(),
        name: 'Notes ' + tabNumber,
        content: ''
    };
    tabs.push(newTab);
    saveNotesTabs(tabs);
    displayTabs();
    switchToTab(newTab.id);
}

function switchToTab(tabId) {
    // Save current tab before switching (silently, no message)
    if (currentTabId !== null) {
        saveCurrentTabSilently();
    }
    
    var tabs = getNotesTabs();
    var tab = null;
    
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === tabId) {
            tab = tabs[i];
            break;
        }
    }
    
    if (tab) {
        currentTabId = tabId;
        var notesTextarea = document.getElementById('notesTextarea');
        if (notesTextarea) {
            notesTextarea.value = tab.content || '';
        }
        displayTabs();
    }
}

function saveCurrentTabSilently() {
    if (currentTabId === null) {
        return;
    }
    
    var notesTextarea = document.getElementById('notesTextarea');
    if (!notesTextarea) {
        return;
    }
    
    var tabs = getNotesTabs();
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === currentTabId) {
            tabs[i].content = notesTextarea.value;
            saveNotesTabs(tabs);
            break;
        }
    }
}

function saveCurrentTab() {
    if (currentTabId === null) {
        return;
    }
    
    var notesTextarea = document.getElementById('notesTextarea');
    if (!notesTextarea) {
        return;
    }
    
    var tabs = getNotesTabs();
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id === currentTabId) {
            tabs[i].content = notesTextarea.value;
            saveNotesTabs(tabs);
            showMessage('Notes saved successfully!', 'success');
            break;
        }
    }
}

function deleteTab(tabId) {
    var tabs = getNotesTabs();
    if (tabs.length <= 1) {
        showMessage('Cannot delete the last tab', 'error');
        return;
    }
    
    var newTabs = [];
    for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].id !== tabId) {
            newTabs.push(tabs[i]);
        }
    }
    
    saveNotesTabs(newTabs);
    
    // Switch to first tab if current tab was deleted
    if (currentTabId === tabId) {
        if (newTabs.length > 0) {
            switchToTab(newTabs[0].id);
        }
    } else {
        displayTabs();
    }
}

// Todo page
function initTodoPage() {
    displayTodos();
    
    var addButton = document.getElementById('addTodoBtn');
    if (addButton) {
        addButton.addEventListener('click', function() {
            var todoInput = document.getElementById('todoInput');
            var todoDate = document.getElementById('todoDate');
            var todoTime = document.getElementById('todoTime');
            var messageDiv = document.getElementById('message');
            
            var task = todoInput.value.trim();
            var date = todoDate.value;
            var time = todoTime.value;
            
            if (task === '') {
                showMessage('Please enter a task', 'error');
                return;
            }
            
            if (date === '') {
                showMessage('Please select a date', 'error');
                return;
            }
            
            if (time === '') {
                showMessage('Please select a time', 'error');
                return;
            }
            
            var todos = getTodos();
            var newTodo = {
                id: Date.now(),
                task: task,
                date: date,
                time: time,
                completed: false
            };
            
            todos.push(newTodo);
            saveTodos(todos);
            
            todoInput.value = '';
            todoDate.value = '';
            todoTime.value = '';
            displayTodos();
            showMessage('Task added successfully!', 'success');
        });
    }
}

function displayTodos() {
    var todos = getTodos();
    var todoList = document.getElementById('todoList');
    var completedList = document.getElementById('completedList');
    
    var activeTodos = [];
    var completedTodos = [];
    
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].completed) {
            completedTodos.push(todos[i]);
        } else {
            activeTodos.push(todos[i]);
        }
    }
    
    if (todoList) {
        todoList.innerHTML = '';
        
        if (activeTodos.length === 0) {
            todoList.innerHTML = '<div class="card"><p class="empty-state">No active tasks found. Add your first task above.</p></div>';
        } else {
            for (var i = 0; i < activeTodos.length; i++) {
                var todo = activeTodos[i];
                var todoDiv = document.createElement('div');
                todoDiv.className = 'todo-item';
                
                var infoDiv = document.createElement('div');
                infoDiv.className = 'todo-info';
                var dateText = todo.date || 'Not set';
                var timeText = todo.time || 'Not set';
                infoDiv.innerHTML = '<p><strong>Task:</strong> ' + todo.task + '</p>' +
                                   '<p><strong>Date:</strong> ' + dateText + '</p>' +
                                   '<p><strong>Time:</strong> ' + timeText + '</p>';
                
                var completeBtn = document.createElement('button');
                completeBtn.className = 'complete';
                completeBtn.textContent = 'Complete';
                completeBtn.onclick = function(todoId) {
                    return function() {
                        markTodoComplete(todoId);
                    };
                }(todo.id);
                
                todoDiv.appendChild(infoDiv);
                todoDiv.appendChild(completeBtn);
                todoList.appendChild(todoDiv);
            }
        }
    }
    
    if (completedList) {
        completedList.innerHTML = '';
        
        if (completedTodos.length === 0) {
            completedList.innerHTML = '<div class="card"><p class="empty-state">No completed tasks yet.</p></div>';
        } else {
            for (var i = 0; i < completedTodos.length; i++) {
                var todo = completedTodos[i];
                var todoDiv = document.createElement('div');
                todoDiv.className = 'todo-item completed';
                
                var infoDiv = document.createElement('div');
                infoDiv.className = 'todo-info';
                var dateText = todo.date || 'Not set';
                var timeText = todo.time || 'Not set';
                infoDiv.innerHTML = '<p><strong>Task:</strong> ' + todo.task + '</p>' +
                                   '<p><strong>Date:</strong> ' + dateText + '</p>' +
                                   '<p><strong>Time:</strong> ' + timeText + '</p>';
                
                todoDiv.appendChild(infoDiv);
                completedList.appendChild(todoDiv);
            }
        }
    }
}

function markTodoComplete(todoId) {
    var todos = getTodos();
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].id === todoId) {
            todos[i].completed = true;
            break;
        }
    }
    saveTodos(todos);
    displayTodos();
}

// Edit expense page
function initEditPage() {
    var urlString = window.location.search;
    var expenseId = null;
    
    if (urlString) {
        var urlParams = urlString.substring(1).split('&');
        for (var j = 0; j < urlParams.length; j++) {
            var param = urlParams[j].split('=');
            if (param[0] === 'id') {
                expenseId = parseInt(param[1]);
                break;
            }
        }
    }
    
    if (!expenseId || isNaN(expenseId)) {
        window.location.href = 'expenses.html';
        return;
    }
    
    var expenses = getExpenses();
    var expense = null;
    
    expenseId = Number(expenseId);
    
    for (var i = 0; i < expenses.length; i++) {
        var currentId = Number(expenses[i].id);
        if (currentId === expenseId) {
            expense = expenses[i];
            break;
        }
    }
    
    if (!expense) {
        window.location.href = 'expenses.html';
        return;
    }
    
    var amountInput = document.getElementById('amount');
    var categoryInput = document.getElementById('category');
    var descriptionInput = document.getElementById('description');
    var dateInput = document.getElementById('date');
    var saveButton = document.getElementById('saveExpenseBtn');
    
    if (amountInput) {
        amountInput.value = expense.amount;
    }
    if (categoryInput) {
        categoryInput.value = expense.category;
    }
    if (descriptionInput) {
        descriptionInput.value = expense.description || '';
    }
    if (dateInput) {
        dateInput.value = expense.date;
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            var amount = amountInput.value.trim();
            var category = categoryInput.value.trim();
            var description = descriptionInput.value.trim();
            var date = dateInput.value;
            var messageDiv = document.getElementById('message');
            
            if (amount === '' || category === '' || date === '') {
                showMessage('Please fill in all required fields', 'error');
                return;
            }
            
            var amountNum = parseFloat(amount);
            if (isNaN(amountNum) || amountNum <= 0) {
                showMessage('Please enter a valid amount', 'error');
                return;
            }
            
            var updatedExpenses = [];
            for (var i = 0; i < expenses.length; i++) {
                if (expenses[i].id === expenseId) {
                    updatedExpenses.push({
                        id: expenseId,
                        amount: amountNum,
                        category: category,
                        description: description,
                        date: date
                    });
                } else {
                    updatedExpenses.push(expenses[i]);
                }
            }
            
            saveExpenses(updatedExpenses);
            showMessage('Expense updated successfully!', 'success');
            
            setTimeout(function() {
                window.location.href = 'expenses.html';
            }, 1500);
        });
    }
}

// Summary page
function initSummaryPage() {
    displaySummaryExpenses();
    displaySummaryTodos();
    displaySummaryNotes();
}

function displaySummaryExpenses() {
    var expenses = getExpenses();
    var expensesList = document.getElementById('summaryExpensesList');
    var totalDiv = document.getElementById('summaryTotalExpense');
    
    if (expensesList) {
        expensesList.innerHTML = '';
        
        if (expenses.length === 0) {
            expensesList.innerHTML = '<p class="empty-state">No expenses found.</p>';
        } else {
            // Show only the 5 most recent expenses
            var recentExpenses = expenses.slice(-5).reverse();
            for (var i = 0; i < recentExpenses.length; i++) {
                var expense = recentExpenses[i];
                var expenseDiv = document.createElement('div');
                expenseDiv.className = 'expense-item';
                
                var infoDiv = document.createElement('div');
                infoDiv.className = 'expense-info';
                var descriptionText = expense.description || 'No description';
                infoDiv.innerHTML = '<p><strong>Amount:</strong> ' + formatCurrency(expense.amount) + '</p>' +
                                   '<p><strong>Category:</strong> ' + expense.category + '</p>' +
                                   '<p><strong>Description:</strong> ' + descriptionText + '</p>' +
                                   '<p><strong>Date:</strong> ' + expense.date + '</p>';
                
                expenseDiv.appendChild(infoDiv);
                expensesList.appendChild(expenseDiv);
            }
            
            if (expenses.length > 5) {
                var moreDiv = document.createElement('p');
                moreDiv.style.textAlign = 'center';
                moreDiv.style.marginTop = '15px';
                moreDiv.style.color = 'var(--text-muted)';
                moreDiv.innerHTML = '<a href="expenses.html" style="color: var(--orange); text-decoration: none;">View all ' + expenses.length + ' expenses →</a>';
                expensesList.appendChild(moreDiv);
            }
        }
    }
    
    if (totalDiv) {
        var total = 0;
        for (var i = 0; i < expenses.length; i++) {
            total += expenses[i].amount;
        }
        totalDiv.textContent = 'Total Expenses: ' + formatCurrency(total);
    }
}

function displaySummaryTodos() {
    var todos = getTodos();
    var todoList = document.getElementById('summaryTodoList');
    var completedList = document.getElementById('summaryCompletedList');
    
    var activeTodos = [];
    var completedTodos = [];
    
    for (var i = 0; i < todos.length; i++) {
        if (todos[i].completed) {
            completedTodos.push(todos[i]);
        } else {
            activeTodos.push(todos[i]);
        }
    }
    
    if (todoList) {
        todoList.innerHTML = '';
        
        if (activeTodos.length === 0) {
            todoList.innerHTML = '<p class="empty-state">No active tasks found.</p>';
        } else {
            // Show only the 5 most recent active todos
            var recentTodos = activeTodos.slice(-5).reverse();
            for (var i = 0; i < recentTodos.length; i++) {
                var todo = recentTodos[i];
                var todoDiv = document.createElement('div');
                todoDiv.className = 'todo-item';
                
                var infoDiv = document.createElement('div');
                infoDiv.className = 'todo-info';
                var dateText = todo.date || 'Not set';
                var timeText = todo.time || 'Not set';
                infoDiv.innerHTML = '<p><strong>Task:</strong> ' + todo.task + '</p>' +
                                   '<p><strong>Date:</strong> ' + dateText + '</p>' +
                                   '<p><strong>Time:</strong> ' + timeText + '</p>';
                
                todoDiv.appendChild(infoDiv);
                todoList.appendChild(todoDiv);
            }
            
            if (activeTodos.length > 5) {
                var moreDiv = document.createElement('p');
                moreDiv.style.textAlign = 'center';
                moreDiv.style.marginTop = '15px';
                moreDiv.style.color = 'var(--text-muted)';
                moreDiv.innerHTML = '<a href="todo.html" style="color: var(--orange); text-decoration: none;">View all ' + activeTodos.length + ' active tasks →</a>';
                todoList.appendChild(moreDiv);
            }
        }
    }
    
    if (completedList) {
        completedList.innerHTML = '';
        
        if (completedTodos.length === 0) {
            completedList.innerHTML = '<p class="empty-state">No completed tasks yet.</p>';
        } else {
            // Show only the 5 most recent completed todos
            var recentCompleted = completedTodos.slice(-5).reverse();
            for (var i = 0; i < recentCompleted.length; i++) {
                var todo = recentCompleted[i];
                var todoDiv = document.createElement('div');
                todoDiv.className = 'todo-item completed';
                
                var infoDiv = document.createElement('div');
                infoDiv.className = 'todo-info';
                var dateText = todo.date || 'Not set';
                var timeText = todo.time || 'Not set';
                infoDiv.innerHTML = '<p><strong>Task:</strong> ' + todo.task + '</p>' +
                                   '<p><strong>Date:</strong> ' + dateText + '</p>' +
                                   '<p><strong>Time:</strong> ' + timeText + '</p>';
                
                todoDiv.appendChild(infoDiv);
                completedList.appendChild(todoDiv);
            }
            
            if (completedTodos.length > 5) {
                var moreDiv = document.createElement('p');
                moreDiv.style.textAlign = 'center';
                moreDiv.style.marginTop = '15px';
                moreDiv.style.color = 'var(--text-muted)';
                moreDiv.innerHTML = '<a href="todo.html" style="color: var(--orange); text-decoration: none;">View all ' + completedTodos.length + ' completed tasks →</a>';
                completedList.appendChild(moreDiv);
            }
        }
    }
}

function displaySummaryNotes() {
    var tabs = getNotesTabs();
    var notesList = document.getElementById('summaryNotesList');
    
    if (notesList) {
        notesList.innerHTML = '';
        
        if (tabs.length === 0) {
            notesList.innerHTML = '<p class="empty-state">No notes found.</p>';
        } else {
            for (var i = 0; i < tabs.length; i++) {
                var tab = tabs[i];
                var noteCard = document.createElement('div');
                noteCard.className = 'card';
                noteCard.style.marginBottom = '15px';
                
                var tabTitle = document.createElement('h3');
                tabTitle.style.marginBottom = '12px';
                tabTitle.style.color = 'var(--orange)';
                tabTitle.style.fontSize = '18px';
                tabTitle.style.fontWeight = '600';
                tabTitle.textContent = tab.name;
                
                var noteContent = document.createElement('div');
                noteContent.style.color = 'var(--text-dark)';
                noteContent.style.whiteSpace = 'pre-wrap';
                noteContent.style.lineHeight = '1.6';
                noteContent.textContent = tab.content || 'No content';
                
                noteCard.appendChild(tabTitle);
                noteCard.appendChild(noteContent);
                notesList.appendChild(noteCard);
            }
            
            var moreDiv = document.createElement('p');
            moreDiv.style.textAlign = 'center';
            moreDiv.style.marginTop = '20px';
            moreDiv.style.color = 'var(--text-muted)';
            moreDiv.innerHTML = '<a href="notes.html" style="color: var(--orange); text-decoration: none;">Edit notes →</a>';
            notesList.appendChild(moreDiv);
        }
    }
}

// Initialize currency selector
function initCurrencySelector() {
    var currencySelector = document.getElementById('currencySelector');
    if (currencySelector) {
        // Set the current selected currency
        var currentCurrency = getCurrency();
        currencySelector.value = currentCurrency;
        
        // Handle currency change
        currencySelector.addEventListener('change', function() {
            var selectedCurrency = this.value;
            setCurrency(selectedCurrency);
        });
    }
}

// Initialize page based on current page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize currency selector on all pages
    initCurrencySelector();
    
    var currentPage = window.location.pathname;
    
    if (currentPage.includes('index.html') || currentPage.endsWith('/')) {
        initHomePage();
    } else if (currentPage.includes('expenses.html')) {
        initExpensesPage();
    } else if (currentPage.includes('notes.html')) {
        initNotesPage();
    } else if (currentPage.includes('todo.html')) {
        initTodoPage();
    } else if (currentPage.includes('edit.html')) {
        initEditPage();
    } else if (currentPage.includes('summary.html')) {
        initSummaryPage();
    }
});

