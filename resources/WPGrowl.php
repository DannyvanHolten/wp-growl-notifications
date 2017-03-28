<?php

namespace WPGrowl;

/**
 * Class Styles
 *
 * To really improve the UI / UX, we do really need to teach WordPress some styling.
 */
class WPGrowl
{
	public function __construct()
	{
		$this->hooks();
	}

	/**
	 * Make sure all hooks are being executed.
	 */
	private function hooks()
	{
		add_action('admin_enqueue_scripts', [$this, 'loadScripts']);
		add_action('wp_ajax_wp-growl-snooze-notice', [$this, 'snoozeNotice']);
		add_action('admin_init', [$this, 'loadTextDomain']);
	}

	/**
	 * Shoot our translation strings into javascript
	 *
	 * @return array
	 */
	private function growlTranslations()
	{
		return [
			'hour' => __('Remind me in an hour', WP_GROWL_TEXTDOMAIN),
			'day'  => __('Remind me tomorrow', WP_GROWL_TEXTDOMAIN),
			'week' => __('Remind me next week', WP_GROWL_TEXTDOMAIN),
			'year' => __('Ignore this message', WP_GROWL_TEXTDOMAIN)
		];
	}

	/**
	 * Load all the scripts necessary for our plugin
	 */
	public function loadScripts()
	{
		wp_enqueue_script('jquery-initialize', WP_GROWL_ASSETS . 'js/jquery-initialize.min.js', ['jquery'],
			WP_GROWL_VERSION, true);

		wp_enqueue_style('growl-notifications-css', WP_GROWL_ASSETS . 'css/growl.min.css', false,
			WP_GROWL_VERSION);

		wp_register_script('growl-notifications-js', WP_GROWL_ASSETS . 'js/growl.min.js', ['jquery', 'jquery-initialize'],
			WP_GROWL_VERSION, true);

		wp_localize_script('wp-growl-notifications-js', 'growlL10n', $this->growlTranslations()); // Localize via our textdomain
		wp_localize_script('wp-growl-notifications-js', 'growl_snoozed_notices', $this->snoozedNotices()); // Get our snoozed notices
		wp_enqueue_script('wp-growl-notifications-js');
	}

	/**
	 * Load the gettext plugin textdomain located in our language directory.
	 */
	public function loadTextDomain()
	{
		load_plugin_textdomain(WP_GROWL_TEXTDOMAIN, false, WP_GROWL_LANGUAGES);
	}

	/**
	 * Get our snoozed notices from the database and send them to our javascript
	 *
	 * @return mixed
	 */
	private function snoozedNotices()
	{
		// Get our notices from the database
		$notices = get_user_meta(get_current_user_id(), 'wp-growl-snoozed-notices', true);
		$oldNotices = $notices;

		if (!empty($notices)) {
			foreach ($notices as $notice => $wakeup) {
				// Check if we still need to snooze them
				if ($wakeup < time()) {
					// Delete them if not
					unset($notices[$notice]);
				} else {
					// Strip slashed from them if so
					unset($notices[$notice]);
					$notices[stripslashes($notice)] = $wakeup;
				}
			}

			// Remove expired snoozes if they're not the same as before
			if ($oldNotices !== $notices) {
				update_user_meta(get_current_user_id(), 'wp-growl-snoozed-notices', $notices);
			}
		}

		return $notices;
	}

	/**
	 * The Ajax call to snooze our notices
	 */
	public function snoozeNotice()
	{
		// Check if we've got all the data
		if (empty($_POST['notice'] || empty($_POST['wakeup']))) {
			die(
			json_encode(
				[
					'success' => false,
					'message' => 'Missing required information.'
				]
			)
			);
		}

		// Add it to the list!
		$notices = get_user_meta(get_current_user_id(), 'wp-growl-snoozed-notices', true);
		$notices[$_POST['notice']] = $_POST['wakeup'];
		update_user_meta(get_current_user_id(), 'wp-growl-snoozed-notices', $notices);

		// Return succes
		die(
		json_encode(
			[
				'success' => true,
			]
		)
		);
	}
}