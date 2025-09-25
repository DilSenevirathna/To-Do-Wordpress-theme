<?php
/**
 * Todo Pro Theme functions and definitions
 *
 * @package Todo Pro Theme
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

// Set up theme defaults
if (!function_exists('todo_theme_setup')) {
    function todo_theme_setup() {
        // Make theme available for translation
        load_theme_textdomain('todo-pro-theme', get_template_directory() . '/languages');
        
        // Add default posts and comments RSS feed links to head
        add_theme_support('automatic-feed-links');
        
        // Let WordPress manage the document title
        add_theme_support('title-tag');
        
        // Enable support for Post Thumbnails
        add_theme_support('post-thumbnails');
        
        // Register navigation menus
        register_nav_menus(array(
            'primary' => __('Primary Menu', 'todo-pro-theme'),
        ));
        
        // Switch default core markup to output valid HTML5
        add_theme_support('html5', array(
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
        ));
        
        // Add support for custom logo
        add_theme_support('custom-logo', array(
            'height' => 100,
            'width' => 400,
            'flex-height' => true,
            'flex-width' => true,
        ));
        
        // Add support for editor styles
        add_theme_support('editor-styles');
        add_editor_style('editor-style.css');
    }
}
add_action('after_setup_theme', 'todo_theme_setup');

// Enqueue scripts and styles
function todo_theme_scripts() {
    // Theme stylesheet
    wp_enqueue_style('todo-pro-theme-style', get_stylesheet_uri());
    
    // Google Fonts
    wp_enqueue_style('todo-pro-google-fonts', 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    // Font Awesome
    wp_enqueue_style('todo-pro-font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    
    // Chart.js for reporting
    wp_enqueue_script('todo-pro-chart-js', 'https://cdn.jsdelivr.net/npm/chart.js', array(), '3.9.1', true);
    
    // Custom JavaScript
    wp_enqueue_script('todo-pro-theme-script', get_template_directory_uri() . '/js/custom.js', array('jquery', 'todo-pro-chart-js'), '2.0', true);
    
    // Localize script for AJAX
    wp_localize_script('todo-pro-theme-script', 'todo_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('todo_nonce'),
        'user_id' => get_current_user_id(),
        'user_name' => wp_get_current_user()->display_name,
        'is_premium' => true
    ));
}
add_action('wp_enqueue_scripts', 'todo_theme_scripts');

// Add theme customization
function todo_theme_customize_register($wp_customize) {
    // Add section for theme options
    $wp_customize->add_section('todo_theme_options', array(
        'title' => __('Todo Theme Options', 'todo-pro-theme'),
        'priority' => 30,
    ));
    
    // Add setting for default priority
    $wp_customize->add_setting('todo_default_priority', array(
        'default' => 'medium',
        'transport' => 'refresh',
    ));
    
    // Add control for default priority
    $wp_customize->add_control('todo_default_priority', array(
        'label' => __('Default Task Priority', 'todo-pro-theme'),
        'section' => 'todo_theme_options',
        'type' => 'select',
        'choices' => array(
            'low' => __('Low', 'todo-pro-theme'),
            'medium' => __('Medium', 'todo-pro-theme'),
            'high' => __('High', 'todo-pro-theme'),
        ),
    ));
    
    // Add setting for due date reminder
    $wp_customize->add_setting('todo_due_date_reminder', array(
        'default' => true,
        'transport' => 'refresh',
    ));
    
    // Add control for due date reminder
    $wp_customize->add_control('todo_due_date_reminder', array(
        'label' => __('Enable Due Date Reminder', 'todo-pro-theme'),
        'section' => 'todo_theme_options',
        'type' => 'checkbox',
    ));
    
    // Add setting for AI suggestions
    $wp_customize->add_setting('todo_ai_suggestions', array(
        'default' => true,
        'transport' => 'refresh',
    ));
    
    // Add control for AI suggestions
    $wp_customize->add_control('todo_ai_suggestions', array(
        'label' => __('Enable AI Task Suggestions', 'todo-pro-theme'),
        'section' => 'todo_theme_options',
        'type' => 'checkbox',
    ));
    
    // Add setting for Pomodoro timer
    $wp_customize->add_setting('todo_pomodoro_timer', array(
        'default' => true,
        'transport' => 'refresh',
    ));


    
    // Add control for Pomodoro timer
    $wp_customize->add_control('todo_pomodoro_timer', array(
        'label' => __('Enable Pomodoro Timer', 'todo-pro-theme'),
        'section' => 'todo_theme_options',
        'type' => 'checkbox',
    ));
}
add_action('customize_register', 'todo_theme_customize_register');

// Create a shortcode for the to-do app
function todo_app_shortcode($atts) {
    // Extract shortcode attributes
    $atts = shortcode_atts(array(
        'title' => 'My To-Do List',
        'show_stats' => 'true',
        'show_progress' => 'true',
        'categories' => 'all',
        'collaboration' => 'false',
        'projects' => 'false',
        'calendar' => 'false',
        'reports' => 'false'
    ), $atts, 'todo_app');
    
    ob_start();
    ?>
    <div id="todo-app">
        <div class="premium-badge">PRO</div>
        
        <div class="todo-header">
            <h2 class="todo-title"><?php echo esc_html($atts['title']); ?></h2>
            <button class="theme-toggle" aria-label="Toggle dark mode">
                <i class="fas fa-moon"></i>
            </button>
        </div>
        
        <?php if ($atts['collaboration'] === 'true') : ?>
        <div class="todo-collaboration">
            <div class="collaboration-header">
                <h3>Team Collaboration</h3>
                <button class="add-user-btn">
                    <i class="fas fa-user-plus"></i> Add Member
                </button>
            </div>
            <div class="collaboration-users">
                <div class="user-avatar">JD</div>
                <div class="user-avatar">MJ</div>
                <div class="user-avatar">AK</div>
                <div class="user-avatar more">+3</div>
            </div>
        </div>
        <?php endif; ?>
        
        <?php if ($atts['projects'] === 'true') : ?>
        <div class="todo-projects">
            <div class="project-pill active" data-project="all">
                <span>All Projects</span>
                <span class="count">12</span>
            </div>
            <div class="project-pill" data-project="website">
                <i class="fas fa-globe"></i>
                <span>Website Redesign</span>
                <span class="count">5</span>
            </div>
            <div class="project-pill" data-project="marketing">
                <i class="fas fa-bullhorn"></i>
                <span>Marketing Campaign</span>
                <span class="count">3</span>
            </div>
            <div class="project-pill" data-project="product">
                <i class="fas fa-box"></i>
                <span>Product Launch</span>
                <span class="count">4</span>
            </div>
            <button class="project-pill" id="add-project-btn">
                <i class="fas fa-plus"></i> New Project
            </button>
        </div>
        <?php endif; ?>
        
        <div class="view-switcher">
            <button class="view-btn active" data-view="list">
                <i class="fas fa-list"></i> List View
            </button>
            <?php if ($atts['calendar'] === 'true') : ?>
            <button class="view-btn" data-view="calendar">
                <i class="fas fa-calendar"></i> Calendar
            </button>
            <?php endif; ?>
            <?php if ($atts['reports'] === 'true') : ?>
            <button class="view-btn" data-view="reports">
                <i class="fas fa-chart-bar"></i> Reports
            </button>
            <?php endif; ?>
        </div>
        
        <?php if ($atts['show_progress'] === 'true') : ?>
        <div class="todo-progress">
            <div class="todo-progress-bar" style="width: 0%"></div>
        </div>
        <?php endif; ?>
        
        <div class="task-editor" id="task-editor">
            <div class="editor-header">
                <h3>Edit Task</h3>
                <button class="editor-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="editor-body">
                <div class="editor-field">
                    <label for="task-title">Task Title</label>
                    <input type="text" id="task-title" required>
                </div>
                <div class="editor-field">
                    <label for="task-priority">Priority</label>
                    <select id="task-priority">
                        <option value="low">Low Priority</option>
                        <option value="medium" selected>Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                </div>
                <div class="editor-field">
                    <label for="task-description">Description</label>
                    <textarea id="task-description"></textarea>
                </div>
                <div class="editor-field">
                    <label for="task-due-date">Due Date</label>
                    <input type="date" id="task-due-date">
                </div>
                <div class="editor-field">
                    <label for="task-project">Project</label>
                    <select id="task-project">
                        <option value="">No Project</option>
                        <option value="website">Website Redesign</option>
                        <option value="marketing">Marketing Campaign</option>
                        <option value="product">Product Launch</option>
                    </select>
                </div>
                <div class="editor-field">
                    <label for="task-assignee">Assign To</label>
                    <select id="task-assignee">
                        <option value="">Unassigned</option>
                        <option value="user1">John Doe</option>
                        <option value="user2">Mary Johnson</option>
                        <option value="user3">Alex Kim</option>
                    </select>
                </div>
            </div>
            <div class="editor-actions">
                <button class="editor-cancel">Cancel</button>
                <button class="editor-save">Save Task</button>
            </div>
        </div>
        
        <?php if (get_theme_mod('todo_ai_suggestions', true)) : ?>
        <div class="ai-suggestions">
            <div class="ai-header">
                <h3><i class="fas fa-robot"></i> AI Suggestions</h3>
                <button class="ai-refresh">
                    <i class="fas fa-sync"></i>
                </button>
            </div>
            <div class="ai-suggestion">Schedule a team meeting for project review</div>
            <div class="ai-suggestion">Prepare quarterly performance report</div>
            <div class="ai-suggestion">Follow up with clients from last week's meeting</div>
        </div>
        <?php endif; ?>
        
        <form class="todo-form">
            <input type="text" class="todo-input" placeholder="Add a new task...">
            <select class="todo-priority">
                <option value="low">Low Priority</option>
                <option value="medium" selected>Medium Priority</option>
                <option value="high">High Priority</option>
            </select>
            <button type="submit" class="todo-submit">
                <i class="fas fa-plus"></i> Add Task
            </button>
        </form>
                    <br></br>

        
        <?php if (get_theme_mod('todo_pomodoro_timer', true)) : ?>
        <div class="pomodoro-timer">
            <h3>Pomodoro Timer</h3>
            <div class="pomodoro-display">25:00</div>

            <br></br>

            <div class="pomodoro-controls">
                <button class="pomodoro-btn pomodoro-start">Start</button>
                <button class="pomodoro-btn pomodoro-pause">Pause</button>
                <button class="pomodoro-btn pomodoro-reset">Reset</button>
            </div>
        </div>
        <?php endif; ?>
        
        <div class="todo-categories">
            <button class="category-btn active" data-category="all">All Tasks</button>
            <button class="category-btn" data-category="work">Work</button>
            <button class="category-btn" data-category="personal">Personal</button>
            <button class="category-btn" data-category="shopping">Shopping</button>
            <button class="category-btn" data-category="health">Health</button>
        </div>
        
        <div class="todo-filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
            <button class="filter-btn" data-filter="today">Due Today</button>
        </div>
        
        <ul class="todo-list">
            <!-- To-do items will be dynamically inserted here -->
        </ul>
        
        <div class="todo-empty">
            <div class="todo-empty-icon">
                <i class="fas fa-clipboard-list"></i>
            </div>
            <h3>No tasks yet</h3>
            <p>Add a task to get started!</p>
        </div>
        
        <?php if ($atts['calendar'] === 'true') : ?>
        <div class="calendar-view">
            <div class="calendar-header">
                <h3>June 2023</h3>
                <div class="calendar-nav">
                    <button class="calendar-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="calendar-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
            <div class="calendar-grid">
                <!-- Calendar days will be populated by JavaScript -->
            </div>
        </div>
        <?php endif; ?>
        
        <?php if ($atts['reports'] === 'true') : ?>
        <div class="reports-view">
            <div class="report-charts">
                <div class="chart-container">
                    <h4 class="chart-title">Tasks by Priority</h4>
                    <canvas id="priority-chart"></canvas>
                </div>
                <div class="chart-container">
                    <h4 class="chart-title">Completion Rate</h4>
                    <canvas id="completion-chart"></canvas>
                </div>
                <div class="chart-container">
                    <h4 class="chart-title">Weekly Productivity</h4>
                    <canvas id="productivity-chart"></canvas>
                </div>
            </div>
            
            <div class="export-options">
                <button class="export-btn" data-format="pdf">
                    <i class="fas fa-file-pdf"></i> Export PDF
                </button>
                <button class="export-btn" data-format="csv">
                    <i class="fas fa-file-csv"></i> Export CSV
                </button>
                <button class="export-btn" data-format="print">
                    <i class="fas fa-print"></i> Print Report
                </button>
            </div>
        </div>
        <?php endif; ?>
        
        <?php if ($atts['show_stats'] === 'true') : ?>
        <div class="todo-counter">
            <div class="todo-stats">
                <div class="todo-stat">
                    <span class="stat-value" id="total-tasks">0</span>
                    <span class="stat-label">Total</span>
                </div>
                <div class="todo-stat">
                    <span class="stat-value" id="completed-tasks">0</span>
                    <span class="stat-label">Completed</span>
                </div>
                <div class="todo-stat">
                    <span class="stat-value" id="active-tasks">0</span>
                    <span class="stat-label">Active</span>
                </div>
                <div class="todo-stat">
                    <span class="stat-value" id="overdue-tasks">0</span>
                    <span class="stat-label">Overdue</span>
                </div>
            </div>
            <button class="clear-completed">
                <i class="fas fa-trash"></i> Clear Completed
            </button>
        </div>
        <?php endif; ?>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('todo_app', 'todo_app_shortcode');

// Add admin notice about the shortcode
function todo_app_admin_notice() {
    $screen = get_current_screen();
    if ($screen->base == 'post') {
        echo '<div class="notice notice-info is-dismissible">
            <p><strong>To-Do Pro Theme:</strong> Use the <code>[todo_app]</code> shortcode to add your to-do list to any page or post. Available attributes: <code>title</code>, <code>show_stats</code>, <code>show_progress</code>, <code>categories</code>, <code>collaboration</code>, <code>projects</code>, <code>calendar</code>, <code>reports</code>.</p>
        </div>';
    }
}
add_action('admin_notices', 'todo_app_admin_notice');

// Add dashboard widget
function todo_app_dashboard_widget() {
    wp_add_dashboard_widget(
        'todo_dashboard_widget',
        'Todo Pro - Task Overview',
        'todo_dashboard_widget_content'
    );
}
add_action('wp_dashboard_setup', 'todo_app_dashboard_widget');

function todo_dashboard_widget_content() {
    echo '<div class="todo-dashboard-widget">';
    echo '<p>Your premium to-do list is managed on your website frontend. Add the <code>[todo_app]</code> shortcode to any page to manage your tasks.</p>';
    echo '<div class="todo-dashboard-stats">';
    echo '<div class="stat"><span class="value">12</span><span class="label">Total Tasks</span></div>';
    echo '<div class="stat"><span class="value">8</span><span class="label">Completed</span></div>';
    echo '<div class="stat"><span class="value">4</span><span class="label">Pending</span></div>';
    echo '</div>';
    echo '<p><a href="' . admin_url('post-new.php') . '" class="button button-primary">Create New Page with To-Do List</a></p>';
    echo '</div>';
}

// Add custom admin menu
function todo_pro_admin_menu() {
    add_menu_page(
        'Todo Pro Settings',
        'Todo Pro',
        'manage_options',
        'todo-pro-settings',
        'todo_pro_settings_page',
        'dashicons-editor-ul',
        30
    );
}
add_action('admin_menu', 'todo_pro_admin_menu');

function todo_pro_settings_page() {
    ?>
    <div class="wrap">
        <h1>Todo Pro Settings</h1>
        <p>Configure your premium to-do list settings.</p>
        
        <form method="post" action="options.php">
            <?php
            settings_fields('todo_pro_settings');
            do_settings_sections('todo_pro_settings');
            submit_button();
            ?>
        </form>
        
        <div class="todo-pro-features">
            <h2>Premium Features</h2>
            <div class="feature-grid">
                <div class="feature">
                    <h3><i class="dashicons dashicons-groups"></i> Team Collaboration</h3>
                    <p>Invite team members, assign tasks, and track progress together.</p>
                </div>
                <div class="feature">
                    <h3><i class="dashicons dashicons-chart-line"></i> Advanced Reporting</h3>
                    <p>Visualize your productivity with detailed charts and analytics.</p>
                </div>
                <div class="feature">
                    <h3><i class="dashicons dashicons-calendar"></i> Calendar Integration</h3>
                    <p>View your tasks in a calendar format and plan your schedule.</p>
                </div>
                <div class="feature">
                    <h3><i class="dashicons dashicons-clock"></i> Time Tracking</h3>
                    <p>Track time spent on tasks and improve your productivity.</p>
                </div>
            </div>
        </div>
    </div>
    <?php
}

// Add settings fields
function todo_pro_settings_init() {
    register_setting('todo_pro_settings', 'todo_pro_options');
    
    add_settings_section(
        'todo_pro_general_section',
        'General Settings',
        'todo_pro_general_section_callback',
        'todo_pro_settings'
    );
    
    add_settings_field(
        'todo_pro_default_view',
        'Default View',
        'todo_pro_default_view_callback',
        'todo_pro_settings',
        'todo_pro_general_section'
    );
    
    add_settings_field(
        'todo_pro_auto_backup',
        'Auto Backup',
        'todo_pro_auto_backup_callback',
        'todo_pro_settings',
        'todo_pro_general_section'
    );
}
add_action('admin_init', 'todo_pro_settings_init');

function todo_pro_general_section_callback() {
    echo '<p>Configure general settings for your Todo Pro application.</p>';
}

function todo_pro_default_view_callback() {
    $options = get_option('todo_pro_options');
    ?>
    <select name="todo_pro_options[default_view]">
        <option value="list" <?php selected($options['default_view'], 'list'); ?>>List View</option>
        <option value="calendar" <?php selected($options['default_view'], 'calendar'); ?>>Calendar View</option>
        <option value="kanban" <?php selected($options['default_view'], 'kanban'); ?>>Kanban Board</option>
    </select>
    <?php
}

function todo_pro_auto_backup_callback() {
    $options = get_option('todo_pro_options');
    ?>
    <label>
        <input type="checkbox" name="todo_pro_options[auto_backup]" value="1" <?php checked(1, $options['auto_backup']); ?> />
        Enable automatic daily backups
    </label>
    <?php
}

// Add export functionality
function todo_export_tasks() {
    // This would be hooked to an AJAX request in a real implementation
}

// Add REST API endpoints for premium features
function todo_pro_rest_api_init() {
    register_rest_route('todo-pro/v1', '/tasks', array(
        'methods' => 'GET',
        'callback' => 'todo_pro_get_tasks',
        'permission_callback' => function() {
            return current_user_can('read');
        }
    ));
    
    register_rest_route('todo-pro/v1', '/tasks', array(
        'methods' => 'POST',
        'callback' => 'todo_pro_create_task',
        'permission_callback' => function() {
            return current_user_can('edit_posts');
        }
    ));
}
add_action('rest_api_init', 'todo_pro_rest_api_init');

function todo_pro_get_tasks($request) {
    // In a real implementation, this would fetch tasks from database
    return rest_ensure_response(array(
        'tasks' => array(),
        'total' => 0
    ));
}

function todo_pro_create_task($request) {
    // In a real implementation, this would create a new task
    return rest_ensure_response(array(
        'success' => true,
        'task' => array()
    ));
}