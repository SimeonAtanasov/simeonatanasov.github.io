# -*- coding: utf-8 -*-
"""Rate all 532 EDPB documents for relevance to the site. R = directly relevant,
B = background, N = not relevant. Explicit map first, then type-level defaults."""
import json, re, csv

d = json.load(open("/home/claude/pack/src/edpb_documents.json", encoding="utf-8"))
items = d["items"]

# substring of title (case-insensitive) -> (rating, where it lands)
MAP = [
 ("Data Protection Officer training", "B", "Readiness governance"),
 ("Data Protection Officer", "R", "Readiness governance activities (Arts 37 to 39); WP243"),
 # Guidelines
 ("Guidelines 02/2024 on Article 48", "R", "Topic 12: third-country authority orders are not a transfer basis on their own"),
 ("Guidelines 2/2023 on Technical Scope", "R", "Topic 15; Privacy Assessment tracking factor"),
 ("Guidelines 04/2022 on the calculation of administrative fines", "B", "Topic 14 context"),
 ("Guidelines 01/2022 on data subject rights - Right of access", "R", "Topic 8"),
 ("Guidelines 8/2022 on identifying", "B", "Topic 14, one-stop-shop"),
 ("Guidelines 9/2022 on personal data breach", "R", "Incident tool; topic 16"),
 ("Guidelines 03/2022 on deceptive design", "R", "Topics 10 and 15"),
 ("Guidelines 05/2021 on the Interplay between the application of Article 3", "R", "Privacy Assessment: remote access is a transfer"),
 ("Guidelines 01/2021 on Examples regarding Personal Data Breach", "R", "Incident tool cross-check"),
 ("Guidelines 02/2021 on virtual voice assistants", "B", "Topic 4 if voice notetakers are covered"),
 ("Guidelines 07/2020 on the concepts of controller and processor", "R", "Privacy Assessment third-party roles; TPSA intake"),
 ("Guidelines 8/2020 on the targeting of social media", "R", "Topic 18 profiling"),
 ("Guidelines 01/2020 on processing personal data in the context of connected vehicles", "B", "Topic 1 fleet GPS example"),
 ("Guidelines 4/2019 on Article 25", "R", "Readiness activities E1, E2"),
 ("Guidelines 5/2019 on the criteria of the Right to be Forgotten", "B", "Topic 8 erasure"),
 ("Guidelines 05/2020 on consent", "R", "Topic 10; Privacy Assessment lawful basis; readiness E3, E4"),
 ("Guidelines 3/2019 on processing of personal data through video devices", "R", "Topic 1"),
 ("Guidelines 3/2018 on the territorial scope", "R", "Privacy Assessment countries step; AI Act section 1 parallel"),
 ("Guidelines 2/2019 on the processing of personal data under Article 6(1)(b)", "R", "Topic 10 consent versus contract"),
 ("Guidelines on Personal data breach notification under Regulation 2016/679, WP250", "R", "Incident tool; topic 16"),
 ("Right to data portability", "B", "Topic 8"),
 ("Guidelines on the right to data portability", "B", "Topic 8"),
 ("Transparency", "R", "Topic 15 notices; readiness T activities; Privacy Assessment notice factor"),
 ("Article 29 Working Party - Guidelines on transparency", "R", "Topic 15 notices; readiness T activities"),

 ("Guidelines 2/2018 on derogations of Article 49", "R", "Privacy Assessment transfer safeguards list"),
 ("Data Protection impact assessments High risk processing", "R", "Privacy Assessment DPIA trigger logic (WP248)"),
 ("Automated decision-making and profiling", "R", "Topic 13; Privacy Assessment Art 22 factor (WP251)"),
 ("Guidelines for identifying a controller or processor's lead supervisory authority, WP244", "B", "Topic 14"),
 # Recommendations
 ("Recommendations 01/2020 on measures that supplement", "R", "Privacy Assessment TIA factor"),
 ("Recommendations 02/2021 on the legal basis for the storage of credit card", "R", "Topic 15 e-commerce forms"),
 ("Recommendations 02/2020 on the European Essential Guarantees", "B", "TIA reference"),
 ("Recommendations 1/2022 on the Application for Approval", "B", "Transfer safeguard option"),
 # Statements
 ("Statement 1/2025 on Age Assurance", "R", "Topic 18 marketing to children"),
 ("Statement 01/2022 on the announcement of an agreement in principle", "B", "DPF history"),
 ("Statement 04/2021 on international agreements", "B", "Topic 12"),
 ("Statement on the Court of Justice of the European Union Judgment in Case C-311/18", "B", "Transfers"),
 ("Statement 2/2019 on the use of personal data in the course of political campaigns", "B", "Topic 18"),
 # Other guidance
 ("EU-U.S. Data Privacy Framework F.A.Q. for European businesses - version 2.0", "R", "Privacy Assessment DPF factor"),
 ("EU-US Data Privacy Framework FAQ for European businesses", "B", "Superseded by version 2.0"),
 ("EU-US Data Privacy Framework FAQ for European individuals", "B", "Transfers"),
 ("Information Note on the Data Privacy Framework redress", "B", "Transfers"),
 ("Information note on data transfers under the GDPR to the United States", "B", "Transfers"),
 ("Position Paper on the derogations from the obligation to maintain records", "R", "Readiness Article 30 activity; GDPR Omnibus note"),
 ("Information note on data transfers under the GDPR to the United Kingdom", "B", "Transfers"),
 ("Frequently Asked Questions on the judgment of the Court of Justice", "B", "Transfers"),
 # Binding decisions
 ("Binding Decision 3/2022", "B", "Topics 10 and 18: contract is not a basis for behavioural advertising"),
 ("Binding Decision 4/2022", "B", "Topics 10 and 18: same, Instagram"),
 ("Urgent Binding Decision 01/2023", "B", "Topic 18: behavioural advertising ban"),
 ("Binding Decision 2/2023", "B", "Topic 18: children's data, TikTok"),
 ("Binding Decision 1/2023", "B", "Transfers: Meta EUR 1.2bn"),
 ("Binding Decision 5/2022", "B", "Topic 15: transparency, WhatsApp"),
 ("Binding decision 1/2021", "B", "Topic 15: transparency, WhatsApp"),
 # Legislative opinions
 ("Joint opinion 2/2026 on the Proposal for a Regulation as regards the simplification of the digital", "R", "GDPR Digital Omnibus: report add-later item"),
 ("Joint opinion 1/2026 on the Proposal for a Regulation as regards the simplification of the implementation of harmon", "R", "AI Omnibus: AI Act sections 7, 8"),
 ("Joint Opinion 5/2021 on the proposal for a Regulation of the European Parliament and of the Council laying down har", "B", "AI Act history"),
 ("Joint Opinion 1/2021 on standard contractual clauses between controllers and processors", "B", "Art 28 DPAs"),
 ("Joint Opinion 2/2021 on standard contractual clauses for the transfer", "B", "Transfers"),
 ("Joint Opinion 01/2025 on the Proposal for a Regulation on simplification measures for SMEs", "B", "Art 30 threshold history"),
 ("Joint Opinion 4/2026 on the Proposal for a Cybersecurity Act 2", "B", "Topic 16 NIS2 incident windows"),
 # Task force
 ("Cookie Banner Taskforce", "R", "Topic 15 cookie banners"),
 ("ChatGPT Taskforce", "R", "Topic 13; AI Act section 13; AI Risk tool"),
 ("101 Taskforce", "B", "Transfers, analytics tools"),
 # CEF
 ("implementation of the right of access by controllers", "R", "Topic 8"),
 ("implementation of the right to erasure by controllers", "R", "Topic 8"),
 ("Designation and Position of Data Protection Officers", "R", "Readiness governance activities"),
 # Reports, statements, letters
 ("EDPB Work Programme 2026-2027", "R", "Report: upcoming guidelines to watch"),
 ("Statement 3/2024 on data protection authorities' role in the Artificial Intelligence Act", "R", "AI Act section 8 governance"),
 ("Report on stakeholder event on anonymisation and pseudonymisation", "B", "Topic 17"),
 ("EDPB Report on the public consultation on helpful templates", "B", "Templates to come"),
 ("Report on stakeholder event on processing of personal data to target or deliver political advertisements", "B", "Topic 18"),
 ("Statement 03/2021 on the ePrivacy Regulation", "B", "Topic 15 history"),
 # SPE
 ("AI Privacy Risks & Mitigations Large Language Models", "R", "Topic 13; AI Risk tool; AI Act section 10"),
 ("Fundamentals of Secure AI Systems", "B", "TPSA AI/ML supplement"),
 ("Law & Compliance in AI Security", "B", "AI Risk tool"),
 ("AI Auditing", "B", "AI Act sections 9, 10"),
 ("AI: Complex Algorithms and effective Data Protection Supervision", "B", "Topic 13"),
 ("case digest on the legal basis of \"legitimate interest\"", "R", "LIA tool"),
 ("case digest on right of access", "R", "Topic 8"),
 ("case digest on right to object and right to erasure", "R", "Topic 8; LIA objection factor"),
 ("case digest on Security of Processing and Data Breach", "R", "Incident tool; topic 16"),
 ("Data brokers market study", "B", "Topic 18 broker data"),
 ("EDPB website auditing tool", "R", "Topic 15; cookie scanner comparison"),
 ("Data Protection Officer training", "B", "Readiness governance"),
 ("AI Risks: Optical Character Recognition", "B", "Topic 13"),
 # Legal studies
 ("Legal study on government access to data in third countries", "B", "TIA reference"),
 ("Study on the secondary use of personal data", "B", "Topic 11"),
 # Opinions of the Board (substantive)
 ("Opinion 28/2024 on certain data protection aspects related to the processing of personal data in the context of AI", "R", "Topic 13; AI Act sections 6, 13; AI Risk tool"),
 ("Opinion 22/2024 on certain obligations following from the reliance on processor", "R", "Privacy Assessment third parties; TPSA"),
 ("Opinion 08/2024 on Valid Consent in the Context of Consent or Pay", "R", "Topics 10 and 15"),
 ("Opinion 11/2024 on the use of facial recognition to streamline airport", "R", "Topic 9 biometrics"),
 ("Opinion 5/2019 on the interplay between the ePrivacy Directive and the GDPR", "B", "Topic 15"),
 # Other policy
 ("Position paper on Interplay between data protection and competition law", "B", "Privacy Assessment competitor-sharing factor"),
]

ROUTINE = re.compile(r"Binding Corporate Rules|accreditation|certification|Data Protection Impact Assessment list|list of processing|Code of Conduct|code of conduct|draft decision of the .* Supervisory Authority regarding|standard contractual clauses|Standard Contractual Clauses|draft list|Art\.? ?35\(4\)|Article 35\(4\)|Art\.? ?35\(5\)|competent supervisory authority|Administrative Arrangement|administrative arrangement|draft AA|Seal", re.I)
INTERNAL_TYPES = {"Internal document", "Procedure", "Rules of procedure", "Internal procedural guidance", "Memorandum of Understanding"}


def rate(it):
    t = it["title"]
    for key, r, note in MAP:
        if key.lower() in t.lower():
            return r, note
    ty = it["type"]
    if ty in INTERNAL_TYPES:
        return "N", "EDPB internal procedure"
    if ty == "Adequacy":
        return "B", "Adequacy opinions: the resulting decisions feed the Privacy Assessment transfer safeguards list"
    if ty.startswith("Opinion") and ROUTINE.search(t):
        return "N", "Routine Art 64 opinion (BCRs, accreditation, certification, national DPIA lists, codes, SCCs)"
    if ty.startswith("Opinion"):
        return "N", "Art 64 opinion on a matter outside the site's scope"
    if "Annual Report" in t or "Work Programme" in t or "Strategy" in t:
        return "N", "Institutional report"
    return "N", ""


rows = []
for it in items:
    r, note = rate(it)
    rows.append({**it, "rating": r, "note": note})

with open("/home/claude/pack/src/edpb_ratings.json", "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, indent=1)

with open("/mnt/user-data/outputs/edpb-documents-inventory-2026-09-19.csv", "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["Date", "Type", "Title", "Rating (R relevant / B background / N not relevant)", "Where it lands on the site", "URL"])
    for x in rows:
        w.writerow([x["date"], x["type"], x["title"], x["rating"], x["note"], x["url"]])

from collections import Counter
c = Counter(x["rating"] for x in rows)
print("total", len(rows), dict(c))
bytype = {}
for x in rows:
    bytype.setdefault(x["type"], Counter())[x["rating"]] += 1
for t, cc in sorted(bytype.items(), key=lambda kv: -sum(kv[1].values())):
    print("%-38s %3d  R=%2d B=%2d N=%3d" % (t, sum(cc.values()), cc["R"], cc["B"], cc["N"]))
