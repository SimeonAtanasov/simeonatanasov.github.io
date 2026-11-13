# NAV-04 (12 November 2026): Notice and Policy Generators in the header nav of the 19 pages
# that carry it and in the three header templates, plus the sitemap entry.
# Privacy menu: "Notice and Policy Generators" after Transfer Impact Assessment.
# AI menu: "AI Notice and Policy Generators" (notice-generators.html#ai-notice) after
# Fundamental Rights Impact Assessment. The home page is not touched: its flyout and cards
# change only on Simeon's instruction.
# Read-modify-write with assertions; baselines go to Claude outputs/tool-baselines/2026-11-12-NAV-04/.
# Usage: python3 wire_nav04.py REPO [--dry]
import sys, os, re, glob, hashlib, shutil
R = sys.argv[1]; DRY = "--dry" in sys.argv
BASE = os.path.join(R, "Claude outputs", "tool-baselines", "2026-11-12-NAV-04")
def rd(p): return open(os.path.join(R, p), "rb").read().decode("utf-8")

P_OLD = '<li><a href="privacy-ai-assessment.html#tool-tia">Transfer Impact Assessment</a></li>'
P_NEW = P_OLD + '<li><a href="notice-generators.html">Notice and Policy Generators</a></li>'
P_NEW_TPL = P_OLD + '<li><a href="notice-generators.html"{A_notice-generators.html}>Notice and Policy Generators</a></li>'
A_OLD = '<li><a href="privacy-ai-assessment.html#tool-fria">Fundamental Rights Impact Assessment</a></li>'
A_NEW = A_OLD + '<li><a href="notice-generators.html#ai-notice">AI Notice and Policy Generators</a></li>'
SWAP = "Claude outputs/site-nav-build/swap_header.py"
TEMPLATES = [SWAP, "Claude outputs/gdpr-enforcement-build/header.html", "Claude outputs/ai-crosswalk-build/page_template.html"]

def readable(p):
    # OneDrive placeholders that are not downloaded raise EINVAL in the device shell. None of
    # them carries the nav (404, offline, test-page on 12 Nov 2026); the count below still
    # fails loudly if a nav page is among them.
    try:
        return open(p, encoding="utf-8").read()
    except OSError:
        print("skipped, not readable here:", os.path.basename(p)); return ""
pages = sorted(os.path.basename(p) for p in glob.glob(os.path.join(R, "*.html"))
               if os.path.basename(p) != "notice-generators.html" and "assessment-menu" in readable(p))
assert len(pages) == 19, pages
out = {}
for p in pages + TEMPLATES:
    s = rd(p)
    assert s.count(P_OLD) == 1 and s.count(A_OLD) == 1, p
    assert "notice-generators.html" not in s, p + " already wired"
    s = s.replace(P_OLD, P_NEW_TPL if p == SWAP else P_NEW).replace(A_OLD, A_NEW)
    out[p] = s

# swap_header.py: the new page is in the Privacy category.
s = out[SWAP]
C_OLD = '"privacy-ai-assessment.html": "privacy", '
assert s.count(C_OLD) == 1
out[SWAP] = s.replace(C_OLD, C_OLD + '"notice-generators.html": "privacy", ')

# sitemap: after privacy-ai-assessment.html.
p = "sitemap.xml"; s = rd(p)
S_OLD = "\t\t<loc>https://www.simeonatanasov.com/privacy-ai-assessment.html</loc>\n\t\t<lastmod>2026-10-03</lastmod>\n\t\t<priority>"
i = s.find(S_OLD); assert i != -1 and s.count(S_OLD) == 1 and "notice-generators.html" not in s
j = s.index("</url>", i) + len("</url>")
entry = "\n\t<url>\n\t\t<loc>https://www.simeonatanasov.com/notice-generators.html</loc>\n\t\t<lastmod>2026-11-12</lastmod>\n\t\t<priority>0.8</priority>\n\t</url>"
out[p] = s[:j] + entry + s[j:]
assert out[p].count("<url>") == s.count("<url>") + 1

# The 19 navs must be identical apart from active marks (whitespace collapsed).
def navsig(t):
    lines = [l for l in t.split("\n") if "assessment-menu" in l]
    return hashlib.md5(re.sub(r"\s+", " ", " ".join(lines).replace(' class="active"', "")).encode()).hexdigest()
sigs = set(navsig(out[p]) for p in pages)
print("nav signatures:", len(sigs)); assert len(sigs) == 1
for p, s in out.items():
    assert chr(0x2014) not in s or chr(0x2014) in rd(p), p + ": em dash introduced"
    b = s.encode("utf-8")
    if not DRY:
        os.makedirs(BASE, exist_ok=True)
        bp = os.path.join(BASE, p.replace("Claude outputs/", "Claude_outputs_").replace("/", "_"))
        if not os.path.exists(bp):
            shutil.copyfile(os.path.join(R, p), bp)
        open(os.path.join(R, p), "wb").write(b)
    print("%-58s %7d -> %7d %s" % (p, len(rd(p).encode()) if DRY else len(open(os.path.join(BASE, p.replace("Claude outputs/", "Claude_outputs_").replace("/", "_")), "rb").read()), len(b), hashlib.md5(b).hexdigest()))
