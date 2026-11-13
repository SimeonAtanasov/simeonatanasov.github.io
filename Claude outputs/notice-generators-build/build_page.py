"""Build notice-generators.html from notice-generators.src.html.

Usage: python3 build_page.py <repo root> [--out <path>]

- __PANELS__    the four generator panels (markup only; ng.js fills them)
- __HEADER_UL__ the header nav, read from gdpr-fine-calculator.html in the repo,
                with the NAV-04 entries added if the source page lacks them, and the
                active marks set for this page (Privacy topic, Notice and Policy Generators)
- __OGIMAGE__   the og:image of privacy-ai-assessment.html

Written 12 November 2026. No em dashes anywhere: the check uses chr(0x2014).
"""
import re, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
PRIV_ENTRY = '<li><a href="notice-generators.html">Notice and Policy Generators</a></li>'
AI_ENTRY = '<li><a href="notice-generators.html#ai-notice">AI Notice and Policy Generators</a></li>'
PRIV_AFTER = '<li><a href="privacy-ai-assessment.html#tool-tia">Transfer Impact Assessment</a></li>'
AI_AFTER = '<li><a href="privacy-ai-assessment.html#tool-fria">Fundamental Rights Impact Assessment</a></li>'

GENS = [("pn", "Delivery checklist"), ("ai", "Disclosures to place"), ("dp", ""), ("aip", "")]


def panel(key, extra):
    tabs = ['<button type="button" class="ng-outtab" role="tab" data-view="doc">Document</button>',
            '<button type="button" class="ng-outtab" role="tab" data-view="check">Completeness check</button>']
    if extra:
        tabs.append('<button type="button" class="ng-outtab" role="tab" data-view="extra">%s</button>' % extra)
    acts = [("copy", "Copy text", "ng-btn-primary"), ("html", "Download HTML", ""), ("md", "Download Markdown", ""), ("print", "Print or save as PDF", ""),
            None, ("save", "Save", "ng-btn-ghost"), ("load", "Load", "ng-btn-ghost"), ("clear", "Clear", "ng-btn-ghost"), ("forget", "Forget", "ng-btn-ghost")]
    btns = "".join('<span class="ng-sep"></span>' if a is None else
                   '<button type="button" class="ng-btn %s" data-act="%s">%s</button>' % (a[2], a[0], a[1]) for a in acts)
    t = "\t" * 9
    return (t + '<div class="ng-panel" role="tabpanel" id="ng-panel-%s" aria-labelledby="ng-tab-%s" hidden>\n' % (key, key) +
            t + '\t<div class="ng-form"></div>\n' +
            t + '\t<div class="ng-out">\n' +
            t + '\t\t<h3 class="ng-outhead">Output</h3>\n' +
            t + '\t\t<div class="ng-actions">' + btns + '</div>\n' +
            t + '\t\t<p class="ng-status" aria-live="polite"></p>\n' +
            t + '\t\t<div class="ng-scorebox" aria-live="polite"></div>\n' +
            t + '\t\t<div class="ng-outtabs" role="tablist" aria-label="Output view">' + "".join(tabs) + '</div>\n' +
            t + '\t\t<div class="ng-view"></div>\n' +
            t + '\t\t<p class="ng-saved"></p>\n' +
            t + '\t</div>\n' +
            t + '</div>')


def header_ul(repo):
    src = open(os.path.join(repo, "gdpr-fine-calculator.html"), encoding="utf-8").read()
    m = re.search(r"<nav>\s*(<ul>.*?</ul>)\s*</nav>", src, re.S)
    assert m, "header nav not found"
    ul = re.sub(r'\s*class="active"', "", m.group(1))
    if PRIV_ENTRY not in ul:
        assert ul.count(PRIV_AFTER) == 1
        ul = ul.replace(PRIV_AFTER, PRIV_AFTER + PRIV_ENTRY)
    if AI_ENTRY not in ul:
        assert ul.count(AI_AFTER) == 1
        ul = ul.replace(AI_AFTER, AI_AFTER + AI_ENTRY)
    ul = ul.replace('<a href="practical-privacy.html">Privacy</a>', '<a href="practical-privacy.html" class="active">Privacy</a>', 1)
    ul = ul.replace(PRIV_ENTRY, PRIV_ENTRY.replace('<a href="notice-generators.html">', '<a href="notice-generators.html" class="active">'), 1)
    assert ul.count('class="active"') == 2
    return ul


def og_image(repo):
    p = os.path.join(repo, "privacy-ai-assessment.html")
    s = open(p, encoding="utf-8").read()
    m = re.search(r'<meta property="og:image" content="([^"]+)"', s)
    assert m, "og:image not found in privacy-ai-assessment.html"
    return m.group(1)


def main():
    repo = sys.argv[1]
    out = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else os.path.join(repo, "notice-generators.html")
    src = open(os.path.join(HERE, "notice-generators.src.html"), encoding="utf-8").read()
    html = src.replace("__PANELS__", "\n".join(panel(k, x) for k, x in GENS))
    html = html.replace("__HEADER_UL__", header_ul(repo))
    html = html.replace("__OGIMAGE__", og_image(repo))
    assert "__" + "PANELS" not in html and "__OGIMAGE__" not in html and "__HEADER_UL__" not in html
    assert chr(0x2014) not in html, "em dash in output"
    with open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)
    print("wrote", out, len(html.encode("utf-8")), "bytes")


if __name__ == "__main__":
    main()
