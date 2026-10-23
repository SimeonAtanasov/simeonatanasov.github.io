# -*- coding: utf-8 -*-
"""Cookie digest update of 23 October 2026. Edits all_merged.json in place (run after
apply_source_review.py, apply_recheck.py and apply_close16.py if all_merged.json is ever
regenerated) plus the DATE wording in build_cookie_page.py and the PDF path in
build_cookie_pdf.py. Refuses to run twice.

- SB 690 (California): approved by the Governor 30 September 2026, Chapter 976, Statutes of
  2026. Read from the chaptered text and the bill status page on leginfo.legislature.ca.gov.
  Type proposal -> legislation, status applies from a future date (1 January 2027).
- New entry: the Council's negotiating mandate on the Digital Omnibus, Council document
  14756/26 of 22 October 2026 (agreed in Coreper 21 October 2026). Read from the mandate
  itself, pages 143 to 145 (Articles 88a and 88b struck out) and 156 to 158 (new ePrivacy
  Article 5(3)), rendered as images because the text layer mixes struck and inserted words.
- Digital Omnibus proposal entry: the closing status sentence now points at the mandate.
- W3C GPC: the current Working Draft is 24 September 2026; the four-states sentence was
  rechecked against it.

Net: 259 entries become 260.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "all_merged.json")
C = json.load(open(P, encoding="utf-8"))
if any("14756/26" in c["title"] for c in C):
    sys.exit("already applied: Council mandate entry present")
assert len(C) == 259

def one(pred):
    hit = [c for c in C if pred(c)]
    assert len(hit) == 1, len(hit)
    return hit[0]

sb = one(lambda c: c["title"].startswith("SB 690 (2025-2026)"))
assert sb["type"] == "proposal" and sb["status"] == "proposed"
sb.update({
    "title": "SB 690 (2025-2026), Chapter 976, Statutes of 2026: amendment of Cal. Penal Code 637.2 for pen register and trap and trace claims against websites and apps",
    "type": "legislation",
    "date": "30 September 2026",
    "status": "applies from a future date",
    "takeaway": (
        "Approved by the Governor on 30 September 2026 as Chapter 976, Statutes of 2026, SB 690 amends only section "
        "637.2: an action against a private actor for a section 638.51 pen register or trap and trace violation arising "
        "from conduct on an internet website, online application or mobile application may be brought only by the "
        "Attorney General. The change reaches pending claims in actions commenced within two years before it operates, "
        "and as a non-urgency statute it operates from 1 January 2027. Sections 631 and 632 are untouched, so wiretap "
        "and eavesdropping claims over pixels, chat and session replay stay open to private plaintiffs. Keep "
        "prior-consent gating for those tools; SB 690 removes one theory, not the risk."
    ),
})

om = one(lambda c: c["title"].startswith("Digital Omnibus proposal, COM(2025) 837"))
old = "As of September 2026 the file remains in committee with no Council general approach and no trilogue."
assert om["takeaway"].endswith(old)
om["takeaway"] = om["takeaway"][: -len(old)] + (
    "The Council's negotiating mandate of 21 October 2026 deletes both articles and keeps the rule in the ePrivacy "
    "Directive (see the separate entry); the Parliament has not yet adopted its position, so trilogues have not started.")

gpc = one(lambda c: c["title"].startswith("W3C Global Privacy Control (GPC) specification"))
a = "a W3C Working Draft of 17 September 2026"
assert gpc["takeaway"].count(a) == 1 and gpc["date"] == "17 September 2026"
gpc["takeaway"] = gpc["takeaway"].replace(a, "a W3C Working Draft of 24 September 2026")
gpc["date"] = "24 September 2026"

MANDATE = {
    "title": "Council mandate on the Digital Omnibus, 2025/0360(COD), Council document 14756/26: cookie rules kept in ePrivacy Article 5(3)",
    "jurisdiction": "EU",
    "type": "proposal",
    "date": "21 October 2026",
    "url": "https://data.consilium.europa.eu/doc/document/ST-14756-2026-INIT/en/pdf",
    "status": "proposed",
    "takeaway": (
        "The Council's negotiating position, agreed in Coreper on 21 October 2026, deletes the proposed GDPR Articles "
        "88a and 88b and rewrites Article 5(3) of the ePrivacy Directive instead: storing or reading information on a "
        "device still needs consent to the GDPR standard, unless solely related to and strictly necessary for one of six "
        "purposes, namely transmission, a service the user explicitly requested, anonymous aggregated first-party "
        "audience measurement, media audience measurement under Article 24 of the European Media Freedom Act, security, "
        "and measuring contextual advertising without profiling. Refusal must take a single click, and after a refusal "
        "no new request for the same purpose may be made for at least four months. The browser-signal duty is gone, "
        "GDPR supervisory authorities would enforce the rule, and Member States would apply it 24 months after "
        "adoption. A negotiating text, not law: trilogues start once the Parliament has its position."
    ),
    "topics": ["analytics-exemption", "consent", "browser-signals"],
    "source": "primary",
    "cluster": "eu",
}
for c in (sb, om, gpc, MANDATE):
    assert chr(0x2014) not in c["takeaway"] + c["title"]
C.insert(C.index(om) + 1, MANDATE)
assert len(C) == 260
open(P, "w", encoding="utf-8").write(json.dumps(C, ensure_ascii=False, indent=1))

REPL = {
    "build_cookie_page.py": [('DATE = "19 September 2026"', 'DATE = "19 September 2026, updated 23 October 2026"')],
    "build_cookie_pdf.py": [('"/mnt/user-data/outputs/cookie-compliance-digest-2026-09-19.pdf"',
                             'os.environ.get("PDFOUT", "/mnt/user-data/outputs/cookie-compliance-digest-2026-10-23.pdf")')],
}
for f, pairs in REPL.items():
    fp = os.path.join(HERE, f)
    s = open(fp, encoding="utf-8").read()
    for x, y in pairs:
        assert s.count(x) == 1, (f, x)
        s = s.replace(x, y)
    open(fp, "w", encoding="utf-8", newline="\n").write(s)
print("all_merged.json: %d entries" % len(C))
