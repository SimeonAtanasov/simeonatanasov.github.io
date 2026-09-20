# -*- coding: utf-8 -*-
"""Replace the horizontal "On this page" bar with a floating dot rail at the right edge.

The bar wrapped to two or three lines, pushed the intro down and was reachable only at
the top of the page. The rail is a column of small dots, one per section, fixed at the
right edge and vertically centred, only as tall as its own dots. Hovering it slides the
section names out; the dot of the section you are in is filled and larger. Below 980px
it is hidden, where the Contents drawer already covers navigation.

Usage:
  python3 rail_patch.py navmod <digest_nav.py>            the shared module
  python3 rail_patch.py aiabuild <build_aia_page.py>      the AI Act builder's inline copy
  python3 rail_patch.py page <html> <css> <prefix>        a shipped page and its stylesheet
  python3 rail_patch.py slim <file> <prefix>              upgrade v1 rail CSS to v2 in place

Order: patch the module and the builder first, rebuild the three digests from their
builders, then patch the two advice pages, which are not regenerated from a builder.

Every edit asserts its anchor occurs exactly once, so a rerun on a patched file fails
loudly rather than doubling the markup. No em dashes. LF only.
"""
import re
import sys

# ---------------------------------------------------------------- the rail itself

JUMP_OLD = ('def jump_html(P, items):\n'
            '    return \'<nav class="%s-jump" aria-label="On this page"><span class="%s-jump-label">On this page</span>%s</nav>\''
            ' % (P, P, "".join(\'<a href="%s">%s</a>\' % (esc(h), esc(t)) for h, t in items))\n')

JUMP_NEW = ('def jump_html(P, items):\n'
            '    """The on-this-page navigation. A horizontal bar until 20 September 2026, a floating\n'
            '    dot rail at the right edge since. The name is kept so call sites do not have to change."""\n'
            '    dots = "".join(\'<a href="%s" data-target="%s"><i aria-hidden="true"></i><span>%s</span></a>\'\n'
            '                   % (esc(h), esc(h.lstrip("#")), esc(t)) for h, t in items)\n'
            '    return \'<nav class="%s-rail" id="%s-rail" aria-label="On this page">%s</nav>\' % (P, P, dots)\n')


def rail_markup(P, items):
    dots = "".join('<a href="%s" data-target="%s"><i aria-hidden="true"></i><span>%s</span></a>'
                   % (h, h.lstrip("#"), t) for h, t in items)
    return '<nav class="%s-rail" id="%s-rail" aria-label="On this page">%s</nav>' % (P, P, dots)


# ---------------------------------------------------------------- CSS

CSS_OLD = ('.ai-jump { display: flex; flex-wrap: wrap; gap: 0.4em 0.6em; align-items: center; margin: 0 0 1.5em 0; '
           'padding: 0.75em 1em; border: solid 1px rgba(255,255,255,0.1); border-radius: 0.5em; '
           'background: rgba(255,255,255,0.02); font-size: 0.85em; }\n'
           '.ai-jump-label { text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85em; '
           'color: rgba(255,255,255,0.5); margin-right: 0.4em; }\n'
           '.ai-jump a { display: inline-block; padding: 0.25em 0.8em; border: solid 1px rgba(255,255,255,0.15); '
           'border-radius: 1em; color: rgba(255,255,255,0.85); border-bottom: solid 1px rgba(255,255,255,0.15); }\n'
           '.ai-jump a:hover { border-color: #7fb2e5; color: #fff; background: rgba(127,178,229,0.1); }')

CSS_V1 = """.ai-rail { position: fixed; right: 0.85em; top: 50%; transform: translateY(-50%); z-index: 1150; display: flex; flex-direction: column; gap: 0.1em; padding: 0.55em 0.5em; border-radius: 1.5em; border: solid 1px rgba(255,255,255,0.12); background: rgba(13,20,30,0.78); box-shadow: 0 0.3em 1em rgba(0,0,0,0.35); opacity: 0.5; transition: opacity 0.18s ease; }
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
@media (max-width: 980px) { .ai-rail { display: none; } }"""

CSS_V2 = """.ai-rail { position: fixed; right: 0.55em; top: 50%; transform: translateY(-50%); z-index: 1150; display: flex; flex-direction: column; gap: 0; padding: 0.2em 0.25em; border-radius: 0.9em; border: solid 1px transparent; background: transparent; transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease; }
.ai-rail:hover, .ai-rail:focus-within { border-color: rgba(255,255,255,0.12); background: rgba(13,20,30,0.82); box-shadow: 0 0.3em 1em rgba(0,0,0,0.35); }
.ai-rail[hidden] { display: none; }
.ai-rail a { display: flex; align-items: center; gap: 0.6em; height: 1.15em; padding: 0 0.2em; border: 0; border-radius: 0.6em; color: rgba(255,255,255,0.75); text-decoration: none; white-space: nowrap; }
.ai-rail a i { flex: 0 0 auto; width: 0.34em; height: 0.34em; border-radius: 50%; background: rgba(255,255,255,0.35); transition: background 0.15s ease, transform 0.15s ease; }
.ai-rail:hover a i, .ai-rail:focus-within a i { background: rgba(255,255,255,0.45); }
.ai-rail a span { max-width: 0; overflow: hidden; opacity: 0; font-size: 0.78em; letter-spacing: 0.01em; transition: max-width 0.24s ease, opacity 0.18s ease; }
.ai-rail:hover a span, .ai-rail:focus-within a span { max-width: 26em; opacity: 1; }
.ai-rail a:hover, .ai-rail a:focus-visible { color: #fff; background: rgba(127,178,229,0.12); }
.ai-rail a:hover i, .ai-rail a:focus-visible i { background: #7fb2e5; }
.ai-rail a.is-on { color: #fff; }
.ai-rail a.is-on i { background: #7fb2e5; transform: scale(1.5); }
@media (max-width: 980px) { .ai-rail { display: none; } }"""


# ---------------------------------------------------------------- JS

JS_ANCHOR = "\t/* scrollspy */\n"

JS_NEW = """	/* on this page: a column of dots at the right edge, labels on hover. The dot that
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

"""


def sub1(text, old, new, what):
    assert text.count(old) == 1, "%s: %d matches, expected 1" % (what, text.count(old))
    return text.replace(old, new)


def slim(path, P):
    """Version 2 of the rail CSS, 20 September 2026: no pill around the dots at rest.
    Version 1 wrapped them in a bordered panel with a shadow, which read as bulky with
    only two or three dots. Now the chrome appears on hover with the labels, and at rest
    the rail is just the dots: 31px wide against 49px, and a third shorter."""
    t = open(path, encoding="utf-8", newline="").read()
    sw = lambda s: s.replace(".ai-", ".%s-" % P)
    t = sub1(t, sw(CSS_V1), sw(CSS_V2), "%s rail CSS v1" % path)
    write(path, t)


def navmod(path):
    t = open(path, encoding="utf-8", newline="").read()
    t = sub1(t, JUMP_OLD, JUMP_NEW, "jump_html")
    t = sub1(t, CSS_OLD, CSS_V2, "jump CSS")
    t = sub1(t, JS_ANCHOR, JS_NEW + JS_ANCHOR, "scrollspy anchor")
    write(path, t)


AIA_JS_ANCHOR = "\t/* ------------------------------------------------------------ scrollspy */\n"


def aiabuild(path):
    """The AI Act builder does not use the shared module: it carries its own copy of the
    jump bar, the nav CSS and the nav JS, so all three have to be patched here."""
    t = open(path, encoding="utf-8", newline="").read()
    old = ('    return \'<nav class="ai-jump" aria-label="On this page"><span class="ai-jump-label">On this page</span>%s</nav>\''
           ' % "".join(\'<a href="%s">%s</a>\' % (h, t) for h, t in items)\n')
    new = ('    dots = "".join(\'<a href="%s" data-target="%s"><i aria-hidden="true"></i><span>%s</span></a>\'\n'
           '                   % (h, h.lstrip("#"), t) for h, t in items)\n'
           '    return \'<nav class="ai-rail" id="ai-rail" aria-label="On this page">%s</nav>\' % dots\n')
    t = sub1(t, old, new, "AI Act inline jump bar")
    t = sub1(t, CSS_OLD, CSS_V2, "AI Act inline jump CSS")
    t = sub1(t, AIA_JS_ANCHOR, JS_NEW + AIA_JS_ANCHOR, "AI Act inline scrollspy anchor")
    write(path, t)


def page(html_path, css_path, P):
    h = open(html_path, encoding="utf-8", newline="").read()
    m = re.search(r'<nav class="%s-jump" aria-label="On this page">.*?</nav>' % P, h)
    assert m, "%s: no jump bar found" % html_path
    assert h.count(m.group(0)) == 1, "%s: jump bar is not unique" % html_path
    items = re.findall(r'<a href="(#[^"]+)">([^<]+)</a>', m.group(0))
    assert items, "%s: jump bar has no links" % html_path
    h = h.replace(m.group(0), rail_markup(P, items))
    h = sub1(h, JS_ANCHOR, JS_NEW + JS_ANCHOR, "%s scrollspy anchor" % html_path)
    write(html_path, h)

    c = open(css_path, encoding="utf-8", newline="").read()
    t = lambda s: s.replace(".ai-", ".%s-" % P)
    c = sub1(c, t(CSS_OLD), t(CSS_V2), "%s jump CSS" % css_path)
    write(css_path, c)
    print("   %d sections: %s" % (len(items), ", ".join(lbl for _, lbl in items)))


def write(path, text):
    assert chr(0x2014) not in text, "em dash in %s" % path
    assert "\r" not in text, "CR in %s" % path
    open(path, "w", encoding="utf-8", newline="\n").write(text)
    print("patched", path, len(text.encode("utf-8")), "bytes")


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "navmod":
        navmod(sys.argv[2])
    elif mode == "aiabuild":
        aiabuild(sys.argv[2])
    elif mode == "page":
        page(sys.argv[2], sys.argv[3], sys.argv[4])
    elif mode == "slim":
        slim(sys.argv[2], sys.argv[3])
    else:
        raise SystemExit(__doc__)
