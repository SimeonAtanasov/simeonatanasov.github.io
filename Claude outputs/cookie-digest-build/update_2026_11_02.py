# -*- coding: utf-8 -*-
"""Cookie digest update of 2 November 2026 (DIG-03). Edits all_merged.json in place (run after
update_2026_10_27.py; the chain is apply_source_review.py, apply_recheck.py, apply_close16.py,
update_2026_10_23.py, update_2026_10_27.py, then this) plus the DATE wording in
build_cookie_page.py and the PDF path in build_cookie_pdf.py. Refuses to run twice.

- New entry: CNIL consolidated recommendation on cookies and other trackers, "version
  consolidee publiee le 16 janvier 2026" from Deliberation 2020-092 of 17 September 2020 and
  Deliberation 2025-131 of 18 December 2025. Read from the PDF on cnil.fr through the fetch
  tool: preamble, sections 1.2, 2.3, 3, 4, 5 and 7.1 to 7.7.
- New entry: CNIL Deliberation 2025-131 of 18 December 2025 on multi-device consent, which adds
  section 7 to the recommendation. Read from the CNIL announcement of 16 January 2026 and
  section 7 of the consolidated PDF.
- CNIL Deliberation 2020-092: status superseded, closing sentence pointing at the consolidated
  text. The 2020 deliberation was amended, not repealed; the entry says so.

Net: 261 entries become 263.
"""
import json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "all_merged.json")
C = json.load(open(P, encoding="utf-8"))
if any("2025-131" in c["title"] for c in C):
    sys.exit("already applied: Deliberation 2025-131 entry present")
assert len(C) == 261

def one(pred):
    hit = [c for c in C if pred(c)]
    assert len(hit) == 1, len(hit)
    return hit[0]

old = one(lambda c: c["title"].startswith("CNIL, Deliberation 2020-092:"))
assert old["status"] == "in force"
old["status"] = "superseded"
old["takeaway"] += (
    " Superseded as a document by the consolidated version published on 16 January 2026, which carries this text"
    " together with the multi-device consent section added by Deliberation 2025-131 of 18 December 2025; the 2020"
    " deliberation was amended rather than repealed, so cite the consolidated text."
)

CONSOLIDATED = {
    "title": "CNIL, consolidated recommendation on practical arrangements for cookies and other trackers (Deliberation 2020-092 as amended by Deliberation 2025-131)",
    "jurisdiction": "France",
    "type": "regulator guidance",
    "date": "16 January 2026",
    "url": "https://www.cnil.fr/sites/default/files/2026-01/recommandation_cookies_consolidee.pdf",
    "status": "in force",
    "takeaway": (
        "The consolidated version, published by the CNIL on 16 January 2026, combines the 2020 recommendation "
        "(Deliberation 2020-092 of 17 September 2020) with the amendments of Deliberation 2025-131 of 18 December "
        "2025, and is now the text to cite for the CNIL's practical expectations under article 82 of the French Data "
        "Protection Act. Sections 1 to 6 carry the 2020 content: a first layer that names each purpose and gives "
        "access to the list of controllers; refusal as easy as acceptance, strongly recommended on the same screen "
        "and in the same format; choices kept so that the user is not asked again on every page, with keeping both "
        "consent and refusal for six months described as good practice; withdrawal as easy as consent, for example "
        "through a persistent link or icon; proof of consent through versioned code, timestamped screenshots, "
        "audits or records of the consent platform's configuration, with a contract clause alone not enough for "
        "third-party trackers; and, for audience measurement exempt from consent, a tracker lifetime of thirteen "
        "months that is not extended on later visits and data kept for at most twenty-five months. Section 7 is new "
        "and covers optional multi-device consent for logged-in users (see the Deliberation 2025-131 entry). It "
        "applies to every organisation using trackers subject to article 82 and sets no compliance deadline; it is "
        "a recommendation, not binding, but it is the reference the CNIL applies in its cookie enforcement. Cite "
        "the consolidated text rather than the 2020 version, and check banners, consent logs and analytics "
        "lifetimes against sections 2 to 5."
    ),
    "topics": ["consent", "reject-button", "analytics-exemption"],
    "source": "primary",
    "cluster": "eu-national",
}

MULTI = {
    "title": "CNIL, Deliberation 2025-131: recommendation on multi-device consent (amending recommendation 2020-092)",
    "jurisdiction": "France",
    "type": "regulator guidance",
    "date": "18 December 2025",
    "url": "https://www.cnil.fr/fr/cookies-et-autres-traceurs-recommandations-finales-sur-le-consentement-multi-terminaux",
    "status": "in force",
    "takeaway": (
        "Adopted on 18 December 2025 after a public consultation and published with the CNIL's final "
        "recommendations on 16 January 2026, the deliberation adds a section 7 to the 2020 recommendation on cookies "
        "and other trackers for multi-device consent in logged-in environments: choices made once are attached to "
        "the user's account and applied on every device, browser and app from which the user logs in. Offering it "
        "is optional. Where it is offered, consent, refusal and withdrawal must have the same scope across devices, "
        "and the user must be told before choosing, preferably at the first level of the consent interface, that "
        "the choice applies to all logged-in devices; after login on a device not yet linked to the account, a "
        "short-lived banner should say whether the account choices were recorded or changed and how to change them. "
        "When a choice made before login conflicts with the one on the account, the controller either lets the "
        "latest choice overwrite the account (modality 1) or keeps the account choice, which requires tracking "
        "logged-in and logged-out use separately (modality 2), and the CNIL encourages using one modality "
        "throughout. Account choices must not alter choices already stored in logged-out mode, including those of "
        "other people on a shared device such as a family computer or a smart TV; the consent platform should "
        "receive a technical identifier, never an email address or a name; and switching to multi-device consent "
        "needs fresh consent, since consent given on one device was not informed of the wider scope. Letting users "
        "set different choices per device is encouraged as good practice. Before syncing consent across devices, "
        "decide the conflict modality, build the post-login banner and plan a re-consent campaign."
    ),
    "topics": ["consent", "other"],
    "source": "primary",
    "cluster": "eu-national",
}

for e in (CONSOLIDATED, MULTI, old):
    s = e["takeaway"] + e["title"]
    assert chr(0x2014) not in s and chr(0x2013) not in s
    assert all(ord(ch) < 128 for ch in s)
i = C.index(old)
C[i + 1:i + 1] = [CONSOLIDATED, MULTI]
assert len(C) == 263
open(P, "w", encoding="utf-8").write(json.dumps(C, ensure_ascii=False, indent=1))

REPL = {
    "build_cookie_page.py": [('DATE = "19 September 2026, updated 27 October 2026"', 'DATE = "19 September 2026, updated 2 November 2026"')],
    "build_cookie_pdf.py": [('"/mnt/user-data/outputs/cookie-compliance-digest-2026-10-27.pdf"',
                             '"/mnt/user-data/outputs/cookie-compliance-digest-2026-11-02.pdf"')],
}
for f, pairs in REPL.items():
    fp = os.path.join(HERE, f)
    s = open(fp, encoding="utf-8").read()
    for x, y in pairs:
        assert s.count(x) == 1, (f, x)
        s = s.replace(x, y)
    open(fp, "w", encoding="utf-8", newline="\n").write(s)
print("all_merged.json: %d entries" % len(C))
