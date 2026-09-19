# -*- coding: utf-8 -*-
"""Build edpb-digest.html (site page) and its CSS from digest.json."""
import json, html, re, os
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, "digest.json"), encoding="utf-8"))
esc = lambda s: html.escape(s, quote=True)

DATE = "19 September 2026"

GROUPS = OrderedDict([
 ("Guidelines", ["Guideline"]),
 ("Recommendations", ["Recommendation"]),
 ("Statements", ["Statement"]),
 ("Opinions of the Board (Article 64)", ["Opinion of the Board (Art. 64)"]),
 ("Binding decisions (Article 65)", ["EDPB Binding Decisions"]),
 ("Legislative opinions", ["Legislative opinion"]),
 ("Task force reports", ["Task force report"]),
 ("Coordinated enforcement", ["Coordinated Enforcement Framework"]),
 ("Other guidance", ["Other guidance"]),
 ("Support Pool of Experts reports", ["Support Pool of Experts"]),
 ("Legal studies", ["Legal study by external providers"]),
 ("Adequacy opinions", ["Adequacy"]),
 ("Reports, statements and letters", ["Reports, statements, and letters"]),
 ("Other policy documents", ["Other policy document"]),
 ("Internal procedure", ["Internal document", "Procedure", "Rules of procedure", "Internal procedural guidance", "Memorandum of Understanding"]),
])
TYPE_TO_GROUP = {t: g for g, ts in GROUPS.items() for t in ts}


def year(d):
    m = re.search(r"\d{4}", d)
    return m.group(0) if m else ""


def entry_html(e):
    yr = year(e["date"])
    tier = e["tier"]
    cls = "ed-entry ed-tier-%s ed-rel-%s" % (tier, e["rating"])
    chips = []
    if tier == "written":
        chips.append('<span class="ed-chip ed-chip-written">Read from the document</span>')
    else:
        chips.append('<span class="ed-chip">Description</span>')
    if e.get("status") and e["status"] != "current":
        chips.append('<span class="ed-chip ed-chip-status">%s</span>' % esc(e["status"].replace("-", " ")))
    for t in e.get("topics") or []:
        chips.append('<span class="ed-chip ed-chip-topic">%s</span>' % esc(t.replace("-", " ")))
    return (
        '<article class="%s" data-year="%s" data-tier="%s" data-rel="%s">'
        '<h3 class="ed-title"><a href="%s" target="_blank" rel="noopener noreferrer">%s</a></h3>'
        '<p class="ed-meta"><span class="ed-date">%s</span>%s</p>'
        '<p class="ed-take">%s</p>'
        "</article>"
    ) % (cls, yr, tier, e["rating"], esc(e["url"]), esc(e["title"]), esc(e["date"]), "".join(chips), esc(e["takeaway"]))


def build_body():
    n_written = sum(1 for e in E if e["tier"] == "written")
    years = sorted({year(e["date"]) for e in E}, reverse=True)
    out = []
    out.append('<div class="ed-intro">')
    out.append('<p>Every document the European Data Protection Board has published, %d of them as of %s, with one takeaway each. For %d documents the takeaway is written from the document itself: what it establishes, who it binds and what to do about it. For the remaining %d, which are approvals of binding corporate rules, accreditation requirements, national DPIA lists, certification criteria, institutional reports and the Board\'s own procedures, a one-line description says what the document is so it can be ruled in or out in a second.</p>' % (len(E), DATE, n_written, len(E) - n_written))
    out.append('<p>Two limits, stated up front. The choice of which documents earned a written takeaway follows the topics of this site (privacy operations, the AI Act, assessment tools), not the document\'s importance in general. And a takeaway is a reading aid, not a substitute: every entry links to the EDPB page, and the document governs where the two differ. Dates are the publication dates shown in the EDPB listing. Guidelines still at consultation stage appear on the EDPB consultations page and are listed here only once the documents listing carries a version.</p>')
    out.append('<p class="ed-privacy">Filters and search run in your browser. Nothing you type is sent anywhere.</p>')
    out.append("</div>")

    # filter bar
    out.append('<div class="ed-filters" role="search">')
    out.append('<label>Search <input type="text" id="ed-q" placeholder="title, takeaway or topic" autocomplete="off"></label>')
    out.append('<label>Type <select id="ed-type"><option value="">All types</option>%s</select></label>' % "".join('<option value="%s">%s</option>' % (esc(g), esc(g)) for g in GROUPS))
    out.append('<label>Year <select id="ed-year"><option value="">All years</option>%s</select></label>' % "".join('<option value="%s">%s</option>' % (y, y) for y in years if y))
    out.append('<label>Show <select id="ed-tier"><option value="">Everything</option><option value="written">Written takeaways only</option><option value="R">Directly relevant to this site</option></select></label>')
    out.append('<p class="ed-count" id="ed-count" aria-live="polite"></p>')
    out.append("</div>")

    # index
    out.append('<p class="ed-index-label">Jump to a type:</p><ul class="ed-index">')
    for g, ts in GROUPS.items():
        n = sum(1 for e in E if e["type"] in ts)
        out.append('<li><a href="#%s">%s <span class="ed-n">%d</span></a></li>' % (slug(g), esc(g), n))
    out.append("</ul>")

    # groups
    out.append('<div class="ed-groups">')
    for g, ts in GROUPS.items():
        items = [e for e in E if e["type"] in ts]
        items.sort(key=lambda e: (-int(year(e["date"]) or 0), e["title"]))
        nw = sum(1 for e in items if e["tier"] == "written")
        out.append('<details class="ed-group" id="%s" open><summary><span class="ed-group-name">%s</span><span class="ed-group-count" data-total="%d">%d documents, %d written</span></summary><div class="ed-group-body">' % (slug(g), esc(g), len(items), len(items), nw))
        for e in items:
            out.append(entry_html(e))
        out.append("</div></details>")
    out.append("</div>")
    return "\n".join(out)


def slug(s):
    return "ed-" + re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


JS = r"""
(function () {
	var q = document.getElementById('ed-q'), t = document.getElementById('ed-type'),
	    y = document.getElementById('ed-year'), tier = document.getElementById('ed-tier'),
	    count = document.getElementById('ed-count');
	var groups = Array.prototype.slice.call(document.querySelectorAll('.ed-group'));
	var total = document.querySelectorAll('.ed-entry').length;
	function apply() {
		var qq = q.value.trim().toLowerCase(), tt = t.value, yy = y.value, tr = tier.value, shown = 0;
		groups.forEach(function (g) {
			var name = g.querySelector('.ed-group-name').textContent;
			var visibleInGroup = 0;
			Array.prototype.forEach.call(g.querySelectorAll('.ed-entry'), function (el) {
				var ok = (!tt || tt === name)
					&& (!yy || el.getAttribute('data-year') === yy)
					&& (!tr || (tr === 'written' ? el.getAttribute('data-tier') === 'written' : el.getAttribute('data-rel') === tr))
					&& (!qq || el.textContent.toLowerCase().indexOf(qq) !== -1);
				el.hidden = !ok;
				if (ok) visibleInGroup++;
			});
			g.hidden = visibleInGroup === 0;
			var c = g.querySelector('.ed-group-count');
			if (visibleInGroup !== parseInt(c.getAttribute('data-total'), 10)) {
				c.textContent = visibleInGroup + ' of ' + c.getAttribute('data-total') + ' shown';
			} else {
				c.textContent = c.getAttribute('data-default');
			}
			shown += visibleInGroup;
		});
		count.textContent = 'Showing ' + shown + ' of ' + total + ' documents.';
	}
	groups.forEach(function (g) {
		var c = g.querySelector('.ed-group-count');
		c.setAttribute('data-default', c.textContent);
	});
	[q, t, y, tier].forEach(function (el) { el.addEventListener('input', apply); el.addEventListener('change', apply); });
	apply();
})();
"""

CSS = """/* EDPB digest: scoped styles, matches the site's navy/blue palette and the
   Practical Privacy accordion pattern. */

#edpb-digest {
	max-width: 52em;
	margin: 0;
}

.ed-intro p { margin-bottom: 1em; }
.ed-privacy { color: rgba(255,255,255,0.55); font-size: 0.9em; }

/* Filter bar. The template styles inputs and selects already; only layout here. */
.ed-filters {
	display: grid;
	grid-template-columns: 2fr 1fr 1fr 1fr;
	gap: 0.75em 1em;
	align-items: end;
	margin: 1.5em 0 1em 0;
	padding: 1em 1.25em;
	border: solid 1px rgba(255,255,255,0.1);
	border-radius: 0.5em;
	background: rgba(255,255,255,0.02);
}
.ed-filters label {
	display: block;
	font-size: 0.8em;
	color: rgba(255,255,255,0.55);
	text-transform: uppercase;
	letter-spacing: 0.1em;
}
.ed-filters input, .ed-filters select { margin-top: 0.4em; }
.ed-count {
	grid-column: 1 / -1;
	margin: 0;
	font-size: 0.9em;
	color: #7fb2e5;
}

.ed-index-label { color: rgba(255,255,255,0.55); font-size: 0.9em; margin: 1.5em 0 0.5em 0; }
.ed-index {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(14em, 1fr));
	gap: 0.4em 1.5em;
	margin: 0 0 2em 0;
	padding: 1em 1.25em;
	border: solid 1px rgba(255,255,255,0.1);
	border-radius: 0.5em;
	background: rgba(255,255,255,0.02);
	list-style: none;
}
.ed-index li { list-style: none; font-size: 0.9em; }
.ed-index a { color: #7fb2e5; border-bottom: none; }
.ed-index a:hover { color: #fff; }
.ed-n { color: rgba(255,255,255,0.45); font-size: 0.85em; margin-left: 0.3em; }

.ed-groups { display: flex; flex-direction: column; gap: 0.75em; }

.ed-group {
	border: solid 1px rgba(255,255,255,0.15);
	border-radius: 0.5em;
	background: rgba(255,255,255,0.03);
	overflow: hidden;
}
.ed-group summary {
	list-style: none;
	cursor: pointer;
	padding: 1em 1.25em;
	font-weight: bold;
	color: #fff;
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 0.75em;
	position: relative;
	padding-right: 3em;
}
.ed-group summary::-webkit-details-marker { display: none; }
.ed-group summary::after {
	content: '\\f107';
	font-family: 'Font Awesome 5 Free';
	font-weight: 900;
	position: absolute;
	right: 1.25em;
	top: 1.1em;
	color: rgba(255,255,255,0.4);
	transition: transform 0.2s ease;
}
.ed-group[open] summary::after { transform: rotate(180deg); }
.ed-group summary:hover { background: rgba(255,255,255,0.04); }
.ed-group-count { font-weight: normal; font-size: 0.8em; color: rgba(255,255,255,0.5); white-space: nowrap; }

.ed-group-body { padding: 0 1.25em 0.5em 1.25em; }

.ed-entry {
	padding: 0.9em 0 1em 0;
	border-top: solid 1px rgba(255,255,255,0.08);
}
.ed-entry[hidden] { display: none; }
.ed-title {
	font-size: 0.95em;
	margin: 0 0 0.35em 0;
	line-height: 1.4;
	text-transform: none;
	letter-spacing: 0;
}
.ed-title a { color: #fff; border-bottom: dotted 1px rgba(255,255,255,0.3); }
.ed-title a:hover { color: #7fb2e5; border-bottom-color: #7fb2e5; }
.ed-meta {
	margin: 0 0 0.5em 0;
	font-size: 0.8em;
	color: rgba(255,255,255,0.5);
	display: flex;
	flex-wrap: wrap;
	gap: 0.4em 0.6em;
	align-items: center;
}
.ed-chip {
	display: inline-block;
	padding: 0.1em 0.6em;
	border-radius: 1em;
	border: solid 1px rgba(255,255,255,0.15);
	font-size: 0.85em;
	line-height: 1.6;
}
.ed-chip-written { border-color: rgba(127,178,229,0.5); color: #7fb2e5; }
.ed-chip-status { border-color: rgba(255,200,120,0.4); color: #f2c98a; }
.ed-chip-topic { color: rgba(255,255,255,0.6); }
.ed-take {
	margin: 0;
	font-size: 0.95em;
	line-height: 1.6;
	color: rgba(255,255,255,0.72);
}
.ed-tier-oneliner .ed-take { color: rgba(255,255,255,0.55); }

@media (max-width: 736px) {
	#edpb-digest { margin-top: 3em; padding-top: 2em; }
	.ed-filters { grid-template-columns: 1fr; }
	.ed-index { grid-template-columns: 1fr; }
	.ed-group summary { flex-direction: column; align-items: flex-start; gap: 0.25em; }
}
"""

HEAD = """<!DOCTYPE HTML>
<html lang="en">
	<head>
		<title>Simeon Atanasov | EDPB Digest</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<meta name="description" content="Every document published by the European Data Protection Board, %d as of %s, with one takeaway each: what it establishes, who it binds, what to do. Filter by type, year and relevance.">
		<link rel="stylesheet" href="assets/css/main.css" />
		<noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
		<link rel="stylesheet" href="pages/edpb-digest/edpb-digest.css">
		<link rel="canonical" href="https://simeonatanasov.com/edpb-digest.html">
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
						<li><a href="edpb-digest.html" class="active">EDPB Digest</a></li>
						<li><a href="cookie-banner-scanner.html">Cookie Scanner</a></li>
					</ul>
				</nav>
			</header>

		<!-- Wrapper -->
			<div id="wrapper">

				<!-- Main -->
					<section id="main" class="wrapper">
						<div class="inner">
							<h1 class="major">EDPB Digest</h1>
						<section id="edpb-digest">
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
    body = build_body()
    page = HEAD % (len(E), DATE) + body + TAIL % JS
    page = page.replace("\r\n", "\n")
    outdir = "/mnt/user-data/outputs/site"
    os.makedirs(outdir + "/pages/edpb-digest", exist_ok=True)
    open(outdir + "/edpb-digest.html", "w", encoding="utf-8", newline="\n").write(page)
    open(outdir + "/pages/edpb-digest/edpb-digest.css", "w", encoding="utf-8", newline="\n").write(CSS)
    print("html", len(page.encode("utf-8")), "bytes; css", len(CSS.encode("utf-8")), "bytes")
    print("em dashes:", page.count("—") + CSS.count("—"))
    print("entries:", page.count('<article class="ed-entry'))
