<?php
/**
 * The template for displaying 404 pages.
 *
 * @package OceanWP WordPress theme
 */

// Get ID.
$get_id = get_theme_mod( 'ocean_error_page_template' );

// Check if page is Elementor page.
$elementor = get_post_meta( $get_id, '_elementor_edit_mode', true );

// Get content.
$get_content = oceanwp_error_page_template_content();

