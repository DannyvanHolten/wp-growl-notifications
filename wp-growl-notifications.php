<?php
/*
Plugin Name: WP Growl Notifications
Plugin URI: https://github.com/DannyvanHolten/wp-growl-notifications
Description: Show your WordPress admin notices in a growlike / better way, and snooze them whenever you see fit.
Version: 1.0
Author: Danny van Holten
Author URI: http://www.dannyvanholten.com/
Copyright: Danny van Holten
*/

if (!defined('ABSPATH')) {
	exit;
} // Exit if accessed directly

// Define multiple necessary constants
define('WP_GROWL_VERSION', 0.1);
define('WP_GROWL_ASSETS', plugin_dir_url(__FILE__) . 'dist/');
define('WP_GROWL_RESOURCES', __DIR__ . '/resources/');

// Use composer to autoload our classes
require_once __DIR__ . '/vendor/autoload.php';

new WPGrowl\WPGrowl();