# -*- coding: utf-8 -*-
"""Shared side contents, filter results box, jump bar and back-to-top for the
digest pages (EDPB, cookie). The AI Act digest carries its own copy of the same
mechanics in build_aia_page.py; this module generalises them with a class prefix.

Usage in a page builder:
    from digest_nav import toc_html, results_html, jump_html, nav_js, nav_css
    body = jump_html(P, [...]) + intro + filters(with results_html) + index
    body = '<div class="P-head">' + body + '</div>' + '<div class="P-cols">' + toc_html(...) + '<div class="P-main">' + groups + '</div></div>' + top_button(P)
The page's own filter script computes `shown`, `total`, `active` and calls
window.DigestNav.afterApply(shown, total, active, extraText); it registers
its reset function with window.DigestNav.onClear = fn. Every entry needs an id.
British spelling, no em dashes."""
import html, re
esc = lambda s: html.escape(str(s), quote=True)


def toc_item(P, eid, label, url, deep=False):
    """Compact item; the hover actions (open source, copy link) are added by the script on first hover."""
    return ('<div class="%s-toc-item"><a class="%s-toc-link%s" href="#%s" data-target="%s"%s>%s</a></div>'
            % (P, P, " %s-toc-deep" % P if deep else "", esc(eid), esc(eid), (' data-url="%s"' % esc(url)) if url else "", esc(label)))


def toc_collapsible(P, key, label, rng, title, body, cls="ch"):
    head = ('<span class="%s-toc-info"><span class="%s-toc-id"><span class="%s-toc-label%s">%s</span><span class="%s-toc-range">%s</span></span>%s</span>'
            % (P, P, P, (" %s-toc-seclabel" % P) if cls == "sec" else "", esc(label), P, esc(rng), ('<span class="%s-toc-title%s">%s</span>' % (P, (" %s-toc-sectitle" % P) if cls == "sec" else "", esc(title))) if title else ""))
    return ('<div class="%s-toc-block"><button type="button" class="%s-toc-%s" aria-expanded="false" aria-controls="%s-tsub-%s">%s<i class="fas fa-chevron-right %s-toc-arrow"></i></button>'
            '<div class="%s-toc-sub" id="%s-tsub-%s" hidden>%s</div></div>' % (P, P, cls, P, key, head, P, P, P, key, body))


def toc_html(P, blocks, views=("Groups", "All documents"), overview_href=None, overview_label="Overview", group_link="Jump to this group"):
    """blocks: list of dicts {key, label, range, title, group_id, items:[(id,label,url)], subs:[{key,label,range,title,items}]}.
    group_id is the id of the page group the block header links to (rendered as a small link under the header)."""
    out = ['<nav class="%s-toc" id="%s-toc" aria-label="Contents">' % (P, P)]
    out.append('<div class="%s-toc-head"><button type="button" class="%s-toc-search" id="%s-toc-search" title="Jump to search (Ctrl+K)"><i class="fas fa-search"></i><span>Search</span><kbd>Ctrl+K</kbd></button>'
               '<button type="button" class="%s-toc-close" id="%s-toc-close" aria-label="Close contents"><i class="fas fa-times"></i><span>Close</span></button></div>' % (P, P, P, P, P))
    if overview_href:
        out.append('<a class="%s-toc-overview is-active" id="%s-toc-overview-link" href="%s"><i class="fas fa-th-list"></i>%s</a>' % (P, P, esc(overview_href), esc(overview_label)))
    if views:
        out.append('<div class="%s-toc-views" role="group" aria-label="Contents view"><button type="button" class="%s-toc-view is-on" data-view="grouped" aria-pressed="true"><i class="fas fa-sitemap"></i>%s</button><button type="button" class="%s-toc-view" data-view="flat" aria-pressed="false"><i class="fas fa-list-ul"></i>%s</button></div>' % (P, P, esc(views[0]), P, esc(views[1])))
    out.append('<div class="%s-toc-items" id="%s-toc-grouped">' % (P, P))
    for b in blocks:
        body = []
        if b.get("group_id"):
            body.append('<div class="%s-toc-item"><a class="%s-toc-link %s-toc-group" href="#%s" data-target="%s">%s</a></div>' % (P, P, P, esc(b["group_id"]), esc(b["group_id"]), esc(group_link)))
        for sub in b.get("subs") or []:
            body.append(toc_collapsible(P, sub["key"], sub["label"], sub.get("range", ""), sub.get("title", ""), "".join(toc_item(P, i, l, u, True) for i, l, u in sub["items"]), cls="sec"))
        for i, l, u in b.get("items") or []:
            body.append(toc_item(P, i, l, u))
        out.append(toc_collapsible(P, b["key"], b["label"], b.get("range", ""), b.get("title", ""), "".join(body)))
    out.append('</div><div class="%s-toc-items" id="%s-toc-flat" hidden></div></nav>' % (P, P))
    return "".join(out)


def results_html(P, howto_items, noun="documents"):
    """Count line with the first-result and clear buttons, the results box and the explainer. Goes inside the filters box."""
    return ('<p class="%s-count" id="%s-count" aria-live="polite"><span id="%s-count-text"></span> <button type="button" class="%s-clear %s-first" id="%s-first" hidden>Go to first result</button> <button type="button" class="%s-clear" id="%s-clear" hidden>Clear filters</button></p>'
            '<div class="%s-results" id="%s-results" hidden><p class="%s-results-label" id="%s-results-label"></p><ol class="%s-results-list" id="%s-results-list"></ol></div>'
            '<details class="%s-howto"><summary>How the filters work</summary><ul>%s</ul></details>'
            % (P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, "".join("<li>%s</li>" % x for x in howto_items)))


def jump_html(P, items):
    """The on-this-page navigation. A horizontal bar until 20 September 2026, a floating
    dot rail at the right edge since. The name is kept so call sites do not have to change."""
    dots = "".join('<a href="%s" data-target="%s"><i aria-hidden="true"></i><span>%s</span></a>'
                   % (esc(h), esc(h.lstrip("#")), esc(t)) for h, t in items)
    return '<nav class="%s-rail" id="%s-rail" aria-label="On this page">%s</nav>' % (P, P, dots)


def top_button(P):
    return ('<div class="%s-step" id="%s-step" role="group" aria-label="Move through the matching entries" hidden>'
            '<button type="button" class="%s-step-btn" id="%s-prev" title="Previous matching entry" aria-label="Previous match"><i class="fas fa-chevron-up"></i><span>Prev</span></button>'
            '<span class="%s-step-n" id="%s-step-n">-</span>'
            '<button type="button" class="%s-step-btn" id="%s-next" title="Next matching entry" aria-label="Next match"><i class="fas fa-chevron-down"></i><span>Next</span></button></div>'
            '<div class="%s-toc-fold" id="%s-toc-fold" role="group" aria-label="Contents blocks" hidden>'
            '<button type="button" class="%s-toc-fold-btn" id="%s-expand" title="Expand all blocks in the contents" aria-label="Expand all"><i class="fas fa-angle-double-down"></i><span>Exp</span></button>'
            '<button type="button" class="%s-toc-fold-btn" id="%s-collapse" title="Collapse all blocks in the contents" aria-label="Collapse all"><i class="fas fa-angle-double-up"></i><span>Col</span></button></div>'
            '<button type="button" class="%s-top" id="%s-top" aria-label="Back to top" hidden><i class="fas fa-arrow-up"></i> Top</button>'
            '<div class="%s-toc-backdrop" id="%s-toc-backdrop" hidden></div><button type="button" class="%s-toc-fab" id="%s-toc-open" aria-controls="%s-toc" aria-expanded="false"><i class="fas fa-list"></i> Contents</button>' % (P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P, P))


_JS = r"""
(function () {
	var P = '__P__', noun = '__NOUN__', titleSel = '__TITLE__', extraTargets = '__EXTRA__';
	var $ = function (id) { return document.getElementById(P + '-' + id); };
	var q = $('q'), toc = $('toc'), grouped = $('toc-grouped'), flat = $('toc-flat'), opener = $('toc-open'), closer = $('toc-close'), backdrop = $('toc-backdrop');
	var count = $('count-text'), clearBtn = $('clear'), firstBtn = $('first'), results = $('results'), resultsLabel = $('results-label'), resultsList = $('results-list');
	var topBtn = $('top'), overviewLink = $('toc-overview-link');
	var entrySel = '.' + P + '-entry', groupSel = '.' + P + '-group';
	var nav = window.DigestNav = { onClear: null };

	nav.afterApply = function (shown, total, active, extra) {
		count.textContent = 'Showing ' + shown + ' of ' + total + ' ' + noun + '.' + (extra || '');
		clearBtn.hidden = !active;
		firstBtn.hidden = !(active && shown);
		stepShow(!!(active && shown));
		results.hidden = !(active && shown);
		if (active && shown) {
			var vis = Array.prototype.filter.call(document.querySelectorAll(entrySel), function (el) { return !el.hidden; });
			resultsLabel.textContent = shown <= 10 ? 'Matching entries:' : 'First 10 of ' + shown + ' matching entries:';
			resultsList.innerHTML = vis.slice(0, 10).map(function (el) {
				var t = el.querySelector(titleSel); var g = el.closest(groupSel); var gname = g ? g.querySelector('.' + P + '-group-name').textContent : '';
				var label = t ? t.textContent.trim() : el.id; if (titleSel === 'summary') label = label.replace(/^(\d+)\s+/, '$1. ');
				return '<li><a href="#' + el.id + '">' + label + '</a>' + (gname ? '<span class="' + P + '-results-group">' + gname + '</span>' : '') + '</li>';
			}).join('');
		}
		Array.prototype.forEach.call(toc.querySelectorAll('.' + P + '-toc-link[data-target]'), function (l) {
			var t = document.getElementById(l.getAttribute('data-target'));
			l.classList.toggle('is-hidden', !!(t && t.classList.contains(P + '-entry') && t.hidden));
		});
		Array.prototype.forEach.call(document.querySelectorAll('.' + P + '-part'), function (h) {
			var next = h.nextElementSibling, any = false;
			while (next && !next.classList.contains(P + '-part')) { if (next.classList.contains(P + '-group') && !next.hidden) any = true; next = next.nextElementSibling; }
			h.hidden = !any;
		});
	};
	function clearAll() { if (nav.onClear) nav.onClear(); }
	clearBtn.addEventListener('click', clearAll);
	firstBtn.addEventListener('click', function () {
		var first = document.querySelector(entrySel + ':not([hidden])');
		if (!first) return;
		var d = first.closest('details'); if (d && !d.open) d.open = true;
		first.scrollIntoView({ block: 'start' });
		history.replaceState(null, '', '#' + first.id);
	});

	/* side contents: flat view cloned from the grouped one */
	Array.prototype.forEach.call(grouped.querySelectorAll('.' + P + '-toc-item'), function (it) { if (!it.querySelector('.' + P + '-toc-group')) flat.appendChild(it.cloneNode(true)); });
	Array.prototype.forEach.call(flat.querySelectorAll('.' + P + '-toc-deep'), function (l) { l.classList.remove(P + '-toc-deep'); });
	var fold = $('toc-fold'), foldGrouped = true, foldMq = window.matchMedia('(max-width: 1100px)');
	function setView(v) {
		grouped.hidden = v !== 'grouped'; flat.hidden = v !== 'flat'; foldGrouped = v === 'grouped'; syncFold();
		Array.prototype.forEach.call(toc.querySelectorAll('.' + P + '-toc-view'), function (b) { var on = b.getAttribute('data-view') === v; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
		try { localStorage.setItem(P + '-toc-view', v); } catch (err) {}
	}
	Array.prototype.forEach.call(toc.querySelectorAll('.' + P + '-toc-view'), function (b) { b.addEventListener('click', function () { setView(b.getAttribute('data-view')); }); });
	try { if (toc.querySelector('.' + P + '-toc-view') && localStorage.getItem(P + '-toc-view') === 'flat') setView('flat'); } catch (err) {}
	function setOpen(btn, open) {
		btn.setAttribute('aria-expanded', open ? 'true' : 'false');
		var sub = document.getElementById(btn.getAttribute('aria-controls')); if (sub) sub.hidden = !open;
	}
	function addActions(item) {
		if (!item || item.querySelector('.' + P + '-toc-actions')) return;
		var l = item.querySelector('.' + P + '-toc-link[data-target]'); if (!l || l.classList.contains(P + '-toc-group')) return;
		var span = document.createElement('span'); span.className = P + '-toc-actions';
		span.innerHTML = (l.getAttribute('data-url') ? '<a href="' + l.getAttribute('data-url') + '" target="_blank" rel="noopener noreferrer" title="Open the source"><i class="fas fa-external-link-alt"></i></a>' : '')
			+ '<button type="button" class="' + P + '-toc-copy" data-anchor="' + l.getAttribute('data-target') + '" title="Copy link to this entry"><i class="fas fa-link"></i></button>';
		item.appendChild(span);
	}
	toc.addEventListener('mouseover', function (e) { addActions(e.target.closest && e.target.closest('.' + P + '-toc-item')); });
	toc.addEventListener('focusin', function (e) { addActions(e.target.closest && e.target.closest('.' + P + '-toc-item')); });
	toc.addEventListener('click', function (e) {
		var btn = e.target.closest && e.target.closest('.' + P + '-toc-ch, .' + P + '-toc-sec');
		if (btn) { setOpen(btn, btn.getAttribute('aria-expanded') !== 'true'); return; }
		var cp = e.target.closest && e.target.closest('.' + P + '-toc-copy');
		if (cp) {
			var url = location.href.split('#')[0] + '#' + cp.getAttribute('data-anchor');
			var done = function () { cp.classList.add('is-done'); cp.title = 'Copied'; setTimeout(function () { cp.classList.remove('is-done'); cp.title = 'Copy link to this entry'; }, 1500); };
			if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link', url); });
			else window.prompt('Copy this link', url);
			return;
		}
		var link = e.target.closest && e.target.closest('.' + P + '-toc-link, .' + P + '-toc-overview');
		if (link) {
			var id = link.getAttribute('data-target') || link.getAttribute('href').slice(1), t = document.getElementById(id);
			if (t && t.classList.contains(P + '-entry') && t.hidden) clearAll();
			if (t) { var d = t.closest('details'); if (d && !d.open) d.open = true; }
			closeDrawer();
		}
	});
	function openDrawer() { toc.classList.add('is-open'); document.body.classList.add(P + '-toc-drawer'); opener.setAttribute('aria-expanded', 'true'); backdrop.hidden = false; }
	function closeDrawer() { toc.classList.remove('is-open'); document.body.classList.remove(P + '-toc-drawer'); opener.setAttribute('aria-expanded', 'false'); backdrop.hidden = true; }
	opener.addEventListener('click', function () { if (toc.classList.contains('is-open')) closeDrawer(); else openDrawer(); });
	closer.addEventListener('click', closeDrawer);
	backdrop.addEventListener('click', closeDrawer);
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeDrawer();
		if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); closeDrawer(); q.focus(); q.select(); q.scrollIntoView({ block: 'center' }); }
	});
	$('toc-search').addEventListener('click', function () { closeDrawer(); q.focus(); q.scrollIntoView({ block: 'center' }); });

	/* any in-page link outside the contents opens its target group first */
	document.addEventListener('click', function (e) {
		var a = e.target.closest && e.target.closest('a[href^="#"]');
		if (!a || toc.contains(a)) return;
		var t = document.getElementById(a.getAttribute('href').slice(1));
		if (!t) return;
		if (t.classList.contains(P + '-entry') && t.hidden) clearAll();
		var d = t.tagName === 'DETAILS' ? t : t.closest('details');
		if (d && !d.open) d.open = true;
		if (t.classList.contains(P + '-group')) setTimeout(function () { mark(t.id); }, 50);
	});

	/* back to top */
	topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
	window.addEventListener('scroll', function () { topBtn.hidden = window.scrollY < 600; }, { passive: true });

	/* expand or collapse every block in the contents: two small floating buttons at the bottom left,
	   shown once the contents has scrolled into the upper half of the screen (in the drawer: whenever it is open) */
	function setAll(open) {
		Array.prototype.forEach.call(toc.querySelectorAll('.' + P + '-toc-ch, .' + P + '-toc-sec'), function (b) { setOpen(b, open); });
		if (!open) toc.scrollTop = 0;
	}
	function syncFold() { fold.hidden = !foldGrouped || (!foldMq.matches && toc.getBoundingClientRect().top > window.innerHeight * 0.5); }
	$('expand').addEventListener('click', function () { setAll(true); });
	$('collapse').addEventListener('click', function () { setAll(false); });
	window.addEventListener('scroll', syncFold, { passive: true });
	window.addEventListener('resize', syncFold);
	syncFold();

	/* step through the entries the filter is showing: Prev and Next at the bottom left,
	   beside the contents control, with the position of the entry you are on between them.
	   That entry is the last match whose top has passed the reading line, the same rule the
	   side contents highlights by, so Next always moves one match further down the page. */
	var step = $('step'), stepN = $('step-n'), stepMatches = [], stepTick = false;
	function stepIndex() {
		var line = window.innerHeight * 0.3, idx = -1;
		for (var i = 0; i < stepMatches.length; i++) { if (stepMatches[i].getBoundingClientRect().top <= line + 8) idx = i; else break; }
		return idx;
	}
	function stepSync() {
		if (step.hidden) return;
		var i = stepIndex();
		stepN.textContent = (i < 0 ? '-' : i + 1) + '/' + stepMatches.length;
		step.title = (i < 0 ? 'Before the first of ' : 'Entry ' + (i + 1) + ' of ') + stepMatches.length + ' matching';
	}
	function stepShow(on) {
		stepMatches = on ? Array.prototype.filter.call(document.querySelectorAll(entrySel), function (el) { return !el.hidden; }) : [];
		step.hidden = !on;
		stepSync();
	}
	function stepGo(d) {
		if (!stepMatches.length) return;
		var i = Math.max(0, Math.min(stepMatches.length - 1, stepIndex() + d));
		var el = stepMatches[i], dt = el.closest('details');
		if (dt && !dt.open) dt.open = true;
		el.scrollIntoView({ block: 'start' });
		history.replaceState(null, '', '#' + el.id);
		setTimeout(stepSync, 80);
	}
	$('prev').addEventListener('click', function () { stepGo(-1); });
	$('next').addEventListener('click', function () { stepGo(1); });
	window.addEventListener('scroll', function () {
		if (stepTick) return;
		stepTick = true;
		window.requestAnimationFrame(function () { stepTick = false; stepSync(); });
	}, { passive: true });

	/* on this page: a column of dots at the right edge, labels on hover. The dot that
	   lights up is the last section whose top has passed the reading line, the same rule
	   the side contents highlights by. Queried by its aria-label rather than by id,
	   because the AI Act builder's own copy of this script has no $ helper. */
	var rail = document.querySelector('nav[aria-label="On this page"]');
	if (rail) {
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
		window.addEventListener('scroll', function () {
			if (railTick) return;
			railTick = true;
			window.requestAnimationFrame(function () { railTick = false; railSync(); });
		}, { passive: true });
		window.addEventListener('resize', railSync);
		railSync();
	}

	/* scrollspy */
	var links = {};
	Array.prototype.forEach.call(toc.querySelectorAll('.' + P + '-toc-link[data-target]'), function (l) { var k = l.getAttribute('data-target'); (links[k] = links[k] || []).push(l); });
	var current = null;
	function mark(id) {
		if (id === current) return;
		if (current && links[current]) links[current].forEach(function (l) { l.classList.remove('is-active'); });
		current = id;
		if (overviewLink) overviewLink.classList.toggle('is-active', !id);
		if (!id || !links[id]) return;
		links[id].forEach(function (l) {
			l.classList.add('is-active');
			var p = l.parentNode;
			while (p && p !== toc) { if (p.classList.contains(P + '-toc-sub') && p.hidden) { var b = toc.querySelector('[aria-controls="' + p.id + '"]'); if (b) setOpen(b, true); } p = p.parentNode; }
		});
		if (!toc.classList.contains('is-open')) {
			var vis = links[id].filter(function (l) { return l.offsetParent !== null; })[0];
			if (vis) { var r = vis.getBoundingClientRect(), tr = toc.getBoundingClientRect(); if (r.top < tr.top + 40 || r.bottom > tr.bottom - 40) toc.scrollTop += r.top - tr.top - tr.height / 2; }
		}
	}
	nav.mark = mark;
	if ('IntersectionObserver' in window) {
		var targets = Array.prototype.slice.call(document.querySelectorAll(entrySel + ', ' + groupSel + '[id]' + (extraTargets ? ', ' + extraTargets : '')));
		var io = new IntersectionObserver(function () {
			var top = window.innerHeight * 0.28, best = null, bestD = Infinity;
			targets.forEach(function (t) {
				var dd = t.classList.contains(P + '-group') ? null : t.closest('details');
				if (t.hidden || (dd && dd !== t && !dd.open) || (dd && dd.hidden)) return;
				var r = t.getBoundingClientRect();
				if (r.bottom < 0 || r.top > window.innerHeight) return;
				var d = Math.abs(r.top - top);
				if (r.top <= top + 8 && r.bottom > top && d < bestD) { best = t; bestD = d; }
			});
			if (best) mark(best.id);
			else if (window.scrollY < 300) mark(null);
		}, { threshold: [0, 0.1, 0.5, 1] });
		targets.forEach(function (t) { io.observe(t); });
	}
})();
"""


def nav_js(P, noun="documents", title_sel=None, extra_targets=""):
    return _JS.replace("__P__", P).replace("__NOUN__", noun).replace("__TITLE__", title_sel or (".%s-title a" % P)).replace("__EXTRA__", extra_targets)


_CSS = """
/* Layout: full-width head band, then side contents plus entries. */
#__SECTION__ { max-width: none; margin: 0; }
.ai-head { max-width: none; }
.ai-main { min-width: 0; }
@media (min-width: 1101px) {
	.ai-cols { display: grid; grid-template-columns: 19em minmax(0, 1fr); gap: 0 2.5em; align-items: start; margin-top: 1.5em; }
	.ai-toc { position: sticky; top: 5em; max-height: calc(100vh - 6em); overflow-y: auto; overscroll-behavior: contain; }
	.ai-toc-fab, .ai-toc-close, .ai-toc-backdrop { display: none; }
}
.ai-rail { position: fixed; right: 0.85em; top: 50%; transform: translateY(-50%); z-index: 1150; display: flex; flex-direction: column; gap: 0.1em; padding: 0.55em 0.5em; border-radius: 1.5em; border: solid 1px rgba(255,255,255,0.12); background: rgba(13,20,30,0.78); box-shadow: 0 0.3em 1em rgba(0,0,0,0.35); opacity: 0.5; transition: opacity 0.18s ease; }
.ai-rail:hover, .ai-rail:focus-within { opacity: 1; }
.ai-rail[hidden] { display: none; }
.ai-rail a { display: flex; align-items: center; gap: 0.7em; height: 1.45em; padding: 0 0.3em; border: 0; border-radius: 0.8em; color: rgba(255,255,255,0.8); text-decoration: none; white-space: nowrap; }
.ai-rail a i { flex: 0 0 auto; width: 0.42em; height: 0.42em; border-radius: 50%; background: rgba(255,255,255,0.4); transition: background 0.15s ease, width 0.15s ease, height 0.15s ease; }
.ai-rail a span { max-width: 0; overflow: hidden; opacity: 0; font-size: 0.8em; letter-spacing: 0.01em; transition: max-width 0.24s ease, opacity 0.18s ease; }
.ai-rail:hover a span, .ai-rail:focus-within a span { max-width: 26em; opacity: 1; }
.ai-rail a:hover, .ai-rail a:focus-visible { color: #fff; background: rgba(127,178,229,0.12); }
.ai-rail a:hover i, .ai-rail a:focus-visible i { background: #7fb2e5; }
.ai-rail a.is-on { color: #fff; }
.ai-rail a.is-on i { background: #7fb2e5; width: 0.62em; height: 0.62em; }
@media (max-width: 980px) { .ai-rail { display: none; } }
.ai-top { position: fixed; right: 1.25em; bottom: 1.25em; z-index: 1050; height: auto; line-height: 1.4; padding: 0.6em 1em; font-size: 0.8em; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 2em; background: rgba(66,103,166,0.95); border: 0 !important; box-shadow: 0 0.3em 1em rgba(0,0,0,0.4); white-space: nowrap; }
.ai-top::after { display: none; }
.ai-top[hidden] { display: none; }
.ai-toc-fold { position: fixed; left: 0.6em; bottom: 1.25em; z-index: 1150; display: flex; flex-direction: column; border-radius: 1.1em; overflow: hidden; box-shadow: 0 0.3em 1em rgba(0,0,0,0.4); }
.ai-toc-fold[hidden] { display: none; }
.ai-toc-fold-btn { display: flex !important; flex-direction: column; align-items: center; justify-content: center; gap: 0.2em; width: 2.6em; height: auto; line-height: 1; padding: 0.55em 0 0.5em 0; font-size: 1em; letter-spacing: 0; background: rgba(66,103,166,0.95); border: 0 !important; border-radius: 0 !important; box-shadow: none !important; white-space: nowrap; }
.ai-toc-fold-btn i { font-size: 0.9em; }
.ai-toc-fold-btn span { font-size: 0.5em; letter-spacing: 0.1em; text-transform: uppercase; }
.ai-toc-fold-btn + .ai-toc-fold-btn { border-top: solid 1px rgba(255,255,255,0.3) !important; }
.ai-toc-fold-btn:hover, .ai-toc-fold-btn:focus { background: #4267a6; color: #fff !important; }
.ai-toc-fold-btn::after { display: none; }
.ai-step { position: fixed; left: 3.6em; bottom: 1.25em; z-index: 1150; display: flex; flex-direction: column; border-radius: 1.1em; overflow: hidden; box-shadow: 0 0.3em 1em rgba(0,0,0,0.4); }
.ai-step[hidden] { display: none; }
.ai-step-btn { display: flex !important; flex-direction: column; align-items: center; justify-content: center; gap: 0.2em; min-width: 2.6em; width: auto; max-width: none; height: auto; line-height: 1; padding: 0.55em 0.35em 0.5em 0.35em; font-size: 1em; letter-spacing: 0; background: rgba(66,103,166,0.95); border: 0 !important; border-radius: 0 !important; box-shadow: none !important; white-space: nowrap; }
.ai-step-btn i { font-size: 0.9em; }
.ai-step-btn span { font-size: 0.5em; letter-spacing: 0.1em; text-transform: uppercase; }
.ai-step-btn:hover, .ai-step-btn:focus { background: #4267a6; color: #fff !important; }
.ai-step-btn::after { display: none; }
.ai-step-n { display: block; padding: 0.35em 0.4em; font-size: 0.55em; line-height: 1; letter-spacing: 0.05em; text-align: center; white-space: nowrap; color: #fff; background: #2a3860; border-top: solid 1px rgba(255,255,255,0.3); border-bottom: solid 1px rgba(255,255,255,0.3); }
.ai-part { font-size: 1.1em; margin: 1.5em 0 0.25em 0; text-transform: none; letter-spacing: 0; color: #fff; }
.ai-part[hidden] { display: none; }
.ai-groups > .ai-part:first-child { margin-top: 0; }
#ai-filters, .ai-part, .ai-group, .ai-entry { scroll-margin-top: 5em; }
.ai-entry:target { box-shadow: inset 3px 0 0 #7fb2e5; }
.ai-entry[hidden] { display: none; }

/* Count line, results box, explainer */
.ai-count { grid-column: 1 / -1; margin: 0; font-size: 0.9em; color: #7fb2e5; display: flex; flex-wrap: wrap; gap: 0.5em 1em; align-items: center; }
.ai-clear { height: auto; line-height: 1.4; padding: 0.2em 0.9em; font-size: 0.8em; letter-spacing: 0.05em; border-radius: 1em; }
.ai-clear[hidden] { display: none; }
.ai-first { background: #4267a6; border-color: #4267a6 !important; }
.ai-results { grid-column: 1 / -1; margin: 0; padding: 0.75em 1em; border: solid 1px rgba(127,178,229,0.35); border-radius: 0.4em; background: rgba(127,178,229,0.06); }
.ai-results[hidden] { display: none; }
.ai-results-label { margin: 0 0 0.4em 0; font-size: 0.8em; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.55); }
.ai-results-list { margin: 0; padding-left: 1.5em; columns: 2; column-gap: 2em; font-size: 0.9em; }
.ai-results-list li { margin: 0 0 0.25em 0; break-inside: avoid; }
.ai-results-list a { color: #fff; border-bottom: dotted 1px rgba(255,255,255,0.3); }
.ai-results-list a:hover { color: #7fb2e5; border-bottom-color: #7fb2e5; }
.ai-results-group { display: block; font-size: 0.8em; color: rgba(255,255,255,0.45); }
.ai-howto { grid-column: 1 / -1; margin: 0; font-size: 0.85em; }
.ai-howto summary { cursor: pointer; color: #7fb2e5; list-style: none; }
.ai-howto summary::-webkit-details-marker { display: none; }
.ai-howto summary::before { content: '\\f105'; font-family: 'Font Awesome 5 Free'; font-weight: 900; margin-right: 0.5em; display: inline-block; transition: transform 0.15s ease; }
.ai-howto[open] summary::before { transform: rotate(90deg); }
.ai-howto ul { margin: 0.75em 0 0 0; padding-left: 1.25em; }
.ai-howto li { margin-bottom: 0.4em; color: rgba(255,255,255,0.7); line-height: 1.5; }
.ai-howto strong { color: #fff; }

/* Side contents */
.ai-toc { font-size: 0.85em; border: solid 1px rgba(255,255,255,0.12); border-radius: 0.5em; background: rgba(255,255,255,0.03); padding: 0.75em 0 1em 0; scrollbar-width: thin; }
.ai-toc button {
	height: auto; line-height: 1.35; padding: 0; margin: 0; font-size: 1em; font-weight: normal; letter-spacing: 0; text-transform: none;
	white-space: normal; text-align: left; border: 0 !important; border-radius: 0; box-shadow: none; background: none; color: rgba(255,255,255,0.8) !important;
}
.ai-toc button::after { display: none; }
.ai-toc-head { display: flex; gap: 0.5em; padding: 0 0.75em 0.6em 0.75em; }
.ai-toc-search {
	flex: 1; display: flex !important; align-items: center; gap: 0.6em; padding: 0.55em 0.8em !important;
	border: solid 1px rgba(255,255,255,0.15) !important; border-radius: 0.4em !important; color: rgba(255,255,255,0.6) !important; background: rgba(255,255,255,0.04) !important;
}
.ai-toc-search:hover { border-color: rgba(127,178,229,0.6) !important; color: #fff !important; }
.ai-toc-search span { flex: 1; }
.ai-toc-search kbd { font-family: inherit; font-size: 0.75em; padding: 0.1em 0.45em; border: solid 1px rgba(255,255,255,0.2); border-radius: 0.3em; color: rgba(255,255,255,0.5); }
.ai-toc-close { padding: 0.4em 0.7em !important; border: solid 1px rgba(255,255,255,0.15) !important; border-radius: 0.4em !important; }
.ai-toc-overview { display: flex; align-items: center; gap: 0.6em; margin: 0 0.75em; padding: 0.5em 0.8em; border-radius: 0.4em; color: rgba(255,255,255,0.85); border-bottom: none; font-weight: bold; }
.ai-toc-overview:hover { background: rgba(255,255,255,0.05); color: #fff; }
.ai-toc-overview.is-active { background: rgba(127,178,229,0.15); color: #fff; }
.ai-toc-views { display: flex; margin: 0.6em 0.75em 0.5em 0.75em; border: solid 1px rgba(255,255,255,0.15); border-radius: 0.4em; overflow: hidden; }
.ai-toc-view { flex: 1; display: flex !important; align-items: center; justify-content: center; gap: 0.5em; padding: 0.45em 0.5em !important; color: rgba(255,255,255,0.6) !important; }
.ai-toc-view + .ai-toc-view { border-left: solid 1px rgba(255,255,255,0.15) !important; }
.ai-toc-view.is-on { background: rgba(127,178,229,0.18); color: #fff !important; }
.ai-toc-items { padding: 0 0.35em; }
.ai-toc-items[hidden] { display: none; }
.ai-toc-block { margin: 0.1em 0; }
.ai-toc-ch, .ai-toc-sec { display: flex !important; width: 100%; align-items: center; gap: 0.5em; padding: 0.5em 0.6em !important; border-radius: 0.4em !important; }
.ai-toc-ch:hover, .ai-toc-sec:hover { background: rgba(255,255,255,0.05); color: #fff !important; }
.ai-toc-sec { padding-left: 1.1em !important; }
.ai-toc-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 0.1em; }
.ai-toc-id { display: flex; justify-content: space-between; gap: 0.5em; align-items: baseline; }
.ai-toc-label { font-weight: bold; color: #fff; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.08em; }
.ai-toc-seclabel { color: rgba(255,255,255,0.7); text-transform: none; letter-spacing: 0; }
.ai-toc-range { font-size: 0.8em; color: #7fb2e5; white-space: nowrap; }
.ai-toc-title { font-size: 0.92em; color: rgba(255,255,255,0.65); line-height: 1.3; }
.ai-toc-arrow { flex: none; font-size: 0.75em; color: rgba(255,255,255,0.4); transition: transform 0.15s ease; }
[aria-expanded="true"] > .ai-toc-arrow { transform: rotate(90deg); }
.ai-toc-sub { padding: 0.1em 0 0.3em 0.6em; }
.ai-toc-sub[hidden] { display: none; }
.ai-toc-sub .ai-toc-sub { padding-left: 0.9em; }
.ai-toc-item { display: flex; align-items: flex-start; gap: 0.3em; }
.ai-toc-item:hover { background: rgba(255,255,255,0.04); border-radius: 0.3em; }
.ai-toc-link { flex: 1; min-width: 0; display: block; padding: 0.3em 0.5em; color: rgba(255,255,255,0.72); border-bottom: none; font-size: 0.92em; line-height: 1.35; border-left: solid 2px transparent; border-radius: 0.3em; }
.ai-toc-link:hover { color: #fff; }
.ai-toc-link.is-active { color: #fff; border-left-color: #7fb2e5; background: rgba(127,178,229,0.12); }
.ai-toc-link.is-hidden { color: rgba(255,255,255,0.3); }
.ai-toc-link.is-hidden::after { content: ' (filtered out)'; font-size: 0.8em; }
.ai-toc-group { font-weight: bold; color: #7fb2e5; }
.ai-toc-actions { flex: none; display: none; gap: 0.1em; padding-top: 0.25em; }
.ai-toc-item:hover .ai-toc-actions, .ai-toc-item:focus-within .ai-toc-actions { display: flex; }
.ai-toc-actions a, .ai-toc-actions button { padding: 0.15em 0.35em !important; color: rgba(255,255,255,0.45) !important; border-bottom: none; font-size: 0.85em; border-radius: 0.3em !important; }
.ai-toc-actions a:hover, .ai-toc-actions button:hover { color: #fff !important; background: rgba(255,255,255,0.08); }
.ai-toc-copy.is-done { color: #9fe0a8 !important; }
#ai-toc-flat .ai-toc-link { font-size: 0.88em; }

/* Mobile drawer and floating buttons, below 1101px */
@media (max-width: 1100px) {
	.ai-toc { position: fixed; top: 0; left: 0; bottom: 0; width: min(22em, 88vw); z-index: 1100; border-radius: 0; overflow-y: auto; transform: translateX(-105%); transition: transform 0.2s ease; background: #24304f; box-shadow: 0 0 2em rgba(0,0,0,0.5); padding-top: 1em; }
	.ai-toc.is-open { transform: none; }
	body.ai-toc-drawer { overflow: hidden; }
	.ai-toc-backdrop { position: fixed; inset: 0; z-index: 1090; background: rgba(0,0,0,0.45); }
	.ai-toc-backdrop[hidden] { display: none; }
	.ai-toc-close { display: inline-flex !important; align-items: center; gap: 0.4em; }
	.ai-top { bottom: 4.6em; }
	.ai-toc-fold { display: none; }
	body.ai-toc-drawer .ai-toc-fold { display: flex; }
	body.ai-toc-drawer .ai-toc-fold[hidden] { display: none; }
	.ai-step { left: 0.6em; }
	body.ai-toc-drawer .ai-step { display: none; }
	#ai-toc-grouped { padding-bottom: 5em; }
	.ai-toc-fab {
		position: fixed; right: 1.25em; bottom: 1.25em; z-index: 1050; height: auto; line-height: 1.4; padding: 0.7em 1.2em; font-size: 0.85em;
		letter-spacing: 0.05em; text-transform: uppercase; border-radius: 2em; background: #4267a6; border: 0 !important; box-shadow: 0 0.3em 1em rgba(0,0,0,0.4); white-space: nowrap;
	}
	.ai-toc-fab::after { display: none; }
}
@media (max-width: 736px) { .ai-results-list { columns: 1; } }
"""


def nav_css(P, section_id):
    return _CSS.replace("__SECTION__", section_id).replace(".ai-", ".%s-" % P).replace("#ai-", "#%s-" % P).replace("body.ai-", "body.%s-" % P)
