# -*- coding: utf-8 -*-
"""Build ai-act-digest.html (site page) from the article, annex and corpus JSON files."""
import json, html, re, os
from collections import OrderedDict, Counter

HERE = os.path.dirname(os.path.abspath(__file__))
esc = lambda s: html.escape(str(s), quote=True)
DATE = "19 September 2026"

ARTS = []
for k in "abcd":
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
    n = re.search(r"(\d+)", a["id"])
    a["order"] = (a["chap_no"], 0 if a["id"].startswith("art") else 1, int(n.group(1)))
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
        rec = '<p class="ai-rec">Recitals %s</p>' % ", ".join(str(r) for r in a["recitals"])
    omni = '<p class="ai-omni">%s</p>' % esc(a["omnibus"]) if a["omnibus"] else ""
    return ('<article class="ai-entry" data-part="regulation" data-group="%s" data-date="%s" data-roles="%s" data-omni="%s">'
            '<h3 class="ai-title"><a href="%s" target="_blank" rel="noopener noreferrer">%s: %s</a></h3>'
            '<p class="ai-meta">%s</p><p class="ai-take">%s</p>%s%s</article>'
            % (esc(a["chap_label"]), esc(a["applies_from"]), esc(" ".join(a["binds"])), "yes" if a["omnibus"] else "no",
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
    return ('<article class="ai-entry" data-part="corpus" data-group="%s" data-date="" data-roles="" data-omni="no">'
            '<h3 class="ai-title"><a href="%s" target="_blank" rel="noopener noreferrer">%s</a></h3>'
            '<p class="ai-meta"><span class="ai-date">%s &middot; %s</span>%s</p><p class="ai-take">%s</p></article>'
            % (esc(c["group"]), esc(c["url"]), esc(c["title"]), esc(c["date"]), esc(c["issuer"]), "".join(chips), esc(c["takeaway"])))


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
    out.append('<div class="ai-intro">')
    out.append('<p>The EU AI Act for study, in two layers. Part 1 is Regulation (EU) 2024/1689 itself as amended by Regulation (EU) 2026/1744, the Digital Omnibus on AI in force since 27 July 2026: all %d articles and %d annexes, grouped by chapter, each with a takeaway written from the consolidated text stating what it establishes, who it binds and what to do, its date of application, the recitals that explain it, and a flag on the %d provisions the Omnibus changed. Part 2 is the corpus around the Act as of %s: %d documents, from the Commission\'s guidelines, codes of practice, templates and Q&amp;As through the standardisation programme, EDPB and EDPS opinions including Opinion 28/2024 on AI models, national implementing laws and the reference tools, each with a takeaway and the articles it interprets.</p>' % (n_arts, n_ann, n_omni, DATE, len(CORPUS)))
    out.append('<p>Three limits, stated up front. A takeaway is a reading aid and the text governs; every entry links to the source. Application dates are the ones the consolidated text carries under Article 113 after the Omnibus; the high-risk chapter applies from 2 December 2027 for Annex III systems and 2 August 2028 for Annex I systems, not the 2 August 2026 date the original Act set. Guidance marked draft or consultation is not final and may change. None of this is legal advice.</p>')
    out.append('<p class="ai-privacy">Filters and search run in your browser. Nothing you type is sent anywhere.</p>')
    out.append("</div>")
    out.append('<div class="ai-filters" role="search">')
    out.append('<label>Search <input type="text" id="ai-q" placeholder="article, term, obligation" autocomplete="off"></label>')
    out.append('<label>Part <select id="ai-part"><option value="">Both parts</option><option value="regulation">Part 1: the Regulation</option><option value="corpus">Part 2: guidance and implementation</option></select></label>')
    out.append('<label>Binds <select id="ai-role"><option value="">Any role</option>%s</select></label>' % "".join('<option value="%s">%s</option>' % (k, v) for k, v in BIND_LABEL.items()))
    out.append('<label>Applies from (Part 1) <select id="ai-date"><option value="">Any date</option>%s</select></label>' % "".join('<option value="%s">%s</option>' % (esc(d), esc(d)) for d in dates))
    out.append('<label>Omnibus <select id="ai-omni"><option value="">All provisions</option><option value="yes">Changed by 2026/1744 only</option></select></label>')
    out.append('<p class="ai-count" id="ai-count" aria-live="polite"></p>')
    out.append("</div>")
    out.append('<p class="ai-index-label">Part 1, the Regulation. Jump to a chapter:</p><ul class="ai-index">')
    for ch, items in chapters.items():
        out.append('<li><a href="#%s">%s <span class="ai-n">%d</span></a></li>' % (slug(ch), esc(ch), len(items)))
    out.append("</ul>")
    out.append('<p class="ai-index-label">Part 2, guidance and implementation. Jump to a group:</p><ul class="ai-index">')
    for g in CORPUS_GROUPS:
        n = sum(1 for c in CORPUS if c["group"] == g)
        if n:
            out.append('<li><a href="#%s">%s <span class="ai-n">%d</span></a></li>' % (slug(g), esc(g), n))
    out.append("</ul>")
    out.append('<div class="ai-groups">')
    out.append('<h2 class="ai-part">Part 1: the Regulation, article by article</h2>')
    for ch, items in chapters.items():
        out.append('<details class="ai-group" id="%s" open><summary><span class="ai-group-name">%s</span><span class="ai-group-count" data-total="%d">%d provisions</span></summary><div class="ai-group-body">' % (slug(ch), esc(ch), len(items), len(items)))
        for a in items:
            out.append(art_html(a))
        out.append("</div></details>")
    out.append('<h2 class="ai-part">Part 2: guidance and implementation</h2>')
    for g in CORPUS_GROUPS:
        items = sorted([c for c in CORPUS if c["group"] == g], key=lambda c: c["title"])
        if not items:
            continue
        out.append('<details class="ai-group" id="%s" open><summary><span class="ai-group-name">%s</span><span class="ai-group-count" data-total="%d">%d documents</span></summary><div class="ai-group-body">' % (slug(g), esc(g), len(items), len(items)))
        for c in items:
            out.append(doc_html(c))
        out.append("</div></details>")
    out.append("</div>")
    return "\n".join(out)


JS = r"""
(function () {
	var q = document.getElementById('ai-q'), part = document.getElementById('ai-part'),
	    role = document.getElementById('ai-role'), date = document.getElementById('ai-date'),
	    omni = document.getElementById('ai-omni'), count = document.getElementById('ai-count');
	var groups = Array.prototype.slice.call(document.querySelectorAll('.ai-group'));
	var total = document.querySelectorAll('.ai-entry').length;
	function apply() {
		var qq = q.value.trim().toLowerCase(), pp = part.value, rr = role.value, dd = date.value, oo = omni.value, shown = 0;
		groups.forEach(function (g) {
			var visible = 0;
			Array.prototype.forEach.call(g.querySelectorAll('.ai-entry'), function (el) {
				var isReg = el.getAttribute('data-part') === 'regulation';
				var ok = (!pp || el.getAttribute('data-part') === pp)
					&& (!rr || (isReg && el.getAttribute('data-roles').split(' ').indexOf(rr) !== -1))
					&& (!dd || (isReg && el.getAttribute('data-date') === dd))
					&& (!oo || (isReg && el.getAttribute('data-omni') === 'yes'))
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
		count.textContent = 'Showing ' + shown + ' of ' + total + ' entries.';
	}
	groups.forEach(function (g) { var c = g.querySelector('.ai-group-count'); c.setAttribute('data-default', c.textContent); });
	[q, part, role, date, omni].forEach(function (el) { el.addEventListener('input', apply); el.addEventListener('change', apply); });
	apply();
})();
"""

CSS = """/* AI Act digest: scoped styles, same pattern as the EDPB and cookie digests. */

#ai-act-digest { max-width: 52em; margin: 0; }
.ai-intro p { margin-bottom: 1em; }
.ai-privacy { color: rgba(255,255,255,0.55); font-size: 0.9em; }

.ai-filters {
	display: grid; grid-template-columns: 2fr 1.3fr 1fr 1.3fr 1fr; gap: 0.75em 1em; align-items: end;
	margin: 1.5em 0 1em 0; padding: 1em 1.25em;
	border: solid 1px rgba(255,255,255,0.1); border-radius: 0.5em; background: rgba(255,255,255,0.02);
}
.ai-filters label { display: block; font-size: 0.8em; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.1em; }
.ai-filters input, .ai-filters select { margin-top: 0.4em; }
.ai-count { grid-column: 1 / -1; margin: 0; font-size: 0.9em; color: #7fb2e5; }

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

.ai-groups { display: flex; flex-direction: column; gap: 0.75em; }
.ai-part { font-size: 1.1em; margin: 1.5em 0 0.25em 0; text-transform: none; letter-spacing: 0; color: #fff; }
.ai-part[hidden] { display: none; }
.ai-group { border: solid 1px rgba(255,255,255,0.15); border-radius: 0.5em; background: rgba(255,255,255,0.03); overflow: hidden; }
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

.ai-entry { padding: 0.9em 0 1em 0; border-top: solid 1px rgba(255,255,255,0.08); }
.ai-entry[hidden] { display: none; }
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
    page = HEAD + build_body() + TAIL % JS
    page = page.replace("\r\n", "\n")
    outdir = "/mnt/user-data/outputs/site"
    os.makedirs(outdir + "/pages/ai-act-digest", exist_ok=True)
    open(outdir + "/ai-act-digest.html", "w", encoding="utf-8", newline="\n").write(page)
    open(outdir + "/pages/ai-act-digest/ai-act-digest.css", "w", encoding="utf-8", newline="\n").write(CSS)
    json.dump({"regulation": sorted(ARTS, key=lambda a: a["order"]), "corpus": CORPUS}, open(os.path.join(HERE, "ai_act_digest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("html", len(page.encode("utf-8")), "bytes; entries", page.count('<article class="ai-entry"'), "; em dashes", page.count("—"))
