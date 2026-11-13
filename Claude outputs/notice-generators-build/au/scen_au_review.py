"""Review scenarios for the Australia module (review of 13 November 2026).

SCEN_RV: name -> ("pn", state). EXP_RV: the result each scenario should give after the findings are fixed
(texts: strings the policy must contain; notexts: strings it must not contain; rows: check statuses;
notes: strings that must appear in some check note). Only what the findings require is pinned, so the
expectations can become regression tests. Finding ids are in findings.json."""
import sys, copy
sys.path.insert(0, "/home/claude/ng-build/build/au")
from scen_au_rvbase import BASE, FULL, XROWS, CA_US, S

REC = BASE["recipients"]
BLUEGUM = {"who": "Bluegum Backup Ltd", "role": "processor", "why": "Storing our backups", "where": "Dublin, Ireland"}

SCEN_RV = {
    # AU01: confirmed "no recipients" while overseas disclosure rows exist.
    "rv_norecip_xrows": S(regimes=["au"], recipients=[], auNoRecip="Yes", auAbroad="Yes", auXrows=[XROWS[0]]),
    # AU02: a storage-only provider listed among recipients: section 5 says "usually disclose", section 6 says not a disclosure.
    "rv_storage_listed": S(regimes=["au"], recipients=REC + [BLUEGUM], auAbroad="Yes", auXrows=[XROWS[3]]),
    # AU03: a subsidiary whose name starts with the organisation's name passes as "own offices".
    "rv_own_group": S(regimes=["au"], ctrlName="Wattle Group", auAbroad="Yes",
                      auXrows=[{"recipient": "Wattle Group Singapore Pte Ltd", "country": "Singapore", "basis": "own"}]),
    # AU04: a four-digit number makes a foreign address "au".
    "rv_us_street": S(regimes=["au"], recipients=REC + [{"who": "Space Coast Mail Inc.", "role": "processor", "why": "Sending our emails",
                                                         "where": "4500 Babcock St, Melbourne, FL 32901"}], auAbroad="No"),
    "rv_bc_year": S(regimes=["au"], recipients=REC + [{"who": "Island Print Ltd", "role": "processor", "why": "Printing certificates",
                                                       "where": "1001 Douglas St, Victoria, BC V8W 2C5"},
                                                      {"who": "Maple Mail Inc.", "role": "processor", "why": "Posting certificates", "where": "1234 Perth Street, Ottawa"}], auAbroad="No"),
    # AU05: small business operator with no exception: the policy says the APPs bind it and sends complaints to the OAIC.
    "rv_small_none": S(regimes=["au"], auSb="under", auSbWhy="none"),
    "rv_eu_au_small": S(regimes=["eu", "au"], euEstablished="No", ctrlCountry="Australia", repName="EU Rep GmbH", repContact="rep@eurep.example", dpo="No", joint="No",
                        acts=[dict(a, basis="b") for a in BASE["acts"][:2]] + [dict(BASE["acts"][2], basis="a")], transfers="No",
                        withdrawHow="Use the unsubscribe link in each email", auSb="under", auSbWhy="none"),
    # AU06: employee audience: exempt employee records, but the policy promises APP 12 access and an OAIC complaint.
    "rv_employee": S(regimes=["au"], audience="employee", auDm="No",
                     acts=[{"purpose": "Paying salaries and managing your employment", "data": "Name, tax file number, bank account, salary", "auSens": "none",
                            "auLaw": "required", "auLawName": "Taxation Administration Act 1953", "retention": "7 years after you leave"}]),
    # AU07: an agency (public body) that charges for access.
    "rv_public_fee": S(regimes=["au"], publicBody="Yes", auFee="Yes"),
    # AU08: automated decisions unanswered in a policy that will be in force on 10 December 2026.
    "rv_adm_blank_before": S(regimes=["au"], effective="2026-12-01", auAdm=""),
    "rv_adm_shared_yes": S(regimes=["au"], effective="2026-12-01", adm="Yes", admWhat="Whether you pass a course, from your test scores", auAdm=""),
    "rv_adm_no_date": S(regimes=["au"], effective="", auAdm=""),
    # AU09: permitted general situation printed as a standing fact.
    "rv_pgs": S(regimes=["au"], acts=BASE["acts"] + [
        {"purpose": "Responding to medical emergencies at our campuses", "data": "Health information", "auSens": "pgs", "auSensPgs": "1", "auLaw": "no", "retention": "1 year"},
        {"purpose": "Investigating suspected exam cheating", "data": "Name, exam records, criminal record checks", "auSens": "pgs", "auSensPgs": "2", "auLaw": "no", "retention": "2 years"}],
        auAbroad="Yes", recipients=REC + [{"who": "Global Rescue Ltd", "role": "controller", "why": "Emergency medical assistance", "where": "London, United Kingdom"}],
        auXrows=[{"recipient": "Global Rescue Ltd", "country": "United Kingdom", "basis": "pgs", "pgs": "1"}],
        further="Yes", furtherWhat="Sharing exam records with other colleges to detect cheating", furtherStart="2027-02-01", furtherData="Exam records",
        auFurther="pgs", auFurtherPgs="2"),  # the fix made this a select (AU10); was auFurtherLaw="Item 2 of section 16A"
    # AU10: overseas row whose recipient is missing from the recipients list.
    "rv_row_not_listed": S(regimes=["au"], auAbroad="Yes", auXrows=[XROWS[0]]),
    # AU11: shared answer on the source left empty: the policy says "from you directly" with U04 ok.
    "rv_source_blank": S(regimes=["au"], source="", channel=["paper"]),
    # AU12: small business Commonwealth contractor and other s. 6E operators: bound only for some activities.
    "rv_sb_cth": S(regimes=["au"], auSb="under", auSbWhy="cth"),
    "rv_sb_other6e": S(regimes=["au"], auSb="under", auSbWhy="other6e"),
    # AU13: sensitive information marked for Japan (or another non-GDPR law) but "none" for Australia.
    "rv_jp_sens": S(regimes=["jp", "au"], jpScope="abroad", jpOffWhere="Australia", jpKind="corp", jpRepName="Jane Citizen, CEO",
                    jpSecurity="A basic policy; staff training; access control", jpFee="No", jpAcc="No", jpAbroad="No", jpKids="No", jpRelIn="No", jpRelOut="No",
                    jpPseudo="No", jpAnon="No", jpReqHow="Write to privacy@wattle.example.com.au", jpComplaint="privacy@wattle.example.com.au",
                    acts=[dict(a, jpSens="No") for a in BASE["acts"]] + [{"purpose": "Supporting students with disability", "data": "Health information you give us",
                          "jpSens": "Yes", "auSens": "none", "auLaw": "no", "auConseq": "We cannot arrange adjustments for you", "retention": "Until the course ends"}]),
    "rv_eu_art9": S(regimes=["eu", "au"], euEstablished="No", ctrlCountry="Australia", repName="EU Rep GmbH", repContact="rep@eurep.example", dpo="No", joint="No",
                    acts=[dict(a, basis="b") for a in BASE["acts"][:2]] + [{"purpose": "Supporting students with disability", "data": "Health information you give us",
                          "basis": "a", "art9": "a", "auSens": "none", "auLaw": "no", "retention": "Until the course ends"}], transfers="No",
                    withdrawHow="Use the unsubscribe link in each email"),
    # AU14: the OAIC 30-day sentence against a longer complaint time, and a request period longer than 30 days.
    "rv_days": S(regimes=["au"], auComplaintHow="We acknowledge it within 5 business days and reply in writing within 45 days", auReqDays="60"),
    # AU15: complaint route that is not written; anonymity without the "authorises" limb.
    "rv_wording": S(regimes=["au"], auComplaint="Call us on 1800 000 000", auAnonWhat=""),
    # AU16: location classifier: Australian names that fail closed.
    "rv_places": S(regimes=["au"], recipients=[
        {"who": "Capital Print Pty Ltd", "role": "processor", "why": "Printing", "where": "Australian Capital Territory"},
        {"who": "Red Centre Tours Pty Ltd", "role": "processor", "why": "Excursions", "where": "Alice Springs, NT"},
        {"who": "Harbour Data Pty Ltd", "role": "processor", "why": "Hosting", "where": "Western Sydney"}], auAbroad="No"),
    # AU17: full scenario re-run for wording (In short grammar, storage inside "as follows", correction notification).
    "rv_full": S(regimes=["au"], **FULL),
    # AU18: direct marketing words the detector misses.
    "rv_dm_missed": S(regimes=["au"], auDm="", acts=BASE["acts"][:2] + [dict(BASE["acts"][2], purpose="Telling you about new courses and events")]),
    # AU19: placeholders printed with no missing check (sources without a name, shared inferred/ADM/profiling answers).
    "rv_placeholders": S(regimes=["au"], source="both", sources=[{"name": "", "what": ""}], inferred="Yes", inferredWhat="", adm="Yes", admWhat="", auAdm="No"),
    "rv_profiling_blank": S(regimes=["au"], profiling="Yes", profilingWhat=""),
    # AU20: direct marketing answered Yes, but no purpose covers it.
    "rv_dm_no_purpose": S(regimes=["au"], acts=BASE["acts"][:2]),
    # Other-led section with no Australia answers: every placeholder must come with a missing row.
    "rv_eu_au_blank": ("pn", {k: v for k, v in dict(BASE, regimes=["eu", "au"], euEstablished="No", ctrlCountry="Australia", repName="EU Rep GmbH",
                       repContact="rep@eurep.example", dpo="No", joint="No", transfers="No", withdrawHow="Use the unsubscribe link in each email",
                       acts=[{kk: vv for kk, vv in dict(a, basis="b").items() if not kk.startswith("au")} for a in BASE["acts"]]).items() if not k.startswith("au")}),
}

EXP_RV = {
    # High
    "rv_norecip_xrows": dict(notexts=["We do not disclose personal information to other organisations or people"],
                             rows={"U09": "missing"}, notes=["Redwood Cloud Inc."]),
    "rv_us_street": dict(notexts=["We are not likely to disclose personal information to recipients outside Australia"], rows={"U10": "missing"},
                         notes=["Space Coast Mail Inc."]),
    "rv_bc_year": dict(notexts=["We are not likely to disclose personal information to recipients outside Australia"], rows={"U10": "missing"},
                       notes=["Island Print Ltd", "Maple Mail Inc."]),
    "rv_own_group": dict(notexts=["it stays within our own organisation"], rows={"U10": "missing"}, notes=["Wattle Group Singapore Pte Ltd"]),
    "rv_placeholders": dict(rows={"U03": "missing", "U04": "missing", "U17": "missing"}),
    "rv_profiling_blank": dict(rows={"U03": "missing"}),
    "rv_small_none": dict(notexts=["complain to the Office of the Australian Information Commissioner (OAIC)", "and then to the OAIC",
                                   "manages personal information under the Privacy Act 1988"],
                          texts=["small business operator"], rows={"U02": "warn"}, notes=["s. 6EA"]),
    "rv_eu_au_small": dict(notexts=["The Privacy Act 1988 and the Australian Privacy Principles (APPs) apply to our handling of personal information",
                                    "complain to the Office of the Australian Information Commissioner (OAIC)"],
                           texts=["small business operator"], rows={"U02": "warn"}),
    # Medium
    "rv_storage_listed": dict(texts=["We are not likely to disclose personal information to recipients outside Australia",
                                     "only store personal information for us"], rows={"U09": "check", "U10": "check"}),
    "rv_row_not_listed": dict(rows={"U09": "missing"}, notes=["Redwood Cloud Inc."]),
    "rv_source_blank": dict(notexts=["We collect personal information from you directly."], rows={"U04": "missing"}),
    "rv_adm_blank_before": dict(rows={"U17": "missing"}, notes=["10 December 2026"]),
    "rv_adm_shared_yes": dict(rows={"U17": "missing"}),
    "rv_adm_no_date": dict(rows={"U17": "missing"}),
    "rv_pgs": dict(notexts=["because a permitted general situation exists: we", "a permitted general situation exists: we believe",
                            "A permitted general situation exists: item 2"],
                   texts=["where a permitted general situation exists"], rows={"U05": "check", "U10": "check", "U20": "check"}),
    "rv_employee": dict(texts=["employee record"], rows={"U22": "warn"}, notes=["s. 7B(3)", "Privacy (Tax File Number) Rule 2015"]),
    "rv_public_fee": dict(notexts=["We charge for giving access"], rows={"U02": "warn", "U13": "missing"}, notes=["APP 12.7"]),
    "rv_sb_cth": dict(rows={"U02": "check"}, notes=["s. 7B(2)"]),
    "rv_sb_other6e": dict(rows={"U02": "check"}, notes=["s. 6E"]),
    # Low
    "rv_jp_sens": dict(rows={"U05": "warn"}, notes=["Supporting students with disability"]),
    "rv_eu_art9": dict(rows={"U05": "warn"}, notes=["Supporting students with disability"]),
    "rv_days": dict(notexts=["or we do not respond within 30 days"], rows={"U13": "warn", "U14": "warn"}, notes=["30 days"]),
    "rv_full": dict(notexts=["and withdraw your consent, and complain", "we tell other organisations we disclosed it to",
                             "If we refuse, we tell you why in writing, and how to complain (APP 12.9, 13.3).", "required by Taxation Administration Act"],
                    texts=["We are likely to disclose personal information to recipients in the United States, New Zealand and Canada",
                           "We also hold personal information outside Australia without disclosing it"],
                    notes=["APP Guidelines 1.32, 1.33", "Interactive Gambling Act 2001"]),
    "rv_wording": dict(notexts=["complain to us first, in writing: call us", "unless the law requires us to deal with identified people"],
                       texts=["requires or authorises us to deal with identified people"]),
    "rv_places": dict(rows={"U10": "ok"}, texts=["We are not likely to disclose personal information to recipients outside Australia"]),
    "rv_dm_missed": dict(rows={"U15": "warn"}),
    "rv_dm_no_purpose": dict(rows={"U15": "warn"}, notes=["APP 1.4(c)"]),
    # Correct today; kept as a regression test for the other-led section with no Australia answers.
    "rv_eu_au_blank": dict(rows={"U02": "missing", "U04": "missing", "U10": "missing", "U13": "missing", "U14": "missing"}),
}
