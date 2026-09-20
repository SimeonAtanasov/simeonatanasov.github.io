# -*- coding: utf-8 -*-
"""Replace the <header id="header"> block of a generated page with the current site header
(Home | Privacy | AI | Cookie Compliance), marking the active category and page.
Usage: python3 swap_header.py <file> <active page href>"""
import re, sys

HEADER = """			<header id="header">
				<a href="index.html" class="title">Simeon Atanasov</a>
				<nav>
					<ul>
						<li><a href="index.html">Home</a></li>
						<li class="assessment-menu"><a href="practical-privacy.html"{A_privacy}>Privacy</a><ul class="assessment-submenu"><li><a href="practical-privacy.html"{A_practical-privacy.html}>Practical Privacy</a></li><li><a href="privacy-ai-assessment.html"{A_privacy-ai-assessment.html}>Privacy &amp; AI Assessment</a></li><li><a href="gdpr-readiness.html"{A_gdpr-readiness.html}>GDPR Readiness</a></li><li><a href="edpb-digest.html"{A_edpb-digest.html}>EDPB Digest</a></li><li><a href="power-bi.html"{A_power-bi.html}>GDPR Fines Dashboard</a></li><li><a href="risk-matrix-original.html"{A_risk-matrix-original.html}>Risk Matrix</a></li></ul></li>
						<li class="assessment-menu"><a href="practical-ai-act-advice.html"{A_ai}>AI</a><ul class="assessment-submenu"><li><a href="practical-ai-act-advice.html"{A_practical-ai-act-advice.html}>AI Act Advice</a></li><li><a href="ai-act-digest.html"{A_ai-act-digest.html}>AI Act Digest</a></li><li><a href="privacy-ai-assessment.html#tool-ai">AI Risk Assessment</a></li></ul></li>
						<li class="assessment-menu"><a href="cookie-digest.html"{A_cookie}>Cookie Compliance</a><ul class="assessment-submenu"><li><a href="cookie-digest.html"{A_cookie-digest.html}>Cookie Digest</a></li><li><a href="cookie-banner-scanner.html"{A_cookie-banner-scanner.html}>Cookie Scanner</a></li></ul></li>
					</ul>
				</nav>
			</header>"""

CATEGORY = {"practical-privacy.html": "privacy", "privacy-ai-assessment.html": "privacy", "gdpr-readiness.html": "privacy", "edpb-digest.html": "privacy", "power-bi.html": "privacy", "risk-matrix-original.html": "privacy",
            "practical-ai-act-advice.html": "ai", "ai-act-digest.html": "ai",
            "cookie-digest.html": "cookie", "cookie-banner-scanner.html": "cookie"}

def header_for(active):
    h = HEADER
    cat = CATEGORY.get(active, "")
    def rep(m):
        key = m.group(1)
        return ' class="active"' if key == active or key == cat else ""
    return re.sub(r"\{A_([^}]+)\}", rep, h)

def swap(path, active):
    s = open(path, encoding="utf-8").read()
    m = re.search(r'\t*<header id="header">.*?</header>', s, re.S)
    assert m, path
    s2 = s[:m.start()] + header_for(active) + s[m.end():]
    assert s2.count('<header id="header">') == 1
    open(path, "w", encoding="utf-8", newline="\n").write(s2)
    print(path, len(s.encode("utf-8")), "->", len(s2.encode("utf-8")), "bytes; active", active)

if __name__ == "__main__":
    swap(sys.argv[1], sys.argv[2])
