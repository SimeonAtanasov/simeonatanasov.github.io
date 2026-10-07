#!/usr/bin/env python3
"""
SA-01: wires the site assistant into the three existing files it touches.
Run from the repo root (in the device shell or against a copy):

  python3 "Claude outputs/assistant-build/patch_site.py" [repo root]

Every anchor must occur exactly once and the input md5 must match the staged
version of 7 October 2026, so a file edited since is refused rather than
patched blind. Idempotent: a file already patched is left alone.
"""
import hashlib
import os
import sys

repo = sys.argv[1] if len(sys.argv) > 1 else "."

DONE = {"assets/js/pwa.js": "__saInjected", "sw.js": "assistant.js", "README.md": "### Site assistant"}

EXPECT = {
    "assets/js/pwa.js": "3ed3a0a07e44a9fa7c3345c8583d99ce",
    "sw.js": "0e1f062a3c092acd7015de2da86f3581",
    "README.md": "bd5f0fded5a35c5446816d749c2103b8",
}

PWA_MARK = "/*\n\tInstall app, on demand."
PWA_BLOCK = '''/*
	Loads the site assistant on every page, the same way as the consent layer
	and for the same reason: one edit here covers the whole site. The pair is
	assets/css/assistant.css and assets/js/assistant.js; the search index it
	fetches on first use is assets/assistant/index.json, built by
	Claude outputs/assistant-build/build_index.py. Nothing the visitor types
	leaves the browser. See claude/site-assistant.md.
*/
(function () {

	if (window.__saInjected) return;
	window.__saInjected = true;

	var head = document.head || document.getElementsByTagName('head')[0];
	if (!head) return;

	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = '/assets/css/assistant.css';
	head.appendChild(link);

	var script = document.createElement('script');
	script.src = '/assets/js/assistant.js';
	script.defer = true;
	head.appendChild(script);

})();

'''

README_SECTION = '''### Site assistant

`assets/js/assistant.js` and `assets/css/assistant.css`, added 7 October 2026, loaded on
every page by `pwa.js` like the consent pair. An "Ask" launcher at the bottom right (placed
at runtime above whatever Top or Contents button the page already has, and hidden while the
cookie banner is up) opens a panel that searches the whole site: the three digests, the two
advice pages, the explanation and question bank of each assessment tool, the readiness
activities, the crosswalk rows, the enforcement sections and country cards, the fine
calculator explainer, the two notices, a tool catalogue and a short FAQ. Every result deep
links to the entry it came from; a "Which assessment do I need?" chooser recommends a tool.

Everything runs in the browser. The index, `assets/assistant/index.json` (about 2 MB, 490 KB
compressed, fetched when the panel first opens), is built by
`Claude outputs/assistant-build/build_index.py` from the digest JSON, the study guides and
the page data files; the ranking is BM25 over Porter-stemmed tokens with the question
expanded by a synonym and abbreviation table that ships inside the index. Nothing the
visitor types leaves the page and nothing is stored. No language model is involved: a
distilled on-device model was measured and scored lower than this (see the build folder's
README). **Rebuild the index after any digest rebuild, advice page edit, study pack rebuild
or tool change**, or the assistant keeps showing the old text. Both files are in the
`sw.js` precache; `VERSION` went to `v8` when they shipped. The script also opens a closed
`<details>` that a deep link points into, on every page, on load and on hash change.

'''

README_ROW = '''| `assistant-build/` | Builds `assets/assistant/index.json`, the site assistant's search index (SA-01, 7 October 2026): `build_index.py` (chunking rules per source, the tool catalogue, the FAQ and the synonym table), `dump_js_data.js` (evaluates the readiness and crosswalk data scripts), `porter.py` and `search_text.py` (the tokenizer, mirrored by `assistant.js`), `eval_bm25.py` and `eval_retrieval.py` (the retrieval measurements that decided against shipping a model), `test_tokenizer.js` (JS against Python parity and the ranker check), `test_ui.js` (Playwright run over eight pages at three widths), `patch_site.py` (the SA-01 edits to `pwa.js`, `sw.js` and this file). README inside. | You changed any content the assistant searches and need to rebuild the index, or want to know why there is no model behind it. |
'''

README_NOTE = '''- The site assistant pair (`assets/js/assistant.js`, `assets/css/assistant.css`) is loaded
  by `pwa.js` as well, so the same bump rule applies to it, and its index
  (`assets/assistant/index.json`) must be rebuilt after any content change it covers.
'''


def md5(b):
    return hashlib.md5(b).hexdigest()


def patch(rel, fn):
    p = os.path.join(repo, rel)
    with open(p, "rb") as f:
        raw = f.read()
    assert b"\r" not in raw, rel + " has CR bytes; it is meant to be LF"
    s = raw.decode("utf-8")
    if DONE[rel] in s:
        print("%s: already patched" % rel)
        return
    new = fn(s)
    assert md5(raw) == EXPECT[rel], "%s: md5 %s, expected %s; re-stage and update EXPECT" % (rel, md5(raw), EXPECT[rel])
    with open(p, "wb") as f:
        f.write(new.encode("utf-8"))
    with open(p, "rb") as f:
        back = f.read()
    print("%s: %d -> %d bytes, md5 %s" % (rel, len(raw), len(back), md5(back)))


def pwa(s):
    assert s.count(PWA_MARK) == 1
    return s.replace(PWA_MARK, PWA_BLOCK + PWA_MARK)


def sw(s):
    a = "var VERSION = 'v7';"
    b = "\tpwa.js, v7 its slide-in on the home page sidebar. The reason"
    c = "\t'/assets/js/cookie-consent.js',\n"
    for x in (a, b, c):
        assert s.count(x) == 1, x
    s = s.replace(a, "var VERSION = 'v8';")
    s = s.replace(b, "\tpwa.js, v7 its slide-in on the home page sidebar, v8 the site assistant\n\t(assistant.css and assistant.js, loaded by pwa.js). The reason")
    s = s.replace(c, c + "\t'/assets/css/assistant.css',\n\t'/assets/js/assistant.js',\n")
    return s


def readme(s):
    a = "Last updated 27 September 2026."
    b = "## Claude outputs/\n"
    c = "| `study-guides/` | Since 3 October 2026,"
    d = "- The header nav collapses by JS measurement in `main.js`, not by a pixel breakpoint.\n"
    e = "`pwa.js` does one more job since 24 September 2026: it injects the consent pair into the\nhead of every page. That is why the consent layer needed no per-page script tag. A page\nadded without the PWA block therefore gets no cookie banner.\n"
    for x in (a, b, c, d, e):
        assert s.count(x) == 1, x
    s = s.replace(a, "Last updated 7 October 2026.")
    s = s.replace(b, README_SECTION + b)
    s = s.replace(c, README_ROW + c)
    s = s.replace(d, README_NOTE + d)
    s = s.replace(e, e.rstrip("\n") + " Since 7 October 2026 it\ninjects the site assistant pair the same way (see Site assistant below).\n")
    return s


patch("assets/js/pwa.js", pwa)
patch("sw.js", sw)
patch("README.md", readme)
