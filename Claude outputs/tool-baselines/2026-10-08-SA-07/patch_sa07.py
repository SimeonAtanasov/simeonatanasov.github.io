"""SA-07: hover preview of a result's page beside the Ask panel (desktop only).

Patches assets/js/assistant.js, assets/css/assistant.css and sw.js in place.
Asserts the input md5 of each file, so it refuses to run on anything but the
SA-06 state. Usage: python3 patch_sa07.py <repo root>
"""
import hashlib, sys, os

root = sys.argv[1]
JS = os.path.join(root, 'assets/js/assistant.js')
CSS = os.path.join(root, 'assets/css/assistant.css')
SW = os.path.join(root, 'sw.js')

EXPECT = {
    JS: 'a2e8dda060d6e79c6c7c3fcb486a66f7',
    CSS: '4ce4f244aae77ed9980424f0fdc0564f',
    SW: 'c1dbe31ef70a260a883f6930ea969b13',
}
for p, m in EXPECT.items():
    got = hashlib.md5(open(p, 'rb').read()).hexdigest()
    if got != m:
        sys.exit('md5 mismatch on %s: %s' % (p, got))


def sub(src, old, new, count=1):
    n = src.count(old)
    if n != count:
        sys.exit('expected %d of %r, found %d' % (count, old[:60], n))
    return src.replace(old, new)


# ------------------------------------------------------------------ JS
js = open(JS, 'rb').read().decode('utf-8')

js = sub(js, """	if (window.__saLoaded) return;
	window.__saLoaded = true;
""", """	/* SA-07: a page loaded inside the Ask panel's preview window gets no
	   assistant of its own; the parent page drives it. */
	try { if (window.frameElement && window.frameElement.className.indexOf('sa-preview-frame') >= 0) return; } catch (e) {}

	if (window.__saLoaded) return;
	window.__saLoaded = true;
""")

js = sub(js, """		document.addEventListener('keydown', function (e) {
			if ((e.key === 'Escape' || e.key === 'Esc') && !panel.hidden) close();
		});
		window.addEventListener('resize', placeLauncher);""", """		document.addEventListener('keydown', function (e) {
			if ((e.key === 'Escape' || e.key === 'Esc') && !panel.hidden) {
				if (preview && !preview.hidden) hidePreview(); else close();
			}
		});
		window.addEventListener('resize', placeLauncher);
		window.addEventListener('resize', function () { if (preview && !preview.hidden) { if (previewAllowed()) placePreview(); else hidePreview(); } });""")

js = sub(js, """	function close() {
		panel.hidden = true;""", """	function close() {
		hidePreview();
		panel.hidden = true;""")

js = sub(js, """		lastFilter = filter || '';
		results.innerHTML = '';
		filterRow.hidden = true;
		if (!query)""", """		lastFilter = filter || '';
		hidePreview();
		results.innerHTML = '';
		filterRow.hidden = true;
		if (!query)""")

js = sub(js, """	function finder(node, trail) {
		intro.hidden = true;""", """	function finder(node, trail) {
		hidePreview();
		intro.hidden = true;""")

js = sub(js, """		var art = el('article', { class: 'sa-card' }, [meta, a, body]);
""", """		var art = el('article', { class: 'sa-card' }, [meta, a, body]);
		/* SA-07: on a desktop with room beside the panel, resting on a result
		   opens its page in the preview window */
		art.addEventListener('mouseenter', function () { schedulePreview(d, art); });
		art.addEventListener('mouseleave', function () { clearTimeout(pvTimer); });
		a.addEventListener('focus', function () { schedulePreview(d, art); });
""")

PREVIEW = r"""
	/* ------------------------------------------------ preview (SA-07) */

	/* Resting the pointer on a result for a moment opens the page it comes
	   from in a window to the left of the panel, scrolled to the passage,
	   which is outlined. The window stays while the visitor scrolls or reads
	   in it and switches when another result is hovered; its bar carries
	   "Go to this section", "Open page" and a close button. Desktop only: it
	   needs a fine pointer with hover and room beside the panel. The page is
	   the site's own, loaded same origin in an iframe, so nothing new is
	   requested from anywhere else. Up to PREVIEW_KEEP pages stay loaded, so
	   moving between results on the same page does not reload it. */
	var PREVIEW_DELAY = 260, PREVIEW_MIN_W = 440, PREVIEW_MAX_W = 820, PREVIEW_KEEP = 3, PREVIEW_GAP = 12;
	var preview = null, pvBody, pvLabel, pvTitle, pvSection, pvPage, pvLoading;
	var pvFrames = [], pvCurrent = null, pvTimer = null, pvCard = null, pvDoc = null;
	var pvMedia = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;

	var PREVIEW_CSS = [
		'#header { display: none !important; }',
		'html { scroll-behavior: auto !important; }',
		'.sa-pv-target { outline: 3px solid #f2c94c !important; outline-offset: 5px; border-radius: 3px; }'
	].join('\n');

	function previewAllowed() {
		if (!pvMedia || !pvMedia.matches || !panel || panel.hidden) return false;
		return panel.getBoundingClientRect().left - PREVIEW_GAP - 16 >= PREVIEW_MIN_W;
	}

	function buildPreview() {
		preview = el('section', { class: 'sa-preview', 'aria-label': 'Page preview', hidden: '' });
		pvLabel = el('span', { class: 'sa-page' });
		pvTitle = el('span', { class: 'sa-pv-title' });
		pvSection = el('a', { class: 'sa-pv-btn sa-pv-main', href: '#', text: 'Go to this section' });
		pvPage = el('a', { class: 'sa-pv-btn', href: '#', text: 'Open page' });
		var x = el('button', { type: 'button', class: 'sa-close sa-pv-close', 'aria-label': 'Close preview', html: '&times;' });
		x.addEventListener('click', hidePreview);
		pvSection.addEventListener('click', function (e) {
			if (pvDoc && samePage(pvDoc.u) && pvDoc.u.indexOf('#') > 0) {
				e.preventDefault();
				var id = pvDoc.u.split('#')[1];
				close();
				jumpTo(id);
			}
		});
		pvPage.addEventListener('click', function (e) {
			if (pvDoc && samePage(pvDoc.u)) { e.preventDefault(); close(); window.scrollTo(0, 0); }
		});
		var head = el('div', { class: 'sa-pv-head' }, [
			el('div', { class: 'sa-pv-label' }, [pvLabel, pvTitle]),
			el('div', { class: 'sa-pv-actions' }, [pvSection, pvPage, x])
		]);
		pvLoading = el('p', { class: 'sa-pv-loading', text: 'Loading the page…' });
		pvBody = el('div', { class: 'sa-pv-body' }, [pvLoading]);
		preview.appendChild(head);
		preview.appendChild(pvBody);
		/* keep the pointer's way from the panel to the preview from switching it */
		preview.addEventListener('mouseenter', function () { clearTimeout(pvTimer); });
		document.body.appendChild(preview);
	}

	function placePreview() {
		var r = panel.getBoundingClientRect();
		var w = Math.min(PREVIEW_MAX_W, r.left - PREVIEW_GAP - 16);
		var bottom = Math.max(0, window.innerHeight - r.bottom);
		var h = Math.min(window.innerHeight - bottom - 16, Math.max(r.height, window.innerHeight * 0.84));
		preview.style.right = (window.innerWidth - r.left + PREVIEW_GAP) + 'px';
		preview.style.bottom = bottom + 'px';
		preview.style.width = w + 'px';
		preview.style.height = h + 'px';
	}

	function schedulePreview(d, art) {
		clearTimeout(pvTimer);
		if (!previewAllowed()) return;
		if (pvDoc === d && preview && !preview.hidden) return;
		pvTimer = setTimeout(function () { showPreview(d, art); }, PREVIEW_DELAY);
	}

	function showPreview(d, art) {
		if (!previewAllowed()) return;
		if (!preview) buildPreview();
		var parts = d.u.split('#'), path = parts[0], hash = parts[1] || '';
		pvDoc = d;
		if (pvCard) pvCard.classList.remove('is-previewed');
		pvCard = art;
		if (art) art.classList.add('is-previewed');
		pvLabel.textContent = d.p;
		pvTitle.textContent = d.t;
		pvSection.href = '/' + d.u;
		pvSection.hidden = !hash;
		pvPage.href = '/' + path;
		placePreview();
		preview.hidden = false;

		var entry = null;
		for (var i = 0; i < pvFrames.length; i++) if (pvFrames[i].path === path) entry = pvFrames[i];
		if (!entry) {
			var frame = el('iframe', { class: 'sa-preview-frame', title: 'Preview: ' + d.p, src: '/' + d.u });
			entry = { path: path, frame: frame, ready: false, hash: hash };
			frame.addEventListener('load', function () { frameLoaded(entry); });
			pvBody.appendChild(frame);
			pvFrames.push(entry);
			while (pvFrames.length > PREVIEW_KEEP) {
				var old = null;
				for (var k = 0; k < pvFrames.length && !old; k++) if (pvFrames[k] !== entry) old = pvFrames[k];
				pvFrames.splice(pvFrames.indexOf(old), 1);
				old.frame.remove();
			}
		}
		entry.hash = hash;
		pvCurrent = entry;
		for (var j = 0; j < pvFrames.length; j++) pvFrames[j].frame.classList.toggle('is-on', pvFrames[j] === entry && entry.ready);
		pvLoading.hidden = entry.ready;
		if (entry.ready) scrollFrame(entry, false);
	}

	function frameLoaded(entry) {
		var doc, win;
		try { doc = entry.frame.contentDocument; win = entry.frame.contentWindow; } catch (e) { doc = null; }
		if (!doc || !doc.body) return;
		/* a later load is a link the visitor followed inside the preview:
		   tidy that page too, but leave its scroll position alone */
		var first = !entry.ready;
		entry.ready = true;
		try { entry.path = win.location.pathname.replace(/^\//, '') || 'index.html'; } catch (e) {}
		var style = doc.createElement('style');
		style.textContent = PREVIEW_CSS;
		(doc.head || doc.documentElement).appendChild(style);
		/* floating controls (Top, rail, Contents, Prev / Next, the consent
		   banner) are no use in a small window and cover the text */
		var all = doc.body.getElementsByTagName('*');
		for (var i = 0; i < all.length; i++) {
			if (win.getComputedStyle(all[i]).position === 'fixed') all[i].style.setProperty('display', 'none', 'important');
		}
		if (first && pvCurrent === entry) {
			entry.frame.classList.add('is-on');
			pvLoading.hidden = true;
			scrollFrame(entry, true);
		}
	}

	function scrollFrame(entry, first) {
		var doc, win;
		try { doc = entry.frame.contentDocument; win = entry.frame.contentWindow; } catch (e) { return; }
		if (!doc) return;
		var prev = doc.querySelectorAll('.sa-pv-target');
		for (var i = 0; i < prev.length; i++) prev[i].classList.remove('sa-pv-target');
		var target = entry.hash ? doc.getElementById(entry.hash) : null;
		if (!target) {
			/* not an element: a hash the page's own script routes (a tool) */
			if (entry.hash && !first) { try { win.location.hash = entry.hash; } catch (e) {} }
			else if (!entry.hash) win.scrollTo(0, 0);
			return;
		}
		var p = target.parentNode;
		while (p && p !== doc.body) {
			if (p.tagName === 'DETAILS' && !p.open) p.open = true;
			p = p.parentNode;
		}
		target.classList.add('sa-pv-target');
		function go() { win.scrollTo(0, Math.max(0, target.getBoundingClientRect().top + win.pageYOffset - 16)); }
		go();
		/* opened details and late fonts move things; settle once more */
		setTimeout(go, first ? 400 : 120);
	}

	function hidePreview() {
		clearTimeout(pvTimer);
		if (!preview || preview.hidden) return;
		preview.hidden = true;
		pvDoc = null;
		if (pvCard) pvCard.classList.remove('is-previewed');
		pvCard = null;
	}
"""

js = sub(js, """	/* ------------------------------------------------- deep links */
""", PREVIEW + """
	/* ------------------------------------------------- deep links */
""")

open(JS, 'wb').write(js.encode('utf-8'))

# ----------------------------------------------------------------- CSS
css = open(CSS, 'rb').read().decode('utf-8')
css += r"""
/* SA-07: the preview window beside the panel, desktop only (the script
   opens it only with a fine pointer and room to the left of the panel). */
.sa-preview {
	position: fixed;
	z-index: 1195;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	margin: 0;
	padding: 0;
	color: var(--sa-ink);
	background: var(--sa-surface);
	border: 1px solid var(--sa-line);
	border-radius: 0.8em;
	box-shadow: var(--sa-shadow);
	font-size: 0.78rem;
	line-height: 1.5;
	text-align: left;
	overflow: hidden;
}

.sa-preview[hidden] { display: none; }
.sa-preview button::after { display: none; }

.sa-pv-head {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.8em;
	padding: 0.5em 0.6em 0.5em 1em;
	background: var(--sa-accent);
	color: #ffffff;
}

.sa-pv-label {
	display: flex;
	align-items: baseline;
	gap: 0.6em;
	min-width: 0;
}

.sa-pv-label .sa-page { flex: 0 0 auto; white-space: nowrap; }

.sa-pv-title {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	font-weight: 700;
	font-size: 1.02em;
}

.sa-pv-actions {
	flex: 0 0 auto;
	display: flex;
	align-items: center;
	gap: 0.4em;
}

.sa-pv-btn {
	display: inline-block;
	padding: 0.35em 0.8em;
	font-weight: 600;
	font-size: 0.95em;
	line-height: 1.35;
	white-space: nowrap;
	color: #ffffff !important;
	background: transparent;
	border: 1px solid rgba(255, 255, 255, 0.55) !important;
	border-radius: 0.4em;
	text-decoration: none;
}

.sa-pv-btn.sa-pv-main { color: var(--sa-accent) !important; background: #ffffff; border-color: #ffffff !important; }
.sa-pv-btn:hover { background: rgba(255, 255, 255, 0.15); }
.sa-pv-btn.sa-pv-main:hover { background: #e7ebf3; }
.sa-pv-btn[hidden] { display: none; }
.sa-pv-btn:focus-visible { outline: 2px solid #ffffff; outline-offset: 2px; }

.sa-pv-body {
	position: relative;
	flex: 1 1 auto;
	min-height: 0;
	background: #ffffff;
}

/* frames not on show stay laid out (visibility, not display), so a page
   that scrolls itself on load, such as a tool opened by its hash, can */
.sa-preview-frame {
	visibility: hidden;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: 0;
	background: #ffffff;
}

.sa-preview-frame.is-on { visibility: visible; }

.sa-pv-loading {
	margin: 0;
	padding: 1.2em;
	color: var(--sa-ink-soft);
}

.sa-pv-loading[hidden] { display: none; }

.sa-card.is-previewed {
	margin: 0 -0.6em;
	padding-left: 0.6em;
	padding-right: 0.6em;
	background: var(--sa-surface-2);
	box-shadow: inset 3px 0 0 var(--sa-accent);
}
"""
open(CSS, 'wb').write(css.encode('utf-8'))

# ------------------------------------------------------------------ sw
sw = open(SW, 'rb').read().decode('utf-8')
sw = sub(sw, "var VERSION = 'v11';", "var VERSION = 'v12';")
open(SW, 'wb').write(sw.encode('utf-8'))

for p in (JS, CSS, SW):
    b = open(p, 'rb').read()
    print(os.path.relpath(p, root), len(b), hashlib.md5(b).hexdigest())
