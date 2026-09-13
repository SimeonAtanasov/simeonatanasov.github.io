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
	own bounding boxes. This only ever runs on wide desktop widths (the
	same >=1281px breakpoint the sidebar layout itself uses) - on tablet
	and mobile the existing responsive top nav is left completely alone.
*/
(function () {

	document.addEventListener('DOMContentLoaded', function () {

		var sidebar = document.getElementById('sidebar');
		var menuItem = sidebar ? sidebar.querySelector('.portfolio-menu') : null;
		var submenu = menuItem ? menuItem.querySelector('.portfolio-submenu') : null;

		if (!sidebar || !menuItem || !submenu) return;

		var trigger = menuItem.querySelector('a');
		var mql = window.matchMedia('(min-width: 1281px)');
		var hideTimer = null;

		// Detach so the sidebar's own overflow box can no longer clip it.
		document.body.appendChild(submenu);

		function positionSubmenu() {
			var triggerRect = menuItem.getBoundingClientRect();
			var sidebarRect = sidebar.getBoundingClientRect();

			submenu.style.left = Math.round(sidebarRect.right) + 'px';

			var top = Math.round(triggerRect.top);
			var maxTop = window.innerHeight - submenu.offsetHeight - 16;
			if (top > maxTop) top = Math.max(16, maxTop);
			submenu.style.top = top + 'px';
		}

		function show() {
			if (!mql.matches) return;
			clearTimeout(hideTimer);
			submenu.classList.add('is-active');
			positionSubmenu();
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
			if (!mql.matches) {
				submenu.classList.remove('is-active');
			} else if (submenu.classList.contains('is-active')) {
				positionSubmenu();
			}
		});

	});

})();
