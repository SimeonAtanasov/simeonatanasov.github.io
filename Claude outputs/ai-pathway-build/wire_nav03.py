# NAV-03 and the TC-08 page copy: AI Assessment Pathway in the header nav (19 pages and the
# three header templates), the home flyout and card, and the assessment page intro.
# Read-modify-write with assertions. Usage: python3 wire_nav03.py REPO [--dry]
import sys, os, re, glob, hashlib
R = sys.argv[1]; DRY = "--dry" in sys.argv
def rd(p): return open(os.path.join(R, p), "rb").read().decode("utf-8")
out = {}
NAV_OLD = 'AI Governance Crosswalk</a></li><li><a href="privacy-ai-assessment.html#tool-ai">'
NAV_NEW = 'AI Governance Crosswalk</a></li><li><a href="privacy-ai-assessment.html#tool-aipath">AI Assessment Pathway</a></li><li><a href="privacy-ai-assessment.html#tool-ai">'
pages = sorted(os.path.basename(p) for p in glob.glob(os.path.join(R, "*.html")) if "assessment-menu" in open(p, encoding="utf-8").read())
assert len(pages) == 19, pages
for p in pages + ["Claude outputs/site-nav-build/swap_header.py", "Claude outputs/gdpr-enforcement-build/header.html", "Claude outputs/ai-crosswalk-build/page_template.html"]:
    s = out.get(p) or rd(p)
    assert s.count(NAV_OLD) == 1 and "tool-aipath" not in s, p
    out[p] = s.replace(NAV_OLD, NAV_NEW)

# Assessment page copy
p = "privacy-ai-assessment.html"; s = out[p]
D_OLD = "fundamental rights impact, transfer impact and generative AI risk."
D_NEW = "fundamental rights impact, transfer impact, generative AI risk and an AI assessment pathway."
assert s.count(D_OLD) == 4; s = s.replace(D_OLD, D_NEW)
assert s.count("<p>Nine practitioner-built assessments") == 1
s = s.replace("<p>Nine practitioner-built assessments", "<p>Ten practitioner-built assessments")
T_OLD = "which follows the six steps of EDPB Recommendations 01/2020."
assert s.count(T_OLD) == 1, s.count(T_OLD)
s = s.replace(T_OLD, T_OLD + " The <strong>AI Assessment Pathway</strong> runs the AI tools as one: a shared intake asked once, an impact level from I to IV that sets how deep the rest goes, generative AI and EU AI Act modules that open only when they apply, and one risk register mapped to the NIST AI RMF, NIST AI 600-1, ISO/IEC 42001 and the Singapore framework for generative AI, with handovers to the DPIA and the FRIA.")
out[p] = s

# Home page: everything from <section id="two" stays byte-identical.
p = "index.html"; s = rd(p); before_two = s[s.index('<section id="two"'):]
F_OLD = '\t<li><a href="ai-governance-crosswalk.html">AI Governance Crosswalk</a></li>\n'
assert s.count(F_OLD) == 1
s = s.replace(F_OLD, F_OLD + '\t\t\t\t\t\t\t\t\t<li><a href="privacy-ai-assessment.html#tool-aipath">AI Assessment Pathway</a></li>\n')
C_OLD = '\t\t\t\t\t\t\t\t<a href="privacy-ai-assessment.html#tool-ai" class="tool-chip">AI Risk Assessment</a>\n'
assert s.count(C_OLD) == 1
s = s.replace(C_OLD, '\t\t\t\t\t\t\t\t<a href="privacy-ai-assessment.html#tool-aipath" class="tool-chip">AI Assessment Pathway</a>\n' + C_OLD)
P_OLD = "<p>Nine practitioner-built tools: a privacy assessment"
assert s.count(P_OLD) == 1
s = s.replace(P_OLD, "<p>Ten practitioner-built tools: an AI assessment pathway that runs the AI tools as one from a single intake, a privacy assessment")
assert s[s.index('<section id="two"'):] == before_two, "section two changed"
out[p] = s

# Checks: the 19 navs identical apart from active marks.
def navsig(t):
    lines = [l for l in t.split("\n") if "assessment-menu" in l]
    # Pages differ in indentation and line breaks only, so whitespace is collapsed.
    return hashlib.md5(re.sub(r"\s+", " ", " ".join(lines).replace(' class="active"', "")).encode()).hexdigest()
sigs = set(navsig(out[p]) for p in pages)
print("nav signatures:", len(sigs))
assert len(sigs) == 1
for p, s in out.items():
    b = s.encode("utf-8")
    if not DRY:
        open(os.path.join(R, p), "wb").write(b)
    print("%-60s %7d -> %7d %s" % (p, len(rd(p).encode()) if DRY else 0, len(b), hashlib.md5(b).hexdigest()))
