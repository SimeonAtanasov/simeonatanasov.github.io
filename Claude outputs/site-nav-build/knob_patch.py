# -*- coding: utf-8 -*-
"""On this page rail, script v3 (26 September 2026): one tap on a touch screen.

Script v3.1 (27 September 2026) also stops sticky :hover holding the labels open
after the handle closes them; see V31_NEW below.

Script v2 made a first tap on the rail open the labels and the next tap follow the link,
because a touch screen has no hover to show which dot is which. That read as a double
tap. v3 lets a dot jump at once and adds a small handle above the dots, shown only under
(hover: none), that opens and closes the labels. On a hover-capable device the handle is
hidden and nothing changes. The handle is built by the script with inline styles, so no
page CSS or markup changes, and it is aria-hidden: the section names are in the links
already.

Usage:
  python3 knob_patch.py <file> [<file> ...]

Patches every file that carries the v2 script: the seven shipped pages or page scripts,
the four digest_nav.py copies, build_aia_page.py, and rail_patch.py itself, so that
anything it adds from now on carries v3. Each anchor must occur exactly once. No em
dashes. LF only.
"""
import sys

COMMENT_OLD = """because the AI Act builder's own copy of this script has no $ helper. Where there
	   is no hover, a first tap opens the labels and the next one follows the link. */"""

COMMENT_NEW = """because the AI Act builder's own copy of this script has no $ helper. Where there
	   is no hover, a dot jumps at once and a small handle above the dots opens the labels. */"""

JS_OLD = """		var railHover = window.matchMedia('(hover: hover)');
		rail.addEventListener('click', function (e) {
			if (!railHover.matches && !rail.classList.contains('is-open')) { e.preventDefault(); rail.classList.add('is-open'); return; }
			if (e.target.closest && e.target.closest('a')) rail.classList.remove('is-open');
		});
		document.addEventListener('click', function (e) { if (!rail.contains(e.target)) rail.classList.remove('is-open'); });
		window.addEventListener('scroll', function () {
			if (railTick) return;
			railTick = true;
			window.requestAnimationFrame(function () { railTick = false; railSync(); });
			rail.classList.remove('is-open');
		}, { passive: true });
"""

JS_NEW = """		var railHover = window.matchMedia('(hover: hover)');
		var railKnob = document.createElement('span');
		railKnob.className = 'rail-knob';
		railKnob.setAttribute('aria-hidden', 'true');
		railKnob.title = 'Show section names';
		railKnob.style.cssText = 'align-items: center; height: 1.9em; padding: 0 0.2em; border-radius: 0.6em; color: rgba(255,255,255,0.9); font-size: 1.1em; font-weight: bold; line-height: 1; cursor: pointer; user-select: none; -webkit-user-select: none; -webkit-tap-highlight-color: transparent;';
		rail.insertBefore(railKnob, rail.firstChild);
		/* a touch screen keeps :hover on whatever was tapped last, so after the handle is
		   tapped the rail stays hovered and its hover rules hold the labels open. Under
		   (hover: none) only is-open (or keyboard focus) may open them. */
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
			railOpen(false);
			/* a tapped link keeps focus, and :focus-within would hold the labels open */
			if (!railHover.matches) link.blur();
		});
		document.addEventListener('click', function (e) { if (!rail.contains(e.target)) railOpen(false); });
		window.addEventListener('scroll', function () {
			if (railTick) return;
			railTick = true;
			window.requestAnimationFrame(function () { railTick = false; railSync(); });
			railOpen(false);
		}, { passive: true });
"""


# v3.1, 27 September 2026: the handle opened the labels on a phone but did not close
# them, because the tapped rail kept :hover. Files already on v3 get the style block only.
V3_ANCHOR = "\t\trail.insertBefore(railKnob, rail.firstChild);\n"
V31_NEW = V3_ANCHOR + JS_NEW.split(V3_ANCHOR)[1].split("\t\tvar railOpen")[0]


def patch(path):
    t = open(path, encoding="utf-8", newline="").read()
    if t.count(JS_OLD) == 1:
        steps = ((COMMENT_OLD, COMMENT_NEW, "comment"), (JS_OLD, JS_NEW, "script"))
    else:
        assert "railStyle" not in t, "%s: already on v3.1" % path
        steps = ((V3_ANCHOR, V31_NEW, "v3.1 style"),)
    for old, new, what in steps:
        assert t.count(old) == 1, "%s: %s anchor found %d times, expected 1" % (path, what, t.count(old))
        t = t.replace(old, new)
    assert chr(0x2014) not in t, "em dash in %s" % path
    assert "\r" not in t, "CR in %s" % path
    open(path, "w", encoding="utf-8", newline="\n").write(t)
    print("patched", path, len(t.encode("utf-8")), "bytes")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    for p in sys.argv[1:]:
        patch(p)
