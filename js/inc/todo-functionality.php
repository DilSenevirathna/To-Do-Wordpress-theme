<?php
/**
 * Additional to-do functionality
 *
 * @package Todo Theme
 */

// Add meta tags
function todo_theme_posted_on() {
    $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
    
    $time_string = sprintf(
        $time_string,
        esc_attr(get_the_date('c')),
        esc_html(get_the_date()),
        esc_attr(get_the_modified_date('c')),
        esc_html(get_the_modified_date())
    );
    
    $posted_on = sprintf(
        esc_html_x('Posted on %s', 'post date', 'todo-theme'),
        '<a href="' . esc_url(get_permalink()) . '" rel="bookmark">' . $time_string . '</a>'
    );
    
    $byline = sprintf(
        esc_html_x('by %s', 'post author', 'todo-theme'),
        '<span class="author vcard"><a class="url fn n" href="' . esc_url(get_author_posts_url(get_the_author_meta('ID'))) . '">' . esc_html(get_the_author()) . '</a></span>'
    );
    
    echo '<span class="posted-on">' . $posted_on . '</span><span class="byline"> ' . $byline . '</span>';
}

function todo_theme_entry_footer() {
    // Hide category and tag text for pages
    if ('post' === get_post_type()) {
        /* translators: used between list items, there is a space after the comma */
        $categories_list = get_the_category_list(esc_html__(', ', 'todo-theme'));
        if ($categories_list && todo_theme_categorized_blog()) {
            printf('<span class="cat-links">' . esc_html__('Posted in %1$s', 'todo-theme') . '</span>', $categories_list);
        }
        
        /* translators: used between list items, there is a space after the comma */
        $tags_list = get_the_tag_list('', esc_html__(', ', 'todo-theme'));
        if ($tags_list) {
            printf('<span class="tags-links">' . esc_html__('Tagged %1$s', 'todo-theme') . '</span>', $tags_list);
        }
    }
    
    if (!is_single() && !post_password_required() && (comments_open() || get_comments_number())) {
        echo '<span class="comments-link">';
        comments_popup_link(esc_html__('Leave a comment', 'todo-theme'), esc_html__('1 Comment', 'todo-theme'), esc_html__('% Comments', 'todo-theme'));
        echo '</span>';
    }
    
    edit_post_link(
        sprintf(
            esc_html__('Edit %s', 'todo-theme'),
            the_title('<span class="screen-reader-text">"', '"</span>', false)
        ),
        '<span class="edit-link">',
        '</span>'
    );
}

function todo_theme_categorized_blog() {
    if (false === ($all_the_cool_cats = get_transient('todo_theme_categories'))) {
        // Create an array of all the categories that are attached to posts
        $all_the_cool_cats = get_categories(array(
            'fields'     => 'ids',
            'hide_empty' => 1,
            'number'     => 2,
        ));
        
        // Count the number of categories that are attached to the posts
        $all_the_cool_cats = count($all_the_cool_cats);
        
        set_transient('todo_theme_categories', $all_the_cool_cats);
    }
    
    if ($all_the_cool_cats > 1) {
        return true;
    } else {
        return false;
    }
}

function todo_theme_category_transient_flusher() {
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    delete_transient('todo_theme_categories');
}
add_action('edit_category', 'todo_theme_category_transient_flusher');
add_action('save_post', 'todo_theme_category_transient_flusher');