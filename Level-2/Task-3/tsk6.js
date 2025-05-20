document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const allTasksList = document.getElementById('all-tasks-list');
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');
    const alertContainer = document.getElementById('alert-container');
    const editModal = document.getElementById('edit-modal');
    const editTaskInput = document.getElementById('edit-task-input');
    const saveEditBtn = document.getElementById('save-edit-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const closeBtn = document.querySelector('.close-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const taskLists = document.querySelectorAll('.task-list');
    const totalTasksEl = document.getElementById('total-tasks');
    const pendingTasksEl = document.getElementById('pending-tasks');
    const completedTasksEl = document.getElementById('completed-tasks');

    // State
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentEditId = null;

    // Initialize the app
    init();

    function init() {
        renderAllTasks();
        setupEventListeners();
        updateStats();
    }

    function setupEventListeners() {
        // Add task
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });

        // Tab switching
        tabBtns.forEach(btn => {
            btn.addEventListener('click', switchTab);
        });

        // Edit modal
        saveEditBtn.addEventListener('click', saveEditedTask);
        cancelEditBtn.addEventListener('click', closeEditModal);
        closeBtn.addEventListener('click', closeEditModal);
        editModal.addEventListener('click', function(e) {
            if (e.target === editModal) closeEditModal();
        });
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            showAlert('Please enter a task', 'error');
            return;
        }

        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        tasks.unshift(newTask);
        saveTasks();
        renderAllTasks();
        updateStats();
        taskInput.value = '';
        showAlert('Task added successfully', 'success');
    }

    function renderAllTasks() {
        allTasksList.innerHTML = '';
        pendingList.innerHTML = '';
        completedList.innerHTML = '';

        if (tasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = 'No tasks yet. Add one above!';
            emptyMessage.classList.add('empty-message');
            allTasksList.appendChild(emptyMessage);
            return;
        }

        tasks.forEach(task => {
            const taskItem = createTaskElement(task);
            allTasksList.appendChild(taskItem.cloneNode(true));

            // Add to the appropriate list (pending or completed)
            if (task.completed) {
                completedList.appendChild(taskItem);
            } else {
                pendingList.appendChild(taskItem);
            }
        });
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.dataset.id = task.id;

        const createdAt = new Date(task.createdAt);
        const completedAt = task.completedAt ? new Date(task.completedAt) : null;

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <div class="task-time">
                    <span>Added: ${formatDate(createdAt)}</span>
                    ${completedAt ? `<span>Completed: ${formatDate(completedAt)}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit" title="Edit task">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="task-btn delete" title="Delete task">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;

        // Add event listeners to the buttons
        const checkbox = li.querySelector('.task-checkbox');
        const editBtn = li.querySelector('.edit');
        const deleteBtn = li.querySelector('.delete');

        checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
        editBtn.addEventListener('click', () => openEditModal(task.id));
        deleteBtn.addEventListener('click', () => deleteTask(task.id));

        return li;
    }

    function toggleTaskComplete(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex === -1) return;

        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        tasks[taskIndex].completedAt = tasks[taskIndex].completed ? new Date().toISOString() : null;

        saveTasks();
        renderAllTasks(); // This will re-render all lists
        updateStats();

        const action = tasks[taskIndex].completed ? 'completed' : 'marked as pending';
        showAlert(`Task ${action}`, 'success');
    }

    function openEditModal(taskId) {
        const task = tasks.find(task => task.id === taskId);
        if (!task) return;

        currentEditId = taskId;
        editTaskInput.value = task.text;
        editModal.classList.add('show');
        editTaskInput.focus();
    }

    function closeEditModal() {
        editModal.classList.remove('show');
        currentEditId = null;
        editTaskInput.value = '';
    }

    function saveEditedTask() {
        const newText = editTaskInput.value.trim();
        if (!newText) {
            showAlert('Task cannot be empty', 'error');
            return;
        }

        const taskIndex = tasks.findIndex(task => task.id === currentEditId);
        if (taskIndex === -1) return;

        tasks[taskIndex].text = newText;
        saveTasks();
        renderAllTasks();
        closeEditModal();
        showAlert('Task updated successfully', 'success');
    }

    function deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) return;

        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderAllTasks();
        updateStats();
        showAlert('Task deleted', 'warning');
    }

    function switchTab(e) {
        const tabId = e.currentTarget.dataset.tab;

        // Update active tab button
        tabBtns.forEach(btn => btn.classList.remove('active'));
        e.currentTarget.classList.add('active');

        // Show corresponding task list
        taskLists.forEach(list => list.classList.remove('active'));
        document.getElementById(`${tabId}-tasks${tabId === 'all' ? '' : '-list'}`).classList.add('active');
    }

    function updateStats() {
        totalTasksEl.textContent = tasks.length;
        pendingTasksEl.textContent = tasks.filter(task => !task.completed).length;
        completedTasksEl.textContent = tasks.filter(task => task.completed).length;
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function formatDate(date) {
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        `;

        alertContainer.appendChild(alert);

        // Show the alert
        setTimeout(() => {
            alert.classList.add('show');
        }, 10);

        // Remove the alert after 3 seconds
        setTimeout(() => {
            alert.classList.remove('show');
            setTimeout(() => {
                alert.remove();
            }, 300);
        }, 3000);
    }
});