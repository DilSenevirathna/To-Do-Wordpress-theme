jQuery(document).ready(function($) {
    // Initialize to-do list
    initTodoList();
    
    // Initialize Pomodoro Timer
    initPomodoroTimer();
    
    // Initialize other premium features
    initAISuggestions();
    initTimeTracking();
    initFocusMode();
    initKanbanBoard();
    initSmartNotifications();
    
    // Theme toggle functionality
    $('.theme-toggle').on('click', function() {
        $('body').toggleClass('dark-mode');
        const isDarkMode = $('body').hasClass('dark-mode');
        localStorage.setItem('todo_dark_mode', isDarkMode);
        
        // Update icon
        const icon = $(this).find('i');
        if (isDarkMode) {
            icon.removeClass('fa-moon').addClass('fa-sun');
        } else {
            icon.removeClass('fa-sun').addClass('fa-moon');
        }
    });
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('todo_dark_mode');
    if (savedTheme === 'true') {
        $('body').addClass('dark-mode');
        $('.theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
    }
    
    // Initialize Pomodoro Timer
    function initPomodoroTimer() {
        let pomodoroTime = 25 * 60; // 25 minutes in seconds
        let isRunning = false;
        let timerInterval = null;
        let isWorkSession = true;
        let sessionsCompleted = 0;
        
        const display = $('.pomodoro-display');
        const startBtn = $('.pomodoro-start');
        const pauseBtn = $('.pomodoro-pause');
        const resetBtn = $('.pomodoro-reset');
        const sessionCounter = $('.pomodoro-sessions');
        
        // Format time for display
        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        
        // Update display
        function updateDisplay() {
            display.text(formatTime(pomodoroTime));
            
            // Update progress ring
            const totalTime = isWorkSession ? 25 * 60 : 5 * 60;
            const percentage = ((totalTime - pomodoroTime) / totalTime) * 100;
            $('.pomodoro-progress-ring circle').css('stroke-dashoffset', 100 - percentage);
        }
        
        // Start timer
        function startTimer() {
            if (!isRunning) {
                isRunning = true;
                timerInterval = setInterval(() => {
                    if (pomodoroTime > 0) {
                        pomodoroTime--;
                        updateDisplay();
                    } else {
                        clearInterval(timerInterval);
                        isRunning = false;
                        
                        // Play completion sound
                        try {
                            const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
                            audio.play().catch(e => console.log('Audio play failed:', e));
                        } catch (e) {
                            console.log('Audio error:', e);
                        }
                        
                        // Show notification
                        if (isWorkSession) {
                            sessionsCompleted++;
                            sessionCounter.text(sessionsCompleted);
                            $('.pomodoro-session-complete').fadeIn();
                            
                            // After 4 work sessions, take a long break
                            if (sessionsCompleted % 4 === 0) {
                                $('.pomodoro-status').text('Long Break Time!');
                                pomodoroTime = 15 * 60; // 15 minutes
                            } else {
                                $('.pomodoro-status').text('Break Time!');
                                pomodoroTime = 5 * 60; // 5 minutes
                            }
                        } else {
                            $('.pomodoro-status').text('Back to Work!');
                            pomodoroTime = 25 * 60; // 25 minutes
                        }
                        
                        isWorkSession = !isWorkSession;
                        updateDisplay();
                        
                        // Show desktop notification if available
                        if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification(isWorkSession ? 'Break Time Over!' : 'Work Session Complete!', {
                                body: isWorkSession ? 'Time to get back to work!' : 'Take a well-deserved break!',
                                icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzQzNjFlZSIvPgo8cGF0aCBkPSJNMzIgMTZWMzJIMTZWMzZIMzJWNjRINDBWMzZINTZWMzJINDBWMjRINjRWMjBIMzJWMjBIMTZWMjBIMFYxNkgxNlYxNkgzMlYxNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg=='
                            });
                        }
                    }
                }, 1000);
                
                startBtn.hide();
                pauseBtn.show();
                $('.pomodoro-status').text(isWorkSession ? 'Work Session' : 'Break Time');
            }
        }
        
        // Pause timer
        function pauseTimer() {
            if (isRunning) {
                clearInterval(timerInterval);
                isRunning = false;
                startBtn.show();
                pauseBtn.hide();
                $('.pomodoro-status').text('Paused');
            }
        }
        
        // Reset timer
        function resetTimer() {
            clearInterval(timerInterval);
            isRunning = false;
            pomodoroTime = isWorkSession ? 25 * 60 : 5 * 60;
            updateDisplay();
            startBtn.show();
            pauseBtn.hide();
            $('.pomodoro-status').text(isWorkSession ? 'Work Session' : 'Break Time');
        }
        
        // Set up event listeners
        startBtn.on('click', startTimer);
        pauseBtn.on('click', pauseTimer);
        resetBtn.on('click', resetTimer);
        
        // Session type toggle
        $('.pomodoro-type-btn').on('click', function() {
            const type = $(this).data('type');
            $('.pomodoro-type-btn').removeClass('active');
            $(this).addClass('active');
            
            if (type === 'work') {
                isWorkSession = true;
                pomodoroTime = 25 * 60;
            } else {
                isWorkSession = false;
                pomodoroTime = 5 * 60;
            }
            
            updateDisplay();
            resetTimer();
        });
        
        // Close completion message
        $('.pomodoro-close-message').on('click', function() {
            $('.pomodoro-session-complete').fadeOut();
        });
        
        // Request notification permission
        if ('Notification' in window) {
            Notification.requestPermission();
        }
        
        // Initialize display
        updateDisplay();
        pauseBtn.hide();
    }
    
    // AI Suggestions functionality
    function initAISuggestions() {
        $('.ai-refresh').on('click', function() {
            // Simulate AI generating new suggestions
            const suggestions = [
                "Schedule a team meeting for project review",
                "Prepare quarterly performance report",
                "Follow up with clients from last week's meeting",
                "Organize your workspace for better productivity",
                "Plan your next day before finishing work today",
                "Break down big tasks into smaller actionable steps",
                "Review your goals for the week",
                "Delegate tasks that others can handle",
                "Set aside time for creative thinking",
                "Backup important files and documents"
            ];
            
            // Shuffle suggestions
            const shuffled = [...suggestions].sort(() => Math.random() - 0.5);
            
            // Update UI
            $('.ai-suggestion').each(function(index) {
                if (index < 3) {
                    $(this).text(shuffled[index]);
                }
            });
            
            // Show animation
            $(this).addClass('rotating');
            setTimeout(() => {
                $(this).removeClass('rotating');
            }, 1000);
        });
        
        // Accept suggestion
        $(document).on('click', '.ai-suggestion', function() {
            const taskText = $(this).text();
            $('.todo-input').val(taskText).focus();
            $(this).fadeOut(300, function() {
                $(this).remove();
                if ($('.ai-suggestion').length === 0) {
                    $('.ai-suggestions').fadeOut();
                }
            });
            
            // Show notification
            showNotification('Task added from AI suggestion!');
        });
    }
    
    // Time Tracking functionality
    function initTimeTracking() {
        const timers = new Map();
        
        $(document).on('click', '.timer-start', function() {
            const taskId = $(this).closest('.todo-item').data('id');
            const $timer = $(this).siblings('.timer-display');
            const $startBtn = $(this);
            const $stopBtn = $(this).siblings('.timer-stop');
            
            // If timer already exists for this task, remove it
            if (timers.has(taskId)) {
                clearInterval(timers.get(taskId));
                timers.delete(taskId);
            }
            
            let seconds = parseInt($timer.data('seconds') || 0);
            
            const timerInterval = setInterval(function() {
                seconds++;
                $timer.data('seconds', seconds);
                
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                
                $timer.text(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
            }, 1000);
            
            // Store timer reference
            timers.set(taskId, timerInterval);
            
            // Update UI
            $startBtn.hide();
            $stopBtn.show();
            $(this).closest('.todo-item').addClass('time-tracking-active');
        });
        
        $(document).on('click', '.timer-stop', function() {
            const taskId = $(this).closest('.todo-item').data('id');
            
            if (timers.has(taskId)) {
                clearInterval(timers.get(taskId));
                timers.delete(taskId);
            }
            
            // Update UI
            $(this).hide();
            $(this).siblings('.timer-start').show();
            $(this).closest('.todo-item').removeClass('time-tracking-active');
            
            // Save time to task
            const timeSpent = $(this).siblings('.timer-display').data('seconds') || 0;
            
            let tasks = getTasks();
            tasks = tasks.map(task => {
                if (task.id === taskId) {
                    task.timeSpent = (task.timeSpent || 0) + timeSpent;
                    task.lastTimeTracked = new Date().toISOString();
                }
                return task;
            });
            
            localStorage.setItem('todo_tasks', JSON.stringify(tasks));
            
            // Show notification
            const hours = Math.floor(timeSpent / 3600);
            const minutes = Math.floor((timeSpent % 3600) / 60);
            showNotification(`Tracked ${hours}h ${minutes}m for task`);
        });
    }
    
    // Focus Mode functionality
    function initFocusMode() {
        let focusModeActive = false;
        let focusedTaskId = null;
        
        $('.focus-mode-toggle').on('click', function() {
            focusModeActive = !focusModeActive;
            
            if (focusModeActive) {
                // Enter focus mode
                $('body').addClass('focus-mode');
                $(this).addClass('active');
                $(this).html('<i class="fas fa-times"></i>');
                
                // If no task is focused, focus on the first incomplete task
                if (!focusedTaskId) {
                    const firstIncomplete = $('.todo-item:not(.completed)').first();
                    if (firstIncomplete.length) {
                        focusedTaskId = firstIncomplete.data('id');
                        firstIncomplete.addClass('focus-task');
                    }
                }
                
                showNotification('Focus mode activated');
            } else {
                // Exit focus mode
                $('body').removeClass('focus-mode');
                $(this).removeClass('active');
                $(this).html('<i class="fas fa-crosshairs"></i>');
                $('.todo-item').removeClass('focus-task');
                focusedTaskId = null;
                
                showNotification('Focus mode deactivated');
            }
        });
        
        // Click task to focus on it
        $(document).on('click', '.todo-item', function() {
            if (focusModeActive) {
                const taskId = $(this).data('id');
                
                $('.todo-item').removeClass('focus-task');
                $(this).addClass('focus-task');
                focusedTaskId = taskId;
                
                // Scroll to focused task
                $('html, body').animate({
                    scrollTop: $(this).offset().top - 100
                }, 500);
            }
        });
    }
    
    // Kanban Board functionality
    function initKanbanBoard() {
        // Initialize kanban if enabled
        if ($('#kanban-view').length) {
            generateKanbanView();
        }
        
        // View switcher
        $('.view-switcher').on('click', '.view-btn', function() {
            const view = $(this).data('view');
            $('.view-btn').removeClass('active');
            $(this).addClass('active');
            
            // Hide all views
            $('.todo-list-view, .calendar-view, .reports-view, .kanban-view').hide();
            
            // Show selected view
            $(`#${view}-view`).show();
            
            if (view === 'calendar') {
                generateCalendar();
            } else if (view === 'reports') {
                generateReports();
            } else if (view === 'kanban') {
                generateKanbanView();
            }
        });
    }
    
    // Generate Kanban View
    function generateKanbanView() {
        const tasks = getTasks();
        const columns = {
            'todo': tasks.filter(task => !task.completed && !task.inProgress),
            'inprogress': tasks.filter(task => task.inProgress && !task.completed),
            'done': tasks.filter(task => task.completed)
        };
        
        // Clear existing content
        $('.kanban-column').each(function() {
            $(this).find('.kanban-tasks').empty();
        });
        
        // Populate columns
        for (const [status, columnTasks] of Object.entries(columns)) {
            const $column = $(`#kanban-${status}`);
            const $tasksContainer = $column.find('.kanban-tasks');
            
            columnTasks.forEach(task => {
                const priorityClass = `priority-${task.priority || 'medium'}`;
                const timeSpent = task.timeSpent ? formatTimeSpent(task.timeSpent) : '';
                
                const $task = $(`
                    <div class="kanban-task ${priorityClass}" data-id="${task.id}">
                        <div class="kanban-task-content">${task.text}</div>
                        ${timeSpent ? `<div class="kanban-task-time">${timeSpent}</div>` : ''}
                        <div class="kanban-task-actions">
                            <button class="kanban-task-edit" title="Edit"><i class="fas fa-edit"></i></button>
                            <button class="kanban-task-delete" title="Delete"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                `);
                
                $tasksContainer.append($task);
            });
            
            // Update count
            $column.find('.kanban-column-count').text(columnTasks.length);
        }
        
        // Make tasks draggable
        initKanbanDragAndDrop();
    }
    
    // Initialize Kanban Drag and Drop
    function initKanbanDragAndDrop() {
        $('.kanban-task').draggable({
            revert: 'invalid',
            cursor: 'move',
            zIndex: 100,
            containment: 'document',
            helper: function(e) {
                return $(this).clone().css({
                    width: $(this).width(),
                    opacity: 0.8
                });
            }
        });
        
        $('.kanban-tasks').droppable({
            accept: '.kanban-task',
            hoverClass: 'kanban-drop-hover',
            drop: function(event, ui) {
                const $task = ui.draggable;
                const taskId = $task.data('id');
                const newStatus = $(this).closest('.kanban-column').data('status');
                
                // Update task status
                let tasks = getTasks();
                tasks = tasks.map(task => {
                    if (task.id === taskId) {
                        if (newStatus === 'done') {
                            task.completed = true;
                            task.inProgress = false;
                        } else if (newStatus === 'inprogress') {
                            task.inProgress = true;
                            task.completed = false;
                        } else {
                            task.completed = false;
                            task.inProgress = false;
                        }
                        task.statusUpdated = new Date().toISOString();
                    }
                    return task;
                });
                
                localStorage.setItem('todo_tasks', JSON.stringify(tasks));
                
                // Move task to new column
                $task.detach().css({top: 0, left: 0}).appendTo($(this));
                
                // Update counts
                updateKanbanCounts();
                
                // Show notification
                showNotification(`Task moved to ${newStatus}`);
            }
        });
    }
    
    // Update Kanban counts
    function updateKanbanCounts() {
        const tasks = getTasks();
        const counts = {
            'todo': tasks.filter(task => !task.completed && !task.inProgress).length,
            'inprogress': tasks.filter(task => task.inProgress && !task.completed).length,
            'done': tasks.filter(task => task.completed).length
        };
        
        for (const [status, count] of Object.entries(counts)) {
            $(`#kanban-${status} .kanban-column-count`).text(count);
        }
    }
    
    // Smart Notifications functionality
    function initSmartNotifications() {
        // Check for overdue tasks every minute
        setInterval(checkForNotifications, 60000);
        
        // Initial check
        setTimeout(checkForNotifications, 2000);
    }
    
    // Check for notifications
    function checkForNotifications() {
        const tasks = getTasks();
        const now = new Date();
        
        // Check for overdue tasks
        tasks.forEach(task => {
            if (task.dueDate && !task.completed) {
                const dueDate = new Date(task.dueDate);
                if (dueDate < now && !task.overdueNotified) {
                    showNotification(`Task "${task.text}" is overdue!`, 'warning');
                    
                    // Mark as notified
                    task.overdueNotified = true;
                    updateTask(task);
                }
            }
        });
        
        // Check for tasks due today
        tasks.forEach(task => {
            if (task.dueDate && !task.completed && !task.dueTodayNotified) {
                const dueDate = new Date(task.dueDate);
                const isDueToday = dueDate.toDateString() === now.toDateString();
                
                if (isDueToday) {
                    showNotification(`Task "${task.text}" is due today!`, 'info');
                    
                    // Mark as notified
                    task.dueTodayNotified = true;
                    updateTask(task);
                }
            }
        });
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        // Create notification element
        const $notification = $(`
            <div class="todo-notification notification-${type}">
                <div class="notification-icon">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
                </div>
                <div class="notification-content">${message}</div>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `);
        
        // Add to page
        $('body').append($notification);
        
        // Animate in
        setTimeout(() => {
            $notification.addClass('show');
        }, 100);
        
        // Set timeout to remove
        setTimeout(() => {
            hideNotification($notification);
        }, 5000);
        
        // Close on click
        $notification.find('.notification-close').on('click', function() {
            hideNotification($notification);
        });
    }
    
    // Hide notification
    function hideNotification($notification) {
        $notification.removeClass('show');
        setTimeout(() => {
            $notification.remove();
        }, 500);
    }
    
    // Format time spent
    function formatTimeSpent(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
    
    // Initialize the main to-do list
    function initTodoList() {
        // Load tasks from localStorage
        loadTasks();
        
        // Form submission
        $('.todo-form').on('submit', function(e) {
            e.preventDefault();
            addTask();
        });
        
        // Filter buttons
        $('.todo-filters').on('click', '.filter-btn', function() {
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            filterTasks($(this).data('filter'));
        });
        
        // Category buttons
        $('.todo-categories').on('click', '.category-btn', function() {
            $('.category-btn').removeClass('active');
            $(this).addClass('active');
            filterByCategory($(this).data('category'));
        });
        
        // Handle task actions (check/delete)
        $(document).on('change', '.todo-checkbox', function() {
            toggleTask($(this).closest('.todo-item').data('id'));
        });
        
        $(document).on('click', '.todo-delete', function(e) {
            e.preventDefault();
            deleteTask($(this).closest('.todo-item').data('id'));
        });
        
        $(document).on('click', '.todo-edit', function(e) {
            e.preventDefault();
            editTask($(this).closest('.todo-item').data('id'));
        });
        
        // Clear completed tasks
        $(document).on('click', '.clear-completed', function(e) {
            e.preventDefault();
            clearCompletedTasks();
        });
        
        // Task editor functionality
        $(document).on('click', '.editor-close, .editor-cancel', function() {
            $('#task-editor').removeClass('active');
        });
        
        $(document).on('click', '.editor-save', function() {
            saveEditedTask();
        });
        
        // Initialize with sample tasks if empty
        initializeWithSampleTasks();
    }
    
    // Add a new task
    function addTask() {
        const taskText = $('.todo-input').val().trim();
        const priority = $('.todo-priority').val();
        
        if (taskText) {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false,
                priority: priority,
                timestamp: new Date().toISOString(),
                category: 'personal',
                timeSpent: 0
            };
            
            // Save to localStorage
            saveTask(task);
            
            // Add to DOM
            renderTask(task);
            
            // Clear input and focus
            $('.todo-input').val('').focus();
            
            // Update task count and progress
            updateTaskCount();
            updateProgressBar();
            
            // Hide empty state
            $('.todo-empty').hide();
            
            // Show notification
            showNotification('Task added successfully!');
        }
    }
    
    // Save task to localStorage
    function saveTask(task) {
        let tasks = getTasks();
        tasks.push(task);
        localStorage.setItem('todo_tasks', JSON.stringify(tasks));
    }
    
    // Update existing task
    function updateTask(updatedTask) {
        let tasks = getTasks();
        tasks = tasks.map(task => {
            if (task.id === updatedTask.id) {
                return {...task, ...updatedTask};
            }
            return task;
        });
        localStorage.setItem('todo_tasks', JSON.stringify(tasks));
    }
    
    // Get all tasks from localStorage
    function getTasks() {
        return JSON.parse(localStorage.getItem('todo_tasks') || '[]');
    }
    
    // Load tasks into the UI
    function loadTasks() {
        const tasks = getTasks();
        const filter = $('.filter-btn.active').data('filter');
        const category = $('.category-btn.active').data('category');
        
        $('.todo-list').empty();
        
        if (tasks.length === 0) {
            $('.todo-empty').show();
            updateTaskCount();
            updateProgressBar();
            return;
        }
        
        $('.todo-empty').hide();
        
        // Sort tasks: incomplete first, then by priority, then by timestamp
        tasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        let hasVisibleTasks = false;
        
        tasks.forEach(task => {
            let showTask = true;
            
            // Apply filters
            if (filter === 'active' && task.completed) showTask = false;
            if (filter === 'completed' && !task.completed) showTask = false;
            if (filter === 'today') {
                const today = new Date().toDateString();
                const taskDate = new Date(task.timestamp).toDateString();
                if (today !== taskDate) showTask = false;
            }
            
            // Apply category filter
            if (category !== 'all' && task.category !== category) showTask = false;
            
            if (showTask) {
                renderTask(task);
                hasVisibleTasks = true;
            }
        });
        
        if (!hasVisibleTasks) {
            $('.todo-empty').show();
        }
        
        // Update task count and progress
        updateTaskCount();
        updateProgressBar();
    }
    
    // Render a task in the UI
    function renderTask(task) {
        const priorityLabels = {
            high: 'High',
            medium: 'Medium',
            low: 'Low'
        };
        
        const priorityIcons = {
            high: 'fa-arrow-up',
            medium: 'fa-minus',
            low: 'fa-arrow-down'
        };
        
        const timeSpent = task.timeSpent ? formatTimeSpent(task.timeSpent) : '';
        
        const taskItem = $(
            `<li class="todo-item priority-${task.priority} ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="todo-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="todo-text">${task.text}</span>
                <div class="todo-meta">
                    <span class="todo-priority-badge">
                        <i class="fas ${priorityIcons[task.priority]}"></i> ${priorityLabels[task.priority]}
                    </span>
                    ${timeSpent ? `<span class="todo-time-spent">${timeSpent}</span>` : ''}
                    <span class="todo-date">${formatDate(task.timestamp)}</span>
                    <div class="todo-actions">
                        <button class="timer-start" title="Start Timer"><i class="fas fa-play"></i></button>
                        <button class="timer-stop" title="Stop Timer" style="display: none;"><i class="fas fa-stop"></i></button>
                        <span class="timer-display" style="display: none;">00:00:00</span>
                        <button class="todo-edit" title="Edit Task">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="todo-delete" title="Delete Task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </li>`
        );
        
        // Add due date warnings
        if (task.dueDate) {
            const taskDate = new Date(task.dueDate);
            const today = new Date();
            const diffTime = taskDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays < 0 && !task.completed) {
                taskItem.addClass('overdue');
            } else if (diffDays <= 1 && !task.completed) {
                taskItem.addClass('due-soon');
            }
        }
        
        $('.todo-list').append(taskItem);
    }
    
    // Format date for display
    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    // Toggle task completion status
    function toggleTask(id) {
        let tasks = getTasks();
        tasks = tasks.map(task => {
            if (task.id === id) {
                task.completed = !task.completed;
                task.timestamp = new Date().toISOString(); // Update timestamp
            }
            return task;
        });
        
        localStorage.setItem('todo_tasks', JSON.stringify(tasks));
        loadTasks();
        
        // Show notification
        const task = tasks.find(t => t.id === id);
        showNotification(`Task marked as ${task.completed ? 'completed' : 'active'}!`);
    }
    
    // Delete a task
    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            let tasks = getTasks();
            tasks = tasks.filter(task => task.id !== id);
            
            localStorage.setItem('todo_tasks', JSON.stringify(tasks));
            loadTasks();
            
            // Show notification
            showNotification('Task deleted successfully!');
        }
    }
    
    // Edit a task
    function editTask(id) {
        const tasks = getTasks();
        const task = tasks.find(t => t.id === id);
        
        if (task) {
            // Populate editor
            $('#task-title').val(task.text);
            $('#task-priority').val(task.priority);
            $('#task-description').val(task.description || '');
            $('#task-due-date').val(task.dueDate || '');
            $('#task-project').val(task.project || '');
            $('#task-assignee').val(task.assignee || '');
            
            // Show editor
            $('#task-editor').addClass('active').data('editing-id', id);
        }
    }
    
    // Save edited task
    function saveEditedTask() {
        const id = $('#task-editor').data('editing-id');
        const tasks = getTasks();
        
        const updatedTask = {
            text: $('#task-title').val(),
            priority: $('#task-priority').val(),
            description: $('#task-description').val(),
            dueDate: $('#task-due-date').val(),
            project: $('#task-project').val(),
            assignee: $('#task-assignee').val(),
            timestamp: new Date().toISOString()
        };
        
        const updatedTasks = tasks.map(task => {
            if (task.id === id) {
                return {...task, ...updatedTask};
            }
            return task;
        });
        
        localStorage.setItem('todo_tasks', JSON.stringify(updatedTasks));
        $('#task-editor').removeClass('active');
        loadTasks();
        
        // Show notification
        showNotification('Task updated successfully!');
    }
    
    // Clear completed tasks
    function clearCompletedTasks() {
        if (confirm('Are you sure you want to clear all completed tasks?')) {
            let tasks = getTasks();
            tasks = tasks.filter(task => !task.completed);
            
            localStorage.setItem('todo_tasks', JSON.stringify(tasks));
            loadTasks();
            
            // Show notification
            showNotification('Completed tasks cleared!');
        }
    }
    
    // Filter tasks by status
    function filterTasks(filter) {
        loadTasks();
    }
    
    // Filter tasks by category
    function filterByCategory(category) {
        loadTasks();
    }
    
    // Update task count display
    function updateTaskCount() {
        const tasks = getTasks();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const activeTasks = totalTasks - completedTasks;
        const overdueTasks = tasks.filter(task => {
            if (!task.dueDate || task.completed) return false;
            return new Date(task.dueDate) < new Date();
        }).length;
        
        // Update counters
        $('#total-tasks').text(totalTasks);
        $('#completed-tasks').text(completedTasks);
        $('#active-tasks').text(activeTasks);
        $('#overdue-tasks').text(overdueTasks);
    }
    
    // Update progress bar
    function updateProgressBar() {
        const tasks = getTasks();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        
        if (totalTasks > 0) {
            const progress = (completedTasks / totalTasks) * 100;
            $('.todo-progress-bar').css('width', progress + '%');
        } else {
            $('.todo-progress-bar').css('width', '0%');
        }
    }
    
    // Generate Calendar View
    function generateCalendar() {
        // This would generate a calendar view of tasks
        console.log('Calendar view would be generated here');
    }
    
    // Generate Reports View
    function generateReports() {
        // This would generate reports and charts
        console.log('Reports view would be generated here');
    }
    
    // Initialize with sample tasks if empty
    function initializeWithSampleTasks() {
        const tasks = getTasks();
        if (tasks.length === 0) {
            const sampleTasks = [
                {
                    id: Date.now() - 1000,
                    text: 'Welcome to your premium to-do list!',
                    completed: false,
                    priority: 'medium',
                    timestamp: new Date().toISOString(),
                    category: 'personal',
                    timeSpent: 0
                },
                {
                    id: Date.now() - 2000,
                    text: 'Click on the checkbox to mark a task as complete',
                    completed: false,
                    priority: 'low',
                    timestamp: new Date().toISOString(),
                    category: 'personal',
                    timeSpent: 0
                },
                {
                    id: Date.now() - 3000,
                    text: 'Try the Pomodoro timer for focused work sessions',
                    completed: false,
                    priority: 'high',
                    timestamp: new Date().toISOString(),
                    category: 'work',
                    timeSpent: 0
                }
            ];
            
            localStorage.setItem('todo_tasks', JSON.stringify(sampleTasks));
            loadTasks();
        }
    }
});