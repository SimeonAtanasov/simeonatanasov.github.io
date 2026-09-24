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
