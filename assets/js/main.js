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
/*
	Collapsible page navigation (#header pages).

	#header is position: sticky, so anything in the strip underneath it gets no
	clicks - the click lands on the header. With seven nav items the header
	wrapped onto several rows on narrow desktops and grew to about half the
	viewport on a phone, so a wide band of the page was unclickable. It showed
	up after a Back navigation, because the browser restores the old scroll
	position and puts whatever you were working on back under the header.

	Below 1140px this collapses the nav behind a Menu button so the sticky
	header stays one row (see main.css for the matching styles and for the
	phone-width rule that stops it sticking at all). index.html uses #sidebar
	instead of #header, so this is a no-op there.
*/
(function () {

	document.addEventListener('DOMContentLoaded', function () {

		var header = document.getElementById('header');
		if (!header) return;

		var nav = header.querySelector('nav');
		var list = nav ? nav.querySelector('ul') : null;
		if (!nav || !list) return;

		var toggle = document.createElement('button');
		toggle.type = 'button';
		toggle.className = 'nav-toggle';
		toggle.textContent = 'Menu';
		toggle.setAttribute('aria-expanded', 'false');
		toggle.setAttribute('aria-label', 'Open navigation menu');
		header.insertBefore(toggle, nav);

		function close() {
			if (!list.classList.contains('is-open')) return;
			list.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
		}

		toggle.addEventListener('click', function (event) {
			event.stopPropagation();
			var open = list.classList.toggle('is-open');
			toggle.setAttribute('aria-expanded', String(open));
		});

		// Following a link, clicking off the menu or pressing Escape all put it
		// away again.
		list.addEventListener('click', function (event) {
			if (event.target && event.target.closest && event.target.closest('a')) close();
		});

		document.addEventListener('click', function (event) {
			if (!header.contains(event.target)) close();
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape' || event.key === 'Esc') close();
		});

		/* Whether the nav actually fits on one row is what decides whether it
		   collapses, rather than a pixel breakpoint that goes stale every time a
		   page is added to it. Measure with the collapsed state switched off,
		   then put it back if the row wrapped. */
		function fitsOnOneRow() {
			var rows = 0;
			var seen = {};
			Array.prototype.forEach.call(list.children, function (li) {
				var top = Math.round(li.getBoundingClientRect().top);
				if (!(top in seen)) { seen[top] = true; rows++; }
			});
			return rows <= 1 && header.scrollWidth <= header.clientWidth + 1;
		}

		function fit() {
			close();
			header.classList.remove('is-collapsed');
			/* Phones always get the collapsed panel, even when the row would fit:
			   the category dropdowns open on hover, which a touch screen has not,
			   and the panel lists their pages inline instead. */
			if (!fitsOnOneRow() || window.matchMedia('(max-width: 736px)').matches) header.classList.add('is-collapsed');
		}

		fit();
		// Web fonts can change the widths after first paint, so measure again.
		window.addEventListener('load', fit);

		var fitTimer = null;
		window.addEventListener('resize', function () {
			clearTimeout(fitTimer);
			fitTimer = setTimeout(fit, 120);
		});

	});

})();

/*
	Mobile navigation for the sidebar layout (the home page).

	main.css hides #sidebar outright below 737px, so on a phone the home page
	had no navigation at all: the Portfolio list, and every page it links to,
	were unreachable from a menu. This builds a compact bar with a Menu button
	out of the sidebar's own links, submenu included, and main.css shows it only
	at the widths where the sidebar itself is hidden.

	It reads the links before portfolio-menu.js moves the Portfolio submenu out
	to <body> - main.js is loaded first in the page, so its DOMContentLoaded
	listener runs first - and it does nothing on the pages that use #header,
	which have their own collapsible nav.
*/
(function () {

	document.addEventListener('DOMContentLoaded', function () {

		var sidebar = document.getElementById('sidebar');
		if (!sidebar || document.getElementById('header')) return;

		var nav = sidebar.querySelector('nav');
		var topList = nav ? nav.querySelector('ul') : null;
		if (!topList) return;

		// Flatten the sidebar's links, keeping submenu entries one level in.
		var entries = [];
		Array.prototype.forEach.call(topList.children, function (li) {
			if (li.tagName !== 'LI') return;
			var a = li.querySelector('a');
			if (a) entries.push({ href: a.getAttribute('href'), text: a.textContent.trim(), sub: false });
			li.querySelectorAll('.portfolio-submenu a').forEach(function (s) {
				entries.push({ href: s.getAttribute('href'), text: s.textContent.trim(), sub: true });
			});
		});
		if (!entries.length) return;

		var bar = document.createElement('div');
		bar.id = 'mobile-nav';

		var heading = document.querySelector('#intro h1');
		var title = document.createElement('a');
		title.className = 'mobile-nav-title';
		title.href = 'index.html';
		title.textContent = heading ? heading.textContent.trim() : 'Menu';
		bar.appendChild(title);

		var toggle = document.createElement('button');
		toggle.type = 'button';
		toggle.className = 'nav-toggle';
		toggle.textContent = 'Menu';
		toggle.setAttribute('aria-expanded', 'false');
		toggle.setAttribute('aria-label', 'Open navigation menu');
		bar.appendChild(toggle);

		var list = document.createElement('ul');
		list.className = 'mobile-nav-list';
		entries.forEach(function (e) {
			var li = document.createElement('li');
			if (e.sub) li.className = 'is-sub';
			var a = document.createElement('a');
			a.href = e.href;
			a.textContent = e.text;
			li.appendChild(a);
			list.appendChild(li);
		});
		bar.appendChild(list);

		document.body.insertBefore(bar, document.body.firstChild);

		function close() {
			if (!list.classList.contains('is-open')) return;
			list.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
		}

		toggle.addEventListener('click', function (event) {
			event.stopPropagation();
			var open = list.classList.toggle('is-open');
			toggle.setAttribute('aria-expanded', String(open));
		});

		list.addEventListener('click', function (event) {
			if (event.target && event.target.closest && event.target.closest('a')) close();
		});

		document.addEventListener('click', function (event) {
			if (!bar.contains(event.target)) close();
		});

		document.addEventListener('keydown', function (event) {
			if (event.key === 'Escape' || event.key === 'Esc') close();
		});

		window.addEventListener('resize', close);

	});

})();
