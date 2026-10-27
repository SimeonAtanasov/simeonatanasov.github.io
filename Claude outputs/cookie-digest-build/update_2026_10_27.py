# -*- coding: utf-8 -*-
"""Cookie digest update of 27 October 2026. Edits all_merged.json in place (run after
update_2026_10_23.py; both come after apply_source_review.py, apply_recheck.py and
apply_close16.py if all_merged.json is ever regenerated) plus the DATE wording in
build_cookie_page.py and the PDF path in build_cookie_pdf.py. Refuses to run twice.

- New entry: Article 29 Working Party Opinion 04/2012 on Cookie Consent Exemption
  (00879/12/EN, WP 194, adopted 7 June 2012). The digest had no entry for the one EU-level
  document that reads the two Article 5(3) exemptions and states the rule for cookies with
  several purposes (section 2.4: exempt only if every purpose is exempt on its own). Read from
  the PDF on ec.europa.eu through the fetch tool: sections 2 (criteria A and B), 2.4, 3.1 to
  3.7, 4.1 to 4.3 and the section 5 guidelines.

Net: 260 entries become 261.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "all_merged.json")
C = json.load(open(P, encoding="utf-8"))
if any("WP 194" in c["title"] for c in C):
    sys.exit("already applied: WP 194 entry present")
assert len(C) == 260

def one(pred):
    hit = [c for c in C if pred(c)]
    assert len(hit) == 1, len(hit)
    return hit[0]

anchor = one(lambda c: c["title"].startswith("EDPB Opinion 5/2019 on the interplay"))

WP194 = {
    "title": "Article 29 Working Party Opinion 04/2012 on Cookie Consent Exemption (WP 194)",
    "jurisdiction": "EU",
    "type": "regulator guidance",
    "date": "7 June 2012",
    "url": "https://ec.europa.eu/justice/article-29/documentation/opinion-recommendation/files/2012/wp194_en.pdf",
    "status": "in force",
    "takeaway": (
        "The Working Party reads the two exemptions in Article 5(3) of the ePrivacy Directive: Criterion A, storage "
        "or access for the sole purpose of carrying out the transmission of a communication, and Criterion B, storage "
        "or access strictly necessary for an information society service the user has explicitly requested, judged "
        "from the user's point of view rather than the provider's. Seven cookie types can qualify, most of them for "
        "the session only: user input such as a shopping basket, authentication, user-centric security, multimedia "
        "player session, load balancing, UI customisation and social plug-in content sharing for logged-in members. "
        "Social plug-in tracking, third-party advertising and first-party analytics cookies do not: first-party "
        "analytics limited to aggregated statistics with an opt-out and IP anonymisation are called a low privacy "
        "risk, but still need consent, and the opinion asked the legislator for a third exemption to cover them, "
        "which the Council's October 2026 Digital Omnibus mandate would now write into Article 5(3). Section 2.4 "
        "states the rule for a cookie with several purposes: exempt only if every one of its purposes is exempt on "
        "its own. Adopted 7 June 2012 as WP 194; it never bound anyone and the EDPB has not revisited it, but it "
        "remains the EU-level reading of the exemptions that national regulators' lists of exempt cookies follow. "
        "Classify every storage or access operation by purpose, and treat a cookie serving an exempt and a "
        "non-exempt purpose as a consent cookie in every configuration that reads it."
    ),
    "topics": ["strictly-necessary", "analytics-exemption", "consent"],
    "source": "primary",
    "cluster": "eu",
}
assert chr(0x2014) not in WP194["takeaway"] + WP194["title"]
assert all(ord(ch) < 128 for ch in WP194["takeaway"] + WP194["title"])
C.insert(C.index(anchor) + 1, WP194)
assert len(C) == 261
open(P, "w", encoding="utf-8").write(json.dumps(C, ensure_ascii=False, indent=1))

REPL = {
    "build_cookie_page.py": [('DATE = "19 September 2026, updated 23 October 2026"', 'DATE = "19 September 2026, updated 27 October 2026"')],
    "build_cookie_pdf.py": [('"/mnt/user-data/outputs/cookie-compliance-digest-2026-10-23.pdf"',
                             '"/mnt/user-data/outputs/cookie-compliance-digest-2026-10-27.pdf"')],
}
for f, pairs in REPL.items():
    fp = os.path.join(HERE, f)
    s = open(fp, encoding="utf-8").read()
    for x, y in pairs:
        assert s.count(x) == 1, (f, x)
        s = s.replace(x, y)
    open(fp, "w", encoding="utf-8", newline="\n").write(s)
print("all_merged.json: %d entries" % len(C))
