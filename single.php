<?php
/**
 * The template for displaying single posts
 *
 * @package Todo Theme
 */

get_header();
?>

<div id="container">
    <?php while (have_posts()) : the_post(); ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
            <header class="entry-header">
                <h1 class="entry-title"><?php the_title(); ?></h1>
                <div class="entry-meta">
                    <?php todo_theme_posted_on(); ?>
                </div>
            </header>
            
            <div class="entry-content">
                <?php the_content(); ?>
            </div>
            
            <footer class="entry-footer">
                <?php todo_theme_entry_footer(); ?>
            </footer>
        </article>
        
        <?php
        // If comments are open or we have at least one comment, load up the comment template
        if (comments_open() || get_comments_number()) :
            comments_template();
        endif;
        ?>
    <?php endwhile; ?>
</div>

<?php
get_footer();