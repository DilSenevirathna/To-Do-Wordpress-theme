<<<<<<< HEAD
<?php
/**
 * The template for displaying archive pages
 *
 * @package Todo Theme
 */

get_header();
?>

<div id="container">
    <header class="page-header">
        <?php
        the_archive_title('<h1 class="page-title">', '</h1>');
        the_archive_description('<div class="archive-description">', '</div>');
        ?>
    </header>
    
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header">
                    <h2 class="entry-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h2>
                    <div class="entry-meta">
                        <?php todo_theme_posted_on(); ?>
                    </div>
                </header>
                
                <div class="entry-content">
                    <?php the_excerpt(); ?>
                </div>
            </article>
        <?php endwhile; ?>
        
        <?php the_posts_navigation(); ?>
    <?php else : ?>
        <p><?php esc_html_e('No posts found.', 'todo-theme'); ?></p>
    <?php endif; ?>
</div>

<?php
=======
<?php
/**
 * The template for displaying archive pages
 *
 * @package Todo Theme
 */

get_header();
?>

<div id="container">
    <header class="page-header">
        <?php
        the_archive_title('<h1 class="page-title">', '</h1>');
        the_archive_description('<div class="archive-description">', '</div>');
        ?>
    </header>
    
    <?php if (have_posts()) : ?>
        <?php while (have_posts()) : the_post(); ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header">
                    <h2 class="entry-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h2>
                    <div class="entry-meta">
                        <?php todo_theme_posted_on(); ?>
                    </div>
                </header>
                
                <div class="entry-content">
                    <?php the_excerpt(); ?>
                </div>
            </article>
        <?php endwhile; ?>
        
        <?php the_posts_navigation(); ?>
    <?php else : ?>
        <p><?php esc_html_e('No posts found.', 'todo-theme'); ?></p>
    <?php endif; ?>
</div>

<?php
>>>>>>> c22d680df0c2ab1d1caacdb1329803a6adb0ff7c
get_footer();