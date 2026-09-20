# -*- coding: utf-8 -*-
"""Add the digest navigation (on-this-page bar, search box with results, side contents,
Top button) to the two hand-written advice pages, practical-privacy.html and
practical-ai-act-advice.html. Works by string surgery on the existing HTML so the copy
stays byte for byte as written; only the wrapper markup, ids and classes are added.

Usage: python3 apply_nav.py <src html> <src css> <prefix> <section id> <out html> <out css>"""
import re, sys, html, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from digest_nav import toc_html, results_html, jump_html, top_button, nav_js, nav_css
esc = lambda s: html.escape(str(s), quote=True)

src_html, src_css, P, SECTION, out_html, out_css = sys.argv[1:7]
s = open(src_html, encoding="utf-8").read()
css = open(src_css, encoding="utf-8").read()
assert "\r\n" not in s

LABEL = {"pp": ("situation", "situations", "Practical Privacy"), "aia": ("section", "sections", "Practical AI Act Advice")}[P]
NOUN = LABEL[1]

# 1. entries: add the -entry class and ids on the labelled paragraphs inside each body
items = []
def fix_item(m):
    block = m.group(0)
    iid = re.search(r'id="([^"]+)"', block).group(1)
    title = re.search(r'<summary><span class="%s-num">(\d+)</span>\s*(.*?)</summary>' % P, block, re.S)
    num, ttl = title.group(1), re.sub(r"\s+", " ", title.group(2)).strip()
    subs = []
    counter = [0]
    def fix_p(pm):
        counter[0] += 1
        pid = "%s-p%d" % (iid, counter[0])
        label = re.sub(r"<[^>]+>", "", pm.group(2))
        label = html.unescape(re.sub(r"\s+", " ", label)).strip().rstrip(":.").strip()
        if label.lower().startswith("worked example"):
            label = label[:60]
        subs.append((pid, label, ""))
        return '<p id="%s">%s' % (pid, pm.group(1))
    block = re.sub(r'<p>(<strong>(.*?)</strong>)', fix_p, block, flags=re.S)
    block = block.replace('<details class="%s-item"' % P, '<details class="%s-item %s-entry"' % (P, P), 1)
    items.append({"id": iid, "num": num, "title": html.unescape(ttl), "subs": subs})
    return block
s2 = re.sub(r'<details class="%s-item".*?</details>' % P, fix_item, s, flags=re.S)
assert len(items) in (13, 18), len(items)

# 2. wrap: head band (jump bar, intro, search, index) and body (toc + main)
sec_open = re.search(r'<section id="%s">\n' % SECTION, s2)
intro_start = s2.index('<div class="%s-intro">' % P)
acc_start = s2.index('<div class="%s-accordion">' % P)
sec_close = s2.index("</section>", acc_start)
head_inner = s2[intro_start:acc_start]
accordion = s2[acc_start:sec_close]

jump = jump_html(P, [("#%s-filters" % P, "Search"), ("#%s-index" % P, "All %s" % LABEL[1])])
howto = [
    '<strong>Search</strong> matches any text in a %s: its title, the why-it-matters paragraph, the key actions, the never list and the worked example. Type a word such as "consent", "GPS" or "DPIA". Ctrl+K puts the cursor here from anywhere on the page.' % LABEL[0],
    'Matching %s stay in place, the rest hide, and the ones that match open so the text is visible. The count line says how many match; <em>Go to first result</em> scrolls to the first match and the list under it links the first ten. <em>Clear filters</em> shows everything again. Clicking a hidden %s in the side contents also clears the search.' % (LABEL[1], LABEL[0]),
    'The side contents list every %s with its parts (why it matters, key actions, never, worked example); the current one is highlighted as you scroll. Hover an item for a copy-link button; every %s and every part has its own link.' % (LABEL[0], LABEL[0]),
]
filters = ('<div class="%s-filters" id="%s-filters" role="search"><label>Search the %s <input type="text" id="%s-q" placeholder="word, topic, situation" autocomplete="off"></label>%s</div>'
           % (P, P, LABEL[1], P, results_html(P, howto, NOUN)))
head_inner = head_inner.replace('<p class="%s-index-label">' % P, '<p class="%s-index-label" id="%s-index">' % (P, P), 1)
# the privacy line is the last paragraph of the intro on both pages
head_inner = head_inner.replace("</div>\n", "</div>\n" + filters + "\n", 1)

blocks = [{"key": it["id"][len(P) + 1:], "label": "%s %s" % (LABEL[0].capitalize(), it["num"]), "range": "", "title": it["title"], "group_id": it["id"], "items": it["subs"]} for it in items]
toc = toc_html(P, blocks, views=None, overview_href="#%s-filters" % P, overview_label="Search", group_link="Open this %s" % LABEL[0])
accordion = accordion.replace('<div class="%s-accordion">' % P, '<div class="%s-accordion" id="%s-groups">' % (P, P), 1)
note = '<p class="%s-sources-note" id="%s-sources-note">Sources: the numbered list in the study pack in the site\'s outputs folder gives the GDPR articles, EDPB guidelines and other documents behind each %s.</p>' % (P, P, LABEL[0])
body = ('<div class="%s-head">\n' % P + jump + "\n" + head_inner + '</div>\n<div class="%s-cols">\n' % P + toc + '\n<div class="%s-main">\n' % P + accordion + "\n" + note + '\n</div></div>\n' + top_button(P) + "\n")
s3 = s2[:intro_start] + body + s2[sec_close:]

# 3. script
page_js = r"""
(function () {
	var q = document.getElementById('__P__-q');
	var entries = Array.prototype.slice.call(document.querySelectorAll('.__P__-entry'));
	function apply() {
		var qq = q.value.trim().toLowerCase(), shown = 0;
		entries.forEach(function (el) {
			var ok = !qq || el.textContent.toLowerCase().indexOf(qq) !== -1;
			el.hidden = !ok;
			if (ok) { shown++; if (qq && shown <= 8) el.open = true; }
		});
		window.DigestNav.afterApply(shown, entries.length, !!qq, '');
	}
	q.addEventListener('input', apply);
	window.DigestNav.onClear = function () { q.value = ''; apply(); };
	apply();
})();
""".replace("__P__", P)
s3 = s3.replace('<script src="assets/js/main.js"></script>\n', '<script src="assets/js/main.js"></script>\n\t\t\t<script>%s</script>\n' % (nav_js(P, NOUN, "summary", ".%s-body p[id]" % P) + page_js), 1)
assert "<script>" in s3

# 4. css
css = re.sub(r"#%s \{\n\tmax-width: 52em;\n\tmargin: 0;\n\}" % SECTION, "#%s { margin: 0; }" % SECTION, css)
extra = """
/* Search box (same pattern as the digests) */
.ai-filters { display: grid; grid-template-columns: 1fr; gap: 0.75em 1em; align-items: end; margin: 1.5em 0 1em 0; padding: 1em 1.25em; border: solid 1px rgba(255,255,255,0.1); border-radius: 0.5em; background: rgba(255,255,255,0.02); }
.ai-filters label { display: block; font-size: 0.8em; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.1em; }
.ai-filters input { margin-top: 0.4em; }
.ai-sources-note { margin: 2em 0 0 0; font-size: 0.85em; color: rgba(255,255,255,0.5); }
.ai-toc-label { text-transform: none; letter-spacing: 0.02em; }
.ai-cols p[id] { scroll-margin-top: 5.5em; }
.ai-results-list { list-style: none; padding-left: 0; }
""".replace(".ai-", ".%s-" % P)
css_out = css.rstrip("\n") + "\n" + nav_css(P, SECTION) + extra

open(out_html, "w", encoding="utf-8", newline="\n").write(s3)
open(out_css, "w", encoding="utf-8", newline="\n").write(css_out)
print(out_html, len(s3.encode("utf-8")), "bytes;", len(items), "entries;", sum(len(i["subs"]) for i in items), "parts; em dashes", s3.count(chr(0x2014)) + css_out.count(chr(0x2014)))
