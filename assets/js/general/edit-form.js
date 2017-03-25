/*
 * Boilerplate from: https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js
 */

;(function ($)
{
	"use strict";

	/**
	 * Calculate the height of the container and determine the position for sticky
	 */
	function calculateHeight()
	{
		var $stickyContainer = $('.sticky-container');

		$stickyContainer.each(function ()
		{
			var $this = $(this);
			if ($this.height() > $(window).height()) {
				$this.css({
					top: 'calc(100vh - ' + ( $(this).outerHeight() + 20) + 'px)'
				});
			} else {
				$this.removeAttr('style');
			}
		});
	}

	/**
	 * Edit the entire WordPress form html on post or post-new.
	 * Because we want to use flexbox and position sticky to make some nice effects
	 */
	$(document).on('ready', function ()
	{
		var $body = $('body');
		var $highContent = $('#post-body-content');
		var $lowContent = $('#postbox-container-2');
		var $sideContent = $('#postbox-container-1');

		// Check if we are on the right page
		if (($body.hasClass('post-php') || $body.hasClass('post-new-php')) &&
			$highContent.length && $lowContent.length && $sideContent.length) {

			$body.addClass('flex').addClass('sticky');

			$highContent.wrap('<div class="column left"><div class="sticky-container left"></div></div>');
			$lowContent.insertAfter($highContent);

			$sideContent.wrap('<div class="column right"><div class="sticky-container right"></div></div>');

			$(window).on('load', function ()
			{
				calculateHeight();
			});

			$(window).on('scroll', function ()
			{
				calculateHeight();
			});
		}
	});
})(jQuery);