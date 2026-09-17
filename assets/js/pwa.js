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
