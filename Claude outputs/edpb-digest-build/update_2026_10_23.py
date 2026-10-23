# -*- coding: utf-8 -*-
"""EDPB digest update of 23 October 2026: nine documents on the EDPB listing that the
digest did not yet carry (found by scraping all 56 listing pages in the browser on
23 October 2026 and matching every link against digest.json and edpb_documents.json).

- Statement 1/2026 on smart glasses (13 October 2026): written entry, read from the PDF
  20261310_edpb_statement_smart-glasses_en.pdf.
- Support Pool of Experts report "The connected gaze" (1 October 2026): hand-written
  one-liner from the EDPB page.
- Opinions 22/2026 to 28/2026 (17 September and 13 October 2026), seven BCR approvals:
  templated one-liners, same wording as oneliners_build.py.

Also: the listing now carries pages for documents that are still at consultation stage
(Guidelines 1/2024, 01/2025, 1/2026, 02/2026, 03/2026, 04/2026 twice, the DMA joint
guidelines, Recommendations 1/2026 and 2/2025, older Guidelines 01/2021 and 1/2020
versions), which explains why it shows 553 items. The digest keeps those in its own
Consultation versions group, so the intro wording changes to say so.

Net: 544 entries become 553, written takeaways 118 become 119.
Edits digest.json in place and the DATE and count wording in build_digest_page.py and
build_digest_pdf.py. Refuses to run twice. Run last in the rebuild chain, after
update_2026_09_28.py.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "digest.json")
E = json.load(open(P, encoding="utf-8"))
if any(e["id"] >= 545 for e in E):
    sys.exit("already applied: ids 545+ present")
assert len(E) == 544 and max(e["id"] for e in E) == 544

ROUTINE = "Routine Art 64 opinion (BCRs, accreditation, certification, national DPIA lists, codes, SCCs)"
BASE = "https://www.edpb.europa.eu/documents/"

def bcr(i, num, auth, role, group, date, slug):
    title = "Opinion %s on the draft decision of the %s Supervisory Authority regarding the %s Binding Corporate Rules of the %s" % (num, auth, role.capitalize(), group)
    take = ("Favourable opinion on the draft decision of the %s authority approving the %s binding corporate rules of %s "
            "under Article 64(1)(f); the authority gives the final approval. Matters only to organisations transferring "
            "personal data to or within that group." % (auth, role, group))
    return {"id": i, "title": title, "type": "Opinion of the Board (Art. 64)", "date": date,
            "url": BASE + "opinion-of-the-board-art-64/" + slug, "rating": "N", "where": ROUTINE,
            "takeaway": take, "status": "", "topics": [], "tier": "oneliner", "source": "title"}

SMART = {
    "id": 545,
    "title": "Statement 1/2026 of the EDPB on smart glasses",
    "type": "Statement",
    "date": "13 October 2026",
    "url": BASE + "statement/statement-of-the-edpb-on-smart-glasses_en",
    "rating": "R",
    "where": "Topic 1 video devices; transparency to bystanders",
    "takeaway": (
        "Smart glasses that record, store or analyse images or sound of identifiable people are subject to the GDPR, "
        "and the household exemption in Article 2(2)(c) is read narrowly: it does not cover posting recordings publicly "
        "on social media or professional, official or political use. Producers and providers of linked apps or AI "
        "services may be controllers or joint controllers and cannot leave transparency to the wearer; consent obtained "
        "after a recording is not valid, and legitimate interest needs a case-by-case balance that commercial reuse or "
        "AI training will rarely pass. Combine hard-to-disable recording indicators with other in-the-moment signals, "
        "process on the device with no persistent storage by default, and blur or pseudonymise bystanders."
    ),
    "status": "current",
    "topics": ["transparency", "lawful-basis", "biometrics"],
    "tier": "written",
    "source": "edpb-pdf",
}

GAZE = {
    "id": 546,
    "title": "The connected gaze. Video recording, surveillance and administering evidence in the age of smart glasses",
    "type": "Support Pool of Experts",
    "date": "01 October 2026",
    "url": BASE + "support-pool-of-experts/the-connected-gaze-video-recording-surveillance-and-administering_en",
    "rating": "N",
    "where": "",
    "takeaway": ("Qualitative study by an external expert under the Support Pool of Experts on how people expect to use "
                 "smart glasses and how far bystanders accept them, complementing a quantitative CNIL study; not an EDPB "
                 "position. Background to Statement 1/2026 on smart glasses."),
    "status": "",
    "topics": [],
    "tier": "oneliner",
    "source": "page",
}

NEW = [
    bcr(547, "24/2026", "French", "controller", "Michelin Group", "13 October 2026", "opinion-242026-on-the-draft-decision-of-the-french_en"),
    bcr(548, "25/2026", "Dutch", "controller", "Snowflake Group", "13 October 2026", "opinion-252026-on-the-draft-decision-of-the-dutch-supervisory_en"),
    bcr(549, "26/2026", "Dutch", "processor", "Snowflake Group", "13 October 2026", "opinion-262026-on-the-draft-decision-of-the-dutch-supervisory_en"),
    SMART,
    bcr(550, "27/2026", "Irish", "controller", "HCL Tech Group", "13 October 2026", "opinion-272026-on-the-draft-decision-of-the-irish-supervisory_en"),
    bcr(551, "28/2026", "Irish", "processor", "HCL Tech Group", "13 October 2026", "opinion-282026-on-the-draft-decision-of-the-irish-supervisory_en"),
    GAZE,
    bcr(552, "22/2026", "Dutch", "controller", "DSM Firmenich Group", "17 September 2026", "opinion-222026-on-the-draft-decision-of-the-dutch-supervisory_en"),
    bcr(553, "23/2026", "Norwegian", "controller", "TGS Group", "17 September 2026", "opinion-232026-on-the-draft-decision-of-the-norwegian_en"),
]
for e in NEW:
    assert chr(0x2014) not in e["takeaway"] + e["title"]
n = len(SMART["takeaway"].split()); assert 45 <= n <= 125, n
assert len({e["id"] for e in NEW}) == 9 and len({e["url"] for e in NEW}) == 9
have = {e["url"] for e in E}
assert not (have & {e["url"] for e in NEW})

E = NEW + E
assert len(E) == 553
open(P, "w", encoding="utf-8").write(json.dumps(E, ensure_ascii=False, indent=1))

REPL = {
    "build_digest_page.py": [
        ('DATE = "28 September 2026"', 'DATE = "23 October 2026"'),
        ("(533 final documents from the documents listing and 11 that were still at consultation stage)",
         "(542 final documents and 11 still at consultation stage; the EDPB documents listing now shows the consultation stage ones too, which the digest keeps in a group of their own)"),
    ],
    "build_digest_pdf.py": [
        ("(533 final documents from the documents listing, 11 at consultation stage)",
         "(542 final documents, 11 at consultation stage)"),
        ('"/mnt/user-data/outputs/edpb-digest-2026-09-28.pdf"', '"/mnt/user-data/outputs/edpb-digest-2026-10-23.pdf"'),
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
