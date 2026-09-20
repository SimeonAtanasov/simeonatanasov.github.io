# -*- coding: utf-8 -*-
"""Greyscale A4 PDF of the cookie compliance digest, numbered sources."""
import json, html, re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_cookie_page import GROUP_ORDER, DATE, sortkey, TYPE_LABEL, E
esc = lambda s: html.escape(s, quote=False)

order = []
for g in GROUP_ORDER:
    order += sorted([e for e in E if e["group"] == g], key=sortkey)
num = {id(e): i + 1 for i, e in enumerate(order)}

EXTRA_CSS = """
.coverstats { gap: 8mm; flex-wrap: wrap; }

.entry { break-inside: avoid; margin: 0 0 3.2mm; padding: 0 0 0 3mm; border-left: 2pt solid var(--ink); }
.entry h4 { font-size: 9.8pt; margin: 0 0 .6mm; text-align: left; line-height: 1.3; }
.entry .meta { font-family: "Carlito", sans-serif; font-size: 8pt; color: var(--soft); margin: 0 0 .8mm; }
.entry .meta .ref { color: var(--ink); font-weight: 700; }
.entry p.take { margin: 0; font-size: 9.3pt; }
.groupnote { color: var(--soft); font-size: 9pt; margin-bottom: 3mm; }
.tag { font-family: "Carlito", sans-serif; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .06em; border: .5pt solid var(--rule); padding: 0 1.2mm; margin-left: 1.5mm; }
.tag.j { border-color: var(--ink); font-weight: 700; }
.legend { font-size: 9pt; }
.front h1 { string-set: parttitle "Cookie Compliance Digest", sectitle content(text); }
.srcs { font-size: 7.8pt; color: var(--soft); padding-left: 7mm; }
.srcs li { margin-bottom: .2em; word-break: break-all; }
"""

def entry(e):
    tags = '<span class="tag j">%s</span><span class="tag">%s</span>' % (esc(e["jurisdiction"]), esc(TYPE_LABEL.get(e["type"], e["type"])))
    if e["status"] not in ("in force", "decided"):
        tags += '<span class="tag">%s</span>' % esc(e["status"])
    for t in e.get("topics") or []:
        tags += '<span class="tag">%s</span>' % esc(t.replace("-", " "))
    if e.get("source") == "secondary":
        tags += '<span class="tag">secondary source</span>'
    return '<div class="entry"><h4>%s</h4><p class="meta"><span class="ref">[%d]</span> &middot; %s%s</p><p class="take">%s</p></div>' % (esc(e["title"]), num[id(e)], esc(e["date"]), tags, esc(e["takeaway"]))

def build():
    jurs = sorted({e["jurisdiction"] for e in E})
    from collections import Counter
    c = Counter(e["type"] for e in E)
    b = []
    b.append('<section class="cover"><p class="kicker">Reference</p><h1>Cookie Compliance Digest</h1>'
             '<p class="sub">Every rule a consent banner has to satisfy: %d documents across %d jurisdictions as of %s, each with a practitioner takeaway.</p>'
             '<div class="coverstats"><div><span class="n">%d</span><span class="l">legislation</span></div><div><span class="n">%d</span><span class="l">regulator guidance</span></div><div><span class="n">%d</span><span class="l">court decisions</span></div><div><span class="n">%d</span><span class="l">enforcement actions</span></div><div><span class="n">%d</span><span class="l">standards</span></div><div><span class="n">%d</span><span class="l">proposals</span></div></div>'
             '<p class="covernote">Reading aid, not legal advice. Every entry carries a numbered source that resolves to the primary page at the end.</p></section>' % (len(E), len(jurs), DATE, c["legislation"], c["regulator guidance"], c["court decision"], c["enforcement"], c["standard"], c["proposal"]))
    b.append('<section class="front"><h1 id="how">How to read this</h1>'
             '<p class="lede">Each entry states what the document establishes, with the operative article or section, who it binds, and what to do about it, followed by the key figures: fine amounts, deadlines, application dates. Depth follows the regimes a European consent platform meets daily: the EU and its member states, the United Kingdom, Switzerland and the United States in full; one entry per operative rule elsewhere. Standards and industry frameworks have their own group, each with a sentence on legal status, since a standard is not law but regulators and courts refer to them.</p>'
             '<p>Status is as of %s. Proposals and consultations move; an entry says so where it applies from a future date, is proposed or is under appeal. Where a primary page could not be reached and the figures rest on a secondary source, the entry is marked. Entries are grouped by region, newest first within each group. The number in brackets is the source number; the list at the end gives the URL for every document.</p>'
             '<h2 class="sub">Contents</h2><ul class="legend">' % DATE)
    for g in GROUP_ORDER:
        b.append('<li>%s: %d documents</li>' % (esc(g), sum(1 for e in E if e["group"] == g)))
    b.append("</ul></section>")
    for g in GROUP_ORDER:
        items = [e for e in order if e["group"] == g]
        b.append('<section class="tool"><h1 id="%s">%s</h1><p class="groupnote">%d documents, newest first.</p>' % (re.sub(r"[^a-z0-9]+", "-", g.lower()), esc(g), len(items)))
        for e in items:
            b.append(entry(e))
        b.append("</section>")
    b.append('<section class="tool"><h1 id="sources">Sources</h1><p class="lede">One source per document, numbered in the order the entries appear. Consulted on %s.</p><ol class="srcs">' % DATE)
    for e in order:
        b.append("<li>%s: %s</li>" % (esc(e["title"]), esc(e["url"])))
    b.append("</ol></section>")
    css = open("/home/claude/pack/src/pack.css", encoding="utf-8").read() + EXTRA_CSS
    page = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Cookie Compliance Digest, %s</title><style>%s</style></head><body>%s</body></html>' % (esc(DATE), css, "".join(b))
    p = os.path.join(HERE, "cookie_digest_print.html")
    open(p, "w", encoding="utf-8").write(page)
    return p

if __name__ == "__main__":
    p = build()
    from weasyprint import HTML
    out = "/mnt/user-data/outputs/cookie-compliance-digest-2026-09-19.pdf"
    HTML(p).write_pdf(out)
    print("pdf", out, os.path.getsize(out), "em dashes:", open(p, encoding="utf-8").read().count(chr(0x2014)))
