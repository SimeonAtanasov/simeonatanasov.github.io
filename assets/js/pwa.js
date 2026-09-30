/*
	Registers the service worker. Kept in its own file so every page can pull
	it in with one line, and so nothing in main.js has to change.
*/
(function () {

	if (!('serviceWorker' in navigator)) return;

	/* Skip file:// and any other non secure context, where registration
	   throws and clutters the console during local editing. */
	var host = location.hostname;
	if (location.protocol !== 'https:' && host !== 'localhost' && host !== '127.0.0.1') return;

	window.addEventListener('load', function () {
		navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function (error) {
			console.warn('Service worker registration failed:', error);
		});
	});

})();

/*
	Loads the cookie consent banner on every page.

	This lives here rather than as a script tag on each page for one reason:
	every root page already pulls this file into its head with defer, so one
	edit covers the whole site and no page markup has to change. If a page is
	ever added without the PWA block, it gets no banner, so add the block.

	The pair it loads is assets/css/cookie-consent.css and
	assets/js/cookie-consent.js. Blocking is by markup: an element carries
	data-cc-src instead of src, so nothing is requested before the script
	runs. Because this file is deferred, an element left with a real src
	loads regardless of consent, which is why the attribute swap is the part
	that does the work.
*/
(function () {

	if (window.__ccLoaded) return;
	window.__ccLoaded = true;

	var head = document.head || document.getElementsByTagName('head')[0];
	if (!head) return;

	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = '/assets/css/cookie-consent.css';
	head.appendChild(link);

	var script = document.createElement('script');
	script.src = '/assets/js/cookie-consent.js';
	script.defer = true;
	head.appendChild(script);

})();

/*
	Install app, on demand.

	Adds an "Install app" entry to the site menu: the last item of the header
	nav on the inner pages, and the last item of the sidebar nav on the home
	page (main.js copies that into the phone menu bar, which is why this has
	to run before DOMContentLoaded, and it does, being deferred).

	The entry only shows when installing is actually possible. On the home
	page that is a class on <html>, so the phone bar's copy follows too; in
	the header the item is inserted and removed instead (see setAvailable):
	  - Chrome, Edge, Samsung Internet and other Chromium browsers fire
	    beforeinstallprompt. The event is kept and replayed on click.
	  - iPhone and iPad have no prompt at all, in any browser, so the click
	    opens a short card with the Share, Add to Home Screen steps. Safari on
	    a Mac gets the File, Add to Dock steps the same way.
	  - Inside the installed app (standalone, including the Play Store
	    wrapper) and after appinstalled, it stays hidden.
	Firefox on the desktop cannot install web apps, so it never shows there.

	Clicks are caught by delegation on href="#install-app", because the phone
	bar rebuilds the link and keeps only its href and text. Showing or hiding
	the entry fires a resize so main.js measures the header row again.
*/
(function () {

	var HREF = '#install-app';
	var root = document.documentElement;
	var ua = navigator.userAgent || '';
	var deferred = null;

	function standalone() {
		return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
			window.navigator.standalone === true;
	}
	if (standalone()) return;

	var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
	var isMacSafari = !isIOS && /Macintosh/.test(ua) && /Version\/(1[7-9]|[2-9]\d)/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox/.test(ua);

	var style = document.createElement('style');
	style.textContent =
		'html:not(.can-install) a[href="#install-app"] { display: none !important; }' +
		'html:not(.can-install) li:has(> a[href="#install-app"]) { display: none !important; }' +
		'.ia-card { position: fixed; left: 50%; bottom: 1.25em; transform: translateX(-50%); z-index: 10050; width: min(26em, calc(100vw - 2em)); box-sizing: border-box; background: #2a3860; color: #fff; border: 1px solid rgba(255,255,255,0.25); border-radius: 0.6em; padding: 1.1em 1.2em 1em; box-shadow: 0 0.5em 2em rgba(0,0,0,0.45); font-size: 0.9em; line-height: 1.5; }' +
		'.ia-card[hidden] { display: none; }' +
		'.ia-card h2 { margin: 0 2em 0.5em 0; font-size: 1.05em; color: #fff; letter-spacing: 0.02em; text-transform: none; }' +
		'.ia-card ol { margin: 0 0 0 1.2em; padding: 0; }' +
		'.ia-card li { margin: 0.2em 0; padding: 0; }' +
		'.ia-card .ia-close { position: absolute; top: 0.45em; right: 0.45em; width: 2em; min-width: 0; max-width: none; height: 2em; line-height: 2em; padding: 0; margin: 0; left: auto; border: 0 !important; box-shadow: none !important; background: transparent !important; color: #fff !important; font-size: 1.1em; letter-spacing: 0; text-transform: none; cursor: pointer; }' +
		'.ia-card .ia-close:focus-visible { outline: 2px solid #fff; border-radius: 0.3em; }';
	(document.head || root).appendChild(style);

	function makeItem() {
		var li = document.createElement('li');
		li.className = 'install-app-item';
		var a = document.createElement('a');
		a.href = HREF;
		a.setAttribute('role', 'button');
		a.textContent = 'Install app';
		li.appendChild(a);
		return li;
	}

	/* The sidebar item goes in now, hidden by the class rule, so the phone bar
	   copies it. The header item is only inserted while it can be used: main.js
	   counts rows by each item's top edge, and a display: none item reports 0,
	   which reads as a second row and collapses the header on the desktop. */
	var sidebarList = document.querySelector('#sidebar nav > ul');
	if (sidebarList) sidebarList.appendChild(makeItem());
	var headerList = document.querySelector('#header nav > ul');
	var headerItem = null;

	function setAvailable(on) {
		on = !!on;
		var was = root.classList.contains('can-install');
		root.classList.toggle('can-install', on);
		if (headerList) {
			if (on && !headerItem) headerItem = headerList.appendChild(makeItem());
			if (!on && headerItem) { headerItem.parentNode.removeChild(headerItem); headerItem = null; }
		}
		if (was !== on) {
			try { window.dispatchEvent(new Event('resize')); } catch (e) { /* old browsers */ }
		}
	}

	if (isIOS || isMacSafari) setAvailable(true);

	window.addEventListener('beforeinstallprompt', function (event) {
		event.preventDefault();
		deferred = event;
		setAvailable(true);
	});

	window.addEventListener('appinstalled', function () {
		deferred = null;
		setAvailable(false);
		closeCard();
	});

	var card = null;
	var lastFocus = null;

	function closeCard() {
		if (!card || card.hidden) return;
		card.hidden = true;
		if (lastFocus && lastFocus.focus) lastFocus.focus();
	}

	function openCard() {
		if (!card) {
			card = document.createElement('div');
			card.className = 'ia-card';
			card.setAttribute('role', 'dialog');
			card.setAttribute('aria-labelledby', 'ia-title');
			var steps = isIOS
				? '<li>Tap the <strong>Share</strong> button in the browser toolbar.</li>' +
				  '<li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>' +
				  '<li>Tap <strong>Add</strong>. The app opens from your home screen.</li>'
				: '<li>Open the <strong>File</strong> menu in Safari.</li>' +
				  '<li>Choose <strong>Add to Dock</strong>, then <strong>Add</strong>.</li>';
			card.innerHTML = '<button type="button" class="ia-close" aria-label="Close">×</button>' +
				'<h2 id="ia-title">Install this site as an app</h2><ol>' + steps + '</ol>';
			document.body.appendChild(card);
			card.querySelector('.ia-close').addEventListener('click', closeCard);
		}
		lastFocus = document.activeElement;
		card.hidden = false;
		card.querySelector('.ia-close').focus();
	}

	document.addEventListener('keydown', function (event) {
		if (event.key === 'Escape' || event.key === 'Esc') closeCard();
	});

	document.addEventListener('click', function (event) {
		var link = event.target && event.target.closest ? event.target.closest('a[href="' + HREF + '"]') : null;
		if (!link) {
			if (card && !card.hidden && !card.contains(event.target)) closeCard();
			return;
		}
		event.preventDefault();
		if (deferred) {
			var prompt = deferred;
			deferred = null;
			prompt.prompt();
			if (prompt.userChoice && prompt.userChoice.then) {
				prompt.userChoice.then(function (choice) {
					/* Accepted: appinstalled hides it. Dismissed: Chrome fires the
					   event again later when it is willing to ask again. */
					if (!choice || choice.outcome !== 'accepted') setAvailable(false);
				});
			}
			return;
		}
		if (isIOS || isMacSafari) openCard();
	}, true);

})();
