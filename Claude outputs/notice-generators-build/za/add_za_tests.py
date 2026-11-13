# Adds the South Africa scenarios, expectations and UI block to test_ng.py, and moves the California and US
# regime checkbox indexes up by one (South Africa sits at index 11). Fails if already added.
import sys
sys.path.insert(0, "/home/claude/ng-build/build/za")
from scen_za import SCEN_ZA
try:
    from scen_za_review import SCEN_RV, EXP_RV
except ImportError:
    SCEN_RV, EXP_RV = {}, {}
p = "/home/claude/ng-build/build/test_ng.py"; t = open(p).read()
assert "pn_za_only" not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('page.check("#ng-pn-regimes-12")', 'page.check("#ng-pn-regimes-13")')
rep('page.check("#ng-pn-regimes-11")', 'page.check("#ng-pn-regimes-12")')

scen = "SCEN.update({\n" + "".join(" %s: %s,\n" % (ascii(k), ascii(v)) for k, v in list(SCEN_ZA.items()) + list(SCEN_RV.items())) + "})\n\n"
rep("\nEXPECT = {\n", "\n" + scen + "EXPECT = {\n")

ZAX = ["Additional information under South Africa's POPIA",
       "The Protection of Personal Information Act 4 of 2013 (POPIA) applies to our processing of personal information, and this section is our notice under it (s. 18).",
       "POPIA also protects information about existing companies and other juristic persons, and this section covers it too.",
       "For our processing of personal information under South Africa's Protection of Personal Information Act (POPIA), section ",
       "Our Information Officer: Thandi Nkosi, Chief Executive Officer, privacy@protea.example.co.za; +27 21 000 0000; 4th Floor, 10 Bree Street, Cape Town, 8001."]
REG = "Woodmead North Office Park, 54 Maxwell Drive, Woodmead, Johannesburg, 2191"
exp = {
 "pn_za_only": dict(texts=["Protea Learning (Pty) Ltd Privacy Notice", "1. Who we are and how to contact us", "- Information Officer: Thandi Nkosi, Chief Executive Officer",
                           "- Address: 4th Floor, 10 Bree Street, Cape Town, 8001", "this notice covers it too.",
                           "| Taking payment for courses | Name, billing address, card details | An obligation the law imposes on us: the Tax Administration Act 28 of 2011 (s. 11(1)(c)) |",
                           "Taking payment for courses: required by the Tax Administration Act 28 of 2011.",
                           "Signing you up and running your account: You have to give it. If you do not: we cannot open an account for you.",
                           "Sending you course news and offers: Giving it is voluntary. If you do not: you do not receive course news.",
                           "Fynbos Pay (Pty) Ltd: Processing card payments. Located in Johannesburg.", "We do not transfer personal information to third parties outside South Africa.",
                           "not opting out does not count as consent (s. 69(2); Regulations, reg 6.4)", "To stop direct marketing: use the unsubscribe link in each email, or reply STOP to an SMS.",
                           "we notify the Information Regulator and, where we can identify you, tell you in writing", "(s. 14(4), (5)). The periods are shown in section 2.",
                           "We do not charge for access.", "We tell you in writing what we did, within 30 days (Regulations, reg 3).",
                           "to processing based on legitimate interests or a public law duty. We do not process your personal information on those grounds.",
                           "How to make a request or objection: email our Information Officer at privacy@protea.example.co.za. Requests and objections are free of charge.",
                           "You can also complain to the Information Regulator, in writing on its Form 5 or online", REG, "POPIAComplaints@inforegulator.org.za", "toll free 0800 017 160",
                           "civil proceedings for damages for a breach of POPIA (s. 99)", "is available at www.protea.example.co.za/paia-manual.", "This notice applies from 1 December 2026.",
                           "Every private body needs one"],
                    notexts=["GDPR", "[", "Children", "Automated decisions", "Special personal information", "JD House", "Deputy"],
                    rows={"V01": "ok", "V02": "ok", "V03": "ok", "V04": "check", "V05": "ok", "V06": "na", "V07": "ok", "V08": "ok", "V09": "ok", "V10": "ok", "V11": "check",
                          "V12": "ok", "V13": "ok", "V14": "ok", "V15": "ok", "V16": "ok", "V17": "ok", "V18": "check", "V19": "na", "V20": "check", "V21": "na", "V24": "check",
                          "V25": "check", "L1": "ok", "P21": "ok"},
                    notes=["JD House", "s. 57(1)", "Guidance Note on Direct Marketing, 7.1"]),
 "pn_za_full": dict(texts=["Supporting students with disability: Health information you give us about a disability. We process it with your consent (s. 27(1)(a)).",
                           "Race. We process it because it is essential to identify you, and to comply with laws and other measures",
                           "Reporting on learnerships to the sector education and training authority: required by the Skills Development Act 97 of 1998.",
                           "- Your employer, if it enrols you: Name, work email address, course.", "- Deputy Information Officer: Sipho Dlamini, Head of Legal",
                           "Redwood Cloud Inc. (United States): A binding agreement with the recipient gives the information an adequate level of protection",
                           "Kiwi Support Ltd (Ireland): The recipient is subject to a law that gives the information an adequate level of protection",
                           "Maple Tutors Inc. (Canada): You consent to the transfer (s. 72(1)(b)). You can withdraw that consent. Level of protection there: Canada's PIPEDA",
                           "Baobab Learning Ltd (Kenya): Binding corporate rules within our group", "Protea Learning (Pty) Ltd (Mauritius): It stays within our own organisation",
                           "6. Children", "with the prior consent of a competent person, such as a parent or guardian (s. 35(1)(a)).",
                           "We also send direct marketing by post or in person.", "8. Automated decisions", "The logic: a score from your last three tests",
                           "For the record itself, we can charge the prescribed fee (s. 23(1)(b)(ii))", "Objections and requests for correction or deletion are free of charge.",
                           "Protea Learning (Pty) Ltd (Mauritius): It stays within our own organisation, on our own systems or at our own offices there; no third party receives it. Level of protection there: Mauritius' Data Protection Act 2017 protects it.",
                           "and respond within a reasonable time, and within 30 days.", "If you object or make a request by telephone, we record the call",
                           "to processing based on our legitimate interests or those of a third party, unless legislation provides for that processing.",
                           "The Code of Conduct for the Banking Industry, a code of conduct issued under POPIA, applies to our processing.",
                           "We will ask for your consent first (s. 15(3)(a)).", "untick the option in your account settings, or email privacy@protea.example.co.za.",
                           "Before asking for consent to a transfer, tell people the recipient", "Put a written contract in place with each operator"],
                    notexts=["["],
                    rows={"V05": "check", "V06": "check", "V12": "warn", "V15": "ok", "V16": "ok", "V17": "ok", "V18": "check", "V19": "check", "V21": "check", "V22": "check", "L1": "ok"},
                    notes=["s. 57(1)(d)", "GN 7198", "s. 77(1)(f)", "For Redwood Cloud Inc., Kiwi Support Ltd and Baobab Learning Ltd: the law"]),
 "pn_za_empty": dict(texts=["[Add the purposes for which you process personal information.]", "[Say whether you transfer personal information to third parties outside South Africa (s. 18(1)(g)).]",
                            "[the organisation's address]", "[where to send requests and objections]", "[how to make a complaint to you]", "[Say whether you charge a fee for access.]",
                            "This notice applies from [date]."], notexts=[],
                     rows={"V01": "missing", "V02": "missing", "V03": "missing", "V04": "na", "V05": "na", "V06": "check", "V09": "missing", "V10": "warn", "V11": "missing",
                           "V12": "missing", "V15": "missing", "V17": "na", "V18": "check", "V19": "check", "V20": "missing", "V21": "check"}),
 "pn_za_bad": dict(texts=["[personal information]", "[legal basis]", "[the law] (s. 11(1)(c))", "[the interest] (s. 11(1)(d))", "[how section 32 applies to you]",
                          "[because of the section of POPIA, 28 to 33, that allows it].", "[the authorisation, with its Gazette notice] (s. 27(2))", "required by [the law].",
                          "[Name the sources you collect personal information from (s. 18(1)(a)).]", "[Someone Else Ltd is not our own organisation: choose another basis.]",
                          "[This row names South Africa: list only recipients outside South Africa.]", "[Add Hidden Partner Ltd (Frankfurt, Germany) to the transfers outside South Africa, or correct its location.]",
                          "[Check where Mystery Co (Atlantis) is located. If outside South Africa, add it to the transfers outside South Africa.]", "[how section 35 allows it]",
                          "[Say how section 71(2) allows these decisions.]", "[The code of conduct], a code of conduct issued under POPIA", "[Say how section 15 allows the new purpose.]"],
                   notexts=[],
                   rows={"V01": "missing", "V02": "missing", "V03": "missing", "V04": "missing", "V05": "missing", "V06": "missing", "V07": "missing", "V08": "na", "V09": "missing",
                         "V10": "warn", "V11": "missing", "V12": "missing", "V13": "warn", "V15": "missing", "V16": "ok", "V18": "missing", "V19": "missing", "V20": "missing",
                         "V21": "missing", "V22": "missing"},
                   notes=["Only a public body can rely on a public law duty", "Choose the section, 28 to 33", "a related company is a third party", "names South Africa as the country",
                          "Name the law that protects the information at Sakura Support K.K.", "only after registration (s. 55(2))", "Make each purpose specific"]),
 "pn_za_offshore": dict(texts=["We are not domiciled in South Africa, and process personal information in Ireland and the United States.", "5. Where we process it, and transfers outside South Africa",
                               "Level of protection there (s. 18(1)(g)): The GDPR applies in Ireland; in the United States no general federal privacy law covers it.",
                               "We are not domiciled in South Africa. We process personal information in South Africa, and in Ireland and the United States.",
                               "Located in the United States.", "Protea Learning Ltd (Ireland): It stays within our own organisation"],
                        notexts=["["], rows={"V02": "check", "V12": "check"}, notes=["s. 3(1)(b)(ii)", "not a transfer to a third party"]),
 "pn_za_abroad_missing": dict(texts=["[Redwood Cloud Inc. (Frankfurt) is outside South Africa. Answer Yes under transfers outside South Africa and add it.]"],
                              notexts=["We do not transfer"], rows={"V12": "missing"}),
 "pn_za_unknown": dict(texts=["[Check where Mystery Hosting (Data centre) is located."], notexts=["We do not transfer"], rows={"V12": "missing"}),
 "pn_za_local": dict(texts=["We do not transfer personal information to third parties outside South Africa.", "Located in East London, Eastern Cape.", "Located in Microsoft Azure South Africa North."],
                     notexts=["["], rows={"V12": "ok"}),
 "pn_za_ambiguous": dict(texts=["[Gulf Print Pty Ltd (Adelaide, SA) is outside South Africa.", "[Check where Northern Mail Ltd (Newcastle) and Thames Support Ltd (East London) are located."],
                         notexts=["We do not transfer"], rows={"V12": "missing"}),
 "pn_za_rows_missing": dict(texts=["[Add Kiwi Support Ltd (Ireland) to the transfers outside South Africa, or correct its location.]",
                                   "Redwood Cloud Inc. (United States): A binding agreement"], notexts=[], rows={"V12": "missing"}),
 "pn_za_norecip": dict(texts=["We do not share personal information with anyone, and no operator processes it for us."], notexts=["["], rows={"V11": "ok"}),
 "pn_za_special": dict(texts=["Health information about claims. We process it because section 32 allows it: as a medical scheme, to perform your membership agreement (s. 32(1)(b)(ii)); only people under a duty of confidentiality process it (s. 32(1), (2)).",
                              "Fingerprint templates. We process it because we obtained the information in accordance with the law (s. 33(1)).",
                              "Disability information. We process it under an authorisation the Information Regulator granted us: Information Regulator authorisation, GN 1234 of 1 March 2026 (s. 27(2)).",
                              "Administering medical scheme membership: authorised by the Medical Schemes Act 131 of 1998.", "under an authorisation the Information Regulator granted us (s. 35(2))",
                              "Level of protection there: No general privacy law covers it there."],
                       notexts=["[the"], rows={"V05": "check", "V06": "missing", "V12": "warn", "V18": "warn"}, notes=["GN 7198", "s. 57(1)(d)", "s. 27(2), (3)", "labour legislation (s. 33(2))"]),
 "pn_za_dm_customers": dict(texts=["only if you are our customer, and only about our own similar products or services (s. 69(1)).", "We also send direct marketing by post or in person.",
                                   "- Direct marketing (ss. 11(3)(b), 69)."], notexts=["We ask for your consent only once"], rows={"V18": "check", "V16": "ok"}, notes=["silence is not consent", "Guidance Note on Direct Marketing, 5)"]),
 "pn_za_dm_none": dict(texts=["We do not send direct marketing by electronic communication."], notexts=["Every message tells you", "To stop direct marketing"], rows={"V18": "missing"}, notes=["looks like direct marketing by electronic communication"]),
 "pn_za_dm_consent_li": dict(texts=[], notexts=[], rows={"V18": "warn"}, notes=["should rest on consent"]),
 "pn_za_adm": dict(texts=["A law or code of conduct that sets measures to protect your legitimate interests governs these decisions: [the law or code of conduct] (s. 71(2)(b)).",
                          "If you object or make a request by telephone, we record the call"], notexts=[], rows={"V19": "missing"}),
 "pn_za_adm_conflict": dict(texts=["We use automated systems to make decisions about people: whether you pass a course, from your test scores."], notexts=[], rows={"V19": "warn"}),
 "pn_za_employee": dict(texts=["Paying salaries and managing your employment: required by the Income Tax Act 58 of 1962."], notexts=["Direct marketing", "["],
                        rows={"V18": "na", "V23": "check", "V24": "warn"}, notes=["no exemption for employee records", "labour legislation (s. 33(2))"]),
 "pn_za_applicant": dict(texts=[], notexts=["["], rows={"V23": "check"}, notes=["covers job applicants"]),
 "pn_za_public": dict(texts=["Necessary for the proper performance of our public law duty: running public learnerships (s. 11(1)(e))"], notexts=[], rows={"V02": "warn", "V04": "ok"}, notes=["three official languages"]),
 "pn_za_public_basis": dict(texts=[], notexts=[], rows={"V04": "missing"}, notes=["Only a public body can rely on a public law duty"]),
 "pn_za_further": dict(texts=["The Information Regulator has granted an exemption for it: [the exemption notice] (s. 15(3)(f); s. 37)."], notexts=[], rows={"V22": "missing"}),
 "pn_za_ca_us": dict(texts=["Additional information for California residents", "Additional information for residents of other US states",
                            "Sections 8 and 9 apply to you only where POPIA applies to our processing of your personal information."], notexts=["GDPR"], rows={"V01": "ok", "C01": "ok"}),
 "pn_eu_za": dict(texts=ZAX + ["Sections 7 and 9 apply to you only where the GDPR applies to our processing of your data."], notexts=[], rows={"V02": "ok", "V12": "ok"}),
 "pn_uk_za": dict(texts=ZAX, notexts=[], rows={"V02": "ok", "V12": "ok"}),
 "pn_br_za": dict(texts=ZAX + ["only where the LGPD applies"], notexts=[], rows={"V02": "ok"}),
 "pn_can_za": dict(texts=ZAX + ["only where Canadian law applies"], notexts=[], rows={"V02": "ok"}),
 "pn_in_za": dict(texts=ZAX + ["only where the DPDP Act applies"], notexts=[], rows={"V02": "ok"}),
 "pn_cn_za": dict(texts=ZAX + ["only where the PIPL applies"], notexts=[], rows={"V02": "ok"}),
 "pn_jp_za": dict(texts=ZAX + ["only where the APPI applies"], notexts=[], rows={"V02": "ok"}),
 "pn_kr_za": dict(texts=ZAX + ["only where the PIPA applies"], notexts=[], rows={"V02": "ok", "S01": "ok"}),
 "pn_sg_za": dict(texts=ZAX + ["only where the PDPA applies"], notexts=[], rows={"V02": "ok", "H01": "ok"}),
 "pn_au_za": dict(texts=ZAX + ["Sections 8 and 9 apply to you only where the Privacy Act applies to our processing of your data."], notexts=[], rows={"V02": "ok", "U01": "ok"}),
}
exp.update(EXP_RV)
for k in list(SCEN_ZA) + list(SCEN_RV):
    if k in exp and (SCEN_ZA.get(k) or SCEN_RV.get(k))[1].get("regimes", [""])[0] == "za":
        exp[k]["ph_missing"] = True
    if k in exp:
        exp[k].setdefault("texts", []); exp[k].setdefault("notexts", []); exp[k].setdefault("rows", {})
assert set(exp) == set(SCEN_ZA) | set(SCEN_RV), set(SCEN_ZA) ^ set(exp)
ex = "EXPECT.update({\n" + "".join(" %s: %s,\n" % (ascii(k), ascii(v)) for k, v in exp.items()) + "})\n\n"
rep("\nUSER_TEXT = set()\n", "\n" + ex + "USER_TEXT = set()\n")

ui = '''    # ---- South Africa alone: the POPIA fields replace the GDPR ones; South Africa with the GDPR adds its own section
    page.goto(f"http://127.0.0.1:{PORT}/notice-generators.html#privacy-notice")
    page.reload()
    page.wait_for_function("window.__NG")
    page.check("#ng-pn-regimes-11")
    page.uncheck("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    page.click("#ng-panel-pn [data-add=acts]")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 0 and page.locator("#ng-pn-acts-0-zaBasis").count() == 1 and page.locator("#ng-pn-acts-0-zaSpecial").count() == 1
          and page.locator("#ng-pn-acts-0-zaLaw").count() == 1 and page.locator("#ng-pn-acts-0-required").count() == 0 and page.locator("#ng-pn-acts-0-zaBasisLaw").count() == 0
          and page.locator("#ng-pn-acts-0-zaLawName").count() == 0, "South Africa alone: a section 11 basis, special personal information and a law per purpose instead of a GDPR legal basis")
    check(page.locator("#ng-pn-dpo").count() == 0 and page.locator("#ng-pn-children").count() == 0 and page.locator("#ng-pn-joint").count() == 0
          and page.locator("#ng-pn-zaIo").count() == 1 and page.locator("#ng-pn-zaIoReg").count() == 1 and page.locator("#ng-pn-zaOffWhere").count() == 0 and page.locator("#ng-pn-zaKidsBasis").count() == 0,
          "South Africa alone: Information Officer, no GDPR DPO, children or joint-controller questions")
    page.select_option("#ng-pn-zaScope", "means")
    page.select_option("#ng-pn-acts-0-zaBasis", "law")
    page.select_option("#ng-pn-acts-0-zaLaw", "required")
    page.select_option("#ng-pn-acts-0-zaSpecial", "specific")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-zaOffWhere").count() == 1 and page.locator("#ng-pn-acts-0-zaBasisLaw").count() == 1 and page.locator("#ng-pn-acts-0-zaLawName").count() == 1
          and page.locator("#ng-pn-acts-0-zaSpecialSec").count() == 1 and page.locator("#ng-pn-acts-0-zaSpecialWhy").count() == 1,
          "means in South Africa asks the countries; a law asks its name; a specific section asks which")
    page.select_option("#ng-pn-zaKids", "Yes")
    page.select_option("#ng-pn-zaDm", "Yes")
    page.select_option("#ng-pn-zaAdm", "Yes")
    page.wait_for_timeout(250)
    page.select_option("#ng-pn-zaAdmWhy", "contract_measures")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-zaKidsBasis").count() == 1 and page.locator("#ng-pn-zaDmElec").count() == 1 and page.locator("#ng-pn-zaDmOut").count() == 1
          and page.locator("#ng-pn-zaAdmLogic").count() == 1 and page.locator("#ng-pn-zaAdmLaw").count() == 0, "children, direct marketing and automated decisions ask their details")
    page.select_option("#ng-pn-zaAbroad", "Yes")
    page.wait_for_timeout(250)
    page.click("#ng-panel-pn [data-add=zaXrows]")
    page.wait_for_timeout(250)
    page.select_option("#ng-pn-zaXrows-0-basis", "law")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-zaXrows-0-lawName").count() == 1 and page.locator("#ng-pn-zaXrows-0-protection").count() == 1
          and page.locator("#ng-pn-zaXrows-0-basis option").count() == 9, "a transfer under an adequate law asks the law and offers the eight section 72 options")
    page.select_option("#ng-pn-zaXrows-0-basis", "own")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-zaXrows-0-lawName").count() == 0 and page.locator("#ng-pn-zaXrows-0-protection").count() == 1, "our own offices abroad ask the level of protection there, not a law")
    view = page.inner_text("#ng-panel-pn .ng-view")
    check("Privacy Notice" in view and "Who we are and how to contact us" in view and "Where we process it, and transfers outside South Africa" in view, "South Africa alone: POPIA leads the output")
    page.check("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 1 and page.locator("#ng-pn-acts-0-zaBasis").count() == 1 and page.locator("#ng-pn-joint").count() == 1,
          "GDPR and South Africa: both sets of questions")
    check("Additional information under South Africa's POPIA" in page.inner_text("#ng-panel-pn .ng-view"), "GDPR and South Africa: the South Africa section in the output")
    page.click("#ng-panel-pn [data-act=clear]")

    # ---- tabs and hash
'''
rep("    # ---- tabs and hash\n", ui)
assert all(ord(c) < 128 for c in t)
open(p, "w").write(t)
print("tests: South Africa added", len(SCEN_ZA) + len(SCEN_RV), "scenarios")
