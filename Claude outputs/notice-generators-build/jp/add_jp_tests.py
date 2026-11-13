# Adds the Japan scenarios, expectations and UI block to test_ng.py, and moves the California and US
# regime checkbox indexes up by one (Japan sits at index 7). Fails if already added.
import sys
sys.path.insert(0, "/home/claude/ng-build/build/jp")
from scen_jp import SCEN_JP
try:
    from scen_jp_review import SCEN_RV
except ImportError:
    SCEN_RV = {}
p = "/home/claude/ng-build/build/test_ng.py"; t = open(p).read()
assert "pn_jp_only" not in t
def rep(old, new, c=1):
    global t
    n = t.count(old); assert n == c, (n, old[:100]); t = t.replace(old, new)

rep('page.check("#ng-pn-regimes-8")', 'page.check("#ng-pn-regimes-9")')
rep('page.check("#ng-pn-regimes-7")', 'page.check("#ng-pn-regimes-8")')

scen = "SCEN.update({\n" + "".join(" %r: %r,\n" % (k, v) for k, v in list(SCEN_JP.items()) + list(SCEN_RV.items())) + "})\n\n"
rep("\nEXPECT = {\n", "\n" + scen + "EXPECT = {\n")

JPX = ["Additional information for people in Japan", "For people in Japan, the Act on the Protection of Personal Information (APPI) applies"]
exp = {
 "pn_jp_only": dict(texts=["Person who represents the company: Hanako Sato, Representative Director (Article 32(1)(i)).", "Purposes of use", "Kuroneko Delivery Co., Ltd. (delivering your orders)",
                           "We do not provide your personal data to third parties in foreign countries.", "(Article 40; Cabinet Order Article 10(ii))", "We charge no fee.",
                           "(Articles 32(3), 33(3), 34(3), 35(7) and 36)", "of providing it to third parties and of receiving it from them"],
                    notexts=["GDPR", "Special care-required", "Ltd (", "Joint use", "Representative: "], rows={"T01": "ok", "T02": "ok", "T05": "na", "T06": "ok", "T07": "na", "T09": "na", "T11": "ok", "T13": "na", "T16": "check", "T18": "check", "T25": "na", "T26": "na", "L1": "ok"}),
 "pn_jp_full": dict(texts=["With your prior consent (Article 20(2)).", "Joint use (Article 27(5)(iii))", "Responsible for managing the data:", "Sakura Tea Asia Pte. Ltd. (Singapore): we ask for your consent first.",
                           "Tea Partners GmbH (Germany): a country the Personal Information Protection Commission has designated", "and the recipient is subject to the GDPR (Article 28(1); Rules Article 15; PPC Notice No. 1 of 2019)",
                           "1,000 yen per request (Article 38).", "through a contract or other arrangement with us",
                           "Mailwave K.K. (sending our emails) and Cloudbox Inc. (hosting our order system). We supervise them",
                           "We also entrust the handling of personal data to Sakura Tea Asia Pte. Ltd. (customer service for orders from abroad)", "It is a third party in a foreign country: section 6 explains the basis (Article 28).",
                           "Where a recipient is in a designated country or has an equivalent system, we provide personal data to it on the basis given in section 5 (Article 27).",
                           "Japan Retail Privacy Association, an accredited personal information protection organisation", "It is reasonably related to our original purposes",
                           "We provide it as a law requires or permits (Article 27(1)(i)).", "We analyse your purchase history"],
                    notexts=[], rows={"T03": "check", "T05": "ok", "T06": "ok", "T07": "check", "T09": "check", "T10": "check", "T13": "ok", "T14": "check", "T17": "warn"}, notes=["Cabinet Order Article 12(iv)", "Guidelines 2-16"]),
 "pn_jp_empty": dict(texts=["[Add the purposes of use.]", "[name of the person who represents the company]"], notexts=[], rows={"T01": "missing", "T02": "missing", "T03": "missing", "T06": "missing", "T09": "missing", "T10": "missing", "T11": "missing", "T12": "missing", "T13": "missing", "T15": "na", "T25": "missing", "T26": "missing"}),
 "pn_jp_bad": dict(texts=["Provision to third parties unless you ask us to stop (Article 27(2))", "[Give the role of Mystery Co", "[AdNet Ltd (Singapore) is a third party in a foreign country",
                          "We never provide special care-required personal information this way, nor personal data we received from another business under this scheme."],
                   notexts=["We do not provide your personal data to third parties in foreign countries", "This does not apply to special care-required"],
                   rows={"T01": "missing", "T03": "missing", "T05": "missing", "T06": "missing", "T08": "missing", "T09": "missing", "T10": "missing", "T11": "warn", "T12": "missing", "T13": "missing", "T14": "missing", "T16": "warn"},
                   notes=["AdNet Ltd (Singapore)", "PPC guidelines is not enough", "acquired in breach of Article 20(1)", "\"To personalise services\""]),
 "pn_jp_offshore": dict(texts=["We are based outside Japan, in Singapore, and handle your personal information there", "We do not provide it to any other third party in a foreign country.",
                               "Lotus Apps Pte. Ltd., 1 Marina Way, Singapore 018989. Person who represents"], notexts=["018989, Singapore"], rows={"T01": "ok", "T02": "ok", "T11": "ok"}),
 "pn_jp_public": dict(texts=[], notexts=[], rows={"T19": "warn"}, notes=["Legal persons in Annex 2", "(Article 58)"]),
 "pn_jp_more": dict(texts=["Representative or administrator of the association: Ichiro Suzuki, Chair (Article 32(1)(i)).", "We ask for your consent before we receive it (Article 31(1)(i)).",
                           "Analysing which teas sell together (Article 41(4)).", "Age band, prefecture, teas bought (Article 43(3)).", "sent as a file to tea growers (Article 43(4)).",
                           "500 yen. How to pay it: by bank transfer before we reply (Article 38).",
                           "Mekong Support Co. (country not yet identified): we ask for your consent first. We cannot yet identify the country, because we are still choosing the provider (Rules Article 17(3)).",
                           "To help you judge the provision: The provider will be in Viet Nam or Thailand.", "because the contract is not yet signed (Article 28(2); Rules Article 17(4)).",
                           "It is a third party in a foreign country: section 4 explains the basis (Article 28)."],
                    notexts=["Person who represents the company", "[country]"], rows={"T01": "ok", "T06": "ok", "T09": "check", "T10": "ok", "T25": "ok", "T26": "check"}),
 "pn_jp_offshore_rel": dict(texts=["Lotus Apps Pte. Ltd., 1 Marina Way, 018989, Singapore.", "As we are outside Japan, we first tell you about the system for protecting personal information in Singapore and the measures we take (Article 31(1)(ii); Rules Article 17)."],
                            notexts=[], rows={"T01": "ok", "T25": "ok"}, notes=["Article 31(1)(ii)"]),
 "pn_jp_ca_us": dict(texts=["Additional information for California residents", "Additional information for residents of other US states", "only where the APPI applies"], notexts=[], rows={}),
 "pn_eu_jp": dict(texts=JPX + ["10. Additional information for people in Japan", "If you are in Japan, section 10 also applies to you.", "only where the GDPR applies", "We are based outside Japan, in the Netherlands",
                               "Example Advisory B.V., Herengracht 1, Amsterdam, the Netherlands. Person who represents the company: Jan de Vries, Managing Director (Article 32(1)(i))."],
                  notexts=[], rows={"T01": "ok", "T05": "warn", "T09": "check", "T16": "warn"}),
 "pn_uk_jp": dict(texts=JPX + ["only where the UK GDPR applies", "Example Ltd, 1 High Street, London, the United Kingdom."], notexts=[], rows={"T01": "ok", "T16": "check"}, uk_only=True),
 "pn_cn_jp": dict(texts=JPX + ["only where the PIPL applies", "88 Huaihai Road, Shanghai 200021, mainland China."], notexts=[], rows={"T11": "ok"}),
 "pn_br_jp": dict(texts=JPX + ["only where the LGPD applies", "Av. Paulista 1000, Sao Paulo, Brazil."], notexts=[], rows={}),
}
try:
    from scen_jp_review import EXP_RV
    exp.update(EXP_RV)
except ImportError:
    pass
assert set(exp) == set(SCEN_JP) | set(SCEN_RV), (set(SCEN_JP) | set(SCEN_RV)) ^ set(exp)
ex = "EXPECT.update({\n" + "".join(" %r: %r,\n" % (k, v) for k, v in exp.items()) + "})\n\n"
rep("\nUSER_TEXT = set()\n", "\n" + ex + "USER_TEXT = set()\n")

ui = '''    # ---- Japan alone: the APPI's fields replace the GDPR ones; Japan with the GDPR adds its own section
    page.goto(f"http://127.0.0.1:{PORT}/notice-generators.html#privacy-notice")
    page.reload()
    page.wait_for_function("window.__NG")
    page.check("#ng-pn-regimes-7")
    page.uncheck("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    page.click("#ng-panel-pn [data-add=acts]")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 0 and page.locator("#ng-pn-acts-0-jpSens").count() == 1 and page.locator("#ng-pn-acts-0-required").count() == 0
          and page.locator("#ng-pn-acts-0-jpSensG").count() == 0, "Japan alone: a special care-required question instead of a GDPR legal basis")
    check(page.locator("#ng-pn-dpo").count() == 0 and page.locator("#ng-pn-jpRepName").count() == 1 and page.locator("#ng-pn-jpSecurity").count() == 1
          and page.locator("#ng-pn-children").count() == 0 and page.locator("#ng-pn-jpOffWhere").count() == 0, "Japan alone: representative and security measures, no GDPR DPO")
    page.select_option("#ng-pn-jpScope", "abroad")
    page.select_option("#ng-pn-acts-0-jpSens", "Yes")
    page.select_option("#ng-pn-jpFee", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-jpOffWhere").count() == 1 and page.locator("#ng-pn-acts-0-jpSensG").count() == 1 and page.locator("#ng-pn-jpFeeAmount").count() == 1,
          "outside Japan asks where; special care-required asks the ground; a fee asks the amount")
    page.select_option("#ng-pn-jpKind", "indiv")
    page.select_option("#ng-pn-adm", "Yes")
    page.select_option("#ng-pn-jpRelIn", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-jpRepName").count() == 0 and page.locator("#ng-pn-admWhat").count() == 1 and page.locator("#ng-pn-admLogic").count() == 0
          and page.locator("#ng-pn-joint").count() == 0 and page.locator("#ng-pn-jpRelWhat").count() == 1 and page.locator("#ng-pn-jpFeeHow").count() == 1,
          "Japan alone: no representative for an individual; no GDPR logic or joint-controller questions; Article 31 and the fee payment asked")
    page.click("#ng-panel-pn [data-add=recipients]")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-recipients-0-jpProv").count() == 0, "basis hidden before the role")
    page.select_option("#ng-pn-recipients-0-role", "joint")
    page.wait_for_timeout(250)
    page.select_option("#ng-pn-recipients-0-jpProv", "joint")
    page.select_option("#ng-pn-jpAbroad", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-jpJointItems").count() == 1 and page.locator("#ng-panel-pn [data-add=jpXrows]").count() == 1,
          "joint use asks for its items; third parties abroad get their own list")
    page.click("#ng-panel-pn [data-add=jpXrows]")
    page.wait_for_timeout(250)
    page.select_option("#ng-pn-jpXrows-0-basis", "consent")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-jpXrows-0-noCountry").count() == 1 and page.locator("#ng-pn-jpXrows-0-system").count() == 1 and page.locator("#ng-pn-jpXrows-0-noCountryWhy").count() == 0,
          "a consent row asks for the country's system, with the option that the country cannot be identified")
    page.select_option("#ng-pn-jpXrows-0-noCountry", "Yes")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-jpXrows-0-system").count() == 0 and page.locator("#ng-pn-jpXrows-0-country").count() == 0 and page.locator("#ng-pn-jpXrows-0-noCountryWhy").count() == 1,
          "country not identifiable: the reason replaces the country and its system (Rules Article 17(3))")
    view = page.inner_text("#ng-panel-pn .ng-view")
    check("Purposes of use" in view and "Joint use (Article 27(5)(iii))" in view and "Special care-required personal information" in view, "Japan alone: the APPI leads the output")
    page.check("#ng-pn-regimes-0")
    page.wait_for_timeout(250)
    check(page.locator("#ng-pn-acts-0-basis").count() == 1 and page.locator("#ng-pn-acts-0-jpSens").count() == 1 and page.locator("#ng-pn-joint").count() == 1
          and page.locator("#ng-pn-admLogic").count() == 1, "GDPR and Japan: both sets of questions")
    check("Additional information for people in Japan" in page.inner_text("#ng-panel-pn .ng-view"), "GDPR and Japan: the Japan section in the output")
    page.click("#ng-panel-pn [data-act=clear]")

    # ---- tabs and hash
'''
rep("    # ---- tabs and hash\n", ui)
assert all(ord(c) < 128 for c in t)
open(p, "w").write(t)
print("test_ng.py: Japan added")
