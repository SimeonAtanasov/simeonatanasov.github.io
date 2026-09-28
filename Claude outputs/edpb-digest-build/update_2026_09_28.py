# -*- coding: utf-8 -*-
"""EDPB digest update of 28 September 2026: the two guidelines the EDPB adopted on
17 September 2026 (announced 21 September).

- Guidelines 3/2025 on the interplay between the DSA and the GDPR, final version 2.0:
  added to Guidelines as a written entry. The consultation version (id 540) is removed,
  since the Consultation versions group holds only documents still at consultation stage.
- Guidelines 04/2026 on imposing administrative fines, version 1.0 for consultation
  (comments until 13 November 2026): added to Consultation versions.

Both takeaways were written from the PDFs themselves (edpb_guidelines_202503_interplay-dsa-gdpr_v2_en.pdf,
edpb_guidelines_202604_imposing-administrative-fines_v1_en_1.pdf) and the EDPB consultation report on 3/2025.

Net: 543 entries become 544, written takeaways 117 become 118.
Edits digest.json in place and the DATE and count wording in build_digest_page.py and
build_digest_pdf.py. Refuses to run twice. Run after the chain listed in the README
(fix_edpb_review.py, add_consultations.py, apply_source_review.py, apply_linkfix.py,
apply_recheck2.py edpb) if digest.json is ever regenerated.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "digest.json")
E = json.load(open(P, encoding="utf-8"))

if any(e["id"] in (543, 544) for e in E):
    sys.exit("already applied: ids 543/544 present")
old = [e for e in E if e["id"] == 540]
assert len(old) == 1 and old[0]["title"].startswith("Guidelines 3/2025") and old[0]["status"] == "consultation", "id 540 is not the 3/2025 consultation entry"
assert len(E) == 543

DSA_GDPR = {
    "id": 543,
    "title": "Guidelines 3/2025 on the interplay between the Digital Services Act and the GDPR",
    "type": "Guideline",
    "date": "17 September 2026",
    "url": "https://www.edpb.europa.eu/documents/guideline/guidelines-32025-on-the-interplay-between-the-dsa-and-the-gdpr_en",
    "rating": "B",
    "where": "Topic 15 digital products: platforms and marketplaces",
    "takeaway": (
        "The DSA supplies no GDPR legal basis of its own: the Article 26 advertising transparency duty is not a basis "
        "for choosing which advert reaches whom. Adverts based on profiling with special category data, inferred data "
        "included, are banned even where an Article 9(2) exception would apply; recommender options must be presented "
        "equally, with no background profiling while the non-profiling option is on; and a systemic risk found under "
        "Articles 34 and 35 makes a DPIA likely to be mandatory. Applies to intermediary services, online platforms and "
        "very large platforms and search engines acting as controllers or processors. Final version of 17 September "
        "2026, replacing the 2025 consultation draft; check ad targeting, recommender systems and risk assessments "
        "against both laws."
    ),
    "status": "current",
    "topics": ["marketing", "lawful-basis", "dpia"],
    "tier": "written",
    "source": "edpb-pdf",
}

FINES = {
    "id": 544,
    "title": "Guidelines 04/2026 on the application of the power to impose administrative fines in relation to other corrective powers under the GDPR (version for public consultation)",
    "type": "Consultation version",
    "date": "17 September 2026",
    "url": "https://www.edpb.europa.eu/public-consultations/guidelines-042026-on-the-application-of-the-power-to-impose-administrative_en",
    "rating": "B",
    "where": "Topic 14 context",
    "takeaway": (
        "Authorities decide whether to fine in five steps: can the infringement be fined, can this party be fined, "
        "was it at least negligent, do the Article 83(2) factors make it minor, and would a fine be effective, "
        "proportionate and dissuasive. A minor infringement as a rule draws no fine; any other carries a strong "
        "presumption in favour of one, and legal advice rarely excuses negligence. Addressed to supervisory "
        "authorities; replaces the WP29 fines guidelines (WP253), complements Guidelines 04/2022 on calculating the "
        "amount, and sets which corrective measures a fine can be combined with. Adopted 17 September 2026, open for "
        "comment until 13 November 2026; keep evidence of remediation and cooperation, the factors that decide "
        "whether an infringement is minor."
    ),
    "status": "consultation",
    "topics": ["enforcement"],
    "tier": "written",
    "source": "edpb-pdf",
}

for e in (DSA_GDPR, FINES):
    assert chr(0x2014) not in e["takeaway"] and chr(0x2014) not in e["title"]
    n = len(e["takeaway"].split())
    assert 45 <= n <= 125, (e["id"], n)

# listing entries run newest first, consultation versions sit at the end
E = [DSA_GDPR] + [e for e in E if e["id"] != 540] + [FINES]
assert len(E) == 544
open(P, "w", encoding="utf-8").write(json.dumps(E, ensure_ascii=False, indent=1))

# builder wording: snapshot date and the listing / consultation split
REPL = {
    "build_digest_page.py": [
        ('DATE = "19 September 2026"', 'DATE = "28 September 2026"'),
        ("(532 on the documents listing and 11 that were still at consultation stage)",
         "(533 final documents from the documents listing and 11 that were still at consultation stage)"),
    ],
    "build_digest_pdf.py": [
        ("(532 on the documents listing, 11 at consultation stage)",
         "(533 final documents from the documents listing, 11 at consultation stage)"),
    ],
}
for f, pairs in REPL.items():
    fp = os.path.join(HERE, f)
    s = open(fp, encoding="utf-8").read()
    for a, b in pairs:
        assert s.count(a) == 1, (f, a)
        s = s.replace(a, b)
    open(fp, "w", encoding="utf-8", newline="\n").write(s)

print("digest.json: %d entries, %d written" % (len(E), sum(1 for e in E if e["tier"] == "written")))
