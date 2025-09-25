<<<<<<< HEAD
<?php
/**
 * The main template file
 *
 * @package Todo Theme
 */

get_header();
?>

<div id="container">
    <div id="todo-app">
        <h2>My To-Do List</h2>
        
        <form class="todo-form">
            <input type="text" class="todo-input" placeholder="Add a new task...">
            <button type="submit" class="todo-submit">Add Task</button>
        </form>
        
        <div class="todo-filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        </div>
        
        <ul class="todo-list">
            <!-- To-do items will be dynamically inserted here -->
        </ul>
    </div>
    
    <?php if (have_posts()) : ?>
        <div class="wordpress-content">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <header class="entry-header">
                        <h2 class="entry-title"><?php the_title(); ?></h2>
                    </header>
                    
                    <div class="entry-content">
                        <?php the_content(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>
    <?php endif; ?>
</div>

<?php
=======
<?php
/**
 * The main template file
 *
 * @package Todo Theme
 */

get_header();
?>

<div id="container">
    <div id="todo-app">
        <h2>My To-Do List</h2>
        
        <form class="todo-form">
            <input type="text" class="todo-input" placeholder="Add a new task...">
            <button type="submit" class="todo-submit">Add Task</button>
        </form>
        
        <div class="todo-filters">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="active">Active</button>
            <button class="filter-btn" data-filter="completed">Completed</button>
        </div>
        
        <ul class="todo-list">
            <!-- To-do items will be dynamically inserted here -->
        </ul>
    </div>
    
    <?php if (have_posts()) : ?>
        <div class="wordpress-content">
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <header class="entry-header">
                        <h2 class="entry-title"><?php the_title(); ?></h2>
                    </header>
                    
                    <div class="entry-content">
                        <?php the_content(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        </div>
    <?php endif; ?>
</div>

<?php
>>>>>>> c22d680df0c2ab1d1caacdb1329803a6adb0ff7c
get_footer();