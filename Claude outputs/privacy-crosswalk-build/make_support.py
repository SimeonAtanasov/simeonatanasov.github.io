# -*- coding: utf-8 -*-
"""Checks the NIST references of rows.py against the NIST-hosted crosswalks and writes
nist_hosted_support.json, the only thing of those crosswalks the build uses.

The two NIST-hosted workbooks carry no licence, so they are kept OUTSIDE the repo and are
never copied into it. This script reads the identifier pairs extracted from them
(nist_hosted_pairs.json, written by extract.py in the outside folder) and records:
  - per row, which of the row's own NIST subcategories the GDPR crosswalk (Enterprivacy
    Consulting Group) also pairs with a provision of that row;
  - counts that describe both files (how many subcategories, which articles, how the
    Microsoft file compares with the MIT-licensed Data Protection Mapping Project sheet).

Usage: python3 make_support.py <path to nist_hosted_pairs.json>
Run it again whenever rows.py changes its "sel" or "nist" lists, then rebuild.
"""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import rows as R

pairs = json.load(open(sys.argv[1], encoding="utf-8"))
EN = pairs["enterprivacy_pf_gdpr"]; MS = pairs["ms_pf_iso"]
for v in EN.values():
    for ref in v:
        assert re.fullmatch(r"(\([0-9a-z]+\))*", ref[1]), "malformed paragraph in the extracted pairs: %r" % ref
dp = json.load(open(os.path.join(HERE, "dpmp_mappings.json"), encoding="utf-8"))

def match(sel, art, para):
    pid = str(art) + "".join("." + x for x in re.findall(r"[0-9a-z]+", para))
    for s in sel:
        s2 = s.lstrip("=")
        if pid == s2 or pid.startswith(s2 + ".") or s2.startswith(pid + "."):
            return True
    return False

support = {}
for r in R.ROWS:
    ok = []
    for n in r["nist"]:
        if any(match(r["sel"], ref[0], ref[1]) for ref in EN.get(n, [])):
            ok.append(n)
    support[r["id"]] = ok

arts = sorted({ref[0] for v in EN.values() for ref in v})
def ranges(xs):
    out = []; a = b = xs[0]
    for x in xs[1:]:
        if x == b + 1: b = x
        else: out.append((a, b)); a = b = x
    out.append((a, b))
    return " and ".join("%d to %d" % t if t[0] != t[1] else str(t[0]) for t in out)

# DPMP sheet keyed to Version 1.0 identifiers (text match or identifier match)
d10 = {}
for e in dp["pf_iso"]["rows"]:
    if e["pf10"]: d10[e["pf10"]] = e["iso"]
same = sorted(k for k in MS if d10.get(k) == MS[k])
differ = sorted(k for k in MS if k in d10 and d10[k] != MS[k])
absent = [k for k in MS if k not in d10]
out = {
    "source": "Identifier pairs read from the two crosswalks in usnistgov/PrivacyFrmwkResources, commit 4b9d9b7 (4 February 2026). The workbooks carry no licence and are not in this repository.",
    "rows": support,
    "gdpr": {"mapped": sum(1 for v in EN.values() if v), "unmapped": [k for k, v in EN.items() if not v],
             "articles": ranges(arts),
             "url": "https://www.nist.gov/privacy-framework/resource-repository/browse/crosswalks/gdpr-crosswalk-enterprivacy-consulting-group"},
    "ms": {"subs": len(MS), "clauses": len({c for v in MS.values() for c in v}), "same": len(same), "differ": differ, "absent": absent,
           "url": "https://www.nist.gov/privacy-framework/resource-repository/browse/crosswalks/isoiec-27701-crosswalk-microsoft"},
}
json.dump(out, open(os.path.join(HERE, "nist_hosted_support.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
n = sum(len(r["nist"]) for r in R.ROWS); g = sum(len(v) for v in support.values())
print("NIST references:", n, "| also in the NIST-hosted GDPR crosswalk:", g)
print("Microsoft file vs DPMP sheet: same", len(same), "differ", differ, "absent", absent)
