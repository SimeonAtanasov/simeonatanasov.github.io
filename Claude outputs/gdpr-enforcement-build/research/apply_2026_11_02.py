# -*- coding: utf-8 -*-
"""Israel entry update of 2 November 2026 (ENF-02). Run after gapply_verify.py and
apply_2026_10_23.py (it edits gdata/il.json in place) and before build_world_page.py.
Refuses to run twice.

Prompted by an email from DPOas (2 November 2026) pointing at its enforcement tracker. Every
fact below was read in the Privacy Protection Authority's own notices on gov.il on 2 November
2026, in the browser pane (gov.il refuses scripted fetches; a person has to pass its Cloudflare
check first). Record: claude/israel-ppa-check-2026-11-02.md in the project.
"""
import json, os, sys, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE) if os.path.basename(HERE) == "research" else HERE
F = "gdata/il.json"
PPA = "https://www.gov.il/he/pages/"


def load(rel):
    return json.load(open(os.path.join(ROOT, rel), encoding="utf-8"))


def save(rel, d):
    open(os.path.join(ROOT, rel), "w", encoding="utf-8").write(json.dumps(d, ensure_ascii=False, indent=1))


def get(d, path):
    for part in re.findall(r"[^.\[\]]+|\[\d+\]", path):
        d = d[int(part[1:-1])] if part.startswith("[") else d[part]
    return d


def setp(d, path, value):
    parts = re.findall(r"[^.\[\]]+|\[\d+\]", path)
    for part in parts[:-1]:
        d = d[int(part[1:-1])] if part.startswith("[") else d[part]
    last = parts[-1]
    if last.startswith("["):
        d[int(last[1:-1])] = value
    else:
        d[last] = value


d = load(F)
if any((PPA + "ticket_btl") == c.get("url") for c in d["cases"]):
    sys.exit("already applied: " + F)
assert [c["title"] for c in d["cases"]] == [
    "Sanction on a National Insurance Institute employee",
    "Meuhedet Health Fund: first reported Amendment 13 sanction"], d["cases"]

CASES = [
    # ticket_btl, published 16.09.2025: "קנס מינהלי", decided August 2025, conduct 2020-2021
    {"title": "Administrative fine on a former National Insurance employee",
     "year": "2025",
     "summary": "On 16 September 2025 the PPA published an administrative fine of ILS 75,000, set in August 2025, "
                "on a former National Insurance Institute employee who had run 20 queries in the Institute's databases "
                "in 2020 and 2021, 15 of them on the sensitive data of a complainant and her family, for personal reasons, "
                "in breach of s 8(b). This is the older administrative fine, not an Amendment 13 monetary sanction: the "
                "conduct predates the amendment.",
     "url": PPA + "ticket_btl"},
    # 21072026-1, published 21.07.2026: "לראשונה מאז כניסתו לתוקף של תיקון 13"
    {"title": "Meuhedet Health Fund: first Amendment 13 sanction",
     "year": "2026",
     "summary": "On 21 July 2026 the PPA imposed ILS 256,000 on the Meuhedet Health Fund, its first monetary sanction "
                "since Amendment 13 came into force, for not reporting a serious security event immediately (reg. 11(d) "
                "of the Data Security Regulations). A member told the fund in November 2025 that he could see a relative's "
                "medical file; the fault proved systemic and was reported only on 27 January 2026, about two months after "
                "the complaint. The PPA held that a preliminary report is due as soon as the event is known. The "
                "amount is after statutory reductions, which the notice does not itemise.",
     "url": PPA + "21072026-1"},
    # fine-160926, published 16.09.2026
    {"title": "Beit Shemesh Municipality: a local authority sanctioned",
     "year": "2026",
     "summary": "On 16 September 2026 the PPA imposed ILS 64,000 on the Beit Shemesh Municipality after a fault in its "
                "GIS system exposed welfare and medical data on about 4,600 residents. Neither breach was the fault itself: "
                "a vendor with access to the database for almost two years was not listed as a holder (reg. 2(a)(7)), and "
                "the security procedure did not govern vendors' access (reg. 15(a)(3)). The PPA rejected the argument that "
                "Amendment 13 had come into force only a week before the event, since there had been a year to prepare. The "
                "base of ILS 80,000 (40,000 per breach) was reduced by 20% for no sanctions in the previous five years.",
     "url": PPA + "fine-160926"},
    # menora-221026, published 22.10.2026, updated 25.10.2026
    {"title": "Menora Mivtachim Insurance: the reduction calculation in full",
     "year": "2026",
     "summary": "On 22 October 2026 the PPA imposed ILS 256,000 on Menora Mivtachim Insurance for reporting more than "
                "two weeks late that an insurance agent had been able to see a report on 138 policyholders of another agent "
                "(reg. 11(d)(1)). The notice publishes the calculation: a base of ILS 640,000, because the database is at high "
                "security level and holds data on more than a million people, reduced by a cumulative 60% under the Fifth "
                "Schedule to the Law (20% for no violations in five years, 30% for ending the breach on its own initiative "
                "and reporting it, 10% for having appointed a DPO). The duty to report does not wait for an internal "
                "investigation to finish.",
     "url": PPA + "menora-221026"},
]

# (path, old substring, new text); old None replaces the whole value after a prefix check
EDITS = [
    ("fines.imposed_by",
     "Secondary sources differ on the figures and the statute was not checked.",
     "Secondary sources differ on the figures and the statute was not checked, but the PPA's published decisions show "
     "the method at work: a base of ILS 640,000 for late breach reporting on a high-security database of more than a "
     "million people (Menora, October 2026), ILS 40,000 for each of two documentation breaches at a municipality (Beit "
     "Shemesh) and ILS 20,000 for an incomplete collection notice (Karting), each then reduced for mitigating factors "
     "such as a clean record."),
    ("fines.public_bodies", None,
     "Public bodies are within the regime and must appoint data protection officers. Local authorities can be "
     "sanctioned: the PPA imposed ILS 64,000 on the Beit Shemesh Municipality in September 2026. No sanction on a "
     "government ministry has been published; the Ministry of Education finding of October 2026 carried none, but its "
     "supervision ran under the powers in force before Amendment 13."),
    ("fines.quirks",
     "Reductions are available for having a DPO and self-reporting (secondary).",
     "The PPA reduces sanctions for the circumstances set out in the Fifth Schedule to the Law; the Menora decision "
     "itemises them in full: 20% for no violations in five years, 30% for ending the breach on its own initiative and "
     "reporting it, and 10% for having appointed a DPO."),
    ("quirks[1]", None,
     "Until August 2025 the regulator had almost no fining power. Amendment 13 gave it GDPR-style administrative "
     "sanctions, but the first came almost a year later: by the end of October 2026 the PPA had published four, "
     "Meuhedet (ILS 256,000, 21 July 2026), A.D. Karting Hutzot (ILS 12,000, 5 August 2026, for a registration form "
     "that took ID numbers and a child's details without the notice s 11 requires), the Beit Shemesh Municipality "
     "(ILS 64,000, 16 September 2026) and Menora Mivtachim Insurance (ILS 256,000, 22 October 2026). Two of the four "
     "are for late breach reporting."),
    ("confidence", None,
     "medium: the in-force date, fining power and private action are well supported, and the cases, base amounts and "
     "reductions are taken from the PPA's own notices (read 2 November 2026); the statutory fine formula, the turnover "
     "ceiling, statutory damages amounts and the appeal court and deadline could not be confirmed from the statute, and "
     "secondary sources disagree on damages figures."),
]
PREFIX = {
    "fines.public_bodies": "Public bodies are within the regime and must appoint data protection officers; secondary sources",
    "quirks[1]": "Until August 2025 the regulator had almost no fining power; Amendment 13 gave it GDPR-style",
    "confidence": "low-medium: the in-force date, fining power and private action are well supported",
}

# inserted after quirks[1]
NEW_QUIRK = ("The PPA also publishes findings of violation that carry no sanction, usually because the events predate "
             "Amendment 13: the Ministry of Education (8 October 2026, an open link that exposed data on about 21,000 "
             "special-education pupils), the Technion (26 October 2026, an intrusion not reported immediately) and four "
             "earlier findings in its 2026 administrative enforcement register.")

# Plain titles on purpose: with "PPA" and "sanction" in every title the sources list outranked the
# answers in the Ask index for queries such as "israel fine" (checked 2 November 2026).
NOTICES = [
    ("gov.il notice, 16 September 2025: former National Insurance employee", "ticket_btl"),
    ("gov.il notice, 21 July 2026: Meuhedet Health Fund", "21072026-1"),
    ("gov.il notice, 5 August 2026: A.D. Karting Hutzot", "carting"),
    ("gov.il notice, 16 September 2026: Beit Shemesh Municipality", "fine-160926"),
    ("gov.il notice, 8 October 2026: Ministry of Education", "news-8-10-26"),
    ("gov.il notice, 22 October 2026: Menora Mivtachim Insurance", "menora-221026"),
    ("gov.il notice, 26 October 2026: Technion", "technion-261026"),
    ("gov.il: PPA administrative enforcement register", "enforcementact"),
]
TRACKER = {"title": "DPOas: enforcement tracker",
           "url": "https://dpoas.co.il/blog/privacy-authority-enforcement-tracker/", "source_type": "secondary"}
AILAW = "https://www.ai-law.co.il/en/post/israel-s-privacy-protection-authority-steps-up-enforcement-first-fines-under-amendment-13"

# --- apply ---
d["cases"] = CASES
for path, old, new in EDITS:
    cur = get(d, path)
    assert isinstance(cur, str), path
    if old is None:
        assert cur.startswith(PREFIX[path]), (path, cur[:80])
        setp(d, path, new)
    else:
        assert cur.count(old) == 1, (path, old[:60])
        setp(d, path, cur.replace(old, new))
d["quirks"].insert(2, NEW_QUIRK)

# sources: the notices after the PPA site; the tracker after the DPOas guides; the AI-Law article
# goes, since it presented the National Insurance fine as an Amendment 13 sanction
src = [s for s in d["sources"] if s["url"] != AILAW]
assert len(src) == len(d["sources"]) - 1
i = next(k for k, s in enumerate(src) if s["url"] == "https://www.gov.il/en/departments/the_privacy_protection_authority")
src[i + 1:i + 1] = [{"title": t, "url": PPA + slug, "source_type": "primary"} for t, slug in NOTICES]
j = max(k for k, s in enumerate(src) if "dpoas.co.il" in s["url"])
src.insert(j + 1, TRACKER)
# the firm writes its name DPOas; the 2 October research had DPOAS
for s_ in src:
    if s_["title"].startswith("DPOAS:"):
        s_["title"] = "DPOas:" + s_["title"][len("DPOAS:"):]
d["sources"] = src

s = json.dumps(d, ensure_ascii=False)
assert chr(0x2014) not in s, "em dash"
save(F, d)
print("edited:", F, "| cases", len(d["cases"]), "| quirks", len(d["quirks"]), "| sources", len(d["sources"]))
