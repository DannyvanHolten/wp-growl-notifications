/*
 * Boilerplate from: https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js
 */

;(function ($)
{
	"use strict";

	/**
	 * Edit the entire WordPress form html on post or post-new.
	 * Because we want to use flexbox and position sticky to make some nice effects
	 */
	$(document).on('ready', function ()
	{
		var $body = $('body');
		var $wpcontent = $('#wpbody-content');

		$wpcontent.prepend('<div class="growl"></div>');
		var $growl = $('.growl');

		growl();

		$.initialize(".acf-error-message", function ()
		{
			growl();
		});
	});

	/**
	 * Find the admin notices and initialize the growl
	 */
	function growl()
	{
		var $growl = $('.growl');
		var $notice = $(
			'.notice:not(.hidden, .inline), #post > .acf-error-message, .update-nag, .message:not(.hidden, .inline), .updated:not(.hidden, .inline), .error:not(.hidden, .inline)');

		$notice.each(function ()
		{
			var $this = $(this);

			if ($this.text().trim() in growl_snoozed_notices) {
				$this.remove();
			} else {
				$this.appendTo($growl);

				dismiss($this);
				snooze($this);
			}
		});
	}

	/**
	 * Make sure our admin notices get dismissed automatically
	 *
	 * @param $this
	 */
	function dismiss($this)
	{
		if (($this.hasClass('is-dismissible') && $this.hasClass('updated') && $this.hasClass('notice')) ||
			$this.hasClass('acf-error-message')) {

			setTimeout(function ()
			{
				hideNotice($this);
			}, 6000);
		}
	}

	/**
	 * Make sure we can snooze admin notices
	 *
	 * @param $this
	 */
	function snooze($this)
	{
		if (!$this.hasClass('is-dismissible') && !$this.hasClass('acf-error-message') && !$this.hasClass(
				'otgs-is-dismissible')) {

			$this.append('<button class="notice-snooze notice-dismiss"></button>');
			$this.append('<ul class="notice-snooze-menu hidden">' +
				'<li data-hours="1">Remind me in 1 Hour</li>' +
				'<li data-hours="24">Remind me in 1 Day</li>' +
				'<li data-hours="168">Remind me in 1 Week</li>' +
				'<li data-hours="8760">Ignore this message</li>' +
				'</ul>');
		}

		$this.find('.notice-snooze').on('click', function ()
		{
			$this.find('.notice-snooze-menu').toggleClass('hidden');
		});

		$this.find('.notice-snooze-menu li').on('click', function ()
		{
			$.ajax({
				type: 'POST',
				url: ajaxurl,
				data: {
					action: 'wp-growl-snooze-notice',
					notice: $this.clone().find('.notice-snooze-menu').remove().end().text().trim(), // our notice (recognized in the most ugly way possible, because too often there's no ID)
					wakeup: Math.floor(Date.now() / 1000) + 60 * 60 * $(this).data('hours') // your new value variable
				},
				dataType: 'json'
			});

			hideNotice($this);
		});
	}

	/**
	 * Hide our notice. Nothing more then replicating how WordPress makes it notices dissapear
	 *
	 * @param $this
	 */
	function hideNotice($this)
	{
		$this.fadeTo(100, 0, function ()
		{
			$this.slideUp(100, function ()
			{
				$this.remove();
			});
		});
	}

})(jQuery);