# -*- coding: utf-8 -*-
"""Greyscale A4 PDF of the EDPB digest, study pack style, numbered sources."""
import json, html, re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_digest_page import GROUPS, DATE, year

E = json.load(open(os.path.join(HERE, "digest.json"), encoding="utf-8"))
esc = lambda s: html.escape(s, quote=False)

# source numbers: one per entry, in the order they appear in the PDF
order = []
for g, ts in GROUPS.items():
    items = [e for e in E if e["type"] in ts]
    items.sort(key=lambda e: (-int(year(e["date"]) or 0), e["title"]))
    order += items
num = {e["id"]: i + 1 for i, e in enumerate(order)}

EXTRA_CSS = """
.entry { break-inside: avoid; margin: 0 0 3.2mm; padding: 0 0 0 3mm; border-left: .5pt solid var(--rule); }
.entry.written { border-left: 2pt solid var(--ink); }
.entry h4 { font-size: 9.8pt; margin: 0 0 .6mm; text-align: left; line-height: 1.3; }
.entry .meta { font-family: "Carlito", sans-serif; font-size: 8pt; color: var(--soft); margin: 0 0 .8mm; }
.entry .meta .ref { color: var(--ink); font-weight: 700; }
.entry p.take { margin: 0; font-size: 9.3pt; }
.entry.oneliner p.take { font-size: 8.8pt; color: var(--soft); }
.entry.oneliner h4 { font-size: 9pt; font-weight: 400; }
.groupnote { color: var(--soft); font-size: 9pt; margin-bottom: 3mm; }
.tag { font-family: "Carlito", sans-serif; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .06em; border: .5pt solid var(--rule); padding: 0 1.2mm; margin-left: 1.5mm; }
.tag.w { border-color: var(--ink); }
.legend { font-size: 9pt; }
.front h1 { string-set: parttitle "EDPB Digest", sectitle content(text); }
.srcs { font-size: 7.8pt; color: var(--soft); padding-left: 7mm; }
.srcs li { margin-bottom: .2em; word-break: break-all; }
"""


def entry(e):
    cls = "entry " + e["tier"]
    tags = ""
    if e["tier"] == "written":
        tags += '<span class="tag w">read from the document</span>'
    if e.get("status") and e["status"] != "current":
        tags += '<span class="tag">%s</span>' % esc(e["status"].replace("-", " "))
    for t in e.get("topics") or []:
        tags += '<span class="tag">%s</span>' % esc(t.replace("-", " "))
    return ('<div class="%s"><h4>%s</h4><p class="meta"><span class="ref">[%d]</span> &middot; %s &middot; %s%s</p><p class="take">%s</p></div>'
            % (cls, esc(e["title"]), num[e["id"]], esc(e["type"].replace("Opinion of the Board (Art. 64)", "Opinion of the Board")), esc(e["date"]), tags, esc(e["takeaway"])))


def build():
    nw = sum(1 for e in E if e["tier"] == "written")
    b = []
    b.append('<section class="cover"><p class="kicker">Reference</p><h1>EDPB Digest</h1>'
             '<p class="sub">Every document published by the European Data Protection Board, %d of them as of %s, with one takeaway each.</p>'
             '<div class="coverstats"><div><span class="n">%d</span><span class="l">documents</span></div><div><span class="n">%d</span><span class="l">written takeaways</span></div><div><span class="n">%d</span><span class="l">one-line descriptions</span></div><div><span class="n">%d</span><span class="l">document types</span></div></div>'
             '<p class="covernote">Reading aid, not a substitute. Every entry carries a numbered source that resolves to the EDPB page at the end.</p></section>' % (len(E), DATE, len(E), nw, len(E) - nw, len(GROUPS)))
    b.append('<section class="front"><h1 id="how">How to read this</h1>'
             '<p class="lede">For %d documents the takeaway was written from the document: what it establishes, who it binds and what to do about it. They are marked "read from the document" and set with a heavy left rule. For the remaining %d, which are approvals of binding corporate rules, accreditation requirements, national DPIA lists, certification criteria, institutional reports and the Board\'s own procedures, a one-line description says what the document is so it can be ruled in or out.</p>'
             '<p>The choice of which documents earned a written takeaway follows the topics of the site this digest accompanies (privacy operations, the AI Act, assessment tools), not the document\'s importance in general. Dates are the publication dates shown in the EDPB listing on %s. Guidelines still at consultation stage appear on the EDPB consultations page and are here only once the documents listing carries a version.</p>'
             '<p>Documents are grouped by publication type, newest first within each group. The number in brackets on each entry is its source number; the source list at the end gives the EDPB URL for every one of the %d documents.</p>'
             '<h2 class="sub">Contents</h2><ul class="legend">' % (nw, len(E) - nw, DATE, len(E)))
    for g, ts in GROUPS.items():
        items = [e for e in E if e["type"] in ts]
        b.append('<li>%s: %d documents, %d written</li>' % (esc(g), len(items), sum(1 for e in items if e["tier"] == "written")))
    b.append("</ul></section>")
    for g, ts in GROUPS.items():
        items = [e for e in order if e["type"] in ts]
        nwg = sum(1 for e in items if e["tier"] == "written")
        b.append('<section class="tool"><h1 id="%s">%s</h1><p class="groupnote">%d documents, %d with a written takeaway. Newest first.</p>' % (re.sub(r"[^a-z0-9]+", "-", g.lower()), esc(g), len(items), nwg))
        for e in items:
            b.append(entry(e))
        b.append("</section>")
    b.append('<section class="tool"><h1 id="sources">Sources</h1><p class="lede">One EDPB page per document, numbered in the order the entries appear. Listing consulted on %s.</p><ol class="srcs">' % DATE)
    for e in order:
        b.append("<li>%s: %s</li>" % (esc(e["title"]), esc(e["url"])))
    b.append("</ol></section>")
    css = open(os.path.join(HERE, "pack.css"), encoding="utf-8").read() + EXTRA_CSS
    page = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>EDPB Digest, %s</title><style>%s</style></head><body>%s</body></html>' % (esc(DATE), css, "".join(b))
    p = os.path.join(HERE, "digest.html")
    open(p, "w", encoding="utf-8").write(page)
    return p


if __name__ == "__main__":
    p = build()
    from weasyprint import HTML
    out = "/mnt/user-data/outputs/edpb-digest-2026-09-19.pdf"
    HTML(p).write_pdf(out)
    print("pdf", out, os.path.getsize(out))
    print("em dashes:", open(p, encoding="utf-8").read().count("—"))
