"""Copy of the reviewer's scenarios, frozen on the base they were written against (scen_sg_rvbase.py), with the
expected results after the fixes in EXP_RV (added by the builder).

Reviewer's scenarios for the Singapore (PDPA) module, 13 November 2026.

Each entry: name -> ("pn", state), in the shape of scen_sg.py. Dump with:
cd /tmp && PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 \
  /home/claude/ng-build/build/review-2026-11-13-sg/dump_rv.py /home/claude/ng-test \
  /home/claude/ng-build/build/review-2026-11-13-sg/outputs_rv
"""
import sys
sys.path.insert(0, "/home/claude/ng-build/build/sg")
from scen_sg_rvbase import BASE, XROWS, FULL, CA_US  # noqa: E402  (the scenario base as the reviewer saw it)


def S(**kw):
    d = dict(BASE)
    d.update(kw)
    return ("pn", d)


def rec(who, where, role="processor", why="Hosting our website and app"):
    return {"who": who, "role": role, "why": why, "where": where}


SG_ONLY = ["sg"]

SCEN_RV = {
    # --- Location detection and the "We do not transfer" denial -------------------------------
    # A recipient with no location: the policy denies any transfer and H10 passes.
    "rv_sg_where_empty": S(regimes=SG_ONLY, recipients=[rec("Blank Hosting Pte. Ltd.", "")], sgAbroad="No"),
    # Mixed entries whose foreign part is not in the place list are read as Singapore.
    "rv_sg_mixed_johor": S(regimes=SG_ONLY, recipients=[rec("Strait Data Pte. Ltd.", "Singapore and Johor Bahru")], sgAbroad="No"),
    "rv_sg_mixed_other": S(regimes=SG_ONLY, recipients=[rec("Strait Data Pte. Ltd.", "Singapore and other countries")], sgAbroad="No"),
    "rv_sg_mixed_abbrev": S(regimes=SG_ONLY, recipients=[rec("Strait Data Pte. Ltd.", "SG, HK")], sgAbroad="No"),
    "rv_sg_mixed_perth": S(regimes=SG_ONLY, recipients=[rec("Strait Data Pte. Ltd.", "Singapore, with backups in Perth")], sgAbroad="No"),
    # The AWS console name of the Singapore region is read as abroad (false positive).
    "rv_sg_aws_display": S(regimes=SG_ONLY, recipients=[rec("Redwood Cloud Inc.", "AWS Asia Pacific (Singapore)")], sgAbroad="No"),
    # Transfers answered Yes: a recipient of unknown or empty location, not in the transfer rows, is not flagged.
    "rv_sg_yes_unknown": S(regimes=SG_ONLY, sgAbroad="Yes", sgXrows=[XROWS[0]],
                           recipients=[rec("Redwood Cloud Inc.", "Oregon, United States"), rec("Mystery Hosting", "Data centre"),
                                       rec("Blank Analytics", "", role="controller", why="Measuring course demand")]),
    # "Own systems" chosen for another company: the policy says the data stays within our own organisation.
    "rv_sg_own_other": S(regimes=SG_ONLY, sgAbroad="Yes",
                         sgXrows=[{"recipient": "Redwood Cloud Inc.", "country": "United States", "basis": "own"}],
                         recipients=[rec("Redwood Cloud Inc.", "Oregon, United States")]),
    # --- Contact points ----------------------------------------------------------------------
    # DPO contact is a telephone number only: requests "in writing" go to a phone number; H08, H14 do not object.
    "rv_sg_dpo_phone": S(regimes=SG_ONLY, sgDpoContact="+65 6123 4567"),
    # The shared "How people exercise their rights" field is shown for a Singapore-led policy but not used.
    "rv_sg_rightscontact": S(regimes=SG_ONLY, rightsContact="The privacy form at merlion.example.sg/privacy-request", sgReqHow=""),
    # --- Bases --------------------------------------------------------------------------------
    # Business improvement for the organisation's own use (not a group).
    "rv_sg_bip_own": S(regimes=SG_ONLY, acts=BASE["acts"] + [
        {"purpose": "Improving our courses from how learners use them", "data": "Course history, quiz results", "sgBasis": "bip", "retention": "2 years"}]),
    # Marketing messages under deemed consent by notification that the keyword test misses; and a new purpose for marketing.
    "rv_sg_mkt_missed": S(regimes=SG_ONLY, acts=BASE["acts"] + [
        {"purpose": "Recommending other courses to you by SMS", "data": "Name, mobile number, course history", "sgBasis": "notify",
         "sgOptOut": "reply STOP to our SMS of 1 March 2027 within 30 days", "retention": "2 years"}],
        further="Yes", furtherWhat="Sending you promotional SMS about partner courses", furtherStart="2027-06-01",
        furtherData="Name and mobile number", sgFurther="notify"),
    # Deemed consent by conduct (s. 15(1)) when the data comes from other organisations.
    "rv_sg_deemed_indirect": S(regimes=SG_ONLY, source="indirect", acts=[
        {"purpose": "Verifying your enrolment with your employer", "data": "Name, employee number", "sgBasis": "deemed", "retention": "1 year"}]),
    # No consent relied on at all, children answered Yes.
    "rv_sg_kids_noconsent": S(regimes=SG_ONLY, sgKids="Yes", sgKids13="No", withdrawHow="", acts=[
        {"purpose": "Detecting fraud and misuse of accounts", "data": "Login records", "sgBasis": "li", "sgLi": "keeping accounts safe", "retention": "1 year"},
        {"purpose": "Registering students with the Committee for Private Education", "data": "Name, course", "sgBasis": "law", "sgLaw": "Private Education Act 2009", "retention": "As the Act requires"}]),
    # NRIC numbers collected to verify identity at login.
    "rv_sg_nric_auth": S(regimes=SG_ONLY, sgNric="Yes", sgNricWhy="id", sgNricDetail="We check your NRIC number each time you log in to your account"),
    # New purpose under another exception: the Changes section still promises notice of every new purpose.
    "rv_sg_further_exc": S(regimes=SG_ONLY, further="Yes", furtherWhat="Sharing records with our insurer to investigate a claim", furtherStart="2027-03-01",
                           furtherData="Name, enrolment records", sgFurther="exception", sgFurtherLaw="First Schedule, Part 3, paragraph 3: investigation or proceedings"),
    # --- Placeholders printed while the check row is not "missing" -----------------------------
    "rv_sg_blank_purpose": S(regimes=SG_ONLY, acts=[{"purpose": "", "data": "Name, email address", "sgBasis": "consent", "retention": "1 year"}]),
    "rv_sg_blank_recipient": S(regimes=SG_ONLY, recipients=[rec("", "Singapore", why="Hosting our website")]),
    # Automated decisions, inferred data and profiling answered Yes with no description: no Singapore row covers them.
    "rv_sg_adm_blank": S(regimes=SG_ONLY, adm="Yes", admWhat="", inferred="Yes", inferredWhat=""),
    "rv_sg_profiling_blank": S(regimes=SG_ONLY, adm="No", profiling="Yes", profilingWhat=""),
    # No recipients confirmed, while a purpose relies on deemed consent for disclosures to other organisations.
    "rv_sg_norecip_contract": S(regimes=SG_ONLY, recipients=[], sgNoRecip="Yes"),
    # Stale answers: EU-only answers left in the state when Singapore leads, and the reverse.
    "rv_stale_eu_to_sg": S(regimes=SG_ONLY, dpo="Yes", dpoContact="dpo@eu.example", children="Yes", joint="Yes", jointWho="Lion Pay Pte. Ltd.",
                           jointEssence="We share payment fraud screening", acts=[dict(a, basis="b", required="Yes") for a in BASE["acts"]],
                           further="Yes", furtherWhat="Training our course recommendation model", furtherStart="2027-06-01",
                           furtherData="Course history", furtherBasis="f", sgFurther=""),
    "rv_stale_sg_to_eu": S(regimes=["eu", "sg"], euEstablished="No", ctrlCountry="Singapore", repName="EU Rep GmbH", repContact="rep@eurep.example",
                           dpo="No", joint="No", transfers="No", further="Yes", furtherWhat="Training our course recommendation model",
                           furtherStart="2027-06-01", furtherData="Course history", sgFurther="notify",
                           acts=[dict(a, basis="b") for a in BASE["acts"][:2]] + [dict(BASE["acts"][2], basis="a")]),
    # Transfer row on contract necessity with no organisation recipient, and a transfer row naming a recipient in Singapore.
    "rv_sg_xrow_mismatch": S(regimes=SG_ONLY, sgAbroad="Yes",
                             sgXrows=[{"recipient": "Kampong Cloud Pte. Ltd.", "country": "Singapore", "basis": "contractNeed"}]),
    # --- With other laws ----------------------------------------------------------------------
    # Singapore leads with US states only (no California): which sections are PDPA-only.
    "rv_sg_us_only": S(regimes=["sg", "us"], usStates=["CO"], usCats=CA_US["usCats"]),
    # EU leads; Singapore section with a mixed location.
    "rv_eu_sg_mixed": S(regimes=["eu", "sg"], euEstablished="No", ctrlCountry="Singapore", repName="EU Rep GmbH", repContact="rep@eurep.example",
                        dpo="No", joint="No", transfers="No",
                        acts=[dict(a, basis="b") for a in BASE["acts"][:2]] + [dict(BASE["acts"][2], basis="a")],
                        recipients=[rec("Strait Data Pte. Ltd.", "Singapore and Johor Bahru")], sgAbroad="No"),
    # India leads; Singapore transfers with rows, and a recipient with empty location.
    "rv_in_sg_rows": S(regimes=["in", "sg"], acts=[dict(a, inGround="consent", inEnables="Your account and courses") for a in BASE["acts"]],
                       recipients=[rec("Redwood Cloud Inc.", "Oregon, United States"), rec("Blank Mail Co", "", why="Sending emails")],
                       sgAbroad="Yes", sgXrows=[XROWS[0]]),
    # Korea leads with Singapore: offshore Korean section, Singapore answers left blank.
    "rv_kr_sg_blank": S(regimes=["kr", "sg"], krScope="abroad", krOffWhere="Singapore", krRepNeed="No", krRep="No", krCpo="Lim Wei, Director",
                        krCpoContact="+65 6123 4567, privacy@merlion.example.sg", krSecurity="Encryption; access control", krKids="No",
                        krSensPublic="No", krPseudo="No", krCookies="No", krFurtherUse="No", krFee="No", krPort="No",
                        krObject="Reply to our answer within 30 days", krFirst="Yes", krAbroad="No",
                        krDestroyProc="We delete data at the end of its retention period", krDestroyHow=["del"],
                        acts=[dict(a, krBasis="contract" if i < 2 else "consent", krRefuse="You do not receive course news", krSens="No")
                              for i, a in enumerate(BASE["acts"])],
                        sgScope="", sgAbroad="", sgFee="", sgDpoContact=""),
    # Organisation abroad, transfers unanswered.
    "rv_sg_offshore_blank": S(regimes=SG_ONLY, sgScope="abroad", sgOffWhere="Malaysia", sgAbroad="",
                              recipients=[rec("Kampong Cloud Pte. Ltd.", "Singapore")]),
    # Full scenario with the further purpose under consent: is withdrawal information given?
    "rv_sg_further_consent_only": S(regimes=SG_ONLY, withdrawHow="",
                                    acts=[{"purpose": "Keeping tax records of course payments", "data": "Name, amount paid", "sgBasis": "law",
                                           "sgLaw": "Income Tax Act 1947", "retention": "5 years"}],
                                    further="Yes", furtherWhat="Sharing your results with partner universities", furtherStart="2027-06-01",
                                    furtherData="Name and results", sgFurther="consent"),
}


# ---- Expected results after the fixes (builder, 13 November 2026) ----------------------------------------------------
CN = "relies on deemed consent for disclosure to other organisations needed for a contract with the person (section 15(3) to (8))"
DENY = "We do not transfer personal data outside Singapore."
EXP_RV = {
    # SG02: no location is unknown, never a denial
    "rv_sg_where_empty": dict(texts=["[Check where Blank Hosting Pte. Ltd. is located. If outside Singapore, answer Yes"], notexts=[DENY],
                              rows={"H09": "missing", "H10": "missing"}, notes=["Give where Blank Hosting Pte. Ltd. is located"]),
    # SG01: mixed entries count as abroad
    "rv_sg_mixed_johor": dict(texts=["[Strait Data Pte. Ltd. (Singapore and Johor Bahru) is outside Singapore."], notexts=[DENY], rows={"H10": "missing"}),
    "rv_sg_mixed_other": dict(texts=["[Strait Data Pte. Ltd. (Singapore and other countries) is outside Singapore."], notexts=[DENY], rows={"H10": "missing"}),
    "rv_sg_mixed_abbrev": dict(texts=["[Strait Data Pte. Ltd. (SG, HK) is outside Singapore."], notexts=[DENY], rows={"H10": "missing"}),
    "rv_sg_mixed_perth": dict(texts=["[Strait Data Pte. Ltd. (Singapore, with backups in Perth) is outside Singapore."], notexts=[DENY], rows={"H10": "missing"}),
    "rv_eu_sg_mixed": dict(texts=["Additional information under Singapore's PDPA", "[Strait Data Pte. Ltd. (Singapore and Johor Bahru) is outside Singapore."], notexts=[DENY], rows={"H10": "missing"}),
    # SG13: provider display names of the Singapore region
    "rv_sg_aws_display": dict(texts=[DENY], notexts=["is outside Singapore. Answer Yes"], rows={"H10": "ok"}),
    # SG03: unknown and empty locations in the Yes branch
    "rv_sg_yes_unknown": dict(texts=["[Check where Mystery Hosting (Data centre) and Blank Analytics are located. If outside Singapore, add them to the transfers outside Singapore.]"],
                              notexts=[], rows={"H09": "missing", "H10": "missing"}, notes=["regulation 10(1)"]),
    "rv_in_sg_rows": dict(texts=["[Check where Blank Mail Co is located. If outside Singapore, add it to the transfers outside Singapore.]"], notexts=[], rows={"H09": "missing", "H10": "missing"}),
    # SG04: "own systems" for another company
    "rv_sg_own_other": dict(texts=["[Redwood Cloud Inc. is not our own organisation: choose another basis (regulation 9).]"],
                            notexts=["Redwood Cloud Inc. (United States): it stays within our own organisation"], rows={"H10": "missing"}, notes=["the transferring organisation is not a recipient"]),
    # SG05: section 15(3) to (8) without an organisation recipient
    "rv_sg_norecip_contract": dict(texts=["[\"Taking payment for courses\" " + CN], notexts=["We do not disclose your personal data to other organisations"],
                                   rows={"H05": "missing"}, notes=["it does not cover your own collection and use"]),
    # SG23 and SG05: a row naming Singapore; contract necessity to a data intermediary
    "rv_sg_xrow_mismatch": dict(texts=["Kampong Cloud Pte. Ltd. (Singapore): [This row names Singapore"], notexts=[], rows={"H10": "missing"},
                                notes=["names Singapore as the country", "For a data intermediary, use a contract requiring a comparable standard"]),
    # SG07: business improvement for the organisation's own use
    "rv_sg_bip_own": dict(texts=["Business improvement ([First Schedule, Part 5, for a corporation, or Second Schedule, Part 2, Division 2: say whether you are a corporation])"],
                          notexts=["within our group"], rows={"H05": "missing"}, notes=["Say whether your organisation is a corporation", "It does not cover collecting the data"]),
    # SG20: deemed consent by conduct with data from others
    "rv_sg_deemed_indirect": dict(texts=[], notexts=[], rows={"H05": "warn"}, notes=["section 15(1)(a)", "section 15(2)"]),
    # SG09: a DPO contact without email or postal address
    "rv_sg_dpo_phone": dict(texts=["write to privacy@merlion.example.sg"], notexts=["write to our data protection officer at +65"], rows={"H08": "missing", "H14": "ok"},
                            notes=["regulation 3(1)"]),
    # SG12: the shared rights field and the organisation's contact details
    "rv_sg_rightscontact": dict(texts=["the privacy form at merlion.example.sg/privacy-request", "Our contact details:", "Email: privacy@merlion.example.sg"], notexts=[], rows={"H14": "ok"}),
    # SG15: marketing under deemed consent by notification, and as the new purpose
    "rv_sg_mkt_missed": dict(texts=[], notexts=[], rows={"H18": "warn"}, notes=["looks like sending marketing messages", "regulation 13"]),
    # SG21: children, no consent relied on
    "rv_sg_kids_noconsent": dict(texts=[], notexts=["2. Children", "between 13 and 17"], rows={"H16": "check", "H13": "na"}, notes=["prints no section on children's consent"]),
    # SG14: NRIC used to authenticate
    "rv_sg_nric_auth": dict(texts=[], notexts=[], rows={"H17": "warn"}, notes=["1 January 2027", "authenticate people"]),
    # SG19: new purpose under an exception
    "rv_sg_further_exc": dict(texts=["we tell you that purpose, unless the law allows it without your consent (sections 18 and 20)."],
                              notexts=["we tell you that purpose (section 20(1)(b))"], rows={"H18": "check"}, notes=["section 20(3)(b)"]),
    # SG26: consent only for the new purpose
    "rv_sg_further_consent_only": dict(texts=["Withdrawing consent", "You can withdraw your consent"], notexts=[], rows={"H13": "ok", "H18": "check"}),
    # SG11: blank names
    "rv_sg_blank_purpose": dict(texts=["[purpose]"], notexts=[], rows={"H03": "missing"}, notes=["Name each purpose"]),
    "rv_sg_blank_recipient": dict(texts=["[service provider]"], notexts=[], rows={"H09": "missing"}, notes=["Name each recipient"]),
    # SG10: inferred data, automated decisions and profiling without text
    "rv_sg_adm_blank": dict(texts=["[the decisions and what they are based on]"], notexts=[], rows={"H30": "missing"}),
    "rv_sg_profiling_blank": dict(texts=["[the analysis and what it is used for]"], notexts=[], rows={"H30": "missing"}),
    # SG16: the withdrawal section is PDPA-only too
    "rv_sg_us_only": dict(texts=["Sections 6, 7 and 8 apply to you only where the PDPA applies to our handling of your personal data."], notexts=[], rows={"H01": "ok"}),
    # No finding: kept as regression cases
    "rv_kr_sg_blank": dict(texts=["Additional information under Singapore's PDPA", "For personal data we collect, use or disclose in Singapore, section "], notexts=[],
                           rows={"H08": "missing", "H10": "missing", "H14": "missing"}),
    "rv_sg_offshore_blank": dict(texts=["[Say whether personal data is transferred outside Singapore.]"], notexts=[DENY], rows={"H10": "missing"}),
    "rv_stale_eu_to_sg": dict(texts=[], notexts=["GDPR"], rows={"H18": "missing"}),
    "rv_stale_sg_to_eu": dict(texts=["Additional information under Singapore's PDPA"], notexts=[], rows={"P18": "missing", "H18": "check"}),
}
