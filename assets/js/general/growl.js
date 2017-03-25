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
		var $notice = $('.notice');

		$wpcontent.prepend('<div class="growl"></div>');
		var $growl = $('.growl');

		$notice.each(function ()
		{
			$(this).appendTo($growl);
		});

		$('.update-nag').appendTo($growl);
	});
})(jQuery);