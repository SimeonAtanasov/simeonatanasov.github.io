# NAV-05 and HOME-04 (16 November 2026): the privacy crosswalk in the site navigation.
#
# NAV-05: "Privacy Crosswalk" in the Privacy menu, after EDPB Digest, on the 20 pages that
# carry the header menu and in the three header templates (swap_header.py with its CATEGORY
# line, gdpr-enforcement-build/header.html, ai-crosswalk-build/page_template.html); the
# sitemap entry after edpb-digest.html; the PAGES row and the llms.txt line in apply_seo.py.
# HOME-04 (on Simeon's instruction): one entry in the Privacy group of the home page
# Portfolio flyout, after EDPB Digest. Nothing else in index.html changes: the script refuses
# to write unless everything from <section id="two" onwards is byte-identical.
#
# Read-modify-write with assertions. Before-images go to BASE (outside the repo), one
# folder per change id. Run it before build_privacy_crosswalk.py, then run apply_seo.py.
# Usage: python3 wire_nav05.py REPO BASE [--dry]
#   BASE is the tool-baselines folder outside the repo, for example
#   ".../GitHub-projects-data/simeonatanasov.com/Claude outputs/tool-baselines"
import sys, os, re, glob, hashlib, shutil

R = sys.argv[1]; BASE = sys.argv[2]; DRY = "--dry" in sys.argv
EM = chr(0x2014)
NEW = "privacy-crosswalk.html"


def rd(p):
    return open(os.path.join(R, p), "rb").read().decode("utf-8")


def readable(p):
    try:
        return open(p, encoding="utf-8").read()
    except OSError:
        print("skipped, not readable here:", os.path.basename(p)); return ""


out = {}      # path -> new text
change = {}   # path -> change id

# ---------------------------------------------------------------- header menus
ENTRY = '<li><a href="privacy-crosswalk.html">Privacy Crosswalk</a></li>'
PAT = re.compile(r'<li><a href="edpb-digest\.html"( class="active")?>EDPB Digest</a></li>')
pages = sorted(os.path.basename(p) for p in glob.glob(os.path.join(R, "*.html"))
               if os.path.basename(p) != NEW and "assessment-menu" in readable(p))
assert len(pages) == 20, pages
for p in pages:
    s = rd(p)
    menu = [l for l in s.split("\n") if "assessment-menu" in l]
    assert NEW not in s, p + " already wired"
    assert len(PAT.findall("\n".join(menu))) == 1 and len(PAT.findall(s)) == 1, p
    out[p] = PAT.sub(lambda m: m.group(0) + ENTRY, s); change[p] = "NAV-05"

SWAP = "Claude outputs/site-nav-build/swap_header.py"
s = rd(SWAP)
a = '<li><a href="edpb-digest.html"{A_edpb-digest.html}>EDPB Digest</a></li>'
assert s.count(a) == 1 and NEW not in s
s = s.replace(a, a + '<li><a href="privacy-crosswalk.html"{A_privacy-crosswalk.html}>Privacy Crosswalk</a></li>')
c = '"edpb-digest.html": "privacy", '
assert s.count(c) == 1
out[SWAP] = s.replace(c, c + '"privacy-crosswalk.html": "privacy", '); change[SWAP] = "NAV-05"
for p in ("Claude outputs/gdpr-enforcement-build/header.html", "Claude outputs/ai-crosswalk-build/page_template.html"):
    s = rd(p)
    assert len(PAT.findall(s)) == 1 and NEW not in s, p
    out[p] = PAT.sub(lambda m: m.group(0) + ENTRY, s); change[p] = "NAV-05"

# The 20 menus must be identical apart from active marks (whitespace collapsed).
def navsig(t):
    lines = [l for l in t.split("\n") if "assessment-menu" in l]
    return hashlib.md5(re.sub(r"\s+", " ", " ".join(lines).replace(' class="active"', "")).encode()).hexdigest()
sigs = set(navsig(out[p]) for p in pages)
print("nav signatures over", len(pages), "pages:", len(sigs), sorted(sigs)); assert len(sigs) == 1

# ---------------------------------------------------------------- sitemap
p = "sitemap.xml"; s = rd(p)
a = "\t\t<loc>https://www.simeonatanasov.com/edpb-digest.html</loc>"
i = s.find(a); assert i != -1 and s.count(a) == 1 and NEW not in s
j = s.index("</url>", i) + len("</url>")
entry = "\n\t<url>\n\t\t<loc>https://www.simeonatanasov.com/privacy-crosswalk.html</loc>\n\t\t<lastmod>2026-11-16</lastmod>\n\t\t<priority>0.8</priority>\n\t</url>"
out[p] = s[:j] + entry + s[j:]; change[p] = "NAV-05"
assert out[p].count("<url>") == s.count("<url>") + 1 == 22

# ---------------------------------------------------------------- apply_seo.py
p = "Claude outputs/seo-build/apply_seo.py"; s = rd(p)
a = '    "edpb-digest.html": ("collection",\n'
assert s.count(a) == 1 and NEW not in s
row = ('    "privacy-crosswalk.html": ("page",\n'
       '        "GDPR obligations for controllers and processors mapped to NIST Privacy Framework 1.0 "\n'
       '        "subcategories and ISO/IEC 27701 clauses in the 2019 numbering, gaps marked.",\n'
       '        "images/avatar.png", "GDPR, ISO/IEC 27701:2019 and NIST Privacy Framework Crosswalk", "Digests"),\n')
s = s.replace(a, row + a)
b = '    "privacy-ai-assessment.html":\n        "Free privacy and AI governance assessments:'
assert s.count(b) == 1
llms = ('    "privacy-crosswalk.html":\n'
        '        "36 GDPR obligations for controllers and processors mapped to NIST Privacy Framework 1.0 "\n'
        '        "subcategories, each reference marked with its source, and to ISO/IEC 27701 clauses in the "\n'
        '        "2019 numbering as published in the Data Protection Mapping Project, with gaps marked and "\n'
        '        "reverse views by clause and by subcategory.",\n')
out[p] = s.replace(b, llms + b); change[p] = "NAV-05"

# ---------------------------------------------------------------- home page flyout (HOME-04)
p = "index.html"; s = rd(p)
assert NEW not in s, "index.html already wired"
tail = s[s.index('<section id="two"'):]
T = "\t" * 9
a = T + '<li><a href="edpb-digest.html">EDPB Digest</a></li>\n'
assert s.count(a) == 1
s2 = s.replace(a, a + T + '<li><a href="privacy-crosswalk.html">Privacy Crosswalk</a></li>\n')
assert s2[s2.index('<section id="two"'):] == tail, "section two changed"
assert len(s2) - len(s) == len(T + '<li><a href="privacy-crosswalk.html">Privacy Crosswalk</a></li>\n')
out[p] = s2; change[p] = "HOME-04"

# ---------------------------------------------------------------- write
for p in sorted(out):
    s = out[p]; old = open(os.path.join(R, p), "rb").read()
    assert EM not in s or EM in old.decode("utf-8"), p + ": em dash introduced"
    assert ("\r\n" in old.decode("utf-8")) == ("\r\n" in s), p + ": line endings changed"
    b = s.encode("utf-8")
    if not DRY:
        bdir = os.path.join(BASE, "2026-11-16-" + change[p])
        os.makedirs(bdir, exist_ok=True)
        bp = os.path.join(bdir, p.replace("Claude outputs/", "Claude_outputs_").replace("/", "_"))
        if not os.path.exists(bp):
            open(bp, "wb").write(old)
        assert hashlib.md5(open(bp, "rb").read()).hexdigest() == hashlib.md5(old).hexdigest() or NEW in old.decode("utf-8")
        open(os.path.join(R, p), "wb").write(b)
    print("%-8s %-58s %7d %s -> %7d %s" % (change[p], p, len(old), hashlib.md5(old).hexdigest(), len(b), hashlib.md5(b).hexdigest()))
print("dry run, nothing written" if DRY else "written: %d files" % len(out))
