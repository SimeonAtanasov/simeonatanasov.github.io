# -*- coding: utf-8 -*-
"""Build ai-act-digest.html (site page) from the article, annex and corpus JSON files."""
import json, html, re, os
from collections import OrderedDict, Counter

HERE = os.path.dirname(os.path.abspath(__file__))
import sys
sys.path.insert(0, HERE)
from aia_extras import SUMMARY, CHECKER_INTRO, CHECKER_JS, CHECKER_CSS, SUMMARY_CSS
esc = lambda s: html.escape(str(s), quote=True)
DATE = "19 September 2026"

ARTS = []
for k in "abcde":
    ARTS += json.load(open(os.path.join(HERE, "items_%s.json" % k), encoding="utf-8"))
CORPUS = json.load(open(os.path.join(HERE, "items_corpus.json"), encoding="utf-8"))

ROMAN = {"I": 1, "II": 2, "III": 3, "IV": 4, "V": 5, "VI": 6, "VII": 7, "VIII": 8, "IX": 9, "X": 10, "XI": 11, "XII": 12, "XIII": 13}


def norm_date(d):
    d = d.strip()
    if d.startswith("2 December 2027 (high-risk under Annex III)") or d.startswith("2 December 2027 (Annex III systems)"):
        return "2 December 2027 (Annex III) or 2 August 2028 (Annex I)"
    if d.startswith("2 February 2025; points (ba)"):
        return "2 February 2025 (points (ba) and (bb) from 2 December 2026)"
    return d


for a in ARTS:
    a["applies_from"] = norm_date(a["applies_from"])
    a["part"] = "regulation"
    m = re.match(r"Chapter ([IVX]+)", a["chapter"])
    a["chap_no"] = ROMAN[m.group(1)] if m else 99
    a["chap_label"] = a["chapter"] if m else "Annexes"
    n = re.search(r"(\d+)([a-z]?)$", a["id"])
    a["num"] = int(n.group(1))
    a["suffix"] = n.group(2)
    a["short"] = (str(a["num"]) + a["suffix"]) if a["id"].startswith("art") else a["number"].replace("Annex ", "")
    a["order"] = (a["chap_no"], 0 if a["id"].startswith("art") else 1, a["num"], a["suffix"])
for c in CORPUS:
    c["part"] = "corpus"

CORPUS_GROUPS = OrderedDict([
    ("The Regulation and its amendment", ["regulation", "delegated-or-implementing-act"]),
    ("Commission guidelines and Q&As", ["commission-guidelines", "qa"]),
    ("Codes of practice and templates", ["code-of-practice", "template"]),
    ("Governance, enforcement and policy", ["policy"]),
    ("Standards", ["standards"]),
    ("EDPB and EDPS", ["edpb-edps"]),
    ("National implementation", ["national-law"]),
    ("Reference tools", ["reference-tool"]),
])
for c in CORPUS:
    c["group"] = next((g for g, ts in CORPUS_GROUPS.items() if c["type"] in ts), "Governance, enforcement and policy")

# chapters in order
chapters = OrderedDict()
for a in sorted(ARTS, key=lambda a: a["order"]):
    chapters.setdefault(a["chap_label"], []).append(a)

BIND_LABEL = {"provider": "Providers", "deployer": "Deployers", "importer": "Importers", "distributor": "Distributors", "gpai-provider": "GPAI providers", "notified-body": "Notified bodies", "authority": "Authorities", "commission": "Commission", "everyone": "Everyone", "institutional": "Institutional"}


def slug(s):
    return "ai-" + re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def art_html(a):
    chips = ['<span class="ai-chip ai-chip-date">applies %s</span>' % esc(a["applies_from"])]
    if a["omnibus"]:
        chips.append('<span class="ai-chip ai-chip-omni">amended by 2026/1744</span>')
    for b in a["binds"]:
        chips.append('<span class="ai-chip ai-chip-role">%s</span>' % esc(BIND_LABEL.get(b, b)))
    for t in a.get("topics") or []:
        chips.append('<span class="ai-chip ai-chip-topic">%s</span>' % esc(t.replace("-", " ")))
    rec = ""
    if a.get("recitals"):
        rec = '<p class="ai-rec">Recitals %s</p>' % ", ".join('<a href="https://artificialintelligenceact.eu/recital/%d/" target="_blank" rel="noopener noreferrer" title="Recital %d on the AI Act Explorer">%d</a>' % (r, r, r) for r in a["recitals"])
    omni = '<p class="ai-omni">%s</p>' % esc(a["omnibus"]) if a["omnibus"] else ""
    return ('<article class="ai-entry" id="%s" data-part="regulation" data-group="%s" data-date="%s" data-roles="%s" data-omni="%s" data-recitals="%s">'
            '<h3 class="ai-title"><a href="%s" target="_blank" rel="noopener noreferrer">%s: %s</a></h3>'
            '<p class="ai-meta">%s</p><p class="ai-take">%s</p>%s%s</article>'
            % (esc(a["id"]), esc(a["chap_label"]), esc(a["applies_from"]), esc(" ".join(a["binds"])), "yes" if a["omnibus"] else "no",
               " ".join(str(r) for r in (a.get("recitals") or [])),
               esc(a["url"]), esc(a["number"]), esc(a["title"]), "".join(chips), esc(a["takeaway"]), omni, rec))


def doc_html(c):
    chips = ['<span class="ai-chip ai-chip-type">%s</span>' % esc(c["type"].replace("-", " "))]
    if c["status"] not in ("final", "in force"):
        chips.append('<span class="ai-chip ai-chip-status">%s</span>' % esc(c["status"]))
    for ar in c.get("articles") or []:
        chips.append('<span class="ai-chip ai-chip-art">%s</span>' % esc(ar))
    for t in c.get("topics") or []:
        chips.append('<span class="ai-chip ai-chip-topic">%s</span>' % esc(t.replace("-", " ")))
    if c.get("source") == "knowledge":
        chips.append('<span class="ai-chip ai-chip-src" title="Page could not be fetched; written from the linking page or prior knowledge">not fetched</span>')
    return ('<article class="ai-entry" id="%s" data-part="corpus" data-group="%s" data-date="" data-roles="" data-omni="no" data-recitals="">'
            '<h3 class="ai-title"><a href="%s" target="_blank" rel="noopener noreferrer">%s</a></h3>'
            '<p class="ai-meta"><span class="ai-date">%s &middot; %s</span>%s</p><p class="ai-take">%s</p></article>'
            % (esc(c["id"]), esc(c["group"]), esc(c["url"]), esc(c["title"]), esc(c["date"]), esc(c["issuer"]), "".join(chips), esc(c["takeaway"])))


N_RECITALS = 180
CITED_RECITALS = set()
for a in ARTS:
    CITED_RECITALS.update(a.get("recitals") or [])


def ch_short(label):
    """'Chapter III: High-Risk AI Systems' -> ('Chapter III', 'High-Risk AI Systems')."""
    m = re.match(r"(Chapter [IVX]+):\s*(.*)", label)
    return (m.group(1), m.group(2)) if m else (label, "")


def art_range(items):
    arts = [a for a in items if a["id"].startswith("art")]
    if not arts:
        return ""
    if len(arts) == 1:
        return "Art. " + arts[0]["short"]
    return "Arts. %s–%s" % (arts[0]["short"], arts[-1]["short"])


def sections_of(items):
    """Ordered list of (section label or '', [items])."""
    out = OrderedDict()
    for a in items:
        out.setdefault(a.get("section") or "", []).append(a)
    return list(out.items())


def rec_grid(extra=""):
    """Empty grid; the page script fills it with one button per recital."""
    return '<div class="ai-rec-grid%s" data-total="%d" data-cited="%s"></div>' % (extra, N_RECITALS, " ".join(str(n) for n in sorted(CITED_RECITALS)))


def toc_item(a, deep=False):
    label = "%s: %s" % (a["number"], a["title"])
    return ('<div class="ai-toc-item"><a class="ai-toc-link%s" href="#%s" data-target="%s">%s</a>'
            '<span class="ai-toc-actions"><a href="%s" target="_blank" rel="noopener noreferrer" title="Open on the AI Act Explorer"><i class="fas fa-external-link-alt"></i></a>'
            '<button type="button" class="ai-toc-copy" data-anchor="%s" title="Copy link to this entry"><i class="fas fa-link"></i></button></span></div>'
            % (" ai-toc-deep" if deep else "", esc(a["id"]), esc(a["id"]), esc(label), esc(a["url"]), esc(a["id"])))


def toc_collapsible(key, head_html, body_html, cls="ai-toc-ch"):
    return ('<div class="ai-toc-block"><button type="button" class="%s" aria-expanded="false" aria-controls="ai-tsub-%s">%s<i class="fas fa-chevron-right ai-toc-arrow"></i></button>'
            '<div class="ai-toc-sub" id="ai-tsub-%s" hidden>%s</div></div>' % (cls, key, head_html, key, body_html))


def build_toc():
    out = ['<nav class="ai-toc" id="ai-toc" aria-label="Contents">']
    out.append('<div class="ai-toc-head"><button type="button" class="ai-toc-search" id="ai-toc-search" title="Jump to search (Ctrl+K)"><i class="fas fa-search"></i><span>Search</span><kbd>Ctrl+K</kbd></button>'
               '<button type="button" class="ai-toc-close" id="ai-toc-close" aria-label="Close contents"><i class="fas fa-times"></i><span>Close</span></button></div>')
    out.append('<a class="ai-toc-overview is-active" id="ai-toc-overview-link" href="#ai-overview"><i class="fas fa-th-list"></i>Overview</a>')
    out.append('<div class="ai-toc-views" role="group" aria-label="Contents view"><button type="button" class="ai-toc-view is-on" data-view="grouped" aria-pressed="true"><i class="fas fa-sitemap"></i>Chapters</button><button type="button" class="ai-toc-view" data-view="flat" aria-pressed="false"><i class="fas fa-list-ul"></i>All articles</button></div>')
    # grouped view
    out.append('<div class="ai-toc-items" id="ai-toc-grouped">')
    for ch, items in chapters.items():
        if ch == "Annexes":
            continue
        lab, title = ch_short(ch)
        key = "ch-%d" % items[0]["chap_no"]
        head = ('<span class="ai-toc-info"><span class="ai-toc-id"><span class="ai-toc-label">%s</span><span class="ai-toc-range">%s</span></span><span class="ai-toc-title">%s</span></span>'
                % (esc(lab), esc(art_range(items)), esc(title)))
        secs = sections_of(items)
        if len(secs) == 1 and secs[0][0] == "":
            body = "".join(toc_item(a) for a in items)
        else:
            body = []
            for i, (sec, sitems) in enumerate(secs):
                if not sec:
                    body.append("".join(toc_item(a) for a in sitems))
                    continue
                m = re.match(r"(Section \d+):\s*(.*)", sec)
                slab, stitle = (m.group(1), m.group(2)) if m else (sec, "")
                shead = ('<span class="ai-toc-info"><span class="ai-toc-id"><span class="ai-toc-label ai-toc-seclabel">%s</span><span class="ai-toc-range">%s</span></span><span class="ai-toc-title ai-toc-sectitle">%s</span></span>'
                         % (esc(slab), esc(art_range(sitems)), esc(stitle)))
                body.append(toc_collapsible("%s-s%d" % (key, i + 1), shead, "".join(toc_item(a, True) for a in sitems), cls="ai-toc-sec"))
            body = "".join(body)
        out.append(toc_collapsible(key, head, body))
    out.append('<div class="ai-toc-divider"></div>')
    ann = chapters.get("Annexes", [])
    out.append(toc_collapsible("anx", '<span class="ai-toc-info"><span class="ai-toc-id"><span class="ai-toc-label">Annexes</span><span class="ai-toc-range">%d</span></span></span>' % len(ann), "".join(toc_item(a) for a in ann)))
    out.append(toc_collapsible("rec", '<span class="ai-toc-info"><span class="ai-toc-id"><span class="ai-toc-label">Recitals</span><span class="ai-toc-range">%d</span></span><span class="ai-toc-title">Click a number to show the provisions that cite it</span></span>' % N_RECITALS, rec_grid()))
    out.append('<div class="ai-toc-divider"></div>')
    p2 = []
    for g in CORPUS_GROUPS:
        n = sum(1 for c in CORPUS if c["group"] == g)
        if n:
            p2.append('<div class="ai-toc-item"><a class="ai-toc-link ai-toc-group" href="#%s" data-target="%s">%s <span class="ai-n">%d</span></a></div>' % (slug(g), slug(g), esc(g), n))
    out.append(toc_collapsible("p2", '<span class="ai-toc-info"><span class="ai-toc-id"><span class="ai-toc-label">Part 2</span><span class="ai-toc-range">%d docs</span></span><span class="ai-toc-title">Guidance and implementation</span></span>' % len(CORPUS), "".join(p2)))
    out.append('</div>')
    # flat view
    out.append('<div class="ai-toc-items" id="ai-toc-flat" hidden></div>')
    out.append('</nav>')
    return "".join(out)


ART_LABEL = {}
for a in ARTS:
    ART_LABEL[a["id"]] = a["number"]


def sum_links(text, mode="page"):
    """Replace {art-N} / {annex-N} markers with entry links (page) or labels (pdf)."""
    def rep(m):
        k = m.group(1)
        lab = ART_LABEL.get(k, k)
        if mode == "page":
            return '<a href="#%s">%s</a>' % (k, esc(lab))
        return esc(lab)
    return re.sub(r"\{((?:art|annex)-[0-9a-z]+)\}", rep, esc(text) if mode == "page" else esc(text))


def build_summary():
    out = ['<details class="ai-summary" id="ai-summary"><summary>High-level summary <span class="ai-sum-hint">The Act in ten short sections; open any one</span></summary><div class="ai-sum-cols">']
    for head, sub, blocks in SUMMARY:
        out.append('<details class="ai-sum-sec"><summary><h3>%s</h3><span class="ai-sum-sub">%s</span></summary><div class="ai-sum-body">' % (esc(head), esc(sub)))
        for b in blocks:
            if isinstance(b, list):
                out.append("<ul>" + "".join("<li>%s</li>" % sum_links(x) for x in b) + "</ul>")
            else:
                out.append("<p>%s</p>" % sum_links(b))
        out.append("</div></details>")
    out.append("</div></details>")
    return "".join(out)


def build_jump():
    items = [("#ai-summary", "High-level summary"), ("#ai-checker", "Obligations checker"), ("#ai-filters", "Filters and search"),
             ("#ai-overview", "Structure of the Act"), ("#ai-part-1", "Part 1: the Regulation"), ("#ai-part-2", "Part 2: guidance and implementation"), ("#ai-sources-note", "Sources")]
    return '<nav class="ai-jump" aria-label="On this page"><span class="ai-jump-label">On this page</span>%s</nav>' % "".join('<a href="%s">%s</a>' % (h, t) for h, t in items)


def build_checker():
    return ('<details class="ai-checker" id="ai-checker"><summary>Which obligations apply? A checker <span class="ai-sum-hint">Ten questions at most; open to start</span></summary>'
            '<p class="ai-ck-intro">%s</p><div class="ai-ck-body"></div></details>' % esc(CHECKER_INTRO))


def build_overview():
    n_arts = sum(1 for a in ARTS if a["id"].startswith("art"))
    ann = chapters.get("Annexes", [])
    out = ['<div class="ai-overview" id="ai-overview"><h2 class="ai-overview-title">Structure of the Act</h2><div class="ai-ov-cols">']
    out.append('<div class="ai-ov-col"><div class="ai-ov-label"><i class="fas fa-file-alt"></i> Articles <span class="ai-ov-count">%d</span></div><div class="ai-ov-desc">The main substance of the Act, in %d chapters</div><ul class="ai-ov-items">' % (n_arts, len(chapters) - (1 if ann else 0)))
    for ch, items in chapters.items():
        if ch == "Annexes":
            continue
        lab, title = ch_short(ch)
        out.append('<li><a class="ai-ov-item" href="#%s"><span class="ai-ov-head"><span class="ai-ov-num">%s</span><span class="ai-ov-range">%s</span></span><span class="ai-ov-link">%s</span></a></li>' % (slug(ch), esc(lab), esc(art_range(items)), esc(title)))
    out.append('</ul></div>')
    out.append('<div class="ai-ov-col"><div class="ai-ov-label"><i class="fas fa-paperclip"></i> Annexes <span class="ai-ov-count">%d</span></div><div class="ai-ov-desc">Supplementary lists, procedures and templates</div><ul class="ai-ov-items">' % len(ann))
    for a in ann:
        out.append('<li><a class="ai-ov-item" href="#%s"><span class="ai-ov-head"><span class="ai-ov-num">%s</span></span><span class="ai-ov-link">%s</span></a></li>' % (esc(a["id"]), esc(a["number"]), esc(a["title"])))
    out.append('</ul></div>')
    out.append('<div class="ai-ov-col"><div class="ai-ov-label"><i class="fas fa-list"></i> Recitals <span class="ai-ov-count">%d</span></div><div class="ai-ov-desc">Context and reasoning behind the Act. Click a number to show the provisions that cite it; %d of the %d are cited in this digest.</div>' % (N_RECITALS, len(CITED_RECITALS), N_RECITALS))
    out.append(rec_grid(" ai-rec-grid-ov"))
    out.append('</div>')
    out.append('</div></div>')
    return "".join(out)


def date_sort_key(d):
    order = ["in force 1 August 2024", "2 February 2025", "2 August 2025", "27 July 2026", "2 August 2026", "2 December 2026", "2 December 2027", "2 August 2028"]
    for i, o in enumerate(order):
        if d.startswith(o):
            return (i, len(d))
    return (50, len(d))


def build_body():
    n_arts = sum(1 for a in ARTS if a["id"].startswith("art"))
    n_ann = len(ARTS) - n_arts
    n_omni = sum(1 for a in ARTS if a["omnibus"])
    dates = sorted({a["applies_from"] for a in ARTS}, key=date_sort_key)
    out = []
    out.append('<div class="ai-head">')
    out.append(build_jump())
    out.append('<div class="ai-intro">')
    out.append('<p>The EU AI Act for study, in two layers. Part 1 is Regulation (EU) 2024/1689 itself as amended by Regulation (EU) 2026/1744, the Digital Omnibus on AI in force since 27 July 2026: all %d articles (the 113 of the original text plus the six the Omnibus inserted) and %d annexes, grouped by chapter, each with a takeaway written from the consolidated text stating what it establishes, who it binds and what to do, its date of application, the recitals that explain it, and a flag on the %d provisions the Omnibus changed. Part 2 is the corpus around the Act as of %s: %d documents, from the Commission\'s guidelines, codes of practice, templates and Q&amp;As through the standardisation programme, EDPB and EDPS opinions including Opinion 28/2024 on AI models, national implementing laws and the reference tools, each with a takeaway and the articles it interprets.</p>' % (n_arts, n_ann, n_omni, DATE, len(CORPUS)))
    out.append('<p>Three limits, stated up front. A takeaway is a reading aid and the text governs; every entry links to the source. Application dates are the ones the consolidated text carries under Article 113 after the Omnibus; the high-risk chapter applies from 2 December 2027 for Annex III systems and 2 August 2028 for Annex I systems, not the 2 August 2026 date the original Act set. Guidance marked draft or consultation is not final and may change. None of this is legal advice.</p>')
    out.append('<p class="ai-privacy">Filters, search and the checker run in your browser. Nothing you type is sent anywhere.</p>')
    out.append("</div>")
    out.append(build_summary())
    out.append(build_checker())
    out.append('<div class="ai-filters" id="ai-filters" role="search">')
    out.append('<label>Search <input type="text" id="ai-q" placeholder="article, term, obligation" autocomplete="off"></label>')
    out.append('<label>Part <select id="ai-part"><option value="">Both parts</option><option value="regulation">Part 1: the Regulation</option><option value="corpus">Part 2: guidance and implementation</option></select></label>')
    out.append('<label>Binds <select id="ai-role"><option value="">Any role</option>%s</select></label>' % "".join('<option value="%s">%s</option>' % (k, v) for k, v in BIND_LABEL.items()))
    out.append('<label>Applies from (Part 1) <select id="ai-date"><option value="">Any date</option>%s</select></label>' % "".join('<option value="%s">%s</option>' % (esc(d), esc(d)) for d in dates))
    out.append('<label>Omnibus <select id="ai-omni"><option value="">All provisions</option><option value="yes">Changed by 2026/1744 only</option></select></label>')
    out.append('<p class="ai-count" id="ai-count" aria-live="polite"><span id="ai-count-text"></span> <button type="button" class="ai-clear ai-first" id="ai-first" hidden>Go to first result</button> <button type="button" class="ai-clear" id="ai-clear" hidden>Clear filters</button></p>')
    out.append('<div class="ai-results" id="ai-results" hidden><p class="ai-results-label" id="ai-results-label"></p><ol class="ai-results-list" id="ai-results-list"></ol></div>')
    out.append('<details class="ai-howto"><summary>How the filters work</summary><ul>'
               '<li><strong>Search</strong> matches any text in an entry: title, takeaway, chips, recital numbers, the Omnibus note. Type a word or an article number such as "Article 27" or "biometric". Ctrl+K puts the cursor here from anywhere on the page.</li>'
               '<li><strong>Part</strong> limits the list to Part 1 (the Regulation) or Part 2 (guidance and implementation).</li>'
               '<li><strong>Binds</strong> shows the provisions that place a duty on that role: providers, deployers, importers, distributors, GPAI providers, notified bodies, authorities, the Commission, everyone, or Union institutions. Part 2 documents carry no role and drop out.</li>'
               '<li><strong>Applies from</strong> shows the provisions with that date of application under Article 113 as amended. Part 1 only.</li>'
               '<li><strong>Omnibus</strong> keeps only the 43 provisions Regulation (EU) 2026/1744 changed or inserted.</li>'
               '<li><strong>Recital numbers</strong> in the Structure of the Act block, or in the side contents, show the provisions that cite that recital.</li>'
               '<li>Filters combine: an entry must satisfy every active filter. The count line says how many match; <em>Go to first result</em> scrolls to the first match and the list under it links the first ten. Chapter and group headings with no match disappear. <em>Clear filters</em> resets everything. Clicking an entry in the side contents that the filters hide also clears them.</li>'
               '</ul></details>')
    out.append("</div>")
    out.append('<p class="ai-index-label">Part 2, guidance and implementation. Jump to a group:</p><ul class="ai-index">')
    for g in CORPUS_GROUPS:
        n = sum(1 for c in CORPUS if c["group"] == g)
        if n:
            out.append('<li><a href="#%s">%s <span class="ai-n">%d</span></a></li>' % (slug(g), esc(g), n))
    out.append("</ul>")
    out.append(build_overview())
    out.append('</div>')
    out.append('<div class="ai-body">')
    out.append(build_toc())
    out.append('<div class="ai-main">')
    out.append('<div class="ai-groups">')
    out.append('<h2 class="ai-part" id="ai-part-1">Part 1: the Regulation, article by article</h2>')
    for ch, items in chapters.items():
        out.append('<details class="ai-group" id="%s" open><summary><span class="ai-group-name">%s</span><span class="ai-group-count" data-total="%d">%d %s</span></summary><div class="ai-group-body">' % (slug(ch), esc(ch), len(items), len(items), "provision" if len(items) == 1 else "provisions"))
        for a in items:
            out.append(art_html(a))
        out.append("</div></details>")
    out.append('<h2 class="ai-part" id="ai-part-2">Part 2: guidance and implementation</h2>')
    for g in CORPUS_GROUPS:
        items = sorted([c for c in CORPUS if c["group"] == g], key=lambda c: c["title"])
        if not items:
            continue
        out.append('<details class="ai-group" id="%s" open><summary><span class="ai-group-name">%s</span><span class="ai-group-count" data-total="%d">%d documents</span></summary><div class="ai-group-body">' % (slug(g), esc(g), len(items), len(items)))
        for c in items:
            out.append(doc_html(c))
        out.append("</div></details>")
    out.append("</div>")
    out.append('<p class="ai-sources-note" id="ai-sources-note">Sources: every entry links to its primary page, the AI Act Explorer for the provisions and the issuing body for the documents. The printable digest in the site\'s outputs folder lists all %d numbered sources. Snapshot %s.</p>' % (len(ARTS) + len(CORPUS), DATE))
    out.append("</div>")
    out.append("</div>")
    out.append('<div class="ai-toc-fold" id="ai-toc-fold" role="group" aria-label="Contents blocks" hidden><button type="button" class="ai-toc-fold-btn" id="ai-expand" title="Expand all blocks in the contents" aria-label="Expand all"><i class="fas fa-angle-double-down"></i><span>Exp</span></button><button type="button" class="ai-toc-fold-btn" id="ai-collapse" title="Collapse all blocks in the contents" aria-label="Collapse all"><i class="fas fa-angle-double-up"></i><span>Col</span></button></div>')
    out.append('<button type="button" class="ai-top" id="ai-top" aria-label="Back to top" hidden><i class="fas fa-arrow-up"></i> Top</button>')
    out.append('<div class="ai-toc-backdrop" id="ai-toc-backdrop" hidden></div><button type="button" class="ai-toc-fab" id="ai-toc-open" aria-controls="ai-toc" aria-expanded="false"><i class="fas fa-list"></i> Contents</button>')
    return "\n".join(out)


JS = r"""
(function () {
	var q = document.getElementById('ai-q'), part = document.getElementById('ai-part'),
	    role = document.getElementById('ai-role'), date = document.getElementById('ai-date'),
	    omni = document.getElementById('ai-omni'), count = document.getElementById('ai-count-text'),
	    clearBtn = document.getElementById('ai-clear');
	var groups = Array.prototype.slice.call(document.querySelectorAll('.ai-group'));
	var total = document.querySelectorAll('.ai-entry').length;
	var recital = 0;
	var firstBtn = document.getElementById('ai-first'), results = document.getElementById('ai-results'),
	    resultsLabel = document.getElementById('ai-results-label'), resultsList = document.getElementById('ai-results-list');
	firstBtn.addEventListener('click', function () {
		var first = document.querySelector('.ai-entry:not([hidden])');
		if (!first) return;
		var d = first.closest('details'); if (d && !d.open) d.open = true;
		first.scrollIntoView({ block: 'start' });
		history.replaceState(null, '', '#' + first.id);
	});

	/* ---------------------------------------------------------------- filters */
	function apply() {
		var qq = q.value.trim().toLowerCase(), pp = part.value, rr = role.value, dd = date.value, oo = omni.value, shown = 0;
		var rs = recital ? String(recital) : '';
		groups.forEach(function (g) {
			var visible = 0;
			Array.prototype.forEach.call(g.querySelectorAll('.ai-entry'), function (el) {
				var isReg = el.getAttribute('data-part') === 'regulation';
				var ok = (!pp || el.getAttribute('data-part') === pp)
					&& (!rr || (isReg && el.getAttribute('data-roles').split(' ').indexOf(rr) !== -1))
					&& (!dd || (isReg && el.getAttribute('data-date') === dd))
					&& (!oo || (isReg && el.getAttribute('data-omni') === 'yes'))
					&& (!rs || (isReg && el.getAttribute('data-recitals').split(' ').indexOf(rs) !== -1))
					&& (!qq || el.textContent.toLowerCase().indexOf(qq) !== -1);
				el.hidden = !ok;
				if (ok) visible++;
			});
			g.hidden = visible === 0;
			var c = g.querySelector('.ai-group-count');
			c.textContent = visible === parseInt(c.getAttribute('data-total'), 10) ? c.getAttribute('data-default') : visible + ' of ' + c.getAttribute('data-total') + ' shown';
			shown += visible;
		});
		Array.prototype.forEach.call(document.querySelectorAll('.ai-part'), function (h) {
			var next = h.nextElementSibling, any = false;
			while (next && !next.classList.contains('ai-part')) { if (next.classList.contains('ai-group') && !next.hidden) any = true; next = next.nextElementSibling; }
			h.hidden = !any;
		});
		var active = !!(qq || pp || rr || dd || oo || recital);
		count.textContent = 'Showing ' + shown + ' of ' + total + ' entries.' + (recital ? (shown ? ' Provisions citing Recital ' + recital + '.' : ' No entry cites Recital ' + recital + '.') : '');
		clearBtn.hidden = !active;
		firstBtn.hidden = !(active && shown);
		var vis = active ? Array.prototype.filter.call(document.querySelectorAll('.ai-entry'), function (el) { return !el.hidden; }) : [];
		results.hidden = !(active && shown);
		if (active && shown) {
			resultsLabel.textContent = shown <= 10 ? 'Matching entries:' : 'First 10 of ' + shown + ' matching entries:';
			resultsList.innerHTML = vis.slice(0, 10).map(function (el) {
				var t = el.querySelector('.ai-title a'); var g = el.closest('.ai-group'); var gname = g ? g.querySelector('.ai-group-name').textContent : '';
				return '<li><a href="#' + el.id + '">' + t.textContent + '</a><span class="ai-results-group">' + gname + '</span></li>';
			}).join('');
		}
		Array.prototype.forEach.call(document.querySelectorAll('.ai-rec-btn'), function (b) { b.classList.toggle('is-on', parseInt(b.getAttribute('data-recital'), 10) === recital); });
		Array.prototype.forEach.call(document.querySelectorAll('.ai-toc-link[data-target]'), function (l) {
			var t = document.getElementById(l.getAttribute('data-target'));
			l.classList.toggle('is-hidden', !!(t && t.classList.contains('ai-entry') && t.hidden));
		});
	}
	function clearAll() { q.value = ''; part.value = ''; role.value = ''; date.value = ''; omni.value = ''; recital = 0; apply(); }
	groups.forEach(function (g) { var c = g.querySelector('.ai-group-count'); c.setAttribute('data-default', c.textContent); });
	[q, part, role, date, omni].forEach(function (el) { el.addEventListener('input', apply); el.addEventListener('change', apply); });
	clearBtn.addEventListener('click', clearAll);

	/* --------------------------------------------------------- recital grids */
	Array.prototype.forEach.call(document.querySelectorAll('.ai-rec-grid'), function (grid) {
		var n = parseInt(grid.getAttribute('data-total'), 10), cited = grid.getAttribute('data-cited').split(' '), frag = document.createDocumentFragment();
		for (var i = 1; i <= n; i++) {
			var b = document.createElement('button'); b.type = 'button'; b.className = 'ai-rec-btn'; b.textContent = i; b.setAttribute('data-recital', i);
			if (cited.indexOf(String(i)) === -1) { b.className += ' ai-rec-none'; b.title = 'No entry in this digest cites Recital ' + i; }
			else { b.title = 'Show the provisions that cite Recital ' + i; }
			frag.appendChild(b);
		}
		grid.appendChild(frag);
	});
	document.addEventListener('click', function (e) {
		var b = e.target.closest && e.target.closest('.ai-rec-btn');
		if (!b) return;
		var n = parseInt(b.getAttribute('data-recital'), 10);
		recital = recital === n ? 0 : n;
		apply();
		closeDrawer();
		if (recital) { var first = document.querySelector('.ai-entry:not([hidden])'); if (first) first.scrollIntoView({ block: 'start' }); }
	});

	/* ------------------------------------------------------------ side TOC */
	var toc = document.getElementById('ai-toc'), grouped = document.getElementById('ai-toc-grouped'), flat = document.getElementById('ai-toc-flat');
	var opener = document.getElementById('ai-toc-open'), closer = document.getElementById('ai-toc-close');
	Array.prototype.forEach.call(grouped.querySelectorAll('.ai-toc-item'), function (it) { flat.appendChild(it.cloneNode(true)); });
	Array.prototype.forEach.call(flat.querySelectorAll('.ai-toc-group'), function (l) { l.parentNode.parentNode.removeChild(l.parentNode); });
	Array.prototype.forEach.call(flat.querySelectorAll('.ai-toc-deep'), function (l) { l.classList.remove('ai-toc-deep'); });
	var fold = document.getElementById('ai-toc-fold'), foldGrouped = true, foldMq = window.matchMedia('(max-width: 1100px)');
	function setView(v) {
		grouped.hidden = v !== 'grouped'; flat.hidden = v !== 'flat'; foldGrouped = v === 'grouped'; syncFold();
		Array.prototype.forEach.call(toc.querySelectorAll('.ai-toc-view'), function (b) { var on = b.getAttribute('data-view') === v; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
		try { localStorage.setItem('ai-toc-view', v); } catch (err) {}
	}
	Array.prototype.forEach.call(toc.querySelectorAll('.ai-toc-view'), function (b) { b.addEventListener('click', function () { setView(b.getAttribute('data-view')); }); });
	try { if (localStorage.getItem('ai-toc-view') === 'flat') setView('flat'); } catch (err) {}
	function setOpen(btn, open) {
		btn.setAttribute('aria-expanded', open ? 'true' : 'false');
		var sub = document.getElementById(btn.getAttribute('aria-controls')); if (sub) sub.hidden = !open;
	}
	toc.addEventListener('click', function (e) {
		var btn = e.target.closest && e.target.closest('.ai-toc-ch, .ai-toc-sec');
		if (btn) { setOpen(btn, btn.getAttribute('aria-expanded') !== 'true'); return; }
		var cp = e.target.closest && e.target.closest('.ai-toc-copy');
		if (cp) {
			var url = location.href.split('#')[0] + '#' + cp.getAttribute('data-anchor');
			var done = function () { cp.classList.add('is-done'); cp.title = 'Copied'; setTimeout(function () { cp.classList.remove('is-done'); cp.title = 'Copy link to this entry'; }, 1500); };
			if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, function () { window.prompt('Copy this link', url); });
			else window.prompt('Copy this link', url);
			return;
		}
		var link = e.target.closest && e.target.closest('.ai-toc-link, .ai-toc-overview');
		if (link) {
			var id = link.getAttribute('data-target') || link.getAttribute('href').slice(1), t = document.getElementById(id);
			if (t && t.classList.contains('ai-entry') && t.hidden) { clearAll(); }
			if (t) { var d = t.closest('details'); if (d && !d.open) d.open = true; }
			closeDrawer();
		}
	});
	var backdrop = document.getElementById('ai-toc-backdrop');
	function openDrawer() { toc.classList.add('is-open'); document.body.classList.add('ai-toc-drawer'); opener.setAttribute('aria-expanded', 'true'); backdrop.hidden = false; }
	function closeDrawer() { toc.classList.remove('is-open'); document.body.classList.remove('ai-toc-drawer'); opener.setAttribute('aria-expanded', 'false'); backdrop.hidden = true; }
	backdrop.addEventListener('click', closeDrawer);
	opener.addEventListener('click', function () { if (toc.classList.contains('is-open')) closeDrawer(); else openDrawer(); });
	closer.addEventListener('click', closeDrawer);
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') closeDrawer();
		if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); closeDrawer(); q.focus(); q.select(); q.scrollIntoView({ block: 'center' }); }
	});
	document.getElementById('ai-toc-search').addEventListener('click', function () { closeDrawer(); q.focus(); q.scrollIntoView({ block: 'center' }); });

	/* Any in-page link (jump bar, overview cards, jump lists, recital links): open the target group first. */
	document.addEventListener('click', function (e) {
		var a = e.target.closest && e.target.closest('a[href^="#"]');
		if (!a || toc.contains(a)) return;
		var t = document.getElementById(a.getAttribute('href').slice(1));
		if (!t) return;
		if (t.classList.contains('ai-entry') && t.hidden) clearAll();
		var d = t.tagName === 'DETAILS' ? t : t.closest('details');
		if (d && !d.open) d.open = true;
		if (t.classList.contains('ai-group')) setTimeout(function () { mark(t.id); }, 50);
	});

	/* Back to top */
	var topBtn = document.getElementById('ai-top');
	topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
	window.addEventListener('scroll', function () { topBtn.hidden = window.scrollY < 600; }, { passive: true });

	/* expand or collapse every block in the contents: two small floating buttons at the bottom left,
	   shown once the contents has scrolled into the upper half of the screen (in the drawer: whenever it is open) */
	function setAll(open) {
		Array.prototype.forEach.call(toc.querySelectorAll('.ai-toc-ch, .ai-toc-sec'), function (b) { setOpen(b, open); });
		if (!open) toc.scrollTop = 0;
	}
	function syncFold() { fold.hidden = !foldGrouped || (!foldMq.matches && toc.getBoundingClientRect().top > window.innerHeight * 0.5); }
	document.getElementById('ai-expand').addEventListener('click', function () { setAll(true); });
	document.getElementById('ai-collapse').addEventListener('click', function () { setAll(false); });
	window.addEventListener('scroll', syncFold, { passive: true });
	window.addEventListener('resize', syncFold);
	syncFold();

	/* ------------------------------------------------------------ scrollspy */
	var links = {};
	Array.prototype.forEach.call(toc.querySelectorAll('.ai-toc-link[data-target]'), function (l) { var k = l.getAttribute('data-target'); (links[k] = links[k] || []).push(l); });
	var overviewLink = document.getElementById('ai-toc-overview-link'), overview = document.getElementById('ai-overview');
	var current = null;
	function mark(id) {
		if (id === current) return;
		if (current && links[current]) links[current].forEach(function (l) { l.classList.remove('is-active'); });
		current = id;
		overviewLink.classList.toggle('is-active', !id);
		if (!id || !links[id]) return;
		links[id].forEach(function (l) {
			l.classList.add('is-active');
			var p = l.parentNode;
			while (p && p !== toc) { if (p.classList.contains('ai-toc-sub') && p.hidden) { var b = toc.querySelector('[aria-controls="' + p.id + '"]'); if (b) setOpen(b, true); } p = p.parentNode; }
		});
		if (!toc.classList.contains('is-open')) {
			var vis = links[id].filter(function (l) { return l.offsetParent !== null; })[0];
			if (vis) { var r = vis.getBoundingClientRect(), tr = toc.getBoundingClientRect(); if (r.top < tr.top + 40 || r.bottom > tr.bottom - 40) toc.scrollTop += r.top - tr.top - tr.height / 2; }
		}
	}
	if ('IntersectionObserver' in window) {
		var targets = Array.prototype.slice.call(document.querySelectorAll('.ai-entry, .ai-group[id]'));
		var io = new IntersectionObserver(function () {
			var top = window.innerHeight * 0.28, best = null, bestD = Infinity;
			targets.forEach(function (t) {
				if (t.hidden || (t.classList.contains('ai-entry') && t.closest('details') && !t.closest('details').open)) return;
				var r = t.getBoundingClientRect();
				if (r.bottom < 0 || r.top > window.innerHeight) return;
				var d = Math.abs(r.top - top);
				if (r.top <= top + 8 && r.bottom > top && d < bestD) { best = t; bestD = d; }
			});
			if (best) mark(best.classList.contains('ai-entry') && best.getAttribute('data-part') === 'corpus' ? best.closest('.ai-group').id : best.id);
			else if (overview && overview.getBoundingClientRect().bottom > 0) mark(null);
		}, { threshold: [0, 0.1, 0.5, 1] });
		targets.forEach(function (t) { io.observe(t); });
	}

	apply();
})();
"""

CSS = """/* AI Act digest: scoped styles, same pattern as the EDPB and cookie digests, plus a side table of contents. */

#ai-act-digest { max-width: none; margin: 0; }
.ai-head { max-width: none; }
.ai-main { min-width: 0; }
.ai-intro p { margin-bottom: 1em; }
.ai-jump { display: flex; flex-wrap: wrap; gap: 0.4em 0.6em; align-items: center; margin: 0 0 1.5em 0; padding: 0.75em 1em; border: solid 1px rgba(255,255,255,0.1); border-radius: 0.5em; background: rgba(255,255,255,0.02); font-size: 0.85em; }
.ai-jump-label { text-transform: uppercase; letter-spacing: 0.1em; font-size: 0.85em; color: rgba(255,255,255,0.5); margin-right: 0.4em; }
.ai-jump a { display: inline-block; padding: 0.25em 0.8em; border: solid 1px rgba(255,255,255,0.15); border-radius: 1em; color: rgba(255,255,255,0.85); border-bottom: solid 1px rgba(255,255,255,0.15); }
.ai-jump a:hover { border-color: #7fb2e5; color: #fff; background: rgba(127,178,229,0.1); }
.ai-sum-hint { font-weight: normal; font-size: 0.75em; color: rgba(255,255,255,0.5); margin-left: auto; padding-right: 1.5em; }
.ai-sources-note { margin: 2em 0 0 0; font-size: 0.85em; color: rgba(255,255,255,0.5); }
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
#ai-summary, #ai-checker, #ai-filters, .ai-part { scroll-margin-top: 5em; }
.ai-privacy { color: rgba(255,255,255,0.55); font-size: 0.9em; }

/* Two columns from 1101px: the side contents and the digest. */
@media (min-width: 1101px) {
	.ai-body { display: grid; grid-template-columns: 19em minmax(0, 1fr); gap: 0 2.5em; align-items: start; margin-top: 1.5em; }
	.ai-toc { position: sticky; top: 5em; max-height: calc(100vh - 6em); overflow-y: auto; overscroll-behavior: contain; }
	.ai-toc-fab, .ai-toc-close, .ai-toc-backdrop { display: none; }
}

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
.ai-toc-seclabel { color: rgba(255,255,255,0.7); }
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
.ai-toc-group { font-weight: bold; }
.ai-toc-actions { flex: none; display: none; gap: 0.1em; padding-top: 0.25em; }
.ai-toc-item:hover .ai-toc-actions, .ai-toc-item:focus-within .ai-toc-actions { display: flex; }
.ai-toc-actions a, .ai-toc-actions button { padding: 0.15em 0.35em !important; color: rgba(255,255,255,0.45) !important; border-bottom: none; font-size: 0.85em; border-radius: 0.3em !important; }
.ai-toc-actions a:hover, .ai-toc-actions button:hover { color: #fff !important; background: rgba(255,255,255,0.08); }
.ai-toc-copy.is-done { color: #9fe0a8 !important; }
.ai-toc-divider { height: 1px; background: rgba(255,255,255,0.12); margin: 0.5em 0.6em; }
#ai-toc-flat .ai-toc-link { font-size: 0.88em; }

/* Recital grids (side and overview) */
.ai-rec-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(2.4em, 1fr)); gap: 0.25em; padding: 0.3em 0.4em 0.3em 0; }
.ai-rec-btn {
	display: block !important; padding: 0.2em 0 !important; text-align: center !important; font-size: 0.8em !important;
	border: solid 1px rgba(255,255,255,0.15) !important; border-radius: 0.3em !important; color: rgba(255,255,255,0.75) !important; background: rgba(255,255,255,0.03);
	height: auto; line-height: 1.5; letter-spacing: 0; text-transform: none; white-space: nowrap;
}
.ai-rec-btn::after { display: none; }
.ai-rec-btn:hover { border-color: #7fb2e5 !important; color: #fff !important; }
.ai-rec-btn.is-on { background: #7fb2e5; color: #1b2a4a !important; border-color: #7fb2e5 !important; font-weight: bold; }
.ai-rec-btn.ai-rec-none { opacity: 0.35; }

/* Mobile drawer and floating button, below 1101px */
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
	#ai-toc-grouped { padding-bottom: 5em; }
	.ai-toc-fab {
		position: fixed; right: 1.25em; bottom: 1.25em; z-index: 1050; height: auto; line-height: 1.4; padding: 0.7em 1.2em; font-size: 0.85em;
		letter-spacing: 0.05em; text-transform: uppercase; border-radius: 2em; background: #4267a6; border: 0 !important; box-shadow: 0 0.3em 1em rgba(0,0,0,0.4); white-space: nowrap;
	}
	.ai-toc-fab::after { display: none; }
}

.ai-filters {
	display: grid; grid-template-columns: 2fr 1.3fr 1fr 1.3fr 1fr; gap: 0.75em 1em; align-items: end;
	margin: 1.5em 0 1em 0; padding: 1em 1.25em;
	border: solid 1px rgba(255,255,255,0.1); border-radius: 0.5em; background: rgba(255,255,255,0.02);
}
.ai-filters label { display: block; font-size: 0.8em; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.1em; }
.ai-filters input, .ai-filters select { margin-top: 0.4em; }
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
@media (max-width: 736px) { .ai-results-list { columns: 1; } }

.ai-index-label { color: rgba(255,255,255,0.55); font-size: 0.9em; margin: 1.5em 0 0.5em 0; }
.ai-index {
	display: grid; grid-template-columns: repeat(auto-fit, minmax(16em, 1fr)); gap: 0.4em 1.5em;
	margin: 0 0 1.5em 0; padding: 1em 1.25em;
	border: solid 1px rgba(255,255,255,0.1); border-radius: 0.5em; background: rgba(255,255,255,0.02); list-style: none;
}
.ai-index li { list-style: none; font-size: 0.9em; }
.ai-index a { color: #7fb2e5; border-bottom: none; }
.ai-index a:hover { color: #fff; }
.ai-n { color: rgba(255,255,255,0.45); font-size: 0.85em; margin-left: 0.3em; }

/* Structure of the Act: three columns, articles by chapter, annexes, recitals */
.ai-overview { margin: 0 0 2em 0; padding: 1.25em; border: solid 1px rgba(255,255,255,0.12); border-radius: 0.5em; background: rgba(255,255,255,0.02); scroll-margin-top: 5em; }
.ai-overview-title { font-size: 1.1em; margin: 0 0 1em 0; text-transform: none; letter-spacing: 0; color: #fff; }
.ai-ov-cols { display: grid; grid-template-columns: 1.3fr 1fr 1.2fr; gap: 1.75em; align-items: start; }
.ai-ov-label { font-weight: bold; color: #fff; font-size: 0.95em; display: flex; align-items: center; gap: 0.5em; }
.ai-ov-label i { color: #7fb2e5; }
.ai-ov-count { font-weight: normal; font-size: 0.8em; color: #1b2a4a; background: #7fb2e5; border-radius: 1em; padding: 0 0.6em; }
.ai-ov-desc { font-size: 0.8em; color: rgba(255,255,255,0.5); margin: 0.2em 0 0.8em 0; line-height: 1.4; }
.ai-ov-items { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.35em; }
.ai-ov-items li { padding: 0; margin: 0; }
.ai-ov-item { display: block; padding: 0.5em 0.7em; border: solid 1px rgba(255,255,255,0.1); border-radius: 0.4em; background: rgba(255,255,255,0.03); border-bottom: solid 1px rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); line-height: 1.3; }
.ai-ov-item:hover { border-color: #7fb2e5; background: rgba(127,178,229,0.08); color: #fff; }
.ai-ov-head { display: flex; justify-content: space-between; gap: 0.5em; align-items: baseline; margin-bottom: 0.1em; }
.ai-ov-num { font-size: 0.75em; font-weight: bold; text-transform: uppercase; letter-spacing: 0.08em; color: #fff; }
.ai-ov-range { font-size: 0.75em; color: #7fb2e5; white-space: nowrap; }
.ai-ov-link { display: block; font-size: 0.85em; }
.ai-rec-grid-ov { padding: 0; grid-template-columns: repeat(auto-fill, minmax(2.6em, 1fr)); }
@media (max-width: 900px) { .ai-ov-cols { grid-template-columns: 1fr 1fr; } .ai-ov-col:last-child { grid-column: 1 / -1; } }
@media (max-width: 560px) { .ai-ov-cols { grid-template-columns: 1fr; } }

.ai-groups { display: flex; flex-direction: column; gap: 0.75em; }
.ai-part { font-size: 1.1em; margin: 1.5em 0 0.25em 0; text-transform: none; letter-spacing: 0; color: #fff; }
.ai-groups > .ai-part:first-child { margin-top: 0; }
.ai-part[hidden] { display: none; }
.ai-group { border: solid 1px rgba(255,255,255,0.15); border-radius: 0.5em; background: rgba(255,255,255,0.03); overflow: hidden; scroll-margin-top: 5em; }
.ai-group summary {
	list-style: none; cursor: pointer; padding: 1em 3em 1em 1.25em; font-weight: bold; color: #fff;
	display: flex; align-items: baseline; justify-content: space-between; gap: 0.75em; position: relative;
}
.ai-group summary::-webkit-details-marker { display: none; }
.ai-group summary::after {
	content: '\\f107'; font-family: 'Font Awesome 5 Free'; font-weight: 900;
	position: absolute; right: 1.25em; top: 1.1em; color: rgba(255,255,255,0.4); transition: transform 0.2s ease;
}
.ai-group[open] summary::after { transform: rotate(180deg); }
.ai-group summary:hover { background: rgba(255,255,255,0.04); }
.ai-group-count { font-weight: normal; font-size: 0.8em; color: rgba(255,255,255,0.5); white-space: nowrap; }
.ai-group-body { padding: 0 1.25em 0.5em 1.25em; }

.ai-entry { padding: 0.9em 0 1em 0; border-top: solid 1px rgba(255,255,255,0.08); scroll-margin-top: 5em; }
.ai-entry[hidden] { display: none; }
.ai-entry:target { box-shadow: inset 3px 0 0 #7fb2e5; padding-left: 0.75em; }
.ai-title { font-size: 0.95em; margin: 0 0 0.35em 0; line-height: 1.4; text-transform: none; letter-spacing: 0; }
.ai-title a { color: #fff; border-bottom: dotted 1px rgba(255,255,255,0.3); }
.ai-title a:hover { color: #7fb2e5; border-bottom-color: #7fb2e5; }
.ai-meta { margin: 0 0 0.5em 0; font-size: 0.8em; color: rgba(255,255,255,0.5); display: flex; flex-wrap: wrap; gap: 0.4em 0.6em; align-items: center; }
.ai-chip { display: inline-block; padding: 0.1em 0.6em; border-radius: 1em; border: solid 1px rgba(255,255,255,0.15); font-size: 0.85em; line-height: 1.6; }
.ai-chip-date { border-color: rgba(127,178,229,0.5); color: #7fb2e5; }
.ai-chip-omni { border-color: rgba(255,200,120,0.5); color: #f2c98a; }
.ai-chip-role, .ai-chip-type { color: rgba(255,255,255,0.75); }
.ai-chip-art { color: #7fb2e5; }
.ai-chip-status { border-color: rgba(255,200,120,0.4); color: #f2c98a; }
.ai-chip-topic { color: rgba(255,255,255,0.6); }
.ai-chip-src { border-style: dashed; color: rgba(255,255,255,0.45); }
.ai-take { margin: 0; font-size: 0.95em; line-height: 1.6; color: rgba(255,255,255,0.72); }
.ai-omni { margin: 0.4em 0 0 0; font-size: 0.85em; color: #f2c98a; }
.ai-rec { margin: 0.3em 0 0 0; font-size: 0.8em; color: rgba(255,255,255,0.4); }
.ai-rec a { color: rgba(255,255,255,0.55); border-bottom: dotted 1px rgba(255,255,255,0.25); }
.ai-rec a:hover { color: #7fb2e5; }

@media (max-width: 736px) {
	#ai-act-digest { margin-top: 3em; padding-top: 2em; }
	.ai-filters { grid-template-columns: 1fr; }
	.ai-index { grid-template-columns: 1fr; }
	.ai-group summary { flex-direction: column; align-items: flex-start; gap: 0.25em; }
}
"""

HEAD = """<!DOCTYPE HTML>
<html lang="en">
	<head>
		<title>Simeon Atanasov | AI Act Digest</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<meta name="description" content="The EU AI Act for study: every article and annex of Regulation (EU) 2024/1689 as amended by the 2026 Digital Omnibus, with a takeaway, application date and amendment flag, plus the guidance corpus around it: Commission guidelines, codes of practice, templates, EDPB opinions and national laws.">
		<link rel="stylesheet" href="assets/css/main.css" />
		<noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
		<link rel="stylesheet" href="pages/ai-act-digest/ai-act-digest.css">
		<link rel="canonical" href="https://simeonatanasov.com/ai-act-digest.html">
		<!-- Progressive web app -->
		<link rel="manifest" href="/manifest.webmanifest" />
		<meta name="theme-color" content="#2a3860" />
		<meta name="mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
		<meta name="apple-mobile-web-app-title" content="Privacy Tools" />
		<link rel="apple-touch-icon" href="/images/favicon/apple-touch-icon.png" />
		<script src="/assets/js/pwa.js" defer></script>
	</head>
	<body class="is-preload">

		<!-- Header -->
			<header id="header">
				<a href="index.html" class="title">Simeon Atanasov</a>
				<nav>
					<ul>
						<li><a href="index.html">Home</a></li>
						<li><a href="power-bi.html">Power BI</a></li>
						<li><a href="my-asteroids-game.html">My Asteroids Game</a></li>
						<li><a href="risk-matrix-original.html">Risk Matrix</a></li>
						<li><a href="gdpr-readiness.html">GDPR Readiness</a></li>
						<li class="assessment-menu"><a href="privacy-ai-assessment.html">Privacy &amp; AI Assessment</a><ul class="assessment-submenu"><li><a href="privacy-ai-assessment.html#tool-privacy">Privacy Assessment</a></li><li><a href="privacy-ai-assessment.html#tool-dpia">Full DPIA</a></li><li><a href="privacy-ai-assessment.html#tool-lia">Legitimate Interest Test</a></li><li><a href="privacy-ai-assessment.html#tool-ai">AI Risk Assessment</a></li><li><a href="privacy-ai-assessment.html#tool-incident">Incident &amp; Breach Severity</a></li><li><a href="privacy-ai-assessment.html#tool-tpsa">Third-Party Security</a></li></ul></li>
						<li><a href="practical-privacy.html">Practical Privacy</a></li>
						<li><a href="practical-ai-act-advice.html">AI Act Advice</a></li>
						<li><a href="ai-act-digest.html" class="active">AI Act Digest</a></li>
						<li><a href="edpb-digest.html">EDPB Digest</a></li>
						<li><a href="cookie-digest.html">Cookie Digest</a></li>
						<li><a href="cookie-banner-scanner.html">Cookie Scanner</a></li>
					</ul>
				</nav>
			</header>

		<!-- Wrapper -->
			<div id="wrapper">

				<!-- Main -->
					<section id="main" class="wrapper">
						<div class="inner">
							<h1 class="major">AI Act Digest</h1>
						<section id="ai-act-digest">
"""

TAIL = """
						</section>
						</div>
					</section>

			</div>

		<!-- Footer -->
		<footer id="footer" class="wrapper style1-alt">
			<div class="inner">
				<ul class="menu">
					<li>&copy; Simeon. All rights reserved.</li>
					<li><a href="terms.html">Terms of use</a></li>
					<li><a href="privacy-notice.html">Privacy notice</a></li>
					<li><a href="cookie-notice.html">Cookie notice</a></li>
				</ul>
			</div>
		</footer>

		<!-- Scripts -->
			<script src="assets/js/jquery.min.js"></script>
			<script src="assets/js/jquery.scrollex.min.js"></script>
			<script src="assets/js/jquery.scrolly.min.js"></script>
			<script src="assets/js/browser.min.js"></script>
			<script src="assets/js/breakpoints.min.js"></script>
			<script src="assets/js/util.js"></script>
			<script src="assets/js/main.js"></script>
			<script>%s</script>
	</body>
</html>
"""

if __name__ == "__main__":
    page = HEAD + build_body() + TAIL % (JS + CHECKER_JS)
    page = page.replace("\r\n", "\n")
    outdir = "/mnt/user-data/outputs/site"
    os.makedirs(outdir + "/pages/ai-act-digest", exist_ok=True)
    open(outdir + "/ai-act-digest.html", "w", encoding="utf-8", newline="\n").write(page)
    open(outdir + "/pages/ai-act-digest/ai-act-digest.css", "w", encoding="utf-8", newline="\n").write(CSS + SUMMARY_CSS + CHECKER_CSS)
    json.dump({"regulation": sorted(ARTS, key=lambda a: a["order"]), "corpus": CORPUS}, open(os.path.join(HERE, "ai_act_digest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("html", len(page.encode("utf-8")), "bytes; entries", page.count('<article class="ai-entry"'), "; em dashes", page.count("\u2014"))
