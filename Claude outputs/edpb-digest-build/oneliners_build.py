# -*- coding: utf-8 -*-
"""Assemble the digest data set: 532 entries, each with a takeaway (written for R and B,
manual one-liner for substantive N, templated one-liner for routine N)."""
import json, re
from oneliners_manual import MANUAL

rows = json.load(open("/home/claude/pack/src/edpb_ratings.json", encoding="utf-8"))
written = {}
for k in range(5):
    for x in json.load(open("/home/claude/pack/src/takeaways_%d.json" % k, encoding="utf-8")):
        written[x["id"]] = x

INTERNAL = {"Internal document", "Procedure", "Rules of procedure", "Internal procedural guidance", "Memorandum of Understanding"}

EXTRA_MANUAL = {
 # the three "other" routine opinions
 None: None,
}
for i, x in enumerate(rows):
    t = x["title"]
    if t.startswith("Opinion 04/2024 on the notion of main establishment"):
        MANUAL[i] = "Opinion on when a controller has a main establishment in the Union under Article 4(16)(a): the place of central administration counts only if it actually takes the decisions on purposes and means, otherwise the one-stop-shop does not apply. Procedural, for authorities deciding competence."
    if t.startswith("Opinion 39/2021 on whether Article 58(2)(g)"):
        MANUAL[i] = "Opinion confirming that a supervisory authority may order erasure of its own motion under Article 58(2)(g), without a data subject request. Enforcement powers."
    if t.startswith("Opinion 8/2019 on the competence of a supervisory authority"):
        MANUAL[i] = "Opinion on which authority stays competent when a controller's main establishment changes during a procedure. Procedure between authorities."


def sa(t):
    """Return a phrase naming the authority, or None."""
    m = re.search(r"of the ([A-Za-z\- ]+?) (?:Supervisory Authority|SA)\b", t)
    if m:
        return "the %s authority" % m.group(1).strip()
    m = re.search(r"competent supervisory authorit(?:y|ies) of (?:the )?([A-Za-z\- ]+?)(?: regarding| on|,|$)", t)
    if m:
        return "the supervisory authority of %s" % m.group(1).strip()
    m = re.search(r"\(([A-Z]{2}) SA\)", t)
    if m:
        return "the %s supervisory authority" % m.group(1)
    m = re.search(r"on the ([A-Za-z]+) data protection supervisory authority", t)
    if m:
        return "the %s authority" % m.group(1)
    m = re.search(r"the ([A-Za-z]+) SA on", t)
    if m:
        return "the %s authority" % m.group(1)
    return None


def template(x):
    t = x["title"]
    ty = x["type"]
    a = sa(t)
    who = a if a else "the national authority"
    if ty in INTERNAL:
        return "%s of the Board. Governs how the Board itself works: no obligation on controllers or processors." % ty
    if "Annual Report" in t:
        yr = re.search(r"\d{4}", t).group(0)
        return "The Board's annual report for %s: guidelines adopted, opinions and binding decisions issued, cooperation and enforcement figures. Background only." % yr
    if "Work Programme" in t:
        yrs = re.search(r"\d{4}-\d{4}", t).group(0)
        return "The Board's work programme for %s: the guidelines, templates and coordinated actions it planned for the period. Background for what was coming." % yrs
    if "Strategy 20" in t:
        yrs = re.search(r"\d{4}-\d{4}", t).group(0)
        return "The Board's strategy for %s: its priorities for harmonisation, enforcement and engagement. Institutional." % yrs
    if "Digital Services Package and Data Strategy" in t:
        return "Statement on the Commission's Digital Services Package and Data Strategy proposals: the Board asks that the DSA, DMA, Data Governance Act and Data Act stay consistent with the GDPR. All since adopted."
    if re.search(r"Binding Corporate Rules", t, re.I):
        role = "processor" if re.search(r"Processor Binding", t, re.I) else "controller"
        m = re.search(r"Binding Corporate Rules of (?:the )?(.+?)$", t)
        grp = m.group(1).strip() if m else "a corporate group"
        return "Favourable opinion on the draft decision of %s approving the %s binding corporate rules of %s under Article 64(1)(f); the authority gives the final approval. Matters only to organisations transferring personal data to or within that group." % (who, role, grp)
    if re.search(r"accreditation", t, re.I) and re.search(r"monitoring bod", t, re.I):
        return "Opinion on the draft accreditation requirements for code of conduct monitoring bodies submitted by %s under Article 41(3), checked against Guidelines 1/2019; the authority adopts the final requirements. For code owners and would-be monitoring bodies in that country." % who
    if re.search(r"accreditation", t, re.I):
        return "Opinion on the draft accreditation requirements for certification bodies submitted by %s under Article 43(3), checked against Guidelines 4/2018; the authority adopts the final requirements. For certification bodies seeking accreditation in that country." % who
    if re.search(r"exempt", t, re.I):
        return "Reviews the draft list from %s of processing operations exempt from a DPIA under Article 35(5), asking for the list to stay narrow and consistent with the WP248 criteria." % who
    if re.search(r"35\(4\)|subject to the requirement of a data protection impact|data protection impact assessment", t, re.I):
        return "Reviews the draft national list from %s of processing operations requiring a DPIA under Article 35(4), asking for alignment with the nine WP248 criteria so national lists stay consistent. Check the final national list if you operate there." % who
    if re.search(r"Standard Contractual Clauses.*28\(8\)|Article 28\(8\)", t, re.I):
        return "Opinion on the draft standard contractual clauses for controller to processor contracts submitted by %s under Article 28(8); the authority adopts the final clauses, which are Article 28 templates, not Chapter V transfer clauses. One of the national templates that satisfy Article 28(3) without negotiation." % who
    if re.search(r"code of conduct", t, re.I):
        m = re.search(r"[\"“](.+?)[\"”]", t)
        code = ("the " + m.group(1)) if m else ("the cloud services code of conduct" if "Cloud" in t else "a sector code of conduct")
        return "Opinion under Article 40(7) on %s, on the draft decision of %s. Adherence is voluntary and sector-specific; relevant if you or a supplier claims to follow it." % (code, who)
    if re.search(r"European Data Protection Seal", t, re.I):
        m = re.search(r"on the (.+?) (?:certification )?criteria", t)
        scheme = m.group(1) if m else "a scheme's"
        return "Opinion under Article 42(5) on approving the %s certification criteria as a European Data Protection Seal, valid across the EEA. Relevant if you or a supplier holds or seeks that certification." % scheme
    if re.search(r"certification criteria|certification", t, re.I):
        return "Opinion under Article 42(5) on national certification criteria submitted by %s. Relevant if you or a supplier holds or seeks that certification." % who
    if re.search(r"administrative arrangement|\bAA\b", t, re.I):
        return "Opinion on a draft administrative arrangement for transfers between public bodies under Article 46(3)(b): what the arrangement must contain to give enforceable rights and effective remedies. Public bodies only."
    return "Article 64 opinion outside the site's scope."


entries = []
for i, x in enumerate(rows):
    e = {"id": i, "title": x["title"], "type": x["type"], "date": x["date"], "url": x["url"], "rating": x["rating"], "where": x["note"]}
    if i in written:
        w = written[i]
        e.update(takeaway=w["takeaway"], status=w["status"], topics=w["topics"], tier="written", source=w["source"])
    elif i in MANUAL:
        e.update(takeaway=MANUAL[i], status="", topics=[], tier="oneliner", source="title")
    else:
        e.update(takeaway=template(x), status="", topics=[], tier="oneliner", source="title")
    entries.append(e)

# checks
assert len(entries) == 532
for e in entries:
    assert "—" not in e["takeaway"], e["id"]
    assert e["takeaway"].strip(), e["id"]
fallback = [e for e in entries if e["takeaway"] == "Article 64 opinion outside the site's scope."]
print("entries", len(entries), "written", sum(1 for e in entries if e["tier"] == "written"), "oneliners", sum(1 for e in entries if e["tier"] == "oneliner"), "fallback", len(fallback))
for e in fallback:
    print("  FALLBACK", e["title"][:120])
json.dump(entries, open("/home/claude/pack/src/digest.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

# spot check templates
import random
random.seed(7)
for e in random.sample([e for e in entries if e["tier"] == "oneliner" and e["id"] not in MANUAL], 10):
    print("\n-", e["title"][:110], "\n ", e["takeaway"])
