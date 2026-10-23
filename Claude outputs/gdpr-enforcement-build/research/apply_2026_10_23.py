# -*- coding: utf-8 -*-
"""Enforcement pages update of 23 October 2026. Run after apply_verify.py and
gapply_verify.py (it edits data/ and gdata/ in place) and before the two page builders.
Refuses to run twice. Also adds one sentence on the EDPB fining guidelines to the
"Decision" step in build_enforcement_page.py.

Findings came from three verification agents re-reading the 2 October data against current
sources on 23 October 2026; every change below was checked against the source named in its
comment (primary unless marked secondary).
"""
import json, os, sys, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE) if os.path.basename(HERE) == "research" else HERE

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
    if last.startswith("["): d[int(last[1:-1])] = value
    else: d[last] = value

# (file, path, old substring or None for whole value, new text)
EDITS = [
 # --- Europe ---
 # Bundestag hib 797/2026, 8 October 2026
 ("data/de.json", "dpa.structure",
  "Moritz Hennemann was elected BfDI by the Bundestag on 25 June 2026 and succeeds Louisa Specht-Riemenschneider, who stayed in office until 30 September 2026.",
  "Moritz Hennemann, elected by the Bundestag on 25 June 2026, has been BfDI since 1 October 2026, succeeding Louisa Specht-Riemenschneider."),
 # LG Berlin I press release (526 OWi LG 1/20)
 ("data/de.json", "cases[1].summary",
  "On remand, LG Berlin I reduced the fine to EUR 900,000 on 9 June 2026; reported as not yet final.",
  "On remand, LG Berlin I reduced the fine to EUR 900,000 on 9 June 2026 (526 OWi LG 1/20); the court stated the judgment was not yet final and open to Rechtsbeschwerde, and no later outcome was found as of October 2026."),
 # NAIH document of 16 June 2026 signed by the President
 ("data/hu.json", "dpa.structure",
  "Dr Attila Péterfalvi was its first President (nominated 2011); the current holder was not confirmed.",
  "Dr Attila Péterfalvi, its first President (nominated 2011), still held the post in 2026: NAIH documents dated June 2026 are signed by him as President."),
 # Eduskunta: HE 46/2026 vp, plenary minutes PTK 37/2026
 ("data/fi.json", "fines.public_bodies",
  "the Government submitted a bill in April 2026 to extend fines",
  "the Government submitted a bill in April 2026 (HE 46/2026 vp, referred to the Administration Committee on 16 April 2026) to extend fines"),
 ("data/fi.json", "fines.public_bodies",
  "with proposed entry into force in early 2027.",
  "with proposed entry into force on 1 January 2027."),
 # secondary: July 2026 report, no BOE publication found
 ("data/es.json", "private.collective",
  "the bill on collective actions was still pending in Parliament in May 2026",
  "the bill on collective actions was still going through Parliament in July 2026"),
 # Dillon v Irish Life [2025] IESC 37 (secondary: Matheson, McCann FitzGerald; courts.ie offline 23 Oct 2026)
 ("data/ie.json", "private.damages",
  "Whether PIAB authorisation is needed first (Dillon v Irish Life) was pending before the Supreme Court at last report.",
  "In Dillon v Irish Life [2025] IESC 37 (July 2025) the Supreme Court held that claims for distress, upset or anxiety short of a recognised psychiatric injury are not personal injuries claims, so they need no Injuries Resolution Board (formerly PIAB) authorisation, though only modest awards should be expected."),
 # [2026] IEHC 347 (3 June 2026); fines judgment [2026] IEHC 419 (30 June 2026); CJEU reference reported by MLex 15 Sept 2026
 ("data/ie.json", "cases[0].summary",
  "In June 2026 the High Court upheld the infringement findings but sent the suspension order back to the DPC. A separate judgment on the size of the fine was circulated to the parties at the end of June 2026; its outcome had not been published at last report.",
  "On 3 June 2026 the High Court ([2026] IEHC 347) upheld the infringement findings but sent the suspension order back to the DPC. In a separate judgment of 30 June 2026 ([2026] IEHC 419) it referred four questions on how the fine should be calculated under Art. 83 to the CJEU, which opened the case in September 2026, so the amount of the fine is not yet settled."),
 ("data/ie.json", "confidence",
  "or the exact date of the 2026 High Court TikTok judgment.",
  "and the CJEU case number for the 2026 TikTok fine-calculation reference was not found."),
 # judiciary.uk: Respondent's response, CA-2026-000226, hearing 19 to 21 October 2026
 ("data/uk.json", "cases[0].summary",
  "A further appeal to the Court of Appeal was reported as likely; outcome not confirmed.",
  "Clearview appealed to the Court of Appeal (CA-2026-000226), with Privacy International intervening; the appeal, still on the preliminary question of jurisdiction, was heard on 19 to 21 October 2026 and judgment is awaited."),
 ("data/uk.json", "cases[0].year", "2022-2025", "2022-2026"),
 ("data/uk.json", "confidence",
  "but the Tribunal's 28-day deadline, internal decision-making under the new board and the Clearview onward appeal were not verified.",
  "but the Tribunal's 28-day deadline and internal decision-making under the new board were not verified; the Clearview Court of Appeal judgment was pending as of 23 October 2026."),
 # Stb. 2026, 154 (Art. 21b UAVG); Stcrt. 2026, 30656 (applies from 1 September 2026)
 ("data/nl.json", "fines.quirks",
  "Fines are often combined with orders subject to penalty payments (last onder dwangsom). ",
  "Fines are often combined with orders subject to penalty payments (last onder dwangsom). Since 1 September 2026 the AP must publish its sanction decisions, not earlier than ten working days after notifying the offender and not while an interim relief request is pending (Art. 21b UAVG, inserted by the Verzamelwet gegevensbescherming, Stb. 2026, 154). "),
 # --- Worldwide ---
 # secondary: Korea Times and Asia Economy, 8 October 2026
 ("gdata/kr.json", "cases[2].summary",
  "Coupang said it would contest the decision through legal procedures.",
  "On 7 October 2026 Coupang filed two suits in the Seoul Administrative Court to annul the surcharges and applied for a stay of execution (press reports)."),
 ("gdata/kr.json", "confidence",
  "the Coupang amount is from press reports",
  "the Coupang amount and its October 2026 court challenge are from press reports"),
 # Constitutional Court (mkri.id), hearing of 27 July 2026
 ("gdata/id.json", "appeal.inaction",
  "A Constitutional Court petition (case 236/PUU-XXII/2024) seeking to compel the government to set up the agency was pending as of September 2026.",
  "A Constitutional Court petition (case 236/PUU-XXIV/2026, registered June 2026) asks the Court to require the agency to be set up within two years; it was heard on 27 July 2026 and no decision was found as of October 2026. An earlier petition (153/PUU-XXIV/2026) was declared inadmissible on 17 June 2026."),
 ("gdata/id.json", "cases[2].title",
  "236/PUU-XXII/2024", "236/PUU-XXIV/2026"),
 ("gdata/id.json", "cases[2].summary",
  "A petition that could push the executive to establish the supervisory agency remained pending as of September 2026;",
  "A petition registered in June 2026 asks the Court to require the supervisory agency to be set up within two years; at the 27 July 2026 hearing the government said the draft Presidential Regulation had gone to the President on 20 May 2026, and no decision was found as of October 2026;"),
 ("gdata/id.json", "cases[2].url", None,
  "https://en.mkri.id/news/details/2026-07-27/Personal_Data_Protection_Agency_Under_Discussion"),
 # secondary: LiveLaw, 1 August and 10 September 2026
 ("gdata/in.json", "dpa.structure",
  "but members are appointed by the central government.",
  "but members are appointed by the central government. As reported in August and September 2026, no chairperson or members had yet been appointed; selection committees sought nominations in May and June 2026."),
 # planalto.gov.br: Lei 15.352, de 25 de fevereiro de 2026
 ("gdata/br.json", "dpa.structure",
  "Congress approved the conversion on 24 February 2026, and the number of the resulting law was not confirmed.",
  "Congress approved the conversion on 24 February 2026 and it became Law 15.352 of 25 February 2026."),
 ("gdata/br.json", "confidence",
  "and the number of the law converting MP 1.317/2025 are not confirmed against primary text.",
  "are not confirmed against primary text; the conversion law (Law 15.352/2026) is confirmed on planalto.gov.br."),
 # govinfo BILLS-119hr8413ih; hearing reported by IAPP and StateScoop (secondary)
 ("gdata/us.json", "law.name",
  "A federal comprehensive bill (the American Privacy Rights Act draft, 2024) stalled.",
  "A federal comprehensive bill (the American Privacy Rights Act draft, 2024) stalled; a successor, the SECURE Data Act (H.R. 8413), introduced in April 2026 with FTC and state attorney general enforcement, no private right of action and broad pre-emption of state laws, had a subcommittee hearing in June 2026 but no markup was found."),
 # secondary: MinterEllison, HSF Kramer (exposure draft of 31 August 2026)
 ("gdata/au.json", "law.name",
  "automated decision transparency duties from 10 December 2026)",
  "automated decision transparency duties from 10 December 2026). A tranche 2 exposure draft, the Privacy Amendment (Personal Data Protection) Bill 2026, was released for consultation on 31 August 2026 (closing 18 September 2026); it leaves out a direct right of action and changes to the small business exemption, and had not been introduced to Parliament by October 2026"),
 # OAIC media centre, checked 23 October 2026
 ("gdata/au.json", "cases[2].summary",
  "Both were pending as at the latest sources found; outcomes not confirmed.",
  "Both were still pending in October 2026; outcomes not confirmed."),
 ("gdata/sg.json", "cases[0].url", None,
  "https://www.pdpc.gov.sg/all-commissions-decisions/2019/01/breach-of-the-protection-obligation-by-singhealth-and-ihis"),
]

# FDPIC, 1 October 2026
CH_CASE = {
  "title": "Baselland Transport AG (BLT): bodycams prohibited",
  "year": "2026",
  "summary": "After an investigation opened on 26 February 2026 under Art. 49 FADP, the FDPIC ruled on 29 September 2026 that BLT must stop processing personal data from staff bodycams and delete the recordings, because no federal law gives a sufficient legal basis, breaching the principle of lawfulness. Whether BLT has appealed to the Federal Administrative Court was not confirmed.",
  "url": "https://www.edoeb.admin.ch/en/bodycams-blt-en",
}

files = {}
for f, path, old, new in EDITS:
    d = files.setdefault(f, load(f))
    cur = get(d, path)
    if old is None:
        setp(d, path, new); continue
    assert isinstance(cur, str), (f, path)
    if new in cur and old not in cur:
        sys.exit("already applied: %s %s" % (f, path))
    assert cur.count(old) == 1, (f, path, old[:60])
    setp(d, path, cur.replace(old, new))

ch = files.setdefault("data/ch.json", load("data/ch.json"))
assert all(c.get("url") != CH_CASE["url"] for c in ch["cases"])
assert set(CH_CASE) <= set(ch["cases"][0]) | {"url"}, ch["cases"][0].keys()
ch["cases"].append(CH_CASE)

for f, d in files.items():
    s = json.dumps(d, ensure_ascii=False)
    assert chr(0x2014) not in s, f
    save(f, d)

# builder: the EDPB fining guidelines in the Decision step
B = os.path.join(ROOT, "build_enforcement_page.py")
s = open(B, encoding="utf-8").read()
a = "The cap is 2% or EUR 10 million, or 4% or EUR 20 million, whichever is higher.\"),"
b = ("The cap is 2% or EUR 10 million, or 4% or EUR 20 million, whichever is higher. EDPB Guidelines 04/2022 set the "
     "method for the amount; Guidelines 04/2026, at consultation until 13 November 2026, add a five-step test for whether "
     "to fine at all, with a strong presumption of a fine for any infringement that is not minor.\"),")
assert s.count(a) == 1
open(B, "w", encoding="utf-8", newline="\n").write(s.replace(a, b))
print("edited:", sorted(files), "and build_enforcement_page.py")
