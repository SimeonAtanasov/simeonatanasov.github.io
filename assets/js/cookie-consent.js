/*
	Cookie consent banner and preference centre.

	Behaves like a standard consent platform without depending on one:

	  - nothing in a non-essential category loads until the visitor allows it
	  - a banner on first visit, a preference centre for per-category choices
	  - the choice is remembered and can be changed from any page footer
	  - blocked elements declare their own category in the markup

	Blocking an element: give it data-cc-src instead of src, and name the
	group it belongs to.

	  <iframe data-cc-src="https://..." data-cc-group="C0002"></iframe>
	  <img    data-cc-src="https://..." data-cc-group="C0003" alt="...">

	Add data-cc-placeholder to an iframe and a click to load card is drawn in
	its place, so the visitor can allow that one group without opening the
	preference centre.

	The script itself stores only the consent record, in localStorage, under
	the key below. It sets no cookies of its own.
*/
(function (window, document) {
	'use strict';

	var STORE_KEY = 'cc-consent';
	var STORE_VERSION = 1;
	var MAX_AGE_DAYS = 365;

	/* The groups. Order is the order they appear in the preference centre.
	   To add a group, add it here and tag the elements it covers with
	   data-cc-group. Nothing else needs to change. */
	var GROUPS = [
		{
			id: 'C0001',
			name: 'Strictly necessary',
			locked: true,
			description: 'Needed for the site to work. At present this covers only the record of the choice you make here, which is kept in your browser and is not a cookie and is not sent anywhere.'
		},
		{
			id: 'C0002',
			name: 'Performance',
			locked: false,
			description: 'The embedded fines dashboard is served by its provider, which measures how the embed is used. Allowing this loads the dashboard and lets the provider set its own cookies, including a visitor identifier that lasts a year.'
		},
		{
			id: 'C0003',
			name: 'Functional',
			locked: false,
			description: 'Certificate badges and institution logos loaded from the organisations that issued them. Allowing this lets those providers set short-lived session cookies when the images are fetched.'
		}
	];

	var NOTICE_URL = '/cookie-notice.html';

	/* ---------------------------------------------------------------- state */

	var state = null;
	var listeners = [];
	var lastFocus = null;

	function defaults(allow) {
		var map = {};
		for (var i = 0; i < GROUPS.length; i++) {
			map[GROUPS[i].id] = GROUPS[i].locked ? true : !!allow;
		}
		return map;
	}

	function read() {
		var raw;
		try {
			raw = window.localStorage.getItem(STORE_KEY);
		} catch (e) {
			/* Private mode, or storage blocked. Treat as no choice made and
			   do not try to write later. */
			return null;
		}
		if (!raw) return null;

		var parsed;
		try {
			parsed = JSON.parse(raw);
		} catch (e) {
			return null;
		}
		if (!parsed || parsed.v !== STORE_VERSION || !parsed.groups) return null;

		var age = Date.now() - (parsed.ts || 0);
		if (age > MAX_AGE_DAYS * 86400000) return null;

		/* A group added since the record was written counts as not allowed,
		   so new tracking never inherits an old yes. */
		var map = defaults(false);
		for (var i = 0; i < GROUPS.length; i++) {
			var id = GROUPS[i].id;
			if (GROUPS[i].locked) map[id] = true;
			else map[id] = parsed.groups[id] === true;
		}
		return map;
	}

	function write(map) {
		try {
			window.localStorage.setItem(STORE_KEY, JSON.stringify({
				v: STORE_VERSION,
				ts: Date.now(),
				groups: map
			}));
		} catch (e) {
			/* Nothing to do. The banner will ask again next visit. */
		}
	}

	function isAllowed(id) {
		return !!(state && state[id]);
	}

	function apply(map, persist) {
		state = map;
		if (persist !== false) write(map);
		unblock();
		for (var i = 0; i < listeners.length; i++) {
			try {
				listeners[i](copy(map));
			} catch (e) {
				if (window.console) console.warn('Cookie consent listener failed:', e);
			}
		}
	}

	function copy(map) {
		var out = {};
		for (var k in map) if (Object.prototype.hasOwnProperty.call(map, k)) out[k] = map[k];
		return out;
	}

	/* ------------------------------------------------------------ unblocking */

	function unblock() {
		var nodes = document.querySelectorAll('[data-cc-src]');
		for (var i = 0; i < nodes.length; i++) {
			var el = nodes[i];
			var group = el.getAttribute('data-cc-group') || 'C0001';
			if (!isAllowed(group)) {
				placeholder(el, group);
				continue;
			}
			var src = el.getAttribute('data-cc-src');
			if (!src) continue;
			removePlaceholder(el);
			el.removeAttribute('data-cc-src');
			el.setAttribute('src', src);
		}
	}

	function placeholderId(el) {
		if (!el.id) el.id = 'cc-blocked-' + Math.random().toString(36).slice(2, 9);
		return 'cc-ph-' + el.id;
	}

	function placeholder(el, group) {
		if (el.getAttribute('data-cc-placeholder') === null) return;
		var id = placeholderId(el);
		if (document.getElementById(id)) return;

		var group_ = groupById(group);
		var box = document.createElement('div');
		box.className = 'cc-placeholder';
		box.id = id;

		var title = document.createElement('p');
		title.className = 'cc-placeholder-title';
		title.appendChild(document.createTextNode('This content is not loaded'));

		var body = document.createElement('p');
		body.className = 'cc-placeholder-body';
		body.appendChild(document.createTextNode(
			'It is served by another organisation, which sets its own cookies once it loads. ' +
			'Nothing has been requested from them yet.'
		));

		var actions = document.createElement('div');
		actions.className = 'cc-placeholder-actions';

		var load = button('cc-btn cc-btn-primary', 'Load this content');
		load.addEventListener('click', function () {
			var map = copy(state || defaults(false));
			map[group] = true;
			apply(map);
		});

		var more = button('cc-btn cc-btn-quiet', 'Cookie settings');
		more.addEventListener('click', function () { openPreferences(); });

		actions.appendChild(load);
		actions.appendChild(more);

		box.appendChild(title);
		box.appendChild(body);
		if (group_) {
			var note = document.createElement('p');
			note.className = 'cc-placeholder-note';
			note.appendChild(document.createTextNode('Category: ' + group_.name));
			box.appendChild(note);
		}
		box.appendChild(actions);

		el.style.display = 'none';
		if (el.parentNode) el.parentNode.insertBefore(box, el);
	}

	function removePlaceholder(el) {
		var box = document.getElementById('cc-ph-' + (el.id || ''));
		if (box && box.parentNode) box.parentNode.removeChild(box);
		el.style.display = '';
	}

	function groupById(id) {
		for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].id === id) return GROUPS[i];
		return null;
	}

	/* --------------------------------------------------------------- helpers */

	function button(className, label) {
		var b = document.createElement('button');
		b.type = 'button';
		b.className = className;
		b.appendChild(document.createTextNode(label));
		return b;
	}

	function el(tag, className, text) {
		var n = document.createElement(tag);
		if (className) n.className = className;
		if (text) n.appendChild(document.createTextNode(text));
		return n;
	}

	/* ---------------------------------------------------------------- banner */

	var bannerNode = null;

	function showBanner() {
		if (bannerNode) return;

		bannerNode = el('div', 'cc-banner');
		bannerNode.setAttribute('role', 'region');
		bannerNode.setAttribute('aria-label', 'Cookie notice');

		var inner = el('div', 'cc-banner-inner');
		var text = el('div', 'cc-banner-text');
		text.appendChild(el('h2', 'cc-banner-title', 'Cookies on this site'));

		var p = el('p', null);
		p.appendChild(document.createTextNode(
			'This site sets no cookies of its own. Some pages embed content from other ' +
			'organisations, and those providers set cookies once their content loads. ' +
			'Nothing non-essential is loaded until you choose. '
		));
		var link = el('a', null, 'Read the cookie notice');
		link.href = NOTICE_URL;
		p.appendChild(link);
		p.appendChild(document.createTextNode('.'));
		text.appendChild(p);

		var actions = el('div', 'cc-banner-actions');

		var reject = button('cc-btn cc-btn-secondary', 'Reject all');
		reject.addEventListener('click', function () {
			apply(defaults(false));
			hideBanner();
		});

		var manage = button('cc-btn cc-btn-secondary', 'Manage preferences');
		manage.addEventListener('click', function () { openPreferences(); });

		var accept = button('cc-btn cc-btn-primary', 'Accept all');
		accept.addEventListener('click', function () {
			apply(defaults(true));
			hideBanner();
		});

		/* Reject is first in the DOM so it is reachable in the same number of
		   keystrokes as Accept. */
		actions.appendChild(reject);
		actions.appendChild(manage);
		actions.appendChild(accept);

		inner.appendChild(text);
		inner.appendChild(actions);
		bannerNode.appendChild(inner);
		document.body.appendChild(bannerNode);

		window.setTimeout(function () {
			if (bannerNode) bannerNode.className = 'cc-banner cc-banner-in';
		}, 20);
	}

	function hideBanner() {
		if (!bannerNode) return;
		if (bannerNode.parentNode) bannerNode.parentNode.removeChild(bannerNode);
		bannerNode = null;
	}

	/* ------------------------------------------------------- preference centre */

	var prefNode = null;
	var switches = {};

	function openPreferences() {
		if (prefNode) return;
		lastFocus = document.activeElement;

		var working = copy(state || defaults(false));
		switches = {};

		prefNode = el('div', 'cc-modal-backdrop');
		var panel = el('div', 'cc-modal');
		panel.setAttribute('role', 'dialog');
		panel.setAttribute('aria-modal', 'true');
		panel.setAttribute('aria-labelledby', 'cc-modal-title');

		var head = el('div', 'cc-modal-head');
		var h = el('h2', 'cc-modal-title', 'Cookie preferences');
		h.id = 'cc-modal-title';
		head.appendChild(h);

		var close = button('cc-btn cc-btn-close', 'Close');
		close.setAttribute('aria-label', 'Close cookie preferences');
		close.addEventListener('click', closePreferences);
		head.appendChild(close);

		var intro = el('p', 'cc-modal-intro',
			'Choose what may load on this site. Blocking a category means the content ' +
			'it covers is not requested at all, so the provider never sees your visit.');

		var list = el('div', 'cc-groups');

		for (var i = 0; i < GROUPS.length; i++) {
			(function (g) {
				var row = el('div', 'cc-group');

				var rowHead = el('div', 'cc-group-head');
				rowHead.appendChild(el('h3', 'cc-group-name', g.name));

				if (g.locked) {
					rowHead.appendChild(el('span', 'cc-group-always', 'Always active'));
				} else {
					var sw = button('cc-switch', '');
					sw.setAttribute('role', 'switch');
					sw.setAttribute('aria-checked', working[g.id] ? 'true' : 'false');
					sw.setAttribute('aria-label', g.name);
					sw.appendChild(el('span', 'cc-switch-track'));
					sw.addEventListener('click', function () {
						working[g.id] = !working[g.id];
						sw.setAttribute('aria-checked', working[g.id] ? 'true' : 'false');
					});
					switches[g.id] = sw;
					rowHead.appendChild(sw);
				}

				row.appendChild(rowHead);
				row.appendChild(el('p', 'cc-group-desc', g.description));
				row.appendChild(el('p', 'cc-group-id', 'Group ' + g.id));
				list.appendChild(row);
			})(GROUPS[i]);
		}

		var foot = el('div', 'cc-modal-foot');

		var rejectAll = button('cc-btn cc-btn-secondary', 'Reject all');
		rejectAll.addEventListener('click', function () {
			apply(defaults(false));
			closePreferences();
			hideBanner();
		});

		var allowAll = button('cc-btn cc-btn-secondary', 'Allow all');
		allowAll.addEventListener('click', function () {
			apply(defaults(true));
			closePreferences();
			hideBanner();
		});

		var save = button('cc-btn cc-btn-primary', 'Save my choices');
		save.addEventListener('click', function () {
			apply(working);
			closePreferences();
			hideBanner();
		});

		foot.appendChild(rejectAll);
		foot.appendChild(allowAll);
		foot.appendChild(save);

		panel.appendChild(head);
		panel.appendChild(intro);
		panel.appendChild(list);
		panel.appendChild(foot);
		prefNode.appendChild(panel);
		document.body.appendChild(prefNode);
		document.documentElement.className += ' cc-no-scroll';

		prefNode.addEventListener('click', function (event) {
			if (event.target === prefNode) closePreferences();
		});
		document.addEventListener('keydown', onKeydown, true);

		close.focus();
	}

	function closePreferences() {
		if (!prefNode) return;
		document.removeEventListener('keydown', onKeydown, true);
		if (prefNode.parentNode) prefNode.parentNode.removeChild(prefNode);
		prefNode = null;
		document.documentElement.className =
			document.documentElement.className.replace(/\s*cc-no-scroll/g, '');
		if (lastFocus && lastFocus.focus) lastFocus.focus();
	}

	function onKeydown(event) {
		if (!prefNode) return;

		if (event.key === 'Escape' || event.keyCode === 27) {
			event.preventDefault();
			closePreferences();
			return;
		}
		if (event.key !== 'Tab' && event.keyCode !== 9) return;

		/* Keep focus inside the dialog. */
		var focusable = prefNode.querySelectorAll('button, a[href]');
		if (!focusable.length) return;
		var first = focusable[0];
		var last = focusable[focusable.length - 1];

		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	}

	/* ------------------------------------------------------- footer settings */

	function addFooterLink() {
		var menu = document.querySelector('#footer .menu');
		if (!menu || document.querySelector('.cc-settings-link')) return;

		var li = document.createElement('li');
		var a = el('a', 'cc-settings-link', 'Cookie settings');
		a.href = '#';
		a.addEventListener('click', function (event) {
			event.preventDefault();
			openPreferences();
		});
		li.appendChild(a);
		menu.appendChild(li);
	}

	/* ------------------------------------------------------------------ init */

	function init() {
		var stored = read();

		if (stored) {
			apply(stored, false);
		} else {
			/* No valid choice on record. Block everything, then ask. */
			apply(defaults(false), false);
			showBanner();
		}
		addFooterLink();
	}

	window.CookieConsent = {
		groups: function () {
			return GROUPS.map(function (g) {
				return { id: g.id, name: g.name, locked: g.locked };
			});
		},
		isAllowed: isAllowed,
		accepted: function () {
			var out = [];
			for (var k in state) if (state[k]) out.push(k);
			return out;
		},
		acceptAll: function () { apply(defaults(true)); hideBanner(); },
		rejectAll: function () { apply(defaults(false)); hideBanner(); },
		showPreferences: openPreferences,
		onChange: function (fn) { if (typeof fn === 'function') listeners.push(fn); },
		reset: function () {
			try { window.localStorage.removeItem(STORE_KEY); } catch (e) {}
			apply(defaults(false), false);
			showBanner();
		}
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})(window, document);
