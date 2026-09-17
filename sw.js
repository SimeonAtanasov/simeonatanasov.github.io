/*
	Service worker for simeonatanasov.com

	Deliberately conservative, because the site is not a static brochure:
	the tools keep state in localStorage, export files as blobs, and the
	cookie banner scanner talks to a separate API origin.

	  - Page navigations: network first, cache as fallback, then an offline
	    page. A push to GitHub Pages is live on the next visit, never stale.
	  - Same origin static assets: stale while revalidate. Served instantly,
	    refreshed in the background for the visit after.
	  - Everything else is left alone: cross origin requests (the scanner
	    API), anything that is not a GET, and range requests (the game
	    sounds). Those behave exactly as they would with no service worker.

	Bump VERSION to retire every cache at once.
*/

var VERSION = 'v1';
var PAGE_CACHE = 'pages-' + VERSION;
var ASSET_CACHE = 'assets-' + VERSION;
var OFFLINE_URL = '/offline.html';

/* Kept short on purpose. Everything else is cached as it is visited. */
var PRECACHE = [
	OFFLINE_URL,
	'/privacy-ai-assessment.html',
	'/assets/css/main.css',
	'/assets/js/main.js',
	'/images/favicon/android-chrome-192x192.png'
];

var ASSET_PATTERN = /\.(?:css|js|mjs|png|jpe?g|gif|svg|webp|ico|woff2?|ttf|otf|eot|mp3|wav|ogg|json)$/i;

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(ASSET_CACHE).then(function (cache) {
			/* One missing file must not fail the whole install. */
			return Promise.all(PRECACHE.map(function (url) {
				return cache.add(new Request(url, { cache: 'reload' })).catch(function () {});
			}));
		})
	);
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (names) {
			return Promise.all(names.map(function (name) {
				if (name !== PAGE_CACHE && name !== ASSET_CACHE) {
					return caches.delete(name);
				}
			}));
		}).then(function () {
			return self.clients.claim();
		})
	);
});

/* Lets a page trigger an immediate update if it ever wants to. */
self.addEventListener('message', function (event) {
	if (event.data === 'skip-waiting') {
		self.skipWaiting();
	}
});

function cacheable(response) {
	return response &&
		response.status === 200 &&
		response.type !== 'opaque' &&
		!response.headers.get('content-range');
}

function networkFirst(request) {
	return fetch(request).then(function (response) {
		if (cacheable(response)) {
			var copy = response.clone();
			caches.open(PAGE_CACHE).then(function (cache) {
				cache.put(request, copy);
			});
		}
		return response;
	}).catch(function () {
		return caches.match(request).then(function (hit) {
			return hit || caches.match(OFFLINE_URL).then(function (offline) {
				return offline || new Response(
					'Offline, and this page has not been opened before.',
					{ status: 503, headers: { 'Content-Type': 'text/plain' } }
				);
			});
		});
	});
}

function staleWhileRevalidate(request) {
	return caches.open(ASSET_CACHE).then(function (cache) {
		return cache.match(request).then(function (hit) {
			var network = fetch(request).then(function (response) {
				if (cacheable(response)) {
					cache.put(request, response.clone());
				}
				return response;
			}).catch(function () {
				return hit;
			});
			return hit || network;
		});
	});
}

self.addEventListener('fetch', function (event) {
	var request = event.request;

	if (request.method !== 'GET') return;
	if (request.headers.has('range')) return;

	var url;
	try {
		url = new URL(request.url);
	} catch (e) {
		return;
	}

	if (url.origin !== self.location.origin) return;
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

	if (request.mode === 'navigate') {
		event.respondWith(networkFirst(request));
		return;
	}

	if (ASSET_PATTERN.test(url.pathname)) {
		event.respondWith(staleWhileRevalidate(request));
	}
});
