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
	   data-cc-group. Nothing else needs to change.

	   The `items` list is what the Cookie details panel shows. Keep it in
	   step with cookie-notice.html after every site scan: the notice and
	   this list describe the same cookies and must not drift apart. */
	var GROUPS = [
		{
			id: 'C0001',
			name: 'Strictly necessary',
			locked: true,
			description: 'Needed for the site to work. At present this covers only the record of the choice you make here, which is kept in your browser and is not a cookie and is not sent anywhere.',
			items: [
				{
					name: 'cc-consent',
					kind: 'Local storage, not a cookie',
					host: 'This site',
					duration: 'One year, then you are asked again',
					purpose: 'Remembers which categories you allowed, so you are not asked on every page. It stays on your device, is never transmitted, and is cleared when you clear site data.'
				}
			]
		},
		{
			id: 'C0002',
			name: 'Performance',
			locked: false,
			description: 'The embedded fines dashboard is served by its provider, which measures how the embed is used. Allowing this loads the dashboard and lets the provider set its own cookies, including a visitor identifier that lasts a year.',
			note: 'Two of these measure use and seven keep the embed working. They cannot be refused separately, because they all arrive with the report, which is why the whole embed sits behind one choice.',
			items: [
				{
					name: 'ai_user',
					kind: 'Third party cookie',
					host: 'app.powerbi.com',
					duration: 'One year',
					purpose: 'Microsoft Azure Application Insights. Assigns a persistent identifier so Microsoft can count returning users of the embedded report. This is the one genuinely analytical cookie on the site.'
				},
				{
					name: 'ai_session',
					kind: 'Third party cookie',
					host: 'app.powerbi.com',
					duration: 'Less than a day',
					purpose: 'Microsoft Azure Application Insights. Groups a single visit to the embedded report into one session for the same measurement.'
				},
				{
					name: 'WFESessionId',
					kind: 'Third party cookie',
					host: 'app.powerbi.com',
					duration: 'Session, until you close the browser',
					purpose: 'Identifies the front end session serving the embedded report.'
				},
				{
					name: 'ARRAffinity',
					kind: 'Third party cookie',
					host: 'app.powerbi.com, appsource.powerbi.com, pbivisuals.powerbi.com',
					duration: 'Session, until you close the browser',
					purpose: 'Keeps your requests going to the same server while the dashboard is open. It is a load balancing cookie and carries no identifier of you.'
				},
				{
					name: 'ARRAffinitySameSite',
					kind: 'Third party cookie',
					host: 'app.powerbi.com, appsource.powerbi.com, pbivisuals.powerbi.com',
					duration: 'Session, until you close the browser',
					purpose: 'The same load balancing cookie as the one above, with a stricter cross site rule.'
				},
				{
					name: 'Power BI local and session storage',
					kind: 'Storage, not a cookie',
					host: 'app.powerbi.com',
					duration: 'Until you clear site data for powerbi.com',
					purpose: 'Report configuration and theme data, a service access token for Microsoft’s own API, and a buffer of Application Insights telemetry waiting to be sent. None of it is readable by this site.'
				}
			]
		},
		{
			id: 'C0003',
			name: 'Functional',
			locked: false,
			description: 'Certificate badges and institution logos loaded from the organisations that issued them. Allowing this lets those providers set short-lived session cookies when the images are fetched.',
			items: [
				{
					name: 'WMF-Uniq',
					kind: 'Third party cookie',
					host: 'upload.wikimedia.org',
					duration: 'One year',
					purpose: 'Set by the Wikimedia Foundation because one university logo is loaded from Wikimedia Commons rather than from this site. It is a unique visitor identifier used for their own traffic measurement, and it is the longest lived cookie reached from this site.'
				},
				{
					name: '_session_id',
					kind: 'Third party cookie',
					host: 'api.accredible.com',
					duration: 'Session, until you close the browser',
					purpose: 'Set by the certification provider when a credential badge image is fetched from its API. It holds a session reference for their service. Nobody signs in on this site, so it identifies nothing about you here.'
				}
			]
		}
	];

	var NOTICE_URL = '/cookie-notice.html';
	var PRIVACY_URL = '/privacy-notice.html';

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
		syncBlocked();
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

	/* --------------------------------------------------- blocking, both ways

	   An element waiting for consent holds its URL in data-cc-src, which the
	   browser does not understand, so nothing is requested. Once allowed, the
	   URL moves to src and the request fires. The element then carries
	   data-cc-loaded instead, which is how a later revocation finds it again
	   and puts it back. Consent is not a filter in front of the load, it is
	   what supplies the address, and withdrawing it takes the address away.
	*/

	function syncBlocked() {
		var found = document.querySelectorAll('[data-cc-src], [data-cc-loaded]');

		/* Copied to an array first: tearing an iframe down replaces the node,
		   and mutating the DOM underneath a list being walked is how you skip
		   elements. */
		var list = [];
		for (var i = 0; i < found.length; i++) list.push(found[i]);

		for (var j = 0; j < list.length; j++) {
			var el = list[j];
			var group = el.getAttribute('data-cc-group') || 'C0001';
			var pending = el.getAttribute('data-cc-src');
			var loaded = el.getAttribute('data-cc-loaded');

			if (isAllowed(group)) {
				if (!pending) continue;
				removePlaceholder(el);
				el.removeAttribute('data-cc-src');
				el.setAttribute('data-cc-loaded', pending);
				el.setAttribute('src', pending);
			} else {
				if (loaded) el = teardown(el, loaded);
				placeholder(el, group);
			}
		}
	}

	/* Puts a loaded element back into its blocked state and returns the
	   element to carry on with, which is not always the one passed in. */
	function teardown(el, url) {
		var node = el;

		if (el.tagName === 'IFRAME') {
			/* Removing src does not unload the document already inside an
			   iframe: it keeps rendering, its scripts keep running and its
			   timers keep firing. Replacing the element is the only thing
			   that reliably tears the embedded document down. */
			node = el.cloneNode(false);
			node.removeAttribute('src');
			if (el.parentNode) el.parentNode.replaceChild(node, el);
		} else {
			el.removeAttribute('src');
		}

		node.removeAttribute('data-cc-loaded');
		node.setAttribute('data-cc-src', url);
		return node;
	}

	function placeholderId(el) {
		if (!el.id) el.id = 'cc-blocked-' + Math.random().toString(36).slice(2, 9);
		return 'cc-ph-' + el.id;
	}

	function placeholder(el, group) {
		/* Hidden whether or not it gets a card, so a blocked image does not
		   sit there as a broken icon. */
		el.style.display = 'none';

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

	function anchor(href, label) {
		var a = el('a', null, label);
		a.href = href;
		return a;
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
		p.appendChild(anchor(NOTICE_URL, 'Cookie notice'));
		p.appendChild(document.createTextNode(' and '));
		p.appendChild(anchor(PRIVACY_URL, 'privacy notice'));
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

	/* --------------------------------------------------- group detail panels */

	/* The "Group C0001 details" row. Clicking it expands the list of what the
	   group actually covers, in place, without leaving the dialog. */
	function detailsToggle(g) {
		var panelId = 'cc-details-' + g.id;
		var count = (g.items || []).length;

		var toggle = button('cc-group-toggle', '');
		toggle.setAttribute('aria-expanded', 'false');
		toggle.setAttribute('aria-controls', panelId);

		toggle.appendChild(el('span', 'cc-chev'));
		toggle.appendChild(el('span', 'cc-group-toggle-id', 'Group ' + g.id + ' details'));
		toggle.appendChild(el('span', 'cc-group-toggle-count',
			count === 1 ? '1 item' : count + ' items'));

		toggle.addEventListener('click', function () {
			var panel = document.getElementById(panelId);
			if (!panel) return;
			var open = toggle.getAttribute('aria-expanded') === 'true';
			toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
			if (open) panel.setAttribute('hidden', 'hidden');
			else panel.removeAttribute('hidden');
		});

		return toggle;
	}

	function detailsPanel(g) {
		var panel = el('div', 'cc-details');
		panel.id = 'cc-details-' + g.id;
		panel.setAttribute('hidden', 'hidden');

		if (g.note) panel.appendChild(el('p', 'cc-details-note', g.note));

		var items = g.items || [];
		if (!items.length) {
			panel.appendChild(el('p', 'cc-details-empty', 'Nothing is stored for this category.'));
			return panel;
		}

		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			var card = el('div', 'cc-item');

			var head = el('p', 'cc-item-name');
			var code = el('code', null, item.name);
			head.appendChild(code);
			head.appendChild(el('span', 'cc-item-kind', item.kind));
			card.appendChild(head);

			card.appendChild(fact('Host', item.host));
			card.appendChild(fact('Duration', item.duration));
			card.appendChild(el('p', 'cc-item-purpose', item.purpose));

			panel.appendChild(card);
		}

		return panel;
	}

	function fact(label, value) {
		var p = el('p', 'cc-item-fact');
		p.appendChild(el('span', 'cc-item-label', label));
		p.appendChild(document.createTextNode(value));
		return p;
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
			'it covers is not requested at all, so the provider never sees your visit. ' +
			'Turning off something you had allowed unloads it straight away, without a ' +
			'reload, though cookies a provider has already set stay in your browser ' +
			'until you clear them.');

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
				row.appendChild(detailsToggle(g));
				row.appendChild(detailsPanel(g));
				list.appendChild(row);
			})(GROUPS[i]);
		}

		/* The two documents that say, in full, what this dialog summarises.
		   A preference centre without them makes the visitor take the summary
		   on trust. */
		var refs = el('p', 'cc-modal-links');
		refs.appendChild(document.createTextNode('Every cookie listed here is described in the '));
		refs.appendChild(anchor(NOTICE_URL, 'cookie notice'));
		refs.appendChild(document.createTextNode('. What is done with personal data across the whole site, on what legal basis and for how long, is in the '));
		refs.appendChild(anchor(PRIVACY_URL, 'privacy notice'));
		refs.appendChild(document.createTextNode('.'));

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
		panel.appendChild(refs);
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
