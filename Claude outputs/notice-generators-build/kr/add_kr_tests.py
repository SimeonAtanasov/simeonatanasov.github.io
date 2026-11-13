# Adds the Korea scenarios, expectations and UI block to test_ng.py, and moves the California and US
# regime checkbox indexes up by one (Korea sits at index 8). Fails if already added.
import sys
sys.path.insert(0, "/home/claude/ng-build/build/kr")
from scen_kr import SCEN_KR
try:
    from scen_kr_review import SCEN_RV
except ImportError:
    SCEN_RV = {}
p = "/home/claude/ng-build/build/test_ng.py"; t = open(p).read()
assert "pn_kr_only" not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('page.check("#ng-pn-regimes-9")', 'page.check("#ng-pn-regimes-10")')
rep('page.check("#ng-pn-regimes-8")', 'page.check("#ng-pn-regimes-9")')

scen = "SCEN.update({\n" + "".join(" %s: %s,\n" % (ascii(k), ascii(v)) for k, v in list(SCEN_KR.items()) + list(SCEN_RV.items())) + "})\n\n"
rep("\nEXPECT = {\n", "\n" + scen + "EXPECT = {\n")

KRX = ["Additional information for people in Korea", "For people in Korea, the Personal Information Protection Act (PIPA) applies"]
exp = {
 "pn_kr_only": dict(texts=["Hanbit Books Co., Ltd. Privacy Policy", "Personal information we process with your consent (Article 15(1)(1))", "If you refuse consent",
                           "Needed to perform a contract with you, or to take steps you ask for while we conclude one (Article 15(1)(4))",
                           "We do not provide, entrust or store your personal information abroad.", "Personal Information Dispute Mediation Committee: 1833-6972, www.kopico.go.kr",
                           "We charge no fee.", "Chief privacy officer: Kim Minji, Executive Director, 02-1234-5678, privacy@hanbit.example.kr",
                           "To withdraw consent: untick event news in My Page, or use the link in each message.", "This policy applies from 1 January 2027.",
                           "Procedure: we select the personal information whose retention period has ended", "4. Transfers abroad",
                           "Personal information we keep because another law requires it, with that law and the period, is shown in section 1"],
                    notexts=["GDPR", "Domestic representative", "Children under 14", "Transmission (Article 35-2)", "Automated decisions (Article 37-2)", "[", "on our behalf under a written agreement"],
                    rows={"S01": "ok", "S02": "ok", "S05": "ok", "S06": "na", "S08": "check", "S09": "na", "S10": "check", "S11": "na", "S14": "na", "S15": "ok", "S16": "na", "S17": "na",
                          "S22": "ok", "S23": "ok", "S24": "check", "S25": "check"}),
 "pn_kr_full": dict(texts=["(sensitive information)", "Recommending books for readers with disabilities: sensitive information, with your separate consent (Article 23(1)(1)).",
                           "check that it was given: a mobile identity check by the parent (Article 22-2(1); Enforcement Decree Article 17-2). To ask for that consent, we collect only", "Where another law requires us to keep it, we store it separately from other personal information (Article 21(1), (3)):",
                           "We provide it with your consent (Article 17(1)(1)).", "We provide it beyond the original purpose, because another law specifically provides for it: Criminal Procedure Act, Article 215 (Article 18(2)(2)).",
                           "personal information provided: the information the warrant names. We provide it",
                           "Cloudnine Inc. (United States): basis: entrusted processing or storage needed for our contract with you",
                           "the Personal Information Protection Commission has recognised the country's protection as equivalent (Article 28-8(1)(5))",
                           "it keeps the information for 13 months", "Transmission (Article 35-2).", "We charge a fee within the actual cost: postage only, when you ask for copies by post",
                           "Main personal information used, and how it relates to the decision:", "Department handling privacy and complaints: Privacy Team",
                           "We process pseudonymised information: we pseudonymise", "You can refuse them: change your browser settings",
                           "A special provision of law, or a legal obligation: Value-Added Tax Act, Article 32 (Article 15(1)(2))", "We transfer personal information abroad. Section 6 gives the details."],
                    notexts=["[", "GDPR"], rows={"S06": "ok", "S09": "warn", "S10": "check", "S11": "check", "S13": "ok", "S14": "warn", "S17": "ok", "S18": "ok", "S19": "ok", "S20": "check", "S21": "ok"},
                    notes=["Enforcement Decree Article 29-10", "Enforcement Decree Article 44-4(1)(4)"]),
 "pn_kr_empty": dict(texts=["[Add the purposes of processing.]", "[name, or the department, with telephone and email]", "[Say where earlier versions are published, with the periods they applied.]",
                            "[List the recipients, including service providers you entrust with processing, or confirm in the Korea section that there are none.]",
                            "[Say whether personal information is provided, entrusted or stored abroad.]", "[the procedure: who selects"], notexts=[],
                     rows={"S01": "missing", "S02": "missing", "S03": "missing", "S08": "missing", "S09": "missing", "S11": "missing", "S12": "missing", "S13": "missing", "S14": "missing", "S15": "missing",
                           "S16": "na", "S17": "missing", "S20": "missing", "S23": "missing", "S24": "warn"}),
 "pn_kr_bad": dict(texts=["[what follows if consent is refused]", "[Choose the basis in Article 15(1) for these purposes, so that they appear in the right table.]", "[say whether it is sensitive information, a unique identifier or a resident registration number, and the basis]",
                          "[AdNet Ltd (Singapore) is located abroad", "[Give the role of Mystery Co", "We provide it [the basis in Article 17(1), 17(4) or 18(2)]."], notexts=[],
                   rows={"S02": "missing", "S04": "missing", "S05": "missing", "S06": "missing", "S07": "warn", "S09": "missing", "S10": "missing", "S11": "missing", "S12": "missing",
                         "S13": "missing", "S14": "missing", "S15": "missing", "S16": "missing", "S17": "missing", "S18": "missing", "S19": "check", "S20": "missing", "S21": "missing", "S23": "missing"},
                   notes=["Article 15(1)(3) is for public institutions only, and you are not one", "Legitimate interests must clearly override", "Mystery Co (Atlantis)", "Name each recipient, not \"etc.\""]),
 "pn_kr_offshore": dict(texts=["We collect personal information directly from people in Korea from outside Korea. It is processed in Singapore (Enforcement Decree Article 31(1)(4)).",
                               "Lion Cloud Pte. Ltd. (Singapore): basis: entrusted processing or storage needed for our contract with you", "Domestic representative", "Address: 45 Sejong-daero, Jung-gu, Seoul 04513",
                               "We are based outside Korea and process your personal information in Singapore, and we transfer it to other parties abroad. Section 4 gives the details."], notexts=[],
                        rows={"S02": "ok", "S10": "ok", "S11": "check", "S16": "ok", "S24": "warn"}, notes=["Enforcement Decree Article 29-10"]),
 "pn_kr_offshore_norep": dict(texts=["Singapore and Japan (Enforcement Decree Article 31(1)(4))", "[Lion Cloud Pte. Ltd. (Singapore), Kaze Mail K.K. (Tokyo, Japan) and Austin Support LLC (Texas, USA) are located abroad",
                                    "also in a country where you process the data"], notexts=["Domestic representative"], rows={"S11": "missing", "S16": "na"},
                              notes=["PIPC drafting guidelines, item 10"]),
 "pn_kr_abroad_missing": dict(texts=["[Cloudnine Inc. (United States) is located abroad"], notexts=[], rows={"S11": "missing"}),
 "pn_kr_abroad_rows": dict(texts=["We transfer personal information abroad. Section 4 gives the details.", "[its name and article]", "Byte Law Co. (Japan)"], notexts=[],
                           rows={"S11": "missing"}, notes=["Byte Law Co. is neither a listed service provider nor your own storage", "The PIPC has recognised the EU and EEA states (Norway, Iceland and Liechtenstein) as equivalent: check Canada."]),
 "pn_kr_further": dict(texts=["Planned new use of your personal information", "Personal information used: order history. How long we keep it for this purpose: 2 years.",
                              "It is reasonably related to the original purpose", "on the criteria in this policy."], notexts=[], rows={"S32": "check", "S21": "ok"}),
 "pn_kr_further_open": dict(texts=["[Say whether you will ask for consent, or rely on Articles 15(3) and 17(4).]", "[the items]"], notexts=[], rows={"S32": "missing"}),
 "pn_kr_ca_us": dict(texts=["9. Additional information for California residents", "10. Additional information for residents of other US states", "only where the PIPA applies"], notexts=[], rows={}),
 "pn_kr_noneed": dict(texts=["We do not provide your personal information to third parties and do not entrust its processing to anyone else."], notexts=["Cookies and automatic collection"],
                      rows={"S09": "na", "S10": "na", "S18": "na"}),
 "pn_eu_kr": dict(texts=KRX + ["10. Additional information for people in Korea", "If you are in Korea, section 10 also applies to you.", "only where the GDPR applies", "This section applies from 1 January 2027."],
                  notexts=[], rows={"S14": "check", "S16": "na"}),
 "pn_uk_kr": dict(texts=KRX + ["only where the UK GDPR applies"], notexts=[], rows={}, uk_only=True),
 "pn_br_kr": dict(texts=KRX + ["only where the LGPD applies"], notexts=[], rows={}),
 "pn_can_kr": dict(texts=KRX + ["only where Canadian law applies"], notexts=[], rows={}),
 "pn_in_kr": dict(texts=KRX + ["only where the DPDP Act applies"], notexts=[], rows={}),
 "pn_cn_kr": dict(texts=KRX + ["only where the PIPL applies"], notexts=[], rows={}),
 "pn_jp_kr": dict(texts=KRX + ["only where the APPI applies", "If you are in Korea, section 8 also applies to you."], notexts=[], rows={}),
 "pn_kr_rrn_ok": dict(texts=["resident registration numbers, as Income Tax Act, Article 160-3 specifically requires or allows (Article 24-2(1)(1))", "(unique identifiers and resident registration numbers)"],
                      notexts=["Earlier versions"], rows={"S06": "ok", "S23": "ok"}),
 "pn_kr_own_storage": dict(texts=["Hanbit Books Co., Ltd. (Japan): basis: storage needed for our contract with you"], notexts=[], rows={"S11": "check"}),
 "pn_eu_kr_sens": dict(texts=KRX, notexts=[], rows={"S06": "missing"}, notes=["Another law in this notice treats the data"]),
}
try:
    from scen_kr_review import EXP_RV
    exp.update(EXP_RV)
except ImportError:
    pass
assert set(exp) == set(SCEN_KR) | set(SCEN_RV), (set(SCEN_KR) | set(SCEN_RV)) ^ set(exp)
ex = "EXPECT.update({\n" + "".join(" %s: %s,\n" % (ascii(k), ascii(v)) for k, v in exp.items()) + "})\n\n"
rep("\nUSER_TEXT = set()\n", "\n" + ex + "USER_TEXT = set()\n")

ui = '''    # ---- Korea alone: the PIPA's fields replace the GDPR ones; Korea with the GDPR adds its own section
    page.goto(f"http://127.0.0.1:{PORT}/notice-generators.html#privacy-notice")
    page.reload()
    page.wait_for_function("window.__NG")
    page.check("#ng-pn-regimes-8")
    page.uncheck("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    page.click("#ng-panel-pn [data-add=acts]")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 0 and page.locator("#ng-pn-acts-0-krBasis").count() == 1 and page.locator("#ng-pn-acts-0-krSens").count() == 1
          and page.locator("#ng-pn-acts-0-required").count() == 0 and page.locator("#ng-pn-acts-0-krRefuse").count() == 0 and page.locator("#ng-pn-acts-0-krSensBasis").count() == 0,
          "Korea alone: a PIPA basis and a sensitive-information question instead of a GDPR legal basis")
    check(page.locator("#ng-pn-dpo").count() == 0 and page.locator("#ng-pn-children").count() == 0 and page.locator("#ng-pn-joint").count() == 0
          and page.locator("#ng-pn-krCpo").count() == 1 and page.locator("#ng-pn-krSecurity").count() == 1 and page.locator("#ng-pn-krOffWhere").count() == 0 and page.locator("#ng-pn-krRep").count() == 0,
          "Korea alone: chief privacy officer and security measures, no GDPR DPO, children or joint-controller questions")
    page.select_option("#ng-pn-krScope", "abroad")
    page.wait_for_timeout(250)
    page.select_option("#ng-pn-krRep", "Yes")
    page.select_option("#ng-pn-acts-0-krBasis", "consent")
    page.select_option("#ng-pn-acts-0-krSens", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-krOffWhere").count() == 1 and page.locator("#ng-pn-krRepNeed").count() == 1 and page.locator("#ng-pn-krRepName").count() == 1 and page.locator("#ng-pn-acts-0-krRefuse").count() == 1
          and page.locator("#ng-pn-acts-0-krSensKinds-2").count() == 1 and page.locator("#ng-pn-acts-0-krSensBasis").count() == 0 and page.locator("#ng-pn-acts-0-krLaw").count() == 0,
          "collecting from abroad asks the countries, the thresholds and the domestic representative; consent asks what follows a refusal; special data asks which kinds")
    page.check("#ng-pn-acts-0-krSensKinds-2")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-krRrnBasis").count() == 1 and page.locator("#ng-pn-acts-0-krSensBasis").count() == 0,
          "resident registration numbers ask their own basis, without consent")
    page.select_option("#ng-pn-acts-0-krBasis", "law")
    page.select_option("#ng-pn-adm", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-krLaw").count() == 1 and page.locator("#ng-pn-admWhat").count() == 1 and page.locator("#ng-pn-admLogic").count() == 0
          and page.locator("#ng-pn-krAdmData").count() == 1 and page.locator("#ng-pn-krAdmHow").count() == 1,
          "a legal basis asks the law; automated decisions ask the Enforcement Decree Article 44-4 items, not the GDPR logic")
    page.click("#ng-panel-pn [data-add=recipients]")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-recipients-0-krProv").count() == 0, "basis hidden before the role")
    page.select_option("#ng-pn-recipients-0-role", "controller")
    page.wait_for_timeout(250)
    page.select_option("#ng-pn-recipients-0-krProv", "collected")
    page.select_option("#ng-pn-krAbroad", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-recipients-0-krItems").count() == 1 and page.locator("#ng-pn-recipients-0-krProvLaw").count() == 1 and page.locator("#ng-panel-pn [data-add=krXrows]").count() == 1
          and page.locator("#ng-pn-recipients-0-krSub").count() == 0,
          "a third party asks the items and the legal basis; transfers abroad get their own list")
    page.select_option("#ng-pn-recipients-0-role", "processor")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-recipients-0-krSub").count() == 1 and page.locator("#ng-pn-recipients-0-krProv").count() == 0, "a service provider asks its sub-processors")
    page.click("#ng-panel-pn [data-add=krXrows]")
    page.wait_for_timeout(250)
    page.select_option("#ng-pn-krXrows-0-basis", "law")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-krXrows-0-lawName").count() == 1 and page.locator("#ng-pn-krXrows-0-certName").count() == 0 and page.locator("#ng-pn-krXrows-0-refuse").count() == 1,
          "a transfer under a law asks for the law; every transfer asks how to refuse it")
    view = page.inner_text("#ng-panel-pn .ng-view")
    check("Privacy Policy" in view and "Chief privacy officer" in view and "Collection from abroad and transfers abroad" in view, "Korea alone: the PIPA leads the output")
    page.check("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 1 and page.locator("#ng-pn-acts-0-krBasis").count() == 1 and page.locator("#ng-pn-joint").count() == 1
          and page.locator("#ng-pn-admLogic").count() == 1, "GDPR and Korea: both sets of questions")
    check("Additional information for people in Korea" in page.inner_text("#ng-panel-pn .ng-view"), "GDPR and Korea: the Korea section in the output")
    page.click("#ng-panel-pn [data-act=clear]")

    # ---- tabs and hash
'''
rep("    # ---- tabs and hash\n", ui)
assert all(ord(c) < 128 for c in t)
open(p, "w").write(t)
print("test_ng.py: Korea added")
