# -*- coding: utf-8 -*-
"""Build cookie-digest.html (site page) and its CSS from all_merged.json."""
import json, html, re, os
from collections import OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
E = json.load(open(os.path.join(HERE, "all_merged.json"), encoding="utf-8"))
esc = lambda s: html.escape(s, quote=True)
DATE = "19 September 2026"

EU_MS = {"France", "Germany", "Spain", "Italy", "Belgium", "Netherlands", "Ireland", "Denmark", "Austria", "Sweden", "Finland", "Poland", "Luxembourg", "Greece", "Czech Republic", "Portugal", "Croatia", "Romania"}
OTHER_EU = {"Switzerland", "Norway", "Turkey", "Iceland", "Liechtenstein", "Serbia", "Ukraine"}
US_STATES = {"Colorado", "Connecticut", "Texas", "Oregon", "Montana", "Delaware", "New Jersey", "New Hampshire", "Nebraska", "Minnesota", "Maryland", "Virginia", "Utah", "Iowa", "Tennessee", "Indiana", "Kentucky", "Rhode Island", "Washington", "United States (multi-state)", "New York"}

GROUP_ORDER = [
    "European Union", "EU member states", "United Kingdom", "Switzerland and other Europe",
    "United States: California", "United States: federal", "United States: other states",
    "Rest of world", "Standards and frameworks",
]


def group_of(e):
    j, c = e["jurisdiction"], e["cluster"]
    if c == "standards":
        return "Standards and frameworks"
    if j == "EU":
        return "European Union"
    if j in EU_MS:
        return "EU member states"
    if j == "United Kingdom":
        return "United Kingdom"
    if j in OTHER_EU:
        return "Switzerland and other Europe"
    if j == "California":
        return "United States: California"
    if j == "United States (federal)":
        return "United States: federal"
    if j in US_STATES:
        return "United States: other states"
    if c == "row":
        return "Rest of world"
    return "Rest of world"


for e in E:
    e["group"] = group_of(e)


def year(d):
    m = re.search(r"\d{4}", d)
    return m.group(0) if m else ""


def sortkey(e):
    m = re.match(r"(\d{1,2}) (\w+) (\d{4})", e["date"])
    months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    if m and m.group(2) in months:
        return (-int(m.group(3)), -(months.index(m.group(2)) + 1), -int(m.group(1)))
    return (-int(year(e["date"]) or 0), 0, 0)


TYPE_LABEL = {"legislation": "Legislation", "regulator guidance": "Regulator guidance", "court decision": "Court decision", "enforcement": "Enforcement", "standard": "Standard", "proposal": "Proposal"}


def entry_html(e):
    chips = ['<span class="ck-chip ck-chip-j">%s</span>' % esc(e["jurisdiction"]),
             '<span class="ck-chip ck-chip-t">%s</span>' % esc(TYPE_LABEL.get(e["type"], e["type"]))]
    if e["status"] not in ("in force", "decided"):
        chips.append('<span class="ck-chip ck-chip-s">%s</span>' % esc(e["status"]))
    for t in e.get("topics") or []:
        chips.append('<span class="ck-chip ck-chip-topic">%s</span>' % esc(t.replace("-", " ")))
    if e.get("source") == "secondary":
        chips.append('<span class="ck-chip ck-chip-src" title="Primary source could not be fetched; figures rest on a secondary source">secondary source</span>')
    return ('<article class="ck-entry" data-year="%s" data-type="%s" data-jur="%s" data-status="%s">'
            '<h3 class="ck-title"><a href="%s" target="_blank" rel="noopener noreferrer">%s</a></h3>'
            '<p class="ck-meta"><span class="ck-date">%s</span>%s</p>'
            '<p class="ck-take">%s</p></article>'
            % (year(e["date"]), esc(e["type"]), esc(e["jurisdiction"]), esc(e["status"]), esc(e["url"]), esc(e["title"]), esc(e["date"]), "".join(chips), esc(e["takeaway"])))


def slug(s):
    return "ck-" + re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def build_body():
    years = sorted({year(e["date"]) for e in E}, reverse=True)
    jurs = sorted({e["jurisdiction"] for e in E})
    types = [t for t in TYPE_LABEL if any(e["type"] == t for e in E)]
    counts = {"legislation": 0, "regulator guidance": 0, "court decision": 0, "enforcement": 0, "standard": 0, "proposal": 0}
    for e in E:
        counts[e["type"]] += 1
    out = []
    out.append('<div class="ck-intro">')
    out.append('<p>Every rule a consent banner has to satisfy, in one place: %d documents across %d jurisdictions as of %s, each with a takeaway written from the document itself, stating what it establishes, who it binds and what to do about it. The set covers %d pieces of legislation, %d regulator guidance documents, %d court decisions, %d enforcement actions, %d technical standards or industry frameworks and %d pending proposals. Depth follows the regimes a European consent platform meets daily: the EU and its member states, the United Kingdom, Switzerland and the United States in full; one entry per operative rule elsewhere.</p>' % (len(E), len(jurs), DATE, counts["legislation"], counts["regulator guidance"], counts["court decision"], counts["enforcement"], counts["standard"], counts["proposal"]))
    out.append('<p>Three limits, stated up front. A takeaway is a reading aid: every entry links to the source and the source governs where the two differ. Status is as of the date above; proposals and consultations move, and the entry says so where it applies from a future date or is under appeal. Where a primary page could not be reached and the figures rest on a secondary source, the entry is marked. None of this is legal advice.</p>')
    out.append('<p class="ck-privacy">Filters and search run in your browser. Nothing you type is sent anywhere.</p>')
    out.append("</div>")
    out.append('<div class="ck-filters" role="search">')
    out.append('<label>Search <input type="text" id="ck-q" placeholder="title, takeaway, article number" autocomplete="off"></label>')
    out.append('<label>Jurisdiction <select id="ck-jur"><option value="">All</option>%s</select></label>' % "".join('<option value="%s">%s</option>' % (esc(j), esc(j)) for j in jurs))
    out.append('<label>Type <select id="ck-type"><option value="">All types</option>%s</select></label>' % "".join('<option value="%s">%s</option>' % (esc(t), esc(TYPE_LABEL[t])) for t in types))
    out.append('<label>Year <select id="ck-year"><option value="">All years</option>%s</select></label>' % "".join('<option value="%s">%s</option>' % (y, y) for y in years if y))
    out.append('<p class="ck-count" id="ck-count" aria-live="polite"></p>')
    out.append("</div>")
    out.append('<p class="ck-index-label">Jump to a region:</p><ul class="ck-index">')
    for g in GROUP_ORDER:
        n = sum(1 for e in E if e["group"] == g)
        out.append('<li><a href="#%s">%s <span class="ck-n">%d</span></a></li>' % (slug(g), esc(g), n))
    out.append("</ul>")
    out.append('<div class="ck-groups">')
    for g in GROUP_ORDER:
        items = sorted([e for e in E if e["group"] == g], key=sortkey)
        out.append('<details class="ck-group" id="%s" open><summary><span class="ck-group-name">%s</span><span class="ck-group-count" data-total="%d">%d documents</span></summary><div class="ck-group-body">' % (slug(g), esc(g), len(items), len(items)))
        for e in items:
            out.append(entry_html(e))
        out.append("</div></details>")
    out.append("</div>")
    return "\n".join(out)


JS = r"""
(function () {
	var q = document.getElementById('ck-q'), j = document.getElementById('ck-jur'),
	    t = document.getElementById('ck-type'), y = document.getElementById('ck-year'),
	    count = document.getElementById('ck-count');
	var groups = Array.prototype.slice.call(document.querySelectorAll('.ck-group'));
	var total = document.querySelectorAll('.ck-entry').length;
	function apply() {
		var qq = q.value.trim().toLowerCase(), jj = j.value, tt = t.value, yy = y.value, shown = 0;
		groups.forEach(function (g) {
			var visible = 0;
			Array.prototype.forEach.call(g.querySelectorAll('.ck-entry'), function (el) {
				var ok = (!jj || el.getAttribute('data-jur') === jj)
					&& (!tt || el.getAttribute('data-type') === tt)
					&& (!yy || el.getAttribute('data-year') === yy)
					&& (!qq || el.textContent.toLowerCase().indexOf(qq) !== -1);
				el.hidden = !ok;
				if (ok) visible++;
			});
			g.hidden = visible === 0;
			var c = g.querySelector('.ck-group-count');
			c.textContent = visible === parseInt(c.getAttribute('data-total'), 10) ? c.getAttribute('data-default') : visible + ' of ' + c.getAttribute('data-total') + ' shown';
			shown += visible;
		});
		count.textContent = 'Showing ' + shown + ' of ' + total + ' documents.';
	}
	groups.forEach(function (g) { var c = g.querySelector('.ck-group-count'); c.setAttribute('data-default', c.textContent); });
	[q, j, t, y].forEach(function (el) { el.addEventListener('input', apply); el.addEventListener('change', apply); });
	apply();
})();
"""

CSS = """/* Cookie compliance digest: scoped styles, same pattern as the EDPB digest. */

#cookie-digest { max-width: 52em; margin: 0; }
.ck-intro p { margin-bottom: 1em; }
.ck-privacy { color: rgba(255,255,255,0.55); font-size: 0.9em; }

.ck-filters {
	display: grid;
	grid-template-columns: 2fr 1.2fr 1fr 0.8fr;
	gap: 0.75em 1em;
	align-items: end;
	margin: 1.5em 0 1em 0;
	padding: 1em 1.25em;
	border: solid 1px rgba(255,255,255,0.1);
	border-radius: 0.5em;
	background: rgba(255,255,255,0.02);
}
.ck-filters label { display: block; font-size: 0.8em; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.1em; }
.ck-filters input, .ck-filters select { margin-top: 0.4em; }
.ck-count { grid-column: 1 / -1; margin: 0; font-size: 0.9em; color: #7fb2e5; }

.ck-index-label { color: rgba(255,255,255,0.55); font-size: 0.9em; margin: 1.5em 0 0.5em 0; }
.ck-index {
	display: grid; grid-template-columns: repeat(auto-fit, minmax(14em, 1fr)); gap: 0.4em 1.5em;
	margin: 0 0 2em 0; padding: 1em 1.25em;
	border: solid 1px rgba(255,255,255,0.1); border-radius: 0.5em; background: rgba(255,255,255,0.02);
	list-style: none;
}
.ck-index li { list-style: none; font-size: 0.9em; }
.ck-index a { color: #7fb2e5; border-bottom: none; }
.ck-index a:hover { color: #fff; }
.ck-n { color: rgba(255,255,255,0.45); font-size: 0.85em; margin-left: 0.3em; }

.ck-groups { display: flex; flex-direction: column; gap: 0.75em; }
.ck-group { border: solid 1px rgba(255,255,255,0.15); border-radius: 0.5em; background: rgba(255,255,255,0.03); overflow: hidden; }
.ck-group summary {
	list-style: none; cursor: pointer; padding: 1em 3em 1em 1.25em; font-weight: bold; color: #fff;
	display: flex; align-items: baseline; justify-content: space-between; gap: 0.75em; position: relative;
}
.ck-group summary::-webkit-details-marker { display: none; }
.ck-group summary::after {
	content: '\\f107'; font-family: 'Font Awesome 5 Free'; font-weight: 900;
	position: absolute; right: 1.25em; top: 1.1em; color: rgba(255,255,255,0.4); transition: transform 0.2s ease;
}
.ck-group[open] summary::after { transform: rotate(180deg); }
.ck-group summary:hover { background: rgba(255,255,255,0.04); }
.ck-group-count { font-weight: normal; font-size: 0.8em; color: rgba(255,255,255,0.5); white-space: nowrap; }
.ck-group-body { padding: 0 1.25em 0.5em 1.25em; }

.ck-entry { padding: 0.9em 0 1em 0; border-top: solid 1px rgba(255,255,255,0.08); }
.ck-entry[hidden] { display: none; }
.ck-title { font-size: 0.95em; margin: 0 0 0.35em 0; line-height: 1.4; text-transform: none; letter-spacing: 0; }
.ck-title a { color: #fff; border-bottom: dotted 1px rgba(255,255,255,0.3); }
.ck-title a:hover { color: #7fb2e5; border-bottom-color: #7fb2e5; }
.ck-meta { margin: 0 0 0.5em 0; font-size: 0.8em; color: rgba(255,255,255,0.5); display: flex; flex-wrap: wrap; gap: 0.4em 0.6em; align-items: center; }
.ck-chip { display: inline-block; padding: 0.1em 0.6em; border-radius: 1em; border: solid 1px rgba(255,255,255,0.15); font-size: 0.85em; line-height: 1.6; }
.ck-chip-j { border-color: rgba(127,178,229,0.5); color: #7fb2e5; }
.ck-chip-t { color: rgba(255,255,255,0.75); }
.ck-chip-s { border-color: rgba(255,200,120,0.4); color: #f2c98a; }
.ck-chip-topic { color: rgba(255,255,255,0.6); }
.ck-chip-src { border-style: dashed; color: rgba(255,255,255,0.45); }
.ck-take { margin: 0; font-size: 0.95em; line-height: 1.6; color: rgba(255,255,255,0.72); }

@media (max-width: 736px) {
	#cookie-digest { margin-top: 3em; padding-top: 2em; }
	.ck-filters { grid-template-columns: 1fr; }
	.ck-index { grid-template-columns: 1fr; }
	.ck-group summary { flex-direction: column; align-items: flex-start; gap: 0.25em; }
}
"""

HEAD = """<!DOCTYPE HTML>
<html lang="en">
	<head>
		<title>Simeon Atanasov | Cookie Compliance Digest</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<meta name="description" content="Cookie and tracking compliance worldwide: %d laws, regulator guidance documents, court decisions, enforcement actions and standards across %d jurisdictions, each with a practitioner takeaway. EU ePrivacy and GDPR, UK PECR, California CCPA and the US states, and the rest of the world.">
		<link rel="stylesheet" href="assets/css/main.css" />
		<noscript><link rel="stylesheet" href="assets/css/noscript.css" /></noscript>
		<link rel="stylesheet" href="pages/cookie-digest/cookie-digest.css">
		<link rel="canonical" href="https://simeonatanasov.com/cookie-digest.html">
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
						<li><a href="edpb-digest.html">EDPB Digest</a></li>
						<li><a href="cookie-digest.html" class="active">Cookie Digest</a></li>
						<li><a href="cookie-banner-scanner.html">Cookie Scanner</a></li>
					</ul>
				</nav>
			</header>

		<!-- Wrapper -->
			<div id="wrapper">

				<!-- Main -->
					<section id="main" class="wrapper">
						<div class="inner">
							<h1 class="major">Cookie Compliance Digest</h1>
						<section id="cookie-digest">
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
    jurs = sorted({e["jurisdiction"] for e in E})
    page = HEAD % (len(E), len(jurs)) + build_body() + TAIL % JS
    page = page.replace("\r\n", "\n")
    outdir = "/mnt/user-data/outputs/site"
    os.makedirs(outdir + "/pages/cookie-digest", exist_ok=True)
    open(outdir + "/cookie-digest.html", "w", encoding="utf-8", newline="\n").write(page)
    open(outdir + "/pages/cookie-digest/cookie-digest.css", "w", encoding="utf-8", newline="\n").write(CSS)
    json.dump(E, open(os.path.join(HERE, "cookie_digest.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("html", len(page.encode("utf-8")), "bytes; entries", page.count('<article class="ck-entry"'), "; em dashes", page.count("—"))
    from collections import Counter
    print(Counter(e["group"] for e in E))
