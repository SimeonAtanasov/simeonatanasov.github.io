# -*- coding: utf-8 -*-
"""Greyscale A4 PDF of the AI Act digest: Part 1 the Regulation article by
article, Part 2 the guidance and implementation corpus, numbered sources."""
import json, html, re, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_aia_page import ARTS, CORPUS, CORPUS_GROUPS, chapters, BIND_LABEL, DATE, date_sort_key, ch_short, art_range, sections_of, sum_links
from aia_extras import SUMMARY
esc = lambda s: html.escape(s, quote=False)

order = []
for ch, items in chapters.items():
    order += items
for g in CORPUS_GROUPS:
    order += sorted([c for c in CORPUS if c["group"] == g], key=lambda c: c["title"])
num = {id(e): i + 1 for i, e in enumerate(order)}

TYPE_LABEL = {"regulation": "regulation", "commission-guidelines": "Commission guidelines", "code-of-practice": "code of practice",
              "template": "template", "qa": "Q&A", "delegated-or-implementing-act": "delegated or implementing act",
              "edpb-edps": "EDPB / EDPS", "national-law": "national law", "reference-tool": "reference tool",
              "policy": "policy", "standards": "standards"}

EXTRA_CSS = """
.entry { break-inside: avoid; margin: 0 0 3.2mm; padding: 0 0 0 3mm; border-left: 2pt solid var(--ink); }
.entry h4 { font-size: 9.8pt; margin: 0 0 .6mm; text-align: left; line-height: 1.3; }
.entry .meta { font-family: "Carlito", sans-serif; font-size: 8pt; color: var(--soft); margin: 0 0 .8mm; text-align: left; }
.entry .meta .ref { color: var(--ink); font-weight: 700; }
.entry p.take { margin: 0; font-size: 9.3pt; }
.entry p.omni { margin: .8mm 0 0; font-size: 8.6pt; padding: 1mm 2mm; background: var(--tint); border-left: 1.5pt solid var(--accent); }
.entry p.omni b { font-family: "Carlito", sans-serif; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .06em; }
.entry p.rec { margin: .5mm 0 0; font-size: 7.8pt; color: var(--soft); font-family: "Carlito", sans-serif; }
.groupnote { color: var(--soft); font-size: 9pt; margin-bottom: 3mm; }
.tag { font-family: "Carlito", sans-serif; font-size: 7.5pt; text-transform: uppercase; letter-spacing: .06em; border: .5pt solid var(--rule); padding: 0 1.2mm; margin-left: 1.5mm; white-space: nowrap; }
.tag.j { border-color: var(--ink); font-weight: 700; }
.legend { font-size: 9pt; }
.front h1 { string-set: parttitle "AI Act Digest", sectitle content(text); }
.srcs { font-size: 7.8pt; color: var(--soft); padding-left: 7mm; }
.srcs li { margin-bottom: .2em; word-break: break-all; }
.glance td.n { white-space: nowrap; }
.glance td.arts { font-size: 8.3pt; }
.partdiv { break-before: page; }
.partdiv h1 { string-set: parttitle content(text), sectitle ""; }
.partdiv .lede { font-size: 11pt; }
.hls p, .hls li { font-size: 9.6pt; }
.hls ul { padding-left: 5mm; }
"""


def summary_section():
    b = ['<section class="front"><h1 id="summary">High-level summary</h1><p class="lede">The Act in ten short sections, written from the digest entries and current to the Omnibus. Article numbers point to the entries in Part 1.</p><div class="hls">']
    for head, sub, blocks in SUMMARY:
        b.append('<h2 class="sub">%s</h2>' % esc(head))
        for blk in blocks:
            if isinstance(blk, list):
                b.append("<ul>" + "".join("<li>%s</li>" % sum_links(x, "pdf") for x in blk) + "</ul>")
            else:
                b.append("<p>%s</p>" % sum_links(blk, "pdf"))
    b.append("</div></section>")
    return "".join(b)


def short_ref(a):
    return a["number"]


def compact_refs(items):
    """'Art 40 to 49, Art 51, Annex IV' from an ordered provision list."""
    out = []
    run = []
    def flush():
        if not run:
            return
        if len(run) >= 3:
            out.append("Art %d to %d" % (run[0], run[-1]))
        else:
            out.extend("Art %d" % n for n in run)
        run.clear()
    for a in items:
        if a["id"].startswith("art") and not a["suffix"]:
            n = a["num"]
            if run and n == run[-1] + 1:
                run.append(n)
            else:
                flush()
                run.append(n)
        else:
            flush()
            out.append(("Art %s" % a["short"]) if a["id"].startswith("art") else a["number"])
    flush()
    return ", ".join(out)


def art_entry(a):
    tags = '<span class="tag j">applies %s</span>' % esc(a["applies_from"])
    if a["omnibus"]:
        tags += '<span class="tag j">amended by 2026/1744</span>'
    for r in a.get("binds") or []:
        tags += '<span class="tag">%s</span>' % esc(BIND_LABEL.get(r, r))
    for t in a.get("topics") or []:
        tags += '<span class="tag">%s</span>' % esc(t.replace("-", " "))
    h = '<div class="entry"><h4>%s: %s</h4><p class="meta"><span class="ref">[%d]</span> &middot; %s%s%s</p><p class="take">%s</p>' % (
        esc(short_ref(a)), esc(a["title"]), num[id(a)], esc(a["chapter"]), (" &middot; " + esc(a["section"])) if a.get("section") else "", tags, esc(a["takeaway"]))
    if a["omnibus"]:
        h += '<p class="omni"><b>Omnibus change.</b> %s</p>' % esc(a["omnibus"])
    if a.get("recitals"):
        h += '<p class="rec">Recitals %s</p>' % esc(", ".join(str(r) for r in a["recitals"]))
    return h + "</div>"


def doc_entry(c):
    tags = '<span class="tag j">%s</span>' % esc(TYPE_LABEL.get(c["type"], c["type"]))
    if c["status"] != "final":
        tags += '<span class="tag">%s</span>' % esc(c["status"])
    for t in c.get("topics") or []:
        tags += '<span class="tag">%s</span>' % esc(t.replace("-", " "))
    if c.get("source") == "knowledge":
        tags += '<span class="tag">not fetched</span>'
    arts = ", ".join(c.get("articles") or [])
    return '<div class="entry"><h4>%s</h4><p class="meta"><span class="ref">[%d]</span> &middot; %s &middot; %s%s%s</p><p class="take">%s</p></div>' % (
        esc(c["title"]), num[id(c)], esc(c["date"]), esc(c["issuer"]), (" &middot; " + esc(arts)) if arts else "", tags, esc(c["takeaway"]))


def structure_table():
    b = ['<table class="glance"><thead><tr><th>Chapter</th><th>Title</th><th>Provisions</th><th>Sections</th></tr></thead><tbody>']
    for ch, items in chapters.items():
        if ch == "Annexes":
            b.append('<tr><td class="n">Annexes</td><td class="arts">I to %s</td><td class="n">%d</td><td class="arts"></td></tr>' % (esc(items[-1]["short"]), len(items)))
            continue
        lab, title = ch_short(ch)
        secs = [re.sub(r"^Section \d+:\s*", "", sname) for sname, _ in sections_of(items) if sname]
        b.append('<tr><td class="n">%s</td><td class="arts">%s</td><td class="n">%s (%d)</td><td class="arts">%s</td></tr>' % (esc(lab), esc(title), esc(art_range(items).replace("\u2013", " to ").replace("Arts. ", "").replace("Art. ", "")), len(items), esc("; ".join(secs))))
    b.append("</tbody></table>")
    return "".join(b)


def glance_table():
    """Application dates at a glance: one row per date, the provisions it covers."""
    rows = {}
    for a in ARTS:
        rows.setdefault(a["applies_from"], []).append(a)
    b = ['<table class="glance"><thead><tr><th>Applies from</th><th>Provisions</th><th>Count</th></tr></thead><tbody>']
    for d in sorted(rows, key=date_sort_key):
        items = sorted(rows[d], key=lambda a: a["order"])
        refs = compact_refs(items)
        b.append('<tr><td class="n">%s</td><td class="arts">%s</td><td class="n">%d</td></tr>' % (esc(d), esc(refs), len(items)))
    b.append("</tbody></table>")
    return "".join(b)


def omni_table():
    b = ['<table class="glance"><thead><tr><th>Provision</th><th>What Regulation (EU) 2026/1744 changed</th></tr></thead><tbody>']
    for a in sorted([a for a in ARTS if a["omnibus"]], key=lambda a: a["order"]):
        b.append('<tr><td class="n">%s [%d]</td><td class="arts">%s</td></tr>' % (esc(short_ref(a)), num[id(a)], esc(a["omnibus"])))
    b.append("</tbody></table>")
    return "".join(b)


def build():
    n_arts = sum(1 for a in ARTS if a["id"].startswith("art"))
    n_ann = len(ARTS) - n_arts
    n_omni = sum(1 for a in ARTS if a["omnibus"])
    b = []
    b.append('<section class="cover"><p class="kicker">Study digest</p><h1>AI Act Digest</h1>'
             '<p class="sub">Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744, article by article, and the guidance and implementation corpus around it, as of %s. One takeaway per provision and per document.</p>'
             '<div class="coverstats"><div><span class="n">%d</span><span class="l">articles</span></div><div><span class="n">%d</span><span class="l">annexes</span></div><div><span class="n">%d</span><span class="l">provisions changed by the Omnibus</span></div><div><span class="n">%d</span><span class="l">corpus documents</span></div></div>'
             '<p class="covernote">Reading aid, not legal advice. The consolidated text governs. Every entry carries a numbered source that resolves to the primary page at the end.</p></section>' % (DATE, n_arts, n_ann, n_omni, len(CORPUS)))
    b.append(summary_section())
    b.append('<section class="front"><h1 id="how">How to read this</h1>'
             '<p class="lede">Part 1 walks the Regulation in its own order, chapter by chapter, then the fourteen annexes. Each entry states what the provision establishes, who it binds and what a practitioner does with it, followed by its date of application under Article 113, the roles it binds, the recitals that explain it, and, where Regulation (EU) 2026/1744 touched it, a note on what changed. Part 2 covers the corpus around the Act: the amending regulation, the Commission guidelines, codes of practice, templates and Q&amp;As, the standardisation programme, the EDPB and EDPS positions including Opinion 28/2024 on AI models, the national implementing laws and the reference tools. Each entry states the document\'s legal status, the articles it interprets and what to do with it.</p>'
             '<p>Application dates are those the consolidated text carries after the Digital Omnibus on AI, in force since 27 July 2026: the high-risk chapter applies from 2 December 2027 for Annex III systems and 2 August 2028 for Annex I systems, the Article 50 transparency duties for systems placed on the market before 2 August 2026 apply from 2 December 2026, and the two new prohibitions in Article 5(1)(ba) and (bb) apply from 2 December 2026. Guidance marked draft or consultation is not final. Where a page could not be reached the entry is marked. The number in brackets is the source number; the list at the end gives the URL for every provision and document.</p>'
             '<h2 class="sub">Structure of the Act</h2>' + structure_table() +
             '<h2 class="sub">Application dates at a glance</h2>' + glance_table() +
             '<h2 class="sub">Provisions changed by the Omnibus</h2><p class="groupnote">%d provisions. The full change note sits with each entry.</p>' % n_omni + omni_table() +
             '<h2 class="sub">Contents</h2><ul class="legend">')
    for ch, items in chapters.items():
        b.append('<li>%s: %d provisions</li>' % (esc(ch), len(items)))
    for g in CORPUS_GROUPS:
        n = sum(1 for c in CORPUS if c["group"] == g)
        if n:
            b.append('<li>%s: %d documents</li>' % (esc(g), n))
    b.append("</ul></section>")
    b.append('<section class="partdiv"><h1>Part 1: the Regulation</h1><p class="lede">Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744, %d articles in %d chapters and %d annexes, in the order of the text.</p></section>' % (n_arts, len([c for c in chapters if c != "Annexes"]), n_ann))
    for ch, items in chapters.items():
        b.append('<section class="tool"><h1 id="%s">%s</h1><p class="groupnote">%d provisions.</p>' % (re.sub(r"[^a-z0-9]+", "-", ch.lower()), esc(ch), len(items)))
        for a in items:
            b.append(art_entry(a))
        b.append("</section>")
    b.append('<section class="partdiv"><h1>Part 2: guidance and implementation</h1><p class="lede">%d documents around the Act as of %s, grouped by kind and listed alphabetically within each group.</p></section>' % (len(CORPUS), DATE))
    for g in CORPUS_GROUPS:
        items = sorted([c for c in CORPUS if c["group"] == g], key=lambda c: c["title"])
        if not items:
            continue
        b.append('<section class="tool"><h1 id="%s">%s</h1><p class="groupnote">%d documents.</p>' % (re.sub(r"[^a-z0-9]+", "-", g.lower()), esc(g), len(items)))
        for c in items:
            b.append(doc_entry(c))
        b.append("</section>")
    b.append('<section class="tool"><h1 id="sources">Sources</h1><p class="lede">One source per entry, numbered in the order the entries appear. Consulted on %s.</p><ol class="srcs">' % DATE)
    for e in order:
        title = ("%s: %s" % (short_ref(e), e["title"])) if e["part"] == "regulation" else e["title"]
        b.append("<li>%s: %s</li>" % (esc(title), esc(e["url"])))
    b.append("</ol></section>")
    local = os.path.join(HERE, "pack.css")
    css_path = local if os.path.exists(local) else "/home/claude/pack/src/pack.css"
    css = open(css_path, encoding="utf-8").read() + EXTRA_CSS
    page = '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>AI Act Digest, %s</title><style>%s</style></head><body>%s</body></html>' % (esc(DATE), css, "".join(b))
    p = os.path.join(HERE, "ai_act_digest_print.html")
    open(p, "w", encoding="utf-8").write(page)
    return p


if __name__ == "__main__":
    p = build()
    from weasyprint import HTML
    out = "/mnt/user-data/outputs/ai-act-digest-2026-09-19.pdf"
    HTML(p).write_pdf(out)
    print("pdf", out, os.path.getsize(out), "em dashes:", open(p, encoding="utf-8").read().count("\u2014"))
