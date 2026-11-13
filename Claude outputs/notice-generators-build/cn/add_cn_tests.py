# Adds the China scenarios, expectations and UI block to test_ng.py, and moves the California and US
# regime checkbox indexes up by one (China sits at index 6). Fails if already added.
import sys
sys.path.insert(0, "/home/claude/ng-build/build/cn")
from scen_cn import SCEN_CN
from scen_cn_review import SCEN_RV
p = "/home/claude/ng-build/build/test_ng.py"; t = open(p).read()
assert "pn_cn_only" not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('page.check("#ng-pn-regimes-7")', 'page.check("#ng-pn-regimes-8")')
rep('page.check("#ng-pn-regimes-6")', 'page.check("#ng-pn-regimes-7")')

scen = "SCEN.update({\n" + "".join(" %r: %r,\n" % (k, v) for k, v in list(SCEN_CN.items()) + list(SCEN_RV.items())) + "})\n\n"
rep("\nEXPECT = {\n", "\n" + scen + "EXPECT = {\n")

CNX = ["Additional information for people in China", "For people in mainland China, the Personal Information Protection Law"]
exp = {
 "pn_cn_only": dict(texts=["we are the personal information processor", "Article 13(1)(2) PIPL", "What happens when the period ends: It is deleted", "Deregistering your account",
                           "Cyberspace Administration of China", "(Article 22)", "We do not refuse to provide products or services"],
                    notexts=["Article 6(1)", "GDPR", "Sensitive personal information", "may not"],
                    rows={"Z01": "ok", "Z02": "ok", "Z03": "na", "Z07": "warn", "Z09": "na", "Z11": "ok", "Z16": "check", "L1": "ok"}),
 "pn_cn_full": dict(texts=["Our designated representative in China for personal information protection matters", "(Article 52)", "Teahouse Rewards Co., Ltd.: contact service@teahouserewards-cn.example",
                           "Lantern Tea Holdings Pte. Ltd. (Singapore)", "To exercise your rights against this recipient", "Your separate consent (Article 13(1)(1) and Article 29 PIPL)",
                           "Children under 14", "lanterntea-cn.example/privacy/children (Articles 28 and 31).", "Turn off Personalised recommendations", "(Article 20)",
                           "We will ask for your consent before we use your personal information for it (Article 14).", "Lantern Tea Wholesale Co., Ltd. We run", "We are based outside mainland China, in Singapore", "Children under 14 can join",
                           "We ask for your separate consent before we provide it.", "You can choose content not based on your personal characteristics, or refuse it"],
                    notexts=["solely by automated decision-making:"], rows={"Z02": "ok", "Z03": "ok", "Z07": "warn", "Z08": "ok", "Z09": "check", "Z12": "ok", "Z13": "ok", "Z15": "ok", "P19": "ok"},
                    notes=["Publish the officer's contact details"]),
 "pn_cn_empty": dict(texts=["[Add the purposes.]"], notexts=[], rows={"Z01": "missing", "Z02": "missing", "Z03": "missing", "Z04": "missing", "Z05": "missing",
                     "Z09": "missing", "Z10": "missing", "Z12": "missing", "Z13": "missing"}),
 "pn_cn_bad": dict(texts=["[the processing methods", "[how people deregister their account]"], notexts=[],
                   rows={"Z02": "warn", "Z03": "missing", "Z04": "missing", "Z05": "missing", "Z06": "missing", "Z07": "missing", "Z08": "missing", "Z09": "missing",
                         "Z10": "missing", "Z11": "missing", "Z12": "missing", "Z13": "missing", "Z15": "missing", "Z16": "warn"},
                   notes=["Human resources management covers employees", "AdNet Ltd, Singapore", "Naming it in the notice is good practice", "Answer for each purpose whether it uses sensitive"]),
 "pn_cn_noconsent": dict(texts=["Social insurance agency: contact 12333", "group payroll", "human resources management"], notexts=["Withdrawing consent", "Deregistering"],
                         rows={"Z07": "warn", "Z08": "ok", "Z09": "check", "Z10": "ok", "Z11": "na"}),
 "pn_cn_profiling": dict(texts=["We automatically analyse and assess your behaviour, interests or circumstances", "5. Automated analysis of your personal information"], notexts=["fair and just"], rows={"Z12": "ok"}),
 "pn_cn_public": dict(texts=[], notexts=[], rows={"Z17": "warn"}),
 "pn_cn_ca_us": dict(texts=["Additional information for California residents", "Additional information for residents of other US states", "only where the PIPL applies"], notexts=[], rows={}),
 "pn_eu_cn": dict(texts=CNX + ["10. Additional information for people in China", "If you are in mainland China, section 10 also applies to you.", "Our dedicated body in China",
                              "only where the GDPR applies", "We are based outside mainland China, in the Netherlands"], notexts=[], rows={"Z01": None, "Z07": "warn", "Z09": "warn", "Z16": "warn"},
                 notes=["Cloud Mail Inc. (United States)", "Another law in this notice treats the data"]),
 "pn_uk_cn": dict(texts=CNX + ["only where the UK GDPR applies"], notexts=[], rows={"Z16": "check"}, uk_only=True),
 "pn_ch_cn": dict(texts=CNX + ["only where the FADP applies", "For the new purpose described in this notice: we will ask for your consent", "We tell you how when we ask for your consent."], notexts=["[how to withdraw]"], rows={"Z11": "warn", "Z15": "ok"}),
 "pn_br_cn": dict(texts=CNX + ["only where the LGPD applies"], notexts=[], rows={"Z11": "ok"}),
 "pn_can_cn": dict(texts=CNX + ["only where Canadian law applies"], notexts=[], rows={}),
 "pn_in_cn": dict(texts=CNX + ["only where the DPDP Act applies", "Additional information for people in China"], notexts=[], rows={"I17": "check"}),
}
CH = ["Additional information for people in China"]
exp.update({
 "rv_cn_norecip": dict(texts=["[List the recipients, including service providers"], notexts=["We do not provide your personal information to other processors"], rows={"Z08": "missing"}),
 "rv_cn_adm_blank": dict(texts=[], notexts=[], rows={"Z12": "missing"}, notes=["Answer whether you make decisions through automated decision-making"]),
 "rv_cn_adm_human": dict(texts=["We make the following decision about you through automated decision-making:"], notexts=["about you solely by automated"], rows={"Z12": "ok"}),
 "rv_cn_abroad_mixed": dict(texts=[], notexts=[], rows={"Z09": "warn"}, notes=["Harbour Cloud Hosting Inc. (United States)", "Pearl Harbour Logistics Ltd (Hong Kong, China)"]),
 "rv_cn_hk_no": dict(texts=[], notexts=[], rows={"Z09": "warn"}, notes=["Kowloon Mail Services Ltd, Hong Kong, China"]),
 "rv_cn_lcfirst": dict(texts=["IT deletes it within 30 days", "SMS reminders", "WeChat messages"], notexts=["iT ", "sMS", "weChat", "cRM"], rows={}),
 "rv_cn_further_only_consent": dict(texts=["Once you consent to the planned new use"], notexts=["[how to withdraw]"], rows={"Z11": "warn"}),
 "rv_cn_kids_school": dict(texts=["Children under 14"], notexts=[], rows={"Z13": "missing"}),
 "rv_cn_joint_recip": dict(texts=[], notexts=[], rows={"Z08": "missing"}),
 "rv_cn_rep_nokind": dict(texts=["Our dedicated body or representative in China"], notexts=["Our representative in China"], rows={"Z02": "warn"}),
 "rv_cn_push_only": dict(texts=["[Say whether you offer content not based on personal characteristics"], notexts=[], rows={"Z12": "missing"}),
 "rv_cn_public": dict(texts=[], notexts=[], rows={"Z09": "warn", "Z17": "warn"}, notes=["State organs store the personal information they process in China"]),
 "rv_eu_cn_adm": dict(texts=CH, notexts=[], rows={"Z09": "missing"}),
 "rv_uk_cn_blank": dict(texts=CH, notexts=[], rows={"Z02": "missing", "Z07": "missing", "Z09": "missing"}),
 "rv_br_cn_sens": dict(texts=CH, notexts=[], rows={"Z07": "missing"}, notes=["Another law in this notice treats the data"]),
 "rv_can_cn_full": dict(texts=CH, notexts=[], rows={}),
 "rv_in_cn_full": dict(texts=CH, notexts=[], rows={}),
 "rv_us_cn": dict(texts=["Additional information for residents of other US states"], notexts=[], rows={}),
 "rv_cn_further_law": dict(texts=["[the law or administrative regulation]"], notexts=[], rows={"Z15": "missing"}),
 "rv_cn_sens_contract": dict(texts=["Sensitive personal information"], notexts=[], rows={"Z07": "ok"}),
 "rv_cn_roles_missing": dict(texts=["[Give the role of Mystery Co"], notexts=[], rows={"Z08": "missing"}),
 "rv_eu_in_cn_ca": dict(texts=["Additional information for people in India", "Additional information for people in China", "Additional information for California residents"], notexts=[], rows={}),
 "rv_cn_xrow_partial": dict(texts=[], notexts=[], rows={"Z09": "missing"}),
 "rv_cn_applicant_hr": dict(texts=["Automated analysis of your personal information"], notexts=[], rows={"Z05": "warn"}, notes=["Applicants are not yet bound"]),
 "rv_cn_fragment": dict(texts=["What happens when the period ends: Deleted or anonymised."], notexts=[], rows={}),
 "rv_cn_offshore_no": dict(texts=["We do not provide it to any other recipient outside mainland China."], notexts=[], rows={"Z09": "missing"}),
 "rv_in_cn_norights": dict(texts=["To exercise these rights, contact us: kirana.example/privacy/requests."], notexts=["[how to exercise rights]"], rows={"Z10": "ok"}),
 "rv_cn_kids_partial": dict(texts=[], notexts=[], rows={"Z13": "missing"}),
 "rv_cn_kids_partial2": dict(texts=[], notexts=[], rows={"Z13": "missing"}),
})
assert set(exp) == set(SCEN_CN) | set(SCEN_RV), (set(SCEN_CN) | set(SCEN_RV)) ^ set(exp)
ex = "EXPECT.update({\n" + "".join(" %r: %r,\n" % (k, v) for k, v in exp.items()) + "})\n\n"
rep("\nUSER_TEXT = set()\n", "\n" + ex + "USER_TEXT = set()\n")

ui = '''    # ---- China alone: the PIPL's fields replace the GDPR ones; China with the GDPR adds its own section
    page.goto(f"http://127.0.0.1:{PORT}/notice-generators.html#privacy-notice")
    page.reload()
    page.wait_for_function("window.__NG")
    page.check("#ng-pn-regimes-6")
    page.uncheck("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    page.click("#ng-panel-pn [data-add=acts]")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 0 and page.locator("#ng-pn-acts-0-cnBasis").count() == 1 and page.locator("#ng-pn-acts-0-required").count() == 0
          and page.locator("#ng-pn-acts-0-cnSensWhy").count() == 0, "China alone: a PIPL ground instead of a GDPR legal basis")
    check(page.locator("#ng-pn-dpo").count() == 0 and page.locator("#ng-pn-cnScope").count() == 1 and page.locator("#ng-pn-rightsContact").count() == 1
          and page.locator("#ng-pn-children").count() == 0 and page.locator("#ng-pn-cnRep").count() == 0, "China alone: scope and rights contact, no GDPR DPO")
    page.select_option("#ng-pn-cnScope", "offer")
    page.select_option("#ng-pn-acts-0-cnBasis", "consent")
    page.select_option("#ng-pn-acts-0-cnSens", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-cnRep").count() == 1 and page.locator("#ng-pn-withdrawHow").count() == 1 and page.locator("#ng-pn-acts-0-cnSensWhy").count() == 1,
          "outside China asks for the representative; consent asks how to withdraw; sensitive asks why")
    page.click("#ng-panel-pn [data-add=recipients]")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-recipients-0-cnContact").count() == 0, "recipient details hidden before the role")
    page.select_option("#ng-pn-recipients-0-role", "controller")
    page.select_option("#ng-pn-cnAbroad", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-recipients-0-cnContact").count() == 1 and page.locator("#ng-pn-recipients-0-cnCons").count() == 1 and page.locator("#ng-panel-pn [data-add=cnXrows]").count() == 1,
          "another processor asks for its contact; overseas recipients get their own list")
    view = page.inner_text("#ng-panel-pn .ng-view")
    check("we are the personal information processor" in view and "Outside mainland China" in view and "Sensitive personal information" in view, "China alone: the PIPL leads the output")
    page.check("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 1 and page.locator("#ng-pn-acts-0-cnBasis").count() == 1, "GDPR and China: both sets of questions")
    check("Additional information for people in China" in page.inner_text("#ng-panel-pn .ng-view"), "GDPR and China: the China section in the output")
    page.click("#ng-panel-pn [data-act=clear]")

    # ---- tabs and hash
'''
rep("    # ---- tabs and hash\n", ui)
assert all(ord(c) < 128 for c in t)
open(p, "w").write(t)
print("test_ng.py: China added")
