# Adds the Singapore scenarios, expectations and UI block to test_ng.py, and moves the California and US
# regime checkbox indexes up by one (Singapore sits at index 9). Fails if already added.
import sys
sys.path.insert(0, "/home/claude/ng-build/build/sg")
from scen_sg import SCEN_SG
try:
    from scen_sg_review import SCEN_RV, EXP_RV
except ImportError:
    SCEN_RV, EXP_RV = {}, {}
p = "/home/claude/ng-build/build/test_ng.py"; t = open(p).read()
assert "pn_sg_only" not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('page.check("#ng-pn-regimes-10")', 'page.check("#ng-pn-regimes-11")')
rep('page.check("#ng-pn-regimes-9")', 'page.check("#ng-pn-regimes-10")')

scen = "SCEN.update({\n" + "".join(" %s: %s,\n" % (ascii(k), ascii(v)) for k, v in list(SCEN_SG.items()) + list(SCEN_RV.items())) + "})\n\n"
rep("\nEXPECT = {\n", "\n" + scen + "EXPECT = {\n")

SGX = ["Additional information under Singapore's PDPA", "The Personal Data Protection Act 2012 (PDPA) applies to personal data we collect, use or disclose in Singapore, whoever it is about", "For personal data we collect, use or disclose in Singapore, section "]
exp = {
 "pn_sg_only": dict(texts=["Merlion Learning Pte. Ltd. Data Protection Policy", "Deemed consent: you give it to us for this purpose (section 15(1))", "Your consent (sections 13 and 14)",
                           "We do not transfer personal data outside Singapore.", "We do not charge for access.", "We do not charge for correction (regulation 7(4)).",
                           "Data protection officer: Tan Mei Ling, Data Protection Officer, dpo@merlion.example.sg, +65 6123 4567",
                           "by giving us reasonable notice: untick course news in your account settings, or use the link in each email.",
                           "Personal Data Protection Commission (www.pdpc.gov.sg)", "Lion Pay Pte. Ltd.: Processing card payments. Located in Singapore.",
                           "We do not disclose your personal data to other organisations for their own purposes.", "This policy applies from 1 January 2027."],
                    notexts=["GDPR", "[", "Children", "NRIC", "legitimate interests", "data portability"],
                    rows={"H01": "ok", "H02": "ok", "H03": "ok", "H04": "ok", "H05": "check", "H06": "na", "H07": "na", "H08": "check", "H09": "check", "H10": "ok", "H11": "ok", "H12": "ok",
                          "H13": "ok", "H14": "ok", "H15": "ok", "H16": "na", "H17": "na", "H20": "check", "H30": "na", "L1": "ok", "P21": "ok"}),
 "pn_sg_full": dict(texts=["Deemed consent by notification (section 15A). To opt out: use the link in our email of 1 March 2027 within 30 days.",
                           "Legitimate interests: keeping our platform and our learners safe (First Schedule, Part 3, paragraph 1)",
                           "Deemed consent: disclosure to other organisations reasonably necessary for a contract with you (section 15(3) to (8))",
                           "Our contact details:", "Post: 10 Anson Road #20-01, Singapore 079903",
                           "Section 8 explains access and correction, section 7 withdrawing consent; section 10 gives our data protection officer.",
                           "If we refuse access, we tell you, with our reasons (section 21(6))", "a failure to do either within a reasonable time, or a fee we charge for access (section 48H)",
                           "Required or authorised by law: Private Education Act 2009 (section 13(b))",
                           "An exception to consent: First Schedule, Part 3, paragraph 4: recovering a debt (section 17)",
                           "the recipient holds a certification under the APEC Cross-Border Privacy Rules (CBPR) System (regulation 12).",
                           "your consent, given after we told you in writing how the data is protected there: Australia's Privacy Act 1988",
                           "Merlion Learning Pte. Ltd. (Malaysia): it stays within our own organisation, on our systems or at our offices there (regulation 9).",
                           "We charge a reasonable fee for access, and only after giving you a written estimate of it (regulation 7).",
                           "For children under 13, we ask a parent or guardian for consent and tell them the purposes. How we obtain it: a parent signs up and confirms by email.",
                           "We collect NRIC numbers or other national identification numbers because the law requires it: the Private Education Act 2009",
                           "We will tell you beforehand and give you a reasonable period to tell us that you do not consent (section 15A).",
                           "For \"Detecting fraud and misuse of accounts\", we rely on the legitimate interests exception", "We transfer personal data outside Singapore. Section 4 gives the details.",
                           "Koala Tutors Pty Ltd: Running the tutoring sessions you book with it. Located in Sydney, Australia.",
                           "check the Do Not Call registers within 21 days before sending", "for children under 13, get the consent of a parent or guardian"],
                    notexts=["[", "GDPR"],
                    rows={"H05": "check", "H06": "check", "H07": "check", "H10": "check", "H14": "ok", "H15": "ok", "H16": "check", "H17": "check", "H18": "check", "H30": "ok", "L1": "ok"},
                    notes=["regulation 15(2)", "regulation 14(2)", "1 January 2027"]),
 "pn_sg_empty": dict(texts=["[Add the purposes for which you collect, use and disclose personal data.]", "[Say whether personal data is transferred outside Singapore.]",
                            "[business email or postal address]", "[where to send requests]", "[how to make a complaint]", "This policy applies from [date]."], notexts=[],
                     rows={"H01": "missing", "H02": "missing", "H03": "missing", "H04": "na", "H08": "missing", "H09": "missing", "H10": "missing", "H13": "na", "H14": "missing", "H15": "missing",
                           "H16": "check", "H17": "check", "H30": "na"}),
 "pn_sg_bad": dict(texts=["[personal data]", "To opt out: [how and by when].", "[the law and section]", "[a reasonable summary of the protection in that country]",
                          "[Add Hidden Partner Ltd (Frankfurt, Germany) to the transfers outside Singapore, or correct its location.]", "[Give the role of Mystery Co",
                          "[Someone Else Ltd is not our own organisation: choose another basis (regulation 9).]",
                          "[Check where Mystery Co (Atlantis) is located. If outside Singapore, add it to the transfers outside Singapore.]"], notexts=[],
                   rows={"H01": "missing", "H02": "missing", "H03": "warn", "H04": "missing", "H05": "missing", "H06": "missing", "H07": "warn", "H08": "missing", "H09": "missing", "H10": "missing",
                         "H11": "warn", "H13": "ok", "H14": "missing", "H15": "ok", "H16": "missing", "H17": "missing"},
                   notes=["regulation 12(2)", "regulation 10(3)(a)", "First Schedule, Part 3, paragraph 1(4)", "is not your own organisation", "covers only entering into, managing or ending employment",
                          "look like sending marketing messages"]),
 "pn_sg_offshore": dict(texts=["We are based outside Singapore. We process the personal data we collect from people in Singapore in Malaysia and the United States.",
                               "3. Where we process it, and transfers outside Singapore", "We are based outside Singapore and process your personal data in Malaysia and the United States. Section 3 gives the details."],
                        notexts=["We do not transfer personal data outside Singapore", "["], rows={"H02": "check", "H10": "check"}, notes=["take advice"]),
 "pn_sg_abroad_missing": dict(texts=["[Redwood Cloud Inc. (Frankfurt) is outside Singapore. Answer Yes under transfers outside Singapore and add it.]"],
                              notexts=["We do not transfer personal data outside Singapore"], rows={"H10": "missing"}),
 "pn_sg_unknown": dict(texts=["[Check where Mystery Hosting (Data centre) is located."], notexts=["We do not transfer personal data outside Singapore"], rows={"H10": "missing"}),
 "pn_sg_rows_missing": dict(texts=["[Add Sakura Support K.K. (Japan) to the transfers outside Singapore, or correct its location.]", "Redwood Cloud Inc. (United States): a contract binds the recipient"],
                            notexts=[], rows={"H10": "missing"}),
 "pn_sg_norecip": dict(texts=["We do not disclose your personal data to other organisations, and no service provider processes it on our behalf."], notexts=["["], rows={"H09": "ok"}),
 "pn_sg_employee": dict(texts=["Reasonable for entering into, managing or ending your employment or appointment (First Schedule, Part 3, paragraph 10)",
                               "because the law requires it: the Income Tax Act 1947, for filing employment income."], notexts=["Withdrawing consent", "["],
                        rows={"H05": "ok", "H13": "na", "H17": "check", "H19": "check"}),
 "pn_sg_public": dict(texts=[], notexts=[], rows={"H02": "warn"}, notes=["section 4(1)(c)"]),
 "pn_sg_ca_us": dict(texts=["Additional information for California residents", "Additional information for residents of other US states",
                            "Sections 6, 7 and 8 apply to you only where the PDPA applies to our handling of your personal data."], notexts=["GDPR"], rows={"H01": "ok", "C01": "ok"}),
 "pn_eu_sg": dict(texts=SGX + ["Sections 7 and 9 apply to you only where the GDPR applies to our processing of your data."], notexts=[], rows={"H02": "ok", "H08": "check", "H10": "ok"}),
 "pn_uk_sg": dict(texts=SGX, notexts=[], rows={"H02": "ok", "H10": "ok"}),
 "pn_br_sg": dict(texts=SGX + ["only where the LGPD applies"], notexts=[], rows={"H02": "ok"}),
 "pn_can_sg": dict(texts=SGX + ["only where Canadian law applies"], notexts=[], rows={"H02": "ok"}),
 "pn_in_sg": dict(texts=SGX + ["only where the DPDP Act applies"], notexts=[], rows={"H02": "ok"}),
 "pn_cn_sg": dict(texts=SGX + ["only where the PIPL applies"], notexts=[], rows={"H02": "ok"}),
 "pn_jp_sg": dict(texts=SGX + ["only where the APPI applies"], notexts=[], rows={"H02": "ok"}),
 "pn_kr_sg": dict(texts=SGX + ["only where the PIPA applies"], notexts=[], rows={"H02": "ok", "S01": "ok"}),
}
exp.update(EXP_RV)
ex = "EXPECT.update({\n" + "".join(" %s: %s,\n" % (ascii(k), ascii(v)) for k, v in exp.items()) + "})\n\n"
rep("\nUSER_TEXT = set()\n", "\n" + ex + "USER_TEXT = set()\n")

ui = '''    # ---- Singapore alone: the PDPA's fields replace the GDPR ones; Singapore with the GDPR adds its own section
    page.goto(f"http://127.0.0.1:{PORT}/notice-generators.html#privacy-notice")
    page.reload()
    page.wait_for_function("window.__NG")
    page.check("#ng-pn-regimes-9")
    page.uncheck("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    page.click("#ng-panel-pn [data-add=acts]")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 0 and page.locator("#ng-pn-acts-0-sgBasis").count() == 1 and page.locator("#ng-pn-acts-0-required").count() == 0
          and page.locator("#ng-pn-acts-0-sgOptOut").count() == 0 and page.locator("#ng-pn-acts-0-sgLi").count() == 0,
          "Singapore alone: a PDPA basis instead of a GDPR legal basis")
    check(page.locator("#ng-pn-dpo").count() == 0 and page.locator("#ng-pn-children").count() == 0 and page.locator("#ng-pn-joint").count() == 0
          and page.locator("#ng-pn-sgDpo").count() == 1 and page.locator("#ng-pn-sgDpoContact").count() == 1 and page.locator("#ng-pn-sgOffWhere").count() == 0,
          "Singapore alone: data protection officer, no GDPR DPO, children or joint-controller questions")
    page.select_option("#ng-pn-sgScope", "abroad")
    page.select_option("#ng-pn-acts-0-sgBasis", "notify")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-sgOffWhere").count() == 1 and page.locator("#ng-pn-acts-0-sgOptOut").count() == 1, "from abroad asks the countries; deemed consent by notification asks how to opt out")
    page.select_option("#ng-pn-acts-0-sgBasis", "li")
    page.select_option("#ng-pn-sgKids", "Yes")
    page.select_option("#ng-pn-sgNric", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-sgLi").count() == 1 and page.locator("#ng-pn-acts-0-sgOptOut").count() == 0 and page.locator("#ng-pn-sgKids13").count() == 1
          and page.locator("#ng-pn-sgNricWhy").count() == 1, "legitimate interests asks the interest; children ask about under 13; NRIC asks why")
    page.select_option("#ng-pn-acts-0-sgBasis", "bip")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-sgCorp").count() == 1 and page.locator("#ng-pn-sgKidsAge").count() == 1, "business improvement asks whether you are a corporation; children ask the age of consent")
    page.select_option("#ng-pn-acts-0-sgBasis", "li")
    page.select_option("#ng-pn-sgAbroad", "Yes")
    page.wait_for_timeout(250)
    page.click("#ng-panel-pn [data-add=sgXrows]")
    page.wait_for_timeout(250)
    page.select_option("#ng-pn-sgXrows-0-basis", "consent")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-sgXrows-0-summary").count() == 1 and page.locator("#ng-pn-sgXrows-0-certKind").count() == 0, "a transfer on consent asks the written summary")
    page.select_option("#ng-pn-sgXrows-0-basis", "cert")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-sgXrows-0-certKind").count() == 1 and page.locator("#ng-pn-sgXrows-0-summary").count() == 0, "a transfer on a certification asks which one")
    page.select_option("#ng-pn-sgXrows-0-basis", "exempt")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-sgXrows-0-lawName").count() == 1, "a transfer under a PDPC exemption asks for the notice")
    view = page.inner_text("#ng-panel-pn .ng-view")
    check("Data Protection Policy" in view and "Data protection officer" in view and "Where we process it, and transfers outside Singapore" in view, "Singapore alone: the PDPA leads the output")
    page.check("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 1 and page.locator("#ng-pn-acts-0-sgBasis").count() == 1 and page.locator("#ng-pn-joint").count() == 1,
          "GDPR and Singapore: both sets of questions")
    check("Additional information for people in Singapore" in page.inner_text("#ng-panel-pn .ng-view"), "GDPR and Singapore: the Singapore section in the output")
    page.click("#ng-panel-pn [data-act=clear]")

    # ---- tabs and hash
'''
rep("    # ---- tabs and hash\n", ui)
assert all(ord(c) < 128 for c in t)
open(p, "w").write(t)
print("tests: Singapore added", len(SCEN_SG) + len(SCEN_RV), "scenarios")
