# -*- coding: utf-8 -*-
"""Builds the privacy crosswalk page (GDPR, ISO/IEC 27701 in the 2019 numbering, NIST
Privacy Framework 1.0).

Usage: python3 build_privacy_crosswalk.py <repo root> [--out <dir>]

Inputs (beside this script):
  rows.py                    the rows: GDPR obligation, NIST subcategories, note, gap
  gdpr.json                  article titles and EUR-Lex anchors
  nist_pf.json               Privacy Framework 1.0 Core, verbatim
  iso27701_2019.json         clause numbers and titles (2019 numbering), no standard text
  dpmp_mappings.json         the two Data Protection Mapping Project mappings (MIT)
  nist_hosted_support.json   the cross-check: which of the rows' NIST references the
                             NIST-hosted GDPR crosswalk also makes, and counts describing
                             both NIST-hosted files
  page_template.html         the page around the app
  crosswalk.js, crosswalk.css   the app, hand-written, copied as they are
  LICENSE-data-protection-mapping-project.txt   the MIT notice carried into the data file

Outputs (into the repo root, or --out):
  privacy-crosswalk.html
  pages/privacy-crosswalk/crosswalk-data.js, crosswalk.js, crosswalk.css

The header nav is read from a live root page at build time (gdpr-fine-calculator.html),
so there is no header template here to go stale. The head carries the block exactly as
Claude outputs/seo-build/apply_seo.py writes it (seo_block.html); after a change to the
title or the description, run apply_seo.py and copy the new block into seo_block.html.

No em dashes anywhere: the check uses chr(0x2014).
"""
import json, os, re, sys, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = sys.argv[1]
OUT = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else REPO
sys.path.insert(0, HERE)
import rows as R

EM = chr(0x2014)
PAGE = "privacy-crosswalk.html"
NAV_ENTRY = '<li><a href="privacy-crosswalk.html">Privacy Crosswalk</a></li>'
NAV_AFTER = '<li><a href="edpb-digest.html">EDPB Digest</a></li>'


def load(name):
    return json.load(open(os.path.join(HERE, name), encoding="utf-8"))


gdpr = load("gdpr.json")
nist = load("nist_pf.json")
iso = load("iso27701_2019.json")
dp = load("dpmp_mappings.json")
sup = load("nist_hosted_support.json")
G = dp["gdpr_iso"]["pairs"]

ISO_IDS = {x["id"] for x in iso["items"]}
ISO_TITLE = {x["id"]: x["title"] for x in iso["items"]}
ISO_LEAF = [x["id"] for x in iso["items"] if x["leaf"]]
NIST_IDS = {s["id"] for f in nist["functions"] for c in f["cats"] for s in c["subs"]}
assert len(NIST_IDS) == 100 and len(nist["functions"]) == 5 and sum(len(f["cats"]) for f in nist["functions"]) == 18


def isokey(s):
    return [int(p) for p in s.split(".")]


def provisions(sel):
    out = []
    for s in sel:
        if s.startswith("="):
            hit = [p for p in G if p == s[1:]]
        else:
            hit = [p for p in G if p == s or p.startswith(s + ".")]
        assert hit, "selector matches nothing: " + s
        out += hit
    return out


def prov_label(pid):
    parts = pid.split(".")
    return "Art. " + parts[0] + "".join("(" + x + ")" for x in parts[1:])


# Privacy Framework subcategory -> clauses, as published in the project (Version 1.0
# identifiers where the sheet's row could be matched).
PF_ISO = {}
for e in dp["pf_iso"]["rows"]:
    for c in e["iso"]:
        assert c in ISO_IDS, c
    if e["pf10"]:
        assert e["pf10"] in NIST_IDS and e["pf10"] not in PF_ISO, e
        PF_ISO[e["pf10"]] = set(e["iso"])

THEME_IDS = [t for t, _ in R.THEMES]
rows_out = []
seen = set()
last_theme = -1
counts = {"agree": 0, "alone": 0, "refs": 0}
for r in R.ROWS:
    assert r["id"] not in seen and re.match(r"^r\d\d$", r["id"]); seen.add(r["id"])
    assert r["role"] in R.ROLES and r["gap"] in ("", "partial", "none"), r["id"]
    ti = THEME_IDS.index(r["theme"]); assert ti >= last_theme, "rows out of theme order: " + r["id"]; last_theme = ti
    provs = provisions(r["sel"])
    row_iso = sorted({c for p in provs for c in G[p]}, key=isokey)
    for c in row_iso:
        assert c in ISO_IDS and ISO_TITLE[c], c
    # every article named on the card is covered by a selector, and the other way round
    sel_arts = {s.lstrip("=").split(".")[0] for s in r["sel"]}
    card_arts = {n for n, _ in r["gdpr"]}
    assert sel_arts == card_arts, (r["id"], sel_arts, card_arts)
    # a title quoted in the note must be the title of a clause in this row's ISO column
    titles = {ISO_TITLE[c] for c in row_iso}
    for c in row_iso:                      # and the headings above those clauses
        parts = c.split(".")
        for k in range(1, len(parts)):
            titles.add(ISO_TITLE.get(".".join(parts[:k]), ""))
    for q in re.findall(r'"([^"]+)"', r["note"]):
        assert q in titles, "%s: quoted title not in the row's ISO column: %s" % (r["id"], q)
    for num in re.findall(r"\((\d\.\d+(?:\.\d+)*)[ ,)]", r["note"]):
        assert num in row_iso, "%s: clause number in note not in the row's ISO column: %s" % (r["id"], num)
    assert (r["gap"] == "none") == (not r["nist"]), r["id"] + ": gap 'none' and an empty NIST list go together"
    nrefs = []
    assert len(set(r["nist"])) == len(r["nist"]), r["id"]
    for n in r["nist"]:
        assert n in NIST_IDS, n
        # Every reference is the site's reading ("S"). "A" is added where the NIST-hosted
        # GDPR crosswalk pairs the same subcategory with a provision of the row.
        src = ["S"]
        if n in sup["rows"].get(r["id"], []):
            src.append("A"); counts["agree"] += 1
        else:
            counts["alone"] += 1
        counts["refs"] += 1
        nrefs.append({"id": n, "src": src})
    for n in sup["rows"].get(r["id"], []):
        assert n in r["nist"], "stale nist_hosted_support.json: run make_support.py (%s %s)" % (r["id"], n)
    garts = []
    for n, label in r["gdpr"]:
        a = gdpr["articles"][n]
        garts.append({"n": n, "label": label, "title": a["title"], "href": gdpr["base"] + "#" + a["anchor"]})
    tool = {"href": r["tool"][0], "label": r["tool"][1]} if r["tool"] else None
    if tool:
        assert os.path.exists(os.path.join(REPO, tool["href"].split("#")[0])), tool["href"]
    rows_out.append({"id": r["id"], "theme": r["theme"], "role": r["role"], "gdpr": garts,
                     "obligation": r["obligation"], "iso": row_iso, "nist": nrefs,
                     "gap": r["gap"], "note": r["note"], "tool": tool})
assert set(sup["rows"]) <= seen, "stale nist_hosted_support.json"
# the note on r30 says it has more clauses than any other row
if "than for any other row" in " ".join(r["note"] for r in rows_out):
    longest = max(rows_out, key=lambda r: len(r["iso"]))
    assert "than for any other row" in longest["note"] and sum(1 for r in rows_out if len(r["iso"]) == len(longest["iso"])) == 1

# The published mappings, as published.
pub_gdpr = []
for pid, cl in G.items():
    if cl:
        n = pid.split(".")[0]
        pub_gdpr.append({"p": pid, "n": n, "title": gdpr["articles"][n]["title"], "label": prov_label(pid), "iso": cl})
pub_pf = [{"printed": e["printed_id"], "pf10": e["pf10"], "match": e["match"], "iso": e["iso"]} for e in dp["pf_iso"]["rows"]]
pf_meta = {"text": sum(1 for e in pub_pf if e["match"] == "text"), "id": sum(1 for e in pub_pf if e["match"] == "id"),
           "none": sum(1 for e in pub_pf if e["match"] == "none"),
           "absent": [s["id"] for f in nist["functions"] for c in f["cats"] for s in c["subs"] if s["id"] not in PF_ISO]}
assert sorted(pf_meta["absent"]) == sorted(sup["ms"]["absent"]), "support file and project sheet disagree; run make_support.py"

data = {
    "themes": [{"id": t, "label": l} for t, l in R.THEMES],
    "roles": R.ROLES,
    "rows": rows_out,
    "iso": iso["items"],
    "nist": nist["functions"],
    "pub": {
        "gdprIso": pub_gdpr,
        "pfIso": pub_pf,
        "meta": {
            "dpmp": {"copyright": "Copyright 2020 Data Protection Mapping Project.", "commit": "2ff78ec",
                     "url": "https://github.com/microsoft/data-protection-mapping-project",
                     "licenceUrl": "https://github.com/microsoft/data-protection-mapping-project/blob/master/LICENSE.txt"},
            "pf": pf_meta,
            "hosted": {"ms": sup["ms"], "gdpr": sup["gdpr"]},
        },
    },
}
blob = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
assert EM not in blob, "em dash in data"

# ---------------------------------------------------------------- page ---
def header_ul():
    src = open(os.path.join(REPO, "gdpr-fine-calculator.html"), encoding="utf-8").read()
    m = re.search(r"<nav>\s*(<ul>.*?</ul>)\s*</nav>", src, re.S)
    assert m, "header nav not found"
    ul = re.sub(r'\s*class="active"', "", m.group(1))
    if NAV_ENTRY not in ul:
        assert ul.count(NAV_AFTER) == 1
        ul = ul.replace(NAV_AFTER, NAV_AFTER + NAV_ENTRY)
    ul = ul.replace('<a href="practical-privacy.html">Privacy</a>', '<a href="practical-privacy.html" class="active">Privacy</a>', 1)
    ul = ul.replace(NAV_ENTRY, NAV_ENTRY.replace('<a href="privacy-crosswalk.html">', '<a href="privacy-crosswalk.html" class="active">'), 1)
    assert ul.count('class="active"') == 2
    return ul


iso_used = {c for r in rows_out for c in r["iso"]}
nist_used = {n["id"] for r in rows_out for n in r["nist"]}
template = open(os.path.join(HERE, "page_template.html"), encoding="utf-8").read()
seo = open(os.path.join(HERE, "seo_block.html"), encoding="utf-8").read().rstrip("\n")
page = (template
        .replace("__SEO_BLOCK__", seo)
        .replace("__HEADER_UL__", header_ul())
        .replace("@@N_ROWS@@", str(len(rows_out)))
        .replace("@@ISO_USED@@", str(len(iso_used))).replace("@@ISO_TOTAL@@", str(len(ISO_LEAF)))
        .replace("@@NIST_USED@@", str(len(nist_used))).replace("@@NIST_TOTAL@@", str(len(NIST_IDS)))
        .replace("@@N_REFS@@", str(counts["refs"])).replace("@@N_AGREE@@", str(counts["agree"]))
        .replace("@@N_ALONE@@", str(counts["alone"]))
        .replace("@@N_PROC@@", str(sum(1 for r in rows_out if r["role"] in ("processor", "both"))))
        .replace("@@N_CTRL@@", str(sum(1 for r in rows_out if r["role"] in ("controller", "both")))))
assert "@@" not in page and "__SEO_BLOCK__" not in page and "__HEADER_UL__" not in page
assert EM not in page, "em dash in page"
desc = re.search(r'<meta name="description" content="([^"]*)"', page).group(1)
assert len(desc) <= 160, "description is %d characters" % len(desc)
assert "2025 clauses" not in desc and "27701:2025" not in desc

licence = open(os.path.join(HERE, "LICENSE-data-protection-mapping-project.txt"), encoding="utf-8").read().strip()
assert "*/" not in licence
head = ("/* Generated by Claude outputs/privacy-crosswalk-build/build_privacy_crosswalk.py. Do not edit by hand.\n"
        " *\n"
        " * The ISO/IEC 27701:2019 clause numbers and titles and the two mappings under \"pub\" (gdprIso, pfIso)\n"
        " * come from the Data Protection Mapping Project, https://github.com/microsoft/data-protection-mapping-project,\n"
        " * and are used under its licence:\n"
        " *\n" + "\n".join(" * " + l if l.strip() else " *" for l in licence.split("\n")) + "\n"
        " *\n"
        " * The NIST Privacy Framework text is quoted from NIST Privacy Framework Version 1.0 (public domain).\n"
        " */\n")
assert EM not in head

pdir = os.path.join(OUT, "pages", "privacy-crosswalk")
os.makedirs(pdir, exist_ok=True)
open(os.path.join(OUT, PAGE), "w", encoding="utf-8", newline="\n").write(page)
open(os.path.join(pdir, "crosswalk-data.js"), "w", encoding="utf-8", newline="\n").write(head + "window.PC_DATA = " + blob + ";\n")
for f in ("crosswalk.js", "crosswalk.css"):
    src = open(os.path.join(HERE, f), encoding="utf-8").read()
    assert EM not in src, "em dash in " + f
    shutil.copyfile(os.path.join(HERE, f), os.path.join(pdir, f))
print("rows", len(rows_out), "| ISO", len(iso_used), "of", len(ISO_LEAF), "| NIST", len(nist_used), "of", len(NIST_IDS))
print("NIST references", counts["refs"], "| agree with the NIST-hosted GDPR crosswalk", counts["agree"], "| site's reading alone", counts["alone"])
print("gaps:", {g: sum(1 for r in rows_out if r["gap"] == g) for g in ("", "partial", "none")})
print("written to", OUT)
