# -*- coding: utf-8 -*-
"""Apply the accepted findings of the 19 September 2026 review to the EDPB digest data
(digest.json) and to the one-liner templates, so a rebuild stays consistent. British spelling,
matching the digest. No em dashes."""
import json, re

E = json.load(open("digest.json", encoding="utf-8"))
byid = {e["id"]: e for e in E}
n_changes = 0

def set_take(i, old_frag, new_text):
    global n_changes
    e = byid[i]
    assert old_frag in e["takeaway"], (i, old_frag[:50])
    e["takeaway"] = new_text
    n_changes += 1

def sub_take(i, old, new):
    global n_changes
    e = byid[i]
    assert e["takeaway"].count(old) == 1, (i, old[:50])
    e["takeaway"] = e["takeaway"].replace(old, new)
    n_changes += 1

# F01 Binding Decision 2/2022 (Instagram)
set_take(258, "2019 data scraping", "Article 65 decision in the Irish authority's Meta (Instagram) inquiry into children's data: contact details of child users with business accounts were published by default and children's accounts were public by default, breaching Articles 5(1)(c), 6(1), 12(1), 24, 25 and 35 among others; the Board directed a higher fine (EUR 405 million in the final decision). Enforcement history; the substantive points on default settings and children are in the Article 25 guidance and Guidelines 05/2020.")
# F02 Joint Opinion 02/2023 (digital euro)
set_take(187, "Digital Identity wallet", "Joint opinion on the proposed Regulation establishing the digital euro: the EDPB and EDPS ask for a high privacy threshold, an offline mode with cash-like privacy, no central transaction database beyond what settlement needs, and clear roles for the ECB and the payment service providers. Payments sector.")
# F03 Joint Opinion 04/2021 (COVID certificates)
set_take(340, "European Digital Identity", "Joint opinion on the proposed Regulation for interoperable COVID-19 vaccination, test and recovery certificates (the Digital Green Certificate): no central EU database, purpose limited to free movement, and a sunset once the pandemic ends. Historical.")
# F04 Toolbox
set_take(284, "competition, consumer", "Toolbox of essential data protection safeguards for enforcement cooperation between EEA data protection authorities and the data protection authorities of third countries: what an agreement or arrangement must contain before personal data is shared in an investigation. For authorities.")
# F05 Alphabet DMA comments
set_take(10, "data portability", "Comments to the Commission on the draft measures specifying Alphabet's obligation under Article 6(11) DMA to share search ranking, query, click and view data with competing search engines, including relevant AI services: the EDPB asks for effective anonymisation of the shared data and safeguards against re-identification. Gatekeeper platforms only.")
# F06 Hoda letter
set_take(429, "member of the European Parliament", "Reply to correspondence from Hoda S.r.l., an Italian company, on the handling of a request for an opinion that the Italian authority had withdrawn, pointing the company to the general stakeholder channels. Correspondence.")
# F07 certification as a transfer tool
set_take(225, "No scheme has yet been approved", "Guidelines on certification as a transfer tool under Article 46(2)(f): what a certification scheme must contain for a third-country importer to rely on it. The first scheme was approved for this use in April 2026 (Europrivacy, Opinion 15/2026); certification, the covered processing and the binding commitments must together satisfy Article 46(2)(f).")
set_take(17, "valid across the EEA. Relevant", "Opinion under Articles 42(5) and 46(2)(f) approving the Europrivacy certification criteria as a European Data Protection Seal usable as a tool for transfers to third countries, the first certification approved for that purpose (April 2026). Relevant to exporters considering certification instead of standard contractual clauses, and to importers seeking it.")
# F08 Article 48
sub_take(80, "without one, the organisation needs another basis and at most an Article 49 derogation.", "without one, the organisation still needs an Article 6 basis and a Chapter V ground, which in practice is usually a narrowly read Article 49 derogation, since a foreign authority rarely signs Article 46 safeguards.")
# F09 access CEF year
sub_take(211, "Controllers must provide a free first copy in a commonly used electronic form,", "Controllers must provide a free first copy, in a commonly used electronic form where the request was made electronically unless the person asks otherwise,")
sub_take(211, "since the EDPB ran a coordinated enforcement action on the right of access in 2025.", "since the EDPB ran a coordinated enforcement action on the right of access in 2024, reported in January 2025.")
# F10 Helsinki
sub_take(76, "The Helsinki Statement (April 2025)", "The Helsinki Statement (high-level meeting of 1 to 2 July 2025)")
# F11 ePrivacy withdrawal
for i in (385, 471, 525):
    sub_take(i, "The proposal was withdrawn in February 2025.", "The Commission announced the withdrawal of the proposal in February 2025 and formally withdrew it in October 2025 (OJ C/2025/5423).")
# F12 adequacy status
sub_take(56, "Exporters may rely on adequacy once adopted, with four-yearly reviews.", "The Commission adopted the adequacy decision on 26 January 2026 (Decision (EU) 2026/179); exporters may rely on it within its scope, with four-yearly reviews.")
sub_take(86, "Firms sending personal data to the EPO may rely on the decision once adopted, with four-yearly reviews.", "The Commission adopted the decision on 15 July 2025 (Decision (EU) 2025/1382); firms sending personal data to the EPO may rely on it within its scope, with four-yearly reviews.")
# F17 COVID research consent
set_take(423, "consent as a safeguard", "Guidelines on processing health data for Covid-19 research: consent under Articles 6(1)(a) and 9(2)(a) can be the legal basis but must not be confused with the ethical consent to take part in a study, other research bases and Article 89 safeguards apply, and transfers may use Article 49 derogations in the emergency. Historical; the general points are in the 2026 scientific research guidelines.")
# F18, F37 supplementary measures
sub_take(323, "relevant, objective, reliable, verifiable and publicly available information;", "relevant, objective, reliable, verifiable and publicly available or otherwise accessible information;")
sub_take(323, "with encryption and pseudonymisation under exporter-held keys as the effective technical options.", "with encryption and pseudonymisation under keys the importer cannot reach, and split or multi-party processing, as the effective technical use cases.")
# F19 breach case digest
sub_take(160, "Each breach must be notified separately with enough detail", "Each notifiable breach (Article 33(1): any breach unless it is unlikely to result in a risk) must be notified separately with enough detail")
# F30 blockchain date
sub_take(3, "Version 2.0, 8 July 2026.", "Version 2.0, adopted 7 July 2026.")
# F32 Digital Omnibus joint opinion
sub_take(33, "They support raising the breach notification threshold to breaches likely to result in high risk, extending the deadline from 72 to 96 hours, and moving terminal equipment rules into the GDPR with machine-readable consent signals, and want the EDPB rather than the Commission to own DPIA lists and breach templates.", "They support raising the breach notification threshold to breaches likely to result in high risk, extending the deadline from 72 to 96 hours, the six-month bar on repeat consent requests and machine-readable consent signals, but warn that splitting the terminal equipment rules between the GDPR (personal data) and the ePrivacy Directive (other data) creates legal uncertainty and must not lower protection, and want the EDPB rather than the Commission to own DPIA lists and breach templates.")
# F33 connected vehicles
sub_take(349, "Data processed in and around a connected vehicle is personal data,", "Most data processed in and around a connected vehicle is personal data, since it can be linked to the driver, owner or passengers,")
# F34 Article 22
sub_take(526, "Where an exception applies the controller must provide human intervention that is meaningful rather than a token gesture, let the person express their view and contest the decision,", "Under the contract and consent exceptions the controller must provide human intervention that is meaningful rather than a token gesture, let the person express their view and contest the decision (for the legal-authorisation exception the law itself must lay down the safeguards),")
# F35 transparency qualifiers
sub_take(520, "words such as 'may' or 'might' fail the test.", "qualifiers such as 'may', 'might', 'some' or 'often' should be avoided because they leave the reader unsure what actually happens.")
# F36 video surveillance
sub_take(436, "usually legitimate interest backed by real and present threats;", "usually legitimate interest backed by real and present threats or, for public bodies, a public-interest task, since Article 6(1)(f) is closed to authorities performing their tasks;")
# F38 PNR
sub_take(97, "no general and indiscriminate retention.", "no general retention beyond the initial six months, and after that only for records with an objective link to the Directive's purposes.")

# Templates (F14 to F16): rewrite the one-liners in place
pat_bcr = re.compile(r"^Approves the (controller|processor) binding corporate rules of (.+?), on the draft decision of (.+?) under Article 64\(1\)\(f\)\. Matters only to organisations transferring personal data to or within that group\.$")
pat_cm = re.compile(r"^Approves the accreditation requirements for code of conduct monitoring bodies submitted by (.+?) under Article 41\(3\), checked against Guidelines 1/2019\. For code owners and would-be monitoring bodies in that country\.$")
pat_cb = re.compile(r"^Approves the accreditation requirements for certification bodies submitted by (.+?) under Article 43\(3\), checked against Guidelines 4/2018\. For certification bodies seeking accreditation in that country\.$")
pat_scc = re.compile(r"^Approves the standard contractual clauses for controller to processor contracts submitted by (.+?) under Article 28\(8\)\. One of the national templates that satisfy Article 28\(3\) without negotiation\.$")
t = {"bcr": 0, "cm": 0, "cb": 0, "scc": 0}
for e in E:
    tk = e["takeaway"]
    m = pat_bcr.match(tk)
    if m:
        e["takeaway"] = "Favourable opinion on the draft decision of %s approving the %s binding corporate rules of %s under Article 64(1)(f); the authority gives the final approval. Matters only to organisations transferring personal data to or within that group." % (m.group(3), m.group(1), m.group(2)); t["bcr"] += 1; continue
    m = pat_cm.match(tk)
    if m:
        e["takeaway"] = "Opinion on the draft accreditation requirements for code of conduct monitoring bodies submitted by %s under Article 41(3), checked against Guidelines 1/2019; the authority adopts the final requirements. For code owners and would-be monitoring bodies in that country." % m.group(1); t["cm"] += 1; continue
    m = pat_cb.match(tk)
    if m:
        e["takeaway"] = "Opinion on the draft accreditation requirements for certification bodies submitted by %s under Article 43(3), checked against Guidelines 4/2018; the authority adopts the final requirements. For certification bodies seeking accreditation in that country." % m.group(1); t["cb"] += 1; continue
    m = pat_scc.match(tk)
    if m:
        e["takeaway"] = "Opinion on the draft standard contractual clauses for controller to processor contracts submitted by %s under Article 28(8); the authority adopts the final clauses, which are Article 28 templates, not Chapter V transfer clauses. One of the national templates that satisfy Article 28(3) without negotiation." % m.group(1); t["scc"] += 1; continue
print("templates", t)
left = [e["id"] for e in E if e["takeaway"].startswith("Approves")]
assert not left, left
for e in E:
    assert "—" not in e["takeaway"]
json.dump(E, open("digest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("individual edits", n_changes)

# keep the generator templates in step
s = open("oneliners_build.py", encoding="utf-8").read()
reps = [
 ('return "Approves the %s binding corporate rules of %s, on the draft decision of %s under Article 64(1)(f). Matters only to organisations transferring personal data to or within that group." % (role, grp, who)',
  'return "Favourable opinion on the draft decision of %s approving the %s binding corporate rules of %s under Article 64(1)(f); the authority gives the final approval. Matters only to organisations transferring personal data to or within that group." % (who, role, grp)'),
 ('return "Approves the accreditation requirements for code of conduct monitoring bodies submitted by %s under Article 41(3), checked against Guidelines 1/2019. For code owners and would-be monitoring bodies in that country." % who',
  'return "Opinion on the draft accreditation requirements for code of conduct monitoring bodies submitted by %s under Article 41(3), checked against Guidelines 1/2019; the authority adopts the final requirements. For code owners and would-be monitoring bodies in that country." % who'),
 ('return "Approves the accreditation requirements for certification bodies submitted by %s under Article 43(3), checked against Guidelines 4/2018. For certification bodies seeking accreditation in that country." % who',
  'return "Opinion on the draft accreditation requirements for certification bodies submitted by %s under Article 43(3), checked against Guidelines 4/2018; the authority adopts the final requirements. For certification bodies seeking accreditation in that country." % who'),
 ('return "Approves the standard contractual clauses for controller to processor contracts submitted by %s under Article 28(8). One of the national templates that satisfy Article 28(3) without negotiation." % who',
  'return "Opinion on the draft standard contractual clauses for controller to processor contracts submitted by %s under Article 28(8); the authority adopts the final clauses, which are Article 28 templates, not Chapter V transfer clauses. One of the national templates that satisfy Article 28(3) without negotiation." % who'),
]
for o, n in reps:
    assert s.count(o) == 1, o[:60]
    s = s.replace(o, n)
open("oneliners_build.py", "w", encoding="utf-8", newline="\n").write(s)
print("oneliners_build.py templates updated")
