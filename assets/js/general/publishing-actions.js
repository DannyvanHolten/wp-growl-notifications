/*
 * Boilerplate from: https://github.com/jquery-boilerplate/jquery-patterns/blob/master/patterns/jquery.basic.plugin-boilerplate.js
 */

;(function ($)
{
	"use strict";

	function fixPublishingAction()
	{
		var $publishingContainer = $('#major-publishing-actions');
		var $publishingAction = $('#publishing-action');
		var $deleteAction = $('#delete-action');

		if ($publishingAction.length) {
			if ($('body').hasClass('post-new-php') || !$deleteAction.length) {
				$publishingContainer.addClass('major-publishing-actions--new');
			}

			$publishingAction.outerWidth($publishingContainer.outerWidth());

			if ($(window).scrollTop() > ($publishingContainer.offset().top +
				$deleteAction.height() - $('#wpadminbar').height())) {
				$publishingAction.addClass('publishing-action--fixed');
			} else {
				$publishingAction.removeClass('publishing-action--fixed');
			}
		}
	}

	$(document).on('ready', function ()
	{
		fixPublishingAction();

		$(window).resize(function ()
		{
			fixPublishingAction();
		});

		$(window).on('scroll', function ()
		{
			fixPublishingAction();
		});
	});
})(jQuery);