/*
	Portfolio flyout submenu (sidebar nav)

	The sidebar is a fixed, vertically-scrollable column (#sidebar has
	overflow-y:auto). Per the CSS spec, when overflow-y is anything other
	than visible, overflow-x:visible is instead computed as auto - so the
	submenu was always clipped at the sidebar's edge no matter what
	overflow-x was set to. There's no way to make it truly escape while it
	stays a DOM descendant of #sidebar.

	The fix: move the submenu out to <body> and float it with
	position:fixed, using coordinates computed from the sidebar/trigger's
	own bounding boxes. This runs in two layouts:

	  - Wide desktop (>=1281px): #sidebar is the fixed left column. The
	    menu floats to the right of the sidebar, aligned with the
	    Portfolio row.
	  - Medium / tablet (737px-1280px): #sidebar collapses into a
	    horizontal top bar. The menu instead drops down below the
	    Portfolio item, like an ordinary nav dropdown.

	Below 737px the sidebar is hidden entirely (see main.css) in favor of
	whatever mobile nav the theme falls back to, so the flyout stays off
	there too - untouched, per the existing responsive behavior.
*/
(function () {

	document.addEventListener('DOMContentLoaded', function () {

		var sidebar = document.getElementById('sidebar');
		var menuItem = sidebar ? sidebar.querySelector('.portfolio-menu') : null;
		var submenu = menuItem ? menuItem.querySelector('.portfolio-submenu') : null;

		if (!sidebar || !menuItem || !submenu) return;

		var trigger = menuItem.querySelector('a');
		var wideMql = window.matchMedia('(min-width: 1281px)');
		var mediumMql = window.matchMedia('(min-width: 737px) and (max-width: 1280px)');
		var hideTimer = null;

		// Detach so the sidebar's own overflow box can no longer clip it.
		document.body.appendChild(submenu);

		function activeMode() {
			if (wideMql.matches) return 'wide';
			if (mediumMql.matches) return 'medium';
			return null;
		}

		function positionSubmenu(mode) {
			var menuRect = menuItem.getBoundingClientRect();

			if (mode === 'medium') {
				// Drop down below the trigger, like a standard nav dropdown.
				var left = Math.round(menuRect.left);
				var maxLeft = window.innerWidth - submenu.offsetWidth - 16;
				if (left > maxLeft) left = Math.max(16, maxLeft);
				submenu.style.left = left + 'px';
				submenu.style.top = Math.round(menuRect.bottom) + 'px';
				return;
			}

			// Wide desktop: float to the right of the sidebar, level with
			// the trigger row (clamped so it never runs off the bottom).
			var sidebarRect = sidebar.getBoundingClientRect();
			submenu.style.left = Math.round(sidebarRect.right) + 'px';

			var top = Math.round(menuRect.top);
			var maxTop = window.innerHeight - submenu.offsetHeight - 16;
			if (top > maxTop) top = Math.max(16, maxTop);
			submenu.style.top = top + 'px';
		}

		function show() {
			var mode = activeMode();
			if (!mode) return;
			clearTimeout(hideTimer);
			submenu.classList.add('is-active');
			positionSubmenu(mode);
		}

		function scheduleHide() {
			clearTimeout(hideTimer);
			hideTimer = setTimeout(function () {
				submenu.classList.remove('is-active');
			}, 200);
		}

		function hideIfFocusLeft() {
			// Runs after the browser has moved focus, so document.activeElement
			// reflects where focus actually landed.
			setTimeout(function () {
				var active = document.activeElement;
				if (!menuItem.contains(active) && !submenu.contains(active)) {
					submenu.classList.remove('is-active');
				}
			}, 0);
		}

		menuItem.addEventListener('mouseenter', show);
		menuItem.addEventListener('mouseleave', scheduleHide);
		submenu.addEventListener('mouseenter', show);
		submenu.addEventListener('mouseleave', scheduleHide);

		if (trigger) trigger.addEventListener('focus', show);
		menuItem.addEventListener('focusout', hideIfFocusLeft);
		submenu.addEventListener('focusout', hideIfFocusLeft);

		window.addEventListener('resize', function () {
			var mode = activeMode();
			if (!mode) {
				submenu.classList.remove('is-active');
			} else if (submenu.classList.contains('is-active')) {
				positionSubmenu(mode);
			}
		});

	});

})();
