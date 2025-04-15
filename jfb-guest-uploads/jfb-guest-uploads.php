<?php
/**
 * Plugin Name: JetFormBuilder Guest Uploads
 * Description: Enables guest uploads in Media fields using a checkbox in the block editor.
 * Version: 1.4
 * Author: Melodev
 */

if ( ! defined( 'ABSPATH' ) ) exit;

add_action( 'enqueue_block_assets', function () {
	if ( ! is_admin() ) return;

	$screen = get_current_screen();
	if ( empty( $screen ) || strpos( $screen->id, 'jet-form-builder' ) === false ) return;

	wp_enqueue_script(
		'jfb-guest-uploads-editor',
		plugin_dir_url( __FILE__ ) . 'admin/jfb-guest-editor.js',
		array( 'wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-compose', 'wp-data' ),
		'1.0.0',
		true
	);
} );

add_action(
	'jet-form-builder/media-field/before-upload',
	function ( $parser ) {
		$context  = $parser->get_context();
		$settings = $context->get_settings();

		if ( empty( $settings['allow_guest_upload'] ) ) {
			return;
		}

		$context->allow_for_guest();
		$context->update_setting( 'insert_attachment', true );
		$context->update_setting( 'value_format', 'id' ); // Change to 'url' or 'both' if needed
	}
);
