(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

	// // Add click event listener to the h3
	// // Toggle the visibility of the <ul> when the <h3> is clicked
	// $(document).ready(function () {
	// 	$("h3.toggle-list").on("click", function () {
	// 		// Find the next sibling <ul>, skipping the <h4>, and toggle its visibility
	// 		$(this).next("h3").next("h4").next("ul").toggleClass("hidden");
	// 	});
	// });	
	// $(document).ready(function () {
	// 	$("h3.toggle-list").on("click", function () {
	// 		// Get all sections inside the .features container
	// 		var allSections = $(".features section");
			
	// 		// Find the <ul> inside the clicked section
	// 		var ul = $(this).next("h3").next("h4").next("ul");
			
	// 		// Toggle visibility of the <ul>
	// 		ul.toggleClass("hidden");
	
	// 		// Check if at least one <ul> is visible
	// 		var anyVisible = $(".features section ul:not(.hidden)").length > 0;
			
	// 		// If any <ul> is visible, set all sections' width to 100%
	// 		if (anyVisible) {
	// 			allSections.css("width", "100%"); // Expand all sections to 100% width
	// 		} else {
	// 			allSections.css("width", "50%"); // Shrink all sections back to 50% width when all are hidden
	// 		}
	//         // Scroll to the section if it is being opened
	// 		if (!ul.hasClass("hidden")) {
	// 			$("html, body").animate({
	// 				scrollTop: $(this).offset().top - 12 // Adjust the offset for better alignment
	// 			}, 500); // Duration of the animation in milliseconds
	// 		}
	// 	});
	// });
	
	$(document).ready(function () {
		// Function to update the section width based on window size and visibility of <ul> elements
		function updateSectionWidth() {
			var allSections = $(".features section");
			var anyVisible = $(".features section ul:not(.hidden)").length > 0;
			
			// If any <ul> is visible, set all sections' width to 100%
			if (anyVisible) {
				allSections.css("width", "100%"); // Expand all sections to 100% width
			} else {
				// If no <ul> is visible, check window width
				if ($(window).width() <= 980) {
					allSections.css("width", "100%"); // Ensure sections are 100% width below 980px
				} else {
					allSections.css("width", "50%"); // Set sections back to 50% width above 980px
				}
			}
		}
	
		// Initial update on page load
		updateSectionWidth();
	
		// Event listener for resizing the window
		$(window).resize(function () {
			updateSectionWidth(); // Update section widths when window is resized
		});
	
		// Toggle visibility of <ul> when clicking on a section header
		$("h3.toggle-list").on("click", function () {
			var allSections = $(".features section");
			var ul = $(this).next("h3").next("h4").next("ul");
			
			// Toggle the 'hidden' class on the <ul>
			ul.toggleClass("hidden");
	
			// Update the section width based on the visibility of <ul>
			updateSectionWidth();
	
			// Scroll to the section if it is being opened
			if (!ul.hasClass("hidden")) {
				$("html, body").animate({
					scrollTop: $(this).offset().top - 12 // Adjust the offset for better alignment
				}, 500); // Duration of the animation in milliseconds
			}
		});
	});
})(jQuery);