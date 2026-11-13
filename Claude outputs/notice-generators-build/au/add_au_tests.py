# Adds the Australia scenarios, expectations and UI block to test_ng.py, and moves the California and US
# regime checkbox indexes up by one (Australia sits at index 10). Fails if already added.
import sys
sys.path.insert(0, "/home/claude/ng-build/build/au")
from scen_au import SCEN_AU
try:
    from scen_au_review import SCEN_RV, EXP_RV
except ImportError:
    SCEN_RV, EXP_RV = {}, {}
p = "/home/claude/ng-build/build/test_ng.py"; t = open(p).read()
assert "pn_au_only" not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('page.check("#ng-pn-regimes-11")', 'page.check("#ng-pn-regimes-12")')
rep('page.check("#ng-pn-regimes-10")', 'page.check("#ng-pn-regimes-11")')

scen = "SCEN.update({\n" + "".join(" %s: %s,\n" % (ascii(k), ascii(v)) for k, v in list(SCEN_AU.items()) + list(SCEN_RV.items())) + "})\n\n"
rep("\nEXPECT = {\n", "\n" + scen + "EXPECT = {\n")

AUX = ["Additional information under Australia's Privacy Act", "The Privacy Act 1988 and the Australian Privacy Principles (APPs) apply to our handling of personal information, and this section is our privacy policy under them.",
       "For our handling of personal information under Australia's Privacy Act 1988, section ", "Our privacy contact: Privacy Officer, privacy@wattle.example.com.au; +61 2 9000 0000; PO Box 123, Sydney NSW 2001."]
exp = {
 "pn_au_only": dict(texts=["Wattle Learning Pty Ltd Privacy Policy", "1. Who we are and how to contact us", "- Privacy contact: Privacy Officer", "- Post: PO Box 123, Sydney NSW 2001",
                           "Taking payment for courses: required by the Taxation Administration Act 1953.", "Signing you up and running your account: We cannot open an account for you.",
                           "How we hold it: in electronic records on cloud systems in Australia, and in paper files at our Sydney office.",
                           "You can deal with us without identifying yourself, or by using a pseudonym: for general enquiries by phone or email (APP 2).",
                           "Banksia Pay Pty Ltd: Processing card payments. Located in Melbourne.", "We are not likely to disclose personal information to recipients outside Australia.",
                           "How: use the unsubscribe link in each email.", "(APP 7.6, 7.7)", "We do not charge for access.", "(APP 11.2). The periods are shown in section 2.",
                           "Make requests as follows: email our Privacy Officer at privacy@wattle.example.com.au.",
                           "complain to us first, in writing: email our Privacy Officer at privacy@wattle.example.com.au. How we deal with complaints: we acknowledge it within 5 business days",
                           "You can complain to the Office of the Australian Information Commissioner (OAIC)", "www.oaic.gov.au, telephone 1300 363 992", "This policy applies from 1 December 2026."],
                    notexts=["GDPR", "[", "Children", "Withdrawing consent", "Automated decisions", "Sensitive information", "recognised external dispute resolution"],
                    rows={"U01": "ok", "U02": "ok", "U03": "ok", "U04": "check", "U05": "ok", "U06": "ok", "U07": "check", "U08": "ok", "U09": "check", "U10": "ok", "U11": "ok", "U12": "ok",
                          "U13": "ok", "U14": "ok", "U15": "check", "U16": "ok", "U17": "na", "U18": "na", "U19": "na", "U21": "na", "U23": "check", "L1": "ok", "P21": "ok"},
                    notes=["APP 1.7 covers"]),
 "pn_au_full": dict(texts=["Supporting students with disability: with your consent (APP 3.3(a)).",
                           "Detecting fraud and misuse of accounts: we collect it without your consent only where a permitted general situation exists, that is where we have reason to suspect unlawful activity",
                           "Verifying your identity for government-funded courses: required by the Student Identifiers Act 2014.",
                           "How we collect it: through our website forms and app, by phone, and through cookies on our website.", "- Your employer, if it enrols you: Name, work email address, course.",
                           "4. Automated decisions", "Kinds of decisions made solely by a computer program: Whether you move up automatically to the next course level.",
                           "Kinds of decisions where a computer program does a thing substantially and directly related to making them: Scholarship decisions",
                           "We are likely to disclose personal information to recipients in the United States, New Zealand and Canada, as follows:",
                           "Kiwi Support Ltd (New Zealand): we reasonably believe the recipient is bound by a law or binding scheme",
                           "Maple Tutors Inc. (Canada): we rely on your consent, given after we told you expressly that if you consent, APP 8.1 will not apply",
                           "We also hold personal information outside Australia without disclosing it:", "These service providers only store personal information for us",
                           "Bluegum Backup Ltd (Ireland): a service provider only stores the information for us", "Wattle Learning Pty Ltd (Singapore): it stays within our own organisation",
                           "and to help other organisations with their direct marketing", "9. Withdrawing consent", "untick the option in your account settings, or email privacy@wattle.example.com.au.",
                           "we treat people aged 15 or over as able to consent", "How we ask a parent or guardian: a parent signs up and confirms by email.",
                           "We charge for giving access; the charge is not excessive, and there is no charge for making the request (APP 12.8).", "We respond within a reasonable period, and within 30 days",
                           "or the Privacy (Market and Social Research) Code 2021, a registered APP code that binds us", "email our Head of Privacy at privacy@wattle.example.com.au",
                           "you can complain to the Australian Financial Complaints Authority (AFCA), a recognised external dispute resolution scheme we are a member of.",
                           "You can also complain to the Office of the Australian Information Commissioner (OAIC)", "We will ask for your consent first (APP 6.1(a)).",
                           "Before asking for consent to an overseas disclosure, tell people expressly", "Commercial electronic messages"],
                    notexts=["[", "GDPR"],
                    rows={"U05": "check", "U10": "check", "U13": "ok", "U14": "ok", "U17": "check", "U18": "ok", "U19": "check", "U20": "check", "U21": "ok", "L1": "ok"},
                    notes=["s. 16C", "APP Guidelines 8.14", "Children's Online Privacy Code"]),
 "pn_au_empty": dict(texts=["[Add the purposes for which you collect, hold, use and disclose personal information.]", "[Say whether personal information goes to recipients outside Australia.]",
                            "[an email address or postal address]", "[where to send requests]", "[how to make a complaint]", "This policy applies from [date]."], notexts=[],
                     rows={"U01": "missing", "U02": "missing", "U03": "missing", "U04": "missing", "U05": "na", "U08": "missing", "U09": "missing", "U10": "missing", "U13": "missing",
                           "U14": "missing", "U15": "check", "U16": "check", "U17": "missing", "U19": "check", "U21": "na"}),
 "pn_au_bad": dict(texts=["[personal information]", "[the law or order] (APP 3.4(a))", "[the situation in section 16A]", "[the situation in section 16B]", "required by [the law, or the details of the order].",
                          "[Name the sources you collect personal information from, or their types (APP 5.2(b)).]", "How we hold it: [how you hold personal information",
                          "[No country or binding scheme is prescribed by the regulations for APP 8.3 yet: choose another basis.]", "[the situation: item 1, 2 or 3 of section 16A]",
                          "[Someone Else Ltd is not our own organisation: choose another basis.]", "[This row names Australia: list only recipients outside Australia.]",
                          "[Add Hidden Partner Ltd (Frankfurt, Germany) to the overseas recipients, or correct its location.]",
                          "[Check where Mystery Co (Atlantis) is located. If outside Australia, add it to the overseas recipients.]", "or [the registered APP code], a registered APP code",
                          "[Say whether you charge for giving access.]", "[how you deal with complaints, and in what time]"], notexts=[],
                   rows={"U01": "missing", "U02": "missing", "U03": "missing", "U04": "missing", "U05": "missing", "U06": "missing", "U07": "na", "U08": "missing", "U09": "missing",
                         "U10": "missing", "U11": "warn", "U13": "missing", "U14": "missing", "U15": "missing", "U16": "check", "U17": "missing", "U18": "missing", "U19": "check", "U20": "missing"},
                   notes=["Privacy Regulations 2025", "items 1 to 3 of s. 16A", "a related company is an overseas recipient", "names Australia as the country", "choose another basis for Sakura Support K.K. "]),
 "pn_au_offshore": dict(texts=["We are based outside Australia, and hold and process personal information in Ireland and the United States.", "5. Where we hold it, and overseas recipients",
                               "We are likely to disclose personal information to recipients in the United States, as follows:", "Wattle Learning Ltd (Ireland): it stays within our own organisation"],
                        notexts=["["], rows={"U02": "check", "U10": "check"}, notes=["s. 5B(1A), (3)", "not a disclosure"]),
 "pn_au_abroad_missing": dict(texts=["[Redwood Cloud Inc. (Frankfurt) is outside Australia. Answer Yes under overseas recipients and add it.]"],
                              notexts=["We are not likely to disclose"], rows={"U10": "missing"}),
 "pn_au_unknown": dict(texts=["[Check where Mystery Hosting (Data centre) is located."], notexts=["We are not likely to disclose"], rows={"U10": "missing"}),
 "pn_au_perth": dict(texts=["We are not likely to disclose personal information to recipients outside Australia.", "Located in Perth WA 6000."], notexts=["["], rows={"U10": "ok"}),
 "pn_au_seattle": dict(texts=["[Cascade Mail Inc. (Seattle, WA) is outside Australia."], notexts=["We are not likely to disclose"], rows={"U10": "missing"}),
 "pn_au_rows_missing": dict(texts=["[Add Kiwi Support Ltd (New Zealand) to the overseas recipients, or correct its location.]", "Redwood Cloud Inc. (United States): before disclosing it"],
                            notexts=[], rows={"U10": "missing"}),
 "pn_au_norecip": dict(texts=["We do not disclose personal information to other organisations or people, and no service provider handles it for us."], notexts=["["], rows={"U09": "ok"}),
 "pn_au_small": dict(texts=["so the Australian Privacy Principles (APPs) do not bind us. We follow them voluntarily", "and you can complain to us. Section"], notexts=["OAIC"], rows={"U02": "warn", "U14": "check"}, notes=["s. 6EA", "small business operator"]),
 "pn_au_aml": dict(texts=[], notexts=[], rows={"U02": "check"}, notes=["s. 6E(1A)"]),
 "pn_au_employee": dict(texts=["Paying salaries and managing your employment: required by the Taxation Administration Act 1953.", "is exempt from the Australian Privacy Principles (Privacy Act, s. 7B(3))"],
                        notexts=["Direct marketing", "["], rows={"U15": "na", "U22": "warn"}, notes=["s. 7B(3)", "contractors", "Privacy (Tax File Number) Rule 2015"]),
 "pn_au_applicant": dict(texts=[], notexts=["["], rows={"U22": "check"}, notes=["does not cover job applicants"]),
 "pn_au_public": dict(texts=[], notexts=[], rows={"U02": "warn"}, notes=["Information Publication Scheme"]),
 "pn_au_adm_after": dict(texts=["This policy applies from 15 December 2026."], notexts=[], rows={"U17": "missing"}),
 "pn_au_adm_conflict": dict(texts=["We use automated systems to make decisions about people: whether you pass a course, from your test scores."], notexts=[], rows={"U17": "warn"}),
 "pn_au_ca_us": dict(texts=["Additional information for California residents", "Additional information for residents of other US states",
                            "Sections 8 and 9 apply to you only where the Privacy Act applies to our handling of your personal information."], notexts=["GDPR"], rows={"U01": "ok", "C01": "ok"}),
 "pn_eu_au": dict(texts=AUX + ["Sections 7 and 9 apply to you only where the GDPR applies to our processing of your data."], notexts=[], rows={"U02": "ok", "U10": "ok"}),
 "pn_uk_au": dict(texts=AUX, notexts=[], rows={"U02": "ok", "U10": "ok"}),
 "pn_br_au": dict(texts=AUX + ["only where the LGPD applies"], notexts=[], rows={"U02": "ok"}),
 "pn_can_au": dict(texts=AUX + ["only where Canadian law applies"], notexts=[], rows={"U02": "ok"}),
 "pn_in_au": dict(texts=AUX + ["only where the DPDP Act applies"], notexts=[], rows={"U02": "ok"}),
 "pn_cn_au": dict(texts=AUX + ["only where the PIPL applies"], notexts=[], rows={"U02": "ok"}),
 "pn_jp_au": dict(texts=AUX + ["only where the APPI applies"], notexts=[], rows={"U02": "ok"}),
 "pn_kr_au": dict(texts=AUX + ["only where the PIPA applies"], notexts=[], rows={"U02": "ok", "S01": "ok"}),
 "pn_sg_au": dict(texts=AUX + ["only where the PDPA applies"], notexts=[], rows={"U02": "ok", "H01": "ok"}),
}
exp.update(EXP_RV)
for k in list(SCEN_AU) + list(SCEN_RV):
    if k in exp and (SCEN_AU.get(k) or SCEN_RV.get(k))[1].get("regimes", [""])[0] == "au":
        exp[k]["ph_missing"] = True
    if k in exp:
        exp[k].setdefault("texts", []); exp[k].setdefault("notexts", []); exp[k].setdefault("rows", {})
ex = "EXPECT.update({\n" + "".join(" %s: %s,\n" % (ascii(k), ascii(v)) for k, v in exp.items()) + "})\n\n"
rep("\nUSER_TEXT = set()\n", "\n" + ex + "USER_TEXT = set()\n")

ui = '''    # ---- Australia alone: the APP fields replace the GDPR ones; Australia with the GDPR adds its own section
    page.goto(f"http://127.0.0.1:{PORT}/notice-generators.html#privacy-notice")
    page.reload()
    page.wait_for_function("window.__NG")
    page.check("#ng-pn-regimes-10")
    page.uncheck("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    page.click("#ng-panel-pn [data-add=acts]")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 0 and page.locator("#ng-pn-acts-0-auSens").count() == 1 and page.locator("#ng-pn-acts-0-auLaw").count() == 1
          and page.locator("#ng-pn-acts-0-required").count() == 0 and page.locator("#ng-pn-acts-0-auSensLaw").count() == 0 and page.locator("#ng-pn-acts-0-auLawName").count() == 0,
          "Australia alone: sensitive information and a law per purpose instead of a GDPR legal basis")
    check(page.locator("#ng-pn-dpo").count() == 0 and page.locator("#ng-pn-children").count() == 0 and page.locator("#ng-pn-joint").count() == 0
          and page.locator("#ng-pn-auPo").count() == 1 and page.locator("#ng-pn-auHold").count() == 1 and page.locator("#ng-pn-auOffWhere").count() == 0 and page.locator("#ng-pn-auSbWhy").count() == 0,
          "Australia alone: privacy contact and how information is held, no GDPR DPO, children or joint-controller questions")
    page.select_option("#ng-pn-auScope", "abroad")
    page.select_option("#ng-pn-auSb", "under")
    page.select_option("#ng-pn-acts-0-auSens", "law")
    page.select_option("#ng-pn-acts-0-auLaw", "required")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-auOffWhere").count() == 1 and page.locator("#ng-pn-auSbWhy").count() == 1 and page.locator("#ng-pn-acts-0-auSensLaw").count() == 1
          and page.locator("#ng-pn-acts-0-auLawName").count() == 1, "from abroad asks the countries; small business asks the exception; a law asks its name")
    page.select_option("#ng-pn-acts-0-auSens", "pgs")
    page.select_option("#ng-pn-auAdm", "Yes")
    page.select_option("#ng-pn-auDm", "Yes")
    page.select_option("#ng-pn-auEdr", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-auSensPgs").count() == 1 and page.locator("#ng-pn-acts-0-auSensLaw").count() == 0 and page.locator("#ng-pn-auAdmData").count() == 1
          and page.locator("#ng-pn-auDmOut").count() == 1 and page.locator("#ng-pn-auEdrName").count() == 1, "permitted general situation, computer programs, direct marketing and the EDR scheme ask their details")
    page.select_option("#ng-pn-auAbroad", "Yes")
    page.wait_for_timeout(250)
    page.click("#ng-panel-pn [data-add=auXrows]")
    page.wait_for_timeout(250)
    page.select_option("#ng-pn-auXrows-0-basis", "similar")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-auXrows-0-lawName").count() == 1 and page.locator("#ng-pn-auXrows-0-pgs").count() == 0, "an overseas recipient under a similar law asks the law")
    page.select_option("#ng-pn-auXrows-0-basis", "pgs")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-auXrows-0-pgs").count() == 1 and page.locator("#ng-pn-auXrows-0-lawName").count() == 0
          and page.locator("#ng-pn-auXrows-0-pgs option").count() == 4, "a permitted general situation offers items 1 to 3 only")
    view = page.inner_text("#ng-panel-pn .ng-view")
    check("Privacy Policy" in view and "Who we are and how to contact us" in view and "Where we hold it, and overseas recipients" in view, "Australia alone: the Privacy Act leads the output")
    page.check("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 1 and page.locator("#ng-pn-acts-0-auSens").count() == 1 and page.locator("#ng-pn-joint").count() == 1,
          "GDPR and Australia: both sets of questions")
    check("Additional information under Australia's Privacy Act" in page.inner_text("#ng-panel-pn .ng-view"), "GDPR and Australia: the Australia section in the output")
    page.click("#ng-panel-pn [data-act=clear]")

    # ---- tabs and hash
'''
rep("    # ---- tabs and hash\n", ui)
rep("""        if ex.get("banner"):\n""", """        if ex.get("ph_missing") and "[" in txt:\n            check(any(st == "missing" for st in rows.values()), f"{name}: a placeholder comes with a missing row")\n        if ex.get("banner"):\n""")
assert all(ord(c) < 128 for c in t)
open(p, "w").write(t)
print("tests: Australia added", len(SCEN_AU) + len(SCEN_RV), "scenarios")
