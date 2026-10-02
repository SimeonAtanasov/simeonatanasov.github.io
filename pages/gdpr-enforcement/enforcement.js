/* GDPR Enforcement in Europe: map views, country filters, expand and collapse,
   deep links to a country, and the on-this-page rail (same behaviour as the fine
   calculator's). No state is stored and nothing leaves the browser. */
(function () {
	var wrap = document.querySelector('.ge-mapwrap');
	var tiles = Array.prototype.slice.call(document.querySelectorAll('.ge-tile[data-code]'));
	var legends = Array.prototype.slice.call(document.querySelectorAll('.ge-legend'));
	/* each tile carries its colours per view (data-<view>-bg / -fg), so one script serves
	   both the European and the worldwide page */
	var paint = function (view) {
		if (wrap) wrap.setAttribute('data-view', view);
		tiles.forEach(function (t) {
			t.querySelector('rect').setAttribute('fill', t.getAttribute('data-' + view + '-bg') || '#5c6684');
			t.querySelector('text').setAttribute('fill', t.getAttribute('data-' + view + '-fg') || '#ffffff');
		});
		legends.forEach(function (l) { l.hidden = l.getAttribute('data-view') !== view; });
	};
	Array.prototype.slice.call(document.querySelectorAll('#ge-map .ge-btn[data-view]')).forEach(function (b, i, all) {
		b.addEventListener('click', function () {
			all.forEach(function (x) { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
			paint(b.getAttribute('data-view'));
		});
		b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
	});
	paint('model');

	var cards = Array.prototype.slice.call(document.querySelectorAll('.ge-country'));
	var openCountry = function (id) {
		var el = document.getElementById(id);
		if (!el || !el.classList.contains('ge-country')) return false;
		if (el.style.display === 'none') { setMem('all'); q.value = ''; filter(); }
		el.open = true;
		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
		return true;
	};
	document.addEventListener('click', function (ev) {
		var a = ev.target.closest ? ev.target.closest('a[href^="#ge-c-"]') : null;
		if (!a) return;
		ev.preventDefault();
		var id = a.getAttribute('href').slice(1);
		if (openCountry(id) && history.replaceState) history.replaceState(null, '', '#' + id);
	});

	var q = document.getElementById('ge-q'), count = document.getElementById('ge-count'), mem = 'all';
	var memBtns = Array.prototype.slice.call(document.querySelectorAll('.ge-mem'));
	var setMem = function (m) {
		mem = m;
		memBtns.forEach(function (x) { var on = x.getAttribute('data-mem') === m; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', on ? 'true' : 'false'); });
	};
	var filter = function () {
		var term = (q && q.value || '').trim().toLowerCase(), shown = 0;
		cards.forEach(function (c) {
			var ok = (mem === 'all' || c.getAttribute('data-mem') === mem) && (!term || c.getAttribute('data-search').indexOf(term) !== -1);
			c.style.display = ok ? '' : 'none';
			if (ok) shown++;
		});
		if (count) count.textContent = shown === cards.length ? 'Showing all ' + shown + ' countries.' : 'Showing ' + shown + ' of ' + cards.length + ' countries.';
	};
	memBtns.forEach(function (b) { b.addEventListener('click', function () { setMem(b.getAttribute('data-mem')); filter(); }); });
	if (q) q.addEventListener('input', filter);
	setMem('all');
	filter();
	var setAll = function (open) { cards.forEach(function (c) { if (c.style.display !== 'none') c.open = open; }); };
	var bo = document.getElementById('ge-open'), bc = document.getElementById('ge-close');
	if (bo) bo.addEventListener('click', function () { setAll(true); });
	if (bc) bc.addEventListener('click', function () { setAll(false); });
	if (location.hash && location.hash.indexOf('#ge-c-') === 0) {
		window.addEventListener('load', function () { openCountry(location.hash.slice(1)); });
	}
})();

(function () {
	/* on this page: a column of dots at the right edge, labels on hover. The dot that
	   lights up is the last section whose top has passed the reading line. Where there
	   is no hover, a small handle above the dots opens the labels. */
	var rail = document.querySelector('nav[aria-label="On this page"]');
	if (!rail) return;
	var railLinks = Array.prototype.slice.call(rail.querySelectorAll('a[data-target]')), railOn = null, railTick = false;
	var railSync = function () {
		var line = window.innerHeight * 0.3, best = null;
		railLinks.forEach(function (a) {
			var t = document.getElementById(a.getAttribute('data-target'));
			if (!t || t.hidden) return;
			if (t.getBoundingClientRect().top <= line + 8) best = a;
		});
		if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) best = railLinks[railLinks.length - 1];
		if (best === railOn) return;
		if (railOn) railOn.classList.remove('is-on');
		railOn = best;
		if (railOn) railOn.classList.add('is-on');
	};
	var railHover = window.matchMedia('(hover: hover)');
	var railKnob = document.createElement('span');
	railKnob.className = 'rail-knob';
	railKnob.setAttribute('aria-hidden', 'true');
	railKnob.title = 'Show section names';
	railKnob.style.cssText = 'align-items: center; height: 1.9em; padding: 0 0.2em; border-radius: 0.6em; color: rgba(255,255,255,0.9); font-size: 1.1em; font-weight: bold; line-height: 1; cursor: pointer; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent;';
	rail.insertBefore(railKnob, rail.firstChild);
	var railStyle = document.createElement('style');
	railStyle.textContent = ['@media (hover: none) {',
		'nav[aria-label="On this page"]:not(.is-open):not(:focus-within) { border-color: transparent; background: transparent; box-shadow: none; }',
		'nav[aria-label="On this page"]:not(.is-open):not(:focus-within) a span { max-width: 0; opacity: 0; }',
		'nav[aria-label="On this page"]:not(.is-open):not(:focus-within) a:not(.is-on) i { background: rgba(255,255,255,0.35); }',
		'nav[aria-label="On this page"] a:hover { background: transparent; }',
		'}'].join(' ');
	document.head.appendChild(railStyle);
	var railOpen = function (open) {
		rail.classList.toggle('is-open', open);
		railKnob.textContent = String.fromCharCode(open ? 8250 : 8249);
	};
	var railKnobShow = function () {
		railKnob.style.display = railHover.matches ? 'none' : 'flex';
		if (railHover.matches) railOpen(false);
	};
	if (railHover.addEventListener) railHover.addEventListener('change', railKnobShow);
	railOpen(false);
	railKnobShow();
	rail.addEventListener('click', function (e) {
		if (e.target === railKnob) { railOpen(!rail.classList.contains('is-open')); return; }
		var link = e.target.closest ? e.target.closest('a') : null;
		if (!link) return;
		if (!railHover.matches) link.blur();
	});
	document.addEventListener('click', function (e) { if (!rail.contains(e.target)) railOpen(false); });
	window.addEventListener('scroll', function () {
		if (railTick) return;
		railTick = true;
		window.requestAnimationFrame(function () { railTick = false; railSync(); });
	}, { passive: true });
	window.addEventListener('resize', railSync);
	railSync();
})();
