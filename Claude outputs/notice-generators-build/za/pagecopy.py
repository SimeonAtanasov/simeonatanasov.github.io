"""Page copy for Phase 6g (South Africa). Usage: python3 pagecopy.py <src html> <number of review findings>"""
import sys
p, n = sys.argv[1], sys.argv[2]
t = open(p, encoding="utf-8").read()
def R(old, new, cnt=1):
    global t
    assert t.count(old) == cnt, (t.count(old), old[:80])
    t = t.replace(old, new)
R("Australia's Privacy Act, the California CCPA", "Australia's Privacy Act, South Africa's POPIA, the California CCPA", 5)
R("Australia's Privacy Act 1988, the California Consumer",
  "Australia's Privacy Act 1988, South Africa's Protection of Personal Information Act, the California Consumer")
R("automated decisions (APP 1.7 to 1.9); in California,",
  "automated decisions (APP 1.7 to 1.9); in South Africa, the notification under section 18 of POPIA, with the right to object (regulation 2.4 of its Regulations); in California,")
R("the Spam Act and Do Not Call rules are left to the checklist. Other jurisdictions",
  "the Spam Act and Do Not Call rules are left to the checklist. For South Africa, POPIA and its Regulations (2018, as amended in 2025) as in force on 13 November 2026 are modelled for private bodies; public bodies get a warning, and the PAIA manual, breach notification and consent to electronic direct marketing (Form 4) are left to the checklist. Other jurisdictions")
R("(Chapter 1 updated 30 September 2026).</li>",
  "(Chapter 1 updated 30 September 2026).</li>\n"
  "\t\t\t\t\t\t\t\t\t\t<li>South Africa's <a href=\"https://www.gov.za/sites/default/files/gcis_document/201409/3706726-11act4of2013popi.pdf\" rel=\"noopener noreferrer\" target=\"_blank\">Protection of Personal Information Act 4 of 2013</a> (Government Gazette 37067), with the <a href=\"https://inforegulator.org.za/wp-content/uploads/2025/04/POPIA-2021-Regulations-FINAL-21-Jan-2025.pdf\" rel=\"noopener noreferrer\" target=\"_blank\">Regulations relating to the Protection of Personal Information</a> (2018, as amended with effect from 17 April 2025) and the Information Regulator's guidance notes on information officers, direct marketing and children.</li>")
R("and all 20 findings of a twelfth review of the Australian rules, were applied",
  "all 20 findings of a twelfth review of the Australian rules, and all " + n + " findings of a thirteenth review of the South African rules, were applied")
assert chr(0x2014) not in t
open(p, "w", encoding="utf-8").write(t)
print("ok")
